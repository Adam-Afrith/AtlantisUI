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

const ReplayPoints: React.FC<{
  setType: any;
  setData: any;
  preloadedAssets: any;
  demoBlocks: any;
  profile: any;
  setCurrentScreenId: (id: number) => void;
  setModelScreen: any;
  modelScreen: any;
  gameInfo:any;
  profileData:any;
  setOptions:any;
}> = ({
  setData,
  setType,
  preloadedAssets,
  demoBlocks,
  profile,
  setCurrentScreenId,
  setModelScreen,
  modelScreen,
  gameInfo,
  profileData,
  setOptions,
}) => {
  //modalType=>{screenId:number | null, reason:"noPreviousNaviagation"}  // if block has no previous block navigation
  //modalType=>{screenId:null, reason:"replayPoint"} //if a block navigate to replay point
  const handleReplayButtonClick = () => {
    setType(demoBlocks[profile?.currentQuest]['1']?.blockChoosen);
    setData(demoBlocks[profile?.currentQuest]['1']);
    if (demoBlocks[profile?.currentQuest]['1']?.blockChoosen === 'Interaction') {
    const optionsFiltered = [];
            for (const option of gameInfo.questOptions) {
              if (profileData?.Audiogetlanguage.length > 0) {
                if (option?.qpSequence === demoBlocks[profile?.currentQuest]['1']?.blockPrimarySequence) {
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
                if (option?.qpSequence === demoBlocks[profile?.currentQuest]['1']?.blockPrimarySequence) {
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
  const handleOk = () => {
    setModelScreen(false);
    setCurrentScreenId(13);
    return false;
  };
  const handleCancel = () => {
    setModelScreen(false);
    setCurrentScreenId(2);
  };
  return (
    <>
      {preloadedAssets.backgroundImage && (
        <>
          <Box className="takeaway-screen">
            <Box className="takeaway-screen-box">
              <Box position={'relative'}>
                <Img
                  src={preloadedAssets.backgroundImage}
                  className="bg-replay"
                />
                <Box className="replay_content">
                  <Box className="replay_content_center">
                    <Box className="title_replay">
                      <Text fontFamily={'AtlantisContent'} textAlign={'center'}>
                        {modelScreen === true
                          ? 'No previous block Do You want to redirect to Chapter Selection'
                          : 'You have been redirected to replay point. Click replay button to continue...!'}
                      </Text>
                    </Box>
                    <Box w={'100%'} display={'flex'} justifyContent={'center'}>
                      {modelScreen === true ? (
                        <>
                          {' '}
                          <Button onClick={handleOk}> ok</Button>
                          <Button onClick={handleCancel}> Cancel</Button>
                        </>
                      ) : (
                        <Img
                          src={preloadedAssets.replayBtn}
                          className="replay_buttons"
                          onClick={handleReplayButtonClick}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
        )}
      </>
    );
  };

export default ReplayPoints;
