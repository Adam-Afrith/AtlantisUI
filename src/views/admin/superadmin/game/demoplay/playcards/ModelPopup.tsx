import React, { useContext, useState } from 'react'
import { Box, Button, Grid, GridItem, Img, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Switch, Text } from '@chakra-ui/react';
import right from 'assets/img/games/right.png';
import left from 'assets/img/games/left.png';
import parch from 'assets/img/games/parch.png';
import on from 'assets/img/games/on.png';
import off from 'assets/img/games/off.png';
import TopMenu from 'assets/img/games/top-menu.png';
import Overview from 'assets/img/games/game-overview.png';
import Setting from 'assets/img/games/settings.png';
import SettingPad from 'assets/img/games/setting-pad.png';
import SliderPointer from 'assets/img/games/slider-pointer.png';
import Close from 'assets/img/games/close.png';
import { ScoreContext,ProfileType } from '../GamePreview';
import { motion } from 'framer-motion';
interface ModelPopupProps {
  data?: any;
  options?: any;
  backGroundImg?: any;
  option?: any;
  profile?: any;
  geTfeedBackoption?: any;
  ModelControl?: any;
  preloadedAssets?: any;
  setModelControl: any;
  getPrevLogDatas: any
  setCurrentScreenId: any;
  setData: any;
  setType: any;
  gameInfo: any;
  setOptions: any;
  gameInfoquest: any;
  gameinfodata: any;
  isStoryScreen: any;
  isSetStoryScreen: any;
  setPreLogDatas: any;
  setNavigateBlockEmpty: any;
  NavigateBlockEmpty: any;
  profileData: any;
  setQuestState: any;
  setReplayState: any;
  setReplayIsOpen: any;
  replayState?: string;
  QuestBlocklastpaused: ()=> void;
}

