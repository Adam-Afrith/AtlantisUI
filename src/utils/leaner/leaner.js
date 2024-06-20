import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod, urls } from 'utils/url/urls';
const person = localStorage.getItem('user');
const user = JSON.parse(person);

// const token = localStorage.getItem('user');

// const headers = {
//   Authorization: token,
//   'Content-Type': 'application/json',
// };
export async function addLearner(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.addLearner}`, postMethod(data));
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

export async function getAllLearner(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getLearner}`, postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getLearnerById(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getLearnerById}${id}`, getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}


export async function updateLearner(idv, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.updateLearner}${idv}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error:', err);
  }
}
export async function learnerStatus(idv, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.learnerStatus}${idv}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateStatus Error:', err);
  }
}

export async function learnerAdd(idv) {
  try {
    const response = await fetch(`${API_SERVER}${urls.learnerMail}${idv}`, getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateStatus Error:', err);
  }
}
export async function getSelectedGame(idv) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getselectedgame}${idv}`, getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateStatus Error:', err);
  }
}

export async function gameAssign(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.createAssign}`, postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateStatus Error:', err);
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

export async function deleteLearner(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.deleteLearner}${id}`, getMethod);
    const result = await response.json();
    return result;
  }
  catch (err) {
    console.log('deletecreator Error:', err);
  }
}
export async function getcohorts(id){
  try{
        const response = await fetch(`${API_SERVER}${urls.getcohorts}`,getMethod);
        const result = await response.json();
       return result;
      }
 catch (err) {
        console.log('getcohorts Error:', err);
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
        