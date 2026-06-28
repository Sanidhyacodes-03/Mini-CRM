const StatusBadge = ({ status }) => {
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
