const EvidenceLinkInput = () => {
  return (
    <div className="flex gap-2 mt-2">
      <input 
        type="url" 
        placeholder="https://docs.google.com/..." 
        className="border p-2 rounded text-sm flex-1"
      />
      <button className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300">Add Evidence</button>
    </div>
  );
};

export default EvidenceLinkInput;
