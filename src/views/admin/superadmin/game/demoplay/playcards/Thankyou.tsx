import { Box, Button, Icon, Img, Text, Textarea } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import next from 'assets/img/screens/next.png'
import Feedback from 'assets/img/screens/Feedback.png';
import {
  FaHatCowboy,
} from 'react-icons/fa';
import { debounce } from 'lodash';

interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const ThankYou: React.FC<{
  setCurrentScreenId: any;
  formData: any;
  imageSrc: any;
  preloadedAssets: any;
  setPreLogDatas: (value: any) => void;
  getPrevLogDatas: any;
  gameInfo: any;
}> = ({ formData, imageSrc, setCurrentScreenId, preloadedAssets, setPreLogDatas, getPrevLogDatas, gameInfo }) => {
  const renderContentTy = () => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;

    const parts = formData.gameThankYouMessage?.split(linkRegex);

    const contentWithLinks = parts?.map((part: any, index: any) => {
      if (linkRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            style={{ color: '#caa784', textDecoration: 'underline' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        );
      } else {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }
    });

    return <React.Fragment>{contentWithLinks}</React.Fragment>;
  };
  const feedbackOptions = [
    formData.gameContent,
    formData.gameRecommendation,
    formData.gameRelevance,
    formData.gameGamification,
    formData.gameBehaviour,
    formData.gameOthers,
  ];
  const countfbOptions = feedbackOptions.filter(option => option !== '' && option !== 'false' && option !== undefined && option !== null).length;
  // ------------------------------------------Mohana

  const propertiesToCheck = [
    'gameContent',
    'gameRelevance',
    'gameBehaviour',
    'gameRecommendation',
    'gameGamification',
    'gameOthers',
  ];

  // Filter properties where the value is 'true'
  const trueValuesArray = propertiesToCheck.filter(property => formData[property] === 'true');
  const [userInputs, setUserInputs] = useState<any>(getPrevLogDatas?.playerInputs?.Thankyou);

  var thirdValue = "";
  if (trueValuesArray.length >= 3) {
    thirdValue = trueValuesArray[2];
  }

  const styleflex = {};

  if (countfbOptions === 1) {
    Object.assign(styleflex, {
      display: 'flex',
      flexDirection: 'row', // Display in a column for 1 or 3 divs
      justifyContent: 'center',
    });
  }


  const handleNext = () => {
    setPreLogDatas((prev: any) => ({
      ...prev,
      playerInputs: {
        ...prev.playerInputs, // Ensure prev.playerInputs exists
        Thankyou: userInputs // Assign userInputs to ThankYou key
      }
    }));
    setCurrentScreenId(13);
  }
  const previousNavigation = () => {
    if (formData?.gameIsShowTakeaway === 'true') {
      setCurrentScreenId(7);
      return false;
    }
    else if (
      formData?.gameIsShowReflectionScreen === 'true' &&
      gameInfo?.reflectionQuestions.length > 0
    ) {
      setCurrentScreenId(3);
      return false;
    } else if (formData?.gameIsShowLeaderboard === 'true') {
      setCurrentScreenId(4);
      return false;
    }
    else {
      setCurrentScreenId(13);
      return false;
    }
  }
  return (
    <>
      {preloadedAssets.Thankyou && (
        <Box className='section-thankyou-screen Thankyou-section'>
          <Img src={preloadedAssets.Thankyou} className="bg-img bg-thankyou" />
          <Box className="thankyou-screen">
            <Box className='content'>
              <Box
                w={'100%'}
                fontFamily={'content'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                className="tq-msg"
              >
                <Box
                  w={'80%'}
                  mt={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
                  lineHeight={1}
                  textAlign={'center'}
                  color="#D9C7A2"
                  fontWeight="300"
                >
                  Thanks for playing! Share with your friends to get them to play too!
                </Box>
              </Box>
              <Box
                w={'100%'}
                fontFamily={'content'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                className="tq-msg"
              >
                <Box
                  w={'80%'}
                  mt={{ base: '0px', sm: '0px', md: '20px', lg: '20px' }}
                  lineHeight={1}
                  textAlign={'center'}
                  color="#D9C7A2"
                  fontWeight="300"
                >
                  {renderContentTy()}
                </Box>
              </Box>
              {formData.gameIsCollectLearnerFeedback === 'true' && (
                <>
                  <Text
                    className="about-experience"
                    fontSize={18}
                    fontWeight="300"
                    textAlign="center"
                  >
                    <Img src={Feedback} alt="rew" w={'82%'} h={'23px'} />
                    How do you feel about the experience?
                  </Text>
                  <Box className="collect-learner-feedback">
                    <Box className="grid" style={styleflex}>
                      {formData.gameContent === 'true' && (
                        <div className='content-box' style={{ gridColumn: ((thirdValue === 'gameContent' && trueValuesArray.length == 3) || (trueValuesArray.length == 1)) ? 'span 2' : '' }}>

                          <Text
                            fontSize={18}
                            fontWeight="300"
                            textAlign="center"
                            border="2px solid #b3a484"
                          >
                            Content
                          </Text>
                          <div
                            className="content-div"
                            style={{
                              display: 'flex',
                              marginTop: '5px',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="buttonfeel" >
                              <p>
                                &#128522; I learned something useful
                              </p>
                            </div>
                            <div className="buttonfeel2" >
                              <p>
                                &#128542; It wasn't useful
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.gameRelevance === 'true' && (
                        <div className='content-box' style={{ gridColumn: ((thirdValue === 'gameRelevance' && trueValuesArray.length == 3) || (trueValuesArray.length == 1)) ? 'span 2' : '' }}>

                          <Text
                            fontSize={18}
                            fontWeight="300"
                            textAlign="center"
                            border="2px solid #b3a484"
                          >
                            Relevance
                          </Text>
                          <div
                            className="content-div"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="buttonfeel" >
                              {/* &#127891; */}
                              <p>
                                <Icon as={FaHatCowboy} /> I'll apply what I
                                learned
                              </p>
                            </div>
                            <div className="buttonfeel2" >
                              <p>
                                &#128542; It's not relevant to
                                me
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.gameBehaviour === 'true' && (
                        <div className='content-box' style={{ gridColumn: ((thirdValue === 'gameBehaviour' && trueValuesArray.length == 3) || (trueValuesArray.length == 1)) ? 'span 2' : '' }}>

                          <Text
                            fontSize={18}
                            fontWeight="300"
                            textAlign="center"
                            border="2px solid #b3a484"
                          >
                            Behaviour
                          </Text>
                          <div
                            className="content-div"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="buttonfeel" >
                              <p>
                                &#128526; I understood what
                                I can do differently
                              </p>
                            </div>
                            <div className="buttonfeel2" >
                              <p>
                                {' '}
                                &#128566; I am not sure
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.gameRecommendation === 'true' && (
                        <div className='content-box' style={{ gridColumn: ((thirdValue === 'gameRecommendation' && trueValuesArray.length == 3) || (trueValuesArray.length == 1)) ? 'span 2' : '' }}>

                          <Text
                            fontSize={18}
                            fontWeight="300"
                            textAlign="center"
                            border="2px solid #b3a484"
                          >
                            Recommendation
                          </Text>
                          <div
                            className="content-div"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="buttonfeel" >
                              <p>
                                {' '}
                                &#128522; I would recommend
                                this game to others
                              </p>
                            </div>
                            <div className="buttonfeel2" >
                              <p>
                                {' '}
                                &#128542; I wouldn't recommend
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.gameGamification === 'true' && (
                        <div className='content-box' style={{ gridColumn: ((thirdValue === 'gameGamification' && trueValuesArray.length == 3) || (trueValuesArray.length == 1)) ? 'span 2' : '' }}>

                          <Text
                            fontSize={18}
                            fontWeight="300"
                            textAlign="center"
                            border="2px solid #b3a484"
                          >
                            Gamification
                          </Text>
                          <div
                            className="content-div"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className="buttonfeel" >
                              <p>
                                &#128077; I would like to learn
                                via games
                              </p>
                            </div>
                            <div className="buttonfeel2" >
                              <p>
                                {' '}
                                &#128078; I don't like this
                                format
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.gameOthers === 'true' && (
                        <div className='content-box' style={{ gridColumn: ((thirdValue === 'gameOthers' && trueValuesArray.length === 3) || (trueValuesArray.length === 1)) ? 'span 2' : '' }}>
                          <Text
                            fontSize={16}
                            fontWeight="300"
                            letterSpacing="0px"
                            textAlign="center"
                            border="2px solid #b3a484"
                          >
                            Anything else you'd like to share
                          </Text>
                          <div
                            className="content-div"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              border: '2px solid #b3a484',
                            }}
                          >
                            <div className="buttonfeel3" style={{ height: '100%' }} >
                              <Textarea
                                outline="none"
                                focusBorderColor="none"
                                border="none"
                                width="100%"
                                color="#D9C7A2"
                                className='thankyou_textarea'
                                resize={'none'}
                                _focus={{ boxShadow: 'none', border: 'none' }}
                                fontFamily="AtlantisText"
                                onChange={(e: any) => setUserInputs(e.target.value)}
                                value={userInputs}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.gameFeedBack === 'true' && (
                        <>
                          <div className="last-item">
                            <Text
                              className=""
                              fontSize={18}
                              fontWeight="300"
                              textAlign="center"
                            >
                              {' '}
                              Could you please share your feedback with us on the
                              below link:
                            </Text>
                            <Text
                              className=""
                              fontSize={18}
                              fontWeight="300"
                              textAlign="center"
                            >
                              <a
                                href={formData.gameFeedBackLink}
                                style={{
                                  color: '#caa784',
                                  textDecoration: 'underline',
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {formData.gameFeedBackLink}
                              </a>
                            </Text>
                          </div>

                        </>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          <Box width={'100%'} display={'flex'} justifyContent={'center'} position={'absolute'} className='thankyou_next_div'>
            <Img
              src={preloadedAssets.backBtn}
              className={'thankyou_back'}
              onClick={() => previousNavigation()}
            />
            <Img src={preloadedAssets.NextBtn} className='thankyou_next_btn' w={'auto'} onClick={() => handleNext()} />
          </Box>
        </Box>
      )}
    </>
  );
};
export default ThankYou;


