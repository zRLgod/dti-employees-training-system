import React, { forwardRef, useRef, useEffect } from "react";
import ReactToPdf from "react-to-pdf";

const GenerateReport = forwardRef(({ training, employees, autoGenerate }, ref) => {
    const reportRef = useRef();
    const toPdfRef = useRef(null);

    // Prevent rendering if data is not yet loaded (avoid Promise rendering error)
    if (
        !training ||
        typeof training.then === "function" ||
        !employees ||
        typeof employees.then === "function"
    ) {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        if (autoGenerate && toPdfRef.current) {
            toPdfRef.current();
        }
    }, [autoGenerate]);

    return (
        <ReactToPdf
            targetRef={reportRef}
            filename={`training_${training.training_ID}_${training.training_title.replace(/\s+/g, "_")}.pdf`}
            scale={0.8}
        >
            {({ toPdf }) => {
                toPdfRef.current = toPdf;
                return (
                    <div>
                        <button
                            onClick={toPdf}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        >
                            Download PDF
                        </button>
                        <div
                            ref={reportRef}
                            style={{
                                width: "816px",
                                minHeight: "1056px",
                                margin: "auto",
                                background: "#fff",
                                padding: "2rem",
                                fontFamily: "Arial",
                            }}
                        >
                            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                                <img
                                    src="/pic/dti-logo.png"
                                    alt="DTI Logo"
                                    style={{ height: "80px" }}
                                />
                                <h2 style={{ fontWeight: "bold", marginTop: "1rem" }}>
                                    TRAINING REPORT
                                </h2>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "2rem",
                                }}
                            >
                                <div>
                                    <strong>TITLE</strong>
                                    <br />
                                    {training.training_title}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <strong>DATE</strong>
                                    <br />
                                    {training.training_date}
                                </div>
                            </div>

                            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
                                ENROLLED EMPLOYEES
                            </h3>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    marginTop: "2rem",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                border: "1px solid #000",
                                                padding: "8px",
                                            }}
                                        >
                                            Name
                                        </th>
                                        <th
                                            style={{
                                                border: "1px solid #000",
                                                padding: "8px",
                                            }}
                                        >
                                            Department
                                        </th>
                                        <th
                                            style={{
                                                border: "1px solid #000",
                                                padding: "8px",
                                            }}
                                        >
                                            Specialization
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees && employees.length > 0 ? (
                                        employees.map((emp, idx) => (
                                            <tr key={idx}>
                                                <td
                                                    style={{
                                                        border: "1px solid #000",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    {`${emp?.user?.first_name || "N/A"} ${
                                                        emp?.user?.middle_name
                                                            ? emp.user.middle_name + " "
                                                            : ""
                                                    }${emp?.user?.last_name || ""}`.trim()}
                                                </td>
                                                <td
                                                    style={{
                                                        border: "1px solid #000",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    {emp?.user?.department || "N/A"}
                                                </td>
                                                <td
                                                    style={{
                                                        border: "1px solid #000",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    {emp?.user?.specialization || "N/A"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                style={{
                                                    border: "1px solid #000",
                                                    padding: "8px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                No enrolled employees
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            }}
        </ReactToPdf>
    );
});

export default GenerateReport;