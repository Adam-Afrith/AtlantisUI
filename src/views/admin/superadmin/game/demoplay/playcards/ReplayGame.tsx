import { Box, Button, Icon, Img, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import ReplayBtn from 'assets/img/games/ReplayBtn.png';
import next from 'assets/img/screens/next.png';
import { ScoreContext } from '../GamePreview';
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const ReplayGame: React.FC<{
  formData?: any;
  imageSrc?: any;
  replayGame: any;
  // setCurrentScreenId: any;
  getData?: any;
  isOptionalReplay: any;
  setisOptionalReplay: any;
  profilescore: any;
  setisReplay: any;
  isReplay: any;
  data?: any;
  gameInfo: any;
  type?: any;
  setType: any;
  setData: any;
  replayNextHandler: any;
  preloadedAssets: any;
  setOptionalReplay?: any;
}> = ({
  setOptionalReplay,
  formData,
  imageSrc,
  replayGame,
  replayNextHandler,
  setisReplay,
  setisOptionalReplay,
  isOptionalReplay,
  profilescore,
  gameInfo,
  setData,
  setType,
  isReplay,
  // setCurrentScreenId,
  getData,
  data,
  type,
  preloadedAssets,
}) => {
    const { profile } = useContext(ScoreContext);
    const [replayMessage, setReplayMessage] = useState<string>(null);
    useEffect(() => {
      const currentQuestMasterData = gameInfo?.gameQuest[profile?.currentQuest - 1];
      if (currentQuestMasterData.hasOwnProperty('gameTotalScore')) {
        if (isReplay === true && isOptionalReplay !== true) {

          const differedScore = currentQuestMasterData?.gameTotalScore ? (parseInt(currentQuestMasterData?.gameTotalScore) - parseInt(profilescore)) : null;
          setReplayMessage(`You are only ${differedScore ?? 'few'} points away from a perfect score. Would you like to replay?`)
        }
        else if (isOptionalReplay === true) {
          setReplayMessage(`Your score is low. Would you like to play again?`);
        }
        else {
          setReplayMessage(`Would you like to play again?`);
        }
      }
    }, []);


    return (
      <>
        <Box id="container" className="Play-station">
          <Box className="top-menu-home-section">
            <Box className="Setting-box">
              <Img
                src={preloadedAssets?.overview}
                className="setting-pad"
              />
              <Box className="optional-vertex">
                <Box
                  w={'100%'}
                  h={'100%'}
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'space-between'}
                >
                  <Text className='replay_game_text'>
                    {replayMessage}
                  </Text>
                  <Box display={'flex'} justifyContent={'center'} w={'100%'}>
                    <Button
                      background={'transparent !important'}
                    >
                      <Img src={preloadedAssets?.OkayBtn} onClick={() => setOptionalReplay(false)} className='replay_game_btn' />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  };

export default ReplayGame;
