// testing activity

const fetch = require('node-fetch');

// An API key is defined here. You'd normally get this from the service you're accessing. It's a form of authentication.
const XI_API_KEY = "28f7b776bb262ab1140ce635a90bd8f9";

// This is the URL for the API endpoint we'll be making a GET request to.
const url = "https://api.elevenlabs.io/v1/voices";

// Here, headers for the HTTP request are being set up.
// Headers provide metadata about the request. In this case, we're specifying the content type and including our API key for authentication.
const headers = {
  "Accept": "application/json",
  "xi-api-key": XI_API_KEY,
  "Content-Type": "application/json"
};

// A GET request is sent to the API endpoint. The URL and the headers are passed into the request.
fetch(url, { method: 'GET', headers })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // A loop is created to iterate over each 'voice' in the 'voices' list from the parsed data.
    // The 'voices' list consists of objects, each representing a unique voice provided by the API.
    data.voices.forEach(voice => {
      // For each 'voice', the 'name' and 'voice_id' are printed out.
      // These keys in the voice object contain values that provide information about the specific voice.
      console.log(`${voice.name}; ${voice.voice_id}`);
    });
  })
  .catch(error => console.error('Error:', error));
