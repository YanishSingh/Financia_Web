// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// Importing icons for the key features section
import expenseTrackingIcon from '../assets/icons/expense_tracking.png';
import budgetPlanningIcon from '../assets/icons/budget_planning.png';
import financialInsightsIcon from '../assets/icons/financial_insights.png';
import multiDeviceSyncIcon from '../assets/icons/multi-device_sync.png';
import bankIntegrationIcon from '../assets/icons/bank_integration.png';

// Importing icons for the "How It Works" section
import signUpIcon from '../assets/icons/sign_up.png';
import trackIcon from '../assets/icons/track.png';
import reportIcon from '../assets/icons/report.png';

// Importing testimonial profile images
import man1 from '../assets/profile/man1.jpg';
import man2 from '../assets/profile/man2.jpg';
import woman1 from '../assets/profile/woman1.jpg';
import woman2 from '../assets/profile/woman2.jpg';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  // Form states for login and signup
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Basic email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handler for Google login success: post the credential to the backend
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google success:', credentialResponse);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        token: credentialResponse.credential,
      });
      // Store both token and user object in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Google login successful!');
      setShowModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err.response ? err.response.data : err.message);
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.log('Google sign-in/up failed');
    toast.error('Google sign-in failed.');
  };

  // Function to open the modal and set the active tab
  const openModal = (tab = 'login') => {
    setActiveTab(tab);
    setShowModal(true);
  };

  // Handler for login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (!emailRegex.test(loginEmail)) {
      toast.error('Please enter a valid email.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      console.log('Login successful:', res.data);
      // Store token and user in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login successful!');
      setShowModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      toast.error(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Login failed. Please try again.'
      );
    }
  };

  // Handler for signup form submission, including file upload
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!signupName || !signupEmail || !signupPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!emailRegex.test(signupEmail)) {
      toast.error('Please enter a valid email.');
      return;
    }
    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', signupName);
      formData.append('email', signupEmail);
      formData.append('password', signupPassword);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Signup successful:', res.data);
      // Store token and user in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Signup successful!');
      setShowModal(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err.response ? err.response.data : err.message);
      toast.error(
        err.response && err.response.data.msg
          ? err.response.data.msg
          : 'Signup failed. Please try again.'
      );
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 relative">
      {/* Toaster for notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navigation Bar */}
      <Navbar />

      {/* 1. Hero Section */}
      <section id="hero" className="bg-gradient-to-r from-[#CC97FF] to-[#7F3DFF] text-white py-20 pt-32">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6">
          {/* Text Content */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Take Control of Your Finances with Financia!
            </h1>
            <p className="text-lg mb-8">
              Track your expenses, set budgets, and achieve financial goals effortlessly.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => openModal('signup')}
                className="bg-white text-[#7F3DFF] py-3 px-6 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300"
              >
                Get Started for Free
              </button>
              <button className="bg-transparent border border-white text-white py-3 px-6 rounded-full font-semibold hover:bg-white hover:text-[#7F3DFF] transition duration-300">
                Watch Demo
              </button>
            </div>
          </div>
          {/* Illustration */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://picsum.photos/500/400?random=1"
              alt="App Illustration"
              className="w-11/12 max-w-md rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Modal for Login/Sign Up Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          ></div>
          {/* Modal Content */}
          <div className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 max-w-md w-full transform transition-all duration-300 animate-modal">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {activeTab === 'login' ? 'Login' : 'Sign Up'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white text-3xl leading-none focus:outline-none"
              >
                &times;
              </button>
            </div>
            {/* Tab Navigation */}
            <div className="flex mb-6 border-b border-white auth-tabs">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 text-center ${
                  activeTab === 'login'
                    ? 'border-b-2 border-white text-white'
                    : 'text-gray-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 text-center ${
                  activeTab === 'signup'
                    ? 'border-b-2 border-white text-white'
                    : 'text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>
            {/* Form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-gray-800 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-gray-800 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-white text-[#7F3DFF] rounded-full font-bold hover:bg-gray-200 transition duration-300"
                >
                  Login
                </button>
                <div className="my-4 flex items-center">
                  <div className="flex-grow border-t border-white"></div>
                  <span className="mx-2 text-white">or</span>
                  <div className="flex-grow border-t border-white"></div>
                </div>
                <div className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Instead of a file button, display a circular avatar image. */}
                <div className="flex flex-col items-center">
                  <img
                    src={profileImage ? URL.createObjectURL(profileImage) : '/default-profile.png'}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover cursor-pointer mb-4"
                    onClick={() => document.getElementById('signupFileInput').click()}
                  />
                  <input
                    id="signupFileInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-gray-800 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-gray-800 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 text-gray-800 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-white text-[#7F3DFF] rounded-full font-bold hover:bg-gray-200 transition duration-300"
                >
                  Sign Up
                </button>
                <div className="my-4 flex items-center">
                  <div className="flex-grow border-t border-white"></div>
                  <span className="mx-2 text-white">or</span>
                  <div className="flex-grow border-t border-white"></div>
                </div>
                <div className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Landing Page Additional Sections */}
      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Financia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="flex flex-col items-center text-center">
              <img src={expenseTrackingIcon} alt="Expense Tracking" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Expense Tracking</h3>
              <p className="text-sm">Categorize and log your expenses in real time.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={budgetPlanningIcon} alt="Budget Planning" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Budget Planning</h3>
              <p className="text-sm">Set monthly budgets and receive alerts.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={financialInsightsIcon} alt="Financial Insights" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Financial Insights</h3>
              <p className="text-sm">AI-driven analytics to help you make better decisions.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={multiDeviceSyncIcon} alt="Multi-Device Sync" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Multi-Device Sync</h3>
              <p className="text-sm">Access your data anywhere—desktop, tablet, or mobile.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={bankIntegrationIcon} alt="Bank Integration" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Bank Integration</h3>
              <p className="text-sm">Securely connect with your bank to import transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center text-center">
              <img src={signUpIcon} alt="Sign Up" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Sign Up</h3>
              <p className="text-sm">Connect your accounts to get started.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={trackIcon} alt="Track Expenses" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Track Expenses</h3>
              <p className="text-sm">Monitor your spending and set budgets.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={reportIcon} alt="Get Reports" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-xl mb-2">Get Reports</h3>
              <p className="text-sm">Receive insights to improve your financial habits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <img src={man1} alt="Michael S." className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <p className="italic text-sm md:text-base mb-2">
                "Financia transformed the way I handle my expenses. I save more than ever!"
              </p>
              <p className="font-bold text-lg mt-2">Michael S.</p>
              <p className="text-gray-500 text-sm">Entrepreneur</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <img src={woman1} alt="Laura B." className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <p className="italic text-sm md:text-base mb-2">
                "The budgeting tools are a game-changer. Highly recommend Financia!"
              </p>
              <p className="font-bold text-lg mt-2">Laura B.</p>
              <p className="text-gray-500 text-sm">Financial Advisor</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <img src={man2} alt="John D." className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <p className="italic text-sm md:text-base mb-2">
                "Thanks to Financia, I now have a clear view of my spending habits and can plan my future better."
              </p>
              <p className="font-bold text-lg mt-2">John D.</p>
              <p className="text-gray-500 text-sm">Software Engineer</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl text-center hover:shadow-2xl transition-shadow duration-300">
              <img src={woman2} alt="Emily R." className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <p className="italic text-sm md:text-base mb-2">
                "Financia's insights have helped me control my finances and save for my dreams!"
              </p>
              <p className="font-bold text-lg mt-2">Emily R.</p>
              <p className="text-gray-500 text-sm">Marketing Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-[#7F3DFF] text-white">
                <tr>
                  <th className="py-3 px-5 text-left">Plan</th>
                  <th className="py-3 px-5 text-left">Features</th>
                  <th className="py-3 px-5 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-5">Free</td>
                  <td className="py-3 px-5">Basic expense tracking, manual entry</td>
                  <td className="py-3 px-5">$0</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-5">Premium</td>
                  <td className="py-3 px-5">Auto sync, analytics, AI insights</td>
                  <td className="py-3 px-5">$4.99/month</td>
                </tr>
                <tr>
                  <td className="py-3 px-5">Business</td>
                  <td className="py-3 px-5">Team accounts, advanced reports</td>
                  <td className="py-3 px-5">Custom Pricing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => openModal('signup')}
              className="bg-[#7F3DFF] text-white py-3 px-8 rounded-full font-semibold hover:bg-[#5a2bb7] transition duration-300"
            >
              Choose Plan
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-xl">Is my data secure?</h3>
              <p className="mt-2 text-sm">
                Yes, we use bank-level encryption and advanced security protocols to keep your data safe.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-xl">Can I cancel anytime?</h3>
              <p className="mt-2 text-sm">
                Absolutely, with no hidden fees.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-xl">Is there a mobile app?</h3>
              <p className="mt-2 text-sm">
                Coming soon!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call-to-Action Section */}
      <section id="cta" className="bg-gradient-to-r from-[#CC97FF] to-[#7F3DFF] text-white py-16">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-8">Ready to take control of your finances?</h2>
          <button
            onClick={() => openModal('signup')}
            className="bg-white text-[#7F3DFF] py-3 px-8 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition duration-300"
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer" className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="font-bold mb-2">Quick Links</h4>
              <ul>
                <li className="mb-1">
                  <Link to="/about" className="hover:text-white">About</Link>
                </li>
                <li className="mb-1">
                  <Link to="/features" className="hover:text-white">Features</Link>
                </li>
                <li className="mb-1">
                  <Link to="/pricing" className="hover:text-white">Pricing</Link>
                </li>
                <li className="mb-1">
                  <Link to="/blog" className="hover:text-white">Blog</Link>
                </li>
                <li className="mb-1">
                  <Link to="/contact" className="hover:text-white">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="mb-4 md:mb-0">
              <h4 className="font-bold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2">Legal</h4>
              <ul>
                <li className="mb-1">
                  <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                </li>
                <li className="mb-1">
                  <Link to="/terms" className="hover:text-white">Terms of Use</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-4">
            <p>&copy; {new Date().getFullYear()} Financia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
