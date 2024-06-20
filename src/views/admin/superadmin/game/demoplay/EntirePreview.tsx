import {
  Button,
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  Img,
  Menu,
  MenuButton,
  MenuList,
  FormControl,
  FormLabel,
  Textarea,
  MenuItem,
  Select,
  GridItem,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useToast
} from '@chakra-ui/react';
import { Children, lazy } from 'react';
import { LazyMotion, domAnimation, motion, m, domMax } from 'framer-motion';
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react';
import SelectField from 'components/fields/SelectField';
import InitialImg from 'assets/img/games/load.jpg';
import { Canvas, useLoader, useFrame } from 'react-three-fiber';
import Sample from 'assets/img/games/Character_sample.glb';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import feedi from 'assets/img/screens/feed.png';
import { AiFillMessage } from 'react-icons/ai';
import { getTestAudios, updatePreviewlogs } from 'utils/game/gameService';
import { MdClose } from 'react-icons/md';
import {
  getVoiceMessage,
  getPreview,
  getGameLanguages,
  getContentRelatedLanguage,
  SubmitReview
} from 'utils/game/gameService';
import { EnumType } from 'typescript';
import { ScoreContext } from './GamePreview';
import Profile from 'assets/img/games/profile.png';
import { FaDesktop, FaMobileAlt } from 'react-icons/fa';
import { IoMdTabletLandscape } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import {ProfileType} from "./GamePreview";
import LoadImg from "assets/img/games/load.jpg";

import { useDispatch } from 'react-redux';
import { RootState } from 'store/reducers';
import { 
  resetGameModifiedState
} from 'store/preview/previewSlice';


import ReplayScore from './playcards/ReplayScore';
import Story from './playcards/Story';
import Welcome from './playcards/Welcome';
import ThankYou from './playcards/Thankyou';
import Overview from './playcards/Overview';
import Reflection from './playcards/Reflection';
import Takeway from './playcards/Takeaway';
import Completion from './playcards/Completion';
import ReplayGame from './playcards/ReplayGame';
import PlayInfo from './playcards/playinfo';
import LeaderBoard from './playcards/Leaderboard';
import ProfileScreen from './playcards/ProfileScreen';
import Characterspage from './playcards/CharacterSelection';
import ChapterPage from './playcards/Chapters';
import FeedBackScreen from './playcards/FeedBackScreen';
import TopMenuBar from './playcards/TopMenuBar';
import GameIntroScreen from './playcards/GameIntroScreen';
import ModelPopup from './playcards/ModelPopup';
import PromptScreen from './playcards/PromptScreen';
import ReplayPoints from './playcards/ReplayPoints';
import Player from './playcards/Player';
import ModelPlayer from './playcards/Model';
import SelectedNPCs from './playcards/SelectedNPCs';

// const ReplayScore = React.lazy(() => import('./playcards/ReplayScore'));
// const Story = React.lazy(() => import('./playcards/Story'));
// const Welcome = React.lazy(() => import('./playcards/Welcome'));
// const Testing = React.lazy(() => import('./playcards/testing'));
// const ThankYou = React.lazy(() => import('./playcards/Thankyou'));
// const Overview = React.lazy(() => import('./playcards/Overview'));
// const Reflection = React.lazy(() => import('./playcards/Reflection'));
// const Takeway = React.lazy(() => import('./playcards/Takeaway'));
// const Completion = React.lazy(() => import('./playcards/Completion'));
// const ReplayGame = React.lazy(() => import('./playcards/ReplayGame'));
// const PlayInfo = React.lazy(() => import('./playcards/playinfo'));
// const LeaderBoard = React.lazy(() => import('./playcards/Leaderboard'));
// const ProfileScreen = React.lazy(() => import('./playcards/ProfileScreen'));
// const Characterspage = React.lazy(() => import('./playcards/CharacterSelection'));
// const ChapterPage = React.lazy(() => import('./playcards/Chapters'));
// const FeedBackScreen = React.lazy(() => import('./playcards/FeedBackScreen'));
// const TopMenuBar = React.lazy(() => import('./playcards/TopMenuBar'));
// const GameIntroScreen = React.lazy(() => import('./playcards/GameIntroScreen'));
// const ModelPopup = React.lazy(() => import('./playcards/ModelPopup'));
// const ReplayPoints = React.lazy(() => import('./playcards/ReplayPoints'));
const LanguageSelectionPrompt = React.lazy(
  () => import('./playcards/LanguageSelectionPrompt'),
);
// const PromptScreen = React.lazy(() => import('./playcards/PromptScreen'));
// const CharacterModal = React.lazy(() => import ('./playcards/CharacterModal'));
// const Player = React.lazy(() => import ('./playcards/Player'));
// const ModelPlayer = React.lazy(() => import ('./playcards/Model'));
// const SelectedNPCs= React.lazy(() => import ('./playcards/SelectedNPCs'));

var i=0;

interface Review {
  reviewerId: String | null;
  reviewGameId: String | null;
  review: String | null;
  tabId: Number | null;
  tabAttribute: String | null;
  tabAttributeValue: String | null;
}

interface ShowPreviewProps {
  gameInfo: any;
  isReviewDemo: boolean;
  currentScore: any;
  setCurrentScore: any;
  preloadedAssets: any;
  InitialScreenId: number;
  fetchGameData: ()=>void;
  fetchPreviewLogsData: ()=> void;
  previewLogsDataIni: any;
  preLogDatasIni: any;
  initialStateUpdate: boolean;
  setInitialStateUpdate: any;
  creatorDataSlice: any;
}


// Define the interface for the state
interface PrevLogData {
  previewLogId: string;
  playerId: string;
  playerType: string;
  previewGameId: string;
  nevigatedSeq: any[];
  screenIdSeq: any[];
  lastActiveBlockSeq: string;
  selectedOptions: any;
  previewProfile: any;
  lastModifiedBlockSeq: string;
  lastBlockModifiedDate: string;
  updatedAt: string;
  playerInputs: any;
  audioVolumeValue: any | null;
  previewScore: ProfileType;
}

type TabAttributeSet = {
  [key: string]: {
    tabAttribute: string | null;
    tabAttributeValue: string | null;
  };
};
//no need for story
const overOptions = [
  { value: 1, label: 'Background' },
  { value: 2, label: 'Characters' },
  { value: 3, label: 'Game Overview' },
  { value: 4, label: 'Story' },
  { value: 5, label: 'Design' },
];

const tabOptions = [
  { value: 1, label: 'Background' },
  { value: 2, label: 'Characters' },
  { value: 3, label: 'Game Overview' },
  { value: 4, label: 'Story' },
  { value: 5, label: 'Design' },
];

interface ProfileDataType {
  name?: string;
  gender?: string;
  language?: any;
  score?: any;
  allTimeScore?: any;
  content?: any;
  audioUrls?: any;
  textId?: any;
  fieldName?: any;
 [x: string]: any;
}
interface QuestState {
  [key: string]: string;
}

const skipScreenList = [0, 8, 11, 12, 13, 15];
export const ProfileContext = createContext<ProfileDataType>({
  name: '',
  gender: '',
  language: '',
  score: 350,
  allTimeScore: 950,
});
type QuestWiseMaxTotal = { [key: number]: number };
const EntirePreview: React.FC<ShowPreviewProps> = React.memo(({
  gameInfo,
  isReviewDemo,
  currentScore,
  setCurrentScore,
  preloadedAssets,
  InitialScreenId,
  fetchGameData,
  fetchPreviewLogsData,
  previewLogsDataIni,
  preLogDatasIni,
  initialStateUpdate,
  setInitialStateUpdate,
  creatorDataSlice
}) => {
  
  const user: any = JSON.parse(localStorage.getItem('user'));
  const { colorMode, toggleColorMode } = useColorMode();
  const maxTextLength = 80;
  const audioRef = React.useRef(null);
  const dispatch = useDispatch ();
  //state added by rajesh for profile screen
  const [isLanguage, setIsLanguage] = useState(null);
  // selected option color change
  const [selectedOption, setSelectedOption] = useState(null);
  // handle the item
  const [item, setItem] = useState(null);
  // handle the data to show
  const [data, setData] = useState(null);
  // handle the transition effect
  const [showNote, setShowNote] = useState(false),
    [first, setFirst] = useState(false);
  // type to render component ( conditional render)
  const [type, setType] = useState<string>('');
  // handle the choosed option's response message and feedback content and navigation
  const [resMsg, setResMsg] = useState<string>('');
  const [feed, setFeed] = useState<string>('');
  const [navi, setNavi] = useState<string>('');
  const [options, setOptions] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [optionNavigation, setOptionNavigation] = useState(null);
  const [getSelectedOptions, SetgetSelectedOptions] = useState<any>({});

  /** This state handles the Review Form Tab and Sub Tab options */
  const [reviewTabOptions, setReviewTabOptions] = useState([]);
  const [questState, setQuestState] = useState<QuestState>({});
  const [filteredTabOptions, setFilteredTabOptions] = useState([]);
  // Feed back after completion
  const [FeedbackcurrentPosition, setFeedbackCurrentPosition] = useState(0);
  const [interactionBlockArray, setInterActionBlockArray] = useState<any | []>(
    [],
  );
  const [FeedbackremainingSentences, setFeedbackRemainingSentences] = useState<
    any[]
  >([]);
  const [FeedbackNavigatenext, setFeedbackNavigateNext] = useState<any>(false);
  const [isScreenshot, setisScreenshot] = useState<any>(false);
  const [FeedBackoptionData, setFeedBackoptionData] = useState(null);
  const [FeedBackselectedoptionData, setFeedBackSelectedoptionData] =
    useState(null);
  const [isOptionalReplay, setisOptionalReplay] = useState<any>(false);
  const [isReplay, setisReplay] = useState<any>(false);
  const [profilescore, Setprofilescore] = useState(null);
  const [reviewSubTabOptions, setReviewSubTabOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [reviewInput, setReviewInput] = useState<Review>({
    reviewerId: gameInfo?.reviewer?.ReviewerId ?? null,
    reviewGameId: gameInfo?.gameId ?? null,
    review: '',
    tabId: null,
    tabAttribute: '',
    tabAttributeValue: '',
  });
  const [backgroundScreenUrl, setBackgroundScreenUrl] = useState(null);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [audio, setAudio] = useState<string>('');
  const [audioVolume, setAudioVolume] = useState<any>(0.5);
  const [nextBlockAudioUrl, setNextBlockAudioUrl] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowHeight, setWindowHeight] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [game3Position, setGame3Position] = useState({
    previousBlock: '',
    currentBlock: '',
    nextBlock: '',
  });
  const [currentStoryBlockSeq, setCurrentStoryBlockSeq] =
    useState<string>(null);
  const [demoBlocks, setDemoBlocks] = useState(null);
  const Tab5attribute = [6, 4, 3, 7, 1, 5];
  const userProfile = useContext(ProfileContext);
  const [currentQuestNo, setCurrentQuestNo] = useState(1);
  const [homeLeaderBoard, setHomeLeaderBoard] = useState(null);
  const { profile, setProfile } = useContext(ScoreContext);
  const tabAttributeSets: TabAttributeSet[] = [
    { '1': { tabAttribute: null, tabAttributeValue: null } },
    { '2': { tabAttribute: null, tabAttributeValue: null } },
    { '3': { tabAttribute: 'fieldName', tabAttributeValue: '' } },
    { '4': { tabAttribute: 'blockSeqId', tabAttributeValue: '' } },
    { '5': { tabAttribute: 'screenId', tabAttributeValue: '' } },
  ];
  const [isPrevNavigation, setIsPrevNavigation] = useState(false);
  const [replayIsOpen, setReplayIsOpen] = useState(false);
  const gameScore = useContext(ScoreContext);
  const scoreComp = profile?.score!==undefined ? profile?.score?.length > 0 ? profile?.score[0]?.score : 0 : 0;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questWiseMaxTotal, setQuestWiseMaxTotal] =
    useState<QuestWiseMaxTotal>();
  const [ModelControl, setModelControl] = useState<boolean>(false); // for model show
  const [LastModified, setLastModified] = useState<boolean>(false); // for last modified
  const [isStoryScreen, isSetStoryScreen] = useState<boolean>(false);
  const [OptionSelectId, setOptionSelectId] = useState(null);
  const [Total, setTotal] = useState<number>(0);
  const [playerTodayScore, setPlayerTodayScore] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    language: '',
    score: '',
    allTimeScore: 250,
    content: '',
    audioUrls: '',
    textId: '',
    fieldName: '',
    Audiogetlanguage: [],
  });
  const [replayState, setReplayState] = useState<string>(null);
  const [optionalReplay, setOptionalReplay] = useState<string>(null);
  const [isNoteClosed, setIsNoteClosed] = useState(false);
  
  const [previewLogsData, setPreviewLogsData] = useState<any>(previewLogsDataIni); /** Used to load the table data for the first time only */
  /*
  const [getPrevLogDatas, setPreLogDatas] = useState<PrevLogData>({
    previewLogId: '',
    playerId: '',
    playerType: '',
    previewGameId: '',
    nevigatedSeq: [],
    screenIdSeq: [],
    lastActiveBlockSeq: '',
    selectedOptions: '',
    previewProfile: {},
    lastModifiedBlockSeq: '',
    lastBlockModifiedDate:'',
    updatedAt:'',
    playerInputs:'',
    audioVolumeValue: {},
  }); /** Handles the updated Data on run time, initial */
  const [getPrevLogDatas, setPreLogDatas] = useState<PrevLogData>({...preLogDatasIni}); /** Handles the updated Data on run time, initial */
  const [voiceIds, setVoiceIds] = useState<any>();
  const [feedbackList, setFeedbackList] = useState([]);
  const [interactionCount, setinteractionCount] = useState(null);
  const [isGetsPlayAudioConfirmation, setIsGetsPlayAudioConfirmation] =
    useState<boolean>(false);
  const [reflectionAnswers, setReflectionAnswers] = useState([]);
  const [resolution, setResolution] = useState(null);
  const [navTrack, setNavTrack] = useState([]);
  const [currentTrackPointer, setCurrentTrackPointer] = useState(0);
  const [currentScreenId, setCurrentScreenId] =
    useState<number>(InitialScreenId);
    
  const [hasMulitLanguages, setHasMulitLanguages] = useState<boolean>(false); // This state to control the auto Initialization of the Language selection Modal popup
  const [isOpenCustomModal, setIsOpenCustomModal] = useState<boolean>(false); //This state to control the opening of Language selection Modal popup by click event
  const [gameLanguages, setGameLanguages] = useState([]);
  const [NavigateBlockEmpty, setNavigateBlockEmpty] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [RepeatSelectOption, setRepeatSelectOption] = useState<boolean>(false);
  const [RepeatPrevOption, setRepeatPrevOption] = useState<any>([]);
  const [modelScreen, setModelScreen] = useState<Boolean>(false);
  const [isInitialLoadScreenWelcome, setIsInitialLoadScreenWelcome] = useState<boolean>(false);

  /******************************This for controll backgroud bgm and voice 09.05.2024**********************************/
  const EnumType = {
    BGM: 'bgm',
    VOICE: 'voice',
  };
  const backgroundBgmRef = useRef<HTMLAudioElement>(null);
  const voiceRef = useRef<HTMLAudioElement>(null);
  const [audioObj, setAudioObj] = useState<{
    url: string;
    type: string;
    volume: string;
    loop: boolean;
    autoplay: boolean;
  }>({
    url: '',
    type: EnumType.BGM,
    volume: '0.5',
    loop: true, // Background loops
    autoplay: true,
  });
  const [AudioOptions, SetAudioOptions] = useState({ qpOptionId: '' });
  const [score, setScore] = useState(null);
  const [upComingBlockChoosen, setUpComingBlockChoosen] = useState<any>(null);
  const [motionEffect, setMotionEffect] = useState<any>(false);
  const [isLoading, setIsLoading] = useState<any>(false);
  const { uuid } = useParams();
  
  const toast = useToast();

  useEffect(() => {
    setCurrentScreenId(InitialScreenId);
  }, [InitialScreenId]);

