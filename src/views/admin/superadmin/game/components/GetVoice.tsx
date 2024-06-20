import React, { useEffect } from 'react';

const VoiceList = () => {
  const XI_API_KEY = "28f7b776bb262ab1140ce635a90bd8f9"; // Replace with your actual API key
  const url = "https://api.elevenlabs.io/v1/voices";

  useEffect(() => {
    const fetchVoices = async () => {
      const headers = {
        "Accept": "application/json",
        "xi-api-key": XI_API_KEY,
        "Content-Type": "application/json"
      };

      try {
        const response = await fetch(url, { method: 'GET', headers });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        data.voices.forEach((voice: { name: any; voice_id: any; }) => {
          console.log(`${voice.name}; ${voice.voice_id}`);
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchVoices();
  }, [XI_API_KEY]);

  return (
    <div>
      {/* React component rendering logic, if needed */}
    </div>
  );
};

export default VoiceList;
