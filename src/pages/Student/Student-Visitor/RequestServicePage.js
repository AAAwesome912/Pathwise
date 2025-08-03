import React, {  useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { useAuth } from '../../../contexts/AuthContext'; 

const RequestServicePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // assuming user object contains user.id
  const location = useLocation();
  const { serviceName } = location.state || {};
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
  fullName: '',
  Email: '',
  contactNumber: '',
  address: '',
  course: '',
  yearLevel: '',
});

useEffect(() => {
  if (user) {
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      Email: user.email || '',
      contactNumber: user.contact || '',
      course: user.course || '',
      yearLevel: user.yearLevel || '',
      address: user.address || ''
    }));
  }
}, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (serviceName === "Request for Academic Records" && name === "requestType") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        certificationType: '', // reset conditional fields
        gradesSemester: '',
        authenticationType: '',
        otherDocument: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getFormFields = () => {
    if (serviceName === "Request for Academic Records") {
      return [
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
        { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate"], required: true },
        { name: "lastAcademicYear", label: "Academic Year Last Attended", type: "text", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "numberOfCopies", label: "Number of Copies", type: "number", required: true },
        { name: "purpose", label: "Purpose", type: "textarea", required: true }
      ];
    }

    if (serviceName === "Borrow Books") {
      return [

        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
        { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"], required: true },
        { name: "Email", label: "Email", type: "text", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: false },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "bookTitle", label: "Book Title/ISBN", type: "text", required: true }
      ];
    }

    return [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
      { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"], required: true },
      { name: "Email", label: "Email", type: "text", required: true },
      { name: "contactNumber", label: "Contact Number", type: "text", required: false },
      { name: "address", label: "Address", type: "text", required: true }
    ];
  };

  const formFields = getFormFields();

const handleSubmit = async (e) => {
  e.preventDefault();

  // Construct structured JSON for additional_info
  const additionalInfo = {
    fullName: formData.fullName,
    email: formData.Email || '',  // capital 'E' as used in your form
    contactNumber: formData.contactNumber,
    address: formData.address,
    course: formData.course,
    yearLevel: formData.yearLevel,
    ...(formData.bookTitle && { bookTitle: formData.bookTitle }),
    ...(formData.lastAcademicYear && { lastAcademicYear: formData.lastAcademicYear }),
    ...(formData.requestType && { requestType: formData.requestType }),
    ...(formData.certificationType && { certificationType: formData.certificationType }),
    ...(formData.gradesSemester && { gradesSemester: formData.gradesSemester }),
    ...(formData.authenticationType && { authenticationType: formData.authenticationType }),
    ...(formData.otherDocument && { otherDocument: formData.otherDocument }),
    ...(formData.numberOfCopies && { numberOfCopies: formData.numberOfCopies }),
    ...(formData.purpose && { purpose: formData.purpose }),
  };

  const ticketPayload = {
    user_id: user.id,
    name: formData.fullName,
    office: serviceName === "Borrow Books" ? "Library" : "Registrar",
    service: serviceName,
    additional_info: JSON.stringify(additionalInfo),  // ✅ structured JSON string
  };

  try {
    const res = await axios.post('/api/tickets', ticketPayload);
    const ticketId = res.data.ticketId;

    setMessage(`Your request for "${serviceName}" has been submitted!`);
    
    setTimeout(() => {
      navigate('/my-tickets', {
        state: {
          ticketNumber: ticketId,
          serviceName,
          office: ticketPayload.office
        }
      });
    }, 1000);
  } catch (err) {
    console.error(err);
    setMessage('Something went wrong while submitting your ticket.');
  }
};



  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Request: {serviceName || "Service"}</h1>
      <p className="text-gray-600 mb-6">Please fill out the details below.</p>

      {message && (
        <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">{message}</div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows="3"
                  onChange={handleChange}
                  value={formData[field.name] || ''}
                  required={field.required}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="" disabled>-- Select Year Level --</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              )}
            </div>
          ))}

          {serviceName === "Request for Academic Records" && (
            <>
              <div>
                <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">Request Type</label>
                <select
                  id="requestType"
                  name="requestType"
                  value={formData.requestType || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">-- Select --</option>
                  <option value="Certification">Certification</option>
                  <option value="Authentication">Authentication</option>
                  <option value="TranscriptA&R">Transcript Application & Releasing</option>
                </select>
              </div>

              {formData.requestType === "Certification" && (
                <div>
                  <label htmlFor="certificationType" className="block text-sm font-medium text-gray-700">Type of Certification</label>
                  <select
                    id="certificationType"
                    name="certificationType"
                    value={formData.certificationType || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">-- Select --</option>
                    <option value="TransferofCredentials">Transfer of Credentials</option>
                    <option value="Graduation">Graduation</option>
                    <option value="EarnedUnits">Earned Units</option>
                    <option value="Enrolment">Enrolment</option>
                    <option value="COG">Certificate of Grades (Indicate Year & Semester)</option>
                  </select>
                </div>
              )}

              {formData.certificationType === "COG" && (
                <div>
                  <label htmlFor="gradesSemester" className="block text-sm font-medium text-gray-700">Indicate the year and semester</label>
                  <input
                    type="text"
                    id="gradesSemester"
                    name="gradesSemester"
                    value={formData.gradesSemester || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              )}

              {formData.requestType === "Authentication" && (
                <div>
                  <label htmlFor="authenticationType" className="block text-sm font-medium text-gray-700">Type of Document for Authentication</label>
                  <select
                    id="authenticationType"
                    name="authenticationType"
                    value={formData.authenticationType || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">-- Select --</option>
                    <option value="TOR">Transcript of Records</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Others">Other Academic Records</option>
                  </select>
                </div>
              )}

              {formData.authenticationType === "Others" && (
                <div>
                  <label htmlFor="otherDocument" className="block text-sm font-medium text-gray-700">Please specify the academic document</label>
                  <input
                    type="text"
                    id="otherDocument"
                    name="otherDocument"
                    value={formData.otherDocument || ''}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestServicePage;
