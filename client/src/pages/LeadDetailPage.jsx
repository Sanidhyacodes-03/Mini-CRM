import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LeadForm from '../components/LeadForm';
import { useToast } from '../components/Toast';
import { HiOutlineArrowLeft, HiOutlinePencil, HiOutlineTrash, HiOutlinePaperAirplane } from 'react-icons/hi';

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await leadsAPI.getById(id);
      setLead(response.data);
    } catch (error) {
      console.error('Error fetching lead:', error);
      showToast('Failed to fetch lead details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await leadsAPI.update(id, formData);
      showToast('Lead updated successfully!');
      setShowEditForm(false);
      fetchLead();
    } catch (error) {
      showToast('Failed to update lead', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${lead.name}"?`)) return;
    
    try {
      await leadsAPI.delete(id);
      showToast('Lead deleted successfully!');
      navigate('/leads');
    } catch (error) {
      showToast('Failed to delete lead', 'error');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    
    setAddingNote(true);
    try {
      await leadsAPI.addNote(id, { text: noteText });
      setNoteText('');
      showToast('Note added successfully!');
      fetchLead();
    } catch (error) {
      showToast('Failed to add note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    
    try {
      await leadsAPI.deleteNote(id, noteId);
      showToast('Note deleted');
      fetchLead();
    } catch (error) {
      showToast('Failed to delete note', 'error');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3 className="empty-state-title">Lead Not Found</h3>
        <p className="empty-state-text">This lead may have been deleted.</p>
        <button className="btn btn-primary" onClick={() => navigate('/leads')}>
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />

      {/* Back Button */}
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate('/leads')}
        style={{ marginBottom: '24px' }}
      >
        <HiOutlineArrowLeft /> Back to Leads
      </button>

      {/* Header */}
      <div className="lead-detail-header">
        <div className="lead-detail-info">
          <div className="lead-detail-avatar">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="lead-detail-name">{lead.name}</h1>
            <p className="lead-detail-email">{lead.email}</p>
          </div>
        </div>
        <div className="lead-detail-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setShowEditForm(true)}>
            <HiOutlinePencil /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            <HiOutlineTrash /> Delete
          </button>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="lead-detail-grid">
        <div className="detail-card">
          <div className="detail-card-label">Status</div>
          <div className="detail-card-value"><StatusBadge status={lead.status} /></div>
        </div>
        <div className="detail-card">
          <div className="detail-card-label">Source</div>
          <div className="detail-card-value">{lead.source}</div>
        </div>
        <div className="detail-card">
          <div className="detail-card-label">Phone</div>
          <div className="detail-card-value">{lead.phone || 'Not provided'}</div>
        </div>
        <div className="detail-card">
          <div className="detail-card-label">Added On</div>
          <div className="detail-card-value" style={{ fontSize: '14px' }}>{formatDate(lead.createdAt)}</div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="notes-section">
        <div className="notes-header">
          <h2 className="notes-title">Follow-up Notes</h2>
          <span className="notes-count">{lead.notes?.length || 0} notes</span>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="note-input-row">
          <input
            className="form-input"
            type="text"
            placeholder="Add a follow-up note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            id="add-note-input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={addingNote || !noteText.trim()}
          >
            <HiOutlinePaperAirplane />
            {addingNote ? 'Adding...' : 'Add'}
          </button>
        </form>

        {/* Notes List */}
        {lead.notes && lead.notes.length > 0 ? (
          [...lead.notes].reverse().map(note => (
            <div key={note._id} className="note-item">
              <div className="note-dot"></div>
              <div className="note-content">
                <p className="note-text">{note.text}</p>
                <span className="note-date">{formatDate(note.createdAt)}</span>
              </div>
              <button
                className="note-delete-btn"
                onClick={() => handleDeleteNote(note._id)}
                title="Delete note"
              >
                <HiOutlineTrash />
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>
            No notes yet. Add your first follow-up note above.
          </p>
        )}
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <LeadForm lead={lead} onSubmit={handleUpdate} onClose={() => setShowEditForm(false)} />
      )}
    </div>
  );
};

export default LeadDetailPage;
