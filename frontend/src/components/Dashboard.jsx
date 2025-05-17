import React, { useState, useEffect } from 'react';
import { ViewTraining } from '../endpoints/api';

export default function Dashboard() {
  const [trainings, setTrainings] = useState([]);
  const [loadingTrainings, setLoadingTrainings] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      setLoadingTrainings(true);
      const data = await ViewTraining();
      if (data) setTrainings(data);
      setLoadingTrainings(false);
    };

    fetchTrainings();
  }, []);

  if (loadingTrainings) return <div>Loading...</div>;

  const trainingStats = [
    { label: 'Trainings', count: trainings.length },
    {
      label: 'Completed Trainings',
      count: trainings.filter(t => t.training_status === 'completed').length,
    },
    {
      label: 'Ongoing Trainings',
      count: trainings.filter(t => t.training_status === 'ongoing').length,
    },
    {
      label: 'Scheduled Trainings',
      count: trainings.filter(t => t.training_status === 'scheduled').length,
    },
  ];

  return (
    <main className="flex-1 overflow-auto p-4">
      <div className="p-5 rounded shadow-lg w-full absolute top-0 h-60 inset-0 -z-10" />

      <h1 className="font-semibold text-3xl">Dashboard</h1>

      <div className="flex flex-row justify-between px-2 gap-4 mt-8">
        {trainingStats.map(({ label, count }) => (
          <div key={label} className="bg-white py-6 px-6 rounded-lg shadow-xl flex flex-col w-full transition-transform duration-300 hover:-translate-y-2">
            <h3 className="text-lg font-semibold mb-5 text-gray-700">{label}</h3>
            <p className="text-2xl font-bold text-blue-600">{count}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
