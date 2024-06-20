import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';

export async function getCreatorName(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getCreatorName}`,postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreatorName Error :', err);
    }
  }

 
  export async function CreatoractivityStatus(idv, data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.createstatus}${idv}`, putMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updateStatus Error:', err);
    }
  }
  export async function getCompanyList() {
    try {
      const response = await fetch(`${API_SERVER}${urls.getCompanyList}`,getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }
  export async function getSelectCreator(data) {
    try {
      //${id}
      const response = await fetch(`${API_SERVER}${urls.getSelectCreator}`,postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }
  export async function getGamesList(data) {
    try {
      //${id}
      const response = await fetch(`${API_SERVER}${urls.getGamesList}`,postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }
  export async function getLearnerData(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getLearnerData}${id}`,getMethod);
      const result = await response.json(); 
      return result;
    } catch (err) {
      console.log('getLearnerData Error:', err);
    }
  }
  