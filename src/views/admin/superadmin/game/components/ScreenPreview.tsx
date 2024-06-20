// // Chakra Imports
// import {
//   Box,
//   Flex,
//   Text,
//   Img,
//   Grid,
//   GridItem,
//   Button,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalOverlay,
//   ModalCloseButton,
// } from '@chakra-ui/react';
// import React, {
//   Suspense,
//   useEffect,
//   useState,
//   useRef,
//   useMemo,
//   useCallback,
// } from 'react';
// import {
//   getGameCreatorDemoData,
//   getPreviewLogsData,
// } from 'utils/game/gameService';
// import TypingEffect from '../demoplay/playcards/Typing';
// import {
//   API_SERVER,
//   Notelength,
//   Dialoglength,
//   Responselength,
// } from 'config/constant';
// import { lazy } from 'react';
// import { motion } from 'framer-motion';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from 'store/reducers';
// import { preloadedImages } from 'utils/hooks/function';
// import { assetImageSrc } from 'utils/hooks/imageSrc';
// import {
//   updatePreviewData,
//   removeGame,
//   resetGameDispatchState,
// } from 'store/preview/previewSlice';
// import { useParams } from 'react-router-dom';
// import { HashLoader } from 'react-spinners';
// import { isError } from 'lodash';
// const TakeAwaysContentScreen = lazy(() => import('./onimage/TakeAwaysScreen'));
// const ReflectionContentScreen = lazy(
//   () => import('./onimage/ReflectionScreen'),
// );
// const TyContentScreen = lazy(() => import('./onimage/TyContentScreen'));
// const LeaderBoard = lazy(() => import('../demoplay/playcards/Leaderboard'));
// const ScreenPreviewErrorPrompt = lazy(
//   () => import('./ScreenPreviewErrorPrompt'),
// );
// const WelcomeContentScreen = lazy(
//   () => import('./onimage/WelcomeContentScreen'),
// );
// const CompletionContentScreen = lazy(
//   () => import('./onimage/CompletionContentScreen'),
// );
// const PreviewEndOfStory = lazy(() => import('./onimage/PreviewEndOfStory'));

// const ScreenPreview = () => {
//   const { id } = useParams();
//   const previewStateData = useSelector((state: RootState) =>
//     state.preview !== null ? state.preview[parseInt(id)] : null,
//   );
//   const dispatch = useDispatch();
//   const [gameInfo, setGameInfo] = useState<any>(null);
//   const [contentReady, setContentReady] = useState<boolean>(false);
//   const [apiImageSet, setApiImageSet] = useState<any>();
//   const [staticAssetImageUrls, setStaticAssetImageUrls] = useState<any>(null);
//   const [apiUrlAssetImageUrls, setApiUrlAssetImageUrls] = useState<any>(null); //preloaded Api image urls
//   // const [preloadedAssets, setPreloadedAssets] = useState<any>();
//   const [demoBlocks, setDemoBlocks] = useState(null);
//   const [navi, setNavi] = useState<string>('');
//   const [options, setOptions] = useState([]);
//   const [blink, setBlink] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [optionNavigation, setOptionNavigation] = useState(null);
//   const [showNote, setShowNote] = useState(false),
//     [first, setFirst] = useState(false);
//   const [data, setData] = useState(null);
//   const [type, setType] = useState<string>('');
//   const [resMsg, setResMsg] = useState<string>('');
//   const [feed, setFeed] = useState<string>('');
//   const [endOfQuest, setEndOfQuest] = useState<boolean>(false);
//   const [showTypingEffect, setShowTypingEffect] = useState<any>(false);
//   const [Navigatenext, setNavigateNext] = useState<any>(false);
//   const reflectionQuestionsdefault = [
//     'What were your biggest learnings?',
//     'How can you apply these learnings back at work?',
//     "'What's one thing you learned about your mindset?",
//     "What's one thing you are committing to change?",
//   ];
//   const [reflectionQuestions, setReflectionQuestions] = useState({
//     ref1: 'What were your biggest learnings?',
//     ref2: 'How can you apply these learnings back at work?',
//     ref3: "What's one thing you learned about your mindset?",
//     ref4: "What's one thing you are committing to change?",
//   });
//   const [navTrack, setNavTrack] = useState([]);
//   const [isPrevNavigation, setIsPrevNavigation] = useState(false);
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [RefelectionAnswer, setRefelectionAnswer] = useState<any>([]);
//   const [ThankyouFeedback, setThankyouFeedback] = useState<any>(null);
//   const [errMessage, setErrMessage] = useState<string>(null);
//   const [showPromptScreen, setShowPromptScreen] = useState<boolean>(false);
//   const user: any = JSON.parse(localStorage.getItem('user'));
//   const [componentsLoaded, setComponentsLoaded] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       const resolvedResult: any = await preloadedImages(assetImageSrc);
//       setStaticAssetImageUrls(resolvedResult);
//     };
//     fetchData();
//     loadComponents();

//     return () => {
//       dispatch(removeGame(parseInt(id)));
//     };
//   }, []);

//   useEffect(() => {
//     if (
//       gameInfo &&
//       previewStateData?.currentQuest &&
//       previewStateData?.activeBlockSeq
//     ) {
//       setDemoBlocks(gameInfo?.blocks);
//       const currentBlock =
//         gameInfo?.blocks[previewStateData?.currentQuest][
//         previewStateData?.activeBlockSeq
//         ];
//       setType(currentBlock?.blockChoosen);
//       if (currentBlock?.blockChoosen === 'Interaction') {
//         setInteractionOptions(gameInfo, currentBlock);
//       }
//       setData(currentBlock);
//     }
//   }, [gameInfo, previewStateData]);

//   /**** Handling Content Update logic */
//   useEffect(() => {
//     if (
//       previewStateData &&
//       previewStateData?.gameId &&
//       previewStateData?.isDispatched === true
//     ) {
//       fetchDataFromApi(previewStateData?.gameId);
//       dispatch(resetGameDispatchState(previewStateData?.gameId));
//     }
//   }, [previewStateData]);

//   /*Handling Content Update logic ******/

//   /****Functions ******/

//   const resetDefaultValues = () => {
//     setData(null);
//     setType(null);
//   };

//   const fetchDataFromApi = async (gameid: any = null) => {
//     try {
//       if (gameid) {
//         const gamedata = await getGameCreatorDemoData(gameid);
//         if (!gamedata?.error && gamedata) {
//           setIsLoading(true);
//           const {
//             gameview,
//             image,
//             lmsblocks,
//             lmsquestionsoptions,
//             gameQuest,
//             ...gameData
//           } = gamedata?.result;
//           const completionScreenData = gamedata?.data;
//           const sortBlockSequence = (blockArray: []) => {
//             const transformedArray = blockArray.reduce(
//               (result: any, obj: any) => {
//                 const groupKey = obj?.blockQuestNo.toString();
//                 const seqKey = obj?.blockPrimarySequence
//                   .toString()
//                   ?.split('.')[1];
//                 if (!result[groupKey]) {
//                   result[groupKey] = {};
//                 }
//                 result[groupKey][seqKey] = obj;
//                 return result;
//               },
//               {},
//             );
//             return transformedArray;
//           };

