import React from 'react';

function Aboutus(props) {
    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold text-center text-black-600 mb-6">About Us</h1>
        <p className="text-gray-700 text-lg mb-4">
          Welcome to our website! We are passionate about delivering quality products and excellent customer service. Our mission is to provide a platform that meets the needs of our users with innovation and care.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Our team is made up of creative, dedicated, and hardworking individuals who are committed to building a better experience every day.
        </p>
        <p className="text-gray-700 text-lg">
          Thank you for being part of our journey. We look forward to serving you better each day.
        </p>
      </div>
    </div>
    );
}

export default Aboutus;