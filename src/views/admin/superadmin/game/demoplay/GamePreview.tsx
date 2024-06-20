import { Box, Img } from '@chakra-ui/react';

import React, {
  Suspense,
  createContext,
  useEffect,
  useMemo,
  useState,
  lazy,
  useContext,
  useRef
} from 'react';
import { preloadedImages, preloadedGLBFiles } from 'utils/hooks/function';
import { assetImageSrc } from 'utils/hooks/imageSrc';
import { useParams } from 'react-router-dom';
import {
  getGameDemoData,
  getGameCreatorDemoData,
  updatePreviewlogs
} from 'utils/game/gameService';
import LoadImg from "assets/img/games/load.jpg";
import { API_SERVER } from 'config/constant';
import collector from 'assets/img/games/collector.glb';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
/**to sync the changes when a creator is a player, want to view the latest changes on time */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { 
  onFieldContentModified
} from 'store/preview/previewSlice';
import { motion } from 'framer-motion';


// const NoAuth= React.lazy(() => import('./playcards/NoAuth'));
// const EntirePreview = React.lazy(() => import('./EntirePreview'));
import NoAuth from './playcards/NoAuth';
import EntirePreview from './EntirePreview';
// const gameScreens = ['GameIntro', "4": 'Welcome', "2": 'Reflection',"1": "Leaderboard", "" : "5": "ThanksScreen", "0": "Completion","3": "TakeAway"];

// const Tab5attribute = [{'attribute': 0,"currentScreenName": "Completion", "currentScreenId": 6} ];
// const Tab5attribute = [6, 4,3, 7, 1,5 ];

export const ScoreContext = createContext<any>(null);
export type ProfileType = {
  score: any[];
  completedLevels: string[];
  currentQuest: number;
  replayScore: any[];
  playerGrandTotal: {
    questScores: Record<string, any>;
  };
  todayEarnedScore: {
    quest: number;
    score: number;
    earnedDate: string;
  }[];
};

const initialProfileObject: ProfileType = {
  score: [],
  completedLevels: ['1'],
  currentQuest: 1,
  replayScore: [],
  playerGrandTotal: { questScores: {} },
  todayEarnedScore: [{ quest: 1, score: 0, earnedDate: "" }],
};

