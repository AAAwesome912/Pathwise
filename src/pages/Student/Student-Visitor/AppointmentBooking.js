import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../utils/axiosInstance";
import { useAuth } from "../../../contexts/AuthContext";

const AppointmentBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { office: initialOffice, serviceName: initialService } =
    location.state || {};

  const [office, setOffice] = useState(initialOffice || "");
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState(initialService || "");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Automatically clear the message after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // Clear message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch all active services once
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/api/services");
        setServices(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  // Pre-fill form data when modal opens
  useEffect(() => {
    if (showModal && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        Email: user.email || "",
        contactNumber: user.contact || "",
        course: user.course || "",
        yearLevel: user.yearLevel || "",
        address: user.address || "",
        priority_lane: 0,
        priorityCategory: "", // Initialize new state for priority category
      }));
    }
  }, [showModal, user]);

  // Filter services by office
  const officeServices = services.filter(
    (svc) => svc.office_name === office
  );

  // Fetch slots when office+date are selected
  useEffect(() => {
    if (!office || !date) {
      setSlots([]);
      return;
    }
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
          `/api/appointments/availability/${office}/${date}`
        );
        setSlots(res.data.slots || []);
        setMessage(''); // Clear any previous error messages
      } catch (err) {
        console.error("❌ Error fetching availability:", err);
        setSlots([]);
        if (err.response && err.response.status === 400) {
          setMessage("❌ Cannot make an appointment for today or a past day.");
        } else {
          setMessage("❌ Failed to fetch available slots.");
        }
      }
    };
    fetchAvailability();
  }, [office, date]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? (checked ? 1 : 0) : value;

    setFormData((prev) => {
      const newState = { ...prev, [name]: val };
      if (name === "requestType") {
        newState.certificationType = "";
        newState.gradesSemester = "";
        newState.authenticationType = "";
        newState.otherDocument = "";
      }
      // If priority_lane checkbox is unchecked, clear the category
      if (name === "priority_lane" && !checked) {
        newState.priorityCategory = "";
      }
      return newState;
    });
  };

  const getFormFields = () => {
    if (serviceName === "Request for Academic Records") {
      return [
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
        { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate"], required: true },
        { name: "lastAcademicYear", label: "Academic Year Last Attended", type: "text", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: false },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "numberOfCopies", label: "Number of Copies", type: "number", required: true },
        { name: "purpose", label: "Purpose", type: "textarea", required: true },
      ];
    }
    if (serviceName === "Borrow Books") {
      return [
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
        { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"], required: true },
        { name: "Email", label: "Email", type: "text", required: false },
        { name: "contactNumber", label: "Contact Number", type: "text", required: false },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "bookTitle", label: "Book Title/ISBN", type: "text", required: true },
      ];
    }
    return [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "course", label: "Course", type: "select", options: ["BSIT", "BSInfoTech", "BSIS", "BSEMC", "BTVTED", "BSA", "BSHM"], required: true },
      { name: "yearLevel", label: "Year Level", type: "select", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"], required: true },
      { name: "Email", label: "Email", type: "text", required: false },
      { name: "contactNumber", label: "Contact Number", type: "text" },
      { name: "address", label: "Address", type: "text", required: true },
    ];
  };

  const formFields = getFormFields();

  // Updated `handleSaveAppointment` function to use state-based navigation
  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !date || !office || !serviceName) return;
    setLoading(true);
    try {
      const payload = {
        user_id: user?.id,
        name: formData.fullName,
        office,
        service: serviceName,
        date,
        time: selectedSlot,
        additional_info: JSON.stringify(formData),
      };

      const res = await axios.post("/api/appointments/book", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const appointmentId = res.data.id;

      if (appointmentId) {
        setMessage(`Your appointment has been successfully booked!`);
        setTimeout(() => {
          // Use state object to pass data instead of URL parameter
          navigate(`/appointmentDetails`, { state: { appointmentId } });
        }, 1000);
      } else {
        console.error("❌ No appointment ID was found in the response data.");
        setMessage("❌ Booking successful, but could not retrieve appointment ID.");
      }
    } catch (err) {
      console.error("❌ Booking failed:", err);
      setMessage("❌ Failed to save appointment. Please try again.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the input min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex gap-8 p-8">
      {/* Conditionally render the message at the top */}
      {message && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-md z-50 transition-all duration-300 ${message.startsWith('❌') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {message}
        </div>
      )}

      {/* Left side */}
      <div className="w-1/2">
        <h2 className="text-xl font-bold mb-4">Select Office, Service & Date</h2>
        <label className="block mb-2">Office</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={office}
          onChange={(e) => {
            setOffice(e.target.value);
            setServiceName("");
          }}
        >
          <option value="">Select office</option>
          <option value="Registrar">Registrar</option>
          <option value="Library">Library</option>
        </select>
        {office && officeServices.length > 0 && (
          <>
            <label className="block mb-2">Service</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            >
              <option value="">Select service</option>
              {officeServices.map((svc) => (
                <option key={svc.id} value={svc.service_name}>
                  {svc.service_name}
                </option>
              ))}
            </select>
          </>
        )}
        <label className="block mb-2">Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today} // This is the new attribute
        />
      </div>
      {/* Right side */}
      <div className="w-1/2">
        <h2 className="text-xl font-bold mb-4">Available Times</h2>
        {slots.length === 0 ? (
          <p>Select office & date to see slots.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {slots.map((slot, index) => (
              <button
                key={index}
                className={`p-3 rounded border text-sm ${
                  slot.available
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "bg-gray-200 cursor-not-allowed"
                } ${
                  selectedSlot === slot.time ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => slot.available && setSelectedSlot(slot.time)}
                disabled={!slot.available}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedSlot || !serviceName}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{serviceName} Form</h3>
            <form onSubmit={handleSaveAppointment}>
              {/* Renders the main form fields */}
              {formFields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required={field.required}
                    >
                      <option value="">-- Select --</option>
                      {field.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              {/* Added conditional fields for "Request for Academic Records" */}
              {serviceName === "Request for Academic Records" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                    <select name="requestType" value={formData.requestType || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">-- Select --</option>
                      <option value="Certification">Certification</option>
                      <option value="Authentication">Authentication</option>
                      <option value="TranscriptA&R">Transcript Application & Releasing</option>
                    </select>
                  </div>
                  {formData.requestType === "Certification" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type of Certification</label>
                      <select name="certificationType" value={formData.certificationType || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
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
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Indicate the year and semester</label>
                        <input type="text" name="gradesSemester" value={formData.gradesSemester || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/>
                      </div>
                  )}
                  {formData.requestType === "Authentication" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type of Document for Authentication</label>
                      <select name="authenticationType" value={formData.authenticationType || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">-- Select --</option>
                        <option value="TOR">Transcript of Records</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Others">Other Academic Records</option>
                      </select>
                    </div>
                  )}
                  {formData.authenticationType === "Others" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Please specify the academic document</label>
                      <input type="text" name="otherDocument" value={formData.otherDocument || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                  )}
                </>
              )}
              {/* Added Priority Lane checkbox */}
              <div className="mb-4 flex flex-row items-center gap-4">
                <label className="inline-flex items-center">
                  <input
                      type="checkbox"
                      name="priority_lane"
                      checked={formData.priority_lane === 1}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                  />
                  <span className="ml-2 text-blue-600">
                      Priority Lane (PWD, Senior, Pregnant)
                  </span>
                </label>
                {/* Conditionally render the dropdown for priority category */}
                {formData.priority_lane === 1 && (
                  <select
                    name="priorityCategory"
                    value={formData.priorityCategory || ""}
                    onChange={handleChange}
                    required
                    className="w-1/2 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Select Category --</option>
                    <option value="PWD">PWD</option>
                    <option value="Senior">Senior</option>
                    <option value="Pregnant">Pregnant</option>
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
