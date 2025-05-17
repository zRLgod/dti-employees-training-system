import React, { createContext, useState, useContext } from "react";

const TrainingRefreshContext = createContext();

export const TrainingRefreshProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <TrainingRefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </TrainingRefreshContext.Provider>
  );
};

export const useTrainingRefresh = () => {
  return useContext(TrainingRefreshContext);
};