//           const completionOptions = Object.entries(completionScreenData).map(
//             (qst: any, i: number) => {
//               const item = {
//                 gameTotalScore: qst[1].gameTotalScore,
//                 gameId: qst[1].gameId,
//                 questNo: qst[1].gameQuestNo,
//                 gameMinScore: qst[1].gameMinScore,
//                 gameIsSetMinPassScore: qst[1].gameIsSetMinPassScore,
//                 gameIsSetDistinctionScore: qst[1].gameIsSetDistinctionScore,
//                 gameDistinctionScore: qst[1].gameDistinctionScore,
//                 gameIsSetSkillWiseScore: qst[1].gameIsSetSkillWiseScore,
//                 gameIsSetBadge: qst[1].gameIsSetBadge,
//                 gameBadge: qst[1].gameBadge,
//                 gameBadgeName: qst[1].gameBadgeName,
//                 gameIsSetCriteriaForBadge: qst[1].gameIsSetCriteriaForBadge,
//                 gameAwardBadgeScore: qst[1].gameAwardBadgeScore,
//                 gameScreenTitle: qst[1].gameScreenTitle,
//                 gameIsSetCongratsSingleMessage:
//                   qst[1].gameIsSetCongratsSingleMessage,
//                 gameIsSetCongratsScoreWiseMessage:
//                   qst[1].gameIsSetCongratsScoreWiseMessage,
//                 gameCompletedCongratsMessage:
//                   qst[1].gameCompletedCongratsMessage,
//                 gameMinimumScoreCongratsMessage:
//                   qst[1].gameMinimumScoreCongratsMessage,
//                 gameaboveMinimumScoreCongratsMessage:
//                   qst[1].gameaboveMinimumScoreCongratsMessage,
//                 gameLessthanDistinctionScoreCongratsMessage:
//                   qst[1].gameLessthanDistinctionScoreCongratsMessage,
//                 gameAboveDistinctionScoreCongratsMessage:
//                   qst[1].gameAboveDistinctionScoreCongratsMessage,
//               };
//               return item;
//             },
//           );

//           let reflectionData: any = [];
//           for (let i = 0; i < gamedata?.resultReflection?.length; i++) {
//             let filteredValue = gamedata?.resultReflection.find(
//               (refRow: any) => refRow?.refKey == `ref${i + 1}`,
//             );
//             reflectionData[filteredValue?.refKey] = filteredValue?.refQuestion;
//           }
//           setGameInfo({
//             gameId: gameid,
//             gameData: gameData,
//             gameHistory: gameview,
//             assets: image,
//             blocks: sortBlockSequence(lmsblocks),
//             gameQuest: gameQuest, //used for completion screen
//             completionQuestOptions: completionOptions,
//             questOptions: lmsquestionsoptions,
//             reflectionQuestions:
//               gamedata?.resultReflection.length > 0
//                 ? reflectionData
//                 : reflectionQuestions,
//             gamePlayers: gamedata?.assets?.playerCharectorsUrl,
//             bgMusic:
//               gamedata?.assets?.bgMusicUrl &&
//               API_SERVER + '/' + gamedata?.assets?.bgMusicUrl,
//             gameNonPlayerUrl:
//               gamedata?.assets?.npcUrl &&
//               API_SERVER + '/' + gamedata?.assets?.npcUrl,
//             badges: await gamedata?.assets?.badges?.map(
//               (path: string) => API_SERVER + '/' + path,
//             ),
//           });

//           const apiImageSetArr: any = [
//             { assetType: 'backgroundImage', src: image?.gasAssetImage },
//             {
//               assetType: 'nonplayerImage',
//               src: API_SERVER + '/' + gamedata?.assets?.npcUrl,
//             },
//           ];

//           let playerCharectorsUrls = gamedata?.assets?.playerCharectorsUrl.map(
//             (item: any, index: number) => {
//               let objValue = API_SERVER + '/' + item;
//               let objKey = `playerCharacterImage_${index}`;
//               apiImageSetArr.push({ assetType: objKey, src: objValue });
//             },
//           );
//           let gameQuestBadges = await Promise.all(
//             gamedata?.assets?.badges.map(
//               async (item: Record<string, string>) => {
//                 Object.entries(item).forEach(([key, value]) => {
//                   let objkeyValue = key.split('_')[1];
//                   let objKey = `Quest_${objkeyValue}`;
//                   let objKeyValue = API_SERVER + '/' + value;
//                   apiImageSetArr.push({ assetType: objKey, src: objKeyValue });
//                 });
//                 setApiImageSet(apiImageSetArr);
//                 return true;
//               },
//             ),
//           );
//         } else {
//           resetDefaultValues();
//           setErrMessage('Insufficient Preview Data Available');
//           setShowPromptScreen(true);
//         }
//       } else {
//         setErrMessage('Insufficient Preview Data Available');
//         setShowPromptScreen(true);
//       }
//     } catch (error) {
//       setErrMessage('Insufficient Preview Data Available');
//       setShowPromptScreen(true);
//       console.error('Error fetching data:', error);
//     }
//   };
//   const replayQuest = () => {
//     dispatch(updatePreviewData({ activeBlockSeq: 1, isDispatched: true ,gameId:parseInt(id)}));
//     setEndOfQuest(false);
//   };
//   const loadComponents = async () => {
//     // Load all the lazy-loaded components
//     await Promise.all([
//       PreviewEndOfStory,
//       CompletionContentScreen,
//       WelcomeContentScreen,
//       ScreenPreviewErrorPrompt,
//       TakeAwaysContentScreen,
//       ReflectionContentScreen,
//       TyContentScreen,
//       LeaderBoard,
//     ]);
//     setComponentsLoaded(true);
//   };

//   const setInteractionOptions = (gameInfo: any, currentBlock: any) => {
//     const optionsFiltered = gameInfo?.questOptions.filter(
//       (key: any) => key?.qpSequence === currentBlock?.blockPrimarySequence,
//     );

//     if (gameInfo?.gameData?.gameShuffle === 'true') {
//       for (let i = optionsFiltered.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [optionsFiltered[i], optionsFiltered[j]] = [
//           optionsFiltered[j],
//           optionsFiltered[i],
//         ];
//       }
//     }

//     setOptions(optionsFiltered);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const resolvedResult: any = await preloadedImages(apiImageSet);
//       setApiUrlAssetImageUrls(resolvedResult);
//     };
//     apiImageSet && fetchData();
//   }, [apiImageSet]);

//   const preloadedAssets = useMemo(() => {
//     return { ...apiUrlAssetImageUrls, ...staticAssetImageUrls };
//   }, [apiUrlAssetImageUrls, staticAssetImageUrls]);

//   const getSelectedPlayer = useCallback(() => {
//     let count = 0;
//     const prefix = 'playerCharacterImage_';
//     // Check if any key in the object starts with the given prefix
//     Object.keys(preloadedAssets).forEach((key) => {
//       if (key.startsWith(prefix)) {
//         count++;
//       }
//     });
//     // If count is 0, return null or handle the case appropriately
//     if (count === 0) {
//       return null;
//     }
//     const randomIndex = Math.floor(Math.random() * count) + 1;
//     const selectedPlayerKey = `${prefix}${randomIndex}`;
//     setSelectedPlayer(preloadedAssets.selectedPlayerKey);
//     // return preloadedAssets.selectedPlayerKey;
//   }, [preloadedAssets]);

//   const prevData = (current: any) => {
//     const quest = current ? current?.blockPrimarySequence.split('.')[0] : null;
//     const currentBlock = current
//       ? parseInt(current?.blockPrimarySequence.split('.')[1])
//       : null;
//     navTrack.pop(); //clears last index sequence
//     if (navTrack.length > 0) {
//       const newTrackSequence = navTrack[navTrack.length - 1];
//       const prevBlock = current
//         ? Object.keys(demoBlocks[quest] || {})
//           .filter(
//             (key) =>
//               demoBlocks[quest]?.[key]?.blockPrimarySequence ==
//               newTrackSequence,
//           )
//           .map((key: any) => demoBlocks[quest]?.[key])
//         : [];
//       if (
//         prevBlock.length !== 0 &&
//         prevBlock[0]?.blockChoosen !== 'Interaction'
//       ) {
//         /*** Handle the previous track */
//         const removedElement = navTrack.pop();
//         setNavTrack(navTrack);
//         /*** End of Handle the previous track */

//         setType(prevBlock[0]?.blockChoosen);
//         setData(prevBlock[0]);
//         setIsPrevNavigation(true);
//         return false;
//       }
//     } else {
//       return false;
//     }
//   };

//   const getData = (next: any) => {
//     setIsPrevNavigation(false);

//     //get the next block details
//     const quest = next ? next?.blockPrimarySequence.split('.')[0] : null;
//     const currentBlock = next
//       ? parseInt(next?.blockPrimarySequence.split('.')[1])
//       : null;
//     const NextItem = currentBlock != null ? currentBlock + 1 : null;

//     const nextSeq = next
//       ? `${next?.blockPrimarySequence.split('.')[0]}.${NextItem}`
//       : '';
//     const prevTrack = navTrack;

//     const currentQuest = next
//       ? parseInt(next?.blockPrimarySequence.split('.')[0])
//       : null;

//     const nextLevel = currentQuest != null ? String(currentQuest + 1) : null;
//     const nextBlock = next
//       ? Object.keys(demoBlocks[quest] || {})
//         .filter(
//           (key) => demoBlocks[quest]?.[key]?.blockPrimarySequence === nextSeq,
//         )
//         .map((key: any) => demoBlocks[quest]?.[key])
//       : [];

//     if (nextBlock[0]?.blockChoosen === 'Interaction') {
//       const optionsFiltered = [];
//       for (const option of gameInfo.questOptions) {
//         if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
//           optionsFiltered.push(option);
//         }
//       }
//       if (gameInfo?.gameData?.gameShuffle === 'true') {
//         for (let i = optionsFiltered.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [optionsFiltered[i], optionsFiltered[j]] = [
//             optionsFiltered[j],
//             optionsFiltered[i],
//           ];
//         }
//       }
//       setOptions(optionsFiltered);
//     }

//     if (type === 'Interaction' && resMsg !== '') {
//       setType('response');
//       return false;
//     } else if (
//       (type === 'Interaction' || type === 'response') &&
//       feed !== '' &&
//       gameInfo?.gameData?.gameIsShowInteractionFeedBack !== 'Completion'
//     ) {
//       setType('feedback');
//       return false;
//     } else if (
//       type === 'Interaction' ||
//       type === 'response' ||
//       type === 'feedback'
//     ) {
//       if (navi === 'Repeat Question') {
//         const currentBlockinteraction =
//           gameInfo?.blocks[currentQuest][currentBlock];
//         setInteractionOptions(gameInfo, currentBlockinteraction);
//         setType(next?.blockChoosen);
//         setData(next);
//         setSelectedOption(null);
//         return false;
//       } else if (navi === 'New Block') {
//         setType(nextBlock[0]?.blockChoosen);
//         setData(nextBlock[0]);
//         setSelectedOption(null);
//         return false;
//       } else if (navi === 'Replay Point') {
//         setType(demoBlocks[quest]['1']?.blockChoosen);
//         setData(demoBlocks[quest]['1']);
//         setSelectedOption(null);
//         return false;
//       } else if (navi === 'Select Block') {
//         const selectedNext = Object.keys(demoBlocks[currentQuest])
//           .filter((item: any) => {
//             return (
//               demoBlocks[currentQuest][item]?.blockSecondaryId ===
//               parseInt(optionNavigation)
//             );
//           })
//           .map((item: any) => {
//             return demoBlocks[currentQuest][item];
//           });
//         if (selectedNext.length > 0) {
//           setType(selectedNext && selectedNext[0]?.blockChoosen);

//           if (selectedNext[0]?.blockChoosen === 'Interaction') {
//             const optionsFiltered = [];
//             for (const option of gameInfo.questOptions) {
//               if (
//                 option?.qpSequence === selectedNext[0]?.blockPrimarySequence
//               ) {
//                 optionsFiltered.push(option);
//               }
//             }
//             if (gameInfo?.gameData?.gameShuffle === 'true') {
//               for (let i = optionsFiltered.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [optionsFiltered[i], optionsFiltered[j]] = [
//                   optionsFiltered[j],
//                   optionsFiltered[i],
//                 ];
//               }
//             }
//             setOptions(optionsFiltered);
//           }
//           setData(selectedNext && selectedNext[0]);
//           setSelectedOption(null);
//           return false;
//         } else {
//           setType(nextBlock[0]?.blockChoosen);
//           if (nextBlock[0]?.blockChoosen === 'Interaction') {
//             const optionsFiltered = [];
//             for (const option of gameInfo.questOptions) {
//               if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
//                 optionsFiltered.push(option);
//               }
//             }
//             if (gameInfo?.gameData?.gameShuffle === 'true') {
//               for (let i = optionsFiltered.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [optionsFiltered[i], optionsFiltered[j]] = [
//                   optionsFiltered[j],
//                   optionsFiltered[i],
//                 ];
//               }
//             }
//             setOptions(optionsFiltered);
//           }
//           setData(nextBlock[0]);
//           setSelectedOption(null);
//           return false;
//         }
//       } else if (navi === 'Complete') {
//         // if (demoBlocks.hasOwnProperty(nextLevel)) {
//         setEndOfQuest(true);
//         // setProfile((prev: any) => {
//         //   const data = { ...prev };
//         //   data.completedLevels = [...data.completedLevels, nextLevel];
//         //   return data;
//         // });
//         // setType(demoBlocks[nextLevel]['1']?.blockChoosen);
//         // setData(demoBlocks[nextLevel]['1']);
//         return false;
//         // } else {
//         //   setType(null);
//         //   setData(null);
//         //   return false;
//         // }
//       } else {
//         setType(nextBlock[0]?.blockChoosen);
//         setData(nextBlock[0]);
//         setSelectedOption(null);
//         return false;
//       }
//     }

//     if (next?.blockShowNavigate) {
//       if (next?.blockShowNavigate === 'Repeat Question') {
//         setType(next?.blockChoosen);
//         setData(next);
//         return false;
//       } else if (next?.blockShowNavigate === 'New Block') {
//         setType(nextBlock[0]?.blockChoosen);
//         setData(nextBlock[0]);
//         setSelectedOption(null);
//         return false;
//       } else if (next?.blockShowNavigate === 'Replay Point') {
//         setType(demoBlocks['1']['1']?.blockChoosen);
//         setData(demoBlocks['1']['1']);
//         setSelectedOption(null);
//         return false;
//       } else if (next?.blockShowNavigate === 'Select Block') {
//         const selectedNext = Object.keys(demoBlocks[currentQuest])
//           .filter((item: any) => {
//             return (
//               demoBlocks[currentQuest][item]?.blockSecondaryId ===
//               parseInt(next?.blockLeadTo)
//             );
//           })
//           .map((item: any) => {
//             return demoBlocks[currentQuest][item];
//           });
//         if (selectedNext.length > 0) {
//           setType(selectedNext && selectedNext[0]?.blockChoosen);
//           if (selectedNext[0]?.blockChoosen === 'Interaction') {
//             const optionsFiltered = [];
//             for (const option of gameInfo.questOptions) {
//               if (
//                 option?.qpSequence === selectedNext[0]?.blockPrimarySequence
//               ) {
//                 optionsFiltered.push(option);
//               }
//             }
//             if (gameInfo?.gameData?.gameShuffle === 'true') {
//               for (let i = optionsFiltered.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [optionsFiltered[i], optionsFiltered[j]] = [
//                   optionsFiltered[j],
//                   optionsFiltered[i],
//                 ];
//               }
//             }
//             setOptions(optionsFiltered);
//           }
//           setData(selectedNext && selectedNext[0]);
//         } else {
//           setType(nextBlock[0]?.blockChoosen);
//           if (nextBlock[0]?.blockChoosen === 'Interaction') {
//             const optionsFiltered = [];
//             for (const option of gameInfo.questOptions) {
//               if (option?.qpSequence === nextBlock[0]?.blockPrimarySequence) {
//                 optionsFiltered.push(option);
//               }
//             }
//             if (gameInfo?.gameData?.gameShuffle === 'true') {
//               for (let i = optionsFiltered.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [optionsFiltered[i], optionsFiltered[j]] = [
//                   optionsFiltered[j],
//                   optionsFiltered[i],
//                 ];
//               }
//             }
//             setOptions(optionsFiltered);
//           }
//           setData(nextBlock[0]);
//         }
//         // setGame3Position((prev: any) => ({
//         //   ...prev,
//         //   nextBlock: selectedNext[0]?.blockPrimarySequence,
//         // }));
//         setSelectedOption(null);
//         return false;
//       } else if (next?.blockShowNavigate === 'Complete') {
//         setEndOfQuest(true);
//         return false;
//       }
//     }
//     setType(nextBlock[0]?.blockChoosen);
//     setData(nextBlock[0]);
//     setSelectedOption(null);
//   };

//   const handleValidate = (item: any, ind: number) => {
//     setResMsg(item?.qpResponse);
//     setFeed(item?.qpFeedback);
//     setNavi(item?.qpNavigateShow);
//     setOptionNavigation(item?.qpNextOption);
//     setSelectedOption(ind === selectedOption ? null : ind);
//   };
//   const handleEntirePrev = async () => {
//     const url = ` /game/creator/demoplay/${id}`;
//     window.open(url, '_blank');
//   };
//   useEffect(() => {
//     if (data && type) {
//       /** this logic is used to hanlde the navigation options in both forward and backward navigation */
//       if (gameInfo.hasOwnProperty('blocks')) {
//         let previousPrimarySeq = navTrack[navTrack.length - 1];
//         if (previousPrimarySeq) {
//           let currentQuest = previousPrimarySeq.split('.')[0];
//           let previousBlock: any = Object.values(
//             gameInfo?.blocks[currentQuest],
//           )?.find((row: any) => {
//             return row.blockPrimarySequence == previousPrimarySeq;
//           });
//           if (data.blockPrimarySequence != previousPrimarySeq) {
//             if (previousBlock?.blockChoosen === 'Interaction') {
//               setNavTrack([data.blockPrimarySequence]);
//             } else {
//               const newArray = navTrack;
//               newArray.push(data.blockPrimarySequence);
//               setNavTrack(newArray);
//             }
//           }
//         } else {
//           setNavTrack([data.blockPrimarySequence]);
//         }
//       }
//       setShowTypingEffect(false);
//     }
//   }, [data, type]);
//   useEffect(() => {
//     if (Navigatenext === true) {
//       getData(data);
//     }
//   }, [Navigatenext]);

//   const Updatecontent = () => {
//     if (showTypingEffect === false) {
//       setShowTypingEffect(true);
//     } else {
//       getData(data);
//     }
//   };
//   const handleCloseWindow = () => {
//     window.close();
//   };

//   const SkipContentForBackNavigation = () => {
//     if (showTypingEffect === false) {
//       setShowTypingEffect(true);
//     } else {
//       prevData(data);
//     }
//   };

//   const getNoteNextData = () => {
//     setIsPrevNavigation(false);
//     getData(data);
//   };

//   useEffect(() => {
//     if (gameInfo && preloadedAssets && componentsLoaded) {
//       setContentReady(true);
//     } else {
//       setContentReady(false);
//       if (gameInfo === undefined) {
//         setErrMessage('Insufficient data to display the preview');
//         setShowPromptScreen(true);
//       }
//     }
//   }, [gameInfo, preloadedAssets, componentsLoaded]);

//   useEffect(() => {
//     if (contentReady && gameInfo) {
//       if (previewStateData && previewStateData?.gameId) {
//         if ([1, 2, 3, 6].includes(previewStateData?.currentTab)) {
//           setErrMessage('Preview Not Avilable for this selection');
//           setShowPromptScreen(true);
//         } else {
//           setErrMessage(null);
//           setShowPromptScreen(false);
//         }
//       }
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 3000);
//     } else if (gameInfo === undefined) {
//       setShowPromptScreen(true);
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 3000);
//     } else {
//       if (previewStateData && previewStateData?.gameId) {
//         if ([1, 2, 3, 6].includes(previewStateData?.currentTab)) {
//           setTimeout(() => {
//             setIsLoading(false);
//           }, 3000);
//           setErrMessage('Preview Not Avilable for this selection');
//           setShowPromptScreen(true);
//         } else {
//           setTimeout(() => {
//             setIsLoading(false);
//           }, 3000);
//           setErrMessage(null);
//           setShowPromptScreen(false);
//         }
//       }
//     }
//   }, [contentReady, gameInfo, previewStateData]);

