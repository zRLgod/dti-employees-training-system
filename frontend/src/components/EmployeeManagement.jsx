
import { useState, useEffect } from "react";
import TableTh from "./Layouts/TableTh";
import { ViewEmployee, update_user } from "../endpoints/api";
import { EyeIcon, PencilIcon } from '@heroicons/react/24/solid';
import EditEmployeeModal from "./Modals/EditEmployeeModal";

export default function EmployeeManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  useEffect(() => {
    const fetchEmployee = async () => {
      const employee = await ViewEmployee();
      setEmployees(employee);
    };
    fetchEmployee();
  }, []);

  const employeelist = employees
    .filter((employee) => employee && employee.id !== undefined)
    .filter((employee) => {
      const query = searchQuery.toLowerCase();
      return (
        employee.id.toString().includes(query) ||
        employee.first_name?.toLowerCase().includes(query) ||
        employee.last_name?.toLowerCase().includes(query) ||
        employee.middle_name?.toLowerCase().includes(query) ||
        employee.contact?.toLowerCase().includes(query) ||
        employee.department?.toLowerCase().includes(query) ||
        employee.competencies?.toLowerCase().includes(query) ||
        employee.specialization?.toLowerCase().includes(query)
      );
    });

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEmployee(null);
    setIsEditModalOpen(false);
  };

  const handleSave = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
  };

  return (
    <main className="flex-1 overflow-auto p-1">
      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center">
          <h1 className=" font-semibold  text-3xl">Employee Management</h1>
        </div>
      </div>

      <div className="bg-white p-5 rounded shadow-md mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-2xl">LIST OF EMPLOYEES</h1>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-200 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-100">
              <TableTh label="ID" />
              <TableTh label="Name" />
              <TableTh label="Department" />
              <TableTh label="Specialization" />
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeelist.length > 0 ? (
              employeelist.map((employee) => {
                const normalizedStatus = employee.user_status?.toLowerCase().trim();
                return (
                  <tr key={employee.id}>
                    <td className="border border-gray-300 px-4 py-2">{employee.id}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {employee.first_name} {getMiddleInitial(employee.middle_name)} {employee.last_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{employee.department}</td>
                    <td className="border border-gray-300 px-4 py-2">{capitalize(employee.specialization)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                     <div className="flex justify-center items-center space-x-2">

                        <button
                          onClick={() => openEditModal(employee)}
                          className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition cursor-pointer"
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="border border-gray-300 px-4 py-2 text-center">No Record Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        employee={selectedEmployee}
        onSave={handleSave}
      />
    </main>
  );
}
