import {
  Box,
  Icon,
  Img,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getGameById, getSkills } from 'utils/game/gameService';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { ProfileContext } from '../EntirePreview';
// import AudioEffect from './Audio';
const Welcome: React.FC<{
  setCurrentScreenId: any;
  formData: any;
  imageSrc: any;
  preview: any;
  intro: any;
  screen: any;
  preloadedAssets:any;
  currentScreenId:any;
  setPreLogDatas:any;
  getPrevLogDatas:any;

}> = ({ formData, imageSrc, preview, setCurrentScreenId, intro, screen, preloadedAssets,currentScreenId,setPreLogDatas,getPrevLogDatas  }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>([]);
  const [apSkl, setApSkl] = useState([]);
  const [authorArray, setauthorArray] = useState<any[]>([]);
  const [showComplete, setShowComplete] = useState(false)
  const [blackScreen, setBlackScreen] = useState(false)  
  const useData = useContext(ProfileContext)
  useEffect(() => {
    setShowComplete(true);
    setTimeout(() => {
      setShowComplete(false);
    }, 1000);
  }, []);
  const fetch = async () => {
    const result = await getGameById(formData?.gameId);
    if (result?.status !== 'Success') {
      setProfile([]);
      return console.log('getbackruond error:' + result?.message);
    } else {
      setProfile(result.data);
    }
    const res = await getSkills();
    if (res?.status === 'Success') {
      setApSkl(res?.data);
    }
  };
  const customStylesicon = {
    cursor: 'pointer',
    color: '#D9C7A2',
    marginRight: '4px',
  };
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (profile.gameSkills) {
      const Array = profile.gameSkills?.split(',');
      setauthorArray(Array);
    }
  }, [profile]);

  const findSkillName = (authorNumber: any) => {
    const matchedSkill = apSkl.find(
      (option: any) => option.id === Number(authorNumber),
    );
    return matchedSkill ? matchedSkill.name : null;
  };
  const renderContent = () => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = formData?.gameAdditionalWelcomeNote?.split(linkRegex);
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

  const data =
    formData?.gameLearningOutcome !== ''
      ? formData?.gameLearningOutcome?.split('\n')
      : '';

  const extractLink = (text: any) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (text) {
      const urls = text?.match(urlRegex);

      return urls ? urls[0] : null;
    }
    return null;
  };

  const containerRef = useRef<any>(null);
  let lastScrollTop = 0;

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return; // Early return if container is not available

    console.log('container', container);

    const handleScroll = () => {
      let currentScrollTop = container?.scrollTop;

      console.log('currentScrollTop', currentScrollTop);        

      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        // container.classList.add('content-box');
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
       <Box className="welcome-screen">
          <Box className="welcome-screen-box">
            <Img src={screen} className="welcome-pad" />
          </Box>
          <Box className="top-title">
            <Box w={'100%'} display={'flex'} justifyContent={'center'}>
              <Box>
                <Text
                  className="title"
                  fontSize={{
                    base: '13px',
                    sm: '13px',
                    md: '15px',
                    lg: '20px',
                  }}
                >
                  {formData.gameTitle}
                </Text>
              </Box>
            </Box>
            {formData.gameIsShowGameDuration === 'true' && (
              <Text
                className="duration"
                fontSize={{
                  base: '11px',
                  sm: '12px',
                  md: '13px',
                  lg: '15px',
                }}
                mt={'2px'}
                fontFamily={'content'}
                position={'absolute'}
                display={'flex'}
                alignItems={'center'}
              >
                <>
                  {' '}
                  <Icon as={FaClock} style={customStylesicon} />{' '}
                  <span style={customStylesicon}>
                    {formData.gameDuration > 1
                      ? formData.gameDuration + ' mins'
                      : 'Few mins'}
                  </span>
                </>
              </Text>
            )}
          </Box>
          <Box className="content-box" ref={containerRef}  fontFamily={'gametext'}>
            <Box w={'60%'} className="content">
              {formData.gameIsShowStoryline === 'true' && (
                <Text
                  className="text"
                  mt={'20px'}
                  fontSize={{
                    base: '11px',
                    sm: '12px',
                    md: '13px',
                    lg: '15px',
                  }}
                  fontFamily={'content'}
                >
                  {formData.gameStoryLine}
                </Text>
              )}
              {formData.gameIsShowSkill === 'true' ||
                formData.gameIsShowLearningOutcome === 'true' ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <Img
                    className="rewards-arrow-img"
                    src={preloadedAssets.rew}
                    mt={'25px'}
                    alt="rew"
                    w={'100%'}
                    h={'20px'}
                  />
                </motion.div>
              ) : (
                ''
              )}
              <Box
                className={
                  formData.gameIsShowSkill === 'true' ||
                    formData.gameIsShowLearningOutcome === 'true'
                    ? 'rewards-box'
                    : 'empty-rewards-box'
                }
              >
                {formData.gameIsShowSkill === 'true' && (
                  <>
                    <Box className="box-1">
                      <Img src={preloadedAssets.back} className="bg-img" />
                      <Img
                        className="rewards-arrow-img"
                        display={'block !important'}
                        src={preloadedAssets.SkillLearn}
                        mt={'25px'}
                        alt="rew"
                        w={'100%'}
                        h={'auto'}
                      />
                      <Box
                        className="inside-box"
                        mt={'10px'}
                        w={'100%'}
                      >
                        {authorArray
                          .map((authorItem, index) => {
                            const skillName = findSkillName(authorItem);
                            return skillName;
                          })
                          .filter((skillName) => skillName !== null)
                          .map((filteredSkillName, index) => (
                            <Box display={'flex'} key={index}>
                              <Img
                                src={preloadedAssets.write}
                                w={'25px'}
                                h={'25px'}
                              />
                              <Box>
                                <Box
                                  className="text-wrapper"
                                  display={'flex'}
                                  w={'50px'}
                                  h={'20px'}
                                  justifyContent={'space-between'}
                                  fontWeight={'300'}
                                  marginLeft={'5px'}
                                >
                                  <Text color={'#D9C7A2'}>
                                    {filteredSkillName}
                                  </Text>
                                  <Text></Text>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  </>
                )}
                {formData.gameIsShowLearningOutcome === 'true' && (
                  <>
                    <Box className="box-1">
                      <Img src={preloadedAssets.back} className="bg-img" />
                      <Img
                        className="rewards-arrow-img"
                        display={'block !important'}
                        src={preloadedAssets.SkillLearn}
                        mt={'25px'}
                        alt="rew"
                        w={'100%'}
                        h={'auto'}
                      />
                      <Box
                        className="inside-box"
                        mt={'10px'}
                        w={'100%'}
                      >
                        {data &&
                          data.map((it: any, ind: number) => {
                            const bulletIndex = it.indexOf('\u2022');
                            const contentAfterBullet =
                              bulletIndex !== -1
                                ? it.slice(bulletIndex + 1).trim()
                                : it;
                            return (
                              <Box display={'flex'} key={ind}>
                                <Img
                                  src={preloadedAssets.write}
                                  w={'25px'}
                                  h={'25px'}
                                />
                                <Box>
                                  <Box
                                    className="text-wrapper"
                                    display={'flex'}
                                    w={'50px'}
                                    h={'20px'}
                                    justifyContent={'space-between'}
                                    fontWeight={'300'}
                                    marginLeft={'5px'}
                                  >
                                    <Text color={'#D9C7A2'}>
                                      {contentAfterBullet}
                                    </Text>
                                    <Text></Text>
                                  </Box>
                                </Box>
                              </Box>
                            );
                          })}
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
              {formData.gameIsShowAuhorName === 'true' && (
                <Box
                  w={'100%'}
                  h={'50px'}
                  position={'relative'}
                  className="author"
                >
                  <Text
                    fontSize={{
                      base: '11px',
                      sm: '12px',
                      md: '13px',
                      lg: '15px',
                    }}
                    fontFamily={'content'}
                    color={'black'}
                    textAlign={'center'}
                  >
                    *Author* <br /> {formData.gameAuthorName}
                  </Text>
                </Box>
              )}
              {formData.gameIsShowAdditionalWelcomeNote === 'true' && (
                <Box
                  className="renderContent"
                  letterSpacing={'1px'}
                >
                  <Text
                    fontSize={{
                      base: '11px',
                      sm: '12px',
                      md: '13px',
                      lg: '15px',
                    }}
                    fontFamily={'content'}
                  >
                    {renderContent()}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          <Box className="next-btn">
            <Img
              src={preloadedAssets.next}
              onClick={() =>{
                useData?.setMotionEffect(true);              
                setTimeout(()=> {
                setCurrentScreenId(12);                 
                },300)
            }}
            />
          </Box>
        </Box>
      </>
  );
};
export default Welcome;
