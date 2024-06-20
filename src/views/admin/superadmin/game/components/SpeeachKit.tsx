import React, { useState, useEffect } from 'react';
import { PollyClient, SynthesizeSpeechCommand, DescribeVoicesCommand,SynthesizeSpeechCommandInput,SynthesizeSpeechCommandOutput  } from '@aws-sdk/client-polly';


import { useSpeechSynthesis } from 'react-speech-kit'; // Optional

// Replace with your AWS credentials
const accessKeyId = 'YOUR_ACCESS_KEY_ID';
const secretAccessKey = 'YOUR_SECRET_ACCESS_KEY';
const region = 'us-east-1';

const pollyClient = new PollyClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

interface Voice {
  Id: string;
  Name: string;
}

interface SpeechOptions {
  text: string;
  voice?: any; // Voice ID from Polly voices list
  languageCode?: string; // Optional language code
  volume?: number; // Optional volume between 0 and 1
  rate?: number; // Optional speech rate between 0.5 and 4
}

const SpeechComponent: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [voice, setVoice] = useState<string>('');
  const { speak: nativeSpeak } = useSpeechSynthesis(); // Optional for native voices
  const [voices, setVoices] = useState<Voice[]>([]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVoice(event.target.value);
  };

  const speakWithPolly = async (options: SpeechOptions) => {
    try {
      const params = {
        Text: options.text,
        OutputFormat: 'mp3' as const, // Use the specific string literal
        VoiceId: options.voice,
        ...options,
      };
  
      const response: SynthesizeSpeechCommandOutput = await pollyClient.send(new SynthesizeSpeechCommand(params));
  
      if (response.AudioStream) {
        const audioBlob = new Blob([response.AudioStream as BlobPart], { type: 'audio/mp3' });
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSpeakClick = () => {
    if (voice) {
      // Use Polly for a specific voice
      speakWithPolly({ text, voice });
    } else {
      // Use native speech synthesis (optional)
      nativeSpeak({ text });
    }
  };

  // Get list of available Polly voices (optional)
  useEffect(() => {
    const fetchVoices = async () => {
      const pollyClient = new PollyClient({ region: 'your-region' });

      try {
        const data = await pollyClient.send(new DescribeVoicesCommand({}));

        if (data?.Voices) {
          // Map the AWS SDK Voice type to your component's Voice type
          const mappedVoices: Voice[] = data.Voices.map((awsVoice) => ({
            Id: awsVoice.Id ?? '', // Make sure Id is not null or undefined
            Name: awsVoice.Name ?? '',
            // ... map other properties as needed
          }));

          setVoices(mappedVoices);
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };

    fetchVoices();
  }, []);

  return (
    <div>
      <label htmlFor="text">Text to speak:</label>
      <br />
      <textarea id="text" rows={3} value={text} onChange={handleTextChange} />
      <br />
      <label htmlFor="voice">Voice:</label>
      <br />
      <select id="voice" value={voice} onChange={handleVoiceChange}>
        <option value="">-- Use native voice --</option>
        {voices.map((v) => (
          <option key={v.Id} value={v.Id}>
            {v.Name}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleSpeakClick}>Speak</button>
    </div>
  );
};

export default SpeechComponent;
