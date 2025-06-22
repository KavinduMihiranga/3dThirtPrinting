import React, {useState} from 'react';

function PaginationBar({ totalPages, currentPage, setCurrentPage }) {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Prev
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`px-3 py-2 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} hover:bg-blue-600`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    </div>

    );
}

export default PaginationBar;