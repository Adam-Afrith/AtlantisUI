import React from 'react';

const TextToSpeechComponent = () => {
  const playTextToSpeech = (voice:any) => {
    const text = 'Hello, navin?'; // Replace with your dynamic text

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const getVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.filter(voice => voice.lang.startsWith('en')); // Filter English voices
  };

  const voices = getVoices();

  return (
    <div>
      {voices.map(voice => (
        <button key={voice.name} onClick={() => playTextToSpeech(voice)}>
          {voice.name}
        </button>
      ))}
    </div>
  );
};

export default TextToSpeechComponent;
