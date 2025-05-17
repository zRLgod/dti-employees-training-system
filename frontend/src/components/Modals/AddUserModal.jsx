import { useState } from "react";
import InputField from "../Layouts/InputField";
import ConfirmationModal from "./ConfirmationModal";

const AddUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    user_role: "employee",
    email: "",
    contact: "",
    department: "Information Technology",
    password: "",
    specialization: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    const { username, first_name, last_name, middle_name, user_role, email, contact, department, password, specialization } = formData;

    const mappedData = {
      username,
      first_name,
      last_name,
      middle_name,
      user_role,
      email,
      contact,
      department,
      password,
      specialization,
    };

    onSave(mappedData);
    setFormData({
      last_name: "",
      first_name: "",
      middle_name: "",
      user_role: "employee",
      email: "",
      contact: "",
      department: "Information Technology",
      password: "",
      specialization: "",
      username: "",
    });
    setIsConfirmOpen(false);
    onClose();
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-5 shadow-2xl overflow-auto z-50"
      onMouseDown={onClose}>

        <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg"
          onMouseDown={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
          <button
              onClick={onClose}
              className="hover:bg-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer "
              aria-label="Close Modal">&#x2715;</button>
        </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required autoFocus />

              <InputField 
                label="First Name" 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange} 
                required />

              <InputField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required />

              <InputField
                label="Middle Name"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}/>

              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required />

              <InputField
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}/> 

              <SelectField
                label="Role"
                name="user_role"
                value={formData.user_role}
                onChange={handleChange}
                options={[
                  { value: "employee", label: "Employee" },
                  { value: "supervisor", label: "Supervisor" },
                  { value: "admin", label: "Admin" },]}
                required/>  

              <SelectField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={[
                  { value: "Information Technology", label: "IT" },
                  { value: "Human Resource", label: "Human Resource" },
                  { value: "Finance", label: "Finance" },]}
                required/>  

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

              <InputField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required /> 
            </div>

            <div className="flex justify-end space-x-2">
              <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition cursor-pointer">
                  Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
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
        message="Are you sure you want to save this new user?"
        title="Confirm Save"
      />
    </>
  );
};

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
export default AddUserModal;
