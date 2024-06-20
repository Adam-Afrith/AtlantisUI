import {
  Box,
  Img,
  Text,
  // brindha end
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import rew from 'assets/img/screens/Reward Bar.png';
import back from 'assets/img/screens/back.png';
import point from 'assets/img/screens/points.png';
import next from 'assets/img/screens/next.png';
import {
  getImages,
} from 'utils/game/gameService';
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
  compliData: any;
  setCompliData: any;
  CompKeyCount: any;
}

const CompletionContentScreen: React.FC<{
  formData: any;
  imageSrc: any;
  selectedBadge?: any;
  compliData: any;
  setCompliData?: any;
  CompKeyCount: any;
  preview: any;
  preloadedAssets?: any;
}> = ({
  preview,
  selectedBadge,
  formData,
  imageSrc,
  compliData,
  // setCompliData,
  CompKeyCount,
  preloadedAssets
}) => {
    const [imgb, setbImg] = useState<any>();
    useEffect(() => {
      const fetchDatass = async () => {
        if (compliData[CompKeyCount]?.gameBadge) {
          const result = await getImages(4);
          if (result?.status !== 'Success') {
            console.error('getbackground error:' + result?.message);
            return;
          }
          const selectedGasId = compliData[CompKeyCount]?.gameBadge;
          const selectedGasImage = result?.data.find(
            (gas: any) => gas.gasId == selectedGasId,
          );
          const imageUrl =
            selectedGasImage?.gasAssetImage || 'defaultImageURL.jpg';

          setbImg(imageUrl);
        }
      };
      fetchDatass();
    }, [compliData]);
    return (
      <>
        {imageSrc && preview ? (
          <>
            <Box className="comple-screen">
              <Img src={imageSrc} className="bg-img" />
              <Box className="title">
                <Text fontFamily={'AtlantisText'} textAlign={'center'}>
                  {compliData[CompKeyCount]?.gameScreenTitle}
                </Text>
              </Box>
              <Box className='content-box'>
                <Box className="congratulations">
                  <Box className="content" mt="0px">

                    {/* {compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === 'true' && compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'false' ? (
                  <>{compliData[CompKeyCount]?.gameCompletedCongratsMessage}</>
                ): <></>}  */}
                    {/* {(compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === 'true' && compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'false') || (compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === 'false' && compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'false') || (compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'false' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'false') ? ( */}
                    {((compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === 'true' || compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === undefined) && compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'false') || (compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === 'false' && compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'false') || (compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'false' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'false') ? (
                      <>{compliData[CompKeyCount]?.gameCompletedCongratsMessage || "Congratulations! You have Completed..."}</>
                    ) : <></>}
                    {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'true' && compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'false' ? (
                      <>{compliData[CompKeyCount]?.gameAboveDistinctionScoreCongratsMessage}</>
                    ) : <></>}
                    {/* {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'true' && compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' ? (
                  <>{compliData[CompKeyCount]?.gameAboveDistinctionScoreCongratsMessage} {compliData[CompKeyCount]?.gameAboveDistinctionScoreCongratsMessage === '' || compliData[CompKeyCount]?.gameaboveMinimumScoreCongratsMessage === '' ? '' : '&'} {compliData[CompKeyCount]?.gameaboveMinimumScoreCongratsMessage}</>
                ): <></>}  */}
                    {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'true' && compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' ? (
                      <>{compliData[CompKeyCount]?.gameAboveDistinctionScoreCongratsMessage} </>
                    ) : <></>}
                    {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'true' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' && compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'false' ? (
                      <>{compliData[CompKeyCount]?.gameaboveMinimumScoreCongratsMessage}</>
                    ) : <></>}



                    {compliData[CompKeyCount]?.gameCompletedCongratsMessage === '' && (
                      <><div style={{ height: '100px' }}></div></>
                    )}
                    {/* {compliData[CompKeyCount]?.gameCompletedCongratsMessage} */}
                    {/* {
                  compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage !=
                    true &&
                  compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage !=
                    true
                    ? compliData[CompKeyCount]?.gameCompletedCongratsMessage
                    : compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage ==
                      true
                    ? compliData[CompKeyCount]?.gameIsSetMinPassScore &&
                      compliData[CompKeyCount]?.gameMinScore &&
                      compliData[CompKeyCount]?.gameMinScore > 0
                      ? profile?.score < compliData[CompKeyCount]?.gameMinScore
                        ? compliData[CompKeyCount]?.gameMinimumScoreCongratsMessage
                        : compliData[CompKeyCount]?.gameIsSetDistinctionScore &&
                          profile?.score <
                            compliData[CompKeyCount]?.gameDistinctionScore
                        ? compliData[CompKeyCount]
                            ?.gameaboveMinimumScoreCongratsMessage
                        : compliData[CompKeyCount]?.gameIsSetDistinctionScore &&
                          profile?.score >=
                            compliData[CompKeyCount]?.gameDistinctionScore
                        ? compliData[CompKeyCount]
                            ?.gameAboveDistinctionScoreCongratsMessage
                        : compliData[CompKeyCount]
                            ?.gameIsSetCongratsSingleMessage == true &&
                          compliData[CompKeyCount]?.gameCompletedCongratsMessage
                      : compliData[CompKeyCount]?.gameCompletedCongratsMessage
                    : compliData[CompKeyCount]?.gameCompletedCongratsMessage} */}
                  </Box>
                </Box>
                <Box className="rewards-img-box">
                  <Img className="rewards-arrow-img" src={rew} />
                </Box>
                <Box className="points-box">
                  <Box className="box-1">
                    <Img src={back} className="box-1_img" />
                    <Text className="points-text" fontFamily={'content'}>
                      points
                    </Text>
                    <Box className="inside-box-1">
                      <Img src={point} className="inside-box-1_img" />
                      <Text className="inside-points-text" fontFamily={'content'}>
                        {(compliData[CompKeyCount]?.gameMinScore || 100) +
                          '/' +
                          (compliData[CompKeyCount]?.gameTotalScore ? (compliData[CompKeyCount]?.gameTotalScore || 100) : '')}
                      </Text>
                    </Box>
                  </Box>
                  {compliData[CompKeyCount]?.gameIsSetBadge === 'true' && (
                    <Box className='box-2'>
                      <Img src={back} className='box-2_img' />
                      <Text className='points-text' fontFamily={'content'}
                      >
                        {compliData[CompKeyCount]?.gameBadgeName}
                      </Text>
                      {compliData[CompKeyCount]?.gameBadge && (
                        <Img
                          className='inside-img'
                          src={imgb}
                        // ml={'23px'}
                        // mt={'2px'}
                        // borderRadius={'10px'}
                        // w={'50px'}
                        // h={'50px'}
                        // alt="Selected Badge Image"
                        />
                      )}            </Box>
                  )}
                </Box>
              </Box>
              <Box className="next-btn">
                <Img src={next} />
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box className="comple-screen">
              <Img src={imageSrc} className="bg-img" />
              <Box className="title">
                <Text>{compliData[CompKeyCount]?.gameScreenTitle}</Text>
              </Box>
              <Box className='content-box'>
                <Box className="congratulations">
                  {!compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage &&
                    !compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage && (
                      <Box className="content" mt="0px">
                        {compliData[CompKeyCount]?.gameCompletedCongratsMessage}
                      </Box>
                    )}
                  {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage ==
                    'true' && (
                      <>
                        {compliData[CompKeyCount]?.gameMinimumScoreCongratsMessage}
                        {
                          compliData[CompKeyCount]
                            ?.gameLessthanDistinctionScoreCongratsMessage
                        }
                        {
                          compliData[CompKeyCount]
                            ?.gameAboveDistinctionScoreCongratsMessage
                        }
                      </>
                    )}
                </Box>
                <Box className="rewards-img-box">
                  <Img className="rewards-arrow-img" src={rew} />
                </Box>
                <Box className="points-box">
                  <Box className="box-1">
                    <Img src={back} className="box-1_img" />
                    <Text className="points-text" fontFamily={'content'}>
                      points
                    </Text>
                    <Box className="inside-box-1">
                      <Img src={point} className="inside-box-1_img" />
                      <Text className="inside-points-text" fontFamily={'content'}>
                        {(compliData[CompKeyCount]?.gameMinScore || 100) +
                          '/' +
                          (compliData[CompKeyCount]?.gameTotalScore
                            ? compliData[CompKeyCount]?.gameTotalScore?.maxScore ||
                            100
                            : '')}
                      </Text>
                    </Box>
                  </Box>
                  {compliData[CompKeyCount]?.gameIsSetBadge === 'true' && (
                    <Box className="box-2">
                      <Img src={back} className="box-2_img" />
                      <Text className="points-text" fontFamily={'content'}>
                        {compliData[CompKeyCount]?.gameBadgeName}
                      </Text>
                      {compliData[CompKeyCount]?.gameBadge && (
                        <Img className="inside-img" src={imgb} />
                      )}{' '}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box className="next-btn">
                <Img src={next} />
              </Box>
            </Box>
          </>
        )}
      </>
    );
  };
export default CompletionContentScreen;
