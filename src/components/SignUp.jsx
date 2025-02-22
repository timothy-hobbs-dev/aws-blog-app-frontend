import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from 'react-oidc-context';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const auth = useAuth();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear errors when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!validatePassword(form.password)) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Send only necessary data (exclude confirmPassword)
        const signupData = {
          username: form.username,
          email: form.email,
          password: form.password
        };
        
        await api.signup(signupData);
        setSubmitSuccess(true);
        // Reset form after successful submission
        setForm({ username: '', email: '', password: '', confirmPassword: '' });
        
        // You might want to redirect or show a success message
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } catch (error) {
        setErrors({
          submit: error.response?.data?.message || 'Signup failed. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <div className="flex items-center border rounded-lg px-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full py-2 focus:outline-none"
              required
              disabled={isSubmitting}
            />
            {showPassword ? (
              <EyeOff className="cursor-pointer" onClick={() => setShowPassword(false)} />
            ) : (
              <Eye className="cursor-pointer" onClick={() => setShowPassword(true)} />
            )}
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {errors.submit && (
          <div className="mb-4">
            <p className="text-red-500 text-sm">{errors.submit}</p>
          </div>
        )}

        {submitSuccess && (
          <div className="mb-4">
            <p className="text-green-500 text-sm">Signup successful!</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
          disabled={!form.username || !form.email || !form.password || !form.confirmPassword || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing up...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
};

export default Signup;