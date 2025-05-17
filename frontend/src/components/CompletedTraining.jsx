import React, { useEffect, useState } from "react";
import TableTh from "./Layouts/TableTh";
import { getEnrolledTrainingsForUser, getUserLearningActionPlans } from "../endpoints/api";
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from "react-router-dom";

export default function CompletedTraining() {
  const [completedTrainings, setCompletedTrainings] = useState([]);
  const [userLaps, setUserLaps] = useState([]);
  const [submittedTrainingIds, setSubmittedTrainingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const enrolledTrainings = await getEnrolledTrainingsForUser('completed');
      const lapsResponse = await getUserLearningActionPlans();
      let laps = lapsResponse.learning_action_plans || lapsResponse.learning_action_plan || [];
      setCompletedTrainings(enrolledTrainings);
      setUserLaps(laps);
      setSubmittedTrainingIds(new Set(laps.map(lap => Number(lap.lap_training))));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.refresh) {
      fetchData();
      // Clear the refresh flag so it doesn't refetch again on next render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCreate = (trainingId) => {
    const training = completedTrainings.find(
      enrolled => enrolled.training?.training_ID === trainingId
    )?.training;
    navigate("/employeeLAP", { state: { training } });
  };

  const isLapSubmitted = (trainingId) => {
    const trainingIdNum = Number(trainingId);
    return submittedTrainingIds.has(trainingIdNum);
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-auto p-1">
        <p>Loading completed trainings...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-1">
      <div className="bg-white p-5 rounded shadow-md mb-4">
        <h1 className="font-semibold text-3xl">Completed Training</h1>
      </div>

      <div className="bg-white p-5 rounded shadow-md mb-4">
        <h2 className="font-semibold text-2xl mb-4">List of Completed Trainings</h2>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-100">
              <TableTh label="ID" />
              <TableTh label="Training Title" />
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {completedTrainings.length > 0 ? (
              completedTrainings.map((enrolled) => {
                const training = enrolled.training;
                const trainingId = training?.training_ID ?? "N/A";
                const trainingTitle = training?.training_title ?? "N/A";
                const lapSubmitted = isLapSubmitted(trainingId);

                return (
                  <tr key={enrolled.id} className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">{trainingId}</td>
                    <td className="border border-gray-300 px-4 py-2">{trainingTitle}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleCreate(trainingId)}
                        disabled={lapSubmitted}
                        className={`text-white font-semibold py-1 px-3 rounded inline-flex items-center cursor-pointer ${
                          lapSubmitted
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-500 hover:bg-teal-600"
                        }`}
                      >
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        <span>{lapSubmitted ? "Created" : "Create"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="text-center border border-gray-300 px-4 py-2">
                  No completed trainings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
