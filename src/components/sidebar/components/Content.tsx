// chakra imports
import {
  Avatar,
  Box,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import avatar4 from 'assets/img/avatars/avatar4.png';
import { useAuth } from 'contexts/auth.context';
import { MdLogout } from 'react-icons/md';
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { logout } from 'store/user/userSlice';
import { useDispatch } from 'react-redux';
import { updatePreviewData } from 'store/preview/previewSlice';
import { logoutAuto } from 'utils/admin/adminService';

// FUNCTIONS

function SidebarContent(props: {
  onClick?: any;
  routes: RoutesType[];
  hovered?: boolean;
  mini?: boolean;
}) {
  const { routes, mini, hovered,onClick } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async() => { 
    const storedUserString = localStorage.getItem('user');
    const storedUser = JSON.parse(storedUserString);
    setUser(null);
    dispatch(logout());
    dispatch(updatePreviewData(null))
    const data = {
      userid: storedUser.data.id,
      userrole: storedUser.data.role
    };

    const datas = JSON.stringify(data);
    await logoutAuto(datas);
    localStorage.removeItem('user')
    navigate('/auth/sign-in/default')
  }

  useEffect(() => {
    // Check if the user is logged in
    const checkUserLogin = () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setUser(null);
        localStorage.removeItem('user')
        navigate('/auth/sign-in/default')
        window.location.reload();
      }
    };
    checkUserLogin();
  }, []); // Run only once when the component mounts
  // SIDEBAR
  return (
    <Flex direction="column" height="100%" p="25px" w={{sm:'265px',lg:"285px"}} borderRadius="30px"
      m={{sm:'20px 10px',lg:"20px"}} >
      <Brand mini={mini} hovered={hovered} />
      <Stack direction="column" mb="" mt="8px" ml="-15px" alignItems="left" overflowY={'auto'} h={'65%'}>
        <Box
          // ps={
          //   mini === false
          //     ? '20px'
          //     : mini === true && hovered === true
          //     ? '20px'
          //     : '16px'
          // }
          pe={{ md: '16px', '2xl': '1px' }}
          ms={mini && hovered === false ? '-16px' : 'unset'}

        >
          <Links mini={mini} hovered={hovered} routes={routes} onClick={onClick} />
        </Box>
      </Stack>

      {/* <Box
        ps="20px"
        pe={{ md: '16px', '2xl': '0px' }}
        // mt="60px"
        borderRadius="30px"
      >
        <SidebarCard mini={mini} hovered={hovered} />
      </Box> */}
      <Flex mt="30px" justifyContent="space-between" w={'210px'}>
        <Box display="flex" justifyContent="flex-start"  alignItems="flex-between">
          <Avatar
            h="48px"
            w="48px"
            src={avatar4}
            me={
              mini === false
                ? '20px'
                : mini === true && hovered === true
                  ? '20px'
                  : '0px'
            }
          />
          <Box
            display={
              mini === false
                ? 'block'
                : mini === true && hovered === true
                  ? 'block'
                  : 'none'
            }
          >
            <Text color={'#fff'} fontSize="md" fontWeight="700" textTransform="capitalize">
              {user?.data?.name}
            </Text>
            <Text color="secondaryGray.600" fontSize="sm" fontWeight="400" textTransform="capitalize">
              {user?.data?.role}
            </Text>
          </Box></Box>
         <Box display="flex" justifyContent="center" alignItems="center">
          <Icon ml={'15px'} color={'#fff'} cursor={'pointer'} as={AiOutlineLogout} w={'20px'} h={'20px'} onClick={handleLogout} style={{ transform: 'rotate(270deg)' }} />
        </Box>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
