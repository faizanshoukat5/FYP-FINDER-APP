



import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="bg-gray-100 py-20 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to the FYP Supervisor Finder
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Finding a supervisor for your Final Year Project (FYP) can be challenging. Our platform simplifies this process by helping students connect with experienced supervisors across various research domains.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/Faculty"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md shadow transition duration-200"
          >
            Find a Supervisor
          </Link>
          <Link
            to="/Admin"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-8 rounded-md shadow transition duration-200"
          >
            Add Supervisor
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;


