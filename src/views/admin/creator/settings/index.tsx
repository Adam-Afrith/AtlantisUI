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
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
// Assets
import banner from 'assets/img/auth/banner.png';
import profile from 'assets/img/crm/pro.png';

// Custom components
import Info from './components/Info';
import Password from './components/Password';
import Profile from './components/Profile';
import Socials from './components/Socials';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCreator } from 'utils/creator/creator';

export default function Settings() {
  const [creator,setCreator] = useState<any>();
  const [funk, setFunk] = useState();
  const storage = JSON.parse(localStorage.getItem('user'));
     const {id} = useParams();
     const Creator = async (id:string) =>{
      const result = await getCreator(id)
      if(result?.status !== 'Success') return console.log('getCretaor error :',result?.message)
      setCreator(result?.data);
      setFunk(result?.data);
     }
     useEffect(()=>{
        Creator(storage.data.id); 
     },[])
    console.log('creator',creator);
  return (
    <Box pt={{ base: '75px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, lg: 2 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        
        <Flex direction="column">
          <Profile name="Vlad Mihalache" data={creator} avatar={profile} banner={banner} />
          <Info funk={funk} setFunk={setFunk}/>
        </Flex>
        
        <Flex direction="column">
        <Password />  
        </Flex>
      </SimpleGrid>
    </Box>
  );
}
