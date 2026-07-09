import { useState } from 'react';

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input 
        type="text" 
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task Title"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Save</button>
    </form>
  );
};

export default TaskForm;
