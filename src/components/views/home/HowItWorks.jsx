


import React from "react";

function HowItWorks() {
  const steps = [
    {
      title: "Browse Profiles",
      description: "Explore supervisor profiles based on research domains and availability.",
      icon: (
        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: "bg-blue-100 border-blue-400",
      dot: "bg-blue-500"
    },
    {
      title: "Check Availability",
      description: "View open slots and office hours for each supervisor.",
      icon: (
        <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-purple-100 border-purple-400",
      dot: "bg-purple-500"
    },
    {
      title: "Make Contact",
      description: "Send meeting requests to potential supervisors.",
      icon: (
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-green-100 border-green-400",
      dot: "bg-green-500"
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Start your journey in three easy steps
        </p>
        <div className="relative">
          {/* Vertical line for stepper */}
          <div className="hidden md:block absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 rounded-full"></div>
          <ol className="space-y-12 md:space-y-0 md:space-x-0 md:grid md:grid-cols-1">
            {steps.map((step, idx) => (
              <li key={idx} className="relative flex md:items-center md:mb-0 mb-8">
                {/* Icon and dot */}
                <div className="flex flex-col items-center z-10">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 ${step.color} shadow-md`}>
                    {step.icon}
                  </div>
                  {/* Dot for timeline */}
                  {idx < steps.length - 1 && (
                    <span className={`hidden md:block w-2 h-12 ${step.dot} rounded-full my-2`}></span>
                  )}
                </div>
                {/* Content */}
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{step.title}</h3>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <span className={`inline-block text-xs font-semibold ${step.dot} text-white px-3 py-1 rounded-full`}>
                    Step {idx + 1}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
