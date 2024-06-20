import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, urls ,putMethod} from 'utils/url/urls';

export async function addReviewers(data) {
  try {
    const response = await fetch(
      `${API_SERVER}${urls.addReviews}`,
      postMethod(data),
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getAllReviews(id) {
  try {
    const response = await fetch(
      `${API_SERVER}${urls.getAllReviews}${id}`,
      getMethod,
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function addReadStatus(data) {
  try {
    const response = await fetch(
      `${API_SERVER}${urls.addReadStatus}`,
      putMethod(data),
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}