import React from "react";

const Alert = ({ message, type }) => {
    return (
        <div className={`p-2 mb-4 rounded ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
        </div>
    );
}

export default Alert;