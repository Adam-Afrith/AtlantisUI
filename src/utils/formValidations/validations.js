import {
    emailExistenceChecker
  } from 'utils/creator/creator';

//value => string,  combinations =>{acn}a-alpha, c-special character, n-numeric, 
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).*$/;

export const PasswordValidation = (str, minlength, maxlength)=>{
    if(str.length<minlength){
        return {err: true, msg: "Minimum "+minlength+" Characters required"};
    }
    else if(str.length>maxlength){
        return {err: true, msg: "Maximum "+ maxlength+" Characters Only allowed"};
    }
    else if(passwordPattern.test(str)){
        return {err: false, msg: "Valid password"};
    }
    else{
        return {err: true, msg: "Invalid password"};
    }
}

