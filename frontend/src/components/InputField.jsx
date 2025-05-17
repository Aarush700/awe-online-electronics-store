import React from "react";

const InputField = ({ type, value, onChange, placeholder, name, error }) => {
    return (
        <div className="mb-4">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}

export default InputField;