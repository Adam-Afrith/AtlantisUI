import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';

// const token = localStorage.getItem('user');

// const headers = {
//   Authorization: token,
//   'Content-Type': 'application/json',
// };
export async function addCreator(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.addCreator}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('addCreator Error :', err);
  }
}

// export async function getCountries() {
//   try {
//     const response = await fetch(`${API_SERVER}${urls.getCountries}`);
//     const result = await response.json();
//     return result;
//   } catch (err) {
//     console.log('addCreator Error :', err);
//   }
// }

export async function getAllCreator(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getAllCreator}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getCreator(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getCreator}${id}`,getMethod);
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
export async function CreatorStatus(idv, data) {
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
export async function changePassword(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.changePassword}${id}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function updateCreator(idv, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.updateCreator}${idv}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error:', err);
  }
}
export async function updatePassword(idv, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.updatePassword}${idv}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updatePassword Error:', err);
  }
}


// export async function getAllCompanies(){
//     try{
//         const response = await fetch(`${API_SERVER}${urls.getCompanies}`);
//         const result = await response.json();
//         return result;
//     }
//     catch (err) {
//         console.log('editCompany Error:', err.message);
//       }
// }

export async function deletecreator(id){
    try{
        const response = await fetch(`${API_SERVER}${urls.deletecreator}${id}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch (err) {
        console.log('deletecreator Error:', err);
      }
}

export async function emailExistenceChecker(data){
  try{
    const response = await fetch(`${API_SERVER}${urls.emailchecker}`,postMethod(data));
    const result = await response.json();
    return result;
}
catch (err) {
    console.log('EmailExisitence Error:', err);
  }
}

export async function getSelectCohortsNames() {
  try {
    const response = await fetch(`${API_SERVER}${urls.getSelectCohortsNames}`, getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getSelectCohortsNames Error:', err);
  }
}

export async function getCohortsByCreatorId(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.getCohortsByCreatorId}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('deletecreator Error:', err);
    }
}