import React, { useEffect, useState } from "react";
import { ViewTraining, getAssignedUsers, getAssignedTrainingsForUser, enrollInTraining, getEnrolledTrainingsForUser } from "../endpoints/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTrainingRefresh } from "../context/TrainingRefreshContext";

const EmployeeTraining = () => {
  const { user } = useAuth();
  const { refreshFlag } = useTrainingRefresh();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledTrainingIds, setEnrolledTrainingIds] = useState(new Set());

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await getAssignedTrainingsForUser();
        const trainings = data.map(assignedTraining => assignedTraining.training);
        const filteredTrainings = trainings.filter(training =>
          training.training_status === "scheduled" || training.training_status === "ongoing"
        );
        setTrainings(filteredTrainings);
      } catch (error) {
        toast.error("Failed to load trainings.");
      }
    };

    const fetchEnrolledTrainings = async () => {
      try {
        const enrolledData = await getEnrolledTrainingsForUser();
        const enrolledIds = new Set(enrolledData.map(enrolled => enrolled.en_training));
        setEnrolledTrainingIds(enrolledIds);
      } catch (error) {
        console.error("Error fetching enrolled trainings:", error);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchTrainings(), fetchEnrolledTrainings()]);
      setLoading(false);
    };

    fetchAll();
  }, [user.id, refreshFlag]);

  const handleEnroll = async (trainingId) => {
    try {
      const response = await enrollInTraining(trainingId);
      if (response.success) {
        toast.success("Successfully enrolled in training!");
        setEnrolledTrainingIds(prev => new Set(prev).add(trainingId));
        // Optionally trigger refresh or update state here if needed
      } else if (response.error && response.error.toLowerCase().includes("already enrolled")) {
        toast.error("You are already enrolled in this training.");
        return; // prevent further execution
      } else {
        toast.error(response.error || "Enrollment failed.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Enrollment failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-auto p-6">
        <p>Loading trainings...</p>
      </main>
    );
  }

  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {trainings.length > 0 ? (
          trainings.map((training) => (
            <div
              key={training.training_ID}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-64"
            >
              <div className="p-6 flex-1 rounded-t bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {training.training_title}
                </h2>
                <p className="text-md text-gray-600 mb-1">{capitalize(training.training_category)}</p>
                <p className="text-md text-gray-600">Schedule: {training.training_date}</p>
              </div>

              <div className="border-t border-gray-200">
                <div className="py-3 px-6">
                  <button
                    onClick={() => handleEnroll(training.training_ID)}
                    disabled={enrolledTrainingIds.has(training.training_ID)}
                    className={`w-full text-white text-sm font-medium py-2 px-4 rounded transition cursor-pointer ${
                      enrolledTrainingIds.has(training.training_ID)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {enrolledTrainingIds.has(training.training_ID) ? 'Enrolled' : 'Enroll'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No assigned trainings available.</p>
        )}
      </div>
    </main>
  );
};

export default EmployeeTraining;
