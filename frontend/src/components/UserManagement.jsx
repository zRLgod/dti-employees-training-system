import { useState, useEffect } from "react";
import TableTh from "./Layouts/TableTh";
import AddUserModal from "./Modals/AddUserModal";
import EditUserModal from "./Modals/EditUserModal";
import { list_users, create_user, update_user } from "../endpoints/api";
import toast from 'react-hot-toast';
import { PencilIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await list_users();
        setUsers(response.users);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getMiddleInitial = (middleName) => {
    if (!middleName) return "";
    return `${middleName.charAt(0).toUpperCase()}.`;
  };

  const handleSaveUser = async (newUser) => {
    try {
      const response = await create_user(newUser);
      if (response && response.success && response.user) {
        setUsers([...users, response.user]);
        setIsModalOpen(false);
        toast.success("User created successfully!", { duration: 2000 });
      } else {
        console.error("Invalid user object returned:", response);
        toast.error("Failed to create user. Please try again.", { duration: 2000 });
      }
    } catch (error) {
      toast.error("Failed to create user.", { duration: 3000 });
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const response = await update_user(updatedUser.id, updatedUser);
      if (response && response.id) {
        setUsers(users.map((user) => (user.id === updatedUser.id ? response : user)));
        setIsEditModalOpen(false);
        toast.success("User updated successfully!", { duration: 2000 });
      } else {
        toast.error("Failed to update user. Please try again.", { duration: 2000 });
      }
    } catch (error) {
      toast.error("Failed to update user.", { duration: 3000 });
    }
  };

  const toggleUserStatus = async (user) => {
    const newStatus = user.user_status === "active" ? "deactivated" : "active";
    const updatedUser = { ...user, user_status: newStatus };

    try {
      const response = await update_user(user.id, updatedUser);
      if (response && response.id) {
        setUsers(users.map((u) => (u.id === user.id ? response : u)));
        toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"} successfully!`);
      } else {
        toast.error("Failed to update user status.");
      }
    } catch (error) {
      toast.error("Error occurred.");
    }
  };

  const usersList = users.filter((user) =>
    (user?.id?.toString() ?? "").includes(searchQuery) ||
    (user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (user?.user_role?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  if (loading) return <div className="p-5 text-lg">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <main className="flex-1 overflow-auto p-1">
      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-3xl">User Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md mr-5 hover:bg-blue-600 transition cursor-pointer">
            Add User
          </button>
        </div>
        <AddUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      </div>

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        onSave={handleEditUser}
      />

      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-2xl">LIST OF USERS</h1>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-200 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <TableTh label="ID" />
              <TableTh label="Name" />
              <TableTh label="Email" />
              <TableTh label="Role" />
              <TableTh label="Status" />
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
{usersList.length > 0 ? (
  usersList.map((user) => {
    const normalizedStatus = user.user_status?.toLowerCase().trim();
    return (
      <tr key={user.id}>
        <td className="border border-gray-300 px-4 py-2">{user.id}</td>
        <td className="border border-gray-300 px-4 py-2">
          {user.first_name} {getMiddleInitial(user.middle_name)} {user.last_name}
        </td>
        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
        <td className="border border-gray-300 px-4 py-2">{capitalize(user.user_role)}</td>
        <td className="border border-gray-300 px-4 py-2">{capitalize(user.user_status)}</td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => {
                setEditingUser(user);
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition cursor-pointer">
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => toggleUserStatus(user)}
              className={`flex items-center gap-1 px-3 py-1 rounded text-white transition cursor-pointer ${
                normalizedStatus === 'active'
                  ? 'bg-red-500 hover:bg-red-900'
                  : 'bg-green-400 hover:bg-green-700'}`}>
              {normalizedStatus === 'active' ? (
                <>
                  <XCircleIcon className="w-4 h-4" />
                 Deactivate</>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Activate</>
              )}
            </button>
          </div>
        </td>
      </tr>);})) : (
            <tr>
              <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                No Record Found!
              </td>
            </tr> )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