useEffect(()=>{
  //Initial loading data, it has inital vlaues of preview_logs of the player for this game
  if(preLogDatasIni)
    {
      setPreLogDatas(preLogDatasIni);
      console.log("$$$$$$preLogDatasIni?.previewScore", preLogDatasIni?.previewScore)
      setProfile(preLogDatasIni?.previewScore);
      setSelectedPlayer(preLogDatasIni?.previewProfile?.selectedPlayer ?? null);
      const {name, gender, language}= preLogDatasIni?.previewProfile ?? {name:'', gender:'',language:''};
      if(!name || !gender || !language)
        {
          setIsInitialLoadScreenWelcome(true);
        } 
    }
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause the audio when the page is hidden
        if (!audioRef.current?.paused) {
          audioRef.current?.pause();
        }
      } else {
        // Resume the audio when the page becomes visible again
        if (audioRef.current?.paused) {
          audioRef.current?.play();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
},[preLogDatasIni])
  
  const handleSubmitReview = async (inputdata: any) => {
    /** Sample post data
   * {"data" :{
    "reviewerId": 4,
    "reviewGameId": 3,
    "review": "Character Tab",
    "tabId": 2,
    "tabAttribute": null,
    "tabAttributeValue": ""
   }
} 
   */
    if (!inputdata.reviewerId || !inputdata.reviewGameId) {
      toast({
        title: 'You are Unauthorized..!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    } 
    else if (!inputdata.tabId) {
      toast({
        title: 'Select Feedback Options',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    } else if (!inputdata.review) {
      toast({
        title: 'Review Field is Empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    }

    const addReviewResponse = await SubmitReview(
      JSON.stringify({ data: inputdata, id: uuid }),
    );
    if (addReviewResponse?.status === 'Failure') {
      toast({
        title: 'Failed to Add Review',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return false;
    }
    if (addReviewResponse?.status === 'Success') {
      toast({
        title: 'Review added Successfully..!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      fetchGameData();
      return true;
    }
  };
  

  useEffect(() => {
    setProfileData((prev: any) => ({ ...prev, score: scoreComp }));
  }, [scoreComp]);

  useEffect(() => {
    if(profile.score.length > 0)
      {
         const currentDate = new Date();
    // Get day, month, and year
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();

    // Format date as DD-MM-YYYY
    const formattedDate = `${day}-${month}-${year}`;

    const scores = profile?.score;
    const sums: any = {};
    scores?.forEach((score: any) => {
      const quest = score.quest;
      if (!sums[quest]) {
        sums[quest] = 0;
      }
      if(score.scoreEarnedDate === formattedDate)
        {
          sums[quest] += score.score;
        }
      
    });
 
    let getFinalscores ={};
    Object.entries(sums).forEach(([quest, score]) => 
     {
       const IntQuest = parseInt(quest);
       const newQuest = {...getFinalscores, [IntQuest]: score};
       getFinalscores={...newQuest};
   });
    
    const Replayscores = profile?.replayScore.length > 0 ? profile?.replayScore :null;
    const Replaysums: {[key: number]: number} = {};
    Replayscores?.forEach((score: any) => {
      const quest = score.quest;
      if (!Replaysums[quest]) {
        Replaysums[quest] = 0;
      }
      if(score.scoreEarnedDate === formattedDate)
        {

          Replaysums[quest] += score.score;
        }
    });

    let getReplayFinalscores : {[key: number]:  number} ={};
     Object.entries(Replaysums).forEach(([quest, score]) => 
      {
        const IntQuest = parseInt(quest);
        getReplayFinalscores = { ...getReplayFinalscores, [IntQuest]: score};
    });
    const TodayTotalScore = Object.entries(getFinalscores).reduce((tot:number, acc: any)=>{
      let newTotal = tot;
      let questNo = acc[0];
      let questHasReplay=Object.keys(getReplayFinalscores).some((quest)=> quest === questNo );
      if(questHasReplay)
        {

          getReplayFinalscores[questNo] > acc[1] ? (tot+=getReplayFinalscores[questNo]) : (tot+=acc[1]) 
        }
        else{
          tot+=acc[1];
        }
        return tot;
        },0);


    //  scoreEarnedDate: profile?.score.map((item: any) => item.scoreEarnedDate)
    const toDayScore =  profile?.score.reduce((total: any, acc: any) => {
      if (acc.scoreEarnedDate === formattedDate) {
        return total + acc.score;
      } else {
        return total;
      }
    }, 0);
    const totalEarnScore = profile?.score.reduce(
      (acc: any, obj: any) => acc + parseInt(obj.score),
      0,
    );
    setPreLogDatas((prev: any) => ({
      ...prev,
      previewProfile: { ...prev.previewProfile, score: profile.score },
    }));
    setPlayerTodayScore(TodayTotalScore);
  }
  
}, [profile?.score]);


useEffect(()=>{
  if(profile)
    {
      setPreLogDatas((prev:any)=> ({...prev, previewScore:profile}));
    }
},[profile])
  // This for  Translation content based on lang 09.05.2024
  useEffect(() => {
    const fetchGameContent = async () => {
      const languageId = getPrevLogDatas?.previewProfile?.language
        ? getPrevLogDatas?.previewProfile?.language
        : profileData.language;
      if (getPrevLogDatas?.previewProfile?.language) {
        setProfileData((prev: any) => ({
          ...prev,
          language: getPrevLogDatas?.previewProfile?.language,
        }));
      }
      const gameContentResult = await getContentRelatedLanguage(
        gameInfo?.gameData.gameId,
        languageId,
      );
      if (gameContentResult.status === 'Success') {
        const data = gameContentResult.data;
        setProfileData((prev: any) => ({
          ...prev,
          Audiogetlanguage: data.map((x: any) => ({
            content: x.content,
            audioUrls: x.audioUrls,
            textId: x.textId,
            fieldName: x.fieldName,
          })),
        }));
      }
    };
    if (profileData.language !== '') {
      fetchGameContent();
    }
  }, [profileData?.language]);

  const fetchDefaultBgMusic = async () => {
    const res = await getTestAudios(); //default bg audio fetch
    if (res?.status === 'success' && res?.url) {
      setAudioObj({
        url: res?.url,
        type: EnumType.BGM,
        volume: '0.5',
        loop: true, // Voice doesn't loop
        autoplay: true,
      });
    }
  };

  const fetchDefaultAudioBgMusic = async () => {
    const res = await getTestAudios(); //default bg audio fetch
    if (res?.status === 'success' && res?.url) {
      setAudio(res?.url)
    }
  };
  useEffect(() => {
    setDemoBlocks(gameInfo?.blocks);
    
    if (data === null && profile.currentQuest) {
      setType(gameInfo?.blocks[profile?.currentQuest]['1']?.blockChoosen);
      setData(gameInfo?.blocks[profile?.currentQuest]['1']);
      if (
        gameInfo?.blocks[profile?.currentQuest]['1']?.blockChoosen ===
        'Interaction'
      ) {
        setRepeatPrevOption([]);
        const optionsFiltered = [];
        const primarySequence =
          gameInfo.blocks[profile.currentQuest]['1'].blockPrimarySequence;

        for (const option of gameInfo.questOptions) {
          if (profileData?.Audiogetlanguage.length > 0) {
            if (option?.qpSequence === primarySequence) {
              const profilesetlan = profileData?.Audiogetlanguage.find(
                (key: any) => key?.textId === option.qpOptionId,
              );

              if (profilesetlan) {
                const languagecont = {
                  ...option,
                  qpOptionText: profilesetlan.content,
                };
                optionsFiltered.push(languagecont);
              } else {
                optionsFiltered.push(option);
              }
            }
          } else {
            if (option?.qpSequence === primarySequence) {
              optionsFiltered.push(option);
            }
          }
        }
        if (gameInfo?.gameData?.gameShuffle === 'true') {
          for (let i = optionsFiltered.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsFiltered[i], optionsFiltered[j]] = [
              optionsFiltered[j],
              optionsFiltered[i],
            ]; // Swap elements at indices i and j
          }
        }
        setOptions(optionsFiltered);
      }
    }
  }, [profile?.currentQuest]);

  useEffect(() => {
    const calculatePlayerGrandTotal = async () => {
      const scores =
        questState[profile?.currentQuest] == 'Started'
          ? profile?.score
          : profile?.replayScore?.length > 0
          ? profile?.replayScore
          : profile?.score;
      let total: number = 0;
      const questScores: any = {};
      if (currentScreenId === 13) {
        //For chapter Selection Screen
        if(profile?.score.length > 0)
          {
             if (scores?.length > 0) {
          // Calculate scores for each quest
          scores.forEach((score: any) => {
            if (questScores[score.quest]) {
              questScores[score.quest] += score.score;
            } else {
              questScores[score.quest] = score.score;
            }
          });
               
          setProfile((prev: any) => ({
            ...prev,
            playerGrandTotal: {
              ...prev?.playerGrandTotal,
              questScores,
            },
          }));
        }
          }
       
      } else if ([2, 4, 6, 8, 9, 14].includes(currentScreenId)) {
        //for story, completion screen, feedback, replay etc.,
        const scoreArray =
          questState[parseInt(profile?.currentQuest)] == 'Started'
            ? profile?.score
            : profile?.replayScore;
        if (scoreArray?.length > 0) {
          scores.forEach((score: any) => {
            if (questScores[score.quest]) {
              questScores[score.quest] += score.score;
            } else {
              questScores[score.quest] = score.score;
            }
          });
          setProfile((prev: any) => ({
            ...prev,
            playerGrandTotal: {
              ...prev?.playerGrandTotal,
              questScores,
            },
          }));
        }
      }
      return;
    };

    //Get the Navigated Sequeance to calculate the max score for a Quest
    const calculateQuestGrandTotal = async () => {
      let GrandMaximumscore: any = null;

      const questStatus = questState[profile?.currentQuest];
      /** options - Players selected options like [{quest:'1', score:200, 'seq':'1.1' },...] */
      // Check if options are provided
      if (options) {
        let currentScores;
        const questStatus = questState[profile?.currentQuest];
        if (questStatus === 'completed') {
          // If the quest is completed, compare the scores
          if (profile?.score !== null && profile?.replayScore !== null) {
            currentScores =
              profile.score > profile.replayScore
                ? profile.score
                : profile.replayScore;
          } else {
            console.log(
              ' *****Invalid score or replayScore provided for completed quest.',
            );
            return; // Exit function if either score or replayScore is not provided for completed quest
          }
        } else if (questStatus === 'Started') {
          // If the quest is started, consider the score
          if (questStatus === 'Started') {
            currentScores = profile?.score !== null || profile.score!==undefined ? profile.score : null; //null or currentScores or replayScore
          } else {
            console.log(' *****Invalid score provided for started quest.');
            return; // Exit function if score is not provided for started quest
          }
        } 
        // Check if currentScores is an array before mapping
        const currentQuestseqId = Array.isArray(currentScores)
          ? currentScores.map((item) => item.seqId)
          : [];

        // Check if currentScores is an array and has items  const qpScoreEntries = filteredOptions.map(option => ({ qpScore: option.qpScore }));
        if (Array.isArray(currentScores) && currentScores.length > 0) {
          // Map currentScores to extract scores
          const scores = currentScores.map((item) => item.score);

          const result = currentQuestseqId.map((seqId) => {
            const QuestNo = seqId.split('.')[0];
            if (QuestNo == profile.currentQuest) {
              const filteredOptions = gameInfo?.questOptions?.filter(
                (option: any) => option.qpSequence == seqId,
              );

              const qpScoresOption = filteredOptions.map((option: any) =>
                parseInt(option.qpScore),
              );
              qpScoresOption.sort((a: any, b: any) => b - a);
              GrandMaximumscore += qpScoresOption[0];
            }
          });
        } else {
          console.log('*****Options are not provided.');
        }
        setQuestWiseMaxTotal((prev: any) => {
          return { ...prev, [profile?.currentQuest]: GrandMaximumscore };
        });
        return GrandMaximumscore;
      }
    };
    calculateQuestGrandTotal();
    calculatePlayerGrandTotal();
  }, [profile?.score, profile?.replayScore, currentScreenId]);

  useEffect(() => {
    if (!gameInfo?.bgMusic) {
      fetchDefaultBgMusic();
    } else if (gameInfo?.bgMusic) {
  
      const screens = [1, 3, 4, 5, 6, 7, 11, 12, 13];
      if (
        screens.includes(currentScreenId) &&
        ![2, 10, 0].includes(currentScreenId)
      ) {
        setAudioObj((prev)=>({
          ...prev,
          url: gameInfo?.bgMusic,
          type: EnumType.BGM,
          loop: true, // Voice doesn't loop
          autoplay: true,
        }));
      }
    }
  }, [gameInfo]);

  useEffect(() => {
    if(audio!=='')
      {
        if (![2, 10, 0].includes(currentScreenId)) {
          setAudioObj((prev)=>({
            ...prev,
            url: audio,
            type: EnumType.BGM,
            loop: true, // Voice doesn't loop
            autoplay: true,
          }));
        }
      }
  }, [audio]);


  /******************Need to handle the audio play and pause */
  useEffect(() => {
    if (voiceRef.current) {
      voiceRef.current.pause();
    }

    const handleAudio = (
      audioRef: React.RefObject<HTMLAudioElement>,
      audio: any,
    ) => {
      if (audioRef.current) {

        // audioRef.current.src = audio.url;
        if (audioRef.current?.src !== audio.url) {
          audioRef.current.src = audio.url;
        }
        audioRef.current.volume = parseFloat(audio.volume);
        audioRef.current.loop = audio.loop;
        audioRef.current.autoplay = audio.autoplay;

        // Play or pause audio based on the autoplay property
        if (audioObj.autoplay) {
          if (audioObj.type === EnumType.BGM && backgroundBgmRef.current) {
            try {
              backgroundBgmRef.current?.play().catch((error) => {
                // Handle play promise rejection
              });
            } catch (error) {
              console.error('Background BGM ref is not available.', error);
            }
          } else if (audioObj.type === EnumType.VOICE && voiceRef.current) {
              try {
                voiceRef?.current?.play().catch((error) => {
                  // Handle play promise rejection
                  console.error('Error playing voice:', error);
                });
              } catch (error) {
                console.error('Error playing voice:', error);
              }
          }
        } else {
          if (audioObj.type === EnumType.BGM && backgroundBgmRef.current) {
            if(!backgroundBgmRef?.current?.paused)
              {
                backgroundBgmRef?.current?.pause();
              }
          } else if (audioObj.type === EnumType.VOICE && voiceRef.current) {
            if(!voiceRef?.current?.paused)
              {
                voiceRef?.current?.pause();
              }
          }
        }
      }
    };

    if (audioObj.type === EnumType.BGM) {
      handleAudio(backgroundBgmRef, audioObj);
    } else if (audioObj.type === EnumType.VOICE) {
      handleAudio(voiceRef, audioObj);
    }
  }, [audioObj]);

  // Event handler for when the audio playback ends
  const handleAudioEnded = () => {
    // Set the current audio reference to null
    audioRef.current = null;
  };

  useEffect(() => {
    if (gameInfo) {
      setVoiceIds({
        narrator:
          gameInfo?.gameData?.gameNarratorVoice ?? 'D38z5RcWu1voky8WS1ja',
        playerMale:
          gameInfo?.gameData?.gamePlayerMaleVoice ?? '2EiwWnXFnvU5JabPnv8n',
        playerFemale:
          gameInfo?.gameData?.gamePlayerFemaleVoice ?? '21m00Tcm4TlvDq8ikWAM',
        NPC: gameInfo?.gameData?.gameNonPlayerVoice ?? '5Q0t7uMcjvnagumLfvZi',
        Intro: '', //Get the intro music for the game.gameBadge(Primary Key)
      });
    }
  }, [gameInfo?.gameData]);

  useEffect(() => {
    if(![2, 10, 0].includes(currentScreenId))
      {
        if(!gameInfo?.bgMusic)
          {
            fetchDefaultAudioBgMusic();
          }
          else{
            setAudio(gameInfo?.bgMusic)
          }

      }
  }, [currentScreenId, gameInfo]);

  const prevData = (current: any) => {
    const quest = current ? current?.blockPrimarySequence.split('.')[0] : null;
    const currentBlock = current
      ? parseInt(current?.blockPrimarySequence.split('.')[1])
      : null;

    navTrack.pop(); //clears last index sequence
    if (navTrack.length > 0) {
      const newTrackSequence = navTrack[navTrack.length - 1];
      const prevBlock = current
        ? Object.keys(demoBlocks[quest] || {})
            .filter(
              (key) =>
                demoBlocks[quest]?.[key]?.blockPrimarySequence ==
                newTrackSequence,
            )
            .map((key: any) => demoBlocks[quest]?.[key])
        : [];

      const currentQuest = current
        ? parseInt(current?.blockPrimarySequence.split('.')[0])
        : null;
      setCurrentQuestNo(currentQuest);
      if (
        prevBlock.length !== 0 &&
        prevBlock[0]?.blockChoosen !== 'Interaction'
      ) {
        /*** Handle the previous track */
        const removedElement = navTrack.pop();
        setNavTrack(navTrack);
        /*** End of Handle the previous track */

        setType(prevBlock[0]?.blockChoosen);
        setData(prevBlock[0]);

        setIsPrevNavigation(true);
        return false;
      }
    } else {
      return false;
    }
  };
  // This Function For LastModified Previous

  const LastModiPrevData = (current: any) => {
    const quest = current ? current?.blockPrimarySequence.split('.')[0] : null;
    const lastSeq = getPrevLogDatas.nevigatedSeq[current.blockQuestNo];
    const secondLastSeq = lastSeq[lastSeq.length - 2];
    const currentBlock = current
      ? parseInt(current?.blockPrimarySequence.split('.')[1])
      : null;
    const previousItem = currentBlock != null ? currentBlock - 1 : null;
    const prevSeq = current
      ? `${current?.blockPrimarySequence.split('.')[0]}.${previousItem}`
      : '';
    const currentQuest = current
      ? parseInt(current?.blockPrimarySequence.split('.')[0])
      : null;
    setCurrentQuestNo(currentQuest);
    if (type !== 'Interaction') {
      if (type === 'response' && resMsg !== '') {
        setType(current?.blockChoosen);
        setData(current);
        if (current?.blockChoosen === 'Interaction') {
          const optionsFiltered = [];
          for (const option of gameInfo.questOptions) {
            if (profileData?.Audiogetlanguage.length > 0) {
              if (option?.qpSequence === current?.blockPrimarySequence) {
                const profilesetlan = profileData?.Audiogetlanguage.find(
                  (key: any) => key?.textId === option.qpOptionId,
                );

                if (profilesetlan) {
                  const languagecont = {
                    ...option,
                    qpOptionText: profilesetlan.content,
                  };
                  optionsFiltered.push(languagecont);
                } else {
                  optionsFiltered.push(option);
                }
              }
            } else {
              if (option?.qpSequence === current?.blockPrimarySequence) {
                optionsFiltered.push(option);
              }
            }
          }
          if (gameInfo?.gameData?.gameShuffle === 'true') {
            for (let i = optionsFiltered.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [optionsFiltered[i], optionsFiltered[j]] = [
                optionsFiltered[j],
                optionsFiltered[i],
              ];
            }
          }
          setOptions(optionsFiltered);
          return false;
        }
      }
      if (type === 'feedback' && feed !== '' && resMsg !== '') {
        setType('response');
        setData(current);
        const optionAudioFiltered = profileData?.Audiogetlanguage.filter(
          (key: any) => key?.textId === OptionSelectId,
        );
        if (optionAudioFiltered.length > 0) {
          const responseAudioFiltered = optionAudioFiltered.filter(
            (key: any) => key?.fieldName === 'qpResponse',
          );
          const FilteredResponsecontent = responseAudioFiltered[0].content;
        setResMsg(FilteredResponsecontent);
        }
        else{
          setResMsg(resMsg);
        }
        return false;
      }
      if (type === 'feedback' && feed !== '' && resMsg === '') {
        setType(current?.blockChoosen);
        setData(current);
        if (current?.blockChoosen === 'Interaction') {
          const optionsFiltered = [];
          for (const option of gameInfo.questOptions) {
            if (profileData?.Audiogetlanguage.length > 0) {
              if (option?.qpSequence === current?.blockPrimarySequence) {
                const profilesetlan = profileData?.Audiogetlanguage.find(
                  (key: any) => key?.textId === option.qpOptionId,
                );

                if (profilesetlan) {
                  const languagecont = {
                    ...option,
                    qpOptionText: profilesetlan.content,
                  };
                  optionsFiltered.push(languagecont);
                } else {
                  optionsFiltered.push(option);
                }
              }
            } else {
              if (option?.qpSequence === current?.blockPrimarySequence) {
                optionsFiltered.push(option);
              }
            }
          }
          if (gameInfo?.gameData?.gameShuffle === 'true') {
            for (let i = optionsFiltered.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [optionsFiltered[i], optionsFiltered[j]] = [
                optionsFiltered[j],
                optionsFiltered[i],
              ];
            }
          }

          
          setOptions(optionsFiltered);
          return false;
        }
      }
    }
    const newTrackSequence = navTrack[navTrack.length - 1];
    const navPrevBlock = current
      ? Object.keys(demoBlocks[quest] || {})
        .filter(
          (key) =>
            demoBlocks[quest]?.[key]?.blockPrimarySequence ==
            newTrackSequence,
        )
        .map((key: any) => demoBlocks[quest]?.[key])
      : [];
    if (navPrevBlock.length > 0) {
      if (navPrevBlock[0].blockSecondaryId === current.blockSecondaryId) {
        navTrack.pop();
        const lastPrevNavTrack = navTrack[navTrack.length - 1];
        const prevousBlock = current
          ? Object.keys(demoBlocks[quest] || {})
            .filter(
              (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === lastPrevNavTrack,
            )
            .map((key: any) => demoBlocks[quest]?.[key])
          : [];
        if (prevousBlock.length !== 0) {
          setType(prevousBlock[0]?.blockChoosen);
          setData(prevousBlock[0]);
          if (prevousBlock[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }

            setOptions(optionsFiltered);
          }

          let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[prevousBlock[0].blockQuestNo]];
          const lastElementSeq = updateNavigateSeq.pop();
          if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
            updateNavigateSeq.push(prevousBlock[0].blockPrimarySequence);
          }
          setPreLogDatas((prev: any) => ({
            ...prev,
            lastBlockModifiedDate: null,
            lastModifiedBlockSeq: null,
            lastActiveBlockSeq: {[prevousBlock[0].blockQuestNo]:[prevousBlock[0].blockId]},
            nevigatedSeq: { ...prev.nevigatedSeq, [prevousBlock[0].blockQuestNo]: updateNavigateSeq }
          }));
          return false;
        }
      }
      else {
        let getSeqprevious: any = [];
        const getdemoblocksseq: any = Object.entries(demoBlocks[quest]);
        for (const blocks of getdemoblocksseq) {
          const blockId = blocks[1].blockId;
          if (blocks[1].blockLeadTo === current.blockSecondaryId) {
            getSeqprevious.push(blocks[1].blockPrimarySequence);
          }

          for (const optionsnavi of gameInfo.questOptions) {
            if (optionsnavi.qpQuestionId === blockId) {
              if (optionsnavi.qpNextOption === current.blockSecondaryId) {
                getSeqprevious.push(blocks[1].blockPrimarySequence);
              }
            }

          }

        }

        if (getSeqprevious.length > 0) {
          getSeqprevious.push(current.blockPrimarySequence);
        }
        getSeqprevious.sort((a: any, b: any) => a - b);
        const currentIndex = getSeqprevious.indexOf(current.blockPrimarySequence);
        if (current.blockPrimarySequence !== gameInfo?.blocks[profile?.currentQuest]['1']?.blockPrimarySequence) {
          if (currentIndex !== -1) {
            if (currentIndex > 0) {
              // Retrieve the previous sequence value
              const previousSeq = getSeqprevious[currentIndex - 1];
              const prevousBlock = current
                ? Object.keys(demoBlocks[quest] || {})
                  .filter(
                    (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === previousSeq,
                  )
                  .map((key: any) => demoBlocks[quest]?.[key])
                : [];
              if (prevousBlock.length !== 0) {
                setType(prevousBlock[0]?.blockChoosen);
                setData(prevousBlock[0]);
                if (prevousBlock[0]?.blockChoosen === 'Interaction') {
                  const optionsFiltered = [];
                  for (const option of gameInfo.questOptions) {
                    if (profileData?.Audiogetlanguage.length > 0) {
                      if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                        const profilesetlan = profileData?.Audiogetlanguage.find(
                          (key: any) => key?.textId === option.qpOptionId,
                        );
      
                        if (profilesetlan) {
                          const languagecont = {
                            ...option,
                            qpOptionText: profilesetlan.content,
                          };
                          optionsFiltered.push(languagecont);
                        } else {
                          optionsFiltered.push(option);
                        }
                      }
                    } else {
                      if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                        optionsFiltered.push(option);
                      }
                    }
                  }
                  if (gameInfo?.gameData?.gameShuffle === 'true') {
                    for (let i = optionsFiltered.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [optionsFiltered[i], optionsFiltered[j]] = [
                        optionsFiltered[j],
                        optionsFiltered[i],
                      ];
                    }
                  }

                  setOptions(optionsFiltered);
                }

                let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[prevousBlock[0].blockQuestNo]];
                const lastElementSeq = updateNavigateSeq.pop();
                if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                  updateNavigateSeq.push(prevousBlock[0].blockPrimarySequence);
                }
                setPreLogDatas((prev: any) => ({
                  ...prev,
                  lastBlockModifiedDate: null,
                  lastModifiedBlockSeq: null,
                  lastActiveBlockSeq:{[prevousBlock[0].blockQuestNo]: [prevousBlock[0].blockId]},
                  nevigatedSeq: { ...prev.nevigatedSeq, [prevousBlock[0].blockQuestNo]: updateNavigateSeq }
                }));
                return false;
              }
              else {
                let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[current.blockQuestNo]];
                const lastElementSeq = updateNavigateSeq.pop();
                if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                  updateNavigateSeq.push(current.blockPrimarySequence);
                }
                setPreLogDatas((prev: any) => ({
                  ...prev,
                  lastBlockModifiedDate: null,
                  lastModifiedBlockSeq: null,
                  lastActiveBlockSeq:{[current.blockQuestNo] :[current.blockId]},
                  nevigatedSeq: { ...prev.nevigatedSeq, [current.blockQuestNo]: updateNavigateSeq }
                }));
                return false;
              }
            } else {
              // If no previous found, retrieve the next sequence
              const nextSeq = getSeqprevious[currentIndex + 1];
              const prevousBlock = current
                ? Object.keys(demoBlocks[quest] || {})
                  .filter(
                    (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === nextSeq,
                  )
                  .map((key: any) => demoBlocks[quest]?.[key])
                : [];
              if (prevousBlock.length !== 0) {
                setType(prevousBlock[0]?.blockChoosen);
                setData(prevousBlock[0]);
                if (prevousBlock[0]?.blockChoosen === 'Interaction') {
                  const optionsFiltered = [];
                  for (const option of gameInfo.questOptions) {
                    if (profileData?.Audiogetlanguage.length > 0) {
                      if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                        const profilesetlan = profileData?.Audiogetlanguage.find(
                          (key: any) => key?.textId === option.qpOptionId,
                        );
      
                        if (profilesetlan) {
                          const languagecont = {
                            ...option,
                            qpOptionText: profilesetlan.content,
                          };
                          optionsFiltered.push(languagecont);
                        } else {
                          optionsFiltered.push(option);
                        }
                      }
                    } else {
                      if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                        optionsFiltered.push(option);
                      }
                    }
                  }
                  if (gameInfo?.gameData?.gameShuffle === 'true') {
                    for (let i = optionsFiltered.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [optionsFiltered[i], optionsFiltered[j]] = [
                        optionsFiltered[j],
                        optionsFiltered[i],
                      ];
                    }
                  }

                  for (const option of gameInfo.questOptions) {
                    if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                      optionsFiltered.push(option);
                    }
                  }
                  if (gameInfo?.gameData?.gameShuffle === 'true') {
                    for (let i = optionsFiltered.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [optionsFiltered[i], optionsFiltered[j]] = [
                        optionsFiltered[j],
                        optionsFiltered[i],
                      ];
                    }
                  }
                  setOptions(optionsFiltered);
                }

                let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[prevousBlock[0].blockQuestNo]];
                const lastElementSeq = updateNavigateSeq.pop();
                if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                  updateNavigateSeq.push(prevousBlock[0].blockPrimarySequence);
                }

                setPreLogDatas((prev: any) => ({
                  ...prev,
                  lastBlockModifiedDate: null,
                  lastModifiedBlockSeq: null,
                  lastActiveBlockSeq: {[prevousBlock[0].blockQuestNo]:[prevousBlock[0].blockId]},
                  nevigatedSeq: { ...prev.nevigatedSeq, [prevousBlock[0].blockQuestNo]: updateNavigateSeq }
                }));
                return false;
              }
              else {
                let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[current.blockQuestNo]];
                const lastElementSeq = updateNavigateSeq.pop();
                if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                  updateNavigateSeq.push(current.blockPrimarySequence);
                }
                setPreLogDatas((prev: any) => ({
                  ...prev,
                  lastBlockModifiedDate: null,
                  lastModifiedBlockSeq: null,
                  lastActiveBlockSeq:{[current.blockQuestNo]:[current.blockId]},
                  nevigatedSeq: { ...prev.nevigatedSeq, [current.blockQuestNo]: updateNavigateSeq }
                }));
                return false;
              }
            }
          } else {
            const prevousBlock = current
              ? Object.keys(demoBlocks[quest] || {})
                .filter(
                  (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === prevSeq,
                )
                .map((key: any) => demoBlocks[quest]?.[key])
              : [];
            if (prevousBlock.length !== 0) {
              setType(prevousBlock[0]?.blockChoosen);
              setData(prevousBlock[0]);
              if (prevousBlock[0]?.blockChoosen === 'Interaction') {
                const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
                setOptions(optionsFiltered);
              }

              let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[prevousBlock[0].blockQuestNo]];
              const lastElementSeq = updateNavigateSeq.pop();
              if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                updateNavigateSeq.push(prevousBlock[0].blockPrimarySequence);
              }

              setPreLogDatas((prev: any) => ({
                ...prev,
                lastBlockModifiedDate: null,
                lastModifiedBlockSeq: null,
                lastActiveBlockSeq: {[prevousBlock[0].blockQuestNo]:[prevousBlock[0].blockId]},
                nevigatedSeq: { ...prev.nevigatedSeq, [prevousBlock[0].blockQuestNo]: updateNavigateSeq }
              }));
              return false;
            }
            else {
              let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[current.blockQuestNo]];
              const lastElementSeq = updateNavigateSeq.pop();
              if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                updateNavigateSeq.push(current.blockPrimarySequence);
              }
              setPreLogDatas((prev: any) => ({
                ...prev,
                lastBlockModifiedDate: null,
                lastModifiedBlockSeq: null,
                lastActiveBlockSeq: {[current.blockQuestNo]:[current.blockId]},
                nevigatedSeq: { ...prev.nevigatedSeq, [current.blockQuestNo]: updateNavigateSeq }
              }));
              return false;
            }
          }
        }
        // else {
        //   // setModelScreen(true);
        //   // setCurrentScreenId(16);
        //   setReplayState("redirectToChapter")
        //   setReplayIsOpen(true);
        //   return false;
        // }
      }
    }
    else {
      let getSeqprevious: any = [];
      const getdemoblocksseq: any = Object.entries(demoBlocks[quest]);
      for (const blocks of getdemoblocksseq) {
        const blockId = blocks[1].blockId;
        if (blocks[1].blockLeadTo == current.blockSecondaryId) {
          getSeqprevious.push(blocks[1].blockPrimarySequence);
        }

        for (const optionsnavi of gameInfo.questOptions) {
          if (optionsnavi.qpQuestionId == blockId) {
            if (optionsnavi.qpNextOption == current.blockSecondaryId) {
              getSeqprevious.push(blocks[1].blockPrimarySequence);
            }
          }

        }

      }

      if (getSeqprevious.length > 0) {
        getSeqprevious.push(current.blockPrimarySequence);
      }
      getSeqprevious.sort((a: any, b: any) => a - b);
      const currentIndex = getSeqprevious.indexOf(current.blockPrimarySequence);
      if (current.blockPrimarySequence !== gameInfo?.blocks[profile?.currentQuest]['1']?.blockPrimarySequence) {
        if (currentIndex !== -1) {
          if (currentIndex > 0) {
            // Retrieve the previous sequence value
            const previousSeq = getSeqprevious[currentIndex - 1];
            const prevousBlock = current
              ? Object.keys(demoBlocks[quest] || {})
                .filter(
                  (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === previousSeq,
                )
                .map((key: any) => demoBlocks[quest]?.[key])
              : [];
            if (prevousBlock.length !== 0) {
              setType(prevousBlock[0]?.blockChoosen);
              setData(prevousBlock[0]);
              if (prevousBlock[0]?.blockChoosen === 'Interaction') {
                const optionsFiltered = [];
                for (const option of gameInfo.questOptions) {
                  if (profileData?.Audiogetlanguage.length > 0) {
                    if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                      const profilesetlan = profileData?.Audiogetlanguage.find(
                        (key: any) => key?.textId === option.qpOptionId,
                      );
    
                      if (profilesetlan) {
                        const languagecont = {
                          ...option,
                          qpOptionText: profilesetlan.content,
                        };
                        optionsFiltered.push(languagecont);
                      } else {
                        optionsFiltered.push(option);
                      }
                    }
                  } else {
                    if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                      optionsFiltered.push(option);
                    }
                  }
                }
                if (gameInfo?.gameData?.gameShuffle === 'true') {
                  for (let i = optionsFiltered.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [optionsFiltered[i], optionsFiltered[j]] = [
                      optionsFiltered[j],
                      optionsFiltered[i],
                    ];
                  }
                }

                setOptions(optionsFiltered);
              }

              let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[prevousBlock[0].blockQuestNo]];
              const lastElementSeq = updateNavigateSeq.pop();
              if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                updateNavigateSeq.push(prevousBlock[0].blockPrimarySequence);
              }
              setPreLogDatas((prev: any) => ({
                ...prev,
                lastBlockModifiedDate: null,
                lastModifiedBlockSeq: null,
                lastActiveBlockSeq: {[prevousBlock[0].blockQuestNo]:[prevousBlock[0].blockId]},
                nevigatedSeq: { ...prev.nevigatedSeq, [prevousBlock[0].blockQuestNo]: updateNavigateSeq }
              }));
              return false;
            }
            else {
              let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[current.blockQuestNo]];
              const lastElementSeq = updateNavigateSeq.pop();
              if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                updateNavigateSeq.push(current.blockPrimarySequence);
              }
              setPreLogDatas((prev: any) => ({
                ...prev,
                lastBlockModifiedDate: null,
                lastModifiedBlockSeq: null,
                lastActiveBlockSeq: {[current.blockQuestNo]:[current.blockId]},
                nevigatedSeq: { ...prev.nevigatedSeq, [current.blockQuestNo]: updateNavigateSeq }
              }));
              return false;
            }
          } else {
            // If no previous found, retrieve the next sequence
            const nextSeq = getSeqprevious[currentIndex + 1];
            const prevousBlock = current
              ? Object.keys(demoBlocks[quest] || {})
                .filter(
                  (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === nextSeq,
                )
                .map((key: any) => demoBlocks[quest]?.[key])
              : [];
            if (prevousBlock.length !== 0) {
              setType(prevousBlock[0]?.blockChoosen);
              setData(prevousBlock[0]);
              if (prevousBlock[0]?.blockChoosen === 'Interaction') {
                const optionsFiltered = [];
                for (const option of gameInfo.questOptions) {
                  if (profileData?.Audiogetlanguage.length > 0) {
                    if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                      const profilesetlan = profileData?.Audiogetlanguage.find(
                        (key: any) => key?.textId === option.qpOptionId,
                      );
    
                      if (profilesetlan) {
                        const languagecont = {
                          ...option,
                          qpOptionText: profilesetlan.content,
                        };
                        optionsFiltered.push(languagecont);
                      } else {
                        optionsFiltered.push(option);
                      }
                    }
                  } else {
                    if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                      optionsFiltered.push(option);
                    }
                  }
                }
                if (gameInfo?.gameData?.gameShuffle === 'true') {
                  for (let i = optionsFiltered.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [optionsFiltered[i], optionsFiltered[j]] = [
                      optionsFiltered[j],
                      optionsFiltered[i],
                    ];
                  }
                }
                setOptions(optionsFiltered);
              }

              let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[prevousBlock[0].blockQuestNo]];
              const lastElementSeq = updateNavigateSeq.pop();
              if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                updateNavigateSeq.push(prevousBlock[0].blockPrimarySequence);
              }

              setPreLogDatas((prev: any) => ({
                ...prev,
                lastBlockModifiedDate: null,
                lastModifiedBlockSeq: null,
                lastActiveBlockSeq: {[prevousBlock[0].blockQuestNo]:[prevousBlock[0].blockId]},
                nevigatedSeq: { ...prev.nevigatedSeq, [prevousBlock[0].blockQuestNo]: updateNavigateSeq }
              }));
              return false;
            }
            else {
              let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[current.blockQuestNo]];
              const lastElementSeq = updateNavigateSeq.pop();
              if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
                updateNavigateSeq.push(current.blockPrimarySequence);
              }
              setPreLogDatas((prev: any) => ({
                ...prev,
                lastBlockModifiedDate: null,
                lastModifiedBlockSeq: null,
                lastActiveBlockSeq: {[current.blockQuestNo]:[current.blockId]},
                nevigatedSeq: { ...prev.nevigatedSeq, [current.blockQuestNo]: updateNavigateSeq }
              }));
              return false;
            }
          }
        } else {
          const prevousBlock = current
            ? Object.keys(demoBlocks[quest] || {})
              .filter(
                (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === prevSeq,
              )
              .map((key: any) => demoBlocks[quest]?.[key])
            : [];
          if (prevousBlock.length !== 0) {
            setType(prevousBlock[0]?.blockChoosen);
            setData(prevousBlock[0]);
            if (prevousBlock[0]?.blockChoosen === 'Interaction') {
              const optionsFiltered = [];
              for (const option of gameInfo.questOptions) {
                if (profileData?.Audiogetlanguage.length > 0) {
                  if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                    const profilesetlan = profileData?.Audiogetlanguage.find(
                      (key: any) => key?.textId === option.qpOptionId,
                    );
  
                    if (profilesetlan) {
                      const languagecont = {
                        ...option,
                        qpOptionText: profilesetlan.content,
                      };
                      optionsFiltered.push(languagecont);
                    } else {
                      optionsFiltered.push(option);
                    }
                  }
                } else {
                  if (option?.qpSequence === prevousBlock[0]?.blockPrimarySequence) {
                    optionsFiltered.push(option);
                  }
                }
              }
              if (gameInfo?.gameData?.gameShuffle === 'true') {
                for (let i = optionsFiltered.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [optionsFiltered[i], optionsFiltered[j]] = [
                    optionsFiltered[j],
                    optionsFiltered[i],
                  ];
                }
              }
              
              setOptions(optionsFiltered);
            }

            let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[prevousBlock[0].blockQuestNo]];
            const lastElementSeq = updateNavigateSeq.pop();
            if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
              updateNavigateSeq.push(prevousBlock[0].blockPrimarySequence);
            }

            setPreLogDatas((prev: any) => ({
              ...prev,
              lastBlockModifiedDate: null,
              lastModifiedBlockSeq: null,
              lastActiveBlockSeq: {[prevousBlock[0].blockQuestNo]:[prevousBlock[0].blockId]},
              nevigatedSeq: { ...prev.nevigatedSeq, [prevousBlock[0].blockQuestNo]: updateNavigateSeq }
            }));
            return false;
          }
          else {
            let updateNavigateSeq: any = [...getPrevLogDatas.nevigatedSeq[current.blockQuestNo]];
            const lastElementSeq = updateNavigateSeq.pop();
            if (secondLastSeq != updateNavigateSeq[updateNavigateSeq.length - 1]) {
              updateNavigateSeq.push(current.blockPrimarySequence);
            }
            setPreLogDatas((prev: any) => ({
              ...prev,
              lastBlockModifiedDate: null,
              lastModifiedBlockSeq: null,
              lastActiveBlockSeq:{[current.blockQuestNo]:[current.blockId]},
              nevigatedSeq: { ...prev.nevigatedSeq, [current.blockQuestNo]: updateNavigateSeq }
            }));
            return false;
          }
        }
      }
      // else {
      //   // setModelScreen(true);
      //   // setCurrentScreenId(16);
      //   setReplayState("redirectToChapter")
      //   setReplayIsOpen(true);
      //   return false;
      // }
    }
  }
  const calcQuestGrandTotal = async (
    scores: any,
    currentQuestNo: any = null,
  ) => {
    if (scores?.length <= 0) {
      return 0;
    }
    
    if (currentQuestNo != null) {
      // Sum score of a quest
      const totalScore = scores.reduce((total: number, sc: any) => {
        if (sc.quest == currentQuestNo) {
          return total + sc.score;
        } else {
          return total;
        }
      }, 0);
      return totalScore; // Return the total score
    } else {
      //Sum up all the scores
      return scores.reduce((total: number, sc: any) => total + sc.score, 0);
    }
  };

  const checkAndUpdateScores = async () => {
    const currentQuest = profile.currentQuest;
    // if (questState[currentQuest] !== 'Started') {
      const scoreTotal = await calcQuestGrandTotal(
        profile.score,
        profile.currentQuest,
      );
      const replayScoreTotal = await calcQuestGrandTotal(
        profile.replayScore,
        profile.currentQuest,
      );
    
      if (scoreTotal <= replayScoreTotal) {
        const currentQuestRemovedScoreArr = profile.score.filter(
          (item: any) => item.quest != profile.currentQuest,
        );
        let concatenatedScoreArr: any[] = [];
        if (profile.replayScore.length > 0) {
          concatenatedScoreArr = profile.replayScore.filter(
            (item: any) => item.quest == profile.currentQuest,
          );
        }
        if (currentQuestRemovedScoreArr.length > 0) {
          concatenatedScoreArr = [
            ...concatenatedScoreArr,
            ...currentQuestRemovedScoreArr,
          ];
        }
        const currentQuestRemovedReplayScoreArr = profile.replayScore.filter(
          (item: any) => item.quest != profile.currentQuest,
        );

        setProfile((prev: any) => ({
          ...prev,
          score: concatenatedScoreArr,
          replayScore: currentQuestRemovedReplayScoreArr,
        }));
      } else {
        const currentQuestRemovedReplayScoreArr = profile.replayScore.filter(
          (item: any) => item.quest != profile.currentQuest,
        );
        setProfile((prev: any) => ({
          ...prev,
          replayScore: currentQuestRemovedReplayScoreArr,
        }));
      }
  };

  const getData = (next: any) => {
    if (navi === '' || navi !== 'Repeat Question') {
      setRepeatPrevOption([]);
    }
    setRepeatSelectOption(false);
    setIsPrevNavigation(false);
    if (next?.blockChoosen === 'Interaction') {
      const isDuplicate = feedbackList?.some(
        (item: any) =>
          item.Seq === next?.blockPrimarySequence &&
          item.Options === getSelectedOptions,
      );

      if (!isDuplicate) {
        if (feed !== '') {
          setFeedbackList((prevFeedbackList) => [
            ...prevFeedbackList,
            {
              feedbackcontent: feed,
              Seq: next?.blockPrimarySequence,
              Options: getSelectedOptions,
            },
          ]);
        }
      }
    }
    SetPreviouseStored(next);
    const currentBlock = next
      ? parseInt(next?.blockPrimarySequence.split('.')[1])
      : null;

    //get the next block details
    const quest = next ? next?.blockPrimarySequence.split('.')[0] : null;
    const NextItem = currentBlock != null ? currentBlock + 1 : null;

    const nextSeq = next
      ? `${next?.blockPrimarySequence.split('.')[0]}.${NextItem}`
      : '';
    const prevTrack = navTrack;

    const currentQuest = next
      ? parseInt(next?.blockPrimarySequence.split('.')[0])
      : null;
    setCurrentQuestNo(currentQuest);
    setGame3Position((prev: any) => ({
      ...prev,
      previousBlock: next?.blockPrimarySequence,
      currentBlock: nextSeq,
    }));
    // const nextLevel =  currentQuest != null ? String(currentQuest + 1) : null
    const nextLevel = parseInt(profile?.currentQuest)+1 || null;
    const nextBlock = next
      ? Object.keys(demoBlocks[quest] || {})
          .filter(
            (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === nextSeq,
          )
          .map((key: any) => demoBlocks[quest]?.[key])
      : [];
if(currentScreenId ===2)
  {
    if (nextBlock[0]?.blockChoosen === 'Interaction') {
      const optionsFiltered = [];
      for (const option of gameInfo.questOptions) {
        if (profileData?.Audiogetlanguage.length > 0) {
          if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
            const profilesetlan = profileData?.Audiogetlanguage.find(
              (key: any) => key?.textId === option.qpOptionId,
            );
            if (profilesetlan) {
              const languagecont = {
                ...option,
                qpOptionText: profilesetlan.content,
              };
              optionsFiltered.push(languagecont);
            } else {
              optionsFiltered.push(option);
            }
          }
        } else {
          if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
            optionsFiltered.push(option);
          }
        }
      }
      if (gameInfo?.gameData?.gameShuffle === 'true') {
        for (let i = optionsFiltered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsFiltered[i], optionsFiltered[j]] = [
            optionsFiltered[j],
            optionsFiltered[i],
          ];
        }
      }
      setOptions(optionsFiltered);
    }
    if (type === 'Interaction' && resMsg !== '') {
      setType('response');
      return false;
    } 
    else if (
      (type === 'Interaction' || type === 'response') &&
      feed !== '' &&
      gameInfo?.gameData?.gameIsShowInteractionFeedBack !== 'Completion'
    ) {
      setType('feedback');
      return false;
    } else if (
      type === 'Interaction' ||
      type === 'response' ||
      type === 'feedback'
    ) {
      if (navi === 'Repeat Question') {
        setRepeatSelectOption(true);
        RepeatPrevOption.push(getSelectedOptions.options);
        setRepeatPrevOption(RepeatPrevOption);
        setType(next?.blockChoosen);
        setData(next);
        if (next?.blockChoosen === 'Interaction') {
          const optionsFiltered = [];
          for (const option of gameInfo.questOptions) {
            if (profileData?.Audiogetlanguage.length > 0) {
              if (option?.qpSequence === next?.blockPrimarySequence) {
                const profilesetlan = profileData?.Audiogetlanguage.find(
                  (key: any) => key?.textId === option.qpOptionId,
                );
                if (profilesetlan) {
                  const languagecont = {
                    ...option,
                    qpOptionText: profilesetlan.content,
                  };
                  optionsFiltered.push(languagecont);
                } else {
                  optionsFiltered.push(option);
                }
              }
            } else {
              if (option?.qpSequence === next?.blockPrimarySequence) {
                optionsFiltered.push(option);
              }
            }
          }
          if (gameInfo?.gameData?.gameShuffle === 'true') {
            for (let i = optionsFiltered.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [optionsFiltered[i], optionsFiltered[j]] = [
                optionsFiltered[j],
                optionsFiltered[i],
              ];
            }
          }
          setOptions(optionsFiltered);
        }
        setSelectedOption(null);
        return false;
      } else if (navi === 'New Block') {
        setType(nextBlock[0]?.blockChoosen);
        setData(nextBlock[0]);
        if (next?.blockChoosen === 'Interaction') {
          const optionsFiltered = [];
          for (const option of gameInfo.questOptions) {
            if (profileData?.Audiogetlanguage.length > 0) {
              if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                const profilesetlan = profileData?.Audiogetlanguage.find(
                  (key: any) => key?.textId === option.qpOptionId,
                );
                if (profilesetlan) {
                  const languagecont = {
                    ...option,
                    qpOptionText: profilesetlan.content,
                  };
                  optionsFiltered.push(languagecont);
                } else {
                  optionsFiltered.push(option);
                }
              }
            } else {
              if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                optionsFiltered.push(option);
              }
            }
          }
          if (gameInfo?.gameData?.gameShuffle === 'true') {
            for (let i = optionsFiltered.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [optionsFiltered[i], optionsFiltered[j]] = [
                optionsFiltered[j],
                optionsFiltered[i],
              ];
            }
          }
          setOptions(optionsFiltered);
        }
        setSelectedOption(null);
        return false;
      } else if (navi === 'Replay Point') {
        setSelectedOption(null);
        setReplayState('replayPointPrompt');
        setReplayIsOpen(true);
        return false;
      } else if (navi === 'Select Block') {
        const selectedNext = Object.keys(demoBlocks[currentQuest])
          .filter((item: any) => {
            return (
              demoBlocks[currentQuest][item]?.blockSecondaryId ===
              parseInt(optionNavigation)
            );
          })
          .map((item: any) => {
            return demoBlocks[currentQuest][item];
          });
        if (selectedNext.length > 0) {
          setType(selectedNext && selectedNext[0]?.blockChoosen);
          if (selectedNext[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (
                  option?.qpSequence === selectedNext[0]?.blockPrimarySequence
                ) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (
                  option?.qpSequence === selectedNext[0]?.blockPrimarySequence
                ) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(selectedNext && selectedNext[0]);
          setGame3Position((prev: any) => ({
            ...prev,
            nextBlock: nextBlock[0]?.blockPrimarySequence,
          }));
          setSelectedOption(null);
          return false;
        } else {
          setType(nextBlock[0]?.blockChoosen);
          if (nextBlock[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(nextBlock[0]);
          setGame3Position((prev: any) => ({
            ...prev,
            nextBlock: nextBlock[0]?.blockPrimarySequence,
          }));
          setSelectedOption(null);
          return false;
        }
      } else if (navi === 'Complete') {
        //check the replay Quest score is higher than score in profile context
        checkAndUpdateScores();
        const Nextcurrentquest = next?.blockQuestNo;
        const getgameinfoquest = gameInfo?.gameQuest.find(
          (row: any) => row.gameQuestNo == Nextcurrentquest,
        );
 
        
        if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
          const getminpassscore = getgameinfoquest?.gameMinScore;
          let scores:any = [];
          const questStatus = questState[profile?.currentQuest];
          if (questStatus === 'completed') {
            // If the quest is completed, compare the scores
            if (profile?.score !== null && profile?.replayScore !== null) {
              scores =
                profile.score > profile.replayScore
                  ? profile.score
                  : profile.replayScore;
            } 
          } else if (questStatus === 'Started') {
            // If the quest is started, consider the score
              scores = profile?.score !== null || profile.score!==undefined ? profile.score : null; //null or scores or replayScore
            
          }
          else
          {
            if (profile?.score !== null && profile?.replayScore !== null) {
              scores =
                profile.score > profile.replayScore
                  ? profile.score
                  : profile.replayScore;
      
            } 
            else{
              if (profile?.score.length > 0) {
                scores = profile?.score 
            }
            } 
          }
          const sums: any = {};
          scores.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
            sums[quest] += score.score;
          });

          // const getFinalscores = Object.values(sums);
          const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
            quest,
            score,
          }));
          const getscores = getFinalscores.find(
            (row: any) => row.quest == getgameinfoquest.gameQuestNo,
          );
          const finalscore = getscores?.score;
          if (finalscore < getminpassscore) {
            // setisReplay(true);
            Setprofilescore(finalscore);
            // setisOptionalReplay(false);
            // setCurrentScreenId(8);
            setReplayState('mandatoryReplay');
            setReplayIsOpen(true);
            return false;
          } else {
            /*
            if (demoBlocks.hasOwnProperty(nextLevel)) {
              setProfile((prev: any) => {
                const data = { ...prev };
                if (!profile.completedLevels.includes(String(currentQuest))) {
                  data.completedLevels = [...data.completedLevels, nextLevel];
                }

                return data;
              });

              setType(demoBlocks[nextLevel]['1']?.blockChoosen);
              setData(demoBlocks[nextLevel]['1']);
              setCurrentScreenId(6);
              return false;
            } else {
              setCurrentScreenId(6);
              setType(null);
              setData(null);
              return false;
            }
            */
           if(gameInfo?.gameData?.gameIsShowLeaderboard === 'true')
            {
              setType(next?.blockChoosen);
              setData(next);
              setCurrentScreenId(6);
              return false;
            }
            else if(feedbackList.length !== 0)
              {
                setType(next?.blockChoosen);
                setData(next);
                setCurrentScreenId(6);
                return false;
              }
            else
            {
              if (demoBlocks.hasOwnProperty(nextLevel)) {
                setProfile((prev: any) => {
                  const data = { ...prev };
                  // if (!profile.completedLevels.includes(String(currentQuest))) {
                  //   data.completedLevels = [...data.completedLevels, nextLevel];
                  // }
  
                  if (!profile.completedLevels.includes(String(nextLevel))) {
                    data.completedLevels = [...data.completedLevels, String(nextLevel)];
                  }
                  return data;
                });
  
                setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                setData(demoBlocks[nextLevel]['1']);
                setCurrentScreenId(6);
                return false;
              } else {
                setCurrentScreenId(6);
                setType(null);
                setData(null);
                return false;
              }
            }
          }
        } else {
          if(gameInfo?.gameData?.gameIsShowLeaderboard === 'true')
            {
              setType(next?.blockChoosen);
              setData(next);
              setCurrentScreenId(6);
              return false;
            }
            else if(feedbackList.length !== 0)
              {
                setType(next?.blockChoosen);
                setData(next);
                setCurrentScreenId(6);
                return false;
              }
            else
            {
              if (demoBlocks.hasOwnProperty(nextLevel)) {
                setProfile((prev: any) => {
                  const data = { ...prev };
                  // if (!profile.completedLevels.includes(String(currentQuest))) {
                  //   data.completedLevels = [...data.completedLevels, nextLevel];
                  // }
                  if (!profile.completedLevels.includes(String(nextLevel))) {
                    data.completedLevels = [...data.completedLevels, String(nextLevel)];
                  }
                  return data;
                });
  
                setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                setData(demoBlocks[nextLevel]['1']);
                setCurrentScreenId(6);
                return false;
              } else {
                setCurrentScreenId(6);
                setType(null);
                setData(null);
                return false;
              }
            }
            /*
          if (demoBlocks.hasOwnProperty(nextLevel)) {
            setProfile((prev: any) => {
              const data = { ...prev };
              if (!profile.completedLevels.includes(String(currentQuest))) {
                data.completedLevels = [...data.completedLevels, nextLevel];
              }
              return data;
            });
            setType(demoBlocks[nextLevel]['1']?.blockChoosen);
            setData(demoBlocks[nextLevel]['1']);
            setCurrentScreenId(6);
            return false;
          } else {
            setCurrentScreenId(6);
            setType(null);
            setData(null);
            return false;
          }
          */
        }
        /*
        if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
          if (demoBlocks.hasOwnProperty(nextLevel)) {
            setProfile((prev: any) => {
              const data = { ...prev };
              if(!profile.completedLevels.includes(currentQuest))
                {
                  data.completedLevels = [...data.completedLevels, nextLevel];
                }
              
              return data;
            });
  
            setType(demoBlocks[nextLevel]['1']?.blockChoosen);
            setData(demoBlocks[nextLevel]['1']);
            setCurrentScreenId(6);
            return false;
          } else {
            setCurrentScreenId(6);
            setType(null);
            setData(null);
            return false;
          }
        }
        else{
          setisOptionalReplay(true);
          setCurrentScreenId(8);
          return false;
        }
        */
      } else {
        /** IF a block not has navi option then it leads to next block */
        if (nextBlock && nextBlock[0]?.blockChoosen) {
          setType(nextBlock[0]?.blockChoosen);
          setData(nextBlock[0]);
          setSelectedOption(null);
          return false;
        } else {
          /** else leads to first block of the quest */
          setNavigateBlockEmpty(true);
          setType(demoBlocks[quest]['1']?.blockChoosen);
          setData(demoBlocks[quest]['1']);
          if (demoBlocks[quest]['1']?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (
                  option?.qpSequence ===
                  demoBlocks[quest]['1']?.blockPrimarySequence
                ) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (
                  option?.qpSequence ===
                  demoBlocks[quest]['1'].blockPrimarySequence
                ) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setSelectedOption(null);
          return false;
        }
      }
    }
  }
    if (currentScreenId === 6) {
      //Completion
      const {
        currentQuest,
        currentGameData,
        nextLevel,
        haveNextQuest,
        totalScore,
      } = calScore();
           
     if (gameInfo?.gameData?.gameIsShowLeaderboard === 'true') {
       setCurrentScreenId(4); //Navigate to leaderboard
       return false;
      } else if (haveNextQuest) {
          checkAndUpdateScores();
        if (currentGameData?.gameIsSetMinPassScore === 'true') {
          const getminpassscore = currentGameData?.gameMinScore;
          const scores = profile?.score;
          const sums: any = {};
          scores.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
            sums[quest] += score.score;
          });
          const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
            quest,
            score,
          }));
          const getscores = getFinalscores.find(
            (row: any) => row.quest == currentGameData.gameQuestNo,
          );
          const finalscore = getscores?.score;

          if (
            finalscore >= getminpassscore &&
            finalscore < currentGameData?.gameDistinctionScore &&
            gameInfo.gameData?.gameDisableOptionalReplays === 'false'
          ) {
            setReplayState('optionalReplay');
            setReplayIsOpen(true);
            // setCurrentScreenId(8); //Navigate to replaygame prompt screen
            return false;
            //set to prompt it for replay the game
          } else {
               if(feedbackList.length !== 0 && gameInfo?.gameData?.gameIsShowInteractionFeedBack === 'Completion')
                {
                  const Completionpage = Object.entries(questState).map(
                        ([questId, status]) => ({ questId, status }),
                      );
                      const OpenStraigntCompletionPage = Completionpage.find(
                        (row: any) =>
                          row.questId === profile.currentQuest && row.status === 'completed',
                      );
                      if (OpenStraigntCompletionPage !== undefined) {
                        setFeedbackList([]);
                        setMotionEffect(true);
                        setCurrentScreenId(13);
                        return false;
                      }
                      if (feedbackList.length !== 0) {
                        getFeedbackData(next);
                        setFeedbackNavigateNext(false);
                        setCurrentScreenId(14); //Navigate to together all feedback
                        return false;
                      }else {
                            if (demoBlocks.hasOwnProperty(nextLevel)) {
                              setProfile((prev: any) => {
                                const data = { ...prev };
                                // if (!profile.completedLevels.includes(currentQuest)) {
                                //   data.completedLevels = [...data.completedLevels, nextLevel];
                                // }
                                if (!profile.completedLevels.includes(String(nextLevel))) {
                                  data.completedLevels = [...data.completedLevels, String(nextLevel)];
                                }
                                return data;
                              });
                  
                              setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                              setData(demoBlocks[nextLevel]['1']);
                              setMotionEffect(true);
                              setCurrentScreenId(13);
                              return false;
                            } else {
                              if (
                                gameInfo.gameData?.gameIsShowReflectionScreen === 'true' &&
                                gameInfo?.reflectionQuestions.length > 0
                              ) {
                                setCurrentScreenId(3); //Navigate to Reflection screen
                                return false;
                              } else if (gameInfo.gameData?.gameIsShowTakeaway === 'true') {
                                setCurrentScreenId(7); //Navigate to takeaway screen
                                return false;
                              } else {
                                setType(null);
                                setData(null);
                                setCurrentScreenId(5);
                                return false;
                              }
                            }
                          }
                }
              else
              {
             
                if (demoBlocks.hasOwnProperty(nextLevel)) {
                  setProfile((prev: any) => {
                    const data = { ...prev };
                    // if (!profile.completedLevels.includes(String(currentQuest))) {
                    //   data.completedLevels = [...data.completedLevels, String(nextLevel)];
                    // }
                    if (!profile.completedLevels.includes(String(nextLevel))) {
                      data.completedLevels = [...data.completedLevels, String(nextLevel)];
                    }
    
                    return data;
                  });
                  setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                  setData(demoBlocks[nextLevel]['1']);
                  setMotionEffect(true);
                  setCurrentScreenId(13);
                  return false;
                } else {
                 if (
                    gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
                    gameInfo?.reflectionQuestions.length > 0
                  ) {
                    setCurrentScreenId(3); //reflection screen
                    return false;
                  } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
                    setCurrentScreenId(7); //takeaway
                    return false;
                  } else {
                    setType(null);
                    setData(null);
                    setCurrentScreenId(5); //thank you screen
                    return false;
                  }
                }
              }
              /*
            if (demoBlocks.hasOwnProperty(nextLevel)) {
              setProfile((prev: any) => {
                const data = { ...prev };
                if (!profile.completedLevels.includes(String(currentQuest))) {
                  data.completedLevels = [...data.completedLevels, nextLevel];
                }

                return data;
              });
              setType(demoBlocks[nextLevel]['1']?.blockChoosen);
              setData(demoBlocks[nextLevel]['1']);
              setCurrentScreenId(13);
              return false;
            } else {
              if (
                gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
                gameInfo?.reflectionQuestions.length > 0
              ) {
                setCurrentScreenId(3); //reflection screen
                return false;
              } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
                setCurrentScreenId(7); //takeaway
                return false;
              } else {
                setType(null);
                setData(null);
                setCurrentScreenId(5); //thank you screen
                return false;
              }
            }
            */
          }
        } else {
          if(feedbackList.length !== 0 && gameInfo?.gameData?.gameIsShowInteractionFeedBack === 'Completion')
              {
                const Completionpage = Object.entries(questState).map(
                  ([questId, status]) => ({ questId, status }),
                );
                const OpenStraigntCompletionPage = Completionpage.find(
                  (row: any) =>
                    row.questId === profile.currentQuest && row.status === 'completed',
                );
                if (OpenStraigntCompletionPage !== undefined) {
                  setFeedbackList([]);
                  setMotionEffect(true);
                  setCurrentScreenId(13);
                  return false;
                }
                if (feedbackList.length !== 0) {
                  getFeedbackData(next);
                  setFeedbackNavigateNext(false);
                  setCurrentScreenId(14); //Navigate to together all feedback
                  return false;
                }else {
                      if (demoBlocks.hasOwnProperty(nextLevel)) {
                        setProfile((prev: any) => {
                          const data = { ...prev };
                          // if (!profile.completedLevels.includes(currentQuest)) {
                          //   data.completedLevels = [...data.completedLevels, nextLevel];
                          // }
                          if (!profile.completedLevels.includes(String(nextLevel))) {
                            data.completedLevels = [...data.completedLevels, String(nextLevel)];
                          }
            
                          return data;
                        });
            
                        setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                        setData(demoBlocks[nextLevel]['1']);
                        setMotionEffect(true);
                        setCurrentScreenId(13);
                        return false;
                      } else {
                        if (
                          gameInfo.gameData?.gameIsShowReflectionScreen === 'true' &&
                          gameInfo?.reflectionQuestions.length > 0
                        ) {
                          setCurrentScreenId(3); //Navigate to Reflection screen
                          return false;
                        } else if (gameInfo.gameData?.gameIsShowTakeaway === 'true') {
                          setCurrentScreenId(7); //Navigate to takeaway screen
                          return false;
                        } else {
                          setType(null);
                          setData(null);
                          setCurrentScreenId(5);
                          return false;
                        }
                      }
                    }
              }
          else{
            if (demoBlocks.hasOwnProperty(nextLevel)) {
            setProfile((prev: any) => {
              const data = { ...prev };
              if (!profile.completedLevels.includes(String(nextLevel))) {
                data.completedLevels = [...data.completedLevels, String(nextLevel)];
              }
              return data;
            });
            setType(demoBlocks[nextLevel]['1']?.blockChoosen);
            setData(demoBlocks[nextLevel]['1']);
              setMotionEffect(true);
            setCurrentScreenId(13);
            return false;
          } else {
            if (
              gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
              gameInfo?.reflectionQuestions.length > 0
            ) {
              setCurrentScreenId(3); //reflection screen
              return false;
            } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
              setCurrentScreenId(7); //takeaway
              return false;
            } else {
              setType(null);
              setData(null);
              setCurrentScreenId(5); //thank you screen
              return false;
            }
          }
          }
          
        }
        // Dont Want to Check This Condition
        /*else if (gameInfo.gameData?.gameDisableOptionalReplays === 'false') {
          setCurrentScreenId(8); //Navigate to replaygame prompt screen
          return false;
        }*/
      }
      else if (
        gameInfo.gameData?.gameIsShowReflectionScreen === 'true' &&
        gameInfo?.reflectionQuestions.length > 0
      ) {
        setCurrentScreenId(3); //Navigate to Reflection screen
        return false;
      } else if (gameInfo.gameData?.gameIsShowTakeaway === 'true') {
        setCurrentScreenId(7); //Navigate to takeaway screen
        return false;
      } else {
        setCurrentScreenId(5); //Navigate to Thank you screen
        return false;
      }
      // }
    }
    if (currentScreenId === 14) {
      const Nextcurrentquest = profile?.currentQuest;
      const getgameinfoquest = gameInfo?.gameQuest.find(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      const haveNextQuest = gameInfo.gameQuest.some(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      if (gameInfo?.gameData?.gameDisableOptionalReplays === 'false') {
        if (haveNextQuest) {
          if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
            const getminpassscore = getgameinfoquest?.gameMinScore;
            const scores = profile?.score;
            const sums: any = {};
            scores.forEach((score: any) => {
              const quest = score.quest;
              if (!sums[quest]) {
                sums[quest] = 0;
              }
              sums[quest] += score.score;
            });

            const getFinalscores = Object.entries(sums).map(
              ([quest, score]) => ({
                quest,
                score,
              }),
            );
            const getscores = getFinalscores.find(
              (row: any) => row.quest == getgameinfoquest?.gameQuestNo,
            );
            const finalscore = getscores?.score;
            if (
              finalscore >= getminpassscore &&
              finalscore < getgameinfoquest?.gameDistinctionScore &&
              gameInfo.gameData?.gameDisableOptionalReplays === 'false'
            ) {
              // setisOptionalReplay(true);
              // setisReplay(false);
              Setprofilescore(finalscore);
              // setCurrentScreenId(8);
              setReplayState('optionalReplay');
              setReplayIsOpen(true);
              return false;
            } else {
              if (demoBlocks.hasOwnProperty(nextLevel)) {
               
                setProfile((prev: any) => {
                  const data = { ...prev };
                  // if (!profile.completedLevels.includes(String(currentQuest))) {
                  //   data.completedLevels = [...data.completedLevels, nextLevel];
                  // }
                  if (!profile.completedLevels.includes(String(nextLevel))) {
                    data.completedLevels = [...data.completedLevels, String(nextLevel)];
                  }
                  return data;
                });
                setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                setData(demoBlocks[nextLevel]['1']);
                setMotionEffect(true);
                setCurrentScreenId(13);
                return false;
              } else {
                if (
                  gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
                  gameInfo?.reflectionQuestions.length > 0
                ) {
                  setCurrentScreenId(3); //reflection screen
                  return false;
                } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
                  setCurrentScreenId(7); //takeaway
                  return false;
                } else {
                  setType(null);
                  setData(null);
                  setCurrentScreenId(5); //thank you screen
                  return false;
                }
              }
              // setCurrentScreenId(13); //Navigate to Chapter Selection screen
              // return false;
            }
          } else {
            if (demoBlocks.hasOwnProperty(nextLevel)) {
              setFeedbackNavigateNext(false);
              setProfile((prev: any) => {
                const data = { ...prev };
                // if (!profile.completedLevels.includes(String(currentQuest))) {
                //   data.completedLevels = [...data.completedLevels, nextLevel];
                // }
                if (!profile.completedLevels.includes(String(nextLevel))) {
                  data.completedLevels = [...data.completedLevels, String(nextLevel)];
                }
                return data;
              });
              setType(demoBlocks[nextLevel]['1']?.blockChoosen);
              setData(demoBlocks[nextLevel]['1']);
              setMotionEffect(true);
              setCurrentScreenId(13);
              return false;
            } else {
              if (
                gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
                gameInfo?.reflectionQuestions.length > 0
              ) {
                setCurrentScreenId(3);
                return false;
              } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
                setCurrentScreenId(7);
                return false;
              } else {
                setType(null);
                setData(null);
                setCurrentScreenId(5);
                return false;
              }
            }
          }
        }
      } else if (demoBlocks.hasOwnProperty(nextLevel)) {
        setProfile((prev: any) => {
          const data = { ...prev };
          // if (!profile.completedLevels.includes(String(currentQuest))) {
          //   data.completedLevels = [...data.completedLevels, nextLevel];
          // }
          if (!profile.completedLevels.includes(String(nextLevel))) {
            data.completedLevels = [...data.completedLevels, String(nextLevel)];
          }
          return data;
        });
        setType(demoBlocks[nextLevel]['1']?.blockChoosen);
        setData(demoBlocks[nextLevel]['1']);
        setMotionEffect(true);
        setCurrentScreenId(13);
        return false;
      } else if (
        gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
        gameInfo?.reflectionQuestions.length > 0
      ) {
        setCurrentScreenId(3); //reflection screen
        return false;
      } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
        setCurrentScreenId(7); //takeaway
        return false;
      } else {
        setType(null);
        setData(null);
        setCurrentScreenId(5); //thank you screen
        return false;
      }
    }
    if (currentScreenId === 8) {
      if (gameInfo?.gameData?.gameIsShowLeaderboard === 'true') {
        setCurrentScreenId(4);
        return false;
      } else if (
        gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
        gameInfo?.reflectionQuestions.length > 0
      ) {
        setCurrentScreenId(3);
        return false;
      } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
        setCurrentScreenId(7);
        return false;
      } else {
        if (data && type) {
          setCurrentScreenId(2);
          return false;
        } else {
          setType(null);
          setData(null);
          setCurrentScreenId(5);
          return false;
        }
      }
    }
    if (currentScreenId === 4) {
      checkAndUpdateScores();
      if (gameInfo?.gameData?.gameIsShowInteractionFeedBack === 'Completion') {
        const Completionpage = Object.entries(questState).map(
          ([questId, status]) => ({ questId, status }),
        );       
        if (feedbackList.length !== 0) {
          getFeedbackData(data);
          setFeedbackNavigateNext(false);
          setCurrentScreenId(14); //Navigate to together all feedback
          return false;
        }
      }

      const Nextcurrentquest = profile?.currentQuest;
      const getgameinfoquest = gameInfo?.gameQuest.find(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      const haveNextQuest = gameInfo.gameQuest.some(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      if (haveNextQuest) {
        if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
          const getminpassscore = getgameinfoquest?.gameMinScore;
          const scores = profile?.score;
          const sums: any = {};
          scores.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
            sums[quest] += score.score;
          });

          const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
            quest,
            score,
          }));
          const getscores = getFinalscores.find(
            (row: any) => row.quest == getgameinfoquest.gameQuestNo,
          );
          const finalscore = getscores?.score;
          if (
            finalscore >= getminpassscore &&
            finalscore < getgameinfoquest?.gameDistinctionScore &&
            gameInfo.gameData?.gameDisableOptionalReplays === 'false'
          ) {
            // setisOptionalReplay(true);
            // setisReplay(false);
            Setprofilescore(finalscore);
            // setCurrentScreenId(8);
            setReplayState('optionalReplay');
            setReplayIsOpen(true);
            return false;
          } else {
            if (demoBlocks.hasOwnProperty(nextLevel)) {
              setFeedbackNavigateNext(false);
              setProfile((prev: any) => {
                const data = { ...prev };
                // if (!profile.completedLevels.includes(String(nextLevel))) {
                //   data.completedLevels = [...data.completedLevels, String(nextLevel)];
                // }
                if (!profile.completedLevels.includes(String(nextLevel))) {
                  data.completedLevels = [...data.completedLevels, String(nextLevel)];
                }
                return data;
              });
              setType(demoBlocks[nextLevel]['1']?.blockChoosen);
              setData(demoBlocks[nextLevel]['1']);
              setMotionEffect(true);
              setCurrentScreenId(13);
              return false;
            } else {
              if (
                gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
                gameInfo?.reflectionQuestions.length > 0
              ) {
                setCurrentScreenId(3);
                return false;
              } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
                setCurrentScreenId(7);
                return false;
              } else {
                setType(null);
                setData(null);
                setCurrentScreenId(5);
                return false;
              }
            }
          }
        } else {
          if (demoBlocks.hasOwnProperty(nextLevel)) {
            setFeedbackNavigateNext(false);
            setProfile((prev: any) => {
              const data = { ...prev };
              // if (!profile.completedLevels.includes(String(nextLevel))) {
              //   data.completedLevels = [...data.completedLevels, String(nextLevel)];
              // }
              if (!profile.completedLevels.includes(String(nextLevel))) {
                data.completedLevels = [...data.completedLevels, String(nextLevel)];
              }
              return data;
            });

            setType(demoBlocks[nextLevel]['1']?.blockChoosen);
            setData(demoBlocks[nextLevel]['1']);
            setMotionEffect(true);
            setCurrentScreenId(13);
            return false;
          } else {
            if (
              gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
              gameInfo?.reflectionQuestions.length > 0
            ) {
              setCurrentScreenId(3);
              return false;
            } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
              setCurrentScreenId(7);
              return false;
            } else {
              setType(null);
              setData(null);
              setCurrentScreenId(5);
              return false;
            }
          }
        }
      } else {
        if (demoBlocks.hasOwnProperty(nextLevel)) {
          setFeedbackNavigateNext(false);
          setProfile((prev: any) => {
            const data = { ...prev };
            // if (!profile.completedLevels.includes(String(currentQuest))) {
            //   data.completedLevels = [...data.completedLevels, nextLevel];
            // }
            if (!profile.completedLevels.includes(String(nextLevel))) {
              data.completedLevels = [...data.completedLevels, String(nextLevel)];
            }
            return data;
          });

          setType(demoBlocks[nextLevel]['1']?.blockChoosen);
          setData(demoBlocks[nextLevel]['1']);
          setMotionEffect(true);
          setCurrentScreenId(13);
          return false;
        } else {
          if (
            gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
            gameInfo?.reflectionQuestions.length > 0
          ) {
            setCurrentScreenId(3);
            return false;
          } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
            setCurrentScreenId(7);
            return false;
          } else {
            setType(null);
            setData(null);
            setCurrentScreenId(5);
            return false;
          }
        }
      }
    }
    if (currentScreenId === 7) {
      setCurrentScreenId(5);
      return false;
    }
    if (nextBlock.length === 0) {
      const Nextcurrentquest = next?.blockQuestNo;
      const getgameinfoquest = gameInfo?.gameQuest.find(
        (row: any) => row.gameQuestNo == Nextcurrentquest,
      );
      if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
        const getminpassscore = getgameinfoquest?.gameMinScore;
        let scores:any = [];
        const questStatus = questState[profile?.currentQuest];
        if (questStatus === 'completed') {
          if (profile?.score !== null && profile?.replayScore !== null) {
            scores =
              profile.score > profile.replayScore
                ? profile.score
                : profile.replayScore;
          } 
        } else if (questStatus === 'Started') {
            scores = profile?.score !== null || profile.score!==undefined ? profile.score : null; 
        }
        else
        {
          if (profile?.score !== null && profile?.replayScore !== null) {
            scores =
              profile.score > profile.replayScore
                ? profile.score
                : profile.replayScore;
          } 
          else{
            if (profile?.score.length > 0) {
              scores = profile?.score 
          }
          } 
        }
        const sums: any = {};
        scores.forEach((score: any) => {
          const quest = score.quest;
          if (!sums[quest]) {
            sums[quest] = 0;
          }
          sums[quest] += score.score;
        });
        const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
          quest,
          score,
        }));
        const getscores = getFinalscores.find(
          (row: any) => row.quest == getgameinfoquest.gameQuestNo,
        );
        const finalscore = getscores?.score;

        if (finalscore < getminpassscore) {
          // setisReplay(true);
          Setprofilescore(finalscore);
          // setisOptionalReplay(false);
          // setCurrentScreenId(8);
          setReplayState('mandatoryReplay');
          setReplayIsOpen(true);
          return false;
        } else {
          if(gameInfo?.gameData?.gameIsShowLeaderboard === 'true')
            {
              setType(next?.blockChoosen);
              setData(next);
              setCurrentScreenId(6);
              return false;
            }
            else if(feedbackList.length !== 0)
              {
                setType(next?.blockChoosen);
                setData(next);
                setCurrentScreenId(6);
                return false;
              }
            else
            {
              if (demoBlocks.hasOwnProperty(nextLevel)) {
                setProfile((prev: any) => {
                  const data = { ...prev };
                  // if (!profile.completedLevels.includes(String(currentQuest))) {
                  //   data.completedLevels = [...data.completedLevels, nextLevel];
                  // }
                  if (!profile.completedLevels.includes(String(nextLevel))) {
                    data.completedLevels = [...data.completedLevels, String(nextLevel)];
                  }
                  return data;
                });
  
                setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                setData(demoBlocks[nextLevel]['1']);
                setCurrentScreenId(6);
                return false;
              } else {
                setCurrentScreenId(6);
                setType(null);
                setData(null);
                return false;
              }
            }
            /*
          if (demoBlocks.hasOwnProperty(nextLevel)) {
            setProfile((prev: any) => {
              const data = { ...prev };
              if (!profile.completedLevels.includes(String(currentQuest))) {
                data.completedLevels = [...data.completedLevels, nextLevel];
              }
              return data;
            });
            setType(demoBlocks[nextLevel]['1']?.blockChoosen);
            setData(demoBlocks[nextLevel]['1']);
            setCurrentScreenId(6);
            return false;
          } else {
            setType(null);
            setData(null);
            setCurrentScreenId(6);
            return false;
          }
          */
        }
      } else {
        if(gameInfo?.gameData?.gameIsShowLeaderboard === 'true')
          {
            setType(next?.blockChoosen);
            setData(next);
            setCurrentScreenId(6);
            return false;
          }
          else if(feedbackList.length !== 0)
            {
              setType(next?.blockChoosen);
              setData(next);
              setCurrentScreenId(6);
              return false;
            }
          else
          {
            if (demoBlocks.hasOwnProperty(nextLevel)) {
              setProfile((prev: any) => {
                const data = { ...prev };
                // if (!profile.completedLevels.includes(String(currentQuest))) {
                //   data.completedLevels = [...data.completedLevels, nextLevel];
                // }
                if (!profile.completedLevels.includes(String(nextLevel))) {
                  data.completedLevels = [...data.completedLevels, String(nextLevel)];
                }

                return data;
              });

              setType(demoBlocks[nextLevel]['1']?.blockChoosen);
              setData(demoBlocks[nextLevel]['1']);
              setCurrentScreenId(6);
              return false;
            } else {
              setCurrentScreenId(6);
              setType(null);
              setData(null);
              return false;
            }
          }
         /*
        if (demoBlocks.hasOwnProperty(nextLevel)) {
          setProfile((prev: any) => {
            const data = { ...prev };
            if (!profile.completedLevels.includes(String(currentQuest))) {
              data.completedLevels = [...data.completedLevels, nextLevel];
            }
            return data;
          });
          setType(demoBlocks[nextLevel]['1']?.blockChoosen);
          setData(demoBlocks[nextLevel]['1']);
          setCurrentScreenId(6);
          return false;
        } else {
          setType(null);
          setData(null);
          setCurrentScreenId(6);
          return false;
        }
        */
      }
    }
    if(currentScreenId === 2)
    {     
            
      const currentDataOfBlocks = Object.values(demoBlocks[next?.blockQuestNo]).filter((item: any)=> item?.blockPrimarySequence === nextBlock[0]?.blockPrimarySequence)                                 

      for (let key in demoBlocks[next?.blockQuestNo]) {
        if (demoBlocks[next?.blockQuestNo].hasOwnProperty(key)) {
          // console.log('///Key:', key, '///Value:', demoBlocks[next?.blockQuestNo][key]);           

          const block = demoBlocks[next?.blockQuestNo][key];
          const isMatchingBlock = currentDataOfBlocks.some(
              (currentBlock) => JSON.stringify(currentBlock) === JSON.stringify(block)
          );
          if (isMatchingBlock) {
              const convertToNum = Number(key)
              const incrementValue = Math.round(convertToNum + 1)
              const aHeadOfData = demoBlocks[next?.blockQuestNo][incrementValue]?.blockChoosen;
              setUpComingBlockChoosen(aHeadOfData);             
          }
        }
      }                 

     

    if (next?.blockShowNavigate) {
      if (next?.blockShowNavigate === 'Repeat Question') {
        const currentBlockinteraction =
          gameInfo?.blocks[currentQuest][currentBlock];
        setInteractionOptions(gameInfo, currentBlockinteraction);
        setType(next?.blockChoosen);
        setData(next);
        setSelectedOption(null);
        return false;
      } else if (next?.blockShowNavigate === 'New Block') {
        setType(nextBlock[0]?.blockChoosen);
        setData(nextBlock[0]);
        // prevTrack.push(nextBlock[0].blockPrimarySequence);
        // setNavTrack(prevTrack)
        setSelectedOption(null);
        return false;
      } else if (next?.blockShowNavigate === 'Replay Point') {
        // setType(demoBlocks['1']['1']?.blockChoosen);
        // setData(demoBlocks['1']['1']);
        setSelectedOption(null);
        setReplayState('replayPointPrompt');
        setReplayIsOpen(true);
        return false;
      } else if (next?.blockShowNavigate === 'Select Block') {
        const selectedNext = Object.keys(demoBlocks[currentQuest])
          .filter((item: any) => {
            return (
              demoBlocks[currentQuest][item]?.blockSecondaryId ===
              parseInt(next?.blockLeadTo)
            );
          })
          .map((item: any) => {
            return demoBlocks[currentQuest][item];
          });
        if (selectedNext.length > 0) {
          setType(selectedNext && selectedNext[0]?.blockChoosen);
          if (selectedNext[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];

            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (
                  option?.qpSequence === selectedNext[0]?.blockPrimarySequence
                ) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (
                  option?.qpSequence === selectedNext[0]?.blockPrimarySequence
                ) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(selectedNext && selectedNext[0]);
        } else {
          setType(nextBlock[0]?.blockChoosen);
          if (nextBlock[0]?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setData(nextBlock[0]);
        }
        setGame3Position((prev: any) => ({
          ...prev,
          nextBlock: selectedNext[0]?.blockPrimarySequence,
        }));
        setSelectedOption(null);
        return false;
      } else if (next?.blockShowNavigate === 'Complete') {
        //check the replay Quest score is higher than score in profile context
        checkAndUpdateScores();

        const Nextcurrentquest = next?.blockQuestNo;
        const getgameinfoquest = gameInfo?.gameQuest.find(
          (row: any) => row.gameQuestNo == Nextcurrentquest,
        );
        //this place no need to check this condition .....
        /* if (getgameinfoquest?.gameIsSetCongratsScoreWiseMessage === 'true') {
           if (demoBlocks.hasOwnProperty(nextLevel)) {
             setProfile((prev: any) => {
               const data = { ...prev };
               if (!profile.completedLevels.includes(currentQuest)) {
                 data.completedLevels = [...data.completedLevels, nextLevel];
               }
               return data;
             });
             setType(demoBlocks[nextLevel]['1']?.blockChoosen);
             setData(demoBlocks[nextLevel]['1']);
             setFeedbackNavigateNext(false);
             setCurrentScreenId(6);
             return false;
           } else {
             setType(null);
             setData(null);
             setCurrentScreenId(6);
             return false;
           }
         } else */
        if (getgameinfoquest?.gameIsSetMinPassScore === 'true') {
          const getminpassscore = getgameinfoquest?.gameMinScore;
          let scores:any = [];
          const questStatus = questState[profile?.currentQuest];
          if (questStatus === 'completed') {
            // If the quest is completed, compare the scores
            if (profile?.score !== null && profile?.replayScore !== null) {
              scores =
                profile.score > profile.replayScore
                  ? profile.score
                  : profile.replayScore;
            } 
          } else if (questStatus === 'Started') {
            // If the quest is started, consider the score
              scores = profile?.score !== null || profile.score!==undefined ? profile.score : null; //null or scores or replayScore
            
          }
          else
          {
            if (profile?.score !== null && profile?.replayScore !== null) {
              scores =
                profile.score > profile.replayScore
                  ? profile.score
                  : profile.replayScore;
      
            } 
            else{
              if (profile?.score.length > 0) {
                scores = profile?.score 
            }
            } 
          }
          const sums: any = {};
          scores.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
            sums[quest] += score.score;
          });

          // const getFinalscores = Object.values(sums);
          const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
            quest,
            score,
          }));
          const getscores = getFinalscores.find(
            (row: any) => row.quest == getgameinfoquest.gameQuestNo,
          );
          const finalscore = getscores?.score;
          if (finalscore < getminpassscore) {
            // setisReplay(true);
            Setprofilescore(finalscore);
            // setisOptionalReplay(false);
            // setCurrentScreenId(8);
            setReplayState('mandatoryReplay');
            setReplayIsOpen(true);
            return false;
          } else {
            if(gameInfo?.gameData?.gameIsShowLeaderboard === 'true')
              {
                setType(next?.blockChoosen);
                setData(next);
                setCurrentScreenId(6);
                return false;
              }
              else if(feedbackList.length !== 0)
                {
                  setType(next?.blockChoosen);
                  setData(next);
                  setCurrentScreenId(6);
                  return false;
                }
              else
              {
                if (demoBlocks.hasOwnProperty(nextLevel)) {
                  setProfile((prev: any) => {
                    const data = { ...prev };
                    // if (!profile.completedLevels.includes(String(currentQuest))) {
                    //   data.completedLevels = [...data.completedLevels, nextLevel];
                    // }
                    if (!profile.completedLevels.includes(String(nextLevel))) {
                      data.completedLevels = [...data.completedLevels, String(nextLevel)];
                    }
                    return data;
                  });
    
                  setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                  setData(demoBlocks[nextLevel]['1']);
                  setFeedbackNavigateNext(false);
                  setCurrentScreenId(6);
                  return false;
                } else {
                  setCurrentScreenId(6);
                  setType(null);
                  setData(null);
                  return false;
                }
              }
              /*
            if (demoBlocks.hasOwnProperty(nextLevel)) {
              setProfile((prev: any) => {
                const data = { ...prev };
                if (!profile.completedLevels.includes(String(currentQuest))) {
                  data.completedLevels = [...data.completedLevels, nextLevel];
                }
                return data;
              });
              setType(demoBlocks[nextLevel]['1']?.blockChoosen);
              setData(demoBlocks[nextLevel]['1']);
              setFeedbackNavigateNext(false);
              setCurrentScreenId(6);
              return false;
            } else {
              setType(null);
              setData(null);
              setCurrentScreenId(6);
              return false;
            }
            */
          }
        } else {
          if(gameInfo?.gameData?.gameIsShowLeaderboard === 'true')
            {
              setMotionEffect(true);
              setTimeout(()=> {              
                setType(next?.blockChoosen);
                setData(next);
                setCurrentScreenId(6);
                return false;
              },300)
            }
            else if(feedbackList.length !== 0)
              {
                setType(next?.blockChoosen);
                setData(next);
                setCurrentScreenId(6);
                return false;
              }
            else
            {
              if (demoBlocks.hasOwnProperty(nextLevel)) {
                setProfile((prev: any) => {
                  const data = { ...prev };
                  // if (!profile.completedLevels.includes(String(currentQuest))) {
                  //   data.completedLevels = [...data.completedLevels, nextLevel];
                  // }
                  if (!profile.completedLevels.includes(String(nextLevel))) {
                    data.completedLevels = [...data.completedLevels, String(nextLevel)];
                  }
                  return data;
                });
  
                setType(demoBlocks[nextLevel]['1']?.blockChoosen);
                setData(demoBlocks[nextLevel]['1']);
                setFeedbackNavigateNext(false);
                setCurrentScreenId(6);
                return false;
              } else {
                setCurrentScreenId(6);
                setType(null);
                setData(null);
                return false;
              }
            }
/*
          if (demoBlocks.hasOwnProperty(nextLevel)) {
            setProfile((prev: any) => {
              const data = { ...prev };
              if (!profile.completedLevels.includes(String(currentQuest))) {
                data.completedLevels = [...data.completedLevels, nextLevel];
              }
              return data;
            });
            setType(demoBlocks[nextLevel]['1']?.blockChoosen);
            setData(demoBlocks[nextLevel]['1']);
            setFeedbackNavigateNext(false);
            setCurrentScreenId(6);
            return false;
          } else {
            setType(null);
            setData(null);
            setCurrentScreenId(6);
            return false;
          }
          */
        }
      } else {
        /** IF a block not has navi option then it leads to next block */
        if (nextBlock && nextBlock[0]?.blockChoosen) {
          setType(nextBlock[0]?.blockChoosen);
          setData(nextBlock[0]);
          setSelectedOption(null);
          return false;
        } else {
          /** else leads to first block of the quest */
          setNavigateBlockEmpty(true);
          setType(demoBlocks[quest]['1']?.blockChoosen);
          setData(demoBlocks[quest]['1']);
          if (demoBlocks[quest]['1']?.blockChoosen === 'Interaction') {
            const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (
                  option?.qpSequence ===
                  demoBlocks[quest]['1']?.blockPrimarySequence
                ) {
                  const profilesetlan = profileData?.Audiogetlanguage.find(
                    (key: any) => key?.textId === option.qpOptionId,
                  );

                  if (profilesetlan) {
                    const languagecont = {
                      ...option,
                      qpOptionText: profilesetlan.content,
                    };
                    optionsFiltered.push(languagecont);
                  } else {
                    optionsFiltered.push(option);
                  }
                }
              } else {
                if (
                  option?.qpSequence ===
                  demoBlocks[quest]['1'].blockPrimarySequence
                ) {
                  optionsFiltered.push(option);
                }
              }
            }
            if (gameInfo?.gameData?.gameShuffle === 'true') {
              for (let i = optionsFiltered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [optionsFiltered[i], optionsFiltered[j]] = [
                  optionsFiltered[j],
                  optionsFiltered[i],
                ];
              }
            }
            setOptions(optionsFiltered);
          }
          setSelectedOption(null);
          return false;
        }
      }
    } else {
      setNavigateBlockEmpty(true);
      setType(demoBlocks[quest]['1']?.blockChoosen);
      setData(demoBlocks[quest]['1']);
      if (demoBlocks[quest]['1']?.blockChoosen === 'Interaction') {
        const optionsFiltered = [];
        for (const option of gameInfo.questOptions) {
          if (profileData?.Audiogetlanguage.length > 0) {
            if (
              option?.qpSequence ===
              demoBlocks[quest]['1']?.blockPrimarySequence
            ) {
              const profilesetlan = profileData?.Audiogetlanguage.find(
                (key: any) => key?.textId === option.qpOptionId,
              );

              if (profilesetlan) {
                const languagecont = {
                  ...option,
                  qpOptionText: profilesetlan.content,
                };
                optionsFiltered.push(languagecont);
              } else {
                optionsFiltered.push(option);
              }
            }
          } else {
            if (
              option?.qpSequence === demoBlocks[quest]['1'].blockPrimarySequence
            ) {
              optionsFiltered.push(option);
            }
          }
        }
        if (gameInfo?.gameData?.gameShuffle === 'true') {
          for (let i = optionsFiltered.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsFiltered[i], optionsFiltered[j]] = [
              optionsFiltered[j],
              optionsFiltered[i],
            ];
          }
        }
        setOptions(optionsFiltered);
      }
      setSelectedOption(null);
      return false;
    }
  }

  };

  const calScore = () => {
    // const currentQuest = data?.blockPrimarySequence.split('.')[0] ?? null;
    const currentQuest = profile?.currentQuest || "1";
    const currentGameData = gameInfo.gameQuest.find(
      (row: any) => row.gameQuestNo == profile?.currentQuest,
    );
    // const nextLevel = currentQuest != null ? String(parseInt(currentQuest) + 1) : null;
    const nextLevel = parseInt(profile?.currentQuest)+1 || null;
    const haveNextQuest = gameInfo.gameQuest.some(
      (row: any) => row.gameQuestNo > profile?.currentQuest,
    );
    let totalScore = 0;
    const ifPlayInProgress = profile?.replayScore?.length > 0 && profile?.replayScore?.some((item:any)=> item.quest === profile?.currentQuest);
    if(ifPlayInProgress){
      totalScore = profile?.replayScore.reduce((acc: any, row: any) => {
          if(row.quest === profile?.currentQuest){
              return acc+ row.score;
          }
          return acc;

        // if (item. && item.score) {
        //   return item.marks.reduce((acc: any, mark: any) => acc + mark, 0);
        // }
      }, 0);
    }
  else{  
    // totalScore = profile?.score.forEach((item: any) => {
    //   if (item && item.marks) {
    //     return item.marks.reduce((acc: any, mark: any) => acc + mark, 0);
    //   }
    // });
    profile?.score.reduce((acc: any, row: any) => {
      if(row.quest === profile?.currentQuest){
          return acc+ row.score;
      }
      return acc;
  }, 0);
  }
    return {
      currentQuest: currentQuest,
      currentGameData: currentGameData,
      nextLevel: nextLevel,
      haveNextQuest: haveNextQuest,
      totalScore: totalScore,
    };
  };

  let menuBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );

  const setInteractionOptions = (gameInfo: any, currentBlock: any) => {
    const optionsFiltered = [];
    for (const option of gameInfo.questOptions) {
      if (profileData?.Audiogetlanguage.length > 0) {
        if (option?.qpSequence === currentBlock?.blockPrimarySequence) {
          const profilesetlan = profileData?.Audiogetlanguage.find(
            (key: any) => key?.textId === option.qpOptionId,
          );

          if (profilesetlan) {
            const languagecont = {
              ...option,
              qpOptionText: profilesetlan.content,
            };
            optionsFiltered.push(languagecont);
          } else {
            optionsFiltered.push(option);
          }
        }
      } else {
        if (option?.qpSequence === currentBlock?.blockPrimarySequence) {
          optionsFiltered.push(option);
        }
      }
    }
    // const optionsFiltered = gameInfo?.questOptions.filter(
    //   (key: any) => key?.qpSequence === currentBlock?.blockPrimarySequence,
    // );
    if (gameInfo?.gameData?.gameShuffle === 'true') {
      for (let i = optionsFiltered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsFiltered[i], optionsFiltered[j]] = [
          optionsFiltered[j],
          optionsFiltered[i],
        ];
      }
      setOptions(optionsFiltered);
    }
  };

  // validate the choosed option
  const handleValidate = (item: any, ind: number) => {
    setCurrentScore(parseInt(item?.qpScore));
    const optionAudioFiltered = profileData?.Audiogetlanguage.filter(
      (key: any) => key?.textId === item?.qpOptionId,
    );
    if (optionAudioFiltered.length > 0) {
      const responseAudioFiltered = optionAudioFiltered.filter(
        (key: any) => key?.fieldName === 'qpResponse',
      );
      const FilteredResponsecontent = responseAudioFiltered[0].content;
      const resMsgLanguage = FilteredResponsecontent;
      setResMsg(resMsgLanguage);
    } else {
      setResMsg(item?.qpResponse);
    }
    setFeed(item?.qpFeedback);
    setNavi(item?.qpNavigateShow);
    setOptionNavigation(item?.qpNextOption);
    setSelectedOption(ind === selectedOption ? null : ind);
    const text = '..Option ' + item.qpOptions + ' -- ' + item.qpOptionText;
    SetgetSelectedOptions({
      options: item.qpOptions,
      optionText: item.qpOptionText,
    });
    setOptionSelectId(item.qpOptionId);
    const voiceId =
      // data?.blockRoll == '999999'
      //   ? voiceIds.NPC :
      profileData?.gender === 'Male'
        ? voiceIds?.playerMale
        : voiceIds?.playerFemale;
    // getAudioForText(text, voiceId);
  };
  useEffect(() => {
    if (voiceRef.current) {
      voiceRef.current.pause();
    }
    const backGroundBgmscreens = [1, 3, 4, 5, 6, 7, 11, 12, 13];
    if (
      ![2, 10, 0].includes(currentScreenId) &&
      backGroundBgmscreens.includes(currentScreenId)
    ) {
      setAudioObj((prev)=>({
        ...prev,
        url: audio,
        type: EnumType.BGM,
        loop: true, // Voice doesn't loop
        autoplay: true,
      }));
      if (backgroundBgmRef.current) {
        try {
          backgroundBgmRef.current.play().catch((error) => {
          }); // Play background BGM
        } catch (error) {
          console.error('Background BGM ref is not available.', error);
        }
      }
      if (voiceRef.current) {
        voiceRef.current.pause(); // Pause voice
      }
    }
    if (currentScreenId === 2) {
      if (backgroundBgmRef.current) {
        backgroundBgmRef.current.pause(); // pause background BGM
      }
      if (voiceRef.current) {
        voiceRef.current.play();
      }
    }

    setFeedBackFromValue();

    const screens = [10,8, 14, 9, 15, 16, 0, 6, 4];
    if (!screens.includes(currentScreenId)) {
        setPreLogDatas((prev: any) => ({
          ...prev,
          screenIdSeq:  [currentScreenId],
        }));
      
    }
  }, [currentScreenId]);

  const setFeedBackFromValue = () => {
    switch (currentScreenId) {
      case 0:
        setReviewTabOptions([1, 5]); //GameInto screen
        break;
      case 1:
        // setReviewTabOptions([1, 3, 5]); //Welcome
        setReviewTabOptions([1, 5]); //Welcome
        break;
      case 2:
        setReviewTabOptions([1, 2, 4]); //Story
        break;
      case 3:
        setReviewTabOptions([1, 5]); //Reflection
        break;
      case 4:
        setReviewTabOptions([1, 5]); //Leaderboard
        break;
      case 5:
        setReviewTabOptions([1, 5]); //ThanksScreen
        break;
      case 6:
        setReviewTabOptions([1, 5]); //Completion
        break;
      case 7:
        setReviewTabOptions([1, 5]); //TakeAway
        break;
      case 9:
        setReviewTabOptions([1, 2, 4]); //Feedback after Each interaction
        break;
      case 14:
        setReviewTabOptions([1, 2, 4]); //Feedback after Completion All together
        break;

      // default:
      //   setReviewTabOptions([1, 2, 3, 4, 5]); //All
    }
  };

  useEffect(() => {
    if (reviewTabOptions) {
      const filterTabOptionsList = tabOptions.filter((tabOption) =>
        reviewTabOptions.includes(tabOption.value),
      );

      setFilteredTabOptions(filterTabOptionsList);
    }
  }, [reviewTabOptions]);

  const subTabOptionsForTabIds: Array<{
    [key: string]: Array<{ value: string; label: string }> | null;
  }> = [
    { '1': null },
    { '2': null },
    {
      '3': [
        { value: 'Title', label: 'Title' },
        { value: 'Skill', label: 'Skill' },
        { value: 'Storyline', label: 'Storyline' },
        { value: 'Outcomes', label: 'Outcomes' },
        { value: 'Category', label: 'Category' },
        { value: 'Author', label: 'Author' },
      ],
    },
    { '4': null },
    {
      '5': [
        { value: '0', label: 'Completion' },
        { value: '1', label: 'Leaderboard' },
        { value: '2', label: 'Reflection' },
        { value: '3', label: 'Takeaway' },
        { value: '4', label: 'Welcome' },
        { value: '5', label: 'Thanks' },
      ],
    },
  ];
  useEffect(() => {
    if (audioRef.current) {
      if (currentScreenId === 2) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setReviewInput((prev: any) => ({
      ...prev,
      review: '',
      tabId: null,
      tabAttribute: '',
      tabAttributeValue: '',
    }));
    isMenuOpen && setIsMenuOpen(false);
  }, [currentScreenId]);
  useEffect(() => {
    if (reviewInput?.tabId) {
      if (reviewInput?.tabId == 5) {
        if (currentScreenId === 6) {
          setReviewInput((prev: Review) => ({
            ...prev,
            tabAttribute: 'screenId',
            tabAttributeValue:
              Tab5attribute.indexOf(Number(currentScreenId)).toString() +
              '@' +
              profile?.currentQuest,
          }));
        } else {
          setReviewInput((prev: Review) => ({
            ...prev,
            tabAttribute: 'screenId',
            tabAttributeValue: Tab5attribute.indexOf(
              Number(currentScreenId),
            ).toString(),
          }));
        }

        setReviewSubTabOptions([]);
      } else if (reviewInput?.tabId == 4) {
        //for Story Tab *******
        if (currentScreenId == 9 || currentScreenId == 14) {
          const blockSeqId =
            currentScreenId == 9
              ? data.blockId
              : FeedBackoptionData[
                  FeedbackcurrentPosition > 0
                    ? FeedbackcurrentPosition - 1
                    : FeedbackcurrentPosition
                ].blockId;
          setReviewInput((prev: Review) => ({
            ...prev,
            tabAttribute: 'blockSeqId',
            tabAttributeValue: blockSeqId,
          }));
        } else {
          const blockSeqId = data.blockId;
          setReviewSubTabOptions([]);
          setReviewInput((prev: Review) => ({
            ...prev,
            tabAttribute: 'blockSeqId',
            tabAttributeValue: blockSeqId,
          }));
        }
      } else {
        const subOptions = subTabOptionsForTabIds.find(
          (item: any) => Object.keys(item)[0] === reviewInput?.tabId.toString(),
        );
        setReviewSubTabOptions(subOptions[reviewInput?.tabId.toString()]);
      }
      /** To hide the sub tab options and set the subtab selection based on the current screen it here */
    }
  }, [reviewInput.tabId]);
  useEffect(() => {
    /**Validate form */
    if (
      reviewInput.reviewGameId &&
      reviewInput.reviewerId &&
      reviewInput.tabId &&
      reviewInput.review
    ) {
      if (reviewInput.tabId === 3 || reviewInput.tabId === 5) {
        if (reviewInput.tabAttribute && reviewInput.tabAttributeValue) {
          setIsFormValid(true);
        } else {
          setIsFormValid(false);
        }
      } else {
        setIsFormValid(true);
      }
    } else {
      setIsFormValid(false);
    }
  }, [reviewInput]);

  const handleClose = () => {
    const element = document.getElementById('container');
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          alert(`${err.message}`);
        });
      }
    }
  };

  //no need for story
  const handleTabSelection = (e: any) => {
    e.preventDefault();
    if (e.target.value) {
      setReviewInput((prev: Review) => ({
        ...prev,
        tabId: e.target.value ?? null,
        tabAttribute: '',
        tabAttributeValue: '',
      }));
      setIsMenuOpen(true);
    } else {
      setReviewInput((prev: Review) => ({
        ...prev,
        tabId: selectedOption?.value ? selectedOption?.value : null,
        tabAttribute: '',
        tabAttributeValue: '',
      }));
      setReviewSubTabOptions([]);
    }
  };

  const handleSubTabSelection = (e: any) => {
    const selectedTabFileds = tabAttributeSets.find(
      (item) => Object.keys(item)[0] === reviewInput?.tabId.toString(),
    );
    setReviewInput((prev: Review) => ({
      ...prev,
      tabAttribute: e.target.value
        ? selectedTabFileds[reviewInput?.tabId.toString()]?.tabAttribute
        : null,
      tabAttributeValue: e.target.value ?? null,
    }));
  };

  const handleMenubtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMenuOpen(true);
  };

  // const toast = useToast();
  const handleReview = (e: any) => {
    setReviewInput((prev: Review) => ({ ...prev, review: e.target.value }));
  };
  const resetInputFields = () => {
    setReviewInput((prev) => ({
      ...prev,
      review: '',
      tabId: null,
      tabAttribute: '',
      tabAttributeValue: '',
    }));
  };
  const hanldeSubmit = async (data: any) => {
    const response = handleSubmitReview(data); //returns true or false
    if (response) {
      setIsMenuOpen(false);
      resetInputFields();
    }
  };
  const hanldeClose = () => {
    setIsFormValid(false);
    resetInputFields();
    setIsMenuOpen(false);
  };
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const startDemo = () => {
    onClose1();
    setCurrentScreenId(10);
  };

  const replayGame = () => {
    setType(gameInfo?.blocks[profile?.currentQuest]['1']?.blockChoosen);
    setData(gameInfo?.blocks[profile?.currentQuest]['1']);
    setCurrentScreenId(2);
  };
  const replayNextHandler = () => {
    const currentQuest = data
      ? parseInt(data?.blockPrimarySequence.split('.')[0])
      : null;
    // const nextLevel = currentQuest != null ?  String(currentQuest + 1) : null;
    const nextLevel = parseInt(profile?.currentQuest)+1 || null;
    if (demoBlocks.hasOwnProperty(nextLevel)) {
      setProfile((prev: any) => {
        const data = { ...prev };
        // if (!profile.completedLevels.includes(String(currentQuest))) {
        //   data.completedLevels = [...data.completedLevels, nextLevel];
        // }
        if (!profile.completedLevels.includes(String(nextLevel))) {
          data.completedLevels = [...data.completedLevels, String(nextLevel)];
        }

        return data;
      });
      setType(demoBlocks[nextLevel]['1']?.blockChoosen);
      setData(demoBlocks[nextLevel]['1']);
      setMotionEffect(true);
      setCurrentScreenId(13);
      return false;
    } else {
      if (
        gameInfo.gameData?.gameIsShowReflectionScreen !== 'false' &&
        gameInfo?.reflectionQuestions.length > 0
      ) {
        setCurrentScreenId(3); //Navigate to Reflection screen
        return false;
      } else if (gameInfo.gameData?.gameIsShowTakeaway !== 'false') {
        setCurrentScreenId(7); //Navigate to Takeaway screen
        return false;
      } else {
        setType(null);
        setData(null);
        setCurrentScreenId(5); //Navigate to Thank you screen
        return false;
      }
    }    
  };

  const handleAudioError = () => {
    console.error(
      'Failed to load video because no supported source was found.',
    );
  };

  useEffect(() => {
    const fetchSupportedLanguages = async () => {
      if (gameInfo?.gameData?.gameId > 0) {
        const resLang = await getGameLanguages(gameInfo?.gameData?.gameId);
        if (resLang?.status === 'Success') {
          if (resLang?.data.length > 0) {
            const data = resLang?.data;
            const ifEnglishExist = data.filter((lang: any)=>lang.value===1 );
            if(ifEnglishExist.length === 0)
              {
                data.unshift({ value: 1, label: 'English' });
              }
            setGameLanguages(data);
            setHasMulitLanguages(true);
          } else {
            setGameLanguages([{ value: 1, label: 'English' }]);
            setProfileData((prev: any) => ({
              ...prev,
              language: 1,
            }));
            setPreLogDatas((prev: any) => ({
              ...prev,
              previewProfile: {
                ...prev.previewProfile,
                language: 1,
              }, 
            }));
            setHasMulitLanguages(true);
          }
        }
      }
    };
    fetchSupportedLanguages();
  }, []);

  const getCurrentResolution = () => {
    const body = document.getElementById('body');
    body.style.width = `${window.innerWidth}px`;
    body.style.height = `${window.innerHeight}px`;

    return body;
  };

  const getCurrScreen = (screenType: any) => {
    // Perform any other actions based on the screen type
    if (screenType == 'Desktop') {
      setResolution(getCurrentResolution());
    } else if (screenType == 'Mobile') {
      // getMobileResolution();
      setResolution({ width: 430, height: 932 });
    } else if (screenType == 'Tablet') {
      setResolution({ width: 768, height: 1024 });
    }
  };

  const dontShowTopMenu = ![3, 4, 5, 6, 7, 10].includes(currentScreenId);

  useEffect(() => {
    if (FeedbackNavigatenext === true) {
      setisScreenshot(false);
      getData(data);
    }
  }, [FeedbackNavigatenext]);

  const getFeedbackData = (data:any) => {
    // TriggerAnimation(()=> {
    setisScreenshot(true);
    const groupedFeedback: { [key: string]: any[] } = {};
    feedbackList.forEach((feedback) => {
      if (!(feedback.Seq in groupedFeedback)) {
        groupedFeedback[feedback.Seq] = [];
      }
      groupedFeedback[feedback.Seq].push(feedback);
    });
    const firstPageFeedback: any[] = [];
    Object.keys(groupedFeedback).forEach((seq) => {
      const lastIndex = groupedFeedback[seq].length - 1;
      firstPageFeedback.push(groupedFeedback[seq][lastIndex]);
    });

    let newRemainingSentences;
    if (FeedbackcurrentPosition < firstPageFeedback.length) {
      newRemainingSentences =
        firstPageFeedback[FeedbackcurrentPosition].feedbackcontent;
      // getOption for FeedBack
      const getgameinfoblockchoosen = gameInfo?.blocks[profile?.currentQuest];
      const getArray = [];
      for (const key in getgameinfoblockchoosen) {
        if (getgameinfoblockchoosen[key].blockChoosen === 'Interaction') {
          getArray.push(getgameinfoblockchoosen[key]);
        }
      }
      setInterActionBlockArray(getArray); //Prabakaran worked. Newly added

      const GetSeqData = getArray.filter((item: any) => {
        return (
          item?.blockPrimarySequence ===
          firstPageFeedback[FeedbackcurrentPosition].Seq
        );
      });
      const optionsFiltered = [];
      for (const option of gameInfo.questOptions) {
        if (profileData?.Audiogetlanguage.length > 0) {
          if (option?.qpSequence === GetSeqData[0]?.blockPrimarySequence) {
            const profilesetlan = profileData?.Audiogetlanguage.find(
              (key: any) => key?.textId === option.qpOptionId,
            );

            if (profilesetlan) {
              const languagecont = {
                ...option,
                qpOptionText: profilesetlan.content,
              };
              optionsFiltered.push(languagecont);
            } else {
              optionsFiltered.push(option);
            }
          }
        } else {
          if (option?.qpSequence === GetSeqData[0]?.blockPrimarySequence) {
            optionsFiltered.push(option);
          }
        }
      }
      if (gameInfo?.gameData?.gameShuffle === 'true') {
        for (let i = optionsFiltered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsFiltered[i], optionsFiltered[j]] = [
            optionsFiltered[j],
            optionsFiltered[i],
          ];
        }
      }

      const SelectedoptionsFiltered = optionsFiltered.filter(
        (key: any) =>
          key?.qpOptions ==
          firstPageFeedback[FeedbackcurrentPosition].Options['options'],
      );
      const selectoptionfeed = SelectedoptionsFiltered[0].qpOptions
        ? SelectedoptionsFiltered[0].qpOptions
        : 'null';
      setOptions(optionsFiltered);
      setFeedBackSelectedoptionData(selectoptionfeed);
      setFeedBackoptionData(GetSeqData);
      setFeedbackCurrentPosition(FeedbackcurrentPosition + 1);
      setFeedbackRemainingSentences(newRemainingSentences);
    } else {
      setFeedbackList([]);
      setFeedbackCurrentPosition(0);
      setFeedbackNavigateNext(true);
    }

  // });
    
  };

  function TriggerAnimation(data: ()=> void) {
    setMotionEffect(true);
    setTimeout(()=> {data()},300)
  }

  const handleHome = () => {
    setCurrentScreenId(1);
    return true;
  };
  useEffect(() => {
    const updatepreviousdatas = async () => {
      const data = {
        previewLogId: getPrevLogDatas.previewLogId,
        playerId: gameInfo?.reviewer?.ReviewerId ?? user?.data?.id,
        playerType: gameInfo?.reviewer?.ReviewerId
          ? 'reviewer'
          : user?.data?.id
          ? 'creator'
          : null,
        previewGameId: gameInfo?.gameId ?? null,
        nevigatedSeq: getPrevLogDatas.nevigatedSeq,
        screenIdSeq: getPrevLogDatas.screenIdSeq,
        lastActiveBlockSeq: getPrevLogDatas.lastActiveBlockSeq,
        selectedOptions: getPrevLogDatas.selectedOptions,
        previewProfile: getPrevLogDatas.previewProfile,
        lastBlockModifiedDate: getPrevLogDatas.lastBlockModifiedDate,
        lastModifiedBlockSeq: getPrevLogDatas.lastModifiedBlockSeq,
        playerInputs: getPrevLogDatas.playerInputs,
        previewScore: getPrevLogDatas.previewScore,
        // audioVolumeValue: JSON.stringify(getPrevLogDatas.audioVolumeValue),
      };

      const previousDataString = JSON.stringify(data);
      const updatePreviewLogsResponse = await updatePreviewlogs(
        previousDataString,
      );
    };
    updatepreviousdatas();
  }, [getPrevLogDatas]);

  //  Newly Added  for prviouse stored
  const SetPreviouseStored = (currentdata: any) => {
    if (currentdata !== null) {
      const currentQuest = currentdata
        ? parseInt(currentdata?.blockPrimarySequence.split('.')[0])
        : null;
        if (currentdata?.blockChoosen === 'Interaction') {
          if (currentQuest === parseInt(profile.currentQuest)) {
            if (getPrevLogDatas.selectedOptions[profile?.currentQuest]) {
              const existingIndex = getPrevLogDatas.selectedOptions[profile?.currentQuest]?.findIndex((item: any) => item.blockId === currentdata.blockId);

              if (existingIndex !== -1) {
                const updatedOptions = [...getPrevLogDatas.selectedOptions[profile?.currentQuest]];
                updatedOptions[existingIndex] = { blockId: currentdata.blockId, optionId: OptionSelectId };
                setPreLogDatas((prev: any) => ({
                  ...prev,
                  selectedOptions: { ...prev.selectedOptions, [profile?.currentQuest]: updatedOptions }
                }));
              }
              else {
                setPreLogDatas((prev: any) => ({
                  ...prev,
                  selectedOptions: { ...prev.selectedOptions, [profile?.currentQuest]: [...prev.selectedOptions[profile?.currentQuest], { blockId: currentdata.blockId, optionId: OptionSelectId }] }
                }));
              }
  
            }
            else {
              setPreLogDatas((prev: any) => ({
                ...prev,
                selectedOptions: { ...prev.selectedOptions, [profile?.currentQuest]: [{ blockId: currentdata.blockId, optionId: OptionSelectId }] }
              }));
  
            }
  
          }
          else {
            setPreLogDatas((prev: any) => ({
              ...prev,
              selectedOptions: { [profile?.currentQuest]: [{ blockId: currentdata.blockId, optionId: OptionSelectId }] }
            }));
          }
        }
    }
  };

  /** replay prompt functions for replay point & previous navigation to chapter selection screen*/
  const handleReplayButtonClick = (replayType: string) => {
    /**replayType become ['mandatoryReplay', 'optionalReplay','replayPointPrompt'] **/

    if(replayType === 'mandatoryReplay'){
      //s***************
      setPreLogDatas((prev: any) => ({
        ...prev,
        selectedOptions: {
          [profile?.currentQuest]: [ ],
        },
      }));
    }
    setType(demoBlocks[profile?.currentQuest]['1']?.blockChoosen);
    setData(demoBlocks[profile?.currentQuest]['1']);
    if (
      demoBlocks[profile?.currentQuest]['1']?.blockChoosen === 'Interaction'
    ) {
      const optionsFiltered = [];
      for (const option of gameInfo.questOptions) {
        if (profileData?.Audiogetlanguage.length > 0) {
          if (
            option?.qpSequence ===
            demoBlocks[profile?.currentQuest]['1']?.blockPrimarySequence
          ) {
            const profilesetlan = profileData?.Audiogetlanguage.find(
              (key: any) => key?.textId === option.qpOptionId,
            );

            if (profilesetlan) {
              const languagecont = {
                ...option,
                qpOptionText: profilesetlan.content,
              };
              optionsFiltered.push(languagecont);
            } else {
              optionsFiltered.push(option);
            }
          }
        } else {
          if (
            option?.qpSequence ===
            demoBlocks[profile?.currentQuest]['1']?.blockPrimarySequence
          ) {
            optionsFiltered.push(option);
          }
        }
      }
      if (gameInfo?.gameData?.gameShuffle === 'true') {
        for (let i = optionsFiltered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsFiltered[i], optionsFiltered[j]] = [
            optionsFiltered[j],
            optionsFiltered[i],
          ];
        }
      }
      setOptions(optionsFiltered);
    }
    setCurrentScreenId(2);
  };

  const QuestBlocklastpaused = async (type : string = null) => {
    const setBlockData = async (lastActivityquest: any, findActiveBlockId: any, SetLastSeqData: any )=>{
      setProfile((prev: any)=> ({...prev, currentQuest: lastActivityquest}))
      setData(SetLastSeqData);
      setType(SetLastSeqData?.blockChoosen);
      if (
        SetLastSeqData.blockChoosen ===
        'Interaction'
      ) {
        const optionsFiltered = [];
        const primarySequence = findActiveBlockId[0];
        const gameInfoquest = gameInfo.questOptions;
        for (const option of gameInfoquest) {
          if (profileData?.Audiogetlanguage.length > 0) {
            if (option?.qpQuestionId === primarySequence) {
              const profilesetlan = profileData?.Audiogetlanguage.find(
                (key: any) => key?.textId === option.qpOptionId,
              );

              if (profilesetlan) {
                const languagecont = {
                  ...option,
                  qpOptionText: profilesetlan.content,
                };
                optionsFiltered.push(languagecont);
              } else {
                optionsFiltered.push(option);
              }
            }
          } else {
            if (option?.qpQuestionId === primarySequence) {
              optionsFiltered.push(option);
            }
          }
        }
        const gameinfodata= gameInfo?.gameData?.gameShuffle;
        if (gameinfodata === 'true') {
          for (let i = optionsFiltered.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsFiltered[i], optionsFiltered[j]] = [
              optionsFiltered[j],
              optionsFiltered[i],
            ]; // Swap elements at indices i and j
          }
        }
        setOptions(optionsFiltered);
      }
      setReplayIsOpen(false);
      setCurrentScreenId(2);
      return false;
      }
    if (getPrevLogDatas.nevigatedSeq && type !== "owner") {
      const LastPreviousActiveBlock = getPrevLogDatas.lastActiveBlockSeq;
      const lastActiveBlock = Object.keys(getPrevLogDatas.lastActiveBlockSeq);
      const lastActivityquest :number = parseInt(lastActiveBlock[0]);
      const findActiveBlockId = LastPreviousActiveBlock[lastActivityquest];
      let SetLastSeqData: any;
      for (const key in gameInfo.blocks[lastActivityquest]) {
        const data = gameInfo.blocks[lastActivityquest][key];
        if (data.blockId === findActiveBlockId[0]) {
          SetLastSeqData = data;
          break;
        }
      }
      const result = await setBlockData(lastActivityquest, findActiveBlockId, SetLastSeqData)
    }
    else if(type === "owner" && creatorDataSlice?.screenId === 2)
      {       
        const lastActivityquest :number = parseInt(creatorDataSlice?.currentQuest);
        const pSeq = `${lastActivityquest}.${creatorDataSlice?.activeBlockSeq}`;
        let SetLastSeqData = {};
        let activeBlock:number[]= [];

      SetLastSeqData = Object.values(gameInfo.blocks[lastActivityquest]).find((item:any)=>{
       if(item.blockPrimarySequence == pSeq && item.blockQuestNo == lastActivityquest){
         activeBlock.push(item?.blockId);
         return true;
        }
        return false;
      });
      const result = await setBlockData(lastActivityquest, activeBlock, SetLastSeqData)
      dispatch(resetGameModifiedState(getPrevLogDatas.previewGameId));
      }
    }
  useEffect(()=>{
    if(creatorDataSlice?.screenId){   
       if(creatorDataSlice?.screenId === 2){ //Story
         QuestBlocklastpaused("owner");
       }
       else if(creatorDataSlice?.screenId===6) //Completion Screen
        {
          const currentQuest = creatorDataSlice?.CompKeyCount ? creatorDataSlice?.CompKeyCount +1 : 1;
          setProfile((prev: any)=>({
            ...prev, currentQuest : currentQuest
          }))
          setCurrentQuestNo(currentQuest)
          setCurrentScreenId(creatorDataSlice?.screenId); 
        }
        else{
          setCurrentScreenId(creatorDataSlice?.screenId);
        }
      }
  },[creatorDataSlice])

  useEffect(()=> {
    setTimeout(()=> {
      setMotionEffect(false);
    },100)
  },[currentScreenId, ModelControl, replayIsOpen])

  return (
    <ProfileContext.Provider value={{profileData, setMotionEffect}}>
      <motion.div initial={{ opacity: 0}} animate={{ opacity: motionEffect ? 0 : 1}}>             
        <TopMenuBar
              dontShowTopMenu={dontShowTopMenu}
              preloadedAssets={preloadedAssets}
              currentScreenId={currentScreenId}
              setCurrentScreenId={setCurrentScreenId}
              isSettingOpen={isSettingOpen}
              setIsSettingOpen={setIsSettingOpen}
              setHomeLeaderBoard={setHomeLeaderBoard}
              profileData={profileData}
              gameInfo={gameInfo}
              demoBlocks={demoBlocks}
              data={data}
              setAudioObj={setAudioObj}
              audioObj={audioObj}
              questState={questState}
              setIsOpenCustomModal={setIsOpenCustomModal}
              EnumType={EnumType}
              getPrevLogDatas={getPrevLogDatas}
              setPreLogDatas={setPreLogDatas}
            /> 
          <Flex
            height="100vh"
            className={
              currentScreenId === 2 || currentScreenId === 15
                ? ''
                : 'EntirePreview'
            }
          >
             {ModelControl === true || NavigateBlockEmpty === true  ||(replayIsOpen && replayState === 'Prompt')? (
              <>
                <ModelPopup
                  ModelControl={ModelControl}
                  setModelControl={setModelControl}
                  backGroundImg={preloadedAssets.backgroundImage}
                  preloadedAssets={preloadedAssets}
                  getPrevLogDatas={getPrevLogDatas}
                  setCurrentScreenId={setCurrentScreenId}
                  setData={setData}
                  setType={setType}
                  gameInfo={gameInfo.blocks}
                  setOptions={setOptions}
                  gameInfoquest={gameInfo.questOptions}
                  gameinfodata={gameInfo.gameData.gameShuffle}
                  isSetStoryScreen={isSetStoryScreen}
                  isStoryScreen={isStoryScreen}
                  setPreLogDatas={setPreLogDatas}
                  NavigateBlockEmpty={NavigateBlockEmpty}
                  setNavigateBlockEmpty={setNavigateBlockEmpty}
                  profileData={profileData}
                  setQuestState={setQuestState}
                  setReplayState={setReplayState}
                  setReplayIsOpen={setReplayIsOpen}
                  replayState={replayState}
                  QuestBlocklastpaused={QuestBlocklastpaused}
                />
              </>
            ) : (
              ''
            )}
            { replayState !== 'Prompt' && replayIsOpen && (
              <ReplayScore
                preloadedAssets={preloadedAssets}
                setReplayIsOpen={setReplayIsOpen}
                handleReplayButtonClick={handleReplayButtonClick}
                replayState={replayState}
                setCurrentScreenId={setCurrentScreenId}
                gameInfo={gameInfo}
                profilescore={profilescore}
                getPrevLogDatas={getPrevLogDatas}
                setData={setData}
                setType={setType}
                gameInfoquest={gameInfo.questOptions}
                gameinfodata={gameInfo.gameData.gameShuffle}
                profileData={profileData} 
                setQuestState={setQuestState} setOptions={setOptions}    
                setPreLogDatas={setPreLogDatas}      
                replayNextHandler ={replayNextHandler}
                data={data}  
                 />
            )}
            {(() => {
              switch (currentScreenId) {
                case 0:
                  return (
                    <>
                      {                        
                        <PlayInfo
                          onOpen={onOpen1}
                          onClose={onClose1}
                          isOpen={true}
                          startDemo={startDemo}
                          setIsGetsPlayAudioConfirmation={
                            setIsGetsPlayAudioConfirmation
                          }
                        />                           
                      }
                    </>
                  );
                case 1:
                  return (
                    <>     
                      {/* <Box className='welcome-black-shadow'> */}
                        <Box
                          w={'100%'}
                          h={'100vh'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          position={'relative'}
                          overflow={'visible'}
                          style={{ perspective: '1000px' }}
                          className="Main-Content"
                        >
                          <Box
                            backgroundImage={preloadedAssets?.StarsBg}
                            w={'100% !important'}
                            h={'100vh'}
                            backgroundRepeat={'no-repeat'}
                            backgroundSize={'cover'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            className="Game-Screen"
                            backgroundColor={'#0d161e'}
                          >
                            <Box className="Images" h={'100vh !important'}>
                              <Welcome
                                intro={audio}
                                currentScreenId={currentScreenId}
                                setCurrentScreenId={setCurrentScreenId}
                                formData={gameInfo?.gameData}
                                imageSrc={preloadedAssets.backgroundImage}
                                screen={preloadedAssets.Screen5}
                                preview={true}
                                preloadedAssets={preloadedAssets}
                                setPreLogDatas={setPreLogDatas}
                                getPrevLogDatas={getPrevLogDatas}
                              />
                              {/* <Testing /> */}
                            </Box>
                          </Box>
                        </Box> 
                    </>
                  );
                case 2:
                  return (
                    <>
                      {/* <motion.div initial={{opacity: 0}} animate={{opacity: isLoading ? 1 : 0}} transition={{duration: 0.6}}><Img src={LoadImg} className='load' /></motion.div> */}
                      {data && type && (
                        <>
                        <Story
                          selectedNpc={gameInfo?.gameNonPlayerUrl}
                          selectedPlayer={selectedPlayer}
                          formData={gameInfo?.gameData}
                          backGroundImg={preloadedAssets.backgroundImage}
                          data={data}
                          type={type}
                          handleValidate={handleValidate}
                          resMsg={resMsg}
                          feed={feed}
                          getData={getData}
                          options={options}
                          option={selectedOption}
                          profileData={profileData}
                          voiceIds={voiceIds}
                          setAudioObj={setAudioObj}
                          setIsGetsPlayAudioConfirmation={
                            setIsGetsPlayAudioConfirmation
                          }
                          setIsPrevNavigation={setIsPrevNavigation}
                          setNavTrack={setNavTrack}
                          navTrack={navTrack}
                          gameInfo={gameInfo}
                          preloadedAssets={preloadedAssets}
                          replayGame={replayGame}
                          replayNextHandler={replayNextHandler}
                          setType={setType}
                          setData={setData}
                          isOptionalReplay={isOptionalReplay}
                          setisOptionalReplay={setisOptionalReplay}
                          setisReplay={setisReplay}
                          profilescore={profilescore}
                          isReplay={isReplay}
                          imageSrc={preloadedAssets.Replay}
                          questState={questState}
                          LastModiPrevData={LastModiPrevData}
                          setPreLogDatas={setPreLogDatas}
                          getPrevLogDatas={getPrevLogDatas}
                          RepeatSelectOption={RepeatSelectOption}
                          RepeatPrevOption={RepeatPrevOption}
                          /**Model Components passed as props*/
                          // SelectedNPCs={SelectedNPCs}
                          Player={Player}
                          // CharacterModal={CharacterModal}
                          ModelPlayer={ModelPlayer}
                          /**Model Components */
                          setScore={setScore}
  SetAudioOptions={SetAudioOptions}
  score={score}
  AudioOptions={AudioOptions}
                          upComingBlockChoosen={upComingBlockChoosen}
                        />
                        </>
                      )}
                    </>
                  );
                case 3:
                  return (
                    <>                    
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box className="Game-Screen">
                          <Box className="Images">
                            <Reflection
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.RefBg}
                              reflectionQuestions={
                                gameInfo?.reflectionQuestions
                              }
                              gameInfo={gameInfo}
                              setCurrentScreenId={setCurrentScreenId}
                              preloadedAssets={preloadedAssets}
                              setPreLogDatas={setPreLogDatas}
                              getPrevLogDatas={getPrevLogDatas}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 4:
                  return (
                    <>                      
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          backgroundImage={preloadedAssets.StarsBg}
                          backgroundColor={'#0d161e'}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images" zIndex={99}>
                            <LeaderBoard
                              homeLeaderBoard={homeLeaderBoard}
                              setHomeLeaderBoard={setHomeLeaderBoard}
                              setCurrentScreenId={setCurrentScreenId}
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.Lead}
                              getData={getData}
                              data={data}
                              gameInfo={gameInfo}
                              preloadedAssets={preloadedAssets}
                              setPlayerTodayScore={setPlayerTodayScore}
                              playerTodayScore={playerTodayScore}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 5:
                  return (
                    <>
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          backgroundImage={preloadedAssets.StarsBg}
                          backgroundColor={'#0d161e'}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <ThankYou
                              setCurrentScreenId={setCurrentScreenId}
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.ThankYou}
                              preloadedAssets={preloadedAssets}
                              getPrevLogDatas={getPrevLogDatas}
                              setPreLogDatas={setPreLogDatas}
                              gameInfo={gameInfo}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 6:
                  return (
                    <>
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          backgroundImage={preloadedAssets.StarsBg}
                          backgroundColor={'#0d161e'}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <Completion
                              questOptions={gameInfo?.questOptions}
                              getData={getData}
                              questState={questState}
                              setQuestState={setQuestState}
                              data={data}
                              setFeedbackNavigateNext={setFeedbackNavigateNext}
                              getFeedbackData={getFeedbackData}
                              gameInfo={gameInfo}
                              setCurrentScreenId={setCurrentScreenId}
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.backgroundImage}
                              screen={preloadedAssets.Screen1}
                              profile={profile}
                              currentQuestNo={currentQuestNo}
                              completionScreenQuestOptions={gameInfo?.gameQuest}
                              preloadedAssets={preloadedAssets}
                              setType={setType}
                              setData={setData}
                              type={type}
                              questWiseMaxTotal={questWiseMaxTotal} /// Pass questWiseMaxTotal as a prop
                              gameInfoTotalScore = {gameInfo?.completionQuestOptions}
                              setProfile={setProfile}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 7:
                  return (
                    <>
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          backgroundImage={preloadedAssets.StarsBg}
                          backgroundColor={'#0d161e'}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <Takeway
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.Screen4}
                              getData={getData}
                              data={data}
                              preloadedAssets={preloadedAssets}
                              gameInfo={gameInfo}
                              setCurrentScreenId={setCurrentScreenId}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 8:
                  return (
                    <>
                      <Box
                        w={'100%'}
                        h={'100vh'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        position={'relative'}
                        overflow={'visible'}
                        style={{ perspective: '1000px' }}
                        className="Main-Content"
                      >
                        <Box
                          backgroundImage={preloadedAssets.backgroundImage}
                          w={'100% !important'}
                          h={'100vh'}
                          backgroundRepeat={'no-repeat'}
                          backgroundSize={'cover'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          className="Game-Screen"
                        >
                          <Box className="Images">
                            <ReplayGame
                              replayGame={replayGame}
                              replayNextHandler={replayNextHandler}
                              type={type}
                              gameInfo={gameInfo}
                              setType={setType}
                              setData={setData}
                              isOptionalReplay={isOptionalReplay}
                              setisOptionalReplay={setisOptionalReplay}
                              setisReplay={setisReplay}
                              profilescore={profilescore}
                              isReplay={isReplay}
                              // setCurrentScreenId={setCurrentScreenId}
                              formData={gameInfo?.gameData}
                              imageSrc={preloadedAssets.Replay}
                              getData={getData}
                              data={data}
                              preloadedAssets={preloadedAssets}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                case 9:
                  return (
                    <FeedBackScreen
                      backgroundScreenUrl={preloadedAssets.backgroundImage}
                      first={first}
                      showNote={showNote}
                      isScreenshot={isScreenshot}
                      FeedbackremainingSentences={FeedbackremainingSentences}
                      options={options}
                      setisScreenshot={setisScreenshot}
                      FeedBackselectedoptionData={FeedBackselectedoptionData}
                      FeedBackoptionData={FeedBackoptionData}
                      getFeedbackData={getFeedbackData}
                      data={data}
                      feed={feed}
                      currentScreenId={currentScreenId}
                      getData={getData}
                      profile={profile}
                      preloadedAssets={preloadedAssets}
                      FeedbackcurrentPosition={FeedbackcurrentPosition}
                      interactionBlockArray={interactionBlockArray}
                    />
                  );
                case 10:
                  return (
                    <GameIntroScreen
                      preloadedAssets={preloadedAssets}
                      setCurrentScreenId={setCurrentScreenId}
                      setIsGetsPlayAudioConfirmation={
                        setIsGetsPlayAudioConfirmation
                      }
                      setPreLogDatas={setPreLogDatas}
                      getPrevLogDatas={getPrevLogDatas}
                      currentScreenId={currentScreenId}
                      setModelControl={setModelControl}
                      ModelControl={ModelControl}
                      gameInfo={gameInfo.gameData}
                      hasMulitLanguages={hasMulitLanguages}
                      setIsOpenCustomModal={setIsOpenCustomModal}
                      setReplayState={setReplayState}
                      setReplayIsOpen={setReplayIsOpen}
                    />
                  );
                case 11:
                  return (
                    <>
                      <ProfileScreen
                        imageSrc={preloadedAssets.backgroundImage}
                        setCurrentScreenId={setCurrentScreenId}
                        profileData={profileData}
                        formData={gameInfo?.gameData}
                        setProfileData={setProfileData}
                        setPreLogDatas={setPreLogDatas}
                        preloadedAssets={preloadedAssets}
                        getPrevLogDatas={getPrevLogDatas}
                      />
                    </>
                  );
                case 12:
                  return (
                    <>
                      <Characterspage
                        profileData={profileData}
                        setProfileData={setProfileData}
                        currentScreenId={currentScreenId}
                        setSelectedPlayer={setSelectedPlayer}
                        players={gameInfo?.gamePlayers}
                        formData={gameInfo?.gameData}
                        imageSrc={preloadedAssets.StarsBg}
                        setCurrentScreenId={setCurrentScreenId}
                        demoBlocks={demoBlocks}
                        preloadedAssets={preloadedAssets}
                        setPreLogDatas={setPreLogDatas}
                        getPrevLogDatas={getPrevLogDatas}
                        ModelPlayer={ModelPlayer}
                      />
                    </>
                  );
                case 13:
                  return (
                    <>
                    {/* <Box className='black-shadow'> */}
                      <ChapterPage
                        setCurrentQuestNo={setCurrentQuestNo}
                        questState={questState}
                        setQuestState={setQuestState}
                        currentQuestNo={currentQuestNo}
                        formData={gameInfo?.gameData}
                        imageSrc={preloadedAssets.backgroundImage}
                        demoBlocks={demoBlocks}
                        questOptions={gameInfo?.questOptions}
                        setCurrentScreenId={setCurrentScreenId}
                        setData={setData}
                        setType={setType}
                        setOptions={setOptions}
                        gameQuest={gameInfo?.gameQuest}
                        setFeedbackList={setFeedbackList}
                        preloadedAssets={preloadedAssets}
                        currentScreenId={currentScreenId}
                        setPreLogDatas={setPreLogDatas}
                        getPrevLogDatas={getPrevLogDatas}
                        profileData={profileData}
                        gameOptionSuffled={gameInfo?.gameData?.gameShuffle}
                        setRepeatPrevOption={setRepeatPrevOption}
                        setSelectedOption={setSelectedOption}
                        questWiseMaxTotal={questWiseMaxTotal}
                        gameInfoTotalScore = {gameInfo?.completionQuestOptions}
                        gameInfo = {gameInfo}
                        setIsLoading = {setIsLoading}
                      />
                    </>
                  );
                case 14:
                  return (
                    <FeedBackScreen
                      backgroundScreenUrl={preloadedAssets.backgroundImage}
                      first={first}
                      showNote={showNote}
                      isScreenshot={isScreenshot}
                      FeedbackremainingSentences={FeedbackremainingSentences}
                      setisScreenshot={setisScreenshot}
                      options={options}
                      FeedBackselectedoptionData={FeedBackselectedoptionData}
                      FeedBackoptionData={FeedBackoptionData}
                      getFeedbackData={getFeedbackData}
                      data={data}
                      currentScreenId={currentScreenId}
                      getData={getData}
                      profile={profile}
                      preloadedAssets={preloadedAssets}
                      profileData={profileData}
                    />
                  );
                case 15:
                  return (
                    <Overview
                      formData={gameInfo?.gameData}
                      imageSrc={preloadedAssets.overview}
                      preloadedAssets={preloadedAssets}
                      homeLeaderBoard={homeLeaderBoard}
                      setCurrentScreenId={setCurrentScreenId}
                      backGroundImg={preloadedAssets.backgroundImage}
                    />
                  );
                  break;

                case 16:
                  return (
                    <ReplayPoints
                      setData={setData}
                      setType={setType}
                      preloadedAssets={preloadedAssets}
                      demoBlocks={demoBlocks}
                      profile={profile}
                      setCurrentScreenId={setCurrentScreenId}
                      setModelScreen={setModelScreen}
                      modelScreen={modelScreen}
                      gameInfo={gameInfo}
                      profileData={profileData}
                      setOptions={setOptions}
                    />
                  );
                  break;

                default:
                  console.log(
                    'game details of the data',
                    gameInfo?.gameData,
                    currentScreenId,
                  );
                  return <h1>Loading Screen .... Default case </h1>;
              }
            })()}
           
          </Flex>
          {/* Anonymous User's Review Form Menu
           * It works when uuid has UUID
           */}
          {isReviewDemo && !skipScreenList?.includes(currentScreenId) && (
            <Menu isOpen={isMenuOpen}>
              <MenuButton
                p="0px"
                bg={'brandScheme'}
                position={'fixed'}
                bottom={'70px'}
                right={'5px'}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleMenubtn(e)
                }
              >
                <Icon
                  as={AiFillMessage}
                  bg={'#3311db'}
                  color={'#fff'}
                  w="60px"
                  h="60px"
                  borderRadius={'50%'}
                  p={'15px'}
                  me="10px"
                />
              </MenuButton>
              {isMenuOpen && (
                <MenuList
                  boxShadow={shadow}
                  p="20px"
                  me={{ base: '30px', md: 'unset' }}
                  borderRadius="20px"
                  bg={menuBg}
                  border="none"
                  mt="10px"
                  minW={{ base: '360px' }}
                  maxW={{ base: '360px', md: 'unset' }}
                >
                  <FormLabel
                    display="flex"
                    ms="10px"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    <Text fontSize="sm" fontWeight="400" ms="2px">
                      {'Feedback Options'}
                      <Text as="span" color="red.500">
                        *
                      </Text>
                    </Text>
                  </FormLabel>
                  <Select
                    mb="10px"
                    me="30px"
                    id="tab"
                    name="tab"
                    onChange={handleTabSelection}
                  >
                    <option value={''}>Select</option>
                    {filteredTabOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Select>
                  {reviewInput?.tabId !== null &&
                    reviewInput?.tabId !== undefined &&
                    reviewSubTabOptions?.length > 0 && (
                      <>
                        <FormLabel
                          display="flex"
                          ms="10px"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          <Text fontSize="sm" fontWeight="400" ms="2px">
                            {'Secondary Options'}
                            <Text as="span" color="red.500">
                              *
                            </Text>
                          </Text>
                        </FormLabel>
                        <Select
                          mb="10px"
                          me="30px"
                          id="subtab"
                          name="subtab"
                          onChange={handleSubTabSelection}
                        >
                          <option value={''}>Select</option>
                          {reviewSubTabOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </Select>
                      </>
                    )}
                  <FormControl>
                    <FormLabel fontSize={'sm'} fontWeight={700} pl="4">
                      Feedback
                    </FormLabel>
                    <Textarea
                      resize="none"
                      w="100%"
                      h="200px"
                      border="1px solid #CBD5E0"
                      borderRadius="20px"
                      p="4"
                      placeholder="Please Share your Thoughts..."
                      onChange={handleReview}
                    />
                    <Text
                      color="#CBD5E0"
                      fontSize={{ base: 'sm', '2xl': 'md' }}
                    >
                      {'Maximum of 250 characters...'}
                    </Text>
                  </FormControl>
                  <MenuItem>
                    <Box
                      w={'100%'}
                      display={'flex'}
                      justifyContent={'flex-start'}
                    >
                      <Button
                        bg="#11047a"
                        _hover={{ bg: '#190793' }}
                        color="#fff"
                        h={'46px'}
                        w={'128px'}
                        mr={'33px'}
                        mt={'7px'}
                        onClick={() => hanldeClose()}
                      >
                        close
                      </Button>
                    </Box>

                    <Box
                      w={'100%'}
                      display={'flex'}
                      justifyContent={'flex-end'}
                    >
                      <Button
                        bg="#11047a"
                        _hover={{ bg: '#190793' }}
                        color="#fff"
                        h={'46px'}
                        w={'128px'}
                        mr={'33px'}
                        mt={'7px'}
                        onClick={() => hanldeSubmit(reviewInput)}
                        isDisabled={!isFormValid}
                      >
                        Submit
                      </Button>
                    </Box>
                  </MenuItem>
                </MenuList>
              )}
            </Menu>
          )}

          {audioObj.type === EnumType.BGM && (
            <audio
              ref={backgroundBgmRef}
              loop={audioObj.loop}
              style={{ display: 'none' }}
            >
              <source src={audioObj.url} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          )}

          {/* Voice */}
          {audioObj.type === EnumType.VOICE && (
            <audio ref={voiceRef} style={{ display: 'none' }}>
              <source src={audioObj.url} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          )}
          {/* Language Transaltion Modal popup */}

          {/* <LanguageSelectionPrompt gameLanguages={gameLanguages} formData={gameInfo?.gameData} preloadedAssets={preloadedAssets} hasMulitLanguages={hasMulitLanguages} setHasMulitLanguages={setHasMulitLanguages} profileData={profileData} setProfileData={setProfileData} setIsOpenCustomModal={setIsOpenCustomModal} isOpenCustomModal={isOpenCustomModal} /> */}
          <PromptScreen
            preloadedAssets={preloadedAssets}
            setIsOpenCustomModal={setIsOpenCustomModal}
            isOpenCustomModal={isOpenCustomModal}
            hasMulitLanguages={hasMulitLanguages}
            setHasMulitLanguages={setHasMulitLanguages}
            profileData={profileData}
            setProfileData={setProfileData}
            gameLanguages={gameLanguages}
            formData={gameInfo?.gameData}
            setPreLogDatas={setPreLogDatas}
            getPrevLogDatas={getPrevLogDatas}
            currentScreenId={currentScreenId}
            isInitialLoadScreenWelcome={isInitialLoadScreenWelcome}
            setIsInitialLoadScreenWelcome={setIsInitialLoadScreenWelcome}
          />
      
      </motion.div>
    </ProfileContext.Provider>
  );
});

export default EntirePreview;
