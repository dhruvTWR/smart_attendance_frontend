export default function Header({ user, onLogout }) {
  return (
    <header className="w-full bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">AttendEasy</h1>

      <nav className="space-x-6">
        {user.role === "teacher" ? (
          <>
            <a href="/teacher-dashboard" className="hover:text-gray-400">D ashboard</a>
            <a href="/teacher-courses" className="hover:text-gray-400">Courses</a>
          </>
        ) : (
          <>
            <a href="/admin-dashboard" className="hover:text-gray-400">Dashboard</a>
            <a href="/admin-users" className="hover:text-gray-400">Users</a>
          </>
        )}
        <button
          onClick={onLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
