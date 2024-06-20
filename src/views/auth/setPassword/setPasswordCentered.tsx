/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   ____  ____   ___  
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| |  _ \|  _ \ / _ \ 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || |  | |_) | |_) | | | |
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |  |  __/|  _ <| |_| |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___| |_|   |_| \_\\___/ 
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.horizon-ui.com/pro/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import InputField from 'components/fields/InputField';
import React, { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';

// Custom components
import OnToast from 'components/alerts/toast';
import { PasswordValidation } from 'utils/formValidations/validations';

import {
  updatePassword,
} from 'utils/creator/creator';

const SetPasswordCentered: React.FC = () => {
  const [password, setPassword] = useState<{
    password: string;
    confirmPassword: string;
  }>({ password: '', confirmPassword: '' });
  const [err, setErr] = useState(false); //if has error then true, otherwise false
  const [alert, setAlert] = useState(false); //if has error then true, otherwise false
  const [msg, setMsg] = useState(null); //if has error then true, otherwise false
  const { type, uuid } = useParams();
  const navigate = useNavigate();
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');

  const handleChange = (val: string, field: string) => {
    if (field === 'pwd') {
      //password
      setPassword({ ...password, password: val });
    } else {
      setPassword({ ...password, confirmPassword: val });
    }
  };
  const handleSubmit = async () => {
    if (password.confirmPassword === '') {
      setErr(true);
      setMsg('Confirm Password Field is Empty');
    } else if (password.password == '') {
      setErr(true);
      setMsg('Password Field is Empty');
    } else if (
      password.confirmPassword !== '' &&
      password.confirmPassword != password.password
    ) {
      setErr(true);
      setMsg('Password and Confirm passwords are not matched');
    } else {
      let valid = PasswordValidation(password.password, 8, 16);
      if (valid.err) {
        setErr(true);
        setMsg(valid.msg);
      } else {
        setErr(false);
        let dataToSend = {
          password: password.password,
          uuid: uuid,
          type: type,
        };
      //send password update request for both creator and learners in the same file
        let updatePasswordResult = await updatePassword(uuid,  JSON.stringify(dataToSend));
        console.log("updatePasswordResult", updatePasswordResult);
        setMsg(updatePasswordResult?.message);
        setAlert(true);
        updatePasswordResult?.status ==="Success" ? setErr(false) : setErr(true);
        
        setTimeout(function(){
          setErr(false);
          setMsg("");
          setAlert(false);
          navigate('/auth/sign-in/default');
        },2500);
      }
    }
    //update the password in creator table if both passward and confirm password matched
  };



  return (
    <Flex
      w="100%"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      px={{ base: '25px', md: '0px' }}
      flexDirection="column"
    >
      <Box mb="34px">
        <Heading
          color={textColor}
          fontSize={{ base: '3xl', md: '36px' }}
          mb="16px"
        >
          Set your password?
        </Heading>
      </Box>
      <Flex
        zIndex="2"
        direction="column"
        w={{ base: '100%', lg: '456px' }}
        maxW="100%"
        background="transparent"
        borderRadius="15px"
        align="start"
      >
        <FormControl>
          <InputField
            mb="10px"
            me="30px"
            id="ctPassword"
            name="ctPassword"
            isRequired={true}
            label="New Password"
            placeholder="eg. pass"
            type="password"
            onChange={(e: any) => handleChange(e.target.value, 'pwd')}
            value={password.password}
            autoComplete="off"
          />
          <InputField
            mb="10px"
            me="30px"
            id="cnfPassword"
            name="cnfPassword"
            isRequired={true}
            label="Confirm Password"
            placeholder="eg. pass"
            type="text"
            // onChange={(e : any)=>{
            //   console.log(e);
            //   setPassword({...password, confirmPassword:e.target.value})
            // }}
            onChange={(e: any) => handleChange(e.target.value, 'cnf')}
            value={password.confirmPassword}
            autoComplete="off"
          />
          {alert ? (
            <OnToast msg={msg} status={err ? 'error' : 'success'} setAlert={setAlert} />
          ) : null}
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default SetPasswordCentered;
