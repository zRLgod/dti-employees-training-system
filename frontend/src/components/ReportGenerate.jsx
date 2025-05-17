import { useState, useEffect, useRef } from "react";
import { ViewTraining } from "../endpoints/api";
import { PrinterIcon } from '@heroicons/react/24/solid';    

export default function ReportGenerate() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [trainingList, setTrainingList] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [autoGenerate, setAutoGenerate] = useState(false);

    const capitalize = (str) => {
        if (!str) return "";
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    useEffect(() => {
        ViewTraining()
            .then(trainingList => {
                if (trainingList && trainingList.length > 0) {
                    const dates = trainingList.map(t => t.training_date).filter(Boolean);
                    if (dates.length > 0) {
                        const minDate = dates.reduce((a, b) => (a < b ? a : b));
                        const maxDate = dates.reduce((a, b) => (a > b ? a : b));
                        setStartDate(minDate);
                        setEndDate(maxDate);
                    }
                }
            })
            .catch(error => {
                console.error("Failed to fetch training date range:", error);
            });
    }, []);

    const handleGenerateReport = () => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        fetch(`http://127.0.0.1:8000/api/training/?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch training data');
                return response.json();
            })
            .then(data => {
                setTrainingList(data);
            })
            .catch(error => {
                console.error("Failed to fetch training data:", error);
            });
    };

    const handlePrint = async (training) => {
    // If enrolled_employees is a Promise, await it
    let employees = training.enrolled_employees;
    if (typeof employees?.then === "function") {
        employees = await employees;
    }
    setSelectedTraining({ ...training, enrolled_employees: employees || [] });
    setShowReport(true);
    setAutoGenerate(true);
};

    const closeReport = () => {
        setShowReport(false);
        setSelectedTraining(null);
        setAutoGenerate(false);
    };

    return (
        <main className="flex-1 overflow-auto p-1">
            <div className="bg-white p-5 rounded shadow-md mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-3xl">Reports</h1>
                </div>

                <div className="border-t border-gray-400 w-full mb-5 mt-5"></div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <label className="font-semibold">Date Range</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-400 px-2 py-1 rounded" />
                        <span>-</span>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-gray-400 px-2 py-1 rounded" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <button onClick={handleGenerateReport} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer">
                            Generate Report
                        </button>
                    </div>
                </div>

                <div className="bg-white p-5 border border-black rounded shadow-md mt-10">
                    <div className="flex items-center mb-4 mt-2 px-2 space-x-3">
                        <img src="/pic/dti-logo.png" alt="DTI Logo" className="h-20" />
                        <div className="flex-1 ml-10 text-center">
                            <h1 className="font-bold text-lg">DEPARTMENT OF TRADE AND INDUSTRY</h1>
                            <p className="font-semibold text-lg">Regional Office 1</p>
                        </div>
                        <img src="/pic/dti-logo.png" alt="DTI Side Logo" className="h-20" />
                    </div>

                    <h2 className="text-center font-bold text-2xl mb-3">Training List</h2>

                    <table className="w-full border border-black">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="border border-black px-3 py-2">ID</th>
                                <th className="border border-black px-3 py-2">Training Title</th>
                                <th className="border border-black px-3 py-2">Schedule</th>
                                <th className="border border-black px-3 py-2">Category</th>
                                <th className="border border-black px-3 py-2">Type of Training</th>
                                <th className="border border-black px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainingList.length > 0 ? (
                                trainingList.map((training) => (
                                    <tr key={training.training_ID} className="text-center">
                                        <td className="border border-black px-3 py-2">{training.training_ID}</td>
                                        <td className="border border-black px-3 py-2">{training.training_title}</td>
                                        <td className="border border-black px-3 py-2">{training.training_date}</td>
                                        <td className="border border-black px-3 py-2">{capitalize(training.training_category)}</td>
                                        <td className="border border-black px-3 py-2">{capitalize(training.training_type)}</td>
                                        <td className="border border-black px-3 py-2">
                                            <button onClick={() => handlePrint(training)} className="inline-flex items-center gap-1 bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer">
                                                <PrinterIcon className="w-4 h-4" />
                                                <span>Print</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td className="border border-black px-3 py-2" colSpan="6">Select date range first</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
