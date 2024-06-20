import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';

// createCategory
// getallcategory:'/category/getAllCategory',
// updateCategory:'/category/updateCategory',
// removeCategory:'/category/removeCategory',
// getCategory:'/category/getCategory',
// getCategoryList:'/category/getCategoryList',
export async function createCategory(data) {
  try { 

    const response = await fetch(`${API_SERVER}${urls.createCategory}`,postMethod(data));
    console.log('response',response);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('createCategory Error :', err);
  }
}


export async function getallcategory() {
  try {
    const response = await fetch(`${API_SERVER}${urls.getallcategory}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getallcategory Error:', err);
  }
}
export async function getCategory(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getCategory}${id}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCategory Error:', err);
  }
}

export async function CategoryDataGet() {
  try {
    const response = await fetch(`${API_SERVER}${urls.CategoryDataGet}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCategory Error:', err);
  }
}


export async function updateCategory(idv,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.updateCategory}${idv}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCategory Error:', err);
  }
}

export async function getCategoryList(idv) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getCategoryList}`, getMethod);
    const result = await response.json();
    console.log(' response 1',result);
    return result;
  } catch (err) {
    console.log('getCategoryList Error:', err);
  }
}


export async function removeCategory(id){
    try{
        const response = await fetch(`${API_SERVER}${urls.removeCategory}${id}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch (err) {
        console.log('removeCategory Error:', err);
      }
}

export async function getOneCategory(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.getCategory}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('getCategory Error:', err);
    }
}

export async function CategoryStatus(id, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.categorystatus}${id}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateStatus Error:', err);
  }
}
