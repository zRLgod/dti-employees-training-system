import { useState } from "react";
import InputField from "../Layouts/InputField";
import ConfirmationModal from "./ConfirmationModal";

const AddTrainingModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    training_title: "",
    training_date: "",
    training_category: "",
    training_type: "",
    training_venue: "", 
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { training_title, training_date, training_category, training_type, training_venue } = formData;

    if (!training_title || !training_date || !training_category || !training_type || !training_venue) {
      alert("Please fill in all fields.");
      return;
    }

    const mappedData = {
      training_title,
      training_date,
      training_category: training_category.toLowerCase(),
      training_type: training_type.toLowerCase(),
      training_venue,
    };

    setPendingData(mappedData);
    setShowConfirm(true);
  };

  const confirmSave = () => {
    if (pendingData) {
      onSave(pendingData);
      setFormData({
        training_title: "",
        training_date: "",
        training_category: "",
        training_type: "",
        training_venue: "",
      });
      setPendingData(null);
      setShowConfirm(false);
      onClose();
    }
  };

  const cancelConfirm = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-5 shadow-2xl overflow-auto z-50 "
        onMouseDown={onClose}>

        <div
          className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
          onMouseDown={(e) => e.stopPropagation()}>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Add New Training</h2>
            <button
              onClick={onClose}
              className="hover:bg-gray-300 rounded-md px-2 py-1 text-sm cursor-pointer "
              aria-label="Close Modal">&#x2715;</button>
          </div>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Training Title"
              name="training_title"
              type="text"
              value={formData.training_title}
              onChange={handleChange}
              required
              autoFocus/>

            <InputField
              label="Training Venue"
              name="training_venue"
              type="text"
              value={formData.training_venue}
              onChange={handleChange}
              required/>

            <InputField
              label="Training Schedule"
              name="training_date"
              type="date"
              value={formData.training_date}
              onChange={handleChange}
              required/>

            <SelectField
              label="Training Category"
              name="training_category"
              value={formData.training_category}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Category" },
                { value: "mandatory", label: "Mandatory" },
                { value: "optional", label: "Optional" },]}
              required/>

              <SelectField
              label="Training Type"
              name="training_type"
              value={formData.training_type}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Type" },
                { value: "technical", label: "Technical" },
                { value: "human Resource", label: "Human Resource" },
                { value: "supervisorial", label: "Supervisorial" },
                { value: "administrative", label: "Administrative" },
                { value: "financial", label: "Financial" },]}
              required/>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition cursor-pointer">Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer">Save</button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={cancelConfirm}
        onConfirm={confirmSave}
        message="Are you sure you want to add this training?"
        title="Confirm Add Training"
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

export default AddTrainingModal;
