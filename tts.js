import React, { useEffect } from 'react';

const TextToSpeech = ({voiceId}) => {
  const xiApiKey = '28f7b776bb262ab1140ce635a90bd8f9'; // Replace with your actual API key
  const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/${voiceId}'; // Replace with the actual voice ID

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': xiApiKey,
      };

      const data = {
        text: "Born and raised in the charming south, I can add a touch of sweet southern hospitality to your audiobooks and podcasts",
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        // You can use audioUrl in your React component, for example, play it with an audio element
        const audioElement = new Audio(audioUrl);
        audioElement.play();

        console.log('Audio content fetched and played successfully');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [xiApiKey, apiUrl, voiceId]);

  return (
    <div>
      {/* React component rendering logic, if needed */}
    </div>
  );
};

export default TextToSpeech;
