import React, { createContext, useState, useContext } from 'react';

const LapSubmissionContext = createContext();

export const LapSubmissionProvider = ({ children }) => {
  const [submittedLaps, setSubmittedLaps] = useState([]);

  const addSubmittedLap = (lap) => {
    setSubmittedLaps((prev) => [...prev, lap]);
  };

  return (
    <LapSubmissionContext.Provider value={{ submittedLaps, addSubmittedLap }}>
      {children}
    </LapSubmissionContext.Provider>
  );
};

export const useLapSubmission = () => {
  const context = useContext(LapSubmissionContext);
  if (!context) {
    throw new Error('useLapSubmission must be used within a LapSubmissionProvider');
  }
  return context;
};
