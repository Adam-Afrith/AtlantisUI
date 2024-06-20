import { API_SERVER } from "config/constant"
import { getMethod, urls } from "utils/url/urls"



export async function noofCompany(){
    try{
        const response = await fetch(`${API_SERVER}${urls.noofCompany}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch(err)
    {
        console.log('noofCompany Error:',err.message)
    }
}
export async function noOfCreators(){
    try{
        const response = await fetch(`${API_SERVER}${urls.noOfCreators}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch(err)
    {
        console.log('noOfCreators Error:',err.message)
    }
}

export async function noOfLeaners(){
    try{
        const response = await fetch(`${API_SERVER}${urls.noOfLeaners}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch(err)
    {
        console.log('noOfLeaners Error:',err.message)
    }
}
export async function noOfGames(){
    try{
        const response = await fetch(`${API_SERVER}${urls.noOfGames}`,getMethod);
        const result = await response.json();
        return result;
    }
    catch(err)
    {
        console.log('noOfGames Error:',err.message)
    }
}