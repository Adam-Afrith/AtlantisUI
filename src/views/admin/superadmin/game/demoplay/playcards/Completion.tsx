import { Box, Grid, GridItem, Img, Text } from '@chakra-ui/react';
import { useEffect, useState, useContext, useMemo } from 'react';
import { getImages } from 'utils/game/gameService';
import { motion } from 'framer-motion';
import { ScoreContext } from '../GamePreview';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

const Completion: React.FC<{
  formData: any;
  imageSrc: any;
  selectedBadge?: any;
  compliData?: any;
  setCompliData?: any;
  CompKeyCount?: any;
  preview?: any;
  questState: any;
  setType: any;
  setData: any;
  setQuestState: any;
  type: any
  getFeedbackData: any;
  setCurrentScreenId?: any;
  getData?: any;
  gameInfo: any;
  data?: any;
  setFeedbackNavigateNext: any;
  screen?: any;
  profile: any;
  completionScreenQuestOptions: any;
  questOptions: any;
  currentQuestNo: any;
  preloadedAssets: any;
  questWiseMaxTotal: any;
  gameInfoTotalScore: any;
  setProfile:any;
}> = ({
  setCurrentScreenId,
  preview,
  selectedBadge,
  formData,
  imageSrc,
  gameInfo,
  setType,
  setData,
  type,
  questState,
  setQuestState,
  compliData,
  setCompliData,
  setFeedbackNavigateNext,
  CompKeyCount,
  profile,
  getData,
  data,
  screen,
  getFeedbackData,
  completionScreenQuestOptions,
  questOptions,
  currentQuestNo,
  preloadedAssets,
  questWiseMaxTotal,
  gameInfoTotalScore,
  setProfile,
}) => {
  const previewStateData = useSelector((state: RootState) =>
    formData?.gameId && state.preview ? state.preview[formData?.gameId] : null,
  );
    const [imgb, setbImg] = useState<any>();
    const [showComplete, setShowComplete] = useState(false);
    const [curretQuestOptions, setCurrentQuestOptions] = useState(
      completionScreenQuestOptions.find(
        (quest: any) => quest.gameQuestNo == profile?.currentQuest,
      ),
    );
    const [geFinalscorequest, SetFinalscore] = useState(profile.playerGrandTotal?.questScores[parseInt(profile.currentQuest)]);
    const [questScores, setQuestScores] = useState(questWiseMaxTotal);
    const [quetCompletionMessage, setQuestCompletionMessage]= useState<string>("");
    const [testScoreTotal, setTestScoreTotal] = useState<number>(0);
    const [testplayerScore, setTestPlayerScore] = useState<number>(0);
    const findQuestCompletionMessage=()=>{
          const playerCurrentQuestGrandTotal = profile.playerGrandTotal.questScores[parseInt(currentQuestNo)];
      let completionScreenMessage="";
      const currentQuesTGameData=completionScreenQuestOptions.find((item: any)=> item.gameQuestNo === (parseInt(currentQuestNo)));
      if(currentQuesTGameData?.gameIsSetCongratsSingleMessage === 'true'){
        completionScreenMessage = currentQuesTGameData?.gameCompletedCongratsMessage;
      } 
      else if(currentQuesTGameData?.gameIsSetCongratsScoreWiseMessage ==='true'){
        if(playerCurrentQuestGrandTotal < currentQuesTGameData?.gameMinScore)
          {
            completionScreenMessage =  currentQuesTGameData?.gameMinimumScoreCongratsMessage;
          }
          else if(playerCurrentQuestGrandTotal >= currentQuesTGameData?.gameMinScore && playerCurrentQuestGrandTotal < currentQuesTGameData?.gameDistinctionScore)
          {
            completionScreenMessage =  currentQuesTGameData?.gameaboveMinimumScoreCongratsMessage;
          }
          else if(playerCurrentQuestGrandTotal >= currentQuesTGameData?.gameDistinctionScore){
            completionScreenMessage = currentQuesTGameData?.gameAboveDistinctionScoreCongratsMessage; 
          }
      }
      else{
        completionScreenMessage = currentQuesTGameData?.gameCompletedCongratsMessage;
      }
      setQuestCompletionMessage(completionScreenMessage);
    }
    useEffect(() => {
      setShowComplete(true);
      setTimeout(() => {
        setShowComplete(false);
      }, 1000);
      
  findQuestCompletionMessage()
    }, []);
     
   useEffect(()=>{
        if(completionScreenQuestOptions.length > 0){
        const currentQuestData = completionScreenQuestOptions.find(
          (quest: any) => quest.gameQuestNo == profile?.currentQuest,
        );
          setCurrentQuestOptions(currentQuestData);
        findQuestCompletionMessage();
      }
    },[completionScreenQuestOptions])

    function generateRoundedNumberInRange(min :number, max :number, interval: number) {
      // Generate a random number within the range
      let randomNum = Math.random() * (max - min) + min;
  
      // Round the random number to the nearest interval
      let roundedNum = Math.round(randomNum / interval) * interval;
  
      // Ensure the rounded number is within the range
      return Math.max(min, Math.min(roundedNum, max));
  }



useEffect(()=>{
const getAndSetMsgDummyScore: ()=> void = ()=>{
    const currentQuesTGameData = completionScreenQuestOptions.find((item: any)=> item.gameQuestNo === (parseInt(currentQuestNo)));    
    let completionScreenMessage='';
    let testPlayerScore = 0;

    if((previewStateData?.modifiedField === "gameIsSetCongratsSingleMessage" && previewStateData?.updatedValue === 'true' )||previewStateData?.modifiedField === "gameCompletedCongratsMessage" ){
      testPlayerScore = generateRoundedNumberInRange(currentQuesTGameData?.gameMinScore || 0 , currentQuesTGameData?.gameTotalScore || 200, 10);
      completionScreenMessage = currentQuesTGameData?.gameCompletedCongratsMessage;
    }
    else if(previewStateData?.modifiedField === "gameMinimumScoreCongratsMessage"){
      completionScreenMessage= currentQuesTGameData?.gameMinimumScoreCongratsMessage;
      testPlayerScore = (!geFinalscorequest || geFinalscorequest <= 0) && !isNaN(currentQuesTGameData?.gameDistinctionScore) &&  (currentQuesTGameData?.gameMinScore - (Math.round(( currentQuesTGameData?.gameMinScore*1)/10)));
      // setTestPlayerScore(testPlayerScore);
    }
    else if(previewStateData?.modifiedField === "gameaboveMinimumScoreCongratsMessage"){
      completionScreenMessage= currentQuesTGameData?.gameaboveMinimumScoreCongratsMessage;           
      testPlayerScore =(!geFinalscorequest || geFinalscorequest <= 0) && !isNaN(currentQuesTGameData?.gameDistinctionScore) &&  (currentQuesTGameData?.gameMinScore + (Math.round(((currentQuesTGameData?.gameDistinctionScore - currentQuesTGameData?.gameMinScore)*8)/10)));
    }
    else if(previewStateData?.modifiedField === "gameAboveDistinctionScoreCongratsMessage"){
        testPlayerScore =(!geFinalscorequest || geFinalscorequest <= 0) && !isNaN(currentQuesTGameData?.gameDistinctionScore) && currentQuesTGameData?.gameDistinctionScore+(Math.floor(((currentQuesTGameData?.gameTotalScore - currentQuesTGameData?.gameDistinctionScore)*1)/10));
        testPlayerScore = testPlayerScore > currentQuesTGameData?.gameTotalScore ? currentQuesTGameData?.gameDistinctionScore : testPlayerScore;
        completionScreenMessage= currentQuesTGameData?.gameAboveDistinctionScoreCongratsMessage;          
    }
    // else{
    //   testPlayerScore = generateRoundedNumberInRange(currentQuesTGameData?.gameMinScore || 0 , currentQuesTGameData?.gameTotalScore || 200, 10);
    //   completionScreenMessage = currentQuesTGameData?.gameCompletedCongratsMessage;
    // }
    setQuestCompletionMessage(completionScreenMessage);
    setTestPlayerScore(testPlayerScore);
    setTestScoreTotal(currentQuesTGameData?.gameTotalScore);
};  
  
if(previewStateData?.currentTab === 5 &&  previewStateData?.currentSubTab === 0)
  {
      getAndSetMsgDummyScore();
  }
},[previewStateData, curretQuestOptions, currentQuestNo ])

    const getcompletionquest = currentQuestNo - 1;

  /** This useEffect Only hanldes the total within the quest total */
useEffect(()=>{
let questTotalScore = Object.entries(profile?.playerGrandTotal?.questScores).reduce((totalScore: any, [key, value]: [any, any]) => {
  if (key == profile.currentQuest) {
      return totalScore + value;
  }
  return totalScore;
}, 0);
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
const getFinalscores = Object.entries(sums).map(([quest, score]) => ({
  quest,
  score,
}));
const getscores = getFinalscores.find(
  (row: any) => row.quest === profile?.currentQuest,
);
const finalscore = getscores?.score;              
questTotalScore = questTotalScore <= 0 ? finalscore : questTotalScore;
  SetFinalscore(questTotalScore);

},[profile.score])

const currentQuestScore = useMemo(() => {
  if (questScores && questScores[profile?.currentQuest]) {
    return questScores[profile?.currentQuest];
  } else {
    let currentScores: any[];
    let totalFlowScore:number = 0;
    const questStatus = questState[profile?.currentQuest];
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
        if (Array.isArray(currentScores) && currentScores.length > 0) {
          const result = currentQuestseqId.map((seqId) => {
            const QuestNo = seqId.split('.')[0];
            if (QuestNo == profile?.currentQuest) {
              const filteredOptions = questOptions?.filter(
                (option: any) => option.qpSequence == seqId,
              );
              const qpScoresOption = filteredOptions.map((option: any) =>
                parseInt(option.qpScore),
              );
              qpScoresOption.sort((a: any, b: any) => b - a);
              totalFlowScore += qpScoresOption[0];
            }
           
          });
        } 
        // else {
        //   console.log('*****Options are not provided.');
        // }
    return totalFlowScore >0 ? totalFlowScore : (curretQuestOptions?.gameTotalScore ?? 0);
  }
}, [questScores, profile?.currentQuest, gameInfoTotalScore]);
console.log("$$$$$$curretQuestOptions", curretQuestOptions)
console.log("$$$$$$profile?.currentQuest", profile?.currentQuest)
console.log("$$$$$$completionScreenQuestOptions", completionScreenQuestOptions)
return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="comple-screen">
            <Img src={preloadedAssets.Screen1} className="bg-img" />
            <Box className="title">
              <Text fontFamily={'AtlantisText'} textAlign={'center'}>
                {curretQuestOptions?.gameScreenTitle}
              </Text>
            </Box>
            <Box className="content-box">
              <Box className="congratulations">
                <Box className="content" mt="0px">
                      {quetCompletionMessage}
              </Box>
            </Box>
              <Box className="rewards-img-box">
                <Img className="rewards-arrow-img" src={preloadedAssets.rew} />
              </Box>
              <Box className="points-box">
                <Box className="box-1">
                  <Img src={preloadedAssets.back} className="box-1_img" />
                  <Text className="points-text" fontFamily={'content'}>
                    points
                  </Text>
                  <Box className="inside-box-1">
                    <Img
                      src={preloadedAssets.point}
                      className="inside-box-1_img"
                    />
                    <Text className="inside-points-text" fontFamily={'content'}>
                      
                      {`${geFinalscorequest ? geFinalscorequest : testplayerScore || 0} /${currentQuestScore > 0 || testScoreTotal || 0}`}
                      
                    </Text>
                  </Box>
                </Box>

                {curretQuestOptions?.gameIsSetBadge === 'true' && (
                  <Box className="box-2">
                    <Img src={preloadedAssets.back} className="box-2_img" />
                    <Text className="points-text" fontFamily={'content'}>
                      {curretQuestOptions?.gameBadgeName}
                    </Text>
                    {curretQuestOptions?.gameBadge &&
                      curretQuestOptions?.gameIsSetCriteriaForBadge === 'true' ? curretQuestOptions?.gameAwardBadgeScore <= geFinalscorequest ?
                      (
                        <Img className="inside-img" src={preloadedAssets[`Quest_${profile.currentQuest}`]} />
                      )
                      : <Img className="inside-img" src={preloadedAssets[`Quest_${profile.currentQuest}-shadow`]} />
                      :<Img className="inside-img" src={preloadedAssets[`Quest_${profile.currentQuest}`]} />
                    }{' '}
                  </Box>
                )}
              </Box>
            </Box>
            <Box className="next-btn">
              <Img src={preloadedAssets.backBtn} onClick={() => getData(data)} />
              <Img src={preloadedAssets.NextBtn} onClick={() => getData(data)} />
            </Box>
          </Box>
        </motion.div>
      </>
    );
  };
export default Completion;
