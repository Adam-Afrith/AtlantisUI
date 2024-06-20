import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';

export async function createSubscription(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.createSubscription}`,postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('createSubscription Error :', err);
  }
}
export async function updateSubscription(idv, data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.updateSubscription}${idv}`,putMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updateSubscription Error:', err);
    }
  }
//   const person = localStorage.getItem('user');
// const user = JSON.parse(person);
//   export async function getSubscriptionPlanById(idv, data) {
//     try {
//       const response = await fetch(`${API_SERVER}${urls.getSubscriptionPlanById}${idv}`,{ method: 'GET',
//       mode: 'cors',
//       headers: {
//         Authorization: user?.token,
//         'Content-Type': 'application/json',
//       },});
//       const result = await response.json();
//       return result;
//     } catch (err) {
//       console.log('getSubscriptionPlanById Error:', err);
//     }
//   }
  // export async function getSubscriptionPlanById(idv) {
  //   try {
  //     const response = await fetch(`${API_SERVER}${urls.getSubscriptionPlanById}${idv}`, getMethod);
  //     const result = await response.json();
      
  //     if (result.status === 'Success') {
  //       // Extracting the data property from the response
  //       const data = result.data || [];
  
  //       // Logging the data for debugging purposes
  //       console.log('Data:', data);
  
  //       return data;
  //     } else {
  //       // Handle error scenarios
  //       console.error('getSubscriptionPlanById Error:', result.message);
  //       return [];
  //     }
  //   } catch (err) {
  //     console.error('getSubscriptionPlan Error:', err);
  //     return [];
  //   }
  // }
  export async function getSubscriptionPlanById(idv) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getSubscriptionPlanById}${idv}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getSubscriptionPlanById Error:', err);
    }
  }
  export async function getSubscriptionPlanById1(idv) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getSubscriptionPlanById1}${idv}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getSubscriptionPlanById1 Error:', err);
    }
  }
  export async function getPlanType(idv) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getPlanType}${idv}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getPlanType Error:', err);
    }
  }
  
  export async function getSubscriptionPlan(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getSubscriptionPlan}`, postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getSubscriptionPlan Error:', err);
    }
  }
  