import {
  Box,
  Img,
  Text
  // brindha end
} from '@chakra-ui/react';
import React from 'react';

import bull from 'assets/img/screens/bullet.png';
import right from 'assets/img/games/right.png';
import nextBtn from 'assets/img/screens/next.png';
const Takeway: React.FC<{
  formData: any;
  imageSrc: any;
  getData?: any;
  data?: any;
  preloadedAssets: any;
  gameInfo:any;
  setCurrentScreenId:any;
}> = ({ formData, imageSrc, getData, data,preloadedAssets,gameInfo,setCurrentScreenId }) => {
  const content = formData.gameTakeawayContent?.split('\n');
const previousNavigation =() =>
  {
     if (
      formData?.gameIsShowReflectionScreen === 'true' &&
      gameInfo?.reflectionQuestions.length > 0
    ) {
      setCurrentScreenId(3);
      return false;
    } else if (formData?.gameIsShowLeaderboard === 'true') {
      setCurrentScreenId(4);
      return false;
    }
    else{
      setCurrentScreenId(13);
      return false;
    }
  }
  // const backNavigation = () => {
  //   if (formData?.gameIsShowLeaderboard === 'true') {
  //     setCurrentScreenId(4); //Navigate to leaderboard
  //     return false;
  //   }
  //   else {
  //     setCurrentScreenId(13);
  //     return false;
  //   }
  // }
  return (
    <>
      {imageSrc && (
        <Box className="takeaway-screen"> 
          <Box className="takeaway-screen-box">
          {formData?.gameIsShowTakeaway ==='true' ?
            (<>
            <Img src={imageSrc} className="bg-take" />
            <Box
              className="content-box"             
            >
              <Box>
                {content &&
                  content.map((it: any, ind: number) => {
                    const bulletIndex = it.indexOf('\u2022');
                    const contentAfterBullet =
                      bulletIndex !== -1
                        ? it.slice(bulletIndex + 1).trim()
                        : it;
                    return (
                      <Box
                        className="content"
                        fontFamily={'AtlantisText'}
                        color={'#D9C7A2'}
                        key={ind}
                      >
                        <>
                          <Img
                            src={preloadedAssets.bull}
                            className="dot-img"
                            w={'16px'}
                            h={'16px'}
                          />
                          {contentAfterBullet}
                        </>
                      </Box>
                    );
                  })}
              </Box>              
            </Box>
            <Box className='next-btn-box'>
                <Img
                    src={preloadedAssets.backBtn}
                    className={'interaction_button'}
                    onClick={()=>previousNavigation()}
                  />
                <Img
                  src={preloadedAssets.NextBtn}                 
                  onClick={()=>getData(data)}
                />
              </Box>
              </>)
              : <Text>"No preview available - TakeAway"</Text>}
          </Box>
        </Box>
      )}
    </>
  );
};
export default Takeway;
