import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
  const navigate = useNavigate();

   const [formData, setFormData] = useState({
     name: '', email: '', password: '', confirmPassword: '', role: 'student', studentId: '', staffId: '',  course: "",
    office: "", windowNo: "", section: "", department: "",  contact: '', address: '',
   });

   const [error, setError] = useState('');
   const [showSuccessModal, setShowSuccessModal] = useState(false);
 
   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
 
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setShowSuccessModal(false);

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  if (!formData.name) {
    setError("Name is required.");
    return;
  }
  if (!formData.email) {
    setError("Email is required.");
    return;
  }
  if (!formData.address) {
    setError("Address is required.");
    return;
  }
  if (formData.role === 'student' && !formData.studentId) {
    setError("Student ID is required for student registration.");
    return;
  }
  if (formData.role === 'staff' && !formData.staffId) {
    setError("Staff ID is required for staff registration.");
    return;
  }

  const payload = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    contact: formData.contact.trim(),
    address: formData.address.trim(),
    password: formData.password,
    role: formData.role,
    studentId: formData.role === 'student' && formData.studentId.trim() !== '' ? formData.studentId : null,
    staffId: formData.role === 'staff' && formData.staffId.trim() !== '' ? formData.staffId : null,
    course: formData.role === 'student' ? formData.course : null,
    office: formData.role === 'staff' ? formData.office : null,
    windowNo: formData.office === 'Registrar' ? formData.windowNo : null,
    section: formData.office === 'Library' ? formData.section : null,
    department: formData.office === 'Departmental' ? formData.department : null,
    
  };

  try {
    console.log("Sending:", payload);

    const response = await fetch('http://192.168.101.18:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Registration failed.');
    } else {
      setShowSuccessModal(true);
      setFormData({
        name: '',
        email: '',
        contact: '', 
        address: '', 
        password: '',
        confirmPassword: '',
        role: 'student',
        studentId: '',
        staffId: '',
        course: '',
        office: '',
        windowNo: '',
        section: '',
        department: '',
      });
    }
  } catch (err) {
    setError("Something went wrong. Please try again later.");
    console.error(err);
  }
};

 
   const handleCloseSuccessModal = () => {
     setShowSuccessModal(false);
     navigate('/login'); // Navigate to login page when modal is closed via the button
   };
 
   return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Student/Staff Registration</h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" required onChange={handleChange} value={formData.name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input type="email" name="email" id="email" autoComplete="email" required onChange={handleChange} value={formData.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="text" name="contact" id="contact" onChange={handleChange} value={formData.contact}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" name="address" id="address" onChange={handleChange} value={formData.address}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" required onChange={handleChange} value={formData.password}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" required onChange={handleChange} value={formData.confirmPassword}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register as</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
                <input type="text" name="studentId" id="studentId" required onChange={handleChange} value={formData.studentId}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                <select name="course" value={formData.course} onChange={handleChange} required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                  <option value="">Select Course</option>
                  <option value="BS InfoTech">BS InfoTech</option>
                  <option value="BSEMC">BSEMC</option>
                  <option value="BSIS">BSIS</option>
                  <option value="BSA">BSA</option>
                  <option value="BSCE">BSCE</option>
                  <option value="BTVTED">BTVTED</option>
                  <option value="BSIT">BSIT</option>
                  <option value="BSHM">BSHM</option>
                </select>
              </div>
            </>
            
          )}

          {formData.role === 'staff' && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">Staff ID</label>
                <input type="text" name="staffId" id="staffId" required onChange={handleChange} value={formData.staffId}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="office" className="block text-sm font-medium text-gray-700">Office</label>
                <select name="office" value={formData.office} onChange={handleChange} required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                  <option value="">Select Office</option>
                  <option value="Registrar">Registrar</option>
                  <option value="Library">Library</option>
                  <option value="Departmental">Departmental</option>
                </select>
              </div>

              {formData.office === 'Registrar' && (
                <div className="sm:col-span-2">
                  <label htmlFor="windowNo" className="block text-sm font-medium text-gray-700">Window</label>
                  <select name="windowNo" value={formData.windowNo} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                    <option value="">Select Window</option>
                    <option value="Window 1">Window 1</option>
                    <option value="Window 2">Window 2</option>
                    <option value="Window 3">Window 3</option>
                  </select>
                </div>
              )}

              {formData.office === 'Library' && (
                <div className="sm:col-span-2">
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                  <select name="section" value={formData.section} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                    <option value="">Select Section</option>
                    <option value="Computer Section">Computer Section</option>
                    <option value="Reference Section">Reference Section</option>
                  </select>
                </div>
              )}

              {formData.office === 'Departmental' && (
                <div className="sm:col-span-2">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                    <option value="">Select Department</option>
                    <option value="CCS">CCS</option>
                    <option value="CEA">CEA</option>
                    <option value="CIT">CIT</option>
                    <option value="CIE">CIE</option>
                    <option value="BSHM">BSHM</option>
                  </select>
                </div>
              )}
            </>
          )}
        </div>

       <div className="flex items-center justify-between mt-6">
        <div className="text-sm">
         <button
         onClick={() => navigate('/login')}
         type="button"
         className="font-medium text-teal-600 hover:text-teal-500" >
          Already have an account? Sign in
        </button>
       </div>
      </div>

        <div>
          <button type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150">
            Register
          </button>
        </div>
      </form>
    </div>

    {/* Registration Success Modal */}
    {showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h3>
          <p className="text-gray-700 mb-6">Your account has been created successfully.</p>
          <button
            onClick={handleCloseSuccessModal}
            className="px-6 py-3 rounded-md text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )}
  </div>
);
 }

 export default RegisterPage;