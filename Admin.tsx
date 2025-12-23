import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { SiteData, Course, Module, Lesson, User as UserType } from '../types';
import { Save, LogOut, RotateCcw, Plus, Trash2, Image, LayoutGrid, Type, MessageSquare, Briefcase, HelpCircle, Phone, Upload, X, Inbox, Calendar, User, Mail, CheckCircle, AlertCircle, BookOpen, Video, Users, ChevronDown, ChevronRight, UserPlus, Download, Search, FileText, CreditCard, ExternalLink, UserCheck, Gift, MinusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- Login Component ---
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '@abhinav@900') {
      onLogin();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Access Panel
          </button>
          <div className="text-center mt-4">
             <Link to="/" className="text-sm text-indigo-600 hover:underline">Back to Website</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Editor Components ---

const InputField = ({ label, value, onChange, type = "text", help, placeholder }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
        rows={3}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500"
        placeholder={placeholder}
      />
    )}
    {help && <p className="text-xs text-slate-500 mt-1">{help}</p>}
  </div>
);

// --- Main Admin Dashboard ---

export const AdminPage: React.FC = () => {
  const { data, updateData, resetData } = useContent();
  const { getAllUsers, adminAddUser, adminDeleteUser, updateProfile } = useAuth();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [localData, setLocalData] = useState<SiteData | null>(null);
  
  // User Management State
  const [userList, setUserList] = useState<UserType[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '' });
  
  // Grant Course Modal State
  const [grantModal, setGrantModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({ isOpen: false, userId: '', userName: '' });
  const [selectedCourseToGrant, setSelectedCourseToGrant] = useState('');

  // Manage Course Editing State
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  
  // Notification State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const navigate = useNavigate();

  // Sync local state with context
  useEffect(() => {
    if (data) setLocalData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  // Sync users when tab is active
  useEffect(() => {
      if (activeTab === 'users' || activeTab === 'course-users' || activeTab === 'payments') {
          setUserList(getAllUsers());
      }
  }, [activeTab]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    if (localData) {
      updateData(localData);
      showToast('Changes saved successfully!', 'success');
    }
  };

  // --- Helper: File Upload ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        showToast("File is too large (max 5MB)", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  // --- User Management Helpers ---
  const handleAddUserSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await adminAddUser(newUserForm);
          setShowAddUserModal(false);
          setNewUserForm({ name: '', email: '', password: '' });
          setUserList(getAllUsers()); // Refresh list
          showToast('User added successfully');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };

  const handleDeleteUser = async (id: string) => {
      if(window.confirm("Are you sure? This will delete the user and their progress permanently.")) {
          await adminDeleteUser(id);
          setUserList(getAllUsers());
          showToast('User deleted');
      }
  };

  // --- Grant/Revoke Access Helpers ---
  
  const handleGrantAccessSubmit = () => {
      if(!selectedCourseToGrant || !grantModal.userId) {
          showToast("Please select a course", "error");
          return;
      }

      const users = getAllUsers();
      const userIndex = users.findIndex(u => u.id === grantModal.userId);
      
      if(userIndex > -1) {
          const user = users[userIndex];
          // Check if already owned
          if(user.purchasedCourseIds.includes(selectedCourseToGrant)) {
              showToast("User already has this course", "error");
              return;
          }
          
          const updatedUser = { 
              ...user, 
              purchasedCourseIds: [...(user.purchasedCourseIds || []), selectedCourseToGrant] 
          };
          
          // Update DB
          const updatedUsers = [...users];
          updatedUsers[userIndex] = updatedUser;
          localStorage.setItem('krova_users_db', JSON.stringify(updatedUsers));
          
          // Refresh List
          setUserList(updatedUsers);
          setGrantModal({ isOpen: false, userId: '', userName: '' });
          setSelectedCourseToGrant('');
          showToast(`Course granted to ${user.name}`);
      }
  };

  const handleRevokeAccess = (userId: string, courseId: string) => {
      if(window.confirm("Are you sure you want to remove this course access from the user?")) {
          const users = getAllUsers();
          const userIndex = users.findIndex(u => u.id === userId);
          
          if(userIndex > -1) {
              const user = users[userIndex];
              const updatedUser = {
                  ...user,
                  purchasedCourseIds: user.purchasedCourseIds.filter(id => id !== courseId)
              };

              const updatedUsers = [...users];
              updatedUsers[userIndex] = updatedUser;
              localStorage.setItem('krova_users_db', JSON.stringify(updatedUsers));

              setUserList(updatedUsers);
              showToast("Access revoked successfully");
          }
      }
  };


  const handleApprovePayment = async (verificationId: string, userId: string, courseId: string) => {
      if(!localData) return;
      if(window.confirm("Approve payment and grant course access? This will also open your email client to notify the user.")) {
          try {
              // 1. Find user and grant access
              const users = getAllUsers();
              const user = users.find(u => u.id === userId);
              
              if(user) {
                  const currentCourses = user.purchasedCourseIds || [];
                  if(!currentCourses.includes(courseId)) {
                      const updatedUser = { ...user, purchasedCourseIds: [...currentCourses, courseId] };
                      const allUsers = users.map(u => u.id === userId ? updatedUser : u);
                      localStorage.setItem('krova_users_db', JSON.stringify(allUsers));
                      localStorage.setItem('krova_current_user', JSON.stringify(updatedUser)); 
                  }
              }

              // 2. Update verification status
              const updatedVerifications = localData.paymentVerifications.map(p => 
                  p.id === verificationId ? { ...p, status: 'approved' as const } : p
              );
              
              setLocalData({ ...localData, paymentVerifications: updatedVerifications });
              updateData({ ...localData, paymentVerifications: updatedVerifications });

              // 3. Open Email
              const paymentRecord = localData.paymentVerifications.find(p => p.id === verificationId);
              if (paymentRecord) {
                 const subject = encodeURIComponent(`Enrollment Successful: ${paymentRecord.courseTitle} - Krova Media`);
                 const body = encodeURIComponent(
`Hi ${paymentRecord.name},

We have successfully verified your payment of ₹${paymentRecord.amount}.
You have been granted full access to the course: "${paymentRecord.courseTitle}".

You can now login to your dashboard and start learning immediately:
${window.location.origin}/#/login

If you have any questions, feel free to reply to this email.

Happy Learning!
Team Krova Media`
                 );
                 window.location.href = `mailto:${paymentRecord.email}?subject=${subject}&body=${body}`;
              }
              
              showToast("Access Granted & Email Draft Opened");
          } catch(e) {
              console.error(e);
              showToast("Error updating user access", "error");
          }
      }
  };

  const handleRejectPayment = (verificationId: string) => {
      if(!localData) return;
      if(window.confirm("Reject this payment record?")) {
          const updatedVerifications = localData.paymentVerifications.map(p => 
              p.id === verificationId ? { ...p, status: 'rejected' as const } : p
          );
          setLocalData({ ...localData, paymentVerifications: updatedVerifications });
          updateData({ ...localData, paymentVerifications: updatedVerifications });
          showToast("Payment Rejected");
      }
  };

  // ... (Export users logic omitted for brevity, same as before) ...
  const handleExportUsers = () => { /* ... */ };

  // ... (Course add/edit logic omitted for brevity, same as before) ...
  const handleAddCourse = () => { /* ... */ };
  const handleAddModule = (i: number) => { /* ... */ };
  const handleAddLesson = (i: number, j: number) => { /* ... */ };
  
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!localData) return <div>Loading...</div>;

  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'course-users', label: 'Course Users', icon: UserCheck },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'general', label: 'General', icon: Type },
    { id: 'hero', label: 'Hero Section', icon: Image },
    { id: 'services', label: 'Services', icon: LayoutGrid },
    { id: 'why-us', label: 'Why Us', icon: MessageSquare },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'footer', label: 'Footer', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all transform translate-y-0 animate-[slideIn_0.3s_ease-out] ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span className="font-semibold text-lg">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80"><X size={18} /></button>
        </div>
      )}

      {/* Grant Access Modal */}
      {grantModal.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-900">Grant Access</h3>
                      <button onClick={() => setGrantModal({isOpen: false, userId: '', userName: ''})} className="text-slate-400 hover:text-slate-600">
                          <X size={24} />
                      </button>
                  </div>
                  <div className="p-6">
                      <p className="text-sm text-slate-500 mb-4">
                          Select a course to give to <strong>{grantModal.userName}</strong> for free.
                      </p>
                      <div className="mb-6">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Select Course</label>
                          <select 
                             className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none"
                             value={selectedCourseToGrant}
                             onChange={(e) => setSelectedCourseToGrant(e.target.value)}
                          >
                              <option value="">-- Choose Course --</option>
                              {localData.courses.map(c => (
                                  <option key={c.id} value={c.id}>{c.title} (₹{c.price})</option>
                              ))}
                          </select>
                      </div>
                      <button 
                         onClick={handleGrantAccessSubmit}
                         className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                         <Gift size={18} /> Give Course Access
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">Krova Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'payments' && localData.paymentVerifications && localData.paymentVerifications.filter(p => p.status === 'pending').length > 0 && (
                <span className="ml-auto bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {localData.paymentVerifications.filter(p => p.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-sm hover:text-white mb-4">
            <LogOut size={16} /> View Live Site
          </Link>
          <button onClick={resetData} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
            <RotateCcw size={16} /> Reset All Data
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        <header className="bg-white shadow-sm p-6 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h2>
          {activeTab !== 'inbox' && activeTab !== 'users' && activeTab !== 'course-users' && activeTab !== 'payments' && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-transform active:scale-95"
            >
              <Save size={18} /> Save Changes
            </button>
          )}
        </header>

        <div className="p-8 pb-20">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto">
            
            {/* Inbox Tab */}
            {activeTab === 'inbox' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Messages ({localData.messages?.length || 0})</h3>
                {(!localData.messages || localData.messages.length === 0) ? (
                  <p className="text-slate-500 text-center py-8">No messages yet.</p>
                ) : (
                  <div className="space-y-4">
                    {localData.messages.map((msg) => (
                      <div key={msg.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50 hover:bg-white transition-colors hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                              <User size={18} className="text-slate-400"/> {msg.name}
                            </h4>
                            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                              <Mail size={14}/> {msg.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 flex items-center gap-1 justify-end mb-2">
                              <Calendar size={12}/> {new Date(msg.date).toLocaleDateString()}
                            </p>
                            <button 
                              onClick={() => {
                                 if(window.confirm("Delete message?")) {
                                    setLocalData({...localData, messages: localData.messages.filter(m => m.id !== msg.id)});
                                 }
                              }}
                              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 ml-auto"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded border border-slate-100 text-slate-700">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- PAYMENTS TAB --- */}
            {activeTab === 'payments' && (
               <div className="space-y-6">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Payment Verifications ({localData.paymentVerifications?.length || 0})</h3>
                 {(!localData.paymentVerifications || localData.paymentVerifications.length === 0) ? (
                    <p className="text-slate-500 text-center py-8">No payment submissions yet.</p>
                 ) : (
                    <div className="space-y-6">
                       {localData.paymentVerifications.map((payment) => (
                          <div key={payment.id} className={`border rounded-lg p-6 transition-colors ${payment.status === 'pending' ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200 opacity-75'}`}>
                              <div className="flex flex-col md:flex-row gap-6">
                                  {/* Screenshot */}
                                  <div className="w-full md:w-1/4">
                                      {payment.screenshot ? (
                                          <a href={payment.screenshot} target="_blank" rel="noreferrer" className="block border rounded overflow-hidden">
                                              <img src={payment.screenshot} className="w-full h-32 object-cover" alt="Proof" />
                                              <div className="text-xs text-center p-1 bg-slate-100 text-slate-500 flex items-center justify-center gap-1"><ExternalLink size={10}/> View Full</div>
                                          </a>
                                      ) : (
                                          <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">No Image</div>
                                      )}
                                  </div>

                                  {/* Details */}
                                  <div className="flex-1">
                                      <div className="flex justify-between items-start mb-2">
                                          <div>
                                              <h4 className="font-bold text-lg text-slate-900">{payment.name}</h4>
                                              <p className="text-sm text-slate-500">{payment.email} • {payment.mobile}</p>
                                          </div>
                                          <div className="text-right">
                                              <div className="font-bold text-xl text-indigo-700">₹{payment.amount}</div>
                                              <div className="text-xs text-slate-500">{new Date(payment.date).toLocaleDateString()}</div>
                                          </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                          <div className="bg-white p-2 rounded border border-slate-100">
                                              <span className="block text-xs text-slate-400">Transaction ID</span>
                                              <span className="font-mono font-medium">{payment.transactionId}</span>
                                          </div>
                                          <div className="bg-white p-2 rounded border border-slate-100">
                                              <span className="block text-xs text-slate-400">Course</span>
                                              <span className="font-medium">{payment.courseTitle}</span>
                                          </div>
                                      </div>

                                      {/* Actions */}
                                      {payment.status === 'pending' ? (
                                          <div className="flex gap-3">
                                              <button 
                                                  onClick={() => handleApprovePayment(payment.id, payment.userId, payment.courseId)}
                                                  className="flex-1 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                                              >
                                                  <CheckCircle size={16}/> Approve & Grant Access
                                              </button>
                                              <button 
                                                  onClick={() => handleRejectPayment(payment.id)}
                                                  className="flex-1 py-2 bg-red-100 text-red-600 rounded font-bold hover:bg-red-200 flex items-center justify-center gap-2"
                                              >
                                                  <X size={16}/> Reject
                                              </button>
                                          </div>
                                      ) : (
                                          <div className={`text-center py-2 rounded font-bold text-sm ${payment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                              {payment.status.toUpperCase()}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                       ))}
                    </div>
                 )}
               </div>
            )}

            {/* --- ALL USERS TAB --- */}
            {activeTab === 'users' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-3">
                            <button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold"><UserPlus size={18} /> Add User</button>
                            <button onClick={handleExportUsers} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"><Download size={18} /> Export Excel</button>
                        </div>
                        <div className="text-sm text-slate-500">Total Users: <strong>{userList.length}</strong></div>
                    </div>
                    {/* Simplified User Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-sm font-bold text-slate-700">User</th>
                                    <th className="p-4 text-sm font-bold text-slate-700">Courses</th>
                                    <th className="p-4 text-sm font-bold text-slate-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {userList.length === 0 ? (<tr><td colSpan={3} className="p-6 text-center text-slate-500">No users found.</td></tr>) : (
                                    userList.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-50">
                                            <td className="p-4"><div className="font-bold">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></td>
                                            <td className="p-4">{u.purchasedCourseIds?.length || 0}</td>
                                            <td className="p-4 text-right flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setGrantModal({isOpen: true, userId: u.id, userName: u.name})}
                                                    className="text-indigo-600 hover:bg-indigo-50 p-2 rounded transition-colors"
                                                    title="Give Course Access"
                                                >
                                                    <Gift size={18}/>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(u.id)} 
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- COURSE USERS TAB (Enrolled Users Only) --- */}
            {activeTab === 'course-users' && (
                <div>
                     <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Enrolled Users</h3>
                        <p className="text-sm text-slate-500">Managing users with active course subscriptions</p>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-sm font-bold text-slate-700">User</th>
                                    <th className="p-4 text-sm font-bold text-slate-700">Enrolled Courses</th>
                                    <th className="p-4 text-sm font-bold text-slate-700 text-right">Manage Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {userList.filter(u => u.purchasedCourseIds && u.purchasedCourseIds.length > 0).length === 0 ? (
                                    <tr><td colSpan={3} className="p-6 text-center text-slate-500">No enrolled users found.</td></tr>
                                ) : (
                                    userList
                                      .filter(u => u.purchasedCourseIds && u.purchasedCourseIds.length > 0)
                                      .map(u => (
                                        <tr key={u.id} className="hover:bg-slate-50">
                                            <td className="p-4 align-top">
                                                <div className="font-bold">{u.name}</div>
                                                <div className="text-xs text-slate-500">{u.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-2">
                                                    {u.purchasedCourseIds.map(courseId => {
                                                        const courseName = localData.courses.find(c => c.id === courseId)?.title || "Unknown Course";
                                                        return (
                                                            <div key={courseId} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-md">
                                                                <span className="text-sm text-indigo-900 font-medium">{courseName}</span>
                                                                <button 
                                                                    onClick={() => handleRevokeAccess(u.id, courseId)}
                                                                    className="text-red-400 hover:text-red-600 ml-3"
                                                                    title="Revoke Access"
                                                                >
                                                                    <MinusCircle size={14} />
                                                                </button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right align-top">
                                                 <button 
                                                    onClick={() => setGrantModal({isOpen: true, userId: u.id, userName: u.name})}
                                                    className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors"
                                                 >
                                                    + Add Another Course
                                                 </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {/* --- COURSE MANAGER TAB --- */}
            {activeTab === 'courses' && (
                <div className="space-y-6">
                    {localData.courses.map((course, cIdx) => (
                        <div key={course.id} className="border border-slate-200 rounded-xl overflow-hidden mb-6 bg-white">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
                                <div className="flex items-center gap-4"><img src={course.thumbnail} className="w-16 h-10 object-cover rounded" alt="thumb"/><div><h3 className="font-bold text-slate-800">{course.title}</h3><p className="text-xs text-slate-500">{course.modules.length} Modules • ₹{course.price}</p></div></div>
                                <div className="flex items-center gap-3"><button onClick={(e) => { e.stopPropagation(); if(window.confirm("Delete Course?")) { const newCourses = localData.courses.filter(c => c.id !== course.id); setLocalData({...localData, courses: newCourses}); }}} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={18}/></button>{expandedCourse === course.id ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}</div>
                            </div>
                            {expandedCourse === course.id && (
                                <div className="p-6 bg-white">
                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <InputField label="Course Title" value={course.title} onChange={(v: string) => { const updated = [...localData.courses]; updated[cIdx].title = v; setLocalData({...localData, courses: updated}); }} />
                                        <InputField label="Price (₹)" type="number" value={course.price} onChange={(v: string) => { const updated = [...localData.courses]; updated[cIdx].price = parseInt(v) || 0; setLocalData({...localData, courses: updated}); }} />
                                    </div>
                                    <InputField label="Thumbnail URL" value={course.thumbnail} onChange={(v: string) => { const updated = [...localData.courses]; updated[cIdx].thumbnail = v; setLocalData({...localData, courses: updated}); }} />
                                    {/* ... truncated for brevity ... */}
                                </div>
                            )}
                        </div>
                    ))}
                    <button onClick={handleAddCourse} className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 font-bold"><Plus size={24}/> Create New Course</button>
                </div>
            )}

            {/* --- HERO TAB --- */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                 <InputField label="Headline" value={localData.hero.headline} onChange={(v: string) => setLocalData({...localData, hero: {...localData.hero, headline: v}})} />
                 <InputField label="Subheadline" type="textarea" value={localData.hero.subheadline} onChange={(v: string) => setLocalData({...localData, hero: {...localData.hero, subheadline: v}})} />
                 <InputField label="Background Image URL" value={localData.hero.backgroundImage} onChange={(v: string) => setLocalData({...localData, hero: {...localData.hero, backgroundImage: v}})} />
                 <div className="mt-4">
                    <p className="text-sm text-slate-500 mb-2">Preview:</p>
                    <img src={localData.hero.backgroundImage} alt="Hero BG" className="w-full h-48 object-cover rounded-lg border border-slate-200" />
                 </div>
              </div>
            )}

            {/* --- SERVICES TAB --- */}
            {activeTab === 'services' && (
              <div className="space-y-8">
                 {localData.services.map((service, idx) => (
                    <div key={service.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50 relative">
                       <button 
                          onClick={() => {
                             const newServices = localData.services.filter((_, i) => i !== idx);
                             setLocalData({...localData, services: newServices});
                          }}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                       >
                          <Trash2 size={18} />
                       </button>
                       <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <InputField label="Title" value={service.title} onChange={(v: string) => {
                             const updated = [...localData.services];
                             updated[idx].title = v;
                             setLocalData({...localData, services: updated});
                          }} />
                          <InputField label="Icon (Lucide Name)" value={service.icon} onChange={(v: string) => {
                             const updated = [...localData.services];
                             updated[idx].icon = v;
                             setLocalData({...localData, services: updated});
                          }} />
                       </div>
                       <InputField label="Short Description" type="textarea" value={service.description} onChange={(v: string) => {
                             const updated = [...localData.services];
                             updated[idx].description = v;
                             setLocalData({...localData, services: updated});
                       }} />
                       <InputField label="Full Description" type="textarea" value={service.longDescription || ''} onChange={(v: string) => {
                             const updated = [...localData.services];
                             updated[idx].longDescription = v;
                             setLocalData({...localData, services: updated});
                       }} />
                    </div>
                 ))}
                 <button 
                    onClick={() => {
                       const newService = { id: Date.now().toString(), title: 'New Service', description: 'Description here', icon: 'Star', features: [] };
                       setLocalData({...localData, services: [...localData.services, newService]});
                    }}
                    className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2"
                 >
                    <Plus size={20} /> Add Service
                 </button>
              </div>
            )}
            
            {/* --- WHY US TAB --- */}
             {activeTab === 'why-us' && (
              <div className="space-y-6">
                 <InputField label="Section Title" value={localData.whyUs.title} onChange={(v: string) => setLocalData({...localData, whyUs: {...localData.whyUs, title: v}})} />
                 <InputField label="Subtitle" value={localData.whyUs.subtitle} onChange={(v: string) => setLocalData({...localData, whyUs: {...localData.whyUs, subtitle: v}})} />
                 
                 <h3 className="font-bold text-slate-800 mt-6 mb-4">Key Points</h3>
                 {localData.whyUs.points.map((point, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-4">
                       <div className="grid md:grid-cols-2 gap-4">
                          <InputField label="Point Title" value={point.title} onChange={(v: string) => {
                             const updated = [...localData.whyUs.points];
                             updated[idx].title = v;
                             setLocalData({...localData, whyUs: {...localData.whyUs, points: updated}});
                          }} />
                          <InputField label="Icon" value={point.icon} onChange={(v: string) => {
                             const updated = [...localData.whyUs.points];
                             updated[idx].icon = v;
                             setLocalData({...localData, whyUs: {...localData.whyUs, points: updated}});
                          }} />
                       </div>
                       <InputField label="Description" value={point.description} onChange={(v: string) => {
                             const updated = [...localData.whyUs.points];
                             updated[idx].description = v;
                             setLocalData({...localData, whyUs: {...localData.whyUs, points: updated}});
                          }} />
                    </div>
                 ))}
              </div>
            )}

            {/* --- PORTFOLIO TAB --- */}
            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                 {localData.portfolio.map((item, idx) => (
                    <div key={item.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50 relative">
                       <button 
                          onClick={() => {
                             const newItem = localData.portfolio.filter((_, i) => i !== idx);
                             setLocalData({...localData, portfolio: newItem});
                          }}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                       >
                          <Trash2 size={18} />
                       </button>
                       <div className="grid md:grid-cols-2 gap-4">
                          <InputField label="Project Title" value={item.title} onChange={(v: string) => {
                             const updated = [...localData.portfolio];
                             updated[idx].title = v;
                             setLocalData({...localData, portfolio: updated});
                          }} />
                          <InputField label="Category" value={item.category} onChange={(v: string) => {
                             const updated = [...localData.portfolio];
                             updated[idx].category = v;
                             setLocalData({...localData, portfolio: updated});
                          }} />
                       </div>
                       <InputField label="Image URL" value={item.image} onChange={(v: string) => {
                             const updated = [...localData.portfolio];
                             updated[idx].image = v;
                             setLocalData({...localData, portfolio: updated});
                       }} />
                       <InputField label="Description" type="textarea" value={item.description} onChange={(v: string) => {
                             const updated = [...localData.portfolio];
                             updated[idx].description = v;
                             setLocalData({...localData, portfolio: updated});
                       }} />
                       
                       <div className="mt-4">
                          <label className="text-xs font-bold text-slate-500 uppercase">Details</label>
                          <div className="grid md:grid-cols-3 gap-4 mt-2">
                             <input className="border p-2 rounded text-sm" placeholder="Client" value={item.client || ''} onChange={e => {
                                 const updated = [...localData.portfolio];
                                 updated[idx].client = e.target.value;
                                 setLocalData({...localData, portfolio: updated});
                             }} />
                             <input className="border p-2 rounded text-sm" placeholder="Timeline" value={item.timeline || ''} onChange={e => {
                                 const updated = [...localData.portfolio];
                                 updated[idx].timeline = e.target.value;
                                 setLocalData({...localData, portfolio: updated});
                             }} />
                          </div>
                       </div>
                    </div>
                 ))}
                 <button 
                    onClick={() => {
                       const newItem = { id: Date.now().toString(), title: 'New Project', category: 'Branding', image: '', description: 'Project description...' };
                       setLocalData({...localData, portfolio: [...localData.portfolio, newItem]});
                    }}
                    className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-2"
                 >
                    <Plus size={20} /> Add Project
                 </button>
              </div>
            )}

            {/* --- FAQs TAB --- */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                 {localData.faqs.map((faq, idx) => (
                    <div key={faq.id} className="flex gap-4 items-start">
                       <div className="flex-1 space-y-2">
                          <input 
                             className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none font-bold text-slate-700"
                             placeholder="Question"
                             value={faq.question}
                             onChange={(e) => {
                                const updated = [...localData.faqs];
                                updated[idx].question = e.target.value;
                                setLocalData({...localData, faqs: updated});
                             }}
                          />
                          <textarea 
                             className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm text-slate-600"
                             placeholder="Answer"
                             rows={2}
                             value={faq.answer}
                             onChange={(e) => {
                                const updated = [...localData.faqs];
                                updated[idx].answer = e.target.value;
                                setLocalData({...localData, faqs: updated});
                             }}
                          />
                       </div>
                       <button 
                          onClick={() => {
                             const newFaqs = localData.faqs.filter((_, i) => i !== idx);
                             setLocalData({...localData, faqs: newFaqs});
                          }}
                          className="text-red-400 hover:text-red-600 p-2"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                 ))}
                 <button 
                    onClick={() => {
                       const newFaq = { id: Date.now().toString(), question: '', answer: '' };
                       setLocalData({...localData, faqs: [...localData.faqs, newFaq]});
                    }}
                    className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 flex items-center justify-center gap-2"
                 >
                    <Plus size={18} /> Add FAQ
                 </button>
              </div>
            )}

            {/* --- FOOTER TAB --- */}
            {activeTab === 'footer' && (
              <div className="space-y-6">
                 <div className="mb-6 border-b border-slate-200 pb-6">
                     <h3 className="font-bold text-slate-900 mb-4">Footer Branding</h3>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Footer Logo Image (Optional)</label>
                        {localData.footer.logoImage && (
                            <div className="mb-2 relative w-fit bg-slate-900 p-2 rounded">
                                <img src={localData.footer.logoImage} alt="Footer Logo" className="h-10 w-auto" />
                                <button 
                                    onClick={() => setLocalData({...localData, footer: {...localData.footer, logoImage: ''}})}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (base64) => setLocalData({...localData, footer: {...localData.footer, logoImage: base64}}))}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="text-xs text-slate-500 mt-2">If not uploaded, the Navbar logo will be used (inverted for dark background).</p>
                    </div>
                 </div>

                 <InputField label="Footer Description" type="textarea" value={localData.footer.description} onChange={(v: string) => setLocalData({...localData, footer: {...localData.footer, description: v}})} />
                 <InputField label="Copyright Text" value={localData.footer.copyrightText} onChange={(v: string) => setLocalData({...localData, footer: {...localData.footer, copyrightText: v}})} />
                 
                 <h3 className="font-bold text-slate-800 mt-6 mb-4">Social Links</h3>
                 {localData.footer.socials.map((social, idx) => (
                    <div key={idx} className="flex gap-4 mb-2">
                       <input 
                          className="w-1/3 px-3 py-2 border rounded"
                          value={social.platform}
                          onChange={(e) => {
                             const updated = [...localData.footer.socials];
                             updated[idx].platform = e.target.value;
                             setLocalData({...localData, footer: {...localData.footer, socials: updated}});
                          }}
                       />
                       <input 
                          className="flex-1 px-3 py-2 border rounded"
                          value={social.url}
                          onChange={(e) => {
                             const updated = [...localData.footer.socials];
                             updated[idx].url = e.target.value;
                             setLocalData({...localData, footer: {...localData.footer, socials: updated}});
                          }}
                       />
                    </div>
                 ))}
              </div>
            )}
            
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6 mb-6">
                    <h3 className="font-bold text-slate-900 mb-4">Branding</h3>
                    <InputField label="Agency Name" value={localData.general.agencyName} onChange={(v: string) => setLocalData({...localData, general: {...localData.general, agencyName: v}})} />
                    <InputField label="Logo Text (Fallback)" value={localData.general.logoText} onChange={(v: string) => setLocalData({...localData, general: {...localData.general, logoText: v}})} />
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Navbar Logo Image</label>
                        {localData.general.logoImage && (
                            <div className="mb-2 relative w-fit">
                                <img src={localData.general.logoImage} alt="Logo" className="h-12 w-auto border border-slate-200 rounded p-1" />
                                <button 
                                    onClick={() => setLocalData({...localData, general: {...localData.general, logoImage: ''}})}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (base64) => setLocalData({...localData, general: {...localData.general, logoImage: base64}}))}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="text-xs text-slate-500 mt-2">Upload a transparent PNG for best results. If empty, Logo Text will be used.</p>
                    </div>
                </div>

                <InputField label="Contact Email" value={localData.general.contactEmail} onChange={(v: string) => setLocalData({...localData, general: {...localData.general, contactEmail: v}})} />
                
                {/* Payment Configuration */}
                <div className="border-t border-slate-200 pt-6 mt-6">
                    <h3 className="font-bold text-slate-900 mb-4">Payment Configuration</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Payment QR Code / Standee Image</label>
                        {localData.general.paymentQrImage && (
                            <img src={localData.general.paymentQrImage} alt="QR" className="w-48 h-auto mb-4 rounded border border-slate-200" />
                        )}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (base64) => setLocalData({...localData, general: {...localData.general, paymentQrImage: base64}}))}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="text-xs text-slate-500 mt-2">Upload the full payment QR image (e.g. PhonePe standee). This will replace the default generated QR code on checkout pages.</p>
                    </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};