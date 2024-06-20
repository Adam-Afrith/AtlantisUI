import { Box, Grid, GridItem, Icon, Img, Button, Text, FormLabel } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { FaLanguage } from "react-icons/fa6";
import { ProfileContext } from '../EntirePreview';

interface GameIntroType {
  preloadedAssets: any;
  setCurrentScreenId: (id: number) => void;
  setIsGetsPlayAudioConfirmation: (value: boolean) => void;
  setPreLogDatas?: any;
  getPrevLogDatas?: any;
  currentScreenId?: any;
  ModelControl: any;
  setModelControl: any;
  gameInfo: any;
  hasMulitLanguages: boolean;
  setIsOpenCustomModal: (value: boolean)=> void;
  setReplayState: any;
  setReplayIsOpen:any;
}

const GameIntroScreen: React.FC<GameIntroType> = ({ preloadedAssets, setCurrentScreenId, setIsGetsPlayAudioConfirmation, setPreLogDatas, getPrevLogDatas, currentScreenId, ModelControl, setModelControl, gameInfo, hasMulitLanguages, setIsOpenCustomModal,setReplayState,setReplayIsOpen}) => {
  const useData = useContext(ProfileContext)
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);


  const Handlemodel = () => {
    useData?.setMotionEffect(true);
    if (getPrevLogDatas?.playerType === 'creator') {
      const getplayerid = getPrevLogDatas?.playerId; 
          if (getPrevLogDatas?.screenIdSeq?.length > 0) {
              const screenlast = getPrevLogDatas.screenIdSeq;
              const getLastScreenId = screenlast[0];
              if (getLastScreenId === 2) {
                setReplayState('Prompt');
                setReplayIsOpen(true);
                return false;
              }
              else {
                
                setModelControl(true);
                return false;
              }
            
          }
          else
          {
            setCurrentScreenId(1);
            return false;
          }
    }
    else
    {
        setCurrentScreenId(1);
        return false;
      

    }
}

  return (
    <Box
      position="relative"
      maxW="100%"
      w={'100vw'}
      height="100vh"
      backgroundImage={preloadedAssets?.introBgImage}
      backgroundSize={'cover'}
      backgroundRepeat={'no-repeat'}
      className="chapter_potrait"
      backgroundColor={'#0d161e'}
    >
      <Grid
        templateColumns="repeat(1, 1fr)"
        gap={4}
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        className="story_note_grid"
      >
        <GridItem colSpan={1}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            position={'relative'}
          >
            <Img
              src={preloadedAssets.Login}
              className={'first_play'}
            />
            <Box className={'play_screen_content'}>
              <Box>
                <Box
                  w={'100%'}
                  display={'flex'}
                  justifyContent={'center'}
                >
                  <Text className={'play_screen_heading'}>
                    Atlantis
                  </Text>
                </Box>
              </Box>
              <Box>
                <Box
                  w={'100%'}
                  display={'flex'}
                  justifyContent={'center'}
                >
                  <Text className={'play_screen_text'}>
                    Welcome To
                  </Text>
                </Box>
                <Box
                  w={'100%'}
                  display={'flex'}
                  justifyContent={'center'}
                  mb={{ base: 0, lg: 2 }}
                >
                  <Text className={'play_screen_text'}>
                    The Demo Play
                  </Text> 
                </Box>
                <Box position={'relative'} >
                  {/* <Text
                    onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                    className={'choosen_lang'}
                    ml={'9% !important'}
                  >
                    Language
                  </Text> */}
                  <Img
                    // className="formfield"
                    w={'100%'}
                    h={'auto'}
                    src={preloadedAssets.redLang}
                    onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                  />
                  <Box
                    w={'100%'}
                    position={'absolute'}
                    // className={isError?.language !== null && isAnimating && 'animate_error'}
                    borderRadius={'50px'}
                    display={'flex'}
                    onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                    // onFocus={() => setIsAnimating(false)}
                    top={'26%'}
                  >
                    <Box w={'80%'} display={'flex'} justifyContent={'center'}>
                      <Text
                        onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                        className={'choosen_lang'}
                      >
                        {/* {gameLanguages.length > 0 ? gameLanguages.find((lan: any) => lan.value === formState?.language)?.label : 'English'} */}
                         English
                      </Text>
                    </Box>
                    <Box w={'20%'}>
                      <Img
                        src={preloadedAssets.Selected}
                        className={'select'}
                        mt={'31%'}
                      />
                    </Box>
                    {isLanguageSelected && (
                      <Box className="dropdown" backgroundColor={'#8b0b0b !important'}>
                        {/* {gameLanguages.length > 0 ? gameLanguages.map((lang: any, num: any) => ( */}
                        {['tamil','english','hindi'].map((lang,num )=>(
                          <Text
                            className={'choosen_langs'}
                            ml={'5px'}
                            key={num}
                            _hover={{ bgColor: '#377498' }}
                            id={'language'}
                            // onClick={(e: any) =>
                            //   handleProfile(e, lang.value)
                            // }
                          >
                            {lang}
                          </Text>
                         ))} 
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  w={'100%'}
                  display={'flex'}
                  justifyContent={'center'}
                  mt={'9%'}
                >
                  <Button
                    w={'90%'}
                    h={{base: '6vw', sm: '6vw', lg: '5vh'}}
                    bg={'none'}
                    _hover={{ bg: 'none' }}
                    className='mouse_style'
                    onClick={() => {                      
                      setIsGetsPlayAudioConfirmation(true);
                      Handlemodel();
                    }}
                  >
                    <Img
                      className='profile-okay-btn'
                      src={preloadedAssets.play}
                      w={'100%'}
                      h={'auto'}
                    />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default GameIntroScreen;