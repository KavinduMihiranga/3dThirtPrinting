import React,{useState} from "react";
function IconText({ icon, title, description }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white-100 rounded-lg">
      <img src={icon} alt={title} className="w-12 h-12" />
      <div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default IconText;
