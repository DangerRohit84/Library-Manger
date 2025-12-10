import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { Auth } from './components/Auth';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session
    const stored = localStorage.getItem('libbook_current_user');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('libbook_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('libbook_current_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <h2 className="text-slate-600 font-medium animate-pulse">Loading Library System...</h2>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return currentUser.role === UserRole.ADMIN ? (
    <AdminDashboard user={currentUser} onLogout={handleLogout} />
  ) : (
    <StudentDashboard user={currentUser} onLogout={handleLogout} />
  );
};

export default App;
