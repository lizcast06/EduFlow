const StatusBadge = ({ status }) => {
  const colors = {
    'To Do': 'bg-gray-200 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Done': 'bg-green-100 text-green-700',
  };
  const colorClass = colors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
