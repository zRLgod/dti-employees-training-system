import { useAuth } from "../../context/AuthContext";
import { UserCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import AccountModal from '../Modals/AccountModal';

export default function Header() {
  const nav = useNavigate();
  const { logout_user, user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout_user();
      nav('/');
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-xl py-2 px-6 flex justify-between items-center z-50 h-20">
        <div className="flex items-center space-x-4">
          <img src="src/assets/dti-logo.png" alt="DTI Logo" className="h-18" />
          <div>
            <p className="text-sm font-bold text-gray-500">DEPARTMENT OF TRADE AND INDUSTRY REGIONAL OFFICE 1</p>
            <div className="border-t border-black w-105 mb-1"></div>
            <h2 className="text-xl font-bold leading-none">EMPLOYEES TRAINING MANAGEMENT SYSTEM</h2>
          </div>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsOpen((prev) => !prev)} className="flex items-center gap-x-3 cursor-pointer">
            <h3>{user?.first_name} {user?.last_name}</h3>
            <UserCircleIcon className="w-10 h-10 text-blue-600 transform transition-transform duration-300 hover:scale-110" />
          </button>

          {isOpen && (
            <div className="absolute px-2 right-0 mt-1 w-48 bg-blue-500 rounded-md shadow-lg overflow-hidden z-20 ">
              <ul className="py-2">
                <li className="flex items-center text-white hover:bg-blue-700 font-semibold px-4 py-2 rounded cursor-pointer">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setAccountModalOpen(true);
                    }}
                    className="flex items-center w-full text-white"
                  >
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    Profile
                  </button>
                </li>
                <li className="flex items-center text-white font-semibold hover:bg-blue-700 px-4 py-2 cursor-pointer rounded" onClick={handleLogout}>
                  <ArrowRightStartOnRectangleIcon className="mr-2 h-5 w-5" />
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onSave={async (data) => {
          try {
            await updateUser(data);
            toast.success("Profile updated successfully!", { duration: 2000 });
            setAccountModalOpen(false);
          } catch (error) {
            toast.error("Failed to update profile. Please try again.", { duration: 3000 });
          }
        }}
      />
    </>
  );
}