const ModelPopup: React.FC<ModelPopupProps> = ({ data, backGroundImg, option, options, geTfeedBackoption, ModelControl, preloadedAssets, setModelControl, getPrevLogDatas, setCurrentScreenId, setType, setData, gameInfo, setOptions, gameInfoquest, gameinfodata, isStoryScreen, isSetStoryScreen, setPreLogDatas, setNavigateBlockEmpty, NavigateBlockEmpty, profileData, setQuestState, setReplayState, setReplayIsOpen,replayState,QuestBlocklastpaused}) => {
  const [QuestScreen, SetQuestScreen] = useState<boolean>(false);
  const [QuestSelectionPage, SetQuestSelectionPage] = useState<boolean>(false);
  const [PlayAgain, SetPlayAgain] = useState<boolean>(false);
  const initialProfileObject: ProfileType = {
    score: [],
    completedLevels: ['1'],
    currentQuest: 1,
    replayScore: [],
    playerGrandTotal: { questScores: {} },
    todayEarnedScore: [{ quest: 1, score: 0, earnedDate: "" }],
  };
  const { profile, setProfile } = useContext(ScoreContext);
  const NextScreen = () => {
    // setPreLogDatas((prev:any) => ({...prev,previewProfile:{ ...formState,
    //   score:getPrevLogDatas.previewProfile.score ? getPrevLogDatas.previewProfile.score : []}}))
    setPreLogDatas((prev: any) => ({
      ...prev,
      nevigatedSeq: [],
      screenIdSeq: [],
      lastActiveBlockSeq: '',
      lastModifiedBlockSeq: null,
      lastBlockModifiedDate: null,
      selectedOptions: '',
      previewScore:initialProfileObject,
      previewProfile:{...getPrevLogDatas.previewProfile,score:[]}
    }));
    setProfile(initialProfileObject);
    setModelControl(false);
    setReplayState('');
    setReplayIsOpen(false);
    setCurrentScreenId(1);

  }
  const continueScreen = () => {
      if (getPrevLogDatas.screenIdSeq.length > 0) {
        const screenlast = getPrevLogDatas.screenIdSeq;
        const getLastScreenId = screenlast[0];
        if (getLastScreenId === 2) {
          setReplayState('Prompt');
          setModelControl(false);
          setReplayIsOpen(true);
          return false;
        }
        else {
          setCurrentScreenId(getLastScreenId);
          setModelControl(false);
          return false;
        }
      }
    
  }
  // const QuestBlocklastpaused = () => {
  //   if (getPrevLogDatas.nevigatedSeq) {
  //     const LastPreviousActiveBlock = getPrevLogDatas.lastActiveBlockSeq;
  //     const lastActiveBlock = Object.keys(getPrevLogDatas.lastActiveBlockSeq);
  //     const lastActivityquest = lastActiveBlock[0];
  //     const findActiveBlockId = LastPreviousActiveBlock[lastActivityquest];
  //     let SetLastSeqData: any;
  //     for (const key in gameInfo.blocks[lastActivityquest]) {
  //       const data = gameInfo.blocks[lastActivityquest][key];
  //       if (data.blockId === findActiveBlockId[0]) {
  //         SetLastSeqData = data;
  //         break;
  //       }
  //     }
  //     setProfile((prev: any)=> ({...prev, currentQuest: lastActivityquest}))
  //     setData(SetLastSeqData);
  //     setType(SetLastSeqData.blockChoosen);
  //     if (
  //       SetLastSeqData.blockChoosen ===
  //       'Interaction'
  //     ) {
  //       const optionsFiltered = [];
  //       const primarySequence = findActiveBlockId[0];
  //       for (const option of gameInfoquest) {
  //         if (profileData?.Audiogetlanguage.length > 0) {
  //           if (option?.qpQuestionId === primarySequence) {
  //             const profilesetlan = profileData?.Audiogetlanguage.find(
  //               (key: any) => key?.textId === option.qpOptionId,
  //             );

  //             if (profilesetlan) {
  //               const languagecont = {
  //                 ...option,
  //                 qpOptionText: profilesetlan.content,
  //               };
  //               optionsFiltered.push(languagecont);
  //             } else {
  //               optionsFiltered.push(option);
  //             }
  //           }
  //         } else {
  //           if (option?.qpQuestionId === primarySequence) {
  //             optionsFiltered.push(option);
  //           }
  //         }
  //       }
  //       if (gameinfodata === 'true') {
  //         for (let i = optionsFiltered.length - 1; i > 0; i--) {
  //           const j = Math.floor(Math.random() * (i + 1));
  //           [optionsFiltered[i], optionsFiltered[j]] = [
  //             optionsFiltered[j],
  //             optionsFiltered[i],
  //           ]; // Swap elements at indices i and j
  //         }
  //       }
  //       setOptions(optionsFiltered);
  //     }
  //     setReplayIsOpen(false);
  //     setCurrentScreenId(2);
  //     return false;
  //   }
  // }
  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;
    if (name === 'lastpausedQuest' && checked) {

      SetQuestScreen(true);
      SetQuestSelectionPage(false);
      SetPlayAgain(false);
      return false;
    }
    else if (name === 'questSelectionPage' && checked) {
      SetQuestScreen(false);
      SetQuestSelectionPage(true);
      SetPlayAgain(false);
      return false;
    }
    else if (name === 'playAgain' && checked) {
      SetQuestScreen(false);
      SetQuestSelectionPage(false);
      SetPlayAgain(true);
      return false;
    }
  }
  const HandleScreen = () => {
    if (QuestScreen === true) {
      if (getPrevLogDatas.nevigatedSeq) {
        const getnevigatedSeq = getPrevLogDatas.nevigatedSeq;
        const convertArray = Object.keys(getnevigatedSeq);
        const getLastquest = convertArray[convertArray.length - 1];
        const findseq = getnevigatedSeq[getLastquest];
        const getLastSeq = findseq[getnevigatedSeq[getLastquest].length - 1];
        const lenCompleteQuest = Object.keys(getnevigatedSeq);
        let checkcompleteQuest = lenCompleteQuest;

        if (Object.keys(gameInfo).length !== convertArray.length) {
          checkcompleteQuest.push((convertArray.length + 1).toString());
        }

        let SetLastSeqData: any;
        for (const key in gameInfo[getLastquest]) {
          const data = gameInfo[getLastquest][key];
          if (data.blockPrimarySequence == getLastSeq) {
            SetLastSeqData = data;
            break;
          }

        }
        setData(SetLastSeqData);
        setType(SetLastSeqData.blockChoosen);
        if (
          SetLastSeqData.blockChoosen ===
          'Interaction'
        ) {
          const optionsFiltered = [];
          const primarySequence = getLastSeq;

          for (const option of gameInfoquest) {
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
        setModelControl(false);
        //isSetStoryScreen(false);
        // setReplayState(null)
        setCurrentScreenId(2);
        return false;
      }
    }
    else if (QuestSelectionPage === true) {
      setModelControl(false);
      //isSetStoryScreen(false);
      setCurrentScreenId(13);
      return false;
    }
    else if (PlayAgain === true) {
      setPreLogDatas((prev: any) => ({
        ...prev,
        nevigatedSeq: [],
        screenIdSeq: [],
        lastActiveBlockSeq: '',
        selectedOptions: '',
      }));
      setModelControl(false);
      //isSetStoryScreen(false);
      return false;
    }
  }
  const HandleBlockScreen = () => {
    setNavigateBlockEmpty(false);
    return false;
  }
  return (
    <>
      <Box id="container" className="Play-station">
        <Box className="top-menu-home-section">
          <Box className="Setting-box">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              style={{
                width: '100%',
                height: '100%',
                // backgroundColor: 'coral',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Img src={preloadedAssets?.Replay} className="setting-pad" />
              <Box className="replay-vertex">
                <Box
                  w={'100%'}
                  h={'100%'}
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'space-between'}
                >
                  <Box className="replay_game_text">
                    {NavigateBlockEmpty === true ? 'No blocks available. Click "Okay" to redirecting to the initial block' : replayState === 'Prompt' ? 'Do you want to continue from the Quest where you last paused?':'Do you want to continue from the screen where you last paused?'}
                  </Box>

                  <Box
                    display={'flex'}
                    justifyContent={NavigateBlockEmpty === true ? 'center' : 'space-between'}
                    w={'100%'}
                  >
                    {NavigateBlockEmpty === true ?
                      <Button background={'transparent !important'}>
                        <Img
                          src={preloadedAssets?.OkayBtn}
                          className="replay_game_btn"
                          onClick={HandleBlockScreen}
                        />
                      </Button>
                      :
                      replayState === 'Prompt'  ?   <>
                      <Button background={'transparent !important'}>
                        <Img
                          src={preloadedAssets?.No}
                          onClick={NextScreen}
                          className="replay_game_btn_cancel"
                        />
                      </Button>
                      <Button background={'transparent !important'}>
                        <Img
                          src={preloadedAssets?.Yes}
                          className="replay_game_btn"
                          onClick={QuestBlocklastpaused}
                        />
                      </Button>
                    </> :
                      <>
                        <Button background={'transparent !important'}>
                          <Img
                              src={preloadedAssets?.No}
                            onClick={NextScreen}
                            className="replay_game_btn_cancel"
                          />
                        </Button>
                        <Button background={'transparent !important'}>
                          <Img
                            src={preloadedAssets?.Yes}
                            className="replay_game_btn"
                            onClick={continueScreen}
                          />
                        </Button>
                      </>
                    }
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ModelPopup;