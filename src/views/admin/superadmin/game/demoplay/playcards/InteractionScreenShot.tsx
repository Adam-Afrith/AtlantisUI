import React, { useEffect, useState } from 'react'
import { Box, Grid, GridItem, Img, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { Canvas } from 'react-three-fiber';
import Model from './Model';
import Player from './Player';


interface InteractionScreenShotProps {
  data?: any;
  options?: any;
  backGroundImg?: any;
  option?: any;
  geTfeedBackoption?: any;
  isScreenshot?: any;
  preloadedAssets?: any;
  profileData?:any;
  selectedPlayer?: any;
  currentScreenId? : number;
}

const InteractionScreenShot: React.FC<InteractionScreenShotProps> = ({ data, backGroundImg, option, options, geTfeedBackoption, isScreenshot, preloadedAssets ,profileData,selectedPlayer, currentScreenId}) => {
  const [QuestContentByLanguage, setQuestContentByLanguage] = useState(null);
  useEffect(() => {
    const GetblocktextAudioFiltered =
      profileData?.Audiogetlanguage.filter(
        (key: any) => key.textId === data[0].blockId,
      );
    if (GetblocktextAudioFiltered.length > 0) {
      const Filteredcontent = GetblocktextAudioFiltered.map(
        (item: any) => item.content,
      );
      setQuestContentByLanguage(Filteredcontent);
    }
  }, [data?.blockId]);

   console.log(data);

  return (
    <Modal isOpen={true} onClose={isScreenshot} size={'medium'} closeOnOverlayClick={false}>
      <ModalOverlay zIndex={9999} />
      <ModalContent
        className='feedback_screenshot'
        backgroundImage={backGroundImg}
        backgroundSize={'cover'}
        filter={'contrast(70%)'}
        backgroundRepeat={'no-repeat'}
        boxShadow={'inset 0px 5px 100px 25px white'}
        borderRadius={'35px !important'}
        containerProps={{zIndex: 99999}}
      >
        <ModalBody width={'100%'} height={'100%'}>
          <Img
            src={preloadedAssets.Close}
            onClick={() => geTfeedBackoption()}
            className={'close_model'}
          />
          <Box className="top-menu-home-section-screenshot">
            <Img src={preloadedAssets.TopMenu} borderRadius={'35px 35px 0px 0px'} opacity={0.5} className="top-menu-img" style={{ top: '58px', width: '100%' }} />
            {/* <Img
              src={preloadedAssets.Overview}
              className="overview-img"
              style={{ marginTop: '57px', marginRight: '174px' }}
            />
            <Img
              src={preloadedAssets.Setting}
              className="setting-img"
              style={{ marginTop: '57px', marginRight: '168px' }}
            /> */}
            {/* <Box className="score-box" style={{ marginTop: '57px', marginRight: '130px' }}>
              <Text className="text">
                {(profile &&
                  profile.score &&
                  profile.score.length > 0 &&
                  profile.score.reduce(
                    (accumulator: number, currentValue: any) => {
                      return accumulator + currentValue.score;
                    },
                    0,
                  )) ||
                  0}
              </Text>
            </Box> */}
          </Box>
          {/* <Box
            position="relative"
            className='chapter_potrait_screenshot'
            >
            <Grid
              templateColumns="repeat(1, 1fr)"
              gap={4} 
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w={'90%'}            
            >
              <GridItem colSpan={1} position={'relative'}> */}
          <Box className="story_interaction_image_screenshot">
            <Box position={'relative'} h={'100%'}>
              <Img src={preloadedAssets.parch} w={'auto'} filter={'contrast(80%)'} h={'100%'} loading="lazy" />
              <Box
                position={'absolute'}
                top={{ sm: '18px', md: '8%' }}
                h={'80% !important'}
                className="story_interaction_image_screenshot_content"
              >
                <Box
                  textAlign={'center'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  fontWeight={700}
                  fontSize={{ md: '1.5vw', lg: '1.9vw' }}
                  fontFamily={'AtlantisText'}
                  lineHeight={1}
                  w={'100%'}
                  h={'5%'}
                >
                  <Box w={'80%'}>
                    Interactions...!{' '}
                  </Box>
                </Box>
                <Box
                  className='story_screenshot_interaction_question'
                >
                  <Box
                    className='screenshot_content'
                    w={'60%'}
                   
                    letterSpacing={1}
                    justifyContent={'flex-start'}
                  >
                    <Img src={preloadedAssets.qs} h={'1em'} w={'1em'} />
                    <Text textAlign={'justify'} fontFamily={'AtlantisContent'} className='font_inter_ss'>
                    {QuestContentByLanguage!==null ? QuestContentByLanguage : data[0]?.blockText}
                    </Text>
                  </Box>
                </Box>
                <Box
                  mt={'10px'}
                  w={'100%'}
                  h={'40%'}
                  fontWeight={500}
                  overflowY={'scroll'}
                  display={'flex'}
                  justifyContent={'center'}
                  className={'screenshot_interaction_options'}
                >
                  <Box w={'60%'}>
                    {options &&
                      options.map((item: any, ind: number) => (
                        <Box
                          w={'100%'}
                          mb={'10px'}
                          lineHeight={1}
                          key={ind}
                          color={option === item?.qpOptions ? 'purple' : 'black'}
                          textAlign={'center'}
                          cursor={'pointer'}
                          fontFamily={'AtlantisContent'}
                        >
                          <Img
                            src={option === item?.qpOptions ? preloadedAssets.on : preloadedAssets.off}
                            h={'30px'}
                            w={'100%'}
                          />
                          <Box
                           className='story_interaction_option'
                          >
                            {/* {item?.qpOptionText} */}
                            {`${String.fromCharCode(65 + ind)}). ${item?.qpOptionText}`}
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </Box>
            </Box>
            {selectedPlayer && (
              <Box className={'player_character_image'}>
                <Canvas camera={{ position: [0, 1, 9] }}>
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
                  <Player currentScreenId={currentScreenId}/>
                  <Model
                    isSpeaking={option}
                    position={[-3, -1.8, 5]}
                    rotation={[0, 1, 0]}
                  />
                </Canvas>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default InteractionScreenShot;