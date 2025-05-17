import { useEffect, useState } from "react";
import TableTh from "./Layouts/TableTh";
import AddTrainingModal from "./Modals/AddTrainingModal";
import AssignUsersModal from "./Modals/AssignUsersModal";
import ViewAssignedUsersModal from "./Modals/ViewAssignedUsersModal";
import EditTrainingModal from "./Modals/EditTrainingModal";
import { ViewTraining, create_training, getAssignedUsers, getEnrolledUsersForTraining, update_training } from "../endpoints/api";
import toast from 'react-hot-toast';
import { UserPlusIcon, EyeIcon, PencilIcon, } from '@heroicons/react/24/solid';
import { useAuth } from "../context/AuthContext";
import { useTrainingRefresh } from "../context/TrainingRefreshContext";

export default function TrainingManagement() {
  const { user } = useAuth();
  const { triggerRefresh } = useTrainingRefresh();
  const [searchQuery, setSearchQuery] = useState("");
  const [trainings, setTrainings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrainingForEdit, setSelectedTrainingForEdit] = useState(null);

  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchTraining = async () => {
      const training = await ViewTraining()
      setTrainings(training)
    }
    fetchTraining();
  }, [])

  const handleSaveTraining = async (newTraining) => {
    const response = await create_training(newTraining);

    if (response && response.success && response.training) {
      setTrainings([...trainings, response.training]);
      setIsModalOpen(false);
      toast.success("Training created successfully!", { duration: 2000 });
    } else {
      toast.error("Failed to create training. Please try again.", { duration: 2000 });
    }
  };

  const openAssignModal = (training) => {
    if (training.training_status === "completed" || training.training_status === "ongoing") {
      toast.error("You cannot assign to a completed or ongoing training.");
      return;
    }
    setSelectedTraining(training);
    setIsAssignModalOpen(true);
  };

  const openViewModal = async (training) => {
    try {
      const response = await getEnrolledUsersForTraining(training.training_ID);
      if (response.success) {
        setEnrolledUsers(response.enrolled_users);
        setSelectedTraining(training);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to fetch enrolled employees.");
      }
    } catch (error) {
      toast.error("Error fetching enrolled employees.");
    }
  };

  const closeAssignModal = () => {
    setSelectedTraining(null);
    setIsAssignModalOpen(false);
  };

  const handleAssignSuccess = () => {
    toast.success("Employees assigned successfully");
    closeAssignModal();
    triggerRefresh();
  };

  const openEditModal = (training) => {
    setSelectedTrainingForEdit(training);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedTraining = async (editedTraining) => {
    try {
      const response = await update_training(editedTraining.training_ID, editedTraining);
      if (response && response.success && response.training) {
        setTrainings((prevTrainings) =>
          prevTrainings.map((training) =>
            training.training_ID === response.training.training_ID ? response.training : training
          )
        );
        setIsEditModalOpen(false);
        setSelectedTrainingForEdit(null);
        toast.success("Training updated successfully!", { duration: 2000 });
      } else {
        toast.error("Failed to update training. Please try again.", { duration: 2000 });
      }
    } catch (error) {
      toast.error("Error updating training. Please try again.", { duration: 2000 });
    }
  };

  const trainingList = trainings
    .filter((training) => training && training.training_ID !== undefined)
    .filter((training) => {
      const query = searchQuery.toLowerCase();
      return (
        training.training_ID.toString().includes(query) ||
        training.training_title?.toLowerCase().includes(query) ||
        training.training_category?.toLowerCase().includes(query) ||
        training.training_status?.toLowerCase().includes(query) ||
        training.training_date?.toLowerCase().includes(query) || 
        training.training_type?.toLowerCase().includes(query)
      );
    });

  return (
    <main className="flex-1 overflow-auto p-1">
      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-3xl">Training Management</h1>
          {user?.user_role?.toLowerCase() !== "supervisor" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md mr-5 hover:bg-blue-600 transition cursor-pointer"
            >
              Add Training
            </button>
          )}
        </div>
      </div>

      <AddTrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTraining}
      />

      <AssignUsersModal
        isOpen={isAssignModalOpen}
        onClose={closeAssignModal}
        training={selectedTraining}
        onAssignSuccess={handleAssignSuccess}
      />

      <ViewAssignedUsersModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTraining(null);
          setEnrolledUsers([]);
        }}
        users={enrolledUsers}
      />

      <EditTrainingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTrainingForEdit(null);
        }}
        training={selectedTrainingForEdit}
        onSave={handleSaveEditedTraining}
      />

      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-2xl">LIST OF TRAININGS</h1>
          <input
            type="text"
            placeholder="Search trainings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-200 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-100">
              <TableTh label="ID" />
              <TableTh label="Training Title" />
              <TableTh label="Schedule" />
              <TableTh label="Category" />
              <TableTh label="Training Type" />
              <TableTh label="Status" />
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainingList.length > 0 ? (
              trainingList.map((training) => (
                <tr key={training.training_ID}>
                  <td className="border border-gray-300 px-4 py-2">{training.training_ID}</td>
                  <td className="border border-gray-300 px-4 py-2">{training.training_title}</td>
                  <td className="border border-gray-300 px-4 py-2">{training.training_date}</td>
                  <td className="border border-gray-300 px-4 py-2">{capitalize(training.training_category)}</td>
                  <td className="border border-gray-300 px-4 py-2">{capitalize(training.training_type)}</td>
                  <td className="border border-gray-300 px-4 py-2">{capitalize(training.training_status)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => openAssignModal(training)}
                        className="flex items-center gap-1 bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition cursor-pointer"
                      >
                        <UserPlusIcon className="w-4 h-4" />
                        Assign
                      </button>

                      <button
                        onClick={() => openViewModal(training)}
                        className="flex items-center gap-1 bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 transition cursor-pointer"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </button>

                      {user?.user_role?.toLowerCase() !== "supervisor" && (
                        <button
                          onClick={() => openEditModal(training)}
                          className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition cursor-pointer"
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center">No Record Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
