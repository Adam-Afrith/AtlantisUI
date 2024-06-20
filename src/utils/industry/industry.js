import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';


export async function addIndustry(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.addIndustry}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('addIndustry Error :', err);
  }
}
export async function updateIndustry(idv, data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.updateIndustry}${idv}`,putMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updateIndustry Error:', err);
    }
  }

  export async function IndustryStatus(idv, data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.industrystatus}${idv}`, putMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updateStatus Error:', err);
    }
  }

  export async function deleteIndustry(idv) {
    try {
      const response = await fetch(`${API_SERVER}${urls.deleteIndustry}${idv}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('deleteIndustry Error:', err);
    }
  }
export async function getIndustryById(idv) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getIndustryById}${idv}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getIndustryById Error :', err);
  }
}

export async function getIndustry() { 
  try {
    const response = await fetch(`${API_SERVER}${urls.getIndustry}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getIndustry Error:', err);
  }

}
export async function getIndustryName() { 
  try {
    const response = await fetch(`${API_SERVER}${urls.getIndustryName}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getIndustry Error:', err);
  }
}


export async function getAllCompanies(){
    try{
        const response = await fetch(`${API_SERVER}${urls.getCompanies}`);
        const result = await response.json();
        return result;
    }
    catch (err) {
        console.log('editCompany Error:', err.message);
      }
}

export async function deletecreator(id){
    try{
        const response = await fetch(`${API_SERVER}${urls.deletecreator}${id}`);
        const result = await response.json();
        console.log(result);
        return result;
    }
    catch (err) {
        console.log('deletecreator Error:', err);
      }
}