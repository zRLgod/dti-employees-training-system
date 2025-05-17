import { useState, useEffect } from "react";
import InputField from "../Layouts/InputField";
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

export default function EditTrainingModal({ isOpen, onClose, training, onSave }) {
  const [formData, setFormData] = useState({
    training_ID: "",
    training_title: "",
    training_date: "",
    training_category: "",
    training_type: "",
    training_status: "",
    training_venue: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (training) {
      setFormData({
        training_ID: training.training_ID || "",
        training_title: training.training_title || "",
        training_date: training.training_date || "",
        training_category: training.training_category || "",
        training_type: training.training_type || "",
        training_status: training.training_status || "",
        training_venue: training.training_venue || "",
      });
    }
  }, [training]);

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
    onSave(formData);
    setIsConfirmOpen(false);
    onClose();
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-xl font-semibold mb-4">Edit Training</h2>
            <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Training Title"
              name="training_title"
              type="text"
              value={formData.training_title}
              onChange={handleChange}
              required
              autoFocus
            />
            <InputField
              label="Training Venue"
              name="training_venue"
              type="text"
              value={formData.training_venue}
              onChange={handleChange}
              required
            />
            <InputField
              label="Training Schedule"
              name="training_date"
              type="date"
              value={formData.training_date}
              onChange={handleChange}
              required
            />
            <SelectField
              label="Training Category"
              name="training_category"
              value={formData.training_category}
              onChange={handleChange}
              options={[
                { value: "mandatory", label: "Mandatory" },
                { value: "optional", label: "Optional" },
              ]}
              required
            />
            <SelectField
              label="Training Type"
              name="training_type"
              value={formData.training_type}
              onChange={handleChange}
              options={[
                { value: "technical", label: "Technical" },
                { value: "human Resource", label: "Human Resource" },
                { value: "supervisorial", label: "Supervisorial" },
                { value: "administrative", label: "Administrative" },
                { value: "financial", label: "Financial" },
              ]}
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Confirm Edit"
        message="Are you sure you want to save the changes to this training?"
      />
    </>
  );
}
