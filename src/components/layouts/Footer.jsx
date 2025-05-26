import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-50 border-t border-blue-200 py-10 px-4 animate-fade-in-up">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            {/* New logo: Graduation cap */}
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17a1 1 0 01-2 0v-3.09l-7 3.91-9-5 1.18-.68L12 15l8.82-4.91A1 1 0 0021 9V8.09L12 3z" />
            </svg>
            <span className="text-2xl font-extrabold text-blue-700 tracking-tight">FYP Finder</span>
          </div>
          <span className="text-blue-500 font-medium text-base">Empowering your project journey, every step of the way.</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-2">
          <span className="text-blue-700 font-semibold mb-1">Explore</span>
          <a href="/" className="text-blue-500 hover:text-blue-700 transition font-medium">Home</a>
          <a href="/student" className="text-blue-500 hover:text-blue-700 transition font-medium">For Students</a>
          <a href="/faculty" className="text-blue-500 hover:text-blue-700 transition font-medium">For Faculty</a>
          <a href="/admin" className="text-blue-500 hover:text-blue-700 transition font-medium">Admin</a>
        </nav>

        {/* Social */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="text-blue-700 font-semibold mb-1">Connect</span>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" aria-label="Facebook" className="text-blue-400 hover:text-blue-700 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="text-blue-400 hover:text-blue-700 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="text-blue-400 hover:text-blue-700 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-blue-200 flex flex-col md:flex-row justify-between items-center text-blue-400 text-sm">
        <span>© {new Date().getFullYear()} FYP Finder. Crafted with care for your success.</span>
        <span className="mt-2 md:mt-0">Made for students & faculty collaboration.</span>
      </div>
    </footer>
  );
}

export default Footer;