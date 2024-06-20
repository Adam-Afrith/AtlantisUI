import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls} from 'utils/url/urls';

// export async function updatetranslatelang(data) {
//   try {
//     const response = await fetch(`${API_SERVER}${urls.createSubscription}`,postMethod(data));
//     const result = await response.json();
//     return result;
//   } catch (err) {
//     console.log('createSubscription Error :', err);
//   }
// }

  export async function gettranslateddata(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.translate}`, postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('gettranslateddata Error:', err);
    }
  }
  