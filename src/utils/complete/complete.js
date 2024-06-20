import { API_SERVER } from "config/constant";
import { postMethod, urls } from "utils/url/urls";

export async function addBulkComplete(data) {
    try {
      const response = await fetch(`${API_SERVER}${urls.bulkComplete}`,postMethod(data));
      const result = await response.json();
      return result;
    } catch (err) {
      console.log('addCreator Error :', err);
    }
  }