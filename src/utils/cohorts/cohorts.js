import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls,postMethodfile} from 'utils/url/urls';
const person = localStorage.getItem('user');
const user = JSON.parse(person);



export async function learnerListData(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.learnerListData}`, postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }
  export async function updatecohortsLearner(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.updatecohortsLearner}`, postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updatecohortsLearner Error :', err);
    }
  }
  export async function checkCohorts(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.checkCohorts}${id}`, getMethod);
      
      const result = await response.json();
      return result;
    }
    catch (err) {
      console.log('updatecohorts Error:', err);
    }
  }
   

export async function addcohorts(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.addcohorts}`, {
        method: 'POST',
        headers: {
          Authorization: user?.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('addcohorts Error:', err);
    }
  }

export async function getcohortsPrint(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getcohortsPrint}${id}`,getMethod);
      const result = await response.json(); 
      return result;
    } catch (err) {
      console.log('getAnswer Error:', err);
    }
  }

  export async function updatecohortsgame(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.updatecohortsgame}`, postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updatecohortsgame Error :', err);
    }
}
export async function gamesListData(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.gamesListData}`,postMethod(data));
      const result = await response.json(); 
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }

 
  export async function updatecohorts(idv, data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.updatecohorts}${idv}`, putMethod(data));
      const result = await response.json();
      return result;
    }
    catch (err) {
      console.log('updatecohorts Error:', err);
    }
  }
 
  export async function cohortsLearnerAllDatas(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.cohortsLearnerAllDatas}${id}`, getMethod); // Add a slash before id
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
      throw err; // Rethrow the error to handle it in the caller function
    }
  }

  export async function reomvecohorts(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.reomvecohorts}${id}`, getMethod);
      const result = await response.json();
      return result;
    }
    catch (err) {
      console.log('updatecohorts Error:', err);
    }
  }

  

export async function getAllCohorts(){
  try{  
        console.log('api entered into cohorts all');
        const response = await fetch(`${API_SERVER}${urls.getAllCohorts}`,getMethod);
        const result = await response.json();
       return result;
      }
 catch (err) {
        console.log('getAllCohorts Error:', err);
  }
}