import { useState, useEffect } from "react";
import InputField from "../Layouts/InputField";
import ConfirmationModal from "./ConfirmationModal";
import { update_user } from "../../endpoints/api";
import toast from "react-hot-toast";

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

export default function EditEmployeeModal({ isOpen, onClose, employee, onSave }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    email: "",
    contact: "",
    department: "",
    specialization: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || "",
        middle_name: employee.middle_name || "",
        last_name: employee.last_name || "",
        username: employee.username || "",
        email: employee.email || "",
        contact: employee.contact || "",
        department: employee.department || "",
        specialization: employee.specialization || "",
      });
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!employee || !employee.id) {
      alert("Employee ID is missing. Cannot update employee.");
      setIsConfirmOpen(false);
      return;
    }

    try {
      const response = await update_user(employee.id, formData);

      onSave({ ...employee, ...formData });
      setIsConfirmOpen(false);
      onClose();
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error(error);
      setIsConfirmOpen(false);
      if (error.response && error.response.data) {
        toast.error(`Failed to update employee: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error("Failed to update employee. Please try again.");
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
      contact: "",
      department: "",
      specialization: "",
    });
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-5 shadow-2xl overflow-auto z-50" onMouseDown={onClose}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl" onMouseDown={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-4">Edit Employee</h2>
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

              {/* Username and Email fields are not shown in UI but included in formData for API */}

              <InputField
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
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
                required
              />

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
                required
              />
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
        message="Are you sure you want to save the changes to this employee?"
        title="Confirm Save"
      />
    </>
  );
}
