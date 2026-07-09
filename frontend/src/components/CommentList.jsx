const CommentList = ({ comments = [] }) => {
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>
      <div className="flex flex-col gap-2">
        {comments.length === 0 ? <p className="text-gray-500 text-sm">No comments yet.</p> : null}
        {comments.map((c, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded text-sm">
            <span className="font-medium">{c.author}: </span>
            <span>{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
