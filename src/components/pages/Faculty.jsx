import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    domain: '',
    slots: '',
    officeHours: ''
  });

  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('faculty');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch faculty data
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'faculty'));
        let facultyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Add all default members if not already present
        const defaultFaculty = [
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
        defaultFaculty.forEach(member => {
          if (!facultyData.some(f => f.email === member.email)) {
            facultyData.push(member);
          }
        });

        setFaculty(facultyData);
      } catch (error) {
        console.error("Error fetching faculty: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  // Fetch proposals data
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        // You can clear all previous proposals here if you want to reset Firestore (optional, not recommended for production)
        // Otherwise, just set new proposals for display
        const newProposals = [
          {
            id: "p1",
            title: "Smart Attendance System",
            description: "A system using facial recognition for automated attendance.",
            studentName: "Ali Raza",
            supervisor: "Faizan",
            status: "pending",
            comments: [
              { author: "Admin", text: "Please add hardware details.", date: "2024-06-01" }
            ]
          },
          {
            id: "p2",
            title: "IoT-Based Home Automation",
            description: "Control home appliances remotely using IoT.",
            studentName: "Sara Ahmed",
            supervisor: "Ahmad",
            status: "accepted",
            comments: []
          },
          {
            id: "p3",
            title: "AI Chatbot for University",
            description: "A chatbot to answer student queries using AI.",
            studentName: "Bilal Khan",
            supervisor: "Salman Irfan",
            status: "revision",
            comments: [
              { author: "Admin", text: "Clarify the training dataset.", date: "2024-06-02" }
            ]
          },
          {
            id: "p4",
            title: "Secure File Sharing Platform",
            description: "A platform for secure file sharing among students and faculty.",
            studentName: "Ayesha Siddiqui",
            supervisor: "Sara Khan",
            status: "rejected",
            comments: [
              { author: "Admin", text: "Topic is too broad, please narrow down.", date: "2024-06-03" }
            ]
          },
          {
            id: "p5",
            title: "Cloud-Based Library System",
            description: "A library management system hosted on the cloud.",
            studentName: "Hamza Tariq",
            supervisor: "Umar Farooq",
            status: "accepted",
            comments: []
          }
        ];
        setProposals(newProposals);
      } catch (error) {
        console.error("Error fetching proposals: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'ideas') {
      fetchProposals();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (formData.id) {
        const facultyDoc = doc(db, 'faculty', formData.id);
        await updateDoc(facultyDoc, {
          name: formData.name,
          email: formData.email,
          domain: formData.domain,
          slots: formData.slots,
          officeHours: formData.officeHours
        });
        setFaculty(faculty.map(f => f.id === formData.id ? { ...formData } : f));
      } else {
        const docRef = await addDoc(collection(db, 'faculty'), {
          name: formData.name,
          email: formData.email,
          domain: formData.domain,
          slots: formData.slots,
          officeHours: formData.officeHours
        });
        setFaculty([...faculty, { ...formData, id: docRef.id }]);
      }
      
      setFormData({ id: null, name: '', email: '', domain: '', slots: '', officeHours: '' });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving faculty: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (facultyMember) => {
    setFormData(facultyMember);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'faculty', id));
      setFaculty(faculty.filter(f => f.id !== id));
    } catch (error) {
      console.error("Error deleting faculty: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProposalStatus = async (id, status) => {
    setLoading(true);
    try {
      const proposalDoc = doc(db, 'proposals', id);
      await updateDoc(proposalDoc, { status });
      setProposals(proposals.map(proposal => 
        proposal.id === id ? { ...proposal, status } : proposal
      ));
    } catch (error) {
      console.error("Error updating proposal status: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'accepted': 'bg-teal-100 text-teal-800',
      'rejected': 'bg-rose-100 text-rose-800',
      'pending': 'bg-amber-100 text-amber-800',
      'revision': 'bg-sky-100 text-sky-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDomainColor = (domain) => {
    const colors = {
      'AI': 'bg-violet-100 text-violet-800',
      'Cybersecurity': 'bg-emerald-100 text-emerald-800',
      'Data Science': 'bg-blue-100 text-blue-800',
      'Networks': 'bg-orange-100 text-orange-800',
      'Web Development': 'bg-red-100 text-red-800',
      'Machine Learning': 'bg-indigo-100 text-indigo-800',
      'Cloud Computing': 'bg-cyan-100 text-cyan-800',
      'Software Engineering': 'bg-amber-100 text-amber-800',
      'IoT': 'bg-green-100 text-green-800'
    };
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || member.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const domains = [...new Set(faculty.map(member => member.domain))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Glass Morphism Effect */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Faculty Portal</h1>
              <p className="mt-1 text-gray-600">
                {activeTab === 'faculty' ? 'Manage faculty members and availability' : 'Review student project proposals'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('faculty')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'faculty' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Faculty
              </button>
              <button
                onClick={() => setActiveTab('ideas')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'ideas' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Proposals
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar with Glass Effect */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 border border-gray-200/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={activeTab === 'faculty' ? "Search faculty..." : "Search proposals..."}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300/50 rounded-lg bg-white/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeTab === 'faculty' && (
              <div className="flex items-center space-x-4">
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-lg border bg-white/50"
                >
                  <option value="all">All Domains</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="whitespace-nowrap inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Faculty
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}

        {/* Faculty Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-gray-200/50">
              <div className="px-6 py-4 border-b border-gray-200/50 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {formData.id ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h2>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormData({ id: null, name: '', email: '', domain: '', slots: '', officeHours: '' });
                  }}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300/50 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border bg-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300/50 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border bg-white/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                      Research Domain
                    </label>
                    <select
                      id="domain"
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300/50 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border bg-white/50"
                      required
                    >
                      <option value="">Select a domain</option>
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
                    <label htmlFor="slots" className="block text-sm font-medium text-gray-700 mb-1">
                      Available Slots
                    </label>
                    <input
                      type="number"
                      name="slots"
                      id="slots"
                      min="0"
                      value={formData.slots}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300/50 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border bg-white/50"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="officeHours" className="block text-sm font-medium text-gray-700 mb-1">
                      Office Hours
                    </label>
                    <input
                      type="text"
                      name="officeHours"
                      id="officeHours"
                      value={formData.officeHours}
                      onChange={handleInputChange}
                      placeholder="e.g. Monday 10am-12pm, Wednesday 2pm-4pm"
                      className="block w-full rounded-lg border-gray-300/50 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 border bg-white/50"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setFormData({ id: null, name: '', email: '', domain: '', slots: '', officeHours: '' });
                    }}
                    className="px-4 py-2 border border-gray-300/50 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    {formData.id ? 'Update Faculty' : 'Add Faculty'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Faculty Tab Content */}
        {activeTab === 'faculty' ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Faculty Members <span className="text-gray-500 font-normal">({filteredFaculty.length})</span>
              </h2>
            </div>
            
            {filteredFaculty.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No faculty members found</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm || filterDomain !== 'all' ? 'Try adjusting your search or filter' : 'Get started by adding your first faculty member'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Faculty Member
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50">
                {filteredFaculty.map((member) => (
                  <div key={member.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDomainColor(member.domain)}`}>
                            {member.domain}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-900">{member.slots}</span>
                          <p className="text-xs text-gray-500">Slots</p>
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-900">{member.officeHours}</span>
                          <p className="text-xs text-gray-500">Hours</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-2 text-teal-600 hover:text-teal-800 rounded-lg hover:bg-teal-50 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Proposals Tab Content */
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/50">
              <h2 className="text-lg font-semibold text-gray-800">
                Project Proposals <span className="text-gray-500 font-normal">({proposals.length})</span>
              </h2>
            </div>
            
            {proposals.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No proposals submitted</h3>
                <p className="mt-2 text-gray-500">Students haven't submitted any project proposals yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{proposal.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{proposal.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium text-gray-700">{proposal.studentName}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-gray-700">{proposal.supervisor || 'Not assigned'}</span>
                        </div>
                        {proposal.comments && proposal.comments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {proposal.comments.map((comment, idx) => (
                              <div key={idx} className="bg-gray-50/50 p-3 rounded-lg">
                                <p className="text-sm text-gray-700">{comment.text}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  — {comment.author}, {comment.date}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            onClick={() => updateProposalStatus(proposal.id, 'accepted')}
                            className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-lg hover:bg-emerald-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateProposalStatus(proposal.id, 'revision')}
                            className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-medium rounded-lg hover:bg-sky-200 transition-colors"
                          >
                            Request Revision
                          </button>
                          <button
                            onClick={() => updateProposalStatus(proposal.id, 'rejected')}
                            className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-medium rounded-lg hover:bg-rose-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Faculty;

/*
  If you have any hardcoded "wahajch" or "wahj" in your proposals or faculty data, replace them with random names.
  For example, if you have:
  { studentName: "wahajch", ... }
  Change to:
  { studentName: "Ali Raza", ... }

  If you have any default proposals or faculty, update them like this:
  Example for proposals:
  const defaultProposals = [
    {
      id: "1",
      title: "Smart Attendance System",
      studentName: "Ali Raza",
      supervisor: "Faizan",
      status: "pending",
      comments: []
    },
    {
      id: "2",
      title: "IoT-Based Home Automation",
      studentName: "Sara Ahmed",
      supervisor: "Ahmad",
      status: "accepted",
      comments: []
    }
  ];

  Example for faculty:
  const defaultFaculty = [
    {
      id: "f1",
      name: "Dr. Salman Irfan",
      email: "salman.irfan@example.com",
      domain: "AI",
      slots: 3,
      officeHours: "Mon 10-12, Wed 2-4"
    },
    {
      id: "f2",
      name: "Dr. Faizan Shaukat",
      email: "faizan.shaukat@example.com",
      domain: "Data Science",
      slots: 2,
      officeHours: "Tue 11-1, Thu 3-5"
    }
  ];
*/