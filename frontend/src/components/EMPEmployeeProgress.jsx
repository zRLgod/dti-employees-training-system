import React, { useEffect, useState } from "react";
import TableTh from "./Layouts/TableTh";
import { getProgressForCurrentUser, getEnrolledTrainingsForUser, getUserLearningActionPlans } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

const EMPEmployeeProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [enrolledTrainings, setEnrolledTrainings] = useState([]);
  const [userLaps, setUserLaps] = useState([]);
  const [submittedTrainingIds, setSubmittedTrainingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const progressResponse = await getProgressForCurrentUser();
      const enrolledTrainingsResponse = await getEnrolledTrainingsForUser();
      const userLapsResponse = await getUserLearningActionPlans();

      const progress = progressResponse.progress || progressResponse || [];
      const enrolled = enrolledTrainingsResponse || [];
      let laps = userLapsResponse.learning_action_plans || userLapsResponse.learning_action_plan || [];

      setProgressData(progress);
      setEnrolledTrainings(enrolled);
      setUserLaps(laps);
      setSubmittedTrainingIds(new Set(laps.map(lap => Number(lap.lap_training))));
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-auto p-1">
        <p>Loading training progress...</p>
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
    <main className="flex-1 overflow-auto p-1">
      <div className="bg-white p-5 rounded shadow-md mb-4">
        <h1 className="font-semibold text-3xl">Employee Training Progress</h1>
      </div>

      <div className="bg-white p-5 rounded shadow-md mb-4">
        <h2 className="font-semibold text-2xl mb-4">Training Progress List</h2>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-100">
              <TableTh label="Training ID" />
              <TableTh label="Training Title" />
              <TableTh label="Training Category" />
              <TableTh label="Training Type" />
              <th className="border border-gray-300 px-4 py-2 text-center">Progress Status</th>
            </tr>
          </thead>
          <tbody>
            {progressData.length > 0 ? (
              progressData.map((progress) => {
                return (
                  <tr
                    key={progress.progress_ID ?? Math.random()}
                    className="border border-gray-300"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {progress.progress_training_detail?.training_ID}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {progress.progress_training_detail?.training_title}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {capitalize(progress.progress_training_detail?.training_category)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {capitalize(progress.progress_training_detail?.training_type)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-white font-semibold ${
                        progress.progress_status_display === "Action Plan Approved" || progress.progress_status_display === "Successful"
                          ? "bg-teal-600"
                          : progress.progress_status_display === "Action Plan Rejected" || progress.progress_status_display === "Failed"
                          ? "bg-red-400"
                          : "bg-gray-400"
                      }`}>
                        {progress.progress_status_display}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center border border-gray-300 px-4 py-2">
                  No training progress found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default EMPEmployeeProgress;
