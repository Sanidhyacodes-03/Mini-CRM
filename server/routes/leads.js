const express = require('express');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/leads
// @desc    Get all leads with optional search & filter
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, status, source, sort = '-createdAt' } = req.query;
    
    let query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by source
    if (source && source !== 'all') {
      query.source = source;
    }

    const leads = await Lead.find(query).sort(sort);
    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error fetching leads' });
  }
});

// @route   GET /api/leads/:id
// @desc    Get a single lead by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error fetching lead' });
  }
});

// @route   POST /api/leads
// @desc    Create a new lead
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;

    const lead = new Lead({
      name,
      email,
      phone: phone || '',
      source: source || 'website',
      status: status || 'new',
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error creating lead' });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, source, status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error updating lead' });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error deleting lead' });
  }
});

// @route   POST /api/leads/:id/notes
// @desc    Add a note to a lead
// @access  Private
router.post('/:id/notes', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes.push({ text });
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error adding note' });
  }
});

// @route   DELETE /api/leads/:id/notes/:noteId
// @desc    Delete a note from a lead
// @access  Private
router.delete('/:id/notes/:noteId', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.notes = lead.notes.filter(
      (note) => note._id.toString() !== req.params.noteId
    );
    await lead.save();

    res.json(lead);
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error deleting note' });
  }
});

module.exports = router;
