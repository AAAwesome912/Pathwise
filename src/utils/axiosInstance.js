import axios from 'axios';

// Get the current hostname and protocol from the browser's window object
const hostname = window.location.hostname;
const protocol = window.location.protocol;

// Define a variable for the base URL
let baseURL;

// ✅ Check if the hostname is a common local address
if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '192.168.101.18') {
  // If on local network, use the local backend IP and port
  baseURL = `${protocol}//${hostname}:3001`; 
} else {
  // ✅ Otherwise, assume it's being accessed from the internet via a tunnel.
  // Use a hardcoded URL for your backend's devtunnel.
  // IMPORTANT: You must replace the URL below with your actual backend's devtunnels URL.
  // Example: If you create a devtunnel for port 3001, the URL will be different
  // from your frontend's URL. You will have to get that URL from your terminal.
  baseURL = `https://ftvj743v-3001.asse.devtunnels.ms/`; 
}

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Automatically attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
