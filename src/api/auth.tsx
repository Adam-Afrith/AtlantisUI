import axios from "./index";
// F:\reactproject\L-M-S\Navin\front\src\api\auth.tsx
class AuthApi {
  static Login = (data: any) => {
    return axios.post(`${base}/login`, data);
  };

  static Register = (data: any) => {
    return axios.post(`${base}/register`, data);
  };

  static Logout = (data: any) => {
    return axios.post(`${base}/logout`, data, { headers: { Authorization: `${data.token}` } });
   };
} 
 let base = "users";

export default AuthApi;
