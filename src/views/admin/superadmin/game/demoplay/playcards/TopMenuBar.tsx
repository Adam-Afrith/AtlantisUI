import {
  Box,
  Button,
  Img,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ScoreContext } from '../GamePreview';
import { motion } from 'framer-motion';
interface TopMenuProps {
  dontShowTopMenu: boolean;
  preloadedAssets: any;
  currentScreenId: number;
  setCurrentScreenId: (id: number) => void;
  isSettingOpen: boolean;
  setIsSettingOpen: (opt: boolean) => void;
  setHomeLeaderBoard: (id: number) => void;
  profileData: any;
  gameInfo: any;
  demoBlocks: any;
  data: any;
  setAudioObj: (obj: any) => void;
  audioObj: any;
  questState: any;
  setIsOpenCustomModal: (value: boolean) => void;
  EnumType: any;
  getPrevLogDatas: any;
  setPreLogDatas: any;
}

const TopMenuBar: React.FC<TopMenuProps> = ({
  dontShowTopMenu,
  preloadedAssets,
  currentScreenId,
  setCurrentScreenId,
  isSettingOpen,
  setIsSettingOpen,
  setHomeLeaderBoard,
  profileData,
  gameInfo,
  demoBlocks,
  data,
  setAudioObj,
  audioObj,
  questState,
  setIsOpenCustomModal,
  EnumType,
  getPrevLogDatas,
  setPreLogDatas,
}) => {
  const [geFinalscorequest, SetFinalscore] = useState(null);
  const { profile, setProfile } = useContext<{ profile: any; setProfile: any }>(
    ScoreContext,
  );
  const [progressPercent, setProgressPercent] = useState<any>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  useEffect(() => {
    const scores = profile?.score;
    if (scores && scores.length > 0) {
      const sums = scores?.reduce(
        (accumulator: { [key: string]: number }, score: any) => {
          const quest = score.quest;
          if (accumulator?.[quest] != undefined) {
            accumulator[quest] = (accumulator[quest] || 0) + score.score;
            return accumulator;
          }
        },
        0,
      );
      SetFinalscore(sums);
    }
  }, []);

  const handleOverView = () => { 
    if (!isButtonDisabled) {
      setIsButtonDisabled(true); // Disable the button
      if (currentScreenId === 2 || currentScreenId === 15) {
        setHomeLeaderBoard(currentScreenId);
        setCurrentScreenId(15);
      } else {
        setHomeLeaderBoard(currentScreenId);
        setCurrentScreenId(4);
      }

      // Re-enable the button after a delay (e.g., 1 second)
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 1000);
    }
  };
  useEffect(() => {
    const progressResult = () => {
      //calculate Progress based on screen, Need to show different progress for current screen is in story, progress of the current quest, unless  show the entire game progress
      if (currentScreenId === 2) {
        const currentQuestBlocks = demoBlocks[profile?.currentQuest];
        const totalblockCount = Object.keys(currentQuestBlocks).length;
        const keyWithValueOfCurrentBlock = Object.keys(currentQuestBlocks).find(
          (key: any) => {
            const obj = currentQuestBlocks[key];
            const blockPrimarySequence = obj?.blockPrimarySequence;
            if (blockPrimarySequence) {
              const hasMatchingSequence =
                blockPrimarySequence.trim() ===
                (data?.blockPrimarySequence || '').trim();
              return hasMatchingSequence;
            }
            return false;
          },
        );
        const progressBarRatio: any =
          keyWithValueOfCurrentBlock &&
          (parseInt(keyWithValueOfCurrentBlock) > 0
            ? (parseInt(keyWithValueOfCurrentBlock) - 1) / totalblockCount
            : 0);
        setProgressPercent(
          progressBarRatio && progressBarRatio > 0 ? progressBarRatio : 0,
        );
      } else {
        const uniqueQuestIds = [...new Set(profile?.completedLevels)]; //returns ['1', '2', '3'] if it has ['1','2','2','3']

        //collect the actually completed quest list to show the the progress
        const completedQuestList = uniqueQuestIds.filter((quest: any) => {
          const isCurrentQuestCompleted = Object.entries(questState).some(
            ([key, value]: [any, any]) => {
              return (
                key === quest && ['replayallowed', 'completed'].includes(value)
              );
            },
          );
          return isCurrentQuestCompleted;
        });

        const completedQuest = completedQuestList.length;
        let gameProgress = 0;
        if (completedQuest > 0) {
          gameProgress = completedQuest / gameInfo?.gameQuest?.length;
        }
        setProgressPercent(gameProgress && gameProgress > 0 ? gameProgress : 0);
      }
    };

    progressResult();
  }, [data, currentScreenId, questState]);

  const handleMusicVolume = (sliderValue: number, type: string) => {
    if (!isNaN(sliderValue) && isFinite(sliderValue)) {
      const newVolume = sliderValue / 100;

      setAudioObj((prev: any) => ({
        ...prev,
        type: type === EnumType.BGM ? EnumType.BGM : EnumType.VOICE, // Update type based on parameter
        volume: newVolume.toString(),
      }));
    }
  };
  useEffect(() => {
    // Update preLogDatas with the new audio volume
    const { type, volume } = audioObj;
    const preLogAudioData = getPrevLogDatas?.audioVolumeValue ? {...getPrevLogDatas.audioVolumeValue} : {bgVolume: 0.5 , voVolume: 0.5 };
    let updatedAudioData:any ;
    if(type === EnumType.BGM){
       updatedAudioData =  {...preLogAudioData, bgVolume : volume };
    }
    else{
       updatedAudioData =  {...preLogAudioData, voVolume : volume };
    }    
    setPreLogDatas((prev: any) => ({...prev,audioVolumeValue: updatedAudioData}));
  }, [audioObj]);

  const totalPoints = useMemo(() => {
    let total: number = 0;
    let TotalScore:number = 0 ;
    if ([2, 4, 6, 8, 9, 14,15].includes(currentScreenId)) {
      const scoreArray =
        questState[parseInt(profile?.currentQuest)] == 'Started'
          ? profile?.score
          : profile?.replayScore;
      if (scoreArray?.length > 0) {
        total = scoreArray.reduce((acc: number, cur: any) => {
          if (cur.quest == profile.currentQuest) {
            return acc + cur.score;
          } else {
            return acc;
          }
        }, 0);
      }
      if([4, 6, 8, 9, 14].includes(currentScreenId))
        {
          if (profile?.score.length > 0) {
            TotalScore = profile?.score?.reduce((acc: number, cur: any) => {
              if (cur.quest == profile.currentQuest) {
                return acc + cur.score;
              } else {
                return acc;
              }
            }, 0);
          }
        }
    } else {
      const scores = profile?.score;
          const sums: any = {};
          scores?.forEach((score: any) => {
            const quest = score.quest;
            if (!sums[quest]) {
              sums[quest] = 0;
            }
                sums[quest] += score.score;            
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
                Replaysums[quest] += score.score;
          });
      
          let getReplayFinalscores : {[key: number]:  number} ={};
           Object.entries(Replaysums).forEach(([quest, score]) => 
            {
              const IntQuest = parseInt(quest);
              getReplayFinalscores = { ...getReplayFinalscores, [IntQuest]: score};
          });

        total = Object.entries(getFinalscores).reduce((tot:number, acc: any)=>{
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
    }
   
    return isNaN(total) || total === 0 ? TotalScore : total;
  }, [profile.score, profile.replayScore, currentScreenId]);
  
  return (
    <Box className="top-menu-home-section">
      {dontShowTopMenu && !isSettingOpen ? (
        <>
          <Box w="100%" h="auto" position={'relative'}>
            <Img
              src={preloadedAssets.TopMenu}
              className="top-menu-img"
              h={'auto !important'}
            />
            <Box className="new-top-menu">
              <Box
                w={'10%'}
                h={'100%'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Tooltip
                  label="Home"
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  background={'transparent'}
                  boxShadow={'unset'}
                  backgroundImage={preloadedAssets.TooltipImg}
                  backgroundRepeat={'no-repeat'}
                  backgroundSize={'contain'}
                  backgroundPosition={'center'}
                  filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                  padding={'10px'}
                  height={'70px'}
                  w={'150px'}
                  fontSize={'29px'}
                  fontFamily={'AtlantisText'}
                  color={'#000'}
                  overflow={'hidden'}
                  lineHeight={'25px'}
                >
                  <Img
                    src={preloadedAssets.home}
                    width={'auto'}
                    height={'70%'}
                    position={'relative'}
                    zIndex={9999}
                    onClick={() => setCurrentScreenId(1)}
                  />
                </Tooltip>
                <Tooltip
                  label="Profile"
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  background={'transparent'}
                  boxShadow={'unset'}
                  backgroundImage={preloadedAssets.TooltipImg}
                  backgroundRepeat={'no-repeat'}
                  backgroundSize={'contain'}
                  backgroundPosition={'center'}
                  filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                  padding={'10px'}
                  height={'70px'}
                  w={'150px'}
                  fontSize={'29px'}
                  fontFamily={'AtlantisText'}
                  color={'#000'}
                  overflow={'hidden'}
                  lineHeight={'25px'}
                >
                  <Img
                    src={preloadedAssets.Profile}
                    width={'auto'}
                    height={'70%'}
                    position={'relative'}
                    zIndex={9999}
                    onClick={() => setIsOpenCustomModal(true)}
                  />
                </Tooltip>
              </Box>
              <Box w={'42.5%'}>
                <Box
                  w="90%"
                  h={'100%'}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Tooltip
                    label="Progress"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'AtlantisText'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >
                    <Box
                      h={'70%'}
                      w={'auto'}
                      position={'relative'}
                      zIndex={9999}
                    >
                      <Img
                        src={preloadedAssets?.ProgressBar}
                        h={'100%'}
                        width={'auto'}
                      />
                      <Box
                        position={'absolute'}
                        display={'flex'}
                        top={0}
                        left={'4%'}
                        w={'90%'}
                        h={'100%'}
                      >
                        <Box
                          w={'28.5%'}
                          display={'flex'}
                          justifyContent={'center'}
                          alignItems={'center'}
                          h={'100%'}
                        >
                          <Text
                            textAlign={'center'}
                            className="progress_percentage"
                          >
                            {Math.floor(progressPercent * 100)}%
                          </Text>
                        </Box>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          w={'70%'}
                          h={'100%'}
                        >
                          {Array.from(
                            {
                              length: Math.floor((progressPercent * 100) / 10),
                            },
                            (_, index) => (
                              <Box
                                w={'9%'}
                                h={'40%'}
                                ml={'1%'}
                                background={
                                  'linear-gradient(to bottom, #009400, #00000000)'
                                }
                                key={index}
                              ></Box>
                            ),
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Tooltip>
                  <Tooltip
                    label="Score"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'AtlantisText'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >
                    <Box
                      h={'70%'}
                      w={'auto'}
                      position={'relative'}
                      zIndex={9999}
                    >
                      <Img
                        src={preloadedAssets?.Scorebox}
                        h={'100%'}
                        width={'auto'}
                      />
                      <Box
                        position={'absolute'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        top={0}
                        left={'26%'}
                        w={'68%'}
                        h={'100%'}
                      >
                        <Text className="score_text">{totalPoints}</Text>
                      </Box>
                    </Box>
                  </Tooltip>
                  <Tooltip
                    label={
                      currentScreenId === 2 || currentScreenId === 15
                        ? 'Overview'
                        : 'LeaderBoard'
                    }
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'AtlantisText'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >
                    <Img
                      src={
                        currentScreenId === 2 || currentScreenId === 15
                          ? preloadedAssets.Overview
                          : preloadedAssets.leadBtn
                      }
                      onClick={handleOverView}
                      width={'auto'}
                      height={'70%'}
                      position={'relative'}
                      zIndex={9999}
                      pointerEvents={isButtonDisabled ? 'none' : 'auto'}
                    />
                  </Tooltip>
                  <Tooltip
                    label="Settings"
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    background={'transparent'}
                    boxShadow={'unset'}
                    backgroundImage={preloadedAssets.TooltipImg}
                    backgroundRepeat={'no-repeat'}
                    backgroundSize={'contain'}
                    backgroundPosition={'center'}
                    filter={'drop-shadow(0px 2px 5px #1b1a1ab5)'}
                    padding={'10px'}
                    height={'70px'}
                    w={'150px'}
                    fontSize={'29px'}
                    fontFamily={'AtlantisText'}
                    color={'#000'}
                    overflow={'hidden'}
                    lineHeight={'25px'}
                  >
                    <Img
                      src={preloadedAssets.Setting}
                      onClick={() => setIsSettingOpen(true)}
                      width={'auto'}
                      height={'70%'}
                      position={'relative'}
                      zIndex={9999}
                    />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      ) : null}

      {isSettingOpen ? (
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
            <Img src={preloadedAssets.SettingPad} className="setting-pad" />

            <Box className="music-volume volumes">
              <Slider
               aria-label="slider-ex-4"
               name="musicVolume"
                defaultValue={
                  getPrevLogDatas?.audioVolumeValue?.bgVolume * 100 || 25
                }
                onChangeEnd={(value) => handleMusicVolume(value, EnumType.BGM)}
              >
                <SliderTrack
                  className="slider-track"
                  height="15px"
                  borderRadius="80px"
                >
                  <Box position="relative">
                    <Img
                      w={'100%'}
                      h={'auto'}
                      src={preloadedAssets.VolumeTrack}
                      alt="Volume Track"
                    />
                    <Box
                      position="absolute"
                      top="47%"
                      left="45%"
                      transform="translate(-50%, -50%)"
                      width="86%"
                    >
                      <SliderFilledTrack className="filled-volume" bg="pink.500" />
                      <SliderThumb
                        boxSize={10}
                        background={'transparent'}                        
                      // left={'calc(100% - 30%)'}
                      >
                        <Img className='slider_thumb' src={preloadedAssets.SliderPointer} />
                      </SliderThumb>
                    </Box>
                  </Box>
                </SliderTrack>                
              </Slider>
            </Box>

            <Box className="voice-volume volumes">
              <Slider
                aria-label="slider-ex-4"
                defaultValue={
                  getPrevLogDatas?.audioVolumeValue?.voVolume * 100 || 25
                }
                onChangeEnd={(value) =>
                  handleMusicVolume(value, EnumType.VOICE)
                }
              >
                <SliderTrack
                  className="slider-track"
                  height="15px"
                  borderRadius="80px"
                >
                  <Box position="relative">
                    <Img
                      w={'100%'}
                      h={'auto'}
                      src={preloadedAssets.VolumeTrack}
                      alt="Volume Track"
                    />
                    <Box
                      position="absolute"
                      top="47%"
                      left="45%"
                      transform="translate(-50%, -50%)"
                      width="86%"
                    >
                      <SliderFilledTrack className="filled-volume" bg="pink.500" />
                      <SliderThumb boxSize={10} background={'transparent'} >
                        <Img className='slider_thumb' src={preloadedAssets.SliderPointer} />
                      </SliderThumb>
                    </Box>
                  </Box>
                </SliderTrack>
              </Slider>
            </Box>
            <Box className="btns">
              <Button
                className="okay-btn btn"
                onClick={() => setIsSettingOpen(false)}
              >
                <Img src={preloadedAssets.OkayBtn} />
              </Button>
            </Box>
          </motion.div>
        </Box>
      ) : null}
    </Box>
  );
};

export default TopMenuBar;
