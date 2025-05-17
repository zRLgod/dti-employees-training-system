import React, { useEffect, useState } from "react";
import { list_users, assign_training } from "../../endpoints/api";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";

const specializationDisplayMap = {
  "technical": "Technical",
  "financial": "Financial",
  "supervisorial": "Supervisorial",
  "human resource": "HR",
  "administrative": "Administrative",
};

const AssignUsersModal = ({ isOpen, onClose, training, onAssignSuccess }) => {
  const [users, setUsers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecs, setSelectedSpecs] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    } else {
      setUsers([]);
      setSpecializations([]);
      setSelectedSpecs(new Set());
      setShowConfirm(false);
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const data = await list_users();
      if (data && data.success && data.users) {
        setUsers(data.users);
       
        const specs = Array.from(new Set(
          data.users
            .map(user => user.specialization ? user.specialization.trim().toLowerCase() : null)
            .filter(spec => spec && spec !== "one")
        ));
        setSpecializations(specs);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      toast.error("Error loading users");
    }
  };

  const toggleSpecSelection = (spec) => {
    const newSelected = new Set(selectedSpecs);
    if (newSelected.has(spec)) {
      newSelected.delete(spec);
    } else {
      newSelected.add(spec);
    }
    setSelectedSpecs(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedSpecs.size === specializations.length) {
      
      setSelectedSpecs(new Set());
    } else {
      
      setSelectedSpecs(new Set(specializations));
    }
  };

  const handleAssign = async () => {
    if (selectedSpecs.size === 0) {
      toast.error("Please select at least one specialization to assign");
      return;
    }
    setLoading(true);
    try {
      for (const spec of selectedSpecs) {
        
        const usersToAssign = users.filter(user => user.specialization && user.specialization.trim().toLowerCase() === spec && user.user_role === 'employee');
          for (const user of usersToAssign) {
            const assignmentData = {
              at_training: training.training_ID,
              at_employee: user.id,
            };
            await assign_training(assignmentData);
          }
      }
      onAssignSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Training assigned already";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const openConfirmModal = () => {
    if (selectedSpecs.size === 0) {
      toast.error("Please select at least one specialization to assign");
      return;
    }
    setShowConfirm(true);
  };

  if (!isOpen) return null;

  const allSelected = selectedSpecs.size === specializations.length && specializations.length > 0;

return (
  <>
  <div
    className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-5 shadow-2xl z-50"
    onMouseDown={onClose}
  >
    <div
      className="relative bg-white rounded-lg p-7 w-full max-w-lg shadow-lg"
      onMouseDown={(e) => e.stopPropagation()}
    >
      
      <button
        onClick={onClose}
        className="absolute top-7 right-6 text-gray-500 hover:text-gray-700 transition text-xl font-bold cursor-pointer"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold mb-4">
        Assign Users to Training: {training?.training_title}
      </h2>

      <div className="max-h-80 overflow-y-auto mb-4 border border-gray-300 rounded p-2">
        <label className="flex items-center space-x-2 mb-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="form-checkbox"
          />
          <span>Select All</span>
        </label>
        {specializations.length > 0 ? (
          specializations.map((spec) => (
            <label key={spec} className="flex items-center space-x-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSpecs.has(spec)}
                onChange={() => toggleSpecSelection(spec)}
                className="form-checkbox"
              />
              <span>{specializationDisplayMap[spec] || spec}</span>
            </label>
          ))
        ) : (
          <p>No specializations available.</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={openConfirmModal}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
    </div>
  </div>
  <ConfirmationModal
    isOpen={showConfirm}
    onClose={() => setShowConfirm(false)}
    onConfirm={handleAssign}
    message="Are you sure you want to assign the selected users to this training?"
    title="Confirm Assignment"
  />
  </>
);

};

export default AssignUsersModal;
