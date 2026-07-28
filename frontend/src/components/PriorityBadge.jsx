const PriorityBadge = ({ priority }) => {
  const colors = {
    'Baja': 'bg-green-100 text-green-700',
    'Media': 'bg-yellow-100 text-yellow-700',
    'Alta': 'bg-red-100 text-red-700',
  };
  const colorClass = colors[priority] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
