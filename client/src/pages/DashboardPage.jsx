import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineTrendingUp, HiOutlineCalendar } from 'react-icons/hi';

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h3 className="empty-state-title">No Data Yet</h3>
        <p className="empty-state-text">Add some leads to see your dashboard analytics.</p>
        <button className="btn btn-primary" onClick={() => navigate('/leads')}>
          Go to Leads
        </button>
      </div>
    );
  }

  const { totalLeads, newLeadsThisWeek, conversionRate, statusBreakdown, recentLeads } = analytics;
  const maxStatus = Math.max(statusBreakdown.new, statusBreakdown.contacted, statusBreakdown.converted, statusBreakdown.lost, 1);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your lead management pipeline</p>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card total">
          <div className="analytics-card-icon">
            <HiOutlineUsers />
          </div>
          <div className="analytics-card-value">{totalLeads}</div>
          <div className="analytics-card-label">Total Leads</div>
        </div>

        <div className="analytics-card new">
          <div className="analytics-card-icon">
            <HiOutlineUserAdd />
          </div>
          <div className="analytics-card-value">{statusBreakdown.new}</div>
          <div className="analytics-card-label">New Leads</div>
        </div>

        <div className="analytics-card conversion">
          <div className="analytics-card-icon">
            <HiOutlineTrendingUp />
          </div>
          <div className="analytics-card-value">{conversionRate}%</div>
          <div className="analytics-card-label">Conversion Rate</div>
        </div>

        <div className="analytics-card week">
          <div className="analytics-card-icon">
            <HiOutlineCalendar />
          </div>
          <div className="analytics-card-value">{newLeadsThisWeek}</div>
          <div className="analytics-card-label">This Week</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Status Breakdown */}
        <div className="status-breakdown">
          <h3 className="status-breakdown-title">Lead Status Breakdown</h3>
          {['new', 'contacted', 'converted', 'lost'].map(status => (
            <div key={status} className="status-bar-row">
              <span className="status-bar-label">{status}</span>
              <div className="status-bar-track">
                <div
                  className={`status-bar-fill ${status}`}
                  style={{ width: `${(statusBreakdown[status] / maxStatus) * 100}%` }}
                ></div>
              </div>
              <span className="status-bar-count">{statusBreakdown[status]}</span>
            </div>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="recent-leads">
          <h3 className="recent-leads-title">Recent Leads</h3>
          {recentLeads && recentLeads.length > 0 ? (
            recentLeads.map(lead => (
              <div
                key={lead._id}
                className="recent-lead-item"
                onClick={() => navigate(`/leads/${lead._id}`)}
              >
                <div className="recent-lead-avatar">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="recent-lead-info">
                  <div className="recent-lead-name">{lead.name}</div>
                  <div className="recent-lead-date">{formatDate(lead.createdAt)}</div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No leads yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
