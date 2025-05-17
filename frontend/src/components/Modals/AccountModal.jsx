import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from "react";
import InputField from "../Layouts/InputField";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../../context/AuthContext";

const AccountModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    contact: "",
    password: "",
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSavedConfirmOpen, setIsSavedConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        contact: user.contact || "",
        password: "",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, first_name, last_name } = formData;

    if (!email || !first_name || !last_name) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    onSave(formData);
    setIsConfirmOpen(false);
    onClose();
    setIsSavedConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleCloseSavedConfirm = () => {
    setIsSavedConfirmOpen(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center p-4 z-50"
        onMouseDown={onClose}
      >
        <div
          className="bg-white rounded-lg w-full max-w-5xl p-6 shadow-lg"
          onMouseDown={(e) => e.stopPropagation()}
        >
         
          <div className="flex justify-between items-center border-b pb-3 mb-6 px-2">
            <h2 className="text-4xl font-bold">Profile Setting</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black text-xl cursor-pointer"
              aria-label="Close Modal"
            >
              &times;
            </button>
          </div>

          
          <div className="flex gap-8">
            
            <div className="flex-shrink-0 mt-8   ml-2">
              <UserCircleIcon className="w-50 h-50 text-blue-600" />
            </div>

            
            <form className="flex-1 grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputField
                label="First Name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
              />
              <InputField
                label="Middle Name"
                name="middle_name"
                type="text"
                value={formData.middle_name}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
              />
              <InputField
                label="Contact"
                name="contact"
                type="text"
                value={formData.contact}
                onChange={handleChange}
              />

              
              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirm}
        message="Are you sure you want to save your profile changes?"
        title="Confirm Save"
      />

      <ConfirmationModal
        isOpen={isSavedConfirmOpen}
        onClose={handleCloseSavedConfirm}
        onConfirm={handleCloseSavedConfirm}
        message="Your profile changes have been saved successfully."
        title="Save Successful"
      />
    </>
  );
};

export default AccountModal;
