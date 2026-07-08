import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome to EduFlow!</p>
      <nav className="flex gap-4">
        <Link to="/board" className="text-blue-600 hover:underline">Go to Board</Link>
        <Link to="/users" className="text-blue-600 hover:underline">Manage Users</Link>
      </nav>
    </div>
  );
};

export default DashboardPage;
