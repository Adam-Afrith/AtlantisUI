let BACKEND_SERVER = null;
if (process.env.REACT_APP_BACKEND_SERVER) {
  BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER;
} else {  
        // BACKEND_SERVER = "http://35.183.46.127:5555"; //old server ip
        // BACKEND_SERVER = "http://192.168.1.30:5555"; 
        BACKEND_SERVER = "http://192.168.1.51:5511";
      }
export const API_SERVER = BACKEND_SERVER;
export const Notelength = 150; 
export const Dialoglength = 300;
export const Responselength = 300;
export const DemoPlayRoutePath = '/game/creator/demoplay/';
   