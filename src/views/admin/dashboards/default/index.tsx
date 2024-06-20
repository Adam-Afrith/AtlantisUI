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
// import { Flex, Grid, useColorModeValue } from '@chakra-ui/react';
// Chakra imports
import {  
  Flex,
  SimpleGrid,
  Text,
  Icon,
  Image,  
  Grid, 
  useColorModeValue
} from '@chakra-ui/react';
// Custom components
import Balance from 'views/admin/dashboards/default/components/Balance';
import DailyTraffic from 'views/admin/dashboards/default/components/DailyTraffic';
import MostVisitedTable from 'views/admin/dashboards/default/components/MostVisitedTable';
import { VSeparator } from 'components/separator/Separator';
import OverallRevenue from 'views/admin/dashboards/default/components/OverallRevenue';
import ProfitEstimation from 'views/admin/dashboards/default/components/ProfitEstimation';

import ProjectStatus from 'views/admin/dashboards/default/components/ProjectStatus';

import YourCard from 'views/admin/dashboards/default/components/YourCard';
import YourTransfers from 'views/admin/dashboards/default/components/YourTransfers';
import tableDataMostVisited from 'views/admin/dashboards/default/variables/tableDataMostVisited';


import Statistics from '../../../../views/admin/main/account/application/components/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';
import FakeBarChart from '../../../../assets/img/account/FakeBarChart.png';
import CountUp from 'react-countup';
import axios from 'axios';


// icons
import { RiArrowUpSFill } from 'react-icons/ri';
import { RiArrowDownSFill } from 'react-icons/ri';
import { MdOutlineBarChart, MdPerson, MdFileCopy,MdGamepad,MdBook } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { noofCompany } from 'utils/dashboard/dashboardService';
import {useAuth}  from 'contexts/auth.context';
import {login} from 'store/user/userSlice';
import { useDispatch } from 'react-redux';

interface YourStateType {
  totalCompany: any;
  companyMonthwise: any;
  totalCreators: any;
  creatorsMonthwise: any;
  GameMonthwise: any;
  totalLearners: any;
  learnerMonthwise: any;
  totalGame: any;
}

type shape = {
  value: any;
}


export default function Default() {

  const [result, setResult] = useState<YourStateType>({
    totalCompany: '',
    companyMonthwise: '',
    totalCreators: '',
    creatorsMonthwise: '',
    GameMonthwise: '',
    totalLearners: '',
    learnerMonthwise: '',
    totalGame: '',
  });
  // Chakra Color Mode    
  const iconBg = useColorModeValue('secondaryGray.300', 'navy.700');
  const iconColor = useColorModeValue('brand.500', 'white');
  const paleGray = useColorModeValue('#DFE6F6', 'whiteAlpha.100');
  const { user, setUser } = useAuth();
  const dispatch = useDispatch();


  dispatch(login(user));

useEffect(()=>{
 const fetchData= async () =>{
  const res = await noofCompany();
  if(res?.status !=='Success') return console.log('noOf useEffect Error :',res?.message);
  console.log('res',res);
  setResult((prev: YourStateType)=>{
    return {
      ...prev,
      totalCompany: res?.data?.companyCount,
      companyMonthwise: res?.data?.newCompany,
      totalCreators:res?.data?.CreatorCount,
      creatorsMonthwise:res?.data?.newCreator,
      totalLearners:res?.data?.LearnerCount,
      learnerMonthwise:res?.data?.newLearner,
      totalGame:res?.data?.GamesCount,
      GameMonthwise:res?.data?.newGames,
      
     
    }
  });   
}
fetchData();
},[]);



return (
  <Flex
    direction={{ base: 'column', xl: 'row' }}
    pt={{ base: '70px', md: '80px', xl: '80px' }}
  >
    <Flex direction="column" width="stretch">
      <Grid
        mb="20px"
        gridTemplateColumns={{ base: 'repeat(2, 1fr)', '2xl': '720fr 350fr' }}
        gap="20px"
        display={{ base: 'block', lg: 'grid' }}
      >
        <Flex gridArea={{ base: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}>
          <OverallRevenue count={result.totalCompany as any} />
        </Flex>
        <Flex gridArea={{ base: '2 / 1 / 3 / 3', '2xl': '1 / 2 / 2 / 3' }}>
          <Balance />
        </Flex>
       
      </Grid>
      <Grid
        mb="20px"
        gridTemplateColumns={{ base: 'repeat(2, 1fr)', '2xl': '720fr 350fr' }}
        gap="20px"
        display={{ base: 'block', lg: 'grid' }}
      >
      <Flex gridArea={{ base: '2 / 1 / 3 / 3', '2xl': '1 / 2 / 2 / 3' }}>
        <MostVisitedTable count={result.totalGame as any}/>
        </Flex>
        </Grid>
      <Grid
        gap="20px"
        gridTemplateColumns={{
          md: 'repeat(2, 1fr)',
          '2xl': 'repeat(3, 1fr)',
        }}
        gridTemplateRows={{
          md: 'repeat(2, 1fr)',
          '2xl': '1fr',
        }}
        mb="20px"
      >

        <Flex gridArea={{ md: '1 / 1 / 2 / 2', '2xl': '1 / 1 / 2 / 2' }}>
          <DailyTraffic count={result.totalCreators as any}/>
        </Flex>
        <Flex gridArea={{ md: '1 / 2 / 2 / 3', '2xl': '1 / 2 / 2 / 3' }}>
          <ProjectStatus count={result.totalLearners as any}/>
        </Flex>
       
      </Grid>
     
     
       
       
    
    </Flex>
    <VSeparator
      mx="20px"
      bg={paleGray}
      display={{ base: 'none', xl: 'flex' }}
    />
    <YourCard
      maxW={{ base: '100%', xl: '400px' }}
      maxH={{ base: '100%', xl: '1170px', '2xl': '100%' }}
    />
    
  </Flex>
);
}
