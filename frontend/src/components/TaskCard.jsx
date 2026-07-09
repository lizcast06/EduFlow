const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition">
      <h3 className="font-medium text-sm mb-2">{task?.title || 'Task Title'}</h3>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{task?.assignee || 'Unassigned'}</span>
      </div>
    </div>
  );
};

export default TaskCard;
