import { useState } from 'react';
import { Send } from 'lucide-react';

const CommentList = ({ comments = [], onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({ contenido: newComment });
      setNewComment('');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-3">Comentarios</h3>
      <div className="flex flex-col gap-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
        {comments.length === 0 ? <p className="text-gray-500 text-sm">No hay comentarios aún.</p> : null}
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
            <div className="font-semibold text-gray-800 mb-1">{c.autor?.nombre || 'Usuario'}</div>
            <div className="text-gray-600">{c.contenido}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          type="text" 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..." 
          className="border border-gray-200 p-2 rounded-lg text-sm flex-1 focus:outline-none focus:border-indigo-500"
        />
        <button 
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center w-10 h-10"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default CommentList;
