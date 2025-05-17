import React from "react";

export default function ViewLAPModal({ isOpen, onClose, lapData }) {
  if (!isOpen || !lapData) return null;

  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">View Learning Action Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition text-xl font-bold cursor-pointer"
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>
        <form className="space-y-4 pointer-events-none">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold">DTI Employee No.</label>
              <input
                type="text"
                value={lapData.lap_employee_detail?.id || ""}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Learner's Name</label>
              <input
                type="text"
                value={`${lapData.lap_employee_detail?.first_name || ""} ${lapData.lap_employee_detail?.middle_name ? lapData.lap_employee_detail.middle_name.charAt(0).toUpperCase() + "." : ""} ${lapData.lap_employee_detail?.last_name || ""}`.trim()}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Department</label>
              <input
                type="text"
                value={lapData.lap_employee_detail?.department || ""}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Training</label>
              <input
                type="text"
                value={lapData.lap_training_detail?.training_title || ""}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold">Specialization</label>
              <input
                type="text"
                value={capitalize(lapData.lap_employee_detail?.specialization) || ""}
                readOnly
                className="mt-1 p-1 w-full cursor-not-allowed bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Date Prepared</label>
              <input
                type="date"
                value={lapData.lap_date ? lapData.lap_date.split("T")[0] : ""}
                readOnly
                className="mt-1 p-1 w-full cursor-not-allowed bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold">Key Takeaways from the Program:</label>
            <textarea
              value={lapData.lap_takeaways || ""}
              readOnly
              rows="3"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Learning Goal/Target: (What do you want to achieve?)</label>
            <textarea
              value={lapData.lap_goal || ""}
              readOnly
              rows="3"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Action Plan: (What do you intend to do in your workplace that will manifest your learning application?)</label>
            <textarea
              value={lapData.lap_plan || ""}
              readOnly
              rows="3"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Timeframe: (When do you plan to implement your action plan and when will this be complete?)</label>
            <textarea
              value={lapData.lap_timeframe || ""}
              readOnly
              rows="2"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Support Needed: (Identify what help you will need to carry out your application plan.)</label>
            <textarea
              value={lapData.lap_support || ""}
              readOnly
              rows="2"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Outcome: (Identify the outcomes expected once the action plan is completed.)</label>
            <textarea
              value={lapData.lap_outcome || ""}
              readOnly
              rows="2"
              className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100 resize-none"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
