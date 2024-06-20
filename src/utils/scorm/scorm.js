import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls,postMethodfile} from 'utils/url/urls';

export async function generateScorm(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.generateScorm}`, postMethod(data));
    // const result = await response.json();
    // return result;
    return response;
  } catch (err) {
    console.log('scorm Error :', err.message);
  }
}

export async function createScormConfig(id, data) {
  try {
    const parsedData = JSON.parse(data);
    parsedData.gameId = id;
    const stringifiedData = JSON.stringify(parsedData);
    const response = await fetch(`${API_SERVER}${urls.createScormConfig}`, postMethod(stringifiedData));
    // const result = await response.json();
    // return result;
    return response;
  } catch (err) {
    console.log('scorm Config Creation Error :', err.message);
  }
}

export async function updateScormConfig(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.updateScormConfig}${id}`, putMethod(data));
    const result = await response.json();
    return result;
    // return response;
  } catch (err) {
    console.log('scorm Config Updation Error :', err.message);
  }
}

export async function getScormConfig(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getScormConfig}${id}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('Get Scorm Configuration Error:', err.message)
  }
}