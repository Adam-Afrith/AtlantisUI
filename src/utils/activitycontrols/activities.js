import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod, urls } from 'utils/url/urls';
const person = localStorage.getItem('user');
const user = JSON.parse(person);




export async function getGameWiseData(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getGameWiseData}`, postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }
  
  export async function getSkillWiseScore(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getSkillWiseScore}${id}`, getMethod); // Add a slash before id
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
      throw err; // Rethrow the error to handle it in the caller function
    }
  } 



  export async function GameCompleteList(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.GameCompleteList}${id}`, getMethod); // Add a slash before id
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
      throw err; // Rethrow the error to handle it in the caller function
    }
  }
  export async function getGameAnswer(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getGameAnswer}${id}`,getMethod);
      const result = await response.json(); 
      return result;
    } catch (err) {
      console.log('getAnswer Error:', err);
    }
  }
  export async function getAllLearners(data) {
    console.log("deded1")
    try {
      console.log("edeef2");
      const response = await fetch(`${API_SERVER}${urls.getAllLearners}`, postMethod(data));
      console.log("response 12345",response);
      const result = await response.json();
      console.log("hello leo");
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }

  export async function getAllLearnerFilter() {
    try {
      const response = await fetch(`${API_SERVER}${urls.getLearnerFilter}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
    }
  }

  export async function getAssignedGames(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getAssignedGames}/${id}`, getMethod);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('updateStatus Error:', err);
    }
  }

  // 
export async function getBlocklWiseScore(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getBlocklWiseScore}/${id}`, getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateStatus Error:', err);
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
  export async function getGameAssignData(id) {
    try {
      const response = await fetch(`${API_SERVER}${urls.getGameAssignData}${id}`, getMethod); // Add a slash before id
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('getCreator Error:', err);
      throw err; // Rethrow the error to handle it in the caller function
    }
  }