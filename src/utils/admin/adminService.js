import { API_SERVER } from "config/constant";
import { urls } from "utils/url/urls";


const person = localStorage.getItem('user');
const user = JSON.parse(person);
export async function adminLogin(data){
    try{
       const response = await fetch(`${API_SERVER}${urls.adminLogin}`,{
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
       });
       const result = await response.json();
       return result;
    }
    catch(err)
    {
        console.log('adminLogin Error:',err.message);
    }
}
export async function logoutAuto(data){
    try{
       const response = await fetch(`${API_SERVER}${urls.logoutAuto}`,{
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            Authorization: user?.token,
        },
        body: data
       });
       const result = await response.json();
       return result;
    }
    catch(err)
    {
        console.log('logoutAuto Error:',err.message);
    }
}