//   return (
//     <>
//       {isLoading && <HashLoader color="#3b38e0" />}
//       <Box id="container">
//         <Suspense fallback={<HashLoader color="#3b38e0" />}>
//           {(contentReady || endOfQuest) && (
//             <motion.div
//               initial={{ opacity: 0, background: '#000' }}
//               animate={{ opacity: 1, background: '#0000' }}
//               transition={{ duration: 1, delay: 0.5 }}
//             >
//               <Box id="EntirePreview-wrapper">
//                 <Box className="EntirePreview-content">
//                   <Box h={'100vh !important'} className="Images">
//                     <Flex height="100vh" className="EntirePreview">
//                       <Button
//                         className="demo-btn"
//                         bg="#11047a"
//                         _hover={{ bg: '#190793' }}
//                         color="#fff"
//                         style={{
//                           position: 'absolute',
//                           top: '2vh',
//                           right: '0vw',
//                           pointerEvents: 'auto',
//                           zIndex: 1, // High z-index value
//                           visibility: 'visible',
//                         }}
//                         mr={'17px'}
//                         mt={'6px'}
//                         ml={'11px'}
//                         onClick={handleEntirePrev}
//                       >
//                         Demo Play
//                       </Button>
//                       {previewStateData?.currentTab === 4 && data === null && (
//                         <Box
//                           w={'100%'}
//                           h={'100vh'}
//                           alignItems={'center'}
//                           justifyContent={'center'}
//                           position={'relative'}
//                           overflow={'visible'}
//                           style={{ perspective: '1000px' }}
//                           className="Main-Content"
//                         >
//                           <Box
//                             w={'100% !important'}
//                             h={'100vh'}
//                             backgroundRepeat={'no-repeat'}
//                             backgroundSize={'cover'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             className="Game-Screen"
//                             backgroundImage={preloadedAssets.backgroundImage}
//                           >
//                             <ScreenPreviewErrorPrompt
//                               preloadedAssets={preloadedAssets}
//                               errMessage={`***** No preview available for the current selection. Kindly add blocks to your story to generate the preview.`}
//                             />
//                           </Box>
//                         </Box>
//                       )}
//                       {previewStateData?.currentTab === 4 &&
//                         data &&
//                         type === 'Note' && (
//                           <Box
//                             position="relative"
//                             w={'100%'}
//                             height="100vh"
//                             backgroundImage={preloadedAssets?.backgroundImage}
//                             backgroundSize={'cover'}
//                             backgroundRepeat={'no-repeat'}
//                             className="chapter_potrait"
//                           >
//                             <Grid
//                               templateColumns="repeat(1, 1fr)"
//                               gap={4}
//                               position="absolute"
//                               top="50%"
//                               left="50%"
//                               transform="translate(-50%, -50%)"
//                               className="story_note_grid"
//                             >
//                               <GridItem colSpan={1} position={'relative'}>
//                                 <Box display={'flex'} justifyContent={'center'}>
//                                   <Img
//                                     src={preloadedAssets?.note}
//                                     className="story_note_image"
//                                     loading="lazy"
//                                   />
//                                   <Box className={'story_note_content'}>
//                                     <Box
//                                       w={'100%'}
//                                       display={'flex'}
//                                       justifyContent={'center'}
//                                     >
//                                       <Box className={'story_note_block'}>
//                                         <Text textAlign={'center'}>
//                                           {data?.blockText}
//                                         </Text>
//                                       </Box>
//                                     </Box>
//                                     <Box
//                                       w={'100%'}
//                                       onClick={() => getNoteNextData()}
//                                       mt={'20px'}
//                                       display={'flex'}
//                                       justifyContent={'center'}
//                                       cursor={'pointer'}
//                                       position={'fixed'}
//                                       top={'70%'}
//                                     >
//                                       <Img
//                                         src={preloadedAssets.next}
//                                         h={'7vh'}
//                                         className={'story_note_next_button'}
//                                       />
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               </GridItem>
//                             </Grid>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 4 &&
//                         data &&
//                         type === 'Dialog' && (
//                           <Box className="chapter_potrait">
//                             <Img
//                               src={preloadedAssets?.backgroundImage}
//                               className="dialogue_screen"
//                             />
//                             <Img
//                               className={'dialogue_image'}
//                               src={preloadedAssets?.dial}
//                             />

