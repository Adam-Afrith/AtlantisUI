import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';

export async function createplan(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.createplan}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('createplan Error :', err);
  }
}
export async function updateplan(idv, data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.updateplan}${idv}`,putMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updateplan Error:', err);
    }
  }
  export async function deleteplan(idv) {
    try {
      const response = await fetch(`${API_SERVER}${urls.deleteplan}${idv}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('deleteplan Error:', err);
    }
  }
  export async function deleteplanName(idv) {
    try {
      const response = await fetch(`${API_SERVER}${urls.deleteplanName}${idv}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('deleteplanName Error:', err);
    }
  }
export async function getPlanById(idv) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getPlanById}${idv}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getPlanById Error :', err);
  }
}

export async function getplan() {
  try {
    const response = await fetch(`${API_SERVER}${urls.getplan}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getplan Error:', err);
  }
}



export async function getAllCompanies(){
    try{
        const response = await fetch(`${API_SERVER}${urls.getCompanies}`, getMethod);
        const result = await response.json();
        return result;
    }
    catch (err) {
        console.log('getAllCompanies Error:', err.message);
      }
}
export async function getPlanName(){
  try{
      const response = await fetch(`${API_SERVER}${urls.getPlanName}`, getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('getPlanName Error:', err.message);
    }
}
export async function deletecreator(id){
    try{
        const response = await fetch(`${API_SERVER}${urls.deletecreator}${id}`, getMethod);
        const result = await response.json();
        console.log(result);
        return result;
    }
    catch (err) {
        console.log('deletecreator Error:', err);
      }
}