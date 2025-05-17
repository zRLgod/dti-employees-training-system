import { useState, useEffect } from "react";
import InputField from "../Layouts/InputField";
import { update_user } from "../../endpoints/api";
import ConfirmationModal from "./ConfirmationModal";

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border rounded-lg"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    email: "",
    contact: "",
    password: "",
    user_role: "employee",
    department: "",
    specialization: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        email: user.email || "",
        contact: user.contact || "",
        password: "",
        user_role: user.user_role || "employee",
        department: user.department || "",
        specialization: user.specialization || "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!user || !user.id) {
      alert("User ID is missing. Cannot update user.");
      setIsConfirmOpen(false);
      return;
    }

    try {
      const response = await update_user(user.id, formData);

      onSave({ ...user, ...formData });
      setIsConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error(error);
      setIsConfirmOpen(false);
      if (error.response && error.response.data) {
        alert(`Failed to update user: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Failed to update user. Please try again.");
      }
    }
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      username: "",
      email: "",
      contact: "",
      password: "",
      user_role: "employee",
      department: "",
      specialization: "",
    });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-5 shadow-2xl overflow-auto z-50" onMouseDown={onClose}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl" onMouseDown={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="hover:bg-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer"
              aria-label="Close Modal"
            >
              &#x2715;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                autoFocus
                required
              />

              <InputField
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />

              <InputField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />

              <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputField
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />

              <InputField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <SelectField
                label="Role"
                name="user_role"
                value={formData.user_role}
                onChange={handleChange}
                options={[
                  { value: "employee", label: "Employee" },
                  { value: "supervisor", label: "Supervisor" },
                  { value: "admin", label: "HR" },
                ]}
                required
              />

              <SelectField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={[
                  { value: "Information Technology", label: "IT" },
                  { value: "Human Resource", label: "Human Resource" },
                  { value: "Finance", label: "Finance" },
                ]}
                required />

              <SelectField
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                options={[
                  { value: "technical", label: "Technical" },
                  { value: "financial", label: "Financial" },
                  { value: "supervisorial", label: "Supervisorial" },
                  { value: "human Resource", label: "Human Resource" },
                  { value: "administrative", label: "Administrative" },
                ]}
                required />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
        message="Are you sure you want to save the changes to this user?"
        title="Confirm Save"
      />
    </>
  );
}
