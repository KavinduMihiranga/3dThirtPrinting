import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Or replace with emoji/icons if you prefer

const TextField = ({ label, type = 'text', value, onChange, placeholder, showToggle = false }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
                <input
                    type={showToggle ? (show ? 'text' : type) : type}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        aria-label={show ? 'Hide' : 'Show'}
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TextField;
