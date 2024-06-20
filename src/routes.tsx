import { Icon } from '@chakra-ui/react';
import {
  MdDashboard,
  MdHome,
  MdAdminPanelSettings,
  MdGamepad, 
  MdSafetyCheck,
  MdCreate,
  MdLogout,
  MdGames,
  MdLocalActivity,
   
} from 'react-icons/md';
import { SlGameController } from "react-icons/sl";
// Admin Imports
import Dashboards from 'views/admin/dashboards/rtl/index';
import SuperAdminCompany from 'views/admin/superadmin/company/index';
import SuperAdminPlan from 'views/admin/superadmin/plan/index';
import SuperAdminIndustry from 'views/admin/superadmin/industry/index';
// vb 02.01.2024
import SuperAdminCategory from 'views/admin/superadmin/category/index';
// vb 02.01.2024
import SuperAdminCreator from 'views/admin/superadmin/creator/index';
import Learner from 'views/admin/superadmin/learner';
import Game from 'views/admin/superadmin/game/index';
import { IoBuild } from 'react-icons/io5';
// import { FaBuilding } from "react-icons/fa6";
import { FaBuildingColumns } from "react-icons/fa6";
import { GiClassicalKnowledge } from 'react-icons/gi';
import { VscGroupByRefType } from "react-icons/vsc";
import ProfileSetting from 'views/admin/creator/settings/index';
import Chortors from 'views/admin/superadmin/Cohort/index';
import SuperAdminCreatorActivity from 'views/admin/superadmin/creatorActivity/index';
import GameWiseActivity from 'views/admin/superadmin/gamewise_activity/index';
import LearnerActivity from 'views/admin/superadmin/learner_activity/index';
import Logout from 'views/admin/creator/settings/components/LogOut';

// import { useAuth } from 'contexts/auth.context';
 const storage = JSON.parse(localStorage.getItem('user'));
// const {user} =useAuth();
let role='' ;
if (!storage) {
  role= 'Admin'
}else{
  role =storage.data.role
}
const isAdmin = (role === 'Admin');
const isCreator = (role === 'Creator');
const id = storage?.data?.id;
const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/dashboards',
    icon: ( <Icon as={MdHome} width="20px" height="20px" color="#ffffff" /> ),
    component: <Dashboards />,
  },
  isAdmin &&{
    
    name: 'Company',
    path: '/superadmin/customer',
    layout: '/admin',
    icon: (
      <Icon
        as={ FaBuildingColumns }
        width="17px"
        height="17px"
        color="#ffffff"
      />
    ),
    component: <SuperAdminCompany />,
    // collapse: true,
    items: [
      role === 'Admin' && {
        name: 'Company',
        layout: '/admin',
        path: '/superadmin/customer',
        // component: <NFTMarketplace />,
        component: <SuperAdminCompany />,
        secondary: true,
        protected: true,
      },
  
    ].filter(Boolean),
  },

 
  isAdmin && {
    name: `Plan`,
    path: '/superadmin/plan',
    layout: '/admin',
    icon: <Icon as={MdSafetyCheck} width="20px" height="20px" color="#ffffff" />,
    component: <SuperAdminPlan />,
    secondary: true,
    protected: true,
    
  },
  isAdmin &&{
    name: 'Industry',
    path: '/superadmin/industry',
    layout: '/admin',
    icon: ( <Icon as={IoBuild} width="20px" height="20px" color="#ffffff" /> ),
    component: <SuperAdminIndustry />,
    secondary: true,
    protected: true, 
  },
  // vb 02.01.2024
  isAdmin &&{
    name: 'Category',
    path: '/superadmin/category',
    layout: '/admin',
    icon: ( <Icon as={IoBuild} width="20px" height="20px" color="#ffffff" /> ),
    component: <SuperAdminCategory />,
    secondary: true,
    protected: true, 
  },
  {
    name: 'Cohorts',
    path: '/superadmin/cohort',
    layout: '/admin',
    icon: ( <Icon as={VscGroupByRefType} width="20px" height="20px" color="#ffffff" /> ),
    component: <Chortors />,
    secondary: true,
    protected: true, 
  },
  // vb 02.01.2024
  isAdmin && {
    name: 'Creator',
    path: '/superadmin/creator',
    layout: '/admin',
    icon: ( <Icon as={MdCreate} width="20px" height="20px" color="#ffffff" /> ),
    component: <SuperAdminCreator />,
    secondary: true,
    protected: true, 
  },

  isAdmin && {
    name: 'Creator Activity',
    path: '/superadmin/Creator_activity',
    layout: '/admin',
    icon: ( <Icon as={IoBuild} width="20px" height="20px" color="#ffffff" /> ),
    component: <SuperAdminCreatorActivity/>,
    secondary: true,
    protected: true, 
  },
  {
    name: 'Learner',
    path: '/superadmin/learner',
    layout: '/admin',
    icon: ( <Icon as={GiClassicalKnowledge} width="20px" height="20px" color="#ffffff" /> ),
    component: <Learner />,
    secondary: true,
    protected: true, 
  },
  // {
  //   name: 'Creator Activity',
  //   path: '/superadmin/Creator_activity',
  //   layout: '/admin',
  //   icon: ( <Icon as={IoBuild} width="20px" height="20px" color="#ffffff" /> ),
  //   component: <SuperAdminCreatorActivity/>,
  //   secondary: true,
  //   protected: true, 
  // },
    {
    name: 'Learner Activity',
    path: '/superadmin/Learner_activity',
    layout: '/admin',
    icon: ( <Icon as={MdLocalActivity } width="20px" height="20px" color="#ffffff" /> ),
    component: <LearnerActivity />,
    secondary: true,
    protected: true, 
  },
    { 
    name: 'Game-Wise Activity',
    path: '/superadmin/gamewise_activity',
    layout: '/admin',
    icon: ( <Icon as={MdGames } width="20px" height="20px" color="#ffffff" /> ),
    component: <GameWiseActivity />,
    secondary: true,
    protected: true, 

  },
  {
    name: 'Profile Settings',
    path: `/creator/settings/${id}`,
    layout: '/admin',
    icon: (<Icon as={MdHome} width="20px" height="20px" color="#ffffff" />),
    component:<ProfileSetting /> ,
    secondary: true,
    protected: true,
    
  },
  isCreator && {
    name: 'Games',
    path: '/superadmin/game',
    layout: '/admin',
    icon: ( <Icon as={MdGamepad} width="20px" height="20px" color="#ffffff" /> ),
    component: <Game />,
    secondary: true,
    protected: true, 
  },
  

].filter(Boolean);

export default routes;
