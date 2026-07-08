const KanbanColumn = ({ title, children }) => {
  return (
    <div className="bg-gray-100 rounded-lg w-80 p-4 shrink-0 flex flex-col gap-3">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default KanbanColumn;
