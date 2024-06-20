import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod, urls } from 'utils/url/urls';

export async function createCompany(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.createCopmany}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('createCompany Error :', err);
  }
}

export async function getCountries() {
  try {
    const response = await fetch(`${API_SERVER}${urls.getCountries}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('createCompany Error :', err);
  }
}

export async function getCompany(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getCompany}${id}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCompany Error:', err);
  }
}

export async function editCompany(idv, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.editCompany}${idv}`,putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('editCompany Error:', err);
  }
}

export async function getAllCompanies(){
    try{
        const response = await fetch(`${API_SERVER}${urls.getCompanies}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch (err) {
        console.log('editCompany Error:', err.message);
      }
}
export async function CompanyStatus(idv, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.companystatus}${idv}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateStatus Error:', err);
  }
}
export async function removeCompany(id){
    try{
        const response = await fetch(`${API_SERVER}${urls.removeCompany}${id}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch (err) {
        console.log('removeCompany Error:', err);
      }
}
export async function geoLocation(){
  try{
      const response = await fetch(`${API_SERVER}${urls.geoLocation}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('geoLocation Error:', err.message);
    }
}