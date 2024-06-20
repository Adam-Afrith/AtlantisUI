import { Img, Text, SimpleGrid, Box } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useContext, useState, useEffect } from 'react';
import { ProfileContext } from '../EntirePreview';
import { ScoreContext } from '../GamePreview';
import { motion } from 'framer-motion';

/** Temporary user Data to list */
const names = [
  { name: 'John', score: 300, allTimeScore: 1000 },
  { name: 'Jane', score: 400, allTimeScore: 800 },
  { name: 'Michael', score: 300, allTimeScore: 700 },
  { name: 'Emily', score: 200, allTimeScore: 600 },
  { name: 'David', score: 100, allTimeScore: 500 },
  { name: 'Sarah', score: 100, allTimeScore: 50 },
  { name: 'Daniel', score: 300, allTimeScore: 500 },
  { name: 'Jessica', score: 200, allTimeScore: 1000 },
  { name: 'Christopher', score: 100, allTimeScore: 1000 },
  { name: 'Amanda', score: 700, allTimeScore: 900 },
  { name: 'Matthew', score: 300, allTimeScore: 1000 },
  { name: 'Ashley', score: 500, allTimeScore: 900 },
  { name: 'Andrew', score: 500, allTimeScore: 700 },
  // { name: 'Jennifer', score: 500, allTimeScore: 600 },
  // { name: 'James', score: 400, allTimeScore: 500 },
  // { name: 'Elizabeth', score: 300, allTimeScore: 900 },
  // { name: 'Joseph', score: 200, allTimeScore: 900 },
  // { name: 'Lauren', score: 100, allTimeScore: 900 },
  // { name: 'Joshua', score: 500, allTimeScore: 700 },
  // { name: 'Megan', score: 500, allTimeScore: 800 },
  // { name: 'Robert', score: 100, allTimeScore: 900 },
  // { name: 'Kayla', score: 100, allTimeScore: 800 },
  // { name: 'William', score: 200, allTimeScore: 700 },
  // { name: 'Samantha', score: 800, allTimeScore: 900 },
  // { name: 'Daniel', score: 700, allTimeScore: 900 },
  // { name: 'Emily', score: 500, allTimeScore: 800 },
  // { name: 'Anthony', score: 400, allTimeScore: 700 },
  // { name: 'Nicole', score: 100, allTimeScore: 1000 },
  // { name: 'Brandon', score: 200, allTimeScore: 900 },
  // { name: 'Amber', score: 300, allTimeScore: 1000 },
  // { name: 'Ryan', score: 800, allTimeScore: 900 },
  // { name: 'Rachel', score: 800, allTimeScore: 1000 },
  // { name: 'Tyler', score: 100, allTimeScore: 900 },
  // { name: 'Brittany', score: 400, allTimeScore: 800 },
  // { name: 'Alexander', score: 300, allTimeScore: 1000 },
  // { name: 'Stephanie', score: 200, allTimeScore: 600 },
  // { name: 'Nicholas', score: 200, allTimeScore: 800 },
  // { name: 'Heather', score: 100, allTimeScore: 600 },
  // { name: 'Jacob', score: 100, allTimeScore: 600 },
  // { name: 'Michelle', score: 400, allTimeScore: 700 },
  // { name: 'Zachary', score: 200, allTimeScore: 600 },
  // { name: 'Tiffany', score: 500, allTimeScore: 600 },
  // { name: 'Kevin', score: 500, allTimeScore: 600 },
  // { name: 'Melissa', score: 200, allTimeScore: 600 },
  // { name: 'Steven', score: 400, allTimeScore: 1000 },
  // { name: 'Rebecca', score: 200, allTimeScore: 800 },
  // { name: 'Justin', score: 400, allTimeScore: 1000 },
  // { name: 'Chelsea', score: 100, allTimeScore: 700 },
  // { name: 'Brian', score: 400, allTimeScore: 600 }
]
const usersWithAllTimeScore = names.sort(() => Math.random() - 0.5).slice(0, 9);


const LeaderBoard: React.FC<{
  formData?: any;
  imageSrc?: any;
  getData?: any;
  data?: any;
  homeLeaderBoard?: any;
  setHomeLeaderBoard?: any;
  setCurrentScreenId?: any;
  gameInfo?: any;
  preloadedAssets: any;
  setPlayerTodayScore?: any;
  playerTodayScore?: any;
}> = ({
  imageSrc,
  formData,
  getData,
  data,
  setCurrentScreenId,
  homeLeaderBoard,
  setHomeLeaderBoard,
  gameInfo,
  preloadedAssets,
  setPlayerTodayScore,
  playerTodayScore,

}) => {
    const [shuffledUsers, setShuffledUsers] = useState<any[]>([]);
    const [allTimeClicked, setAllTimeClicked] = useState(false);
    const [newSortedUserss, setNewSortedUserss] = useState<any[]>([]);
    const [sortedUsers, setSortedUsers] = useState<any[]>([]);
    const playerInfo = useContext(ProfileContext);
    const contextValue = useContext(ScoreContext);
    const { profile, setProfile } = contextValue !== null ? contextValue : { profile: null, setProfile: null };
    const [sortAse, setSortAse] = useState({ daily: true, allTime: true });
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
      setPlayerTodayScore(TodayTotalScore);
    }
      //Sorted Users alltimeScore
      let playerScore:any;
      if(profile!==null)
        {
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
          playerScore = { name: playerInfo.name, score: playerTodayScore, allTimeScore: TodayTotalScore};
        }
        else{
          playerScore = { name: 'Player', score: 100, allTimeScore: 1000};
        }

      const mergedUsersPlayers = [playerScore, ...names].sort((a, b) => {
        // Sort by allTimeScore in descending order
        if (b.allTimeScore !== a.allTimeScore) {
          return b.allTimeScore - a.allTimeScore;
        }
        // If allTimeScores are equal, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
    
      //Sorted Using Score-starts for score position      
      let sortedUsingScore = [...mergedUsersPlayers].sort((a, b) => {
        // Sort by daily score in descending order
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // If scores are equal, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });

      let dailyPositionIndex = -1;
      sortedUsingScore = sortedUsingScore.map((usrScore: any, index: number) => {
        dailyPositionIndex = index + 1;
        let alltimePositionIndex = -1;
        let alltimePosition = mergedUsersPlayers.find((userDetail: any, indexvalue: number) => {
          if (userDetail.name == usrScore.name && userDetail.score == usrScore.score && userDetail.allTimeScore == usrScore.allTimeScore) {
            alltimePositionIndex = indexvalue + 1;
            return true;
          }
        });
        return ({ ...usrScore, dailyPosition: dailyPositionIndex, alltimePosition: alltimePositionIndex });
      })
      let  playerIndex :any;
      if(profile!==null)
        {
       playerIndex = sortedUsingScore.findIndex(x => x.name === playerInfo.name);
        }
        else
        {
          playerIndex = sortedUsingScore.findIndex(x => x.name === 'Player');
        }
      if (playerIndex !== -1) {
        // Remove it from its current position
        const unShiftedPlayer = sortedUsingScore.splice(playerIndex, 1)[0];
        // Add it to the beginning of the array
        sortedUsingScore.unshift(unShiftedPlayer);
        setShuffledUsers(sortedUsingScore);
      }

      
    }, []);

    const handleHome = () => {
      if (homeLeaderBoard) {
        setCurrentScreenId(homeLeaderBoard);
        setHomeLeaderBoard(null);
      } else {
        if (gameInfo) {
          if (
            gameInfo?.gameData?.gameIsShowReflectionScreen === 'true' &&
            gameInfo?.reflectionQuestions.length > 0
          ) {
            setCurrentScreenId(3); // Navigate to Reflection screen
          } else if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
            setCurrentScreenId(7); // Navigate to Takeaway screen
          } else {
            setCurrentScreenId(5); // Navigate to Thank you screen
          }
        }
      }
    };


    const handleAllTimeClick = async (type: string) => {
      let newSortedUsers = [...shuffledUsers];
      if (type === 'daily') {
        setSortAse((prev: any) => ({ ...prev, daily: !prev.daily }))

        newSortedUsers = [...shuffledUsers].sort((a: any, b: any) => {
          if (sortAse.daily) {
            if (a.score !== b.score) {
              return a.score - b.score;
            } else {
              return b.name.localeCompare(a.name);
            }
          } else {
            // Sort by score in descending order
            if (b.score !== a.score) {
              return b.score - a.score;
            } else {
              return a.name.localeCompare(b.name);
            }
          }
        });
        newSortedUsers = newSortedUsers.map((row: any, index: number) => ({
          ...row,
        }));

      } else if (type === 'alltime') {
        setSortAse((prev: any) => ({ ...prev, allTime: !prev.allTime }))
        // Sort the users by all-time score
        newSortedUsers = [...shuffledUsers].sort((a: any, b: any) => {
          if (sortAse.allTime) {
            if (b.allTimeScore !== a.allTimeScore) {
              return b.allTimeScore - a.allTimeScore;
            } else {
              return a.name.localeCompare(b.name);
            }
          } else {
            // Sort by allTimeScore in descending order
            if (a.allTimeScore !== b.allTimeScore) {
              return a.allTimeScore - b.allTimeScore;
            } else {
              return b.name.localeCompare(a.name);
            }
          }
        });

        newSortedUsers = newSortedUsers.map((row: any, index: number) => ({
          ...row,
        }));
      }

      // If playerData exists, move it to the first position
      const playerData = newSortedUsers.find(user => user.name === playerInfo.name);
      if (playerData) {
        const playerIndex = newSortedUsers.findIndex(x => x.name === playerData.name);

        if (playerIndex !== -1) {
          // Remove it from its current position
          const unShiftedPlayer = newSortedUsers.splice(playerIndex, 1)[0];
          // Add it to the beginning of the array
          newSortedUsers.unshift(unShiftedPlayer);
        }
      }
      // Update the state with the new sorted users
      setShuffledUsers(newSortedUsers);
    }

    const containerRef = useRef<any>(null);
    let lastScrollTop = 0;

    useEffect(() => {
      const container = containerRef?.current;
      if (!container) return; // Early return if container is not available
      const handleScroll = () => {
        let currentScrollTop = container?.scrollTop;
  
        if (currentScrollTop > lastScrollTop) {
          container.classList.add('scrollbar-down');
        } else {
          // Scrolling up
          container.classList.remove('scrollbar-down');
          // container.classList.remove('content-box');
        }
  
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
      };
  
      container.addEventListener('scroll', handleScroll);
  
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
      <>
        {imageSrc && (
          <motion.div initial={{ rotateY: 180, y: -100 }} animate={{ rotateY: 0, y: 0 }} transition={{type: 'spring', duration: 1}}>  
          <Box className="Leaderboard-screen">
            {formData?.gameIsShowLeaderboard ==='true'?
            <>
            <Img src={imageSrc} className="leaderboard-img" />
            <Text className='title'>LeaderBoard</Text>
            <Box className="content-box" id='leaderboard_id'  ref={containerRef}>
              <Box className="table-heading"
                fontFamily={'AtlantisText'}
                display={'flex'}
              >
                <Box
                  w={'200px'}
                  h={'50px'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Text
                    color={'#D9C7A2'}
                    style={{ cursor: 'pointer' }}
                  >
                    Player Name
                  </Text>
                </Box>
                <Img
                  src={preloadedAssets.Separator}
                  className="dot-img"
                  w={'10px'}
                  h={'65px'}
                  position={'relative'}
                />
                <Box w={'200px'} h={'50px'}>
                  <Box w={'100%'} display={'flex'} justifyContent={'center'}>
                    <Text color={'#D9C7A2'}
                      onClick={() => {
                        // Shuffle the daily leaderboard when All Time is clicked
                        handleAllTimeClick('daily');
                        setAllTimeClicked(true); // Update state to indicate All Time view
                      }}
                    >Daily</Text>
                  </Box>
                  <Box
                    w={'100%'}
                    display={'flex'}
                    justifyContent={'space-between'}
                  >
                    <Text textAlign={'center'} color={'#D9C7A2'}>
                      Position
                    </Text>
                    <Text textAlign={'center'} color={'#D9C7A2'}>
                      Score
                    </Text>
                  </Box>
                </Box>
                <Img
                  src={preloadedAssets.Separator}
                  className="dot-img"
                  w={'10px'}
                  h={'65px'}
                  position={'relative'}
                />
                <Box w={'200px'} h={'50px'}>
                  <Box w={'100%'} display={'flex'} justifyContent={'center'} >
                    <Text
                      color={'#D9C7A2'}
                      onClick={() => {
                        handleAllTimeClick('alltime');
                        setAllTimeClicked(false);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      All Time
                    </Text>
                  </Box>
                  <Box
                    w={'100%'}
                    display={'flex'}
                    justifyContent={'space-between'}
                  >
                    <Text textAlign={'center'} color={'#D9C7A2'}>
                      Position
                    </Text>
                    <Text textAlign={'center'} color={'#D9C7A2'}>
                      Score
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box>
                {shuffledUsers.map((item, index) => (
                  <Box
                    className="content-lead"
                    key={index}
                    _hover={{
                      filter: 'grayscale(50%)',
                      transform: 'scale(1.0)',
                      transition: 'transform 0.3s ease-in-out',
                      opacity: '0.8',
                    }}
                  >
                    <>
                      <Img
                        src={preloadedAssets.Entry}
                        className={'list-pad'}
                        _hover={{ filter: 'grayscale(0%)'}}
                        filter={index === 0 ? 'grayscale(0%)' : 'grayscale(50%)'}
                      />
                      <Box
                       className={'list-wrapper'}
                        _hover={{ filter: 'grayscale(0%)'}}
                        filter={index === 0 ? 'grayscale(0%)' : 'grayscale(50%)'}
                      >
                        <Box w={'30%'}>
                          <Text
                            textAlign={'center'}
                            color={'#161313'}
                            letterSpacing={'1px'}
                          >
                            {item.name ? item.name : 'Guest'}
                          </Text>
                        </Box>
                        <Box
                          w={'30%'}
                          display={'flex'}
                          justifyContent={'space-between'}
                        >
                          <Text textAlign={'center'} color={'#161313'}
                            letterSpacing={'1px'}>
                            {item.dailyPosition !== undefined ? item.dailyPosition : index + 1}
                          </Text>
                          <Text textAlign={'center'} color={'#161313'}
                            letterSpacing={'1px'}>
                            {item.score ? item.score : 0}
                          </Text>
                        </Box>
                        <Box
                          w={'30%'}
                          display={'flex'}
                          justifyContent={'space-between'}
                        >
                          <Text textAlign={'center'} color={'#161313'}
                            letterSpacing={'1px'}>
                            {item.alltimePosition !== undefined ? item.alltimePosition : index + 1}
                          </Text>
                          <Text textAlign={'center'} color={'#161313'}
                            letterSpacing={'1px'} >
                            {item.allTimeScore ? item.allTimeScore : 0}
                          </Text>
                        </Box>
                      </Box>
                    </>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box className='top-bar'>
              <Box className='list-wrapper'
              >
                <Box className='heading-box'>
                  <Img
                    src={preloadedAssets.Label}
                    className="heading-box-img"
                    w={'200px'}
                    h={'60px'}
                    position={'relative'}
                  />{' '}
                  <Box className='heading-box-content'
                    top={'0'}
                    fontFamily={'AtlantisText'}
                    fontSize={'x-large'}
                    position={'absolute'}
                    display={'flex'}
                    justifyContent={'center'}
                    width={'200px'}
                    mt={'3px'}
                  >
                    <Text>Department</Text>
                    {/* <Img
                      src={preloadedAssets.Arrow}
                      className="dot-img"
                      mt={'5px'}
                      ml={'3px'}
                      w={'30px'}
                      h={'30px'}
                      position={'relative'}
                    />{' '} */}
                  </Box>
                </Box>
                <Box className='heading-box'>
                  <Img
                    src={preloadedAssets.Label}
                    className="heading-box-img"
                    w={'200px'}
                    h={'60px'}
                    position={'relative'}
                  />{' '}
                  <Box className='heading-box-content'
                    top={'0'}
                    fontFamily={'AtlantisText'}
                    fontSize={'x-large'}
                    position={'absolute'}
                    display={'flex'}
                    justifyContent={'center'}
                    width={'200px'}
                    mt={'3px'}
                  >
                    <Text>Overall</Text>
                    {/* <Img
                      src={preloadedAssets.Arrow}
                      className="dot-img"
                      mt={'5px'}
                      ml={'3px'}
                      w={'30px'}
                      h={'30px'}
                      position={'relative'}
                    />{' '} */}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Img
              src={preloadedAssets.Close}
              className='close-btn'
              onClick={() => homeLeaderBoard ? handleHome() : getData(data)}
            />
            </>
            :
            <Text>No preview Available - Leaderboard</Text>}
          </Box>
          </motion.div>
          
        )}
      </>
    );
  };
export default LeaderBoard;


