import { useParams } from 'react-router-dom';

const ActivityDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activity Details</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-600 mb-4">Activity ID: {id}</p>
        {/* CommentList and EvidenceLinkInput will go here */}
      </div>
    </div>
  );
};

export default ActivityDetailPage;
