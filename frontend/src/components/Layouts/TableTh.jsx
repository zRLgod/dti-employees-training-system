import React from "react";

export default function TableTh({label}) {
    return (
        <th scope="col" className="border border-gray-300 px-4 py-2 text-left">{label}</th>
    )
}