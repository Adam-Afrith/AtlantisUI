import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Img,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
  useTheme,
  useToast,
  // brindha start
  Select,
  Textarea,
  Link,
  Slider,
  Image,
  IconButton,
  Center,
  // brindha end
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  gameDuplicateQuestionEntirely,
  getImages,
  updateGame,
} from 'utils/game/gameService';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import BadgeImages from '../BadgeImages';
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md';
import { ImHappy } from 'react-icons/im';
import { TfiFaceSad } from 'react-icons/tfi';
import { BsEmojiSunglasses } from 'react-icons/bs';
import { FaRegFaceMehBlank } from 'react-icons/fa6';
import { IoIosThumbsUp } from 'react-icons/io';
import { IoIosThumbsDown } from 'react-icons/io';
import { BsQuestionSquare } from 'react-icons/bs';
import { BsEmojiNeutral } from 'react-icons/bs';
import { RiEmotionHappyLine } from 'react-icons/ri';
import { FaRegTired } from 'react-icons/fa';
import Thankyou from 'assets/img/games/thankyou.png';
import next from 'assets/img/screens/next.png';

import {
  FaComment,
  FaHatCowboy,
  FaRegCommentDots,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from 'react-icons/fa';
import Feedback from 'assets/img/screens/Feedback.png';
import TextField from 'components/fields/TextField';
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const TyContentScreen: React.FC<{ formData: any; imageSrc: any; preview: any, preloadedAssets?: any,
  ThankyouFeedback?:any }> = ({
  formData,
  imageSrc,
  preview,
  preloadedAssets,
  ThankyouFeedback,
}) => {
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
    const countfbOptions = feedbackOptions.filter(
      (option) =>
        option !== '' &&
        option !== 'false' &&
        option !== undefined &&
        option !== null,
    ).length;
    console.log('countfbOptions', countfbOptions);
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
    const trueValuesArray = propertiesToCheck.filter(
      (property) => formData[property] === 'true',
    );

    var thirdValue = '';
    if (trueValuesArray.length >= 3) {
      thirdValue = trueValuesArray[2];
      console.log('Third Positioned Value:', thirdValue);
    }

    const styleflex = {};

    if (countfbOptions === 1) {
      Object.assign(styleflex, {
        display: 'flex',
        flexDirection: 'row', // Display in a column for 1 or 3 divs
        justifyContent: 'center',
      });
    }
    return (
      <>
        {imageSrc && preview ? (
          <>
            <Box className="section-thankyou-screen Thankyou-section">
              <Img src={Thankyou} className="bg-img bg-thankyou" />
              {/* <Box className="thankyou-screen-box">
            </Box> */}
              <Box className="thankyou-screen">
                <Box className="content">
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
                            <div
                              className="content-box"
                              style={{
                                gridColumn:
                                  (thirdValue === 'gameContent' &&
                                    trueValuesArray.length == 3) ||
                                    trueValuesArray.length == 1
                                    ? 'span 2'
                                    : '',
                              }}
                            >
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
                                <div className="buttonfeel">
                                  <p>&#128522; I learned something useful</p>
                                </div>
                                <div className="buttonfeel2">
                                  <p>&#128542; It wasn't useful</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {formData.gameRelevance === 'true' && (
                            <div
                              className="content-box"
                              style={{
                                gridColumn:
                                  (thirdValue === 'gameRelevance' &&
                                    trueValuesArray.length == 3) ||
                                    trueValuesArray.length == 1
                                    ? 'span 2'
                                    : '',
                              }}
                            >
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
                                <div className="buttonfeel">
                                  {/* &#127891; */}
                                  <p>
                                    <Icon as={FaHatCowboy} /> I'll apply what I
                                    learned
                                  </p>
                                </div>
                                <div className="buttonfeel2">
                                  <p>&#128542; It's not relevant to me</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {formData.gameBehaviour === 'true' && (
                            <div
                              className="content-box"
                              style={{
                                gridColumn:
                                  (thirdValue === 'gameBehaviour' &&
                                    trueValuesArray.length == 3) ||
                                    trueValuesArray.length == 1
                                    ? 'span 2'
                                    : '',
                              }}
                            >
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
                                <div className="buttonfeel">
                                  <p>
                                    &#128526; I understood what I can do
                                    differently
                                  </p>
                                </div>
                                <div className="buttonfeel2">
                                  <p> &#128566; I am not sure</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {formData.gameRecommendation === 'true' && (
                            <div
                              className="content-box"
                              style={{
                                gridColumn:
                                  (thirdValue === 'gameRecommendation' &&
                                    trueValuesArray.length == 3) ||
                                    trueValuesArray.length == 1
                                    ? 'span 2'
                                    : '',
                              }}
                            >
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
                                <div className="buttonfeel">
                                  <p>
                                    {' '}
                                    &#128522; I would recommend this game to
                                    others
                                  </p>
                                </div>
                                <div className="buttonfeel2">
                                  <p> &#128542; I wouldn't recommend</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {formData.gameGamification === 'true' && (
                            <div
                              className="content-box"
                              style={{
                                gridColumn:
                                  (thirdValue === 'gameGamification' &&
                                    trueValuesArray.length == 3) ||
                                    trueValuesArray.length == 1
                                    ? 'span 2'
                                    : '',
                              }}
                            >
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
                                <div className="buttonfeel">
                                  <p>&#128077; I would like to learn via games</p>
                                </div>
                                <div className="buttonfeel2">
                                  <p> &#128078; I don't like this format</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {formData.gameOthers === 'true' && (
                            <div
                              className="content-box"
                              style={{
                                gridColumn:
                                  (thirdValue === 'gameOthers' &&
                                    trueValuesArray.length == 3) ||
                                    trueValuesArray.length == 1
                                    ? 'span 2'
                                    : '',
                              }}
                            >
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
                                <div className="buttonfeel3">
                                  <p>
                                    <Icon as={FaRegCommentDots} />
                                  </p>
                                  <div>
                                    <p>{ThankyouFeedback}</p>
                                  </div>
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
                                  Could you please share your feedback with us on
                                  the below link:
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
              <Box className="next-btn">
                <Img src={next} />
              </Box>
              {/* <Box className='next-btn' style={{ position: 'absolute', display:'flex', top:'100px', right:'0' , justifyContent:'center'}}>
              <Img src={next} />
            </Box> */}
              {/* <Box className='next-btn' style={{ position: 'fixed', bottom: '-1', right: '100' }}>
              <Img src={next} />
            </Box> */}
            </Box>
          </>
        ) : (
          <>
            <Box
              w={'100%'}
              h={'100%'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box
                w={'auto'}
                position={'relative'}
                h={'100%'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Img
                  src={imageSrc}
                  h={'auto'}
                  w={'100%'}
                  transition={'transform 0.3s ease'}
                  transform={{ lg: 'scale(1)', '2xl': 'scale(1.3)' }}
                />
                <Box
                  position={'absolute'}
                  transition={'transform 0.3s ease'}
                  transform={{ lg: 'scale(1)', '2xl': 'scale(1.25)' }}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flexDirection={'column'}
                  w={'100%'}
                  h={'37%'}
                  top={{ base: '34.5%', '2xl': '35.5%' }}
                  fontFamily={'AtlantisText'}
                >
                  <Box className={'thankyou_scroll_content'}>
                    {/* <Box className="thankyou-screen"> */}
                    <Box
                      w={'100%'}
                      // fontFamily={'content'}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      className="ty_tq_msg"
                    >
                      <Box
                        w={'80%'}
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
                          className="about_experience"
                          fontSize={18}
                          fontWeight="300"
                          textAlign="center"
                        >
                          <Img
                            src={Feedback}
                            // mt={'25px'}
                            alt="rew"
                            w={'82%'}
                            h={'23px'}
                          // ml={'50px'}
                          />
                          How do you feel about the experience?
                        </Text>
                        <Box className="collect_learner_feedback">
                          <Box className="grid">
                            {formData.gameContent === 'true' && (
                              <div
                                className="content-box"
                                style={{
                                  gridColumn:
                                    (thirdValue === 'gameContent' &&
                                      trueValuesArray.length === 3) ||
                                      trueValuesArray.length === 1
                                      ? 'span 2'
                                      : '',
                                }}
                              >
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
                                  <div
                                    className="buttonfeel"
                                    style={{
                                      width:
                                        (thirdValue === 'gameContent' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p>&#128522; I learned something useful</p>
                                  </div>
                                  <div
                                    className="buttonfeel2"
                                    style={{
                                      width:
                                        (thirdValue === 'gameContent' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p>&#128542; It wasn't useful</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {formData.gameRelevance === 'true' && (
                              <div
                                className="content-box"
                                style={{
                                  gridColumn:
                                    (thirdValue === 'gameRelevance' &&
                                      trueValuesArray.length === 3) ||
                                      trueValuesArray.length === 1
                                      ? 'span 2'
                                      : '',
                                }}
                              >
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
                                    marginTop: '5px',
                                  }}
                                >
                                  <div
                                    className="buttonfeel"
                                    style={{
                                      width:
                                        (thirdValue === 'gameRelevance' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p>
                                      <Icon as={FaHatCowboy} /> I'll apply what
                                      I learned
                                    </p>
                                  </div>
                                  <div
                                    className="buttonfeel2"
                                    style={{
                                      width:
                                        (thirdValue === 'gameRelevance' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p>&#128542; It's not relevant to me</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {formData.gameBehaviour === 'true' && (
                              <div
                                className="content-box"
                                style={{
                                  gridColumn:
                                    (thirdValue === 'gameBehaviour' &&
                                      trueValuesArray.length == 3) ||
                                      trueValuesArray.length == 1
                                      ? 'span 2'
                                      : '',
                                }}
                              >
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
                                    marginTop: '5px',
                                  }}
                                >
                                  <div
                                    className="buttonfeel"
                                    style={{
                                      width:
                                        (thirdValue === 'gameBehaviour' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p>
                                      &#128526; I understood what I can do
                                      differently
                                    </p>
                                  </div>
                                  <div
                                    className="buttonfeel2"
                                    style={{
                                      width:
                                        (thirdValue === 'gameBehaviour' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p> &#128566; I am not sure</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {formData.gameRecommendation === 'true' && (
                              <div
                                className="content-box"
                                style={{
                                  gridColumn:
                                    (thirdValue === 'gameRecommendation' &&
                                      trueValuesArray.length == 3) ||
                                      trueValuesArray.length == 1
                                      ? 'span 2'
                                      : '',
                                }}
                              >
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
                                    marginTop: '5px',
                                  }}
                                >
                                  <div
                                    className="buttonfeel"
                                    style={{
                                      width:
                                        (thirdValue === 'gameRecommendation' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p>
                                      {' '}
                                      &#128522; I would recommend this game to
                                      others
                                    </p>
                                  </div>
                                  <div
                                    className="buttonfeel2"
                                    style={{
                                      width:
                                        (thirdValue === 'gameRecommendation' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p> &#128542; I wouldn't recommend</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {formData.gameGamification === 'true' && (
                              <div
                                className="content-box"
                                style={{
                                  gridColumn:
                                    (thirdValue === 'gameGamification' &&
                                      trueValuesArray.length == 3) ||
                                      trueValuesArray.length == 1
                                      ? 'span 2'
                                      : '',
                                }}
                              >
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
                                    marginTop: '5px',
                                  }}
                                >
                                  <div
                                    className="buttonfeel"
                                    style={{
                                      width:
                                        (thirdValue === 'gameGamification' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p>
                                      &#128077; I would like to learn via games
                                    </p>
                                  </div>
                                  <div
                                    className="buttonfeel2"
                                    style={{
                                      width:
                                        (thirdValue === 'gameGamification' &&
                                          trueValuesArray.length == 3) ||
                                          trueValuesArray.length == 1
                                          ? '180px'
                                          : '110px',
                                    }}
                                  >
                                    <p> &#128078; I don't like this format</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {formData.gameOthers === 'true' && (
                              <div
                                className="content-box"
                                style={{
                                  gridColumn:
                                    (thirdValue === 'gameOthers' &&
                                      trueValuesArray.length == 3) ||
                                      trueValuesArray.length == 1
                                      ? 'span 2'
                                      : '',
                                }}
                              >
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
                                    marginTop: '5px',
                                    border: '2px solid #b3a484',
                                  }}
                                >
                                  <div className="buttonfeel3">
                                    <p>
                                      <Icon as={FaRegCommentDots} />
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {formData.gameFeedBack === 'true' && (
                              <>
                                <div className="last_item">
                                  <Text
                                    className=""
                                    fontSize={18}
                                    fontWeight="300"
                                    textAlign="center"
                                  >
                                    {' '}
                                    Could you please share your feedback with us
                                    on the below link:
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
                    {/* <Box
                      className="next-btn"
                      style={{
                        position: 'absolute',
                        display: 'flex',
                        top: '167px',
                        right: '0',
                        justifyContent: 'center',
                        zIndex: '9999',
                      }}
                    >
                      <Img src={next} />
                    </Box> */}
                    {/* </Box> */}
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* <Box className='section-thankyou-screen'>
          <Box className="thankyou-screen-box">
            <Img src={imageSrc} className="bg-img" />
          </Box>
          <Box className="thankyou-screen">
            <Box
              w={'100%'}
              fontFamily={'content'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              className="tq-msg"
            >
              <Box
                // h={'100px'}
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
                  <Img src={Feedback} mt={'25px'} alt="rew" w={'82%'} h={'23px'} ml={'50px'} /> 
                  How do you feel about the experience?
                </Text>
                <Box className="collect-learner-feedback">
                  <Box className="grid">
                    {formData.gameContent === 'true' && (
                      <div className="content-box" style={{ gridColumn: ((thirdValue === 'gameContent' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? 'span 2' : '' }}>
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
                          <div className="buttonfeel"  style={{ width: ((thirdValue === 'gameContent' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                            &#128522; I learned something useful
                            </p>
                          </div>
                          <div className="buttonfeel2"  style={{ width: ((thirdValue === 'gameContent' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                            &#128542; It wasn't useful
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {formData.gameRelevance === 'true' && (
                      <div className="content-box" style={{ gridColumn: ((thirdValue === 'gameRelevance' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? 'span 2' : '' }}>
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
                          <div className="buttonfeel"  style={{ width: ((thirdValue === 'gameRelevance' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                              <Icon as={FaHatCowboy} /> I'll apply what I learned
                            </p>
                          </div>
                          <div className="buttonfeel2"  style={{ width: ((thirdValue === 'gameRelevance' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                            &#128542; It's not relevant to me
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {formData.gameBehaviour === 'true' && (
                      <div className="content-box" style={{ gridColumn: ((thirdValue === 'gameBehaviour' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? 'span 2' : '' }}>
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
                          <div className="buttonfeel"  style={{ width: ((thirdValue === 'gameBehaviour' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                            &#128526; I understood what I
                              can do differently
                            </p>
                          </div>
                          <div className="buttonfeel2"  style={{ width: ((thirdValue === 'gameBehaviour' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                              {' '}
                              &#128566; I am not sure
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {formData.gameRecommendation === 'true' && (
                      <div className="content-box" style={{ gridColumn: ((thirdValue === 'gameRecommendation' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? 'span 2' : '' }}>
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
                          <div className="buttonfeel"  style={{ width: ((thirdValue === 'gameRecommendation' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                              {' '}
                              &#128522; I would recommend
                              this game to others
                            </p>
                          </div>
                          <div className="buttonfeel2"  style={{ width: ((thirdValue === 'gameRecommendation' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                              {' '}
                              &#128542; I wouldn't recommend
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {formData.gameGamification === 'true' && (
                      <div className="content-box" style={{ gridColumn: ((thirdValue === 'gameGamification' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? 'span 2' : '' }}>
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
                          <div className="buttonfeel"  style={{ width: ((thirdValue === 'gameGamification' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
                            <p>
                            &#128077; I would like to learn
                              via games
                            </p>
                          </div>
                          <div className="buttonfeel2"  style={{ width: ((thirdValue === 'gameGamification' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? '180px' : '110px' }}>
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
                      <div className="content-box" style={{ gridColumn: ((thirdValue === 'gameOthers' && trueValuesArray.length==3) || (trueValuesArray.length==1)) ? 'span 2' : '' }}>
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
                          <div className="buttonfeel3">
                            <p>
                              <Icon as={FaRegCommentDots} />
                            </p>
                            <div>
                                <p>{ThankyouFeedback}</p>
                              </div>
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
             <Box className='next-btn' style={{ position: 'absolute', display:'flex', top:'167px', right:'0' , justifyContent:'center', zIndex:'9999'}}>
              <Img src={next} />
            </Box>
          </Box>
        </Box> */}
          </>
        )}
      </>
    );
  };
export default TyContentScreen;
