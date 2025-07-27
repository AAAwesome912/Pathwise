import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const CampusMapPage = () => {
  const navigate = useNavigate(); 
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement your search logic here using the searchQuery
    console.log('Searching for:', searchQuery);
    // You might want to navigate to a search results page or update the map
    // based on the search query.
  };

  const handleMakeRequest = () => {
    navigate('/request-service'); // Or navigate to the specific request service page
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Campus Map</h1>

      <div className="flex items-center mb-4">
        <input
          type="text"
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
          placeholder="Search for a building or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
        >
          Search
        </button>
      </div>

      {/* Display the image without the link */}
      <img
        src="/asuMap.png"
        alt="school-q-pwa/src/asuMap.png"
        className="w-full rounded-md shadow-md"
        style={{ maxHeight: '390px', height: 'auto' }}
      />
      <p className="text-gray-600 mt-4 text-sm">
        Explore the campus using the map above. Use the search bar to find specific locations.
      </p>
      {/* You could add interactive map elements here using a library like Leaflet or Google Maps API */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate('/Dashboard')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleMakeRequest}
          className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150"
        >
          Make a Request
        </button>
      </div>
    </div>
  );
};

export default CampusMapPage;