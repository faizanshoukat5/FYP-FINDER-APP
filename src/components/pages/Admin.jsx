import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot, collection as fbCollection } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

function Admin() {
  // State
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [evaluationSlots, setEvaluationSlots] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newComment, setNewComment] = useState('');
  const [commentProjectId, setCommentProjectId] = useState(null);
  const [newSlot, setNewSlot] = useState({ faculty: '', date: '', time: '' });
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '', email: '', domain: '', slots: 0, officeHours: ''
  });
  const [searchFaculty, setSearchFaculty] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add new state for notifications and activity log
  const [notifications, setNotifications] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Fetch data from Firebase
  useEffect(() => {
    setLoading(true);

    // Real-time notifications listener
    const unsubNotifications = onSnapshot(
      fbCollection(db, 'notifications'),
      (snapshot) => {
        const notifData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(notifData);
      }
    );

    // Real-time activity log listener (optional, if you want)
    const unsubActivity = onSnapshot(
      fbCollection(db, 'activityLog'),
      (snapshot) => {
        const activityData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setActivityLog(activityData);
      }
    );

    const fetchData = async () => {
      const facultySnapshot = await getDocs(collection(db, 'faculty'));
      let facultyData = facultySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Add a new default member if not already present
      const alreadyExists = facultyData.some(f => f.email === "salman.irfan@example.com");
      if (!alreadyExists) {
        const defaultMembers = [
          {
            id: "default-salman-irfan",
            name: "Salman Irfan",
            email: "salman.irfan@example.com",
            domain: "AI",
            slots: 3,
            officeHours: "Mon 10-12, Wed 2-4"
          },
          {
            id: "default-faizan-shaukat",
            name: "Faizan Shaukat",
            email: "faizan.shaukat@example.com",
            domain: "Data Science",
            slots: 2,
            officeHours: "Tue 11-1, Thu 3-5"
          },
          {
            id: "default-ahmad",
            name: "Ahmad",
            email: "ahmad@example.com",
            domain: "Cybersecurity",
            slots: 4,
            officeHours: "Mon 9-11, Fri 1-3"
          },
          {
            id: "default-ali-hassan",
            name: "Ali Hassan",
            email: "ali.hassan@example.com",
            domain: "Web Development",
            slots: 2,
            officeHours: "Wed 10-12, Thu 2-4"
          },
          {
            id: "default-sara-khan",
            name: "Sara Khan",
            email: "sara.khan@example.com",
            domain: "Machine Learning",
            slots: 3,
            officeHours: "Tue 9-11, Fri 10-12"
          },
          {
            id: "default-umar-farooq",
            name: "Umar Farooq",
            email: "umar.farooq@example.com",
            domain: "Cloud Computing",
            slots: 1,
            officeHours: "Mon 3-5"
          }
        ];
        // Only add those not already present
        defaultMembers.forEach(member => {
          if (!facultyData.some(f => f.email === member.email)) {
            facultyData = [...facultyData, member];
          }
        });
      }

      setFacultyMembers(facultyData);

      const projectsSnapshot = await getDocs(collection(db, 'proposals'));
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        comments: doc.data().comments || []
      }));
      setProjects(projectsData);

      const slotsSnapshot = await getDocs(collection(db, 'evaluationSlots'));
      const slotsData = slotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvaluationSlots(slotsData);

      setLoading(false);
    };

    fetchData();

    // Cleanup listeners on unmount
    return () => {
      unsubNotifications();
      unsubActivity();
    };
  }, []);

  // Project management functions
  const updateProjectStatus = async (projectId, status) => {
    try {
      await updateDoc(doc(db, 'proposals', projectId), { status });
      setProjects(projects.map(project =>
        project.id === projectId ? { ...project, status } : project
      ));
      // Find the project by ID to get its title
      const project = projects.find(p => p.id === projectId);
      const projectTitle = project ? project.title : projectId;
      // Log the activity with the project title
      await addDoc(collection(db, "activityLog"), {
        action: `Project ${projectTitle} status changed to ${status}`,
        time: new Date().toLocaleString()
      });
    } catch (error) {
      alert("Error updating project status.");
    }
  };

  const addComment = async (projectId) => {
    if (!newComment.trim()) return;
    const comment = {
      text: newComment,
      author: 'Admin',
      date: new Date().toISOString().split('T')[0]
    };
    try {
      const projectRef = doc(db, 'proposals', projectId);
      const project = projects.find(p => p.id === projectId);
      await updateDoc(projectRef, {
        comments: [...(project.comments || []), comment]
      });
      setProjects(projects.map(project =>
        project.id === projectId
          ? { ...project, comments: [...(project.comments || []), comment] }
          : project
      ));
      setNewComment('');
      setCommentProjectId(null);
      // Log the activity with the project title
      const projectTitle = project ? project.title : projectId;
      await addDoc(collection(db, "activityLog"), {
        action: `Comment added to project ${projectTitle}`,
        time: new Date().toLocaleString()
      });
    } catch (error) {
      alert("Error adding comment.");
    }
  };

  const addFacultyMember = async () => {
    try {
      const docRef = await addDoc(collection(db, 'faculty'), {
        ...newFaculty,
        slots: parseInt(newFaculty.slots)
      });
      setFacultyMembers([...facultyMembers, { id: docRef.id, ...newFaculty }]);
      setNewFaculty({
        name: '', email: '', domain: '', slots: 0, officeHours: ''
      });
      setShowFacultyForm(false);
      // Log the activity
      await addDoc(collection(db, "activityLog"), {
        action: `Added faculty: ${newFaculty.name}`,
        time: new Date().toLocaleString()
      });
    } catch (error) {
      alert("Error adding faculty.");
    }
  };

  const deleteFacultyMember = async (id) => {
    try {
      const member = facultyMembers.find(f => f.id === id);
      await deleteDoc(doc(db, 'faculty', id));
      setFacultyMembers(facultyMembers.filter(member => member.id !== id));
      // Also delete any evaluation slots for this faculty
      const slotsToDelete = evaluationSlots.filter(slot => slot.facultyId === id);
      for (const slot of slotsToDelete) {
        await deleteDoc(doc(db, 'evaluationSlots', slot.id));
      }
      setEvaluationSlots(evaluationSlots.filter(slot => slot.facultyId !== id));
      // Log the activity
      await addDoc(collection(db, "activityLog"), {
        action: `Removed faculty: ${member?.name || id}`,
        time: new Date().toLocaleString()
      });
    } catch (error) {
      alert("Error deleting faculty.");
    }
  };

  const addEvaluationSlot = async () => {
    try {
      const faculty = facultyMembers.find(f => f.name === newSlot.faculty);
      if (!faculty) return;
      const docRef = await addDoc(collection(db, 'evaluationSlots'), {
        faculty: newSlot.faculty,
        facultyId: faculty.id,
        date: newSlot.date,
        time: newSlot.time,
        status: 'available'
      });
      setEvaluationSlots([...evaluationSlots, {
        id: docRef.id,
        faculty: newSlot.faculty,
        facultyId: faculty.id,
        date: newSlot.date,
        time: newSlot.time,
        status: 'available'
      }]);
      setNewSlot({ faculty: '', date: '', time: '' });
      // Log the activity
      await addDoc(collection(db, "activityLog"), {
        action: `Added evaluation slot for ${newSlot.faculty}`,
        time: new Date().toLocaleString()
      });
    } catch (error) {
      alert("Error adding evaluation slot.");
    }
  };

  const deleteEvaluationSlot = async (id) => {
    try {
      const slot = evaluationSlots.find(s => s.id === id);
      await deleteDoc(doc(db, 'evaluationSlots', id));
      setEvaluationSlots(evaluationSlots.filter(slot => slot.id !== id));
      // Log the activity
      await addDoc(collection(db, "activityLog"), {
        action: `Removed evaluation slot for ${slot?.faculty || id}`,
        time: new Date().toLocaleString()
      });
    } catch (error) {
      alert("Error deleting evaluation slot.");
    }
  };

  // Enhancement: Stats
  const getProjectStats = () => {
    const statusCounts = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    return statusCounts;
  };

  // Enhancement: Filtered lists
  const filteredFaculty = facultyMembers.filter(f =>
    f.name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
    f.domain.toLowerCase().includes(searchFaculty.toLowerCase())
  );
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchProject.toLowerCase()) ||
    (p.studentName && p.studentName.toLowerCase().includes(searchProject.toLowerCase()))
  );

  // Enhancement: Status and domain color helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'revision': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getDomainColor = (domain) => {
    const colors = {
      'AI': 'bg-purple-100 text-purple-800',
      'Cybersecurity': 'bg-green-100 text-green-800',
      'Data Science': 'bg-blue-100 text-blue-800',
      'Networks': 'bg-orange-100 text-orange-800',
      'Web Development': 'bg-red-100 text-red-800',
      'Machine Learning': 'bg-indigo-100 text-indigo-800',
      'Cloud Computing': 'bg-cyan-100 text-cyan-800',
      'Software Engineering': 'bg-amber-100 text-amber-800',
      'IoT': 'bg-emerald-100 text-emerald-800'
    };
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };

  // Enhancement: Quick Approve All Pending Projects
  const approveAllPending = async () => {
    const pending = projects.filter(p => p.status === 'pending');
    for (const project of pending) {
      await updateProjectStatus(project.id, 'approved');
    }
    alert('All pending projects approved!');
  };

  // Add to activity log helper
  const logActivity = (action) => {
    setActivityLog(prev => [
      { id: Date.now(), action, time: new Date().toLocaleString() },
      ...prev
    ]);
  };

  // Enhance existing actions to log activity and notify
  const enhancedAddFacultyMember = async () => {
    await addFacultyMember();
    logActivity(`Added faculty: ${newFaculty.name}`);
    setNotifications(prev => [
      { id: Date.now(), message: `Faculty ${newFaculty.name} added.`, time: "Just now" },
      ...prev
    ]);
  };
  const enhancedDeleteFacultyMember = async (id) => {
    const member = facultyMembers.find(f => f.id === id);
    await deleteFacultyMember(id);
    logActivity(`Removed faculty: ${member?.name || id}`);
  };
  const enhancedAddEvaluationSlot = async () => {
    await addEvaluationSlot();
    logActivity(`Added evaluation slot for ${newSlot.faculty}`);
  };
  const enhancedDeleteEvaluationSlot = async (id) => {
    const slot = evaluationSlots.find(s => s.id === id);
    await deleteEvaluationSlot(id);
    logActivity(`Removed evaluation slot for ${slot?.faculty || id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">FYP Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              Notifications
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">{notifications.length}</span>
              )}
            </button>
            <button
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              onClick={() => setShowActivityLog(!showActivityLog)}
            >
              Activity Log
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium shadow">A</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="bg-white/80 shadow rounded-lg mb-8">
          <nav className="flex space-x-4 p-4 overflow-x-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('faculty')} className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab === 'faculty' ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>Faculty Management</button>
            <button onClick={() => setActiveTab('projects')} className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>Project Approvals</button>
            <button onClick={() => setActiveTab('evaluations')} className={`px-4 py-2 rounded-md text-sm font-semibold ${activeTab === 'evaluations' ? 'bg-indigo-600 text-white' : 'text-indigo-700 hover:bg-indigo-50'}`}>Evaluation Slots</button>
          </nav>
        </div>

        {/* Stats Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fade-in-up">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-indigo-600"
                onClick={() => setShowStats(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-900">Project Status Stats</h2>
              <ul className="space-y-2">
                {Object.entries(getProjectStats()).map(([status, count]) => (
                  <li key={status} className="flex justify-between">
                    <span className={`capitalize px-2 py-1 rounded ${getStatusColor(status)}`}>{status}</span>
                    <span className="font-bold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Notifications Modal */}
        {showNotifications && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative animate-fade-in-up">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-indigo-600"
                onClick={() => setShowNotifications(false)}
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 text-indigo-900">Notifications</h2>
              <ul className="space-y-2">
                {notifications.length === 0 && <li className="text-gray-400">No notifications.</li>}
                {notifications.map(n => (
                  <li key={n.id} className="text-sm text-gray-700 flex justify-between">
                    <span>{n.message}</span>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Activity Log Modal */}
        {showActivityLog && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in-up">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-indigo-600"
                onClick={() => setShowActivityLog(false)}
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 text-indigo-900">Activity Log</h2>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {activityLog.length === 0 && <li className="text-gray-400">No recent activity.</li>}
                {activityLog.map(log => (
                  <li key={log.id} className="text-sm text-gray-700 flex justify-between">
                    <span>{log.action}</span>
                    <span className="text-xs text-gray-400">{log.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <span className="text-4xl font-bold text-indigo-700">{projects.length}</span>
                <span className="text-gray-600 mt-2">Total Projects</span>
              </div>
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <span className="text-4xl font-bold text-indigo-700">{facultyMembers.length}</span>
                <span className="text-gray-600 mt-2">Faculty Members</span>
              </div>
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <span className="text-4xl font-bold text-indigo-700">{evaluationSlots.length}</span>
                <span className="text-gray-600 mt-2">Evaluation Slots</span>
              </div>
            </div>
            {/* Enhanced Recent Project Activities */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-indigo-900">Recent FYP Activities</h3>
              <div className="divide-y">
                {/* New hardcoded recent activities */}
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-indigo-800">Smart Attendance System</p>
                    <p className="text-sm text-gray-500">
                      Ali Raza supervised by <span className="font-semibold text-blue-700">Faizan</span>
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    approved
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-indigo-800">IoT-Based Home Automation</p>
                    <p className="text-sm text-gray-500">
                      Sara Ahmed supervised by <span className="font-semibold text-blue-700">Faizan</span>
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    pending
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-indigo-800">AI Chatbot for University</p>
                    <p className="text-sm text-gray-500">
                      Bilal Khan supervised by <span className="font-semibold text-blue-700">Faizan</span>
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    revision
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-indigo-800">Secure File Sharing Platform</p>
                    <p className="text-sm text-gray-500">
                      Ayesha Siddiqui supervised by <span className="font-semibold text-blue-700">Faizan</span>
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    rejected
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-indigo-800">Cloud-Based Library System</p>
                    <p className="text-sm text-gray-500">
                      Hamza Tariq supervised by <span className="font-semibold text-blue-700">Faizan</span>
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    approved
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={approveAllPending}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Approve All Pending
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Faculty Management Tab */}
        {activeTab === 'faculty' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-indigo-900">Faculty Members</h3>
                <input
                  type="text"
                  placeholder="Search by name or domain..."
                  className="mt-2 px-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
                  value={searchFaculty}
                  onChange={e => setSearchFaculty(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFacultyForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Add New Faculty
              </button>
            </div>

            {showFacultyForm && (
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-md font-semibold mb-4">Add New Faculty Member</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.domain}
                      onChange={(e) => setNewFaculty({ ...newFaculty, domain: e.target.value })}
                    >
                      <option value="">Select Domain</option>
                      <option value="AI">Artificial Intelligence</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Networks">Networks</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="IoT">Internet of Things</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.slots}
                      onChange={(e) => setNewFaculty({ ...newFaculty, slots: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.officeHours}
                      onChange={(e) => setNewFaculty({ ...newFaculty, officeHours: e.target.value })}
                      placeholder="Example: Mon 10-12, Wed 2-4"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowFacultyForm(false);
                      setNewFaculty({ name: '', email: '', domain: '', slots: 0, officeHours: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addFacultyMember}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Domain</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Slots</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Office Hours</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFaculty.map(member => (
                    <tr key={member.id}>
                      <td className="px-4 py-2">{member.name}</td>
                      <td className="px-4 py-2">{member.email}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDomainColor(member.domain)}`}>
                          {member.domain}
                        </span>
                      </td>
                      <td className="px-4 py-2">{member.slots}</td>
                      <td className="px-4 py-2">{member.officeHours}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => deleteFacultyMember(member.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredFaculty.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-400">No faculty members found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Project Approvals Tab */}
        {activeTab === 'projects' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h3 className="text-lg font-bold text-indigo-900">Project Approvals</h3>
              <input
                type="text"
                placeholder="Search by title or student..."
                className="px-3 py-2 border border-gray-300 rounded-md w-full md:w-64"
                value={searchProject}
                onChange={e => setSearchProject(e.target.value)}
              />
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Supervisor</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProjects.map(project => (
                    <tr key={project.id}>
                      <td className="px-4 py-2">{project.title}</td>
                      <td className="px-4 py-2">{project.studentName}</td>
                      <td className="px-4 py-2">Faizan</td> {/* Supervisor name changed to Faizan */}
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() => updateProjectStatus(project.id, 'approved')}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateProjectStatus(project.id, 'revision')}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-xs"
                        >
                          Revision
                        </button>
                        <button
                          onClick={() => updateProjectStatus(project.id, 'rejected')}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-xs"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-400">No projects found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Comments Section */}
              <div className="mt-8">
                <h4 className="text-md font-semibold mb-2">Project Comments</h4>
                {filteredProjects.map(project => (
                  <div key={project.id} className="mb-6">
                    <div className="flex items-center mb-1">
                      <span className="font-medium">{project.title}</span>
                      <button
                        className="ml-3 text-indigo-600 text-xs underline"
                        onClick={() => setCommentProjectId(commentProjectId === project.id ? null : project.id)}
                      >
                        {commentProjectId === project.id ? 'Hide' : 'Add/View Comments'}
                      </button>
                    </div>
                    {commentProjectId === project.id && (
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="space-y-2 mb-2">
                          {project.comments && project.comments.length > 0 ? (
                            project.comments.map((c, idx) => (
                              <div key={idx} className="text-sm text-gray-700">
                                <span className="font-semibold">{c.author}:</span> {c.text} <span className="text-gray-400 text-xs">({c.date})</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-400">No comments yet.</div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                          />
                          <button
                            onClick={() => addComment(project.id)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Evaluation Slots Tab */}
        {activeTab === 'evaluations' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h3 className="text-lg font-bold text-indigo-900">Evaluation Slots</h3>
              <button
                onClick={addEvaluationSlot}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Add Slot
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={newSlot.faculty}
                  onChange={e => setNewSlot({ ...newSlot, faculty: e.target.value })}
                >
                  <option value="">Select Faculty</option>
                  {facultyMembers.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={newSlot.date}
                  onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                />
                <input
                  type="time"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={newSlot.time}
                  onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
                />
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {evaluationSlots.map(slot => (
                    <tr key={slot.id}>
                      <td className="px-4 py-2">{slot.faculty}</td>
                      <td className="px-4 py-2">{slot.date}</td>
                      <td className="px-4 py-2">{slot.time}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slot.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => deleteEvaluationSlot(slot.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {evaluationSlots.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-400">No evaluation slots found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white px-8 py-6 rounded shadow text-indigo-700 font-bold animate-fade-in-up">
              Loading...
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
