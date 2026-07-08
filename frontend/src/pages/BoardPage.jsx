const BoardPage = () => {
  return (
    <div className="p-8 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      <div className="flex-1 flex gap-4 overflow-x-auto">
        {/* Kanban Columns will go here */}
        <div className="bg-gray-100 rounded-lg w-80 p-4 shrink-0">
          <h2 className="font-semibold mb-4">To Do</h2>
        </div>
        <div className="bg-gray-100 rounded-lg w-80 p-4 shrink-0">
          <h2 className="font-semibold mb-4">In Progress</h2>
        </div>
        <div className="bg-gray-100 rounded-lg w-80 p-4 shrink-0">
          <h2 className="font-semibold mb-4">Done</h2>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
