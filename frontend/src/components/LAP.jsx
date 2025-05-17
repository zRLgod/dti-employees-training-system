import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createLearningActionPlan } from "../endpoints/api";
import ConfirmationModal from "./Modals/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useLapSubmission } from "../context/LapSubmissionContext";

const LAP = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addSubmittedLap } = useLapSubmission();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    employeeNo: '',
    learnerName: '',
    department: '',
    training: '',
    training_ID: '',
    specialization: '',
    keyTakeaways: '',
    learningGoal: '',
    actionPlan: '',
    timeframe: '',
    supportNeeded: '',
    outcome: '',
    datePrepared: '',
  });

  useEffect(() => {
    if (user) {
      const learnerName = [user.first_name, getMiddleInitial(user.middle_name), user.last_name]
        .filter(Boolean)
        .join(' ');
      setFormData((prevData) => ({
        ...prevData,
        employeeNo: user.id || '',
        learnerName: learnerName,
        department: user.department || '',
        specialization: capitalize(user.specialization) || '',
      }));
    }

    const state = window.history.state && window.history.state.usr;
    if (state && state.training) {
      setFormData((prevData) => ({
        ...prevData,
        training: state.training.training_title || '',
        training_ID: state.training.training_ID || '',
      }));
    } else {
    }
  }, [user]);

  const handleConfirm = async () => {
    try {
      if (!user) {
        return;
      }

      // Validate required fields before submission
      const requiredFields = ['keyTakeaways', 'learningGoal', 'actionPlan', 'timeframe', 'supportNeeded', 'outcome'];
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
          alert(`Please fill in the required field: ${field}`);
          return;
        }
      }

      if (!formData.training || !formData.training_ID) {
      }

      const lapData = {
        lap_employee: user.id,
        lap_training: formData.training_ID,
        lap_date: formData.datePrepared || new Date().toISOString().split('T')[0],
        lap_takeaways: formData.keyTakeaways,
        lap_goal: formData.learningGoal,
        lap_plan: formData.actionPlan,
        lap_timeframe: formData.timeframe,
        lap_support: formData.supportNeeded,
        lap_outcome: formData.outcome,
        lap_status: "to_evaluate",
      };

      const response = await createLearningActionPlan(lapData);

      setShowConfirmation(false);
      addSubmittedLap(response.learning_action_plan);
      navigate('/completedTraining', { state: { refresh: true } });
    } catch (error) {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getMiddleInitial = (middleName) => {
    if (!middleName) return "";
    return `${middleName.charAt(0).toUpperCase()}.`;
  };

  return (
    <main>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Learning Action Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold">DTI Employee No.</label>
              <input
                type="text"
                name="employeeNo"
                value={formData.employeeNo}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Learner's Name</label>
              <input
                type="text"
                name="learnerName"
                value={formData.learnerName}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Training</label>
              <input
                type="text"
                name="training"
                value={formData.training}
                readOnly
                className="mt-1 p-1 rounded w-full cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                readOnly
                className="mt-1 p-1 w-full cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Date Prepared</label>
              <input
                type="date"
                name="datePrepared"
                value={formData.datePrepared || new Date().toISOString().split('T')[0]}
                readOnly
                className="mt-1 p-1 w-full cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold">Key Takeaways from the Program:</label>
            <textarea
              name="keyTakeaways"
              value={formData.keyTakeaways}
              onChange={handleChange}
              rows="3"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Learning Goal/Target: (What do you want to achieve?)</label>
            <textarea
              name="learningGoal"
              value={formData.learningGoal}
              onChange={handleChange}
              rows="3"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Action Plan: (What do you intend to do in your workplace that will manifest your learning application?)</label>
            <textarea
              name="actionPlan"
              value={formData.actionPlan}
              onChange={handleChange}
              rows="3"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Timeframe: (When do you plan to implement your action plan and when will this be complete?)</label>
            <textarea
              name="timeframe"
              value={formData.timeframe}
              onChange={handleChange}
              rows="2"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Support Needed: (Identify what help you will need to carry out your application plan.)</label>
            <textarea
              name="supportNeeded"
              value={formData.supportNeeded}
              onChange={handleChange}
              rows="2"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold">Outcome: (Identify the outcomes expected once the action plan is completed.)</label>
            <textarea
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              rows="2"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
          {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          message="Are you sure you want to submit this Learning Action Plan?"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </main>
  );
};

export default LAP;
