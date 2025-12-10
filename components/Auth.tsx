import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { loginUser, registerUser } from "../src/services/api";
import { 
  Library, UserPlus, LogIn, Mail, Lock, 
  User as UserIcon, Hash, Phone, Briefcase, ArrowRight 
} from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
    yearSection: '',
    mobile: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Invalid email address.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";

    if (!isLogin) {
      if (!formData.name.trim()) return "Full Name is required.";
      if (!formData.studentId.trim()) return "Student ID is required.";
      if (!formData.department) return "Please select a department.";

      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(formData.mobile)) return "Mobile number must be 10 digits.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // ---------- LOGIN ----------
        const user = await loginUser(formData.email, formData.password);

        if (!user) {
          setError("Invalid email or password.");
          setIsLoading(false);
          return;
        }

        if (user.isBlocked) {
          setError("Your account has been blocked by the admin.");
          setIsLoading(false);
          return;
        }

        onLogin(user);
      } 
      else {
        // ---------- REGISTER ----------
        const newUser: User = {
          id: "",
          role: UserRole.STUDENT,
          isBlocked: false,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          studentId: formData.studentId,
          department: formData.department,
          yearSection: formData.yearSection,
          mobile: formData.mobile
        };

        const createdUser = await registerUser(newUser);
        onLogin(createdUser);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 p-4 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[600px]">
        
        {/* LEFT SIDE */}
        <div className="md:w-5/12 bg-primary p-12 text-white relative flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Library className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">LibBook</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              {isLogin ? "Welcome back, Scholar!" : "Join the Library Community"}
            </h2>

            <p className="text-blue-100 mt-4">
              {isLogin
                ? "Access your dashboard and manage your seat bookings easily."
                : "Create your account and start booking your study space instantly."}
            </p>
          </div>
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="md:w-7/12 p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">

            <div className="flex justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  {isLogin ? "Sign In" : "Create Account"}
                </h3>
              </div>

              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm font-semibold text-primary flex items-center"
              >
                {isLogin ? 'Register instead' : 'Login instead'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* REGISTER FIELDS */}
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input name="name" type="text" placeholder="Full Name" onChange={handleChange}
                        className="w-full pl-10 px-4 py-2.5 border rounded-xl bg-slate-50" required />
                    </div>

                    <div className="relative">
                      <Hash className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input name="studentId" placeholder="Student ID" onChange={handleChange}
                        className="w-full pl-10 px-4 py-2.5 border rounded-xl bg-slate-50" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                      <select name="department" onChange={handleChange}
                        className="w-full pl-10 px-4 py-2.5 border rounded-xl bg-slate-50" required>
                        <option value="">Select Dept...</option>
                        <option value="CS">Comp. Sci</option>
                        <option value="EE">Electrical</option>
                        <option value="ME">Mechanical</option>
                        <option value="BA">Business</option>
                      </select>
                    </div>

                    <div className="relative">
                      <input name="yearSection" placeholder="Year/Sec (e.g. 3-A)" onChange={handleChange}
                        className="w-full pl-10 px-4 py-2.5 border rounded-xl bg-slate-50" required />
                    </div>
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input name="mobile" placeholder="Mobile Number" onChange={handleChange}
                      className="w-full pl-10 px-4 py-2.5 border rounded-xl bg-slate-50" required />
                  </div>
                </>
              )}

              {/* LOGIN + COMMON FIELDS */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input name="email" type="email" placeholder="Email Address" onChange={handleChange}
                  className="w-full pl-10 px-4 py-2.5 border rounded-xl bg-slate-50" required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange}
                  className="w-full pl-10 px-4 py-2.5 border rounded-xl bg-slate-50" required />
              </div>

              <button
                className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};
