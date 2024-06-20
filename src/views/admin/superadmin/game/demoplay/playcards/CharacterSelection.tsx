import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Button,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Img,
  Input,
  position,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { motion, useAnimation } from 'framer-motion';
import { API_SERVER } from 'config/constant';
// import { DataContext } from '../components/gamePlayArea';

// Games Image
import InitialImg from 'assets/img/games/load.jpg';
import Sample from 'assets/img/games/Character_sample.glb';
// import Victor from '../../../../assets/img/games/victoria.glb';
// import Sample from '../../../../assets/img/games/Source_file.glb';
import Background from 'assets/img/games/fristscreenBackground.jpg';
import Select from 'assets/img/games/select_character.png';

// Three js
import { Canvas, useLoader, useFrame } from 'react-three-fiber';
import { ProfileContext } from '../EntirePreview';
import {
  getGameLanguages,
  getLanguages,
  getContentRelatedLanguage,
} from 'utils/game/gameService';
import { useParams } from 'react-router-dom';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
// import {Parrot}  from '../three/Parrot';
import PlayingCharacter from './PlayingCharacter';
// import Model from './Model';
interface PlayGamesProps {
  formData?: any;
  state?: any;
  dispatch?: any;
  setDatas?: any;
  imageSrc?: any;
  setCurrentScreenId?: any;
  players?: any;
  setSelectedPlayer?: any;
  profileData?: any;
  setProfileData?: any;
  demoBlocks?: any;
  preloadedAssets?: any;
  currentScreenId: any;
  setPreLogDatas: any;
  getPrevLogDatas: any;
  ModelPlayer:any;
}

const spokenLanguages = [
  'English',
  'Spanish',
  'Mandarin Chinese',
  'Hindi',
  'French',
  'Arabic',
  'Bengali',
  'Russian',
  'Portuguese',
  'Urdu',
  'Indonesian',
  'German',
  'Japanese',
  'Swahili',
  'Turkish',
  'Italian',
  'Thai',
  'Dutch',
  'Korean',
  'Vietnamese',
];

const Characterspage: React.FC<PlayGamesProps> = ({
  state,
  dispatch,
  setDatas,
  imageSrc,
  setCurrentScreenId,
  players,
  setSelectedPlayer,
  profileData,
  setProfileData,
  demoBlocks,
  formData,
  preloadedAssets,
  currentScreenId,
  setPreLogDatas,
  getPrevLogDatas,
  ModelPlayer
}) => {
  const [i, setI] = useState(0);
  const [toggleLeft, setToggleLeft] = useState(false);
  const [toggleRight, setToggleRight] = useState(false)
  const [blackScreen, setBlackScreen] = useState(false)  
  const toast = useToast();
  const useData = useContext(ProfileContext)

  const selectPlayerClick = () => {
    useData?.setMotionEffect(true);
    setTimeout(()=> {
    // setBlackScreen(true)

    // setTimeout(()=> {
    const i = 0; // Assuming you are referring to a specific player index
      setPreLogDatas((prev: any) => ({
        ...prev,
        screenIdSeq: [currentScreenId],
        previewProfile: {...prev.previewProfile, selectedPlayer:players[i]}
      }));
    

    // Set the selected player
    setSelectedPlayer(players[i]);    
    setCurrentScreenId(13);//navigate to Chapter selection
  },300)
  };


  const innerBoxWidth = useBreakpointValue({
    base: '95%',
    lg: '95%',
    xl: '90%',
    xxl: '90%',
  });
  // const screenIdset =
  //   getPrevLogDatas.screenIdSeq[getPrevLogDatas.screenIdSeq.length - 1];

  console.log('chracter%');
  
  return (
    <>      
      {/* <Box className={`black-shadow ${blackScreen && 'end-black-shadow'}`}> */}
      {/* <Box className='black-shadow'> */}
        <Box
          position="relative"
          w={'100%'}
          height="100vh"
          backgroundImage={preloadedAssets.StarsBg}
          backgroundColor={'#0d161e'}
          backgroundSize={'cover'}
          backgroundRepeat={'no-repeat'}
          className="CharacterScreen chapter_potrait"
        >          
            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={4}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="100%"
            >
              <GridItem colSpan={1} position={'relative'}>
                <Box display={'flex'} justifyContent={'center'}>
                  <Img
                    src={preloadedAssets.Select}
                    className={'character_template'}
                    loading="lazy"
                  />
                  <Box className={'character_select_area'}>
                    <Box
                      w={'55%'}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Img
                        src={preloadedAssets.Selected}
                        className={`character_toggle_left ${
                          toggleLeft ? 'toggle_effect_on' : 'toggle_effect_off'
                        }`}
                        onMouseDown={() => setToggleLeft(true)}
                        onMouseUp={() => setToggleLeft(false)}
                      />
                      <Canvas
                        camera={{ position: [0, 1, 9] }}
                        dpr={window.devicePixelRatio}
                      >
                        {' '}
                        {/* For Single view */}
                        {/* <Environment preset={"park"} background />   */}
                        <directionalLight
                          position={[2.0, 78.0, 100]}
                          intensity={0.8}
                          color={'ffffff'}
                          castShadow
                        />
                        <ambientLight intensity={0.5} />
                        {/* <OrbitControls   />  */}
                        <pointLight position={[1.0, 4.0, 0.0]} color={'ffffff'} />
                        {/* COMPONENTS */}
                        <ModelPlayer position={[0, -1.5, 4]} rotation={[0,0,0]}/>
                       
                      </Canvas>
                      <Img
                        onMouseDown={() => setToggleRight(true)}
                        onMouseUp={() => setToggleRight(false)}
                        src={preloadedAssets.Selected}
                        className={`character_toggle_right ${
                          toggleRight ? 'toggle_effect_on' : 'toggle_effect_off'
                        }`}
                      />
                    </Box>
                  </Box>
                  <Box className={'select_player'}>
                    <Button
                      w={'15%'}
                      bg={'none'}
                      className="mouse_style"
                      _hover={{ bg: 'none' }}
                      onClick={selectPlayerClick}
                    ></Button>
                  </Box>
                  <Box className={'character_next'}>
                    <Box className={'character_buttons'}>
                      <Button
                        className="btns left-btn mouse_style"
                        bg={'none'}
                        _hover={{ bg: 'none' }}
                        onClick={() => {
                          setBlackScreen(true)

                          setTimeout(()=> {
                          setCurrentScreenId(1);
                        },1000)
                        }}
                      ></Button>
                      <Box w={'25%'} position={'relative'}>
                        <FormLabel
                          style={{ width: '100%' }}
                          className="player_name"
                          textAlign={"center"} 
                          me={0}
                          mb={1}
                        > 
                        {getPrevLogDatas?.previewProfile?.name} 
                          </FormLabel>
                      </Box>
                      <Button
                        className="btns right-btn mouse_style"
                        bg={'none'}
                        _hover={{ bg: 'none' }}
                        onClick={selectPlayerClick}
                      ></Button>
                    </Box>
                  </Box>
                </Box>
              </GridItem>
            </Grid>          
        </Box>
      {/* </Box> */}
    </>
  );
};

export default Characterspage;
