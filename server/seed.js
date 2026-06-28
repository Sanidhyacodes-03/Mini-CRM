const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./models/Lead');

dotenv.config();

const sampleLeads = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    source: 'website',
    status: 'new',
    notes: [{ text: 'Submitted contact form, interested in web development services.' }],
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    phone: '+91 87654 32109',
    source: 'referral',
    status: 'contacted',
    notes: [
      { text: 'Referred by Amit from TechCorp. Needs a mobile app.' },
      { text: 'Called and discussed requirements. Follow up next week.' },
    ],
  },
  {
    name: 'John Williams',
    email: 'john.w@startup.io',
    phone: '+1 555-0123',
    source: 'social',
    status: 'converted',
    notes: [
      { text: 'Found us via LinkedIn post.' },
      { text: 'Signed contract for branding project. ₹50,000 deal.' },
    ],
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya@freelance.com',
    phone: '+91 76543 21098',
    source: 'advertisement',
    status: 'new',
    notes: [{ text: 'Clicked on Google Ads. Interested in SEO services.' }],
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@enterprise.com',
    phone: '+1 555-0456',
    source: 'cold-call',
    status: 'contacted',
    notes: [
      { text: 'Cold called from enterprise list. Showed interest.' },
      { text: 'Sent proposal via email. Waiting for response.' },
    ],
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.r@business.in',
    phone: '+91 65432 10987',
    source: 'website',
    status: 'lost',
    notes: [
      { text: 'Inquired about e-commerce development.' },
      { text: 'Budget mismatch. Decided to go with another vendor.' },
    ],
  },
  {
    name: 'David Kumar',
    email: 'david.k@tech.co',
    phone: '+91 54321 09876',
    source: 'referral',
    status: 'new',
    notes: [{ text: 'Referred by existing client. Needs CRM integration.' }],
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@marketing.com',
    phone: '+1 555-0789',
    source: 'social',
    status: 'contacted',
    notes: [{ text: 'Connected via Twitter DM. Interested in social media management.' }],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing leads
    await Lead.deleteMany({});
    console.log('🗑️  Cleared existing leads');

    // Insert sample leads
    await Lead.insertMany(sampleLeads);
    console.log(`✅ Inserted ${sampleLeads.length} sample leads`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
