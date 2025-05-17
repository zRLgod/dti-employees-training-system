import React from "react";

export default function ViewAssignedUsersModal({ isOpen, onClose, users }) {
  if (!isOpen) return null;

   const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Enrolled Employees</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
        {users.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Specialization</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {`${user?.user?.first_name || "N/A"} ${user?.user?.middle_name ? user.user.middle_name + " " : ""}${user?.user?.last_name || ""}`.trim()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{capitalize(user?.user?.specialization || "N/A")}</td>
              </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No users assigned to this training.</p>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}