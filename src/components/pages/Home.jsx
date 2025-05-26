import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../views/home/HeroSection";
import StudentFeedback from "../views/home/StudentFeedback";
import HowItWorks from "../views/home/HowItWorks";
import CallToAction from "../views/home/CallTOAction";
import SupervisorHighlights from "../views/home/SupervisorHighlights";
import CardLayout from "../layouts/CardLayout";
import SectionContainer from "../layouts/SectionContainer";

function Home() {
  const testimonials = [
    {
      quote: "I found my supervisor in just a few clicks!",
      name: "wahaj chaudhry",
      program: "Artificial Intelligence",
      rating: 5,
      color: "from-blue-100 to-indigo-100",
    },
    {
      quote: "good platform to find a supervisor.",
      name: "faizan shaukat",
      program: "Cybersecurity",
      rating: 5,
      color: "from-purple-100 to-blue-100",
    },
    {
      quote:
        "I was able to connect with a supervisor who specializes in my exact research area.",
      name: "Ali murtaza",
      program: "Computer Science",
      rating: 4,
      color: "from-indigo-100 to-purple-100",
    },
  ];

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full p-4 shadow-lg">
              {/* Graduation Cap Logo */}
              <svg
                className="h-14 w-14 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17a1 1 0 01-2 0v-3.09l-7 3.91-9-5 1.18-.68L12 15l8.82-4.91A1 1 0 0021 9V8.09L12 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">
            FYP Supervisor Finder
          </h1>
          <p className="text-xl text-blue-700 mb-8">
            Connect students and faculty for Final Year Projects. Discover
            supervisors, submit your ideas, and manage your FYP journey—all in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/student"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow transition"
            >
              For Students
            </Link>
            <Link
              to="/faculty"
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-3 px-8 rounded-lg shadow transition"
            >
              For Faculty
            </Link>
            <Link
              to="/admin"
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-lg shadow transition"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Supervisors */}
      <SectionContainer
        title="Featured Supervisors"
        subtitle="Connect with our most sought-after academic advisors"
        bg="bg-indigo-50"
      >
        <SupervisorHighlights />
      </SectionContainer>

      {/* How It Works */}
      <SectionContainer
        title="How FYP Finder Works"
        subtitle="Start your journey in three easy steps"
      >
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-8 shadow flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-blue-900 mb-2">
              Browse Supervisors
            </h3>
            <p className="text-blue-700">
              Explore faculty profiles by research domain and availability.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-8 shadow flex flex-col items-center">
            <div className="bg-indigo-100 p-4 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-indigo-900 mb-2">
              Submit Your Idea
            </h3>
            <p className="text-indigo-700">
              Send your FYP proposal to your chosen supervisor in seconds.
            </p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-8 shadow flex flex-col items-center">
            <div className="bg-yellow-100 p-4 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-yellow-900 mb-2">
              Collaborate & Track
            </h3>
            <p className="text-yellow-700">
              Get feedback, track approvals, and manage your FYP progress.
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your FYP Journey?
          </h2>
          <p className="mb-8 text-lg">
            Join hundreds of students and faculty collaborating on successful
            projects.
          </p>
          <Link
            to="/student"
            className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow hover:bg-blue-100 transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
