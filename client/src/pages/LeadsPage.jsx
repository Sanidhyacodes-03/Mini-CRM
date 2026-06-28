import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LeadForm from '../components/LeadForm';
import { useToast } from '../components/Toast';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();

  const fetchLeads = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (sourceFilter !== 'all') params.source = sourceFilter;

      const response = await leadsAPI.getAll(params);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      showToast('Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchLeads, 300);
    return () => clearTimeout(debounce);
  }, [fetchLeads]);

  const handleCreate = async (formData) => {
    try {
      await leadsAPI.create(formData);
      showToast('Lead created successfully!');
      setShowForm(false);
      fetchLeads();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create lead', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await leadsAPI.update(editingLead._id, formData);
      showToast('Lead updated successfully!');
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update lead', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await leadsAPI.delete(id);
      showToast('Lead deleted successfully!');
      fetchLeads();
    } catch (error) {
      showToast('Failed to delete lead', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadsAPI.update(id, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
      fetchLeads();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <ToastContainer />
      
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">{leads.length} total leads in your pipeline</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <HiOutlinePlus className="btn-icon" />
          Add Lead
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-input-wrapper">
            <HiOutlineSearch className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-leads"
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            id="filter-status"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <select
            className="filter-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            id="filter-source"
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social">Social</option>
            <option value="advertisement">Advertisement</option>
            <option value="cold-call">Cold Call</option>
            <option value="other">Other</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <h3 className="empty-state-title">No Leads Found</h3>
            <p className="empty-state-text">
              {search || statusFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Add your first lead to get started.'}
            </p>
            {!search && statusFilter === 'all' && sourceFilter === 'all' && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <HiOutlinePlus className="btn-icon" />
                Add First Lead
              </button>
            )}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id}>
                  <td>
                    <span className="lead-name">{lead.name}</span>
                    {lead.phone && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{lead.phone}</div>}
                  </td>
                  <td><span className="lead-email">{lead.email}</span></td>
                  <td><span className="source-badge">{lead.source}</span></td>
                  <td>
                    <select
                      className="filter-select"
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ padding: '4px 28px 4px 8px', fontSize: '12px' }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(lead.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action-btn"
                        onClick={() => navigate(`/leads/${lead._id}`)}
                        title="View Details"
                      >
                        <HiOutlineEye />
                      </button>
                      <button
                        className="table-action-btn"
                        onClick={() => setEditingLead(lead)}
                        title="Edit Lead"
                      >
                        <HiOutlinePencil />
                      </button>
                      <button
                        className="table-action-btn delete"
                        onClick={() => handleDelete(lead._id, lead.name)}
                        title="Delete Lead"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Lead Modal */}
      {showForm && (
        <LeadForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <LeadForm lead={editingLead} onSubmit={handleUpdate} onClose={() => setEditingLead(null)} />
      )}
    </div>
  );
};

export default LeadsPage;