//                             <Box position={'relative'}>
//                               <Img
//                                 src={preloadedAssets?.char}
//                                 position={'fixed'}
//                                 h={'100px'}
//                                 w={'30%'}
//                                 left={'5%'}
//                                 bottom={'105px'}
//                               />
//                               <Text
//                                 position={'fixed'}
//                                 left={{ base: '17%', md: '18%' }}
//                                 bottom={'130px'}
//                                 fontSize={{ base: '30px', xl: '2vw' }}
//                                 fontWeight={500}
//                                 textAlign={'center'}
//                                 fontFamily={'AtlantisText'}
//                                 color={'#312821'}
//                               >
//                                 {data.blockRoll === 'Narrator'
//                                   ? data.blockRoll
//                                   : data.blockRoll === '999999'
//                                     ? 'Player Name'
//                                     : gameInfo?.gameData?.gameNonPlayerName}
//                               </Text>
//                             </Box>
//                             <Box
//                               display={'flex'}
//                               position={'fixed'}
//                               alignItems={'center'}
//                               justifyContent={'space-between'}
//                               h={'61px'}
//                               overflowY={'scroll'}
//                               w={'85%'}
//                               fontSize={{ base: '19px', lg: '1.8vw' }}
//                               bottom={'38px'}
//                               fontFamily={'AtlantisContent'}
//                             >
//                               {showTypingEffect === false ? (
//                                 <TypingEffect
//                                   text={data?.blockText}
//                                   speed={50}
//                                   setSpeedIsOver={setShowTypingEffect}
//                                 />
//                               ) : (
//                                 data?.blockText
//                               )}
//                             </Box>
//                             <Box
//                               display={'flex'}
//                               position={'fixed'}
//                               justifyContent={
//                                 navTrack.length > 1 ? 'space-between' : 'end'
//                               }
//                               w={'95%'}
//                               bottom={'0'}
//                             >
//                               {navTrack.length > 1 && (
//                                 <Img
//                                   src={preloadedAssets?.left}
//                                   w={'70px'}
//                                   h={'50px'}
//                                   cursor={'pointer'}
//                                   onClick={() => SkipContentForBackNavigation()}
//                                 />
//                               )}
//                               <Img
//                                 src={preloadedAssets?.right}
//                                 w={'70px'}
//                                 h={'50px'}
//                                 cursor={'pointer'}
//                                 onClick={() => Updatecontent()}
//                               />
//                             </Box>
//                             {/* </>
//                           )} */}
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 4 &&
//                         data &&
//                         type === 'Interaction' && (
//                           <Box
//                             position="relative"
//                             w={'100%'}
//                             height="100vh"
//                             backgroundImage={preloadedAssets?.backgroundImage}
//                             backgroundSize={'cover'}
//                             backgroundRepeat={'no-repeat'}
//                             className="chapter_potrait"
//                           >
//                             <Grid
//                               templateColumns="repeat(1, 1fr)"
//                               gap={4}
//                               position="absolute"
//                               top="50%"
//                               left="50%"
//                               transform="translate(-50%, -50%)"
//                               w={'90%'}
//                             >
//                               <GridItem colSpan={1} position={'relative'}>
//                                 <Box
//                                   position={'relative'}
//                                   className="story_interaction_image"
//                                 >
//                                   {selectedPlayer && (
//                                     <Img
//                                       src={selectedPlayer}
//                                       position={'fixed'}
//                                       right={'100px'}
//                                       bottom={'-20px'}
//                                       w={'350px'}
//                                       h={'540px'}
//                                       loading="lazy"
//                                     />
//                                   )}
//                                   {preloadedAssets?.nonplayerImage && (
//                                     <Img
//                                       src={preloadedAssets?.nonplayerImage}
//                                       position={'fixed'}
//                                       right={'500px'}
//                                       bottom={'20px'}
//                                       w={'350px'}
//                                       h={'540px'}
//                                       loading="lazy"
//                                     />
//                                   )}
//                                   <Img
//                                     src={preloadedAssets?.parch}
//                                     w={'auto'}
//                                     h={'100%'}
//                                     loading="lazy"
//                                   />
//                                   <Box
//                                     position={'absolute'}
//                                     top={{ base: '5%', md: '6%' }}
//                                     className="story_interaction_content"
//                                   >
//                                     <Box
//                                       textAlign={'center'}
//                                       display={'flex'}
//                                       justifyContent={'center'}
//                                       alignItems={'center'}
//                                       fontWeight={500}
//                                       fontSize={{ md: '3vw', lg: '2.5vw' }}
//                                       fontFamily={'AtlantisText'}
//                                       lineHeight={1}
//                                       w={'100%'}
//                                       h={'10%'}
//                                       className={'interaction_heading_potrait'}
//                                     >
//                                       <Box w={'80%'} color={'#312821'}>
//                                         Interaction{' '}
//                                       </Box>
//                                     </Box>
//                                     <Box
//                                       textAlign={'center'}
//                                       h={'25%'}
//                                       display={'flex'}
//                                       justifyContent={'center'}
//                                       alignItems={'center'}
//                                       fontWeight={500}
//                                       fontFamily={'AtlantisText'}
//                                       lineHeight={1}
//                                       w={'96%'}
//                                       overflowY={'scroll'}
//                                       marginTop={'15px'}
//                                     >
//                                       <Box
//                                         className={'story_intraction_question'}
//                                       >
//                                         {data?.blockText}
//                                       </Box>
//                                     </Box>
//                                     <Box
//                                       mt={'10px'}
//                                       w={'100%'}
//                                       h={'40%'}
//                                       fontWeight={500}
//                                       overflowY={'scroll'}
//                                       display={'flex'}
//                                       justifyContent={'center'}
//                                     >
//                                       <Box w={'60%'}>
//                                         {options &&
//                                           options.map(
//                                             (item: any, ind: number) => (
//                                               <Box
//                                                 w={'100%'}
//                                                 mb={'10px'}
//                                                 lineHeight={1}
//                                                 key={ind}
//                                                 color={
//                                                   selectedOption === ind
//                                                     ? 'purple'
//                                                     : ''
//                                                 }
//                                                 textAlign={'center'}
//                                                 cursor={'pointer'}
//                                                 onClick={() =>
//                                                   handleValidate(item, ind)
//                                                 }
//                                                 fontFamily={'AtlantisText'}
//                                               >
//                                                 <Img
//                                                   src={
//                                                     selectedOption === ind
//                                                       ? preloadedAssets?.on
//                                                       : preloadedAssets?.off
//                                                   }
//                                                   h={'4vh'}
//                                                   w={'100%'}
//                                                 />
//                                                 <Box
//                                                   className={
//                                                     'story_interaction_option'
//                                                   }
//                                                 >
//                                                   {/* {item?.qpOptionText} */}
//                                                   {`${String.fromCharCode(
//                                                     65 + ind,
//                                                   )}). ${item?.qpOptionText}`}
//                                                 </Box>
//                                               </Box>
//                                             ),
//                                           )}
//                                       </Box>
//                                     </Box>
//                                     <Box
//                                       w={'98%'}
//                                       display={'flex'}
//                                       justifyContent={
//                                         navTrack.length > 1
//                                           ? 'space-between'
//                                           : 'end'
//                                       }
//                                     >
//                                       {navTrack.length > 1 && (
//                                         <Img
//                                           src={preloadedAssets?.left}
//                                           className={'interaction_button'}
//                                           onClick={() => prevData(data)}
//                                         />
//                                       )}
//                                       {selectedOption !== null && (
//                                         <Box
//                                           className={'blinking-wave'}
//                                           onClick={() => getData(data)}
//                                           borderRadius={'50%'}
//                                         >
//                                           <Img
//                                             src={preloadedAssets?.right}
//                                             className={'interaction_button'}
//                                             onClick={() => getData(data)}
//                                           />
//                                         </Box>
//                                       )}
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               </GridItem>
//                             </Grid>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 4 &&
//                         data &&
//                         type === 'response' && (
//                           <Box className="chapter_potrait">
//                             <Img
//                               src={preloadedAssets?.backgroundImage}
//                               className="dialogue_screen"
//                             />
//                             <Img
//                               className={'dialogue_image'}
//                               src={preloadedAssets?.dial}
//                             />
//                             {!showNote && (
//                               <>
//                                 <Box position={'relative'}>
//                                   <Img
//                                     src={preloadedAssets?.char}
//                                     position={'fixed'}
//                                     h={'100px'}
//                                     w={'30%'}
//                                     left={'5%'}
//                                     bottom={'93px'}
//                                   />
//                                   <Text
//                                     position={'fixed'}
//                                     left={{ base: '17%', md: '18%' }}
//                                     bottom={'118px'}
//                                     fontSize={{ base: '30px', xl: '2.2vw' }}
//                                     fontWeight={500}
//                                     textAlign={'center'}
//                                     fontFamily={'AtlantisText'}
//                                     color={'#312821'}
//                                   >
//                                     {/* {data.blockRoll === 'Narrator'
//                                     ? data.blockRoll
//                                     : gameInfo?.gameData?.gameNonPlayerName} */}
//                                     {data.blockRoll === 'Narrator'
//                                       ? data.blockRoll
//                                       : data.blockRoll === '999999'
//                                         ? 'Player Name'
//                                         : gameInfo?.gameData?.gameNonPlayerName}
//                                   </Text>
//                                 </Box>
//                                 <Box
//                                   display={'flex'}
//                                   position={'fixed'}
//                                   alignItems={'center'}
//                                   justifyContent={'space-between'}
//                                   h={'61px'}
//                                   overflowY={'scroll'}
//                                   w={'85%'}
//                                   fontSize={{ base: '30px', lg: '1.8vw' }}
//                                   bottom={'38px'}
//                                   fontFamily={'AtlantisContent'}
//                                 >
//                                   {showTypingEffect === false ? (
//                                     <TypingEffect
//                                       text={resMsg}
//                                       speed={50}
//                                       setSpeedIsOver={setShowTypingEffect}
//                                     />
//                                   ) : (
//                                     resMsg
//                                   )}
//                                 </Box>
//                                 <Box
//                                   display={'flex'}
//                                   position={'fixed'}
//                                   justifyContent={'end'}
//                                   w={'95%'}
//                                   bottom={'0'}
//                                 >
//                                   <Img
//                                     src={preloadedAssets?.right}
//                                     w={'70px'}
//                                     h={'50px'}
//                                     cursor={'pointer'}
//                                     onClick={() => Updatecontent()}
//                                   />
//                                 </Box>
//                               </>
//                             )}
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 4 &&
//                         data &&
//                         type === 'feedback' && (
//                           <Box
//                             position="relative"
//                             w={'100%'}
//                             height="100vh"
//                             backgroundImage={preloadedAssets?.backgroundImage}
//                             backgroundSize={'cover'}
//                             backgroundRepeat={'no-repeat'}
//                             className="chapter_potrait"
//                           >
//                             <Grid
//                               templateColumns="repeat(1, 1fr)"
//                               gap={4}
//                               position="absolute"
//                               top="50%"
//                               left="50%"
//                               transform="translate(-50%, -50%)"
//                               className="story_note_grid"
//                             >
//                               <GridItem colSpan={1} position={'relative'}>
//                                 <Box display={'flex'} justifyContent={'center'}>
//                                   <Img
//                                     src={preloadedAssets?.feedi}
//                                     className="story_note_image"
//                                     loading="lazy"
//                                   />
//                                   <Box
//                                     className={'story_note_content'}
//                                   // bg={'blue.300'}
//                                   >
//                                     <Box
//                                       w={'100%'}
//                                       display={'flex'}
//                                       justifyContent={'center'}
//                                     >
//                                       <Box className={'story_note_block'}>
//                                         <Text textAlign={'center'}>{feed}</Text>
//                                       </Box>
//                                     </Box>
//                                     <Box
//                                       w={'100%'}
//                                       onClick={() => getData(data)}
//                                       mt={'20px'}
//                                       display={'flex'}
//                                       justifyContent={'center'}
//                                       cursor={'pointer'}
//                                       position={'fixed'}
//                                       top={'70%'}
//                                     >
//                                       <Img
//                                         src={preloadedAssets.next}
//                                         h={'7vh'}
//                                         className={'story_note_next_button'}
//                                       />
//                                     </Box>
//                                   </Box>
//                                 </Box>
//                               </GridItem>
//                             </Grid>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 5 &&
//                         previewStateData?.currentSubTab === 0 && (
//                           <Box
//                             w={'100%'}
//                             h={'100vh'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             position={'relative'}
//                             overflow={'visible'}
//                             style={{ perspective: '1000px' }}
//                             className="Main-Content"
//                           >
//                             <Box
//                               w={'100% !important'}
//                               h={'100vh'}
//                               backgroundRepeat={'no-repeat'}
//                               backgroundSize={'cover'}
//                               alignItems={'center'}
//                               justifyContent={'center'}
//                               className="Game-Screen"
//                               backgroundImage={preloadedAssets.backgroundImage}
//                             >
//                               <Box className="Images">
//                                 <CompletionContentScreen
//                                   preview={true}
//                                   formData={gameInfo.gameData}
//                                   imageSrc={preloadedAssets.Completion}
//                                   compliData={gameInfo.completionQuestOptions}
//                                   CompKeyCount={previewStateData?.CompKeyCount}
//                                   preloadedAssets={preloadedAssets}
//                                 />
//                               </Box>
//                             </Box>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 5 &&
//                         previewStateData?.currentSubTab === 1 && (
//                           <Box
//                             w={'100%'}
//                             h={'100vh'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             position={'relative'}
//                             overflow={'visible'}
//                             style={{ perspective: '1000px' }}
//                             className="Main-Content"
//                           >
//                             <Box
//                               w={'100% !important'}
//                               h={'100vh'}
//                               backgroundRepeat={'no-repeat'}
//                               backgroundSize={'cover'}
//                               alignItems={'center'}
//                               justifyContent={'center'}
//                               className="Game-Screen"
//                               backgroundImage={preloadedAssets.backgroundImage}
//                             >
//                               {gameInfo.gameData.gameIsShowLeaderboard ===
//                                 'true' ? (
//                                 <Box className="Images">
//                                   <Box className="LearderBoards">
//                                     <LeaderBoard
//                                       formData={gameInfo?.gameData}
//                                       imageSrc={preloadedAssets.Lead}
//                                       getData={getData}
//                                       data={data}
//                                       preloadedAssets={preloadedAssets}
//                                     />
//                                   </Box>
//                                 </Box>
//                               ) : (
//                                 <ScreenPreviewErrorPrompt
//                                   preloadedAssets={preloadedAssets}
//                                   errMessage={`No preview available for the current selection. The Leadboard screen preview will appear once you complete the story and head to the design section to Enable the Leadboard Screen.`}
//                                 />
//                               )}
//                             </Box>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 5 &&
//                         previewStateData?.currentSubTab === 2 && (
//                           <Box
//                             w={'100%'}
//                             h={'100vh'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             position={'relative'}
//                             overflow={'visible'}
//                             style={{ perspective: '1000px' }}
//                             className="Main-Content"
//                           >
//                             <Box className="Game-Screen">
//                               <Box className="Images">
//                                 {gameInfo.gameData
//                                   .gameIsShowReflectionScreen === 'true' ? (
//                                   <ReflectionContentScreen
//                                     preview={true}
//                                     formData={gameInfo.gameData}
//                                     imageSrc={preloadedAssets?.RefBg}
//                                     reflectionQuestions={
//                                       gameInfo?.reflectionQuestions
//                                     }
//                                     reflectionQuestionsdefault={
//                                       reflectionQuestionsdefault
//                                     }
//                                     preloadedAssets={preloadedAssets}
//                                     RefelectionAnswer={RefelectionAnswer}
//                                   />
//                                 ) : (
//                                   <Box
//                                     w={'100%'}
//                                     h={'100vh'}
//                                     alignItems={'center'}
//                                     justifyContent={'center'}
//                                     position={'relative'}
//                                     overflow={'visible'}
//                                     style={{ perspective: '1000px' }}
//                                     className="Main-Content"
//                                   >
//                                     <Box
//                                       w={'100% !important'}
//                                       h={'100vh'}
//                                       backgroundRepeat={'no-repeat'}
//                                       backgroundSize={'cover'}
//                                       alignItems={'center'}
//                                       justifyContent={'center'}
//                                       className="Game-Screen"
//                                       backgroundImage={
//                                         preloadedAssets.backgroundImage
//                                       }
//                                     >
//                                       <ScreenPreviewErrorPrompt
//                                         preloadedAssets={preloadedAssets}
//                                         errMessage={`No preview available for the current selection. The Reflection screen preview will appear once you complete the story and head to the design section to enable the Reflection screen.`}
//                                       />
//                                     </Box>
//                                   </Box>
//                                 )}
//                               </Box>
//                             </Box>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 5 &&
//                         previewStateData?.currentSubTab === 3 && (
//                           <Box
//                             w={'100%'}
//                             h={'100vh'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             position={'relative'}
//                             overflow={'visible'}
//                             style={{ perspective: '1000px' }}
//                             className="Main-Content"
//                           >
//                             <Box
//                               w={'100% !important'}
//                               h={'100vh'}
//                               backgroundRepeat={'no-repeat'}
//                               backgroundSize={'cover'}
//                               alignItems={'center'}
//                               justifyContent={'center'}
//                               className="Game-Screen"
//                               backgroundImage={preloadedAssets.backgroundImage}
//                             >
//                               <Box className="Images">
//                                 {gameInfo.gameData.gameIsShowTakeaway ===
//                                   'true' ? (
//                                   <TakeAwaysContentScreen
//                                     preview={true}
//                                     formData={gameInfo.gameData}
//                                     imageSrc={preloadedAssets?.Screen4}
//                                     preloadedAssets={preloadedAssets}
//                                   />
//                                 ) : (
//                                   <ScreenPreviewErrorPrompt
//                                     preloadedAssets={preloadedAssets}
//                                     errMessage={`No preview available for the current selection. The Takeaway screen preview will appear once you complete the story and head to the design section to create the Takeaway screen.`}
//                                   />
//                                 )}
//                               </Box>
//                             </Box>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 5 &&
//                         previewStateData?.currentSubTab === 4 && (
//                           <Box
//                             w={'100%'}
//                             h={'100vh'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             position={'relative'}
//                             overflow={'visible'}
//                             style={{ perspective: '1000px' }}
//                             className="Main-Content"
//                           >
//                             <Box
//                               w={'100% !important'}
//                               h={'100vh'}
//                               backgroundRepeat={'no-repeat'}
//                               backgroundSize={'cover'}
//                               alignItems={'center'}
//                               justifyContent={'center'}
//                               className="Game-Screen"
//                               backgroundImage={preloadedAssets.backgroundImage}
//                             >
//                               <Box className="Images">
//                                 <WelcomeContentScreen
//                                   formData={gameInfo.gameData}
//                                   imageSrc={preloadedAssets?.Screen5}
//                                   preview={true}
//                                   preloadedAssets={preloadedAssets}
//                                 />
//                               </Box>
//                             </Box>
//                           </Box>
//                         )}
//                       {previewStateData?.currentTab === 5 &&
//                         previewStateData?.currentSubTab === 5 && (
//                           <Box
//                             w={'100%'}
//                             h={'100vh'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             position={'relative'}
//                             overflow={'visible'}
//                             style={{ perspective: '1000px' }}
//                             className="Main-Content"
//                           >
//                             <Box
//                               w={'100% !important'}
//                               h={'100vh'}
//                               backgroundRepeat={'no-repeat'}
//                               backgroundSize={'cover'}
//                               alignItems={'center'}
//                               justifyContent={'center'}
//                               className="Game-Screen"
//                               backgroundImage={preloadedAssets.backgroundImage}
//                             >
//                               <Box className="Images">
//                                 <TyContentScreen
//                                   formData={gameInfo.gameData}
//                                   imageSrc={preloadedAssets?.Screen6}
//                                   preview={true}
//                                   preloadedAssets={preloadedAssets}
//                                   ThankyouFeedback={ThankyouFeedback}
//                                 />
//                               </Box>
//                             </Box>
//                           </Box>
//                         )}
//                       {endOfQuest && (
//                         <Box
//                           w={'100%'}
//                           h={'100vh'}
//                           alignItems={'center'}
//                           justifyContent={'center'}
//                           position={'relative'}
//                           overflow={'visible'}
//                           style={{ perspective: '1000px' }}
//                           className="Main-Content"
//                         >
//                           <Box
//                             backgroundImage={preloadedAssets?.backgroundImage}
//                             w={'100% !important'}
//                             h={'100vh'}
//                             backgroundRepeat={'no-repeat'}
//                             backgroundSize={'cover'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             className="Game-Screen"
//                           >
//                             <Box className="Images">
//                               <PreviewEndOfStory
//                                 setEndOfQuest={setEndOfQuest}
//                                 preloadedAssets={preloadedAssets}
//                                 replayQuest={replayQuest}
//                               />
//                             </Box>
//                           </Box>
//                         </Box>
//                       )}
//                       {showPromptScreen && (
//                         <Box
//                           w={'100%'}
//                           h={'100vh'}
//                           alignItems={'center'}
//                           justifyContent={'center'}
//                           position={'absolute'}
//                           overflow={'visible'}
//                           style={{ perspective: '1000px' }}
//                           className="Main-Content"
//                           top={0}
//                         >
//                           <Box
//                             w={'100% !important'}
//                             h={'100vh'}
//                             backgroundRepeat={'no-repeat'}
//                             backgroundSize={'cover'}
//                             alignItems={'center'}
//                             justifyContent={'center'}
//                             className="Game-Screen"
//                             backgroundImage={preloadedAssets.StarsBg}
//                           >
//                             <ScreenPreviewErrorPrompt
//                               preloadedAssets={preloadedAssets}
//                               errMessage={
//                                 errMessage ||
//                                 'Insufficient data to display the preview'
//                               }
//                             />
//                           </Box>
//                         </Box>
//                       )}
//                     </Flex>
//                   </Box>
//                 </Box>
//               </Box>
//             </motion.div>
//           )}

//           {showPromptScreen && (
//             <Box
//               w={'100%'}
//               h={'100vh'}
//               alignItems={'center'}
//               justifyContent={'center'}
//               position={'absolute'}
//               overflow={'visible'}
//               style={{ perspective: '1000px' }}
//               className="Main-Content"
//               top={0}
//             >
//               <Box
//                 w={'100% !important'}
//                 h={'100vh'}
//                 backgroundRepeat={'no-repeat'}
//                 backgroundSize={'cover'}
//                 alignItems={'center'}
//                 justifyContent={'center'}
//                 className="Game-Screen"
//                 backgroundImage={preloadedAssets.StarsBg}
//               >
//                 <ScreenPreviewErrorPrompt
//                   preloadedAssets={preloadedAssets}
//                   errMessage={
//                     errMessage || 'Insufficient data to display the preview'
//                   }
//                 />
//               </Box>
//             </Box>
//           )}
//         </Suspense>
//       </Box>
//     </>
//   );
// };

// export default ScreenPreview;


import React from 'react'

const ScreenPreview = () => {
  return (
    <div>ScreenPreview</div>
  )
}

export default ScreenPreview
