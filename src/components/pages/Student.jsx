import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebaseconfig';

function Student() {
  const [facultyList, setFacultyList] = useState([]);
  const [filters, setFilters] = useState({ domain: '', officeHours: '', slots: '' });
  const [ideaForm, setIdeaForm] = useState({ title: '', description: '', supervisor: '' });
  const [submittedIdeas, setSubmittedIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('submit');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showFacultyDetails, setShowFacultyDetails] = useState(false);

  // Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  // Fetch faculty
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'faculty'));
        const facultyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          slots: doc.data().slots || 0
        }));
        setFacultyList(facultyData);
      } catch (error) {
        console.error("Error fetching faculty: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // Fetch ideas
  useEffect(() => {
    if (!currentUser) return;
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'projectProposals'), where('submittedBy', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ideasData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : new Date(data.submittedAt)
          };
        }).sort((a, b) => b.submittedAt - a.submittedAt);
        setSubmittedIdeas(ideasData);
      } catch (error) {
        console.error("Error fetching ideas: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, [currentUser]);

  // Handlers
  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleIdeaChange = (e) => setIdeaForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const filteredFaculty = facultyList.filter(member => {
    const domainMatch = !filters.domain || member.domain.toLowerCase().includes(filters.domain.toLowerCase());
    const officeMatch = !filters.officeHours || member.officeHours.toLowerCase().includes(filters.officeHours.toLowerCase());
    const slotMatch = !filters.slots || (member.slots >= parseInt(filters.slots));
    return domainMatch && officeMatch && slotMatch;
  });

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!currentUser) {
      alert("You must be logged in to submit an idea.");
      setLoading(false);
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'projectProposals'), {
        title: ideaForm.title,
        description: ideaForm.description,
        supervisor: ideaForm.supervisor,
        status: "pending",
        submittedBy: currentUser.uid,
        submittedAt: serverTimestamp(),
        studentName: currentUser.displayName || "Anonymous Student",
        studentEmail: currentUser.email || "",
        domain: facultyList.find(f => f.name === ideaForm.supervisor)?.domain || "General"
      });
      setSubmittedIdeas(prev => [{
        id: docRef.id,
        ...ideaForm,
        status: "pending",
        submittedAt: new Date(),
        studentName: currentUser.displayName || "Anonymous Student",
        studentEmail: currentUser.email || "",
        domain: facultyList.find(f => f.name === ideaForm.supervisor)?.domain || "General"
      }, ...prev]);
      setIdeaForm({ title: '', description: '', supervisor: '' });
      setActiveTab('view');
      alert("FYP idea submitted successfully!");
    } catch (error) {
      console.error("Error submitting idea: ", error);
      alert("Failed to submit FYP idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'projectProposals', id));
      setSubmittedIdeas(prev => prev.filter(idea => idea.id !== id));
      alert("Proposal deleted successfully!");
    } catch (error) {
      console.error("Error deleting proposal: ", error);
      alert("Failed to delete proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewFacultyDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setShowFacultyDetails(true);
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500 text-white';
      case 'rejected': return 'bg-rose-500 text-white';
      case 'pending': return 'bg-amber-400 text-white';
      case 'revision': return 'bg-violet-400 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };
  const getDomainColor = (domain) => {
    const colors = {
      'AI': 'bg-violet-100 text-violet-800',
      'Cybersecurity': 'bg-emerald-100 text-emerald-800',
      'Data Science': 'bg-cyan-100 text-cyan-800',
      'Networks': 'bg-orange-100 text-orange-800',
      'Web Development': 'bg-pink-100 text-pink-800',
      'Machine Learning': 'bg-fuchsia-100 text-fuchsia-800',
      'Cloud Computing': 'bg-teal-100 text-teal-800',
      'Software Engineering': 'bg-lime-100 text-lime-800',
      'IoT': 'bg-sky-100 text-sky-800'
    };
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    try {
      const d = date instanceof Date ? date : new Date(date);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // --- NEW MODERN LAYOUT STARTS HERE ---
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f0fdfa] via-[#e0e7ff] to-[#fdf6fb]">
      {/* Modern Sidebar */}
      <div className="flex min-h-screen">
        <aside className="hidden md:flex flex-col w-64 bg-white/90 border-r border-emerald-100 shadow-lg py-8 px-6">
          <div className="flex items-center gap-3 mb-12">
            <span className="bg-gradient-to-tr from-emerald-400 to-violet-500 rounded-full p-2">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17a1 1 0 01-2 0v-3.09l-7 3.91-9-5 1.18-.68L12 15l8.82-4.91A1 1 0 0021 9V8.09L12 3z" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-emerald-700 font-mono">FYP Student</span>
          </div>
          <nav className="flex flex-col gap-2">
            <button onClick={() => setActiveTab('submit')} className={`text-left px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'submit' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}>Submit Idea</button>
            <button onClick={() => setActiveTab('view')} className={`text-left px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'view' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}>My Submissions</button>
            <button onClick={() => setActiveTab('supervisors')} className={`text-left px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'supervisors' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'}`}>Find Supervisors</button>
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            {currentUser && (
              <div className="flex items-center gap-3 mt-8">
                <img
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || "Student"}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-emerald-300 shadow"
                />
                <div>
                  <span className="block text-sm text-gray-600">Hi,</span>
                  <span className="font-semibold text-emerald-800">{currentUser.displayName || "Student"}</span>
                </div>
              </div>
            )}
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/80 shadow-sm sticky top-0 z-10 border-b border-emerald-100 px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight flex items-center gap-2">
                <span className="bg-gradient-to-tr from-emerald-400 to-violet-500 rounded-full p-2">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 9-4.91V17a1 1 0 01-2 0v-3.09l-7 3.91-9-5 1.18-.68L12 15l8.82-4.91A1 1 0 0021 9V8.09L12 3z" />
                  </svg>
                </span>
                FYP Portal
              </h1>
              <p className="text-base text-emerald-700 mt-1 font-medium">Modern workspace for your FYP journey.</p>
            </div>
            {currentUser && (
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || "Student"}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-emerald-300 shadow"
                />
                <div>
                  <span className="block text-sm text-gray-600">Hi,</span>
                  <span className="font-semibold text-emerald-800">{currentUser.displayName || "Student"}</span>
                </div>
              </div>
            )}
          </header>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white/90 p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700 font-semibold text-lg">Processing...</span>
              </div>
            </div>
          )}

          {/* Faculty Details Modal */}
          {showFacultyDetails && selectedFaculty && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-blue-200">
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-blue-900">{selectedFaculty.name}</h3>
                      <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDomainColor(selectedFaculty.domain)}`}>
                        {selectedFaculty.domain}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowFacultyDetails(false)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-8 space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold text-blue-500 uppercase">Email</h4>
                      <p className="mt-1 text-blue-700">
                        <a href={`mailto:${selectedFaculty.email}`} className="hover:underline">
                          {selectedFaculty.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-500 uppercase">Office Hours</h4>
                      <p className="mt-1 text-gray-700">{selectedFaculty.officeHours || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-500 uppercase">Available Slots</h4>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full"
                            style={{ width: `${(selectedFaculty.slots / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {selectedFaculty.slots} available
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-500 uppercase">Research Interests</h4>
                      <p className="mt-1 text-gray-700">
                        {selectedFaculty.researchInterests || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        setIdeaForm(prev => ({ ...prev, supervisor: selectedFaculty.name }));
                        setShowFacultyDetails(false);
                        setActiveTab('submit');
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-bold text-lg"
                    >
                      Select as Supervisor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="max-w-5xl mx-auto py-10 px-2 md:px-6">
            {/* Tab Content */}
            {activeTab === 'submit' && (
              <section className="bg-white/90 rounded-2xl shadow-xl p-10 border border-blue-100">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">💡 Submit New FYP Idea</h2>
                <form onSubmit={handleIdeaSubmit} className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-1">Project Title*</label>
                    <input
                      name="title"
                      value={ideaForm.title}
                      onChange={handleIdeaChange}
                      placeholder="Innovative title for your project"
                      className="w-full p-4 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-1">Detailed Description*</label>
                    <textarea
                      name="description"
                      value={ideaForm.description}
                      onChange={handleIdeaChange}
                      placeholder="Describe your project in detail including objectives, methodology, and expected outcomes"
                      rows="5"
                      className="w-full p-4 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-1">Select Supervisor*</label>
                    <select
                      name="supervisor"
                      value={ideaForm.supervisor}
                      onChange={handleIdeaChange}
                      className="w-full p-4 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">-- Select a supervisor --</option>
                      {facultyList
                        .filter(f => f.slots > 0)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(f => (
                          <option key={f.id} value={f.name}>
                            {f.name} ({f.domain}) - {f.slots} slots available
                          </option>
                        ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Only showing supervisors with available slots
                    </p>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('supervisors')}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                    >
                      Browse Supervisors
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
                      disabled={loading}
                    >
                      Submit Idea
                    </button>
                  </div>
                </form>
              </section>
            )}

            {activeTab === 'view' && (
              <section className="bg-white/90 rounded-2xl shadow-xl border border-blue-100">
                <div className="p-8 border-b border-blue-50 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-blue-900">Your Submitted Ideas</h2>
                  <span className="text-base text-blue-500">{submittedIdeas.length} submissions</span>
                </div>
                <ul className="divide-y divide-blue-50">
                  {submittedIdeas.length === 0 ? (
                    <li className="p-8 text-center text-gray-400">No submissions yet.</li>
                  ) : (
                    submittedIdeas.map((idea) => (
                      <li key={idea.id} className="p-8 hover:bg-blue-50 transition rounded-2xl">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="text-xl font-bold text-blue-800">{idea.title}</h3>
                              <span className={`px-4 py-1 rounded-full text-xs font-semibold capitalize shadow ${getStatusColor(idea.status)}`}>
                                {idea.status}
                              </span>
                            </div>
                            <p className="text-blue-700 mt-3">{idea.description}</p>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-blue-600">
                                  <span className="font-medium">Supervisor:</span> {idea.supervisor}
                                </p>
                                <p className="text-sm text-blue-600">
                                  <span className="font-medium">Domain:</span>
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getDomainColor(idea.domain)}`}>
                                    {idea.domain}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-blue-600">
                                  <span className="font-medium">Submitted:</span> {formatDate(idea.submittedAt)}
                                </p>
                                {idea.comments && idea.comments.length > 0 && (
                                  <p className="text-sm text-blue-600">
                                    <span className="font-medium">Feedback:</span> {idea.comments.length} comment(s)
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteProposal(idea.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {/* Show comments if any */}
                        {idea.comments && idea.comments.length > 0 && (
                          <div className="mt-6 border-t border-blue-100 pt-4">
                            <h4 className="text-sm font-semibold text-blue-700 mb-2">Supervisor Feedback:</h4>
                            <ul className="space-y-2">
                              {idea.comments.map((comment, index) => (
                                <li key={index} className="bg-blue-50 p-4 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <span className="text-sm font-semibold">{comment.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </section>
            )}

            {activeTab === 'supervisors' && (
              <section className="bg-white/90 rounded-2xl shadow-xl border border-blue-100">
                <div className="p-8 border-b border-blue-50 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-blue-900">Available Supervisors</h2>
                  <span className="text-base text-blue-500">
                    {filteredFaculty.length} {filteredFaculty.length === 1 ? 'match' : 'matches'} found
                  </span>
                </div>
                {filteredFaculty.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">No supervisors found</h3>
                    <p className="mt-2 text-gray-500">
                      Try adjusting your filters or check back later for more availability.
                    </p>
                    <div className="mt-8">
                      <button
                        onClick={() => setFilters({ domain: '', officeHours: '', slots: '' })}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {filteredFaculty.map((faculty) => (
                      <div key={faculty.id} className="border border-blue-100 rounded-2xl p-6 hover:shadow-xl transition bg-white/80">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-blue-800">{faculty.name}</h3>
                            <span className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDomainColor(faculty.domain)}`}>
                              {faculty.domain}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${faculty.slots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {faculty.slots > 0 ? `${faculty.slots} slots` : 'No slots'}
                          </span>
                        </div>
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Office Hours:</span> {faculty.officeHours || 'Not specified'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span>
                            <a href={`mailto:${faculty.email}`} className="text-blue-600 hover:underline ml-1">
                              {faculty.email}
                            </a>
                          </p>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => viewFacultyDetails(faculty)}
                            className="w-full py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Student;