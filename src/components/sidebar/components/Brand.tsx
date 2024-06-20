// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';
import { logoutAuto } from 'utils/admin/adminService';

// \\192.168.1.51\d\PK3\AtlantisUI\src\utils\admin\adminService.js

export function SidebarBrand(props: { mini: boolean; hovered: boolean }) {
  const { mini, hovered } = props;
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');
  const navigate = useNavigate();
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [inactivityInterval, setInactivityInterval] = useState(null);

  useEffect(() => {

    const handleActivity = () => {
      setLastActivityTime(Date.now());
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);


    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(inactivityInterval);
    };
  }, []);

  useEffect(() => {
    const storedUserString = localStorage.getItem('user');
    const storedUser = JSON.parse(storedUserString);
    const sessionTimeout = 60 * 60 * 1000; // 10 minutes in milliseconds

    const checkInactivity = async () => {
      const currentTime = Date.now();
      if (currentTime - lastActivityTime > sessionTimeout) {
        const data = {
          userid: storedUser.data.id,
          userrole: storedUser.data.role
        };

        const datas = JSON.stringify(data);
        await logoutAuto(datas);
        localStorage.removeItem('user');
        navigate('/');


      }
    };


    const inactivityInterval = setInterval(checkInactivity, 1000);


    return () => clearInterval(inactivityInterval);
  }, [lastActivityTime]);

  // const LogoutAutometicly = async (uId: any, uRole: any) => {

  // }



  return (
    <Flex alignItems="center" flexDirection="column" p={'0px'} mb={'20px'}>
      {/* <HorizonLogo
        h="26px"
        w="175px"
        my="32px"
        color={logoColor}
        display={
          mini === false
            ? 'block'
            : mini === true && hovered === true
            ? 'block'
            : 'none'
        }
      /> */}
      {/* <Text fontSize={20} fontWeight={600} mb='20px' letterSpacing={'2px'} >ATLANTIS</Text> */}
      <Text fontSize={25} fontWeight={800}  letterSpacing={'2px'} color={'#fff'} mr={'7px'} >ATLANTIS</Text>
      <Text
        display={
          mini === false
            ? 'none'
            : mini === true && hovered === true
            ? 'none'
            : 'block'
        }
        fontSize={'30px'}
        fontWeight="800"
        color={logoColor}
      >
        A
      </Text>
      { <HSeparator mt="20px" /> }
    </Flex>
  );
}

export default SidebarBrand;
