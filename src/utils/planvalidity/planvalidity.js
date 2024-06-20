import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';

export async function creatPlanValidity(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.creatPlanValidity}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('creatPlanValidity Error :', err);
  }
}
export async function getEndDateById(idv) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getEndDateById}${idv}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getEndDateById Error :', err);
  }
}
export async function getPlanValidity() {
  try {
    const response = await fetch(`${API_SERVER}${urls.getPlanValidity}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getPlanValidity Error:', err);
  }
}
export async function getValidityPeriod() {
  try {
    const response = await fetch(`${API_SERVER}${urls.getValidityPeriod}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getValidityPeriod Error:', err);
  }
}
export async function getEndDate(idv) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getEndDate}${idv}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getEndDate Error:', err);
  }
}
// export async function updatePlanValidity(idv, data) {
//     try {
//       const response = await fetch(`${API_SERVER}${urls.updatePlanValidity}${idv}`,putMethod(data));
//       const result = await response.json();
//       return result;
//     } catch (err) {
//       console.log('updatePlanValidity Error:', err);
//     }
//   }
  export async function updatePlanValidity(idv, data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.updatePlanValidity}${idv}`,putMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updatePlanValidity Error:', err);
    }
  }
  export async function getPlanTypeInCreator(idv) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getPlanTypeInCreator}${idv}`,getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getPlanTypeInCreator Error :', err);
    }
  }