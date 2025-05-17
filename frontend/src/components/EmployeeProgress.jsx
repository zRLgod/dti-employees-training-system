import React, { useEffect, useState } from "react";
import TableTh from "./Layouts/TableTh";
import { getAllProgress, update_progress } from "../endpoints/api";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const EmployeeProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProgress();
      const data = response.progress || response || [];
      setProgressData(data);
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
      setError("Failed to load progress data. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (progressId, newStatus) => {
    try {
      await update_progress(progressId, { progress_status : newStatus });
      toast.success("Progress status updated successfully.");
      fetchData();
    } catch (err) {
      console.error("Failed to update progress status", err);
      setError(`Failed to update progress status. Please try again later.`);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-auto p-1">
        <p>Loading employee progress...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-auto p-1">
        <p className="text-red-600">{error}</p> 
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-1">
      <div className="bg-white p-5 rounded shadow-md mb-4">
        <h1 className="font-semibold text-3xl">Employee Progress</h1>
      </div>

      <div className="bg-white p-5 rounded shadow-md mb-4">
        <h2 className="font-semibold text-2xl mb-4">Progress List</h2>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-100">
              <TableTh label="ID" />
              <TableTh label="Fullname" />
              <TableTh label="Training Title" />
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {progressData.length > 0 ? (
              progressData.map((progress) => {
                const fullname = progress.progress_employee_detail
                  ? `${progress.progress_employee_detail.first_name || ""} ${progress.progress_employee_detail.middle_name || ""} ${progress.progress_employee_detail.last_name || ""}`.trim()
                  : "";
                const trainingTitle = progress.progress_training_detail?.training_title;

                return (
                  <tr key={progress.progress_ID ?? Math.random()} className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">{progress.progress_ID}</td>
                    <td className="border border-gray-300 px-4 py-2">{fullname}</td>
                    <td className="border border-gray-300 px-4 py-2">{trainingTitle}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          className="flex items-center gap-1 bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition cursor-pointer"
                          onClick={() => handleStatusChange(progress.progress_ID, "successful")}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Success
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition cursor-pointer"
                          onClick={() => handleStatusChange(progress.progress_ID, "failed")}
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Fail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center border border-gray-300 px-4 py-2">
                  No progress records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default EmployeeProgress;
