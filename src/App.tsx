import './assets/css/App.css';
import './assets/css/ResponsiveApp.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import SignInDefault from '../src/views/auth/signIn/SignInDefault';
import {
  ChakraProvider,
  Box
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useEffect, useState } from 'react';
import EntirePreview from 'views/admin/superadmin/game/demoplay/EntirePreview';
import GamePreview from 'views/admin/superadmin/game/demoplay/GamePreview';
import GlbPractise from 'views/admin/games/game/components/GlbPractise';
// import ScreenPreview from 'views/admin/superadmin/game/components/ScreenPreview';
import ScreenPreview from 'views/admin/superadmin/game/components/ScreenPreview';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/auth.context';
import { logout } from 'store/user/userSlice';
import { updatePreviewData } from 'store/preview/previewSlice';
import InteractionScreenShot from 'views/admin/superadmin/game/demoplay/playcards/InteractionScreenShot';
import CohortsLearnerPrint from 'views/admin/superadmin/Cohort/components/CohortsLearnerPrint';
import CohortsGamePrint from '../src/views/admin/superadmin/Cohort/components/CohortsGamePrint';
// Lokie Added 04/06/2024
import AssignGames from '../src/views/admin/superadmin/learner_activity/AssignedGames';
import BlockScore from '../src/views/admin/superadmin/learner_activity/BlockScore';
// Lokie End 04/06/2024
import SkillWiseScorePrint from 'views/admin/superadmin/gamewise_activity/components/SkillWiseScorePrint';
import FeedBackGameWise from 'views/admin/superadmin/gamewise_activity/components/FeedBackGameWise';
import PrintGameWiseActivity from '../src/views/admin/superadmin/gamewise_activity/components/PrintGameWiseActivity';

import PrintGameList from 'views/admin/superadmin/creatorActivity/components/PrintGamesList';
import PrintLearnerDetails from 'views/admin/superadmin/creatorActivity/components/PrintLearnerDetails';
import GameAssignPrint from '../src/views/admin/superadmin/gamewise_activity/components/GameAssignPrint';
import CompleteGamePrint from 'views/admin/superadmin/gamewise_activity/components/CompleteGamePrint';
import StartedPrint from 'views/admin/superadmin/gamewise_activity/components/StartedPrint';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const dispatch = useDispatch();
  //parsing JWT Token
  const parseJwt = (token:any) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// token expired logout
const handleLogout = () => { 
  setUser(null);
  dispatch(logout());
  dispatch(updatePreviewData(null))
  localStorage.removeItem('user')
  navigate('/auth/sign-in/default')
}

// checking token expiration
useEffect(() => {
  const user: any = JSON.parse(localStorage.getItem('user'));
    if (user) {
    const decodedJwt = parseJwt(user?.token);
    if (decodedJwt.exp * 1000 < Date.now()) {
      handleLogout();
    }
  }
}, []); // Make sure to include history in dependencies

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="game/demoplay/:uuid" element={<GamePreview />} />
        <Route path="/game/creator/demoplay/:id" element={<GamePreview />} />
        <Route path="/screen/preview/:id" element={<ScreenPreview />} />
        <Route path="auth/sign-in/default" element={<SignInDefault />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
        />
        <Route
          path="rtl/*"
          element={<RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />}
        />
          {/* <Route path="/screen/preview/" element={<OrientationLock />} /> */}
        <Route path="/" element={<Navigate to="/admin" replace />} />


        <Route path="/gameFeedback/:id" element={<FeedBackGameWise />} />
        <Route path="/gameAnswer/:id"element={<PrintGameWiseActivity/>} />
        <Route path="/Noofgame/:id"element={<PrintGameList/>} />
        <Route path="/Noofgamelaunch/:id"element={<PrintGameList/>} />
        <Route path="/Noofgamepublish/:id"element={<PrintGameList/>} />
        <Route path="/learnerDetails/:id"element={<PrintLearnerDetails/>} />

        <Route path="/AssignedGames/:id"element={<AssignGames/>} />
        <Route path="/BlockGameScore/:id"element={<BlockScore/>} />
        <Route path="/getSkillWiseScore/:id" element={<SkillWiseScorePrint />} />
        <Route path="/CohortsLearnerPrint/:id" element={<CohortsLearnerPrint />} />
        <Route path="/coshorts/:id"element={<CohortsGamePrint/>}  />
        <Route path="/getGameAssignData/:id"element={<GameAssignPrint/>} />
        <Route path="/getGameComplete/:id" element={<CompleteGamePrint />} />
        <Route path="/getStarted/:id" element={<StartedPrint />} />
      </Routes>      
    </ChakraProvider>
  );
}
