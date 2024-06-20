import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { motion, useAnimation  } from 'framer-motion';
import { MdClose } from 'react-icons/md';

// Images
import Background from 'assets/img/games/fristscreenBackground.jpg';
import QueueBackground from 'assets/img/games/Quest_background.png';
import QueueScreen from 'assets/img/games/Queue_screen.png';
import Demo from 'assets/img/games/1700.jpg';
import Lock from 'assets/img/games/lock.png';
import { BiMoney } from 'react-icons/bi';
import { GiCoins } from 'react-icons/gi';
import { ScoreContext } from '../GamePreview';
import rib from 'assets/img/games/ribbon.png';
import { set } from 'lodash';
import { ProfileContext } from '../EntirePreview';
const ChapterPage: React.FC<{
  formData?: any;
  imageSrc: any;
  questState: any;
  setQuestState: any;
  demoBlocks: any;
  setCurrentScreenId: any;
  questOptions?: any;
  currentQuestNo?: any;
  setCurrentQuestNo?: any;
  gameQuest?: any;
  setData?: any;
  setType?: any;
  setOptions?: any;
  setFeedbackList?: any;
  preloadedAssets?: any;
  currentScreenId: any;
  setPreLogDatas: any;
  getPrevLogDatas: any;
  profileData: any;
  gameOptionSuffled: any;
  setRepeatPrevOption: any;
  setSelectedOption: any;
  questWiseMaxTotal:any;
  gameInfoTotalScore:any;
  gameInfo: any;
  setIsLoading?: any;
}> = ({
  imageSrc,
  demoBlocks,
  setCurrentScreenId,
  formData,
  questOptions,
  currentQuestNo,
  setCurrentQuestNo,
  gameQuest,
  questState,
  setQuestState,
  setData,
  setType,
  setOptions,
  setFeedbackList,
  preloadedAssets,
  currentScreenId,
  setPreLogDatas,
  getPrevLogDatas,
  profileData,
  gameOptionSuffled,
  setRepeatPrevOption,
  setSelectedOption,
  questWiseMaxTotal,
  gameInfoTotalScore,
  gameInfo,
  setIsLoading
}) => {
  const [questScores, setQuestScores] = useState(null);
  const [questWisePlayerScore, setQuestWisePlayerScore] = useState(null);

  const [AllowedReplayOption, setAllowedReplayOption] = useState(null);
  const useData = useContext(ProfileContext);  
  useEffect(() => {
     let GrandMaximumscore: any = {};
    let currentScores: any[];
    let getquest:any[];
    let maxScoreByQuest: { key: string; value: number }[] = [];
    profile?.score.map((profileQuest:any) =>
      {
        if(!getquest?.includes(profileQuest?.quest))
          {
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
            getquest = getFinalscores;
          }
      })
    
      getquest?.map((profileQuest:any) =>
    {
       const questStatus = questState[profileQuest?.quest];
    if (questStatus === 'completed') {
      // If the quest is completed, compare the scores
      if (profile?.score !== null && profile?.replayScore !== null) {
        currentScores =
          profile.score > profile.replayScore
            ? profile.score
            : profile.replayScore;
      } 
    } else if (questStatus === 'Started') {
      // If the quest is started, consider the score
        currentScores = profile?.score !== null || profile.score!==undefined ? profile.score : null; //null or currentScores or replayScore
      
    }
    else
    {
      if (profile?.score !== null && profile?.replayScore !== null) {
        currentScores =
          profile.score > profile.replayScore
            ? profile.score
            : profile.replayScore;

      } 
      else{
        if (profile?.score.length > 0) {
          currentScores = profile?.score 
      }
      } 
    }
        const currentQuestseqId = Array.isArray(currentScores)
          ? currentScores.map((item) => item.seqId)
          : [];
              // Check if currentScores is an array and has items  const qpScoreEntries = filteredOptions.map(option => ({ qpScore: option.qpScore }));
              if (Array.isArray(currentScores) && currentScores.length > 0) {
                // Map currentScores to extract scores
                const scores = currentScores.map((item) => item.score);
      
                const result = currentQuestseqId.map((seqId) => {
                  const QuestNo = seqId.split('.')[0];
                  if (QuestNo == profileQuest?.quest) {
                    const filteredOptions = questOptions?.filter(
                      (option: any) => option.qpSequence == seqId,
                    );
                    const qpScoresOption = filteredOptions.map((option: any) =>
                      parseInt(option.qpScore),
                    );
                    qpScoresOption.sort((a: any, b: any) => b - a);
                    if (!GrandMaximumscore[profileQuest?.quest]) {
                      GrandMaximumscore[profileQuest?.quest] = 0;
                    }
                    GrandMaximumscore[profileQuest?.quest] += qpScoresOption[0];
                  }
                  maxScoreByQuest = {...maxScoreByQuest, ...GrandMaximumscore}
                });
              } else {
                console.log('*****Options are not provided.');
              }
    })
    setQuestScores(maxScoreByQuest);

/**** setQuestPlayerScroe***/
const getQuestwisePlayerScore = async()=>{
let result: {[key: number]: number}= {};
  if(demoBlocks){

  Object.keys(demoBlocks).forEach((it: any, num: number) => {
      const scores = profile?.score;
      const sums: any = {};
      scores?.forEach((score: any) => {
        const quest = score.quest;
        if (!sums[quest]) {
          sums[quest] = 0;
        }
            sums[quest] += score.score;
      });
  
      let getFinalscores:any ={};
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
    const TotalScore = Object.entries(getFinalscores).reduce((tot:number, acc: any)=>{
      if(it == acc[0])
        { let questHasReplay=Object.keys(getReplayFinalscores).some((quest)=> quest === acc[0] );
            if(questHasReplay)
              {   
                getReplayFinalscores[acc[0]] > acc[1] ? (tot = getReplayFinalscores[acc[0]]) : (tot =acc[1]) 
              }
              else{
                tot =acc[1];
              }
              return tot;
        }
    },0);
    result = {...result, [parseInt(it)]: TotalScore ? TotalScore :getFinalscores[it]};
    })
  }
return result;
}

getQuestwisePlayerScore().then((score :any) => {
  setQuestWisePlayerScore(score);
});

  }, []);
  const { profile, setProfile } = useContext(ScoreContext);
  useEffect(() => {
    const currentQuest = profile?.currentQuest;
    gameQuest.map((item: any, index: number) => {
      const questNoAsString = item.gameQuestNo.toString();
      if (profile?.completedLevels?.includes(questNoAsString)) {
        const scores = profile?.score;
        if (scores !== undefined) {
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
            (row: any) => row.quest == item.gameQuestNo,
          );
          const finalscore = getscores?.score;
          if (formData?.gameDisableOptionalReplays === 'false') {
            if (item?.gameIsSetMinPassScore === 'true') {
              const getminpassscore = item?.gameMinScore;

              if (
                finalscore >= getminpassscore &&
                finalscore < item?.gameDistinctionScore
              ) {
                setQuestState((prevquestdataList: any) => ({
                  ...prevquestdataList,
                  [item.gameQuestNo]: 'replayallowed',
                }));
              } else {
                if (finalscore !== undefined) {
                  const status = gameInfo?.gameData?.gameDisableOptionalReplays === 'false' ? "replayallowed" : "completed";
                  
                  setQuestState((prevquestdataList: any) => ({
                    ...prevquestdataList,
                    [item.gameQuestNo]: 'replayallowed',
                  }));
                  return false;
                } else {
                  setQuestState((prevquestdataList: any) => ({
                    ...prevquestdataList,
                    [item.gameQuestNo]: 'Started',
                  }));
                  return false;
                }
              }
            } else {
              if (finalscore !== undefined) {
                setQuestState((prevquestdataList: any) => ({
                  ...prevquestdataList,
                  [item.gameQuestNo]: 'replayallowed',
                }));
                return false;
              } else {
                setQuestState((prevquestdataList: any) => ({
                  ...prevquestdataList,
                  [item.gameQuestNo]: 'Started',
                }));
                return false;
              }
            }
          } else {
            //Mandatory replay, even though formData?.gameDisableOptionalReplays is false, could allow when the min scroe is not set, or if has min score, then score less than minscore, it could navaigate to replay point
            if (finalscore !== undefined) {
              setQuestState((prevquestdataList: any) => ({
                ...prevquestdataList,
                [item.gameQuestNo]: 'completed',
              }));
            } else {
              setQuestState((prevquestdataList: any) => ({
                ...prevquestdataList,
                [item.gameQuestNo]: 'Started',
              }));
            }
          }
        }
      } else {
        setQuestState((prevquestdataList: any) => ({
          ...prevquestdataList,
          [item.gameQuestNo]: 'Locked',
        }));
      }
    });
  }, [profile]);

  const handleChapter = (it: any) => {   
   
    for (let values in questState) {
      if(values === it){
        if(questState[it] !== 'Locked'){
          useData?.setMotionEffect(true);
        }
        else {
          useData?.setMotionEffect(false);
        }
      }
    }    
    setTimeout(()=> {

   
    const Completionpage = Object.entries(questState).map(
      ([questId, status]) => ({ questId, status }),
    );
    const OpenStraigntCompletionPage = Completionpage.find(
      (row: any) => row.questId === it && row.status === 'completed',
    );

    if (OpenStraigntCompletionPage !== undefined) {
      setProfile((prev: any) => ({
        ...prev,
        currentQuest: it,
      }));
      setFeedbackList([]);
      setCurrentScreenId(6);
    } else {
      if (profile?.completedLevels?.includes(it)) {
          setPreLogDatas((prev: any) => ({
            ...prev,
            screenIdSeq: [currentScreenId],
          }));
        
        setType(demoBlocks[it]['1']?.blockChoosen);
        setData(demoBlocks[it]['1']);
        setRepeatPrevOption([]);
        setSelectedOption(null);
        if (demoBlocks[it]['1']?.blockChoosen === 'Interaction') {
          const optionsFiltered = [];
          const primarySequence = demoBlocks[it]['1'].blockPrimarySequence;
          for (const option of questOptions) {
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
          if (gameOptionSuffled === 'true') {
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
        setFeedbackList([]);
       


        const updatedCompletedLevels = new Set([
          ...profile?.completedLevels,
          it,
        ]);
        const resettedReplayScore =profile?.replayScore && profile.replayScore.filter((score: any)=> parseInt(score.quest) !== parseInt(it));
        setProfile((prev: any) => ({
          ...prev,
          currentQuest: it,
          replayScore: [...resettedReplayScore],
          completedLevels: [...updatedCompletedLevels],
        }));
        setCurrentScreenId(2);
      }
    }
    },300)
  };
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.8,
        staggerChildren: 1,
      },
    },
  };
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
console.log("gameInfoTotalScore", gameInfoTotalScore);

  return (
    <>
      {/* <Box className='black-shadow'>        */}
        <Box
          position="relative"
          maxW="100%"
          w={'100vw'}
          height="100vh"
          backgroundImage={imageSrc}
          backgroundSize={'cover'}
          backgroundRepeat={'no-repeat'}
          className="chapter_potrait"
        >
          <Grid
            templateColumns="repeat(1, 1fr)"
            gap={4}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="75%"
          >
            <GridItem colSpan={1} position={'relative'}>              
              <Img
                src={preloadedAssets.QueueBackground}
                h={'auto'}
                maxW={'100%'}
                loading="lazy"
              />             
              <Box className="chapter_title">Quest</Box>
              <Box className={'chapters_list_box'}>
                <Box w={'90%'}>
                  <motion.div
                    className="container"
                    variants={container}
                    initial="hidden"
                    animate="visible"                    
                  >
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{base:7,md:4,lg:7}}>
                    {demoBlocks &&
                      Object.keys(demoBlocks).map((it: any, num: number) => {
                          
                        return (
                          <motion.div
                            key={num}
                            className="item"
                            variants={item}
                          >
                              <Box
                                position={'relative'}
                                onClick={() => handleChapter(it)}
                              >
                                <Img src={preloadedAssets.Demo} width={'98%'} />
                                <Img
                                  className="queue-screen"
                                  position={'absolute'}
                                  left={'-2px'}
                                  top={'-2px'}
                                  src={preloadedAssets.QueueScreen}
                                  zIndex={999}
                                />
                                <Box w={'100%'} position={'absolute'} top={'0'}>
                                  <Text
                                    textAlign={'center'}
                                    right={'65px'}
                                    fontFamily={'AtlantisText'}
                                    color={'#D9C7A2'}
                                    zIndex={999999}
                                    fontSize={'5vh'}
                                    className={'quest_title'}
                                    textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
                                  >
                                    Quest {num + 1}
                                  </Text>
                                </Box>
                                <Box
                                    w={'100%'}
                                    position={'absolute'}
                                    bottom={'0'}
                                    color={'#D9C7A2'}
                                    fontFamily={'AtlantisText'}
                                    zIndex={999999}
                                    display={'flex'}
                                    justifyContent={'center'}
                                  >
                                    <Text
                                      className="amount-score"
                                      textAlign={'center'}
                                    >
                                     {questWisePlayerScore && questWisePlayerScore[it] ? questWisePlayerScore[it] : 0}
                                  /
                                  {questScores &&
                                  questScores[it] !== null &&
                                  questScores[it] > 0
                                    ? questScores[it]
                                    : 
                                    gameInfoTotalScore[num]?.gameQuestNo === parseInt(it) 
                                    ? gameInfoTotalScore[num].gameTotalScore
                                    :
                                     0}{' '}
                                </Text>
                                <Img
                                  h={'25px'}
                                  w={'auto'}
                                  src={preloadedAssets.MoneyIcon}
                                  zIndex={5}
                                />
                              </Box>
                              {profile?.completedLevels?.includes(it) ? (
                                Object.entries(questState).map(
                                  ([questId, status], index) =>
                                    questId === it && status === 'completed' ? (
                                      <Box className={'completed_level'}>
                                        {' '}
                                        <Box
                                          position={'relative'}
                                          display={'flex'}
                                          justifyContent={'center'}
                                        >
                                          {' '}
                                          <Img
                                            w={'40%'}
                                            h={'auto'}
                                            src={preloadedAssets?.Completed}
                                          />{' '}
                                        </Box>
                                      </Box>
                                    ) : questId === it &&
                                      status === 'replayallowed' ? (
                                      <Box className={'completed_level'}>
                                        {' '}
                                        <Box
                                          position={'relative'}
                                          display={'flex'}
                                          justifyContent={'center'}
                                        >
                                          {' '}
                                          <Img
                                            w={'40%'}
                                            h={'auto'}
                                            src={preloadedAssets?.Completed}
                                          />{' '}
                                        </Box>
                                      </Box>
                                    ) : questId === it &&
                                      status === 'locked' ? (
                                      <Img
                                        key={index}
                                        src={preloadedAssets.Lock}
                                        className="lock"
                                        width={'97%'}
                                        position={'absolute'}
                                        bg={'#2b2828d6'}
                                        top={'0'}
                                      />
                                    ) : questId === it &&
                                      status === 'Started' ? null : null,
                                )
                              ) : (
                                <Img
                                  src={preloadedAssets.Lock}
                                  className="lock"
                                  width={'97%'}
                                  position={'absolute'}
                                  bg={'#2b2828d6'}
                                  top={'0'}
                                />
                              )}
                            </Box>
                          </motion.div>
                        );
                      })}
                  </SimpleGrid>
                </motion.div>
              </Box>
              </Box>
            </GridItem>
          </Grid>
          {/* </motion.div> */}
        </Box>        
      {/* </Box> */}
    </>
  );
};

export default ChapterPage;
