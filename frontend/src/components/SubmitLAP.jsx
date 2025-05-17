import React, { useState, useEffect } from "react";
import TableTh from "./Layouts/TableTh";
import { getLAP, create_progress } from "../endpoints/api";
import { CheckCircleIcon, EyeIcon, XCircleIcon } from "@heroicons/react/24/solid";
import ViewLAPModal from "./Modals/ViewLAPModal";
import toast from "react-hot-toast";

export default function SubmitLAP() {
  const [laps, setLaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLap, setSelectedLap] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    async function fetchLaps() {
      try {
        const data = await getLAP();
        const lapsData = data || [];
        setLaps(lapsData);
      } catch (err) {
        setError(err.message || "Failed to fetch Learning Action Plans");
      } finally {
        setLoading(false);
      }
    }
    fetchLaps();
  }, []);

  const getMiddleInitial = (middleName) => {
    if (!middleName) return "";
    return `${middleName.charAt(0).toUpperCase()}.`;
  };

  const handleViewClick = (lap) => {
    setSelectedLap(lap);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedLap(null);
  };

const handleApprove = async (lap) => {
  try {
    const newProgressData = {
      progress_employee: lap.lap_employee_detail?.id || lap.lap_employee,
      progress_training: lap.lap_training_detail?.training_ID || lap.lap_training,
      progress_lap: lap.lap_ID,
      progress_status: "lap_approved",
    };
    console.log("Sending progress data:", newProgressData); 
    const res = await create_progress(newProgressData);
    if (res.success) {
      toast.success("Learning Action Plan approved.");
      setLaps((prevLaps) =>
        prevLaps.map((item) =>
          item.lap_ID === lap.lap_ID ? { ...item, progress_status: "lap_approved" } : item
        )
      );
    } else {
      toast.error("Failed to create progress record.");
    }
  } catch (error) {
    toast.error("Failed to approve LAP.");
  }
};

  const handleReject = async (lap) => {
    try {

      const newProgressData = {
        progress_employee: lap.lap_employee_detail?.id || lap.lap_employee,
        progress_training: lap.lap_training_detail?.training_ID || lap.lap_training,
        progress_lap: lap.lap_ID,
        progress_status: "lap_rejected",
      };
      const res = await create_progress(newProgressData);
      if (res.success) {
        toast.success("Learning Action Plan rejected.");
        setLaps((prevLaps) =>
          prevLaps.map((item) =>
            item.lap_ID === lap.lap_ID ? { ...item, progress_status: "lap_rejected" } : item
          )
        );
      } else {
        toast.error("Failed to create progress record.");
      }
    } catch (error) {
      toast("Failed to reject LAP.");
    }
  };

  return (
    <main className="flex-1 overflow-auto p-1">
      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-3xl">Learning Action Plan</h1>
        </div>
      </div>

      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-2xl">LIST OF SUBMITTED LAP</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-100">
                <TableTh label="Fullname" />
                <TableTh label="Training Title" />
                <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {laps.length === 0 ? (
                <tr>
                  <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">No submitted LAP found.</td>
                </tr>
              ) : (
                laps.map((lap) => (
                  <tr key={lap.lap_ID}>
                    <td className="border border-gray-300 px-4 py-2">
                      {lap.lap_employee_detail.first_name} {getMiddleInitial(lap.lap_employee_detail.middle_name)} {lap.lap_employee_detail.last_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{lap.lap_training_detail.training_title}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          className="flex items-center gap-1 bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 transition cursor-pointer "
                          onClick={() => handleViewClick(lap)}
                        >
                          <EyeIcon className="w-4 h-4" />
                          View
                        </button>
                        <button
                          className="flex items-center gap-1 bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition cursor-pointer disabled:opacity-50"
                          onClick={() => handleApprove(lap)}
                          disabled={lap.progress_status === "lap_approved" || lap.progress_status === "lap_rejected"}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
                          onClick={() => handleReject(lap)}
                          disabled={lap.progress_status === "lap_approved" || lap.progress_status === "lap_rejected"}
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <ViewLAPModal isOpen={showViewModal} onClose={handleCloseModal} lapData={selectedLap} />
    </main>
  );
};