let creatorDataSlice: {[key: string]: number} = {};
const GamePreview = () => {
  const { uuid } = useParams();
  const { id } = useParams();
  const previewStateData = useSelector((state: RootState) =>
    id && state.preview ? state.preview[id] : null,
  );
  const dispatch = useDispatch();
  // console.log("previewStateData", previewStateData)
  const InitialScreenId = useRef(id ? 10 : 1); //replace 10: game Intro, 1: welcome screen by which screen you want to play
  const [gameInfo, setGameInfo] = useState<any | null>(null);
  const [timeout, setTimer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
    const [profile, setProfile] = useState(initialProfileObject);
  const [currentScore, setCurrentScore] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [contentReady, setContentReady] = useState<boolean>(false);
  const [apiImageSet, setApiImageSet] = useState<any>();
  const [staticAssetImageUrls, setStaticAssetImageUrls] = useState<any>(null);
  const [apiUrlAssetImageUrls, setApiUrlAssetImageUrls] = useState<any>(null); //preloaded Api image urls
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [loadedGLBs, setLoadedGLBs] = useState<any>(null);
  const [previewLogsDataIni, setPreviewLogsDataIni] = useState<any>(null);
  const [preLogDatasIni, setPreLogDatasIni] = useState<any>(null);
  const [initialStateUpdate, setInitialStateUpdate]=useState<boolean>(false);
  const [isAuthFailed, setIsAuthFailed]= useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<any>(false);
  const user: any = JSON.parse(localStorage.getItem('user'));
    //get the stored Preview Log Data, if has otherwise create a new record
  const fetchPreviewLogsData = async () => {
    try {
      if (gameInfo?.gameId) {
        const data = {
          previewGameId: gameInfo?.gameId ?? null,
          playerId: gameInfo?.reviewer?.ReviewerId ?? user?.data?.id,
          playerType: gameInfo?.reviewer?.ReviewerId ? 'reviewer' : user?.data?.id ? 'creator' : null
        };
        if (data?.previewGameId === null && data?.playerId === null && data?.playerType === null) {
          console.error('User data not available.');
          return false;
        }
        const userDataString = JSON.stringify(data);
        const updatePreviewLogsResponse = await updatePreviewlogs(userDataString);
        if(updatePreviewLogsResponse?.status === "Success" || isAuthFailed === false){
        setPreLogDatasIni({
          previewLogId: updatePreviewLogsResponse.data?.previewLogId,
          playerId: updatePreviewLogsResponse.data?.playerId,
          playerType: updatePreviewLogsResponse.data?.playerType,
          previewGameId: updatePreviewLogsResponse.data?.previewGameId,
          nevigatedSeq: updatePreviewLogsResponse.data?.nevigatedSeq ? JSON.parse(updatePreviewLogsResponse.data.nevigatedSeq): [],
          screenIdSeq: updatePreviewLogsResponse.data?.screenIdSeq ? JSON.parse(updatePreviewLogsResponse.data.screenIdSeq) :[],
          lastActiveBlockSeq: updatePreviewLogsResponse.data?.lastActiveBlockSeq ? JSON.parse(updatePreviewLogsResponse.data.lastActiveBlockSeq) :[],
          selectedOptions: updatePreviewLogsResponse.data?.selectedOptions ? JSON.parse(updatePreviewLogsResponse.data.selectedOptions) :[],
          previewProfile: updatePreviewLogsResponse.data?.previewProfile ? JSON.parse(updatePreviewLogsResponse.data.previewProfile) : [],
          lastModifiedBlockSeq: updatePreviewLogsResponse.data?.lastModifiedBlockSeq,
          lastBlockModifiedDate:updatePreviewLogsResponse.data?.lastBlockModifiedDate,
          updatedAt:updatePreviewLogsResponse.data?.updatedAt,
          playerInputs: updatePreviewLogsResponse.data?.playerInputs? JSON.parse(updatePreviewLogsResponse.data.playerInputs) : [],
          audioVolumeValue: updatePreviewLogsResponse.data?.audioVolumeValue ? JSON.parse(updatePreviewLogsResponse.data.audioVolumeValue): {bgVolume: 0.3, voVolume:0.3},
          previewScore: updatePreviewLogsResponse.data?.previewScore ? JSON.parse(updatePreviewLogsResponse.data.previewScore): initialProfileObject,
        });
        return updatePreviewLogsResponse;
      }

      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  };
  useEffect(() => {
    const fetchPreviewLogs = async () => {
      const Reponse = await fetchPreviewLogsData();
      if (Reponse?.status =="Success") {
        setPreviewLogsDataIni(Reponse);
        setInitialStateUpdate(true);
        isAuthFailed && setIsAuthFailed(false);
      }
      else{
        setIsAuthFailed(true);
      }
    }
    fetchPreviewLogs();
  }, [gameInfo]);
  
  useEffect(() => {
    const fetchData = async () => {
      // assetImageSrc['characterGlb'] = CharacterGlb;
      const resolvedResult: any = await preloadedImages(assetImageSrc);
      setStaticAssetImageUrls(resolvedResult);
    };

    const loadComponents = async () => {
      // Load all the lazy-loaded components
      await Promise.all([EntirePreview]);
      setComponentsLoaded(true);
    };
    const loadGlbFiles = async () => {
      try {
        // assetImageSrc['characterGlb'] = CharacterGlb;
        // { assetType: 'characterGlb', src: characterGlb },
        // const preloadedGLBs: any = await preloadedGLBFiles([{ assetType: 'characterGlb', src: CharacterGlb }]);
        const preloadedGLBs: any = await preloadedGLBFiles([{ assetType: 'characterGlb', src: collector }]);
        // Use preloadedGLBs[CharacterGlb] if you need the preloaded GLB data
        setLoadedGLBs((prev:any)=> ({...prev, preloadedGLBs}))
        const loader = new GLTFLoader();
        loader.parse(preloadedGLBs, '', () => {
          // parsedGlbArray = preloadedGLBs
        });
        // setLoadedGLBs(gltf.scene);
      } catch (error) {
        console.error('Error preloading GLB file:', error);
      }
    };

    fetchData();
    loadGlbFiles();
    loadComponents();
  }, []);


  useEffect(() => {
    uuid && fetchGameData();
  }, [uuid]);
  useEffect(() => {
    id && fetchCreatorDemoData();
    handleFullScreen();
  }, [id]);

  const handleFullScreen = () => {
    const element = document.getElementById('root');
    if (element) {
      try {
        if (document.fullscreenEnabled) {
          if (!document.fullscreenElement) {
            element.requestFullscreen().catch((error) => {
              console.log('Error entering fullscreen mode:', error.message);
            });
          } else {
            console.warn('Document is already in fullscreen mode');
          }
        } else {
          console.error('Fullscreen mode is not supported');
          // Handle scenario where fullscreen mode is not supported by the browser
        }
      } catch (error) {
        console.error('Error requesting fullscreen:', error);
      }
    }
  };

  /*** Collect details of a game based on uuid not gameId
   * This API took gameId based on uuid
   */
  const fetchGameData = async () => {
    const gamedata = await getGameDemoData(uuid);

    if (!gamedata?.error && gamedata) {
      updateGameInfo(gamedata);
    }
  };
  const fetchCreatorDemoData = async () => {
    const gamedata = await getGameCreatorDemoData(id);

    if (!gamedata?.error && gamedata) {
      updateCreatorGameInfo(gamedata);
    }
  };
  const updateCreatorGameInfo = async (info: any) => {
    const {
      gameview,
      image,
      lmsblocks,
      lmsquestionsoptions,
      gameQuest,
      ...gameData
    } = info?.result;
    const sortBlockSequence = (blockArray: []) => {
      const transformedArray = blockArray.reduce((result: any, obj: any) => {
        const groupKey = obj?.blockQuestNo.toString();
        const seqKey = obj?.blockPrimarySequence.toString()?.split('.')[1];
        if (!result[groupKey]) {
          result[groupKey] = {};
        }
        result[groupKey][seqKey] = obj;
        return result;
      }, {});
      return transformedArray;
    };
    const completionScreenData = info?.data;
    const completionOptions = completionScreenData && Object.entries(completionScreenData).map((qst: any) => {
      const item = {
        gameTotalScore:qst[1].gameTotalScore,
        gameId: qst[1].gameId,
        questNo: qst[1].gameQuestNo,
        gameIsSetMinPassScore: qst[1].gameIsSetMinPassScore,
        gameIsSetDistinctionScore: qst[1].gameIsSetDistinctionScore,
        gameDistinctionScore: qst[1].gameDistinctionScore,
        gameIsSetSkillWiseScore: qst[1].gameIsSetSkillWiseScore,
        gameIsSetBadge: qst[1].gameIsSetBadge,
        gameBadge: qst[1].gameBadge,
        gameBadgeName: qst[1].gameBadgeName,
        gameIsSetCriteriaForBadge: qst[1].gameIsSetCriteriaForBadge,
        gameAwardBadgeScore: qst[1].gameAwardBadgeScore,
        gameScreenTitle: qst[1].gameScreenTitle,
        gameIsSetCongratsSingleMessage:
          qst[1].gameIsSetCongratsSingleMessage,
        gameIsSetCongratsScoreWiseMessage:
          qst[1].gameIsSetCongratsScoreWiseMessage,
        gameCompletedCongratsMessage: qst[1].gameCompletedCongratsMessage,
        gameMinimumScoreCongratsMessage:
          qst[1].gameMinimumScoreCongratsMessage,
        gameaboveMinimumScoreCongratsMessage:
          qst[1].gameaboveMinimumScoreCongratsMessage,
        gameLessthanDistinctionScoreCongratsMessage:
          qst[1].gameLessthanDistinctionScoreCongratsMessage,
        gameAboveDistinctionScoreCongratsMessage:
          qst[1].gameAboveDistinctionScoreCongratsMessage,      
          gameMinScore: qst[1].gameMinScore,  
      };
      return item;
    });
    setGameInfo({
      gameId: info?.result?.gameId,
      gameData: gameData,
      gameHistory: gameview,
      assets: image,
      blocks: sortBlockSequence(lmsblocks),
      gameQuest: gameQuest, //used for completion screen
      completionQuestOptions: gameQuest,
      questOptions: lmsquestionsoptions,
      reflectionQuestions: info?.resultReflection,
      gamePlayers: info?.assets?.playerCharectorsUrl,
      bgMusic:
        info?.assets?.bgMusicUrl && API_SERVER + '/' + info?.assets?.bgMusicUrl,
      gameNonPlayerUrl:
        info?.assets?.npcUrl && API_SERVER + '/' + info?.assets?.npcUrl,
    });
    const apiImageSetArr: any = [
      { assetType: 'backgroundImage', src: image?.gasAssetImage },
      {
        assetType: 'nonplayerImage',
        src: API_SERVER + '/' + info?.assets?.npcUrl,
      },
    ];
    let playerCharectorsUrls = info?.assets?.playerCharectorsUrl.map(
      (item: any, index: number) => {
        let objValue = API_SERVER + '/' + item;
        let objKey = `playerCharacterImage_${index}`;
        apiImageSetArr.push({ assetType: objKey, src: objValue });
      },
    );
    let gameQuestBadges = await Promise.all(
      info?.assets?.badges.map(
        async (item: Record<string, string>) => {
          Object.entries(item).forEach(([key, value]) => {
            let objkeyValue = key.split('_')[1];
            let objKey = `Quest_${objkeyValue}`;
            let objKeyValue = API_SERVER + '/' + value;
            let badgeUrl =  value.split('.');
            const shadowBadgeUrl = badgeUrl[0]+'-shadow.'+badgeUrl[1];
            apiImageSetArr.push({ assetType: objKey, src: objKeyValue });
            apiImageSetArr.push({ assetType: objKey+'-shadow', src: API_SERVER + '/' +shadowBadgeUrl });
          });
          setApiImageSet(apiImageSetArr);
          return true;
        },
      ),
    );
  };

  /** THis function used to update gameInfo state on initial render and after every submition of a review
   *
   * Should update game info after update, delete, new review submition using this function updateGameInfo
   */
  const updateGameInfo = async (info: any) => {
      const {
      gameReviewerId,
      emailId,
      activeStatus,
      reviews,
      ReviewingCreator,
    } = info?.result?.lmsgamereviewer;
    const {
      gameview,
      image,
      lmsblocks,
      lmsquestionsoptions,
      gameQuest,
      ...gameData
    } = info?.result?.lmsgame;
    const sortBlockSequence = (blockArray: []) => {
      const transformedArray = blockArray.reduce((result: any, obj: any) => {
        const groupKey = obj?.blockQuestNo.toString();
        const seqKey = obj?.blockPrimarySequence.toString()?.split('.')[1];
        if (!result[groupKey]) {
          result[groupKey] = {};
        }
        result[groupKey][seqKey] = obj;
        return result;
      }, {});
      return transformedArray;
    };

    // const completionScreenData = info?.data;
    // const completionOptions = Object.entries(completionScreenData).map((qst: any) => {
    //   const item = {
    //     gameTotalScore:qst[1].gameTotalScore,
    //     gameId: qst[1].gameId,
    //     questNo: qst[1].gameQuestNo,
    //     gameIsSetMinPassScore: qst[1].gameIsSetMinPassScore,
    //     gameIsSetDistinctionScore: qst[1].gameIsSetDistinctionScore,
    //     gameDistinctionScore: qst[1].gameDistinctionScore,
    //     gameIsSetSkillWiseScore: qst[1].gameIsSetSkillWiseScore,
    //     gameIsSetBadge: qst[1].gameIsSetBadge,
    //     gameBadge: qst[1].gameBadge,
    //     gameBadgeName: qst[1].gameBadgeName,
    //     gameIsSetCriteriaForBadge: qst[1].gameIsSetCriteriaForBadge,
    //     gameAwardBadgeScore: qst[1].gameAwardBadgeScore,
    //     gameScreenTitle: qst[1].gameScreenTitle,
    //     gameIsSetCongratsSingleMessage:
    //       qst[1].gameIsSetCongratsSingleMessage,
    //     gameIsSetCongratsScoreWiseMessage:
    //       qst[1].gameIsSetCongratsScoreWiseMessage,
    //     gameCompletedCongratsMessage: qst[1].gameCompletedCongratsMessage,
    //     gameMinimumScoreCongratsMessage:
    //       qst[1].gameMinimumScoreCongratsMessage,
    //     gameaboveMinimumScoreCongratsMessage:
    //       qst[1].gameaboveMinimumScoreCongratsMessage,
    //     gameLessthanDistinctionScoreCongratsMessage:
    //       qst[1].gameLessthanDistinctionScoreCongratsMessage,
    //     gameAboveDistinctionScoreCongratsMessage:
    //       qst[1].gameAboveDistinctionScoreCongratsMessage,        
    //     gameMinScore: qst[1].gameMinScore,  
    //   };
      
    //   return item;
    // });

    setGameInfo({
      gameId: info?.result?.gameId,
      gameData: gameData,
      reviewer: {
        ReviewerId: gameReviewerId,
        ReviewerName:
          ReviewingCreator === null ? null : ReviewingCreator?.ctName,
        ReviewerEmailId: emailId,
        ReviewerGender: ReviewingCreator ? ReviewingCreator?.ctGender : null,
        ReviewerStatus: activeStatus,
        ReviewerDeleteStatus: ReviewingCreator
          ? ReviewingCreator?.ctDeleteStatus
          : null,
      },
      gameQuest: gameQuest, //used for completion screen
      completionQuestOptions: gameQuest,
      reviews: reviews,
      gameHistory: gameview,
      assets: image,
      blocks: sortBlockSequence(lmsblocks),
      questOptions: lmsquestionsoptions,
      reflectionQuestions: info?.resultReflection,
      gamePlayers: info?.assets?.playerCharectorsUrl,
      bgMusic:
        info?.assets?.bgMusicUrl && API_SERVER + '/' + info?.assets?.bgMusicUrl,
      gameNonPlayerUrl:
        info?.assets?.npcUrl && API_SERVER + '/' + info?.assets?.npcUrl,
    });

    const apiImageSetArr: any = [
      { assetType: 'backgroundImage', src: image?.gasAssetImage },
      {
        assetType: 'nonplayerImage',
        src: API_SERVER + '/' + info?.assets?.npcUrl,
      },
    ];
    let playerCharectorsUrls = info?.assets?.playerCharectorsUrl.map(
      (item: any, index: number) => {
        let objValue = API_SERVER + '/' + item;
        let objKey = `playerCharacterImage_${index}`;
        apiImageSetArr.push({ assetType: objKey, src: objValue });
      },
    );
    let gameQuestBadges = await Promise.all(
      info?.assets?.badges.map(
        async (item: Record<string, string>) => {
          Object.entries(item).forEach(([key, value]) => {
            let objkeyValue = key.split('_')[1];
            let objKey = `Quest_${objkeyValue}`;
            let objKeyValue = API_SERVER + '/' + value;
            apiImageSetArr.push({ assetType: objKey, src: objKeyValue });
            let badgeUrl =  value.split('.');
            const shadowBadgeUrl = badgeUrl[0]+'-shadow.'+badgeUrl[1];
            apiImageSetArr.push({ assetType: objKey+'-shadow', src:  API_SERVER + '/' + shadowBadgeUrl });
          });
          setApiImageSet(apiImageSetArr);          
          return true;
        },
      ),
    );
    
  };

  useEffect(() => {
    return () => clearTimeout(timeout); // Cleanup the timer on component unmount
  }, [timeout]);

  useEffect(() => {
    const fetchData = async () => {
      try {
      // const glbAndApiImageSet = {...apiImageSet, glb: CharacterGlb};
      const resolvedResult: any = await preloadedImages(apiImageSet);
      setApiUrlAssetImageUrls(resolvedResult);
    } catch (error) {
      console.error('Error preloading images:', error);
    }
    };
    apiImageSet && fetchData();
  }, [apiImageSet]);

  const preloadedAssets = useMemo(() => {
    return { ...apiUrlAssetImageUrls, ...staticAssetImageUrls, ...loadedGLBs };
  }, [apiUrlAssetImageUrls, staticAssetImageUrls, loadedGLBs]);

  useEffect(() => {
    if (
      gameInfo &&
      Object.keys(preloadedAssets).length > 0 &&
      componentsLoaded === true
    ) {
      setTimeout(()=> {
        setContentReady(true);
      },2000)
    } else {
      setContentReady(false);
    }
  }, [gameInfo, preloadedAssets, componentsLoaded]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);


  const hanldeLastModifiedActivity= async()=>{
    const {
      currentTab = null,
      currentSubTab = null,
      currentQuest = null,
      activeBlockSeq = null,
      CompKeyCount = null
    } = previewStateData || {};
                  
  if(currentTab)
    switch(currentTab){
      case 3: // o/v content modified
              return {screenId: 1}
      case 4: // story content modified
              return {screenId: 2, currentQuest: currentQuest || 1 , activeBlockSeq: activeBlockSeq || 1}
              
      case 5: // design content modified
            switch(currentSubTab){
            case 0: //completion screen
              return {screenId: 6,  CompKeyCount: CompKeyCount || 0}
              
            case 1: //Leaderboard
              return {screenId: 4}
              
            case 2: //Reflection
              return {screenId: 3}
              
            case 3://take away
              return {screenId: 7}
              
            case 4://welcome
              return {screenId: 1}
              
            case 5://thank you
              return {screenId: 5}
              
            }              
              break;

      case 6: // preference content modified
              return {screenId: 10} //load it from the  begining
      default:
        return {screenId: 10} 
    }
  }

  const resetModifiedField = ()=>{
    dispatch(onFieldContentModified({gameId: id, modifiedField: null, updatedValue :null, isModified: false}));
  }

  useEffect(()=>{
   const handleDataFetch = async () => {
      if (id && previewStateData?.isModified) {
        if(previewStateData?.hasOwnProperty("modifiedField") && previewStateData.modifiedField !==null)
          {
            let updatedGameInfo : any = {};
           const{ CompKeyCount,activeBlockSeq,currentQuest,currentSubTab,currentTab,gameId,isDispatched,isModified,modifiedField,onFocusValue,updatedValue} = previewStateData;
          /**Overview Screen */ 
          if(currentTab === 3){
            //show welcome
            updatedGameInfo = {...gameInfo, gameData:{...gameInfo.gameData, [modifiedField]: updatedValue}};
            setGameInfo(updatedGameInfo);
            creatorDataSlice = await hanldeLastModifiedActivity();
            // InitialScreenId.current =1;
          }

          /**Story Tab*/
          if(currentTab === 4){
            await fetchCreatorDemoData();  // Wait for the async function to complete
            creatorDataSlice = await hanldeLastModifiedActivity();
          }

           /** Design Tab */
          if(currentTab === 5)
            {
              /**Completion Screen */ 
            if(currentSubTab === 0){
              const TextFieldsArray= ["gameAwardBadgeScore", "gameDistinctionScore", "gameMinScore"];

              const updatedGameQuest = gameInfo.gameQuest.map((item :any) => {
                if (item.gameQuestNo === (parseInt(CompKeyCount)+1)) {
                  if(!TextFieldsArray.includes(modifiedField))
                    {
                      if(modifiedField === "gameIsSetCongratsScoreWiseMessage" ){
                        if(updatedValue ==='true'){
                          return { ...item, [modifiedField]: updatedValue, gameIsSetCongratsSingleMessage: 'false'}; // Update the value property                     
                        }
                        else{
                          return { ...item, [modifiedField]: updatedValue}; // Update the value property                     
                        }
                      }
                      if(modifiedField === "gameIsSetCongratsSingleMessage" && item.gameIsSetCongratsSingleMessage === 'true'){                        
                        if(updatedValue ==='true'){
                          return { ...item, [modifiedField]: updatedValue, gameIsSetCongratsScoreWiseMessage: 'false'}; // Update the value property                     
                        }
                        else{
                          return { ...item, [modifiedField]: updatedValue}; // Update the value property                     
                        }
                      }
                      return { ...item, [modifiedField]: updatedValue}; // Update the value property
                    }
                  return { ...item, [modifiedField]: parseInt(updatedValue)  }; // Update the value property
                }
                return item; // Return the unchanged item if the condition doesn't match
              });

              const updatedGameCompletionQuest = gameInfo.completionQuestOptions.map((item :any) => {
                if (item.questNo === (parseInt(CompKeyCount)+1)) {
                  if(!TextFieldsArray.includes(modifiedField))
                    {
                      return { ...item, [modifiedField]: updatedValue}; // Update the value property
                      }
                    return { ...item, [modifiedField]: parseInt(updatedValue)  }; // Update the value property
                }
                return item; // Return the unchanged item if the condition doesn't match
              });

              updatedGameInfo = {
                ...gameInfo,
                gameQuest: [...updatedGameQuest],
                completionQuestOptions: [...updatedGameCompletionQuest],
              };
              if(CompKeyCount===0 && updatedGameInfo.gameData.gameQuestNo === (CompKeyCount+1)){
                  if(TextFieldsArray.includes(modifiedField))
                    {
                      updatedGameInfo = {
                        ...updatedGameInfo,
                        gameData : {...gameInfo.gameData, [modifiedField]: updatedValue} // Update the value property
                      }
                    }
                    else{
                      updatedGameInfo = {
                        ...updatedGameInfo,
                        gameData : {...gameInfo.gameData, [modifiedField]: parseInt(updatedValue)} // Update the value property
                        }
                        }
              }
              const currentQuestNo =  parseInt(CompKeyCount)+1;
              setPreLogDatasIni((prev: any) =>({...prev, previewScore:{...prev.previewScore, currentQuest :currentQuestNo}}));
              setProfile((prev: any)=>({...prev, currentQuest: currentQuestNo}));
              setGameInfo(updatedGameInfo);
              creatorDataSlice = await hanldeLastModifiedActivity();
            }
            if(currentSubTab === 1){
              //show leaderboard gameIsShowLeaderboard
              updatedGameInfo = {...gameInfo, gameData:{...gameInfo.gameData, [modifiedField]: updatedValue}};
              setGameInfo(updatedGameInfo);
              creatorDataSlice = await hanldeLastModifiedActivity();
            }
            if(currentSubTab === 2){
              //show Reflection            
              if(modifiedField !== 'gameReflectionQuestion' && modifiedField !=="gameIsShowReflectionScreen" && modifiedField !== 'gameIsLearnerMandatoryQuestion')
                {
                  updatedGameInfo = {
                    ...gameInfo,
                  reflectionQuestions: gameInfo?.reflectionQuestions.map((item :any) => {
                  if (item.refKey === modifiedField) {
                        return { ...item, refQuestion: updatedValue}; // Update the value property
                      }
                    return item;
                  })
                }
              setGameInfo(updatedGameInfo);
              }
              else if(modifiedField ==="gameReflectionQuestion") {
                await fetchCreatorDemoData();
              }
              else{
                console.log("$$$$$$$$$$gameIsLearnerMandatoryQuestion", modifiedField)
                updatedGameInfo = {...gameInfo, gameData:{...gameInfo.gameData, [modifiedField]: updatedValue }};
                setGameInfo(updatedGameInfo);
              }
              creatorDataSlice = await hanldeLastModifiedActivity();
              
            }
            if(currentSubTab === 3){
              //show Takeaway

              if(modifiedField ==="gameIsShowTakeaway"){
                updatedGameInfo = {...gameInfo, gameData:{...gameInfo.gameData, [modifiedField]: updatedValue, gameTakeawayContent: ''}};
              }
              else{
                updatedGameInfo = {...gameInfo, gameData:{...gameInfo.gameData, [modifiedField]: updatedValue}};
              }

              // resetModifiedField();
              setGameInfo(updatedGameInfo);
              creatorDataSlice = await hanldeLastModifiedActivity();
            }
            if(currentSubTab === 4){
              if(modifiedField === "gameIsShowAdditionalWelcomeNote"){
                updatedGameInfo = {...gameInfo, gameData:{...gameInfo?.gameData, [modifiedField]: updatedValue, gameAdditionalWelcomeNote: ''}};
                setGameInfo(updatedGameInfo);
              }
              else{

                //show welcome
              updatedGameInfo = {...gameInfo, gameData:{...gameInfo?.gameData, [modifiedField]: updatedValue}};
            setGameInfo(updatedGameInfo);
            }
              creatorDataSlice = await hanldeLastModifiedActivity();
            }
            if(currentSubTab === 5){
              //show Thank you
              updatedGameInfo = {...gameInfo, gameData:{...gameInfo?.gameData, [modifiedField]: updatedValue || ''}};
              setGameInfo(updatedGameInfo);
              creatorDataSlice = await hanldeLastModifiedActivity();
            }
          }
          /**Preference Screen */ 
          if(currentTab === 6)
          {
            if(currentSubTab === 0)
            {
              if(Array.isArray(modifiedField))
                {
                  let index = 0;
                  for(let value of modifiedField){  
                    console.log("****$$$$Value", value);
                    updatedGameInfo = {...gameInfo, gameData:{...gameInfo.gameData, [value]: updatedValue[index++]}};
                    console.log("****$$$$index", index);
                    }
                  console.log("****$$$$updatedGameInfo", updatedGameInfo);
                setGameInfo(updatedGameInfo);
                creatorDataSlice = await hanldeLastModifiedActivity();
              }
              else{
                console.log("****$$$$ modifiedField", modifiedField)
                console.log("****$$$$ updatedValue", updatedValue)
                  updatedGameInfo = {...gameInfo, gameData:{...gameInfo.gameData, [modifiedField]: updatedValue}};
                  setGameInfo(updatedGameInfo);
                  creatorDataSlice = await hanldeLastModifiedActivity();
              }
            }
            else{
              await fetchCreatorDemoData();  // Wait for the async function to complete
              creatorDataSlice = await hanldeLastModifiedActivity();
            }
          }
          return;
          }
        else{
          const{ CompKeyCount,activeBlockSeq,currentQuest,currentSubTab,currentTab,gameId,isDispatched,isModified,modifiedField,onFocusValue,updatedValue} = previewStateData;
          if(currentTab === 3){
            console.log("^^^^^Tab 3 Else ");
            creatorDataSlice = await hanldeLastModifiedActivity();
            //navigate to welcome screen. it can fetch the latest skill by itself
          }
          else{
            console.log("$$$Not hasModified Field")
            await fetchCreatorDemoData();  // Wait for the async function to complete
            creatorDataSlice = await hanldeLastModifiedActivity();
          }
          }
      }
    };
    if(gameInfo){
      handleDataFetch();
    }
  },[previewStateData])

  return (
    <>
      {/* <Suspense fallback={
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
            </Box>
        }>
        {contentReady && (isAuthFailed || */}
      {/* <Suspense fallback={<Img src={preloadedAssets.InitialImg} width={'100vw'} h={'100vh'}/>}> */}
      
        {contentReady ?  (isAuthFailed ||
          gameInfo?.reviewer?.ReviewerStatus === 'Inactive' ||
            gameInfo?.reviewer?.ReviewerDeleteStatus === 'YES'  ? (
              <NoAuth isAuthFailed={isAuthFailed}/>
          ) : (
            gameInfo?.gameId &&
            (
              (
                <ScoreContext.Provider value={{ profile, setProfile }}>
                  <Box id="container" >
                    <Box
                          // backgroundImage={preloadedAssets?.StarsBg}
                          // w={'100% !important'}
                          // h={'100vh'}
                          // backgroundRepeat={'no-repeat'}
                          // backgroundSize={'cover'}
                          // alignItems={'center'}
                          // justifyContent={'center'}
                          // className="Game-Screen"
                          // backgroundColor={'#0d161e'}
                        >
                          <Box id="EntirePreview-wrapper">
                      <Box className="EntirePreview-content">
                        <Box id="container" className="Play-station">
                     
                    <EntirePreview
                      currentScore={currentScore}
                      setCurrentScore={setCurrentScore}
                      gameInfo={gameInfo}
                      isReviewDemo={id ? false : true}
                      preloadedAssets={preloadedAssets}
                      InitialScreenId={InitialScreenId.current}
                      fetchGameData={fetchGameData}
                      fetchPreviewLogsData={fetchPreviewLogsData}
                      previewLogsDataIni={previewLogsDataIni}
                      preLogDatasIni={preLogDatasIni}
                      initialStateUpdate={initialStateUpdate}
                      setInitialStateUpdate={setInitialStateUpdate}
                      creatorDataSlice={creatorDataSlice}
                    />
                      </Box>
                      </Box>
                    </Box>
                  </Box>
                  </Box>
                </ScoreContext.Provider>
              ))
          )
        ) : <InitialLoader />
        }
      
    </>
  );
};

export default GamePreview;


function InitialLoader() {
  return (
    <>
      <Box className='Entire-Loader'>
        <motion.div className='Entire-Loader-wrapper' initial={{opacity: 0}} animate={{opacity: 1 }} transition={{duration: 1}}>
          <Img src={LoadImg} className='load' />
        </motion.div>
      </Box>
    </>
  )
}
