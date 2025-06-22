import React from 'react';

function Button({text,onClick,type="button",disabled=false, className=""}) {
    return (
        <div>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition ${className}`}
            >
                {text}
            </button>
        </div>
    );
}

export default Button;
