// Chakra Imports
import { Box, Grid, GridItem, Img, Text } from '@chakra-ui/react';

import React, { useContext, useEffect, useState } from 'react';

import Interaction from './Interaction';
import TypingEffect from './Typing';
// import { getVoiceMessage, getPreview } from 'utils/game/gameService';
import { ProfileContext } from '../EntirePreview';
import { motion } from 'framer-motion';
import { API_SERVER } from 'config/constant';
import { ScoreContext } from '../GamePreview';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import Sample from 'assets/img/games/Merlin.glb';
import { useLayoutEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
// import Model from './Model';
// import Player from './Player';
import ReplayGame from './ReplayGame';
import SelectedNPCs from './SelectedNPCs';
import {SelectedNPCType} from './SelectedNPCs';

const Story: React.FC<{
  imageSrc?: any;
  replayGame: any;
  isOptionalReplay: any;
  setisOptionalReplay: any;
  profilescore: any;
  setisReplay: any;
  isReplay: any;
  setType: any;
  setData: any;
  replayNextHandler: any;
  prevData?: any;
  currentScore?: any;
  data: any;
  type: any;
  profileData: any;
  backGroundImg: any;
  getData: any;
  option: any;
  options: any;
  handleValidate: any;
  resMsg: any;
  feed: any;
  setIsGetsPlayAudioConfirmation: any;
  formData: any;
  setAudioObj: any;
  selectedPlayer: any;
  selectedNpc: any;
  voiceIds: any;
  setIsPrevNavigation: any;
  setNavTrack: any;
  navTrack: any;
  gameInfo: any;
  preloadedAssets: any;
  questState: any;
  LastModiPrevData: any;
  setPreLogDatas: any;
  getPrevLogDatas: any;
  RepeatSelectOption: any;
  RepeatPrevOption: any;
  // SelectedNPCs: React.FC<SelectedNPCType>;
  Player:  React.FC;
  // CharacterModal:  React.FC;
  ModelPlayer:  React.FC;
  setScore:any;
  SetAudioOptions:any;
  score:any;
  AudioOptions:any;
  upComingBlockChoosen?:any;
}> = ({
  data,
  type,
  resMsg,
  feed,
  getData,
  profileData,
  option,
  options,
  setAudioObj,
  handleValidate,
  backGroundImg,
  formData,
  selectedPlayer,
  setIsGetsPlayAudioConfirmation,
  selectedNpc,
  voiceIds,
  setIsPrevNavigation,
  setNavTrack,
  navTrack,
  gameInfo,
  preloadedAssets,
  imageSrc,
  replayGame,
  replayNextHandler,
  prevData,
  currentScore,
  setisReplay,
  setisOptionalReplay,
  isOptionalReplay,
  profilescore,
  setData,
  setType,
  isReplay,
  questState,
  LastModiPrevData,
  getPrevLogDatas,
  setPreLogDatas,
  RepeatSelectOption,
  RepeatPrevOption,
  // SelectedNPCs,
  Player,
  // CharacterModal,
  ModelPlayer,
  setScore,
  SetAudioOptions,
  score,
  AudioOptions,
  upComingBlockChoosen,
}) => {
    const [showNote, setShowNote] = useState(true),
      [first, setFirst] = useState(false);
    const userProfile = useContext(ProfileContext);
    const { profile, setProfile } = useContext(ScoreContext);
    const [showTypingEffect, setShowTypingEffect] = useState<any>(false);
   
    const [interactionNext, setInteractionNext] = useState(null);
    const [optionalReplay, setOptionalReplay] = useState(false);
    const [contentByLanguage, setContentByLanguage] = useState(null);
    const EnumType = {
      BGM: 'bgm',
      VOICE: 'voice',
    };
    const [isSpeaking ,setIsSpeaking]=useState<boolean>(false);
    const [isStartsAnimationPlay ,setIsStartsAnimationPlay]=useState<boolean>(true);
    const [animateNote ,setAnimateNote]=useState<boolean>(false);
    const [animateDialog ,setAnimateDialog]=useState<boolean>(false);
    const [animateInteraction ,setAnimateInteraction]=useState<boolean>(false);
    const [animateFeedback ,setAnimateFeedback]=useState<boolean>(false);
    const [showGLB ,setShowGLB]=useState<boolean>(false);

    useEffect(() => {
      if (data && type) {
        setShowNote(true);
        setShowTypingEffect(false);
        setTimeout(() => {
          setShowNote(false);
          interactionNext === true && setInteractionNext(false);
        }, 1000);
        if(type==='Note' || type==='Dialog' || type=== 'Interaction')
          {
            SetAudioOptions({ qpOptionId: '' });
          }
        const currentQuest = data
          ? parseInt(data?.blockPrimarySequence.split('.')[0])
          : null;
          setPreLogDatas((prev: any) => ({
            ...prev,
            lastActiveBlockSeq:{ [currentQuest]:[data.blockId]},
          }));
          if (getPrevLogDatas.nevigatedSeq[currentQuest]) {
            if (
              !getPrevLogDatas.nevigatedSeq[currentQuest].includes(
                data.blockPrimarySequence,
              )
            ) {
              setPreLogDatas((prev: any) => ({
                ...prev,
                // lastActiveBlockSeq:{[currentQuest]:[data.blockId]},
                nevigatedSeq: {
                  ...prev.nevigatedSeq,
                  [currentQuest]: [
                    ...(prev.nevigatedSeq[currentQuest] || []),
                    data.blockPrimarySequence,
                  ],
                },
              }));
            }
          } else {
            setPreLogDatas((prev: any) => ({
              ...prev,
              // lastActiveBlockSeq:{ [currentQuest]:[data.blockId]},
              nevigatedSeq: {
                ...prev.nevigatedSeq,
                [currentQuest]: [data.blockPrimarySequence],
              },
            }));
          }

        if (gameInfo.hasOwnProperty('blocks')) {
          let previousPrimarySeq = navTrack[navTrack.length - 1];
          if (previousPrimarySeq) {
            let currentQuest = previousPrimarySeq.split('.')[0];
            let previousBlock: any = Object.values(
              gameInfo?.blocks[currentQuest],
            )?.find((row: any) => {
              return row.blockPrimarySequence == previousPrimarySeq;
            });
            if (data.blockPrimarySequence != previousPrimarySeq) {
              const newArray = navTrack;
              newArray.push(data.blockPrimarySequence);
              setNavTrack(newArray);
            }
          } else {
            setNavTrack([data.blockPrimarySequence]);
          }
        }
      }
    }, [data, type]);

    useEffect(() => {
      setFirst(true);
      setTimeout(() => {
        setFirst(false);
        setShowNote(false);
      }, 1000);
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        if (profileData?.Audiogetlanguage.length !== 0) {
          setAudioObj((prev:any)=>({
            ...prev,
            url: '',
            type: EnumType.VOICE,
            loop: false, // Voice doesn't loop
            autoplay: true, // Autoplay is disabled
          }));
          if (AudioOptions.qpOptionId === '' && (type === 'Note' || type === 'Dialog' || type === 'Interaction') ) {
            const GetblocktextAudioFiltered =
              profileData?.Audiogetlanguage.filter(
                (key: any) => key?.textId === data?.blockId,
              );
            if (GetblocktextAudioFiltered.length > 0) {
              const FilteredFieldName = GetblocktextAudioFiltered.map(
                (item: any) => item.fieldName,
              );
              const Filteredcontent = GetblocktextAudioFiltered.map(
                (item: any) => item.content,
              );
              setContentByLanguage(Filteredcontent);
              if (FilteredFieldName[0] === 'blockText') {
                const audioUrls = GetblocktextAudioFiltered.map((item: any) =>
                  item.audioUrls !== null
                    ? JSON.parse(item.audioUrls)[0]?.audioUrl
                    : item.audioUrls,
                );
                try {
                  const normalizedPath = audioUrls[0];
                  if (normalizedPath !== '') {
                    const fullUrl = `${API_SERVER}${normalizedPath}`;
                    const responseblockText = await fetch(fullUrl);
                    if (responseblockText.ok) {
                      setAudioObj((prev :any)=>({
                        ...prev,
                        url: fullUrl,
                        type: EnumType.VOICE,
                        loop: false, // Voice doesn't loop
                        autoplay: true, // Autoplay is disabled
                      }));
                    }
                  }
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
              }
            }
          } else {
            if (AudioOptions.qpOptionId) {
              const optionAudioFiltered = profileData?.Audiogetlanguage.filter(
                (key: any) => key?.textId === AudioOptions?.qpOptionId,
              );
              if (optionAudioFiltered.length > 0) {
                const getoptionsAudioFiltered = optionAudioFiltered.filter(
                  (key: any) => key?.fieldName === 'qpOptionText',
                );
                const responseAudioFiltered = optionAudioFiltered.filter(
                  (key: any) => key?.fieldName === 'qpResponse',
                );
                const FilteredResponsecontent = responseAudioFiltered[0].content;
                if(type === 'Interaction')
                  {
                    if (getoptionsAudioFiltered.length > 0) {
                  const QOTaudioUrls = getoptionsAudioFiltered.map((item: any) =>
                    item.audioUrls !== null
                      ? JSON.parse(item.audioUrls)[0]?.audioUrl
                      : item.audioUrls,
                  );

                  if (QOTaudioUrls.length > 0) {
                    try {
                      const normalizedPath = QOTaudioUrls[0];
                      if (normalizedPath !== '') {
                        const qpOptionTextUrl = `${API_SERVER}${normalizedPath}`;
                        const responseqpOptionText = await fetch(qpOptionTextUrl);
                        if (responseqpOptionText.ok) {
                          setAudioObj((prev:any)=>({
                            ...prev,
                            url: qpOptionTextUrl,
                            type: EnumType.VOICE,
                            // volume: '0.5',
                            loop: false,
                            autoplay: true,
                          }));
                        }
                      }
                    } catch (error) {
                      console.error('Error fetching data:', error);
                    }
                  }
                  else{
                    setAudioObj((prev :any)=>({
                      ...prev,
                      url: '',
                      type: EnumType.VOICE,
                      loop: false,
                      autoplay: true,
                    }));
                  }
                }
                  }
               else if(type === 'response')
                  {
                    if (responseAudioFiltered.length > 0) {
                  const QResTaudioUrls = responseAudioFiltered.map((item: any) =>
                    item.audioUrls !== null
                      ? JSON.parse(item.audioUrls)[0]?.audioUrl
                      : item.audioUrls,
                  );

                  if (QResTaudioUrls.length > 0) {
                    try {
                      const normalizedPath = QResTaudioUrls[0];
                      if (normalizedPath !== '') {
                        const qRespOptionTextUrl = `${API_SERVER}${normalizedPath}`;
                        const responseqpOptionText = await fetch(
                          qRespOptionTextUrl,
                        );
                        if (responseqpOptionText.ok) {
                          setAudioObj((prev :any)=>({
                            ...prev,
                            url: qRespOptionTextUrl,
                            type: EnumType.VOICE,
                            // volume: '0.5',
                            loop: false,
                            autoplay: true,
                          }));
                        }
                        else{
                          setAudioObj((prev :any)=>({
                            ...prev,
                            url: '',
                            type: EnumType.VOICE,
                            // volume: '0.5',
                            loop: false,
                            autoplay: true,
                          }));
                        }
                      }else{
                        setAudioObj((prev :any)=>({
                          ...prev,
                          url: '',
                          type: EnumType.VOICE,
                          // volume: '0.5',
                          loop: false,
                          autoplay: true,
                        }));
                      }
                    } catch (error) {
                      console.error('Error fetching data:', error);
                    }
                  }else{
                    setAudioObj((prev :any)=>({
                      ...prev,
                      url: '',
                      type: EnumType.VOICE,
                      // volume: '0.5',
                      loop: false,
                      autoplay: true,
                    }));
                  }
                }
                  }
                else{
                  setAudioObj((prev :any)=>({
                    ...prev,
                    url: '',
                    type: EnumType.VOICE,
                    // volume: '0.5',
                    loop: false,
                    autoplay: true,
                  }));
                }
              }
            }else{
              setAudioObj((prev :any)=>({
                ...prev,
                url: '',
                type: EnumType.VOICE,
                loop: false,
                autoplay: true,
              }));
            }
          }
        }
      };
      fetchData();
    }, [data, AudioOptions]);
    const InteractionFunction = () => {
      setAnimateInteraction(true)
      setTimeout(()=> {    

      setIsGetsPlayAudioConfirmation(true);
      /**Get current data mm-dd-yyyy */
      const currentDateTime = new Date();
      const day: String = String(currentDateTime.getDate()).padStart(2, '0');
      const month: String = String(currentDateTime.getMonth() + 1).padStart(
        2,
        '0',
      ); // Months are zero-based
      const year: String = String(currentDateTime.getFullYear());

      const currentDate = `${day}-${month}-${year}`;

      if (questState[profile?.currentQuest] === 'Started') {
        setProfile((prev: any) => {
          const { seqId, score: newScore } = score;
            const index = prev.score.findIndex((item: any) => item.seqId === seqId);
            if (index !== -1) {
              const updatedScore = [...prev.score];
              updatedScore[index] = { ...updatedScore[index], score: newScore };
              return { ...prev, score: updatedScore };
            } 
          else {
              const newScoreArray = [
                ...prev.score,
                {
                  seqId: seqId,
                  score: newScore,
                  quest: parseInt(seqId.split('.')[0]),
                  scoreEarnedDate: currentDate,
                },
              ];

              return { ...prev, score: newScoreArray };
            }
         

        });
      } else {
        // update the replayScore when a player want to replay. Scores were hanlded seperatly, after Quest completion, if the calculated total score is lesser than replay score total then replace the score by replayscore, other wise score not changed, then reset the replayscore to {}
        setProfile((prev: any) => {
          const { seqId, score: newScore } = score;
            const index = prev.replayScore.findIndex(
              (item: any) => item.seqId === seqId,
            );
            if (index !== -1) {
              const updatedScore = [...prev.replayScore];
              updatedScore[index] = { ...updatedScore[index], score: newScore };
              return { ...prev, replayScore: updatedScore };
            } else {
              const newScoreArray = [
                ...prev.replayScore,
                {
                  seqId: seqId,
                  score: newScore,
                  quest: parseInt(seqId.split('.')[0]),
                  scoreEarnedDate: currentDate,
                },
              ];
              return { ...prev, replayScore: newScoreArray };
            }

        });
      }
      setInteractionNext(true);
      },600)
    };

    useEffect(() => {
      if (interactionNext === true) {
        setInteractionNext(false);
        getData(data);
      }
    }, [interactionNext]);

    const optionClick = (item: any, ind: any) => {
      setScore({ seqId: item?.qpSequence, score: parseInt(item?.qpScore) });
      SetAudioOptions(item);
      handleValidate(item, ind);
    };

    const Updatecontent = () => {                      
      if (showTypingEffect === false) {
        setShowTypingEffect(true);
      } else {
        if(upComingBlockChoosen !== 'Dialog') {      
          setAnimateDialog(true)      
          setTimeout(()=> {               
              getData(data);                      
          },500)
        } else {
          getData(data);  
        }        
      }             
    };

    useEffect(()=> {
      setAnimateNote(false)
      setAnimateDialog(false)
      setAnimateInteraction(false)
      setAnimateFeedback(false)
    },[type, showTypingEffect, upComingBlockChoosen])

    useEffect(()=> {
      setShowGLB(false);
      setTimeout(()=> {
        setShowGLB(true);
      },800)
    },[])

    const getNoteNextData = () => {
    setAnimateNote(true)
      setTimeout(()=> {   
        setAnimateNote(false)         
        setIsPrevNavigation(false);
        getData(data);
      },500)
    };

    const SkipContentForBackNavigation = () => {
      if (showTypingEffect === false) {
        setShowTypingEffect(true);
      } else {
        LastModiPrevData(data);
      }
    };

    const upNext = () => {
      setAnimateFeedback(true)
      setTimeout(()=> {      
        getData(data)
      },500)
    }  
  
    // console.log('SelectedNPCs',SelectedNPCs)

    return (
      <>
        {optionalReplay && (
          <ReplayGame
            setOptionalReplay={setOptionalReplay}
            replayGame={replayGame}
            replayNextHandler={replayNextHandler}
            type={type}
            gameInfo={gameInfo}
            setType={setType}
            setData={setData}
            isOptionalReplay={isOptionalReplay}
            setisOptionalReplay={setisOptionalReplay}
            setisReplay={setisReplay}
            profilescore={profilescore}
            isReplay={isReplay}
            // setCurrentScreenId={setCurrentScreenId}
            formData={gameInfo?.gameData}
            imageSrc={preloadedAssets.Replay}
            getData={getData}
            data={data}
            preloadedAssets={preloadedAssets}
          />
        )}
        <Box className='storyPart' backgroundImage={backGroundImg}>
          <Box className='glb-compo'>
            {/* {((data && type === 'Dialog') || (data && type === 'Interaction') || (data && type === 'response')) && */}               
                {/* {showGLB &&  */}
                <SelectedNPCs preloadedAssets={preloadedAssets} isStartsAnimationPlay={isStartsAnimationPlay} isSpeaking={isSpeaking} selectedNpc={selectedNpc}/>     
              {/* } */}
            {/* } */}
          </Box>
          {data && type === 'Note' && (
            <Box
              // position="relative"
              // maxW="100%"
              // w={'100vw'}
              // height="100vh"
              // backgroundImage={backGroundImg}
              // backgroundSize={'cover'}
              // backgroundRepeat={'no-repeat'}
              className="chapter_potrait"              
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
                <GridItem colSpan={1} position={'relative'}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: animateNote ? 0 : 1, scale: animateNote ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box display={'flex'} justifyContent={'center'}>
                      <Img
                        src={preloadedAssets.note}
                        className="story_note_image"
                        loading="lazy"
                      />

                      <Box className={'note_align'}>
                        <Text textAlign={'center'} className="note_title">
                          Note
                        </Text>
                      </Box>
                      <Box
                        className={'story_note_content'}
                      // bg={'blue.300'}
                      >
                        <Box w={'100%'} display={'flex'} justifyContent={'center'}>
                          <Box className={'story_note_block'}>
                            <Text textAlign={'center'} letterSpacing={'normal'}>
                              {contentByLanguage !== null
                                ? contentByLanguage
                                : data?.blockText}
                            </Text>
                          </Box>
                        </Box>
                        <Box
                          className='story_block_btns_box'
                        >
                          <Box className="story_block_btns">
                          {data?.blockPrimarySequence === gameInfo?.blocks[parseInt(data?.blockPrimarySequence.split('.')[0])]['1']?.blockPrimarySequence ? <Img /> :<Img
                              src={preloadedAssets.left}
                              className={'interaction_button'}
                              onClick={() =>LastModiPrevData(data)}
                              />}
                          
                            <Img
                              src={preloadedAssets.right}
                              className={'interaction_button'}
                              onClick={() => {
                                getNoteNextData()
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                </GridItem>
              </Grid>
            </Box>
          )}
          {data && type === 'Dialog' && (
            <Box className="chapter_potrait">
              {/* <Img src={backGroundImg} className="dialogue_screen" /> */}
              {/* <SelectedNPCs preloadedAssets={preloadedAssets} isStartsAnimationPlay={isStartsAnimationPlay} isSpeaking={isSpeaking} selectedNpc={selectedNpc}/> */}
              <Box              
                style={{display: 'flex', justifyContent: 'center'}}
              >
              <Img className={'dialogue_image animateDialog'} src={preloadedAssets.dial} bottom={animateDialog ? '-200px' : '0'} />
              <Box position={'relative'}>
                <Box
                  position={'fixed'}
                  h={'100px'}
                  w={'30%'}
                  left={'5%'}
                  bottom={animateDialog ? '-200' : '105px'}
                  className={'animateDialog'}
                >
                  <Img src={preloadedAssets.char} w={'100%'} height={'100%'} />
                  <Box
                    position={'absolute'}
                    top={'31%'}
                    left={'25.5%'}
                    w={'48%'}
                    height={'42%'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    fontSize={{ base: '1.8rem', xl: '1.8rem' }}
                    fontWeight={500}
                    textAlign={'center'}
                    fontFamily={'AtlantisText'}
                    color={'#312821'}
                    textTransform={'capitalize'}
                  >
                    <Text whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>{data.blockRoll === 'Narrator'
                      ? data.blockRoll
                      : data.blockRoll === '999999'
                        ? getPrevLogDatas?.previewProfile?.name || "player"
                        : formData.gameNonPlayerName}</Text>
                  </Box>
                </Box>
              </Box>
              <Box             
                className='dialogue_scroll animateDialog' bottom={animateDialog ? '-200px' : '16px'}>
                <Box>
                  {showTypingEffect === false ? (
                    <TypingEffect
                      text={
                        contentByLanguage !== null
                          ? contentByLanguage
                          : data?.blockText
                      }
                      speed={50}
                      setSpeedIsOver={setShowTypingEffect}
                    />
                  ) : contentByLanguage !== null ? (
                    contentByLanguage
                  ) : (
                    data?.blockText
                  )}
                </Box>
              </Box>
              <Box
                display={'flex'}
                position={'fixed'}
                justifyContent={'space-between'}
                w={'95%'}
                bottom={animateDialog ? '-200px' : '0'}
                className={'animateDialog'}
              >
                 {data?.blockPrimarySequence ===  gameInfo?.blocks[parseInt(data?.blockPrimarySequence.split('.')[0])]['1']?.blockPrimarySequence? null :<Img
                  src={preloadedAssets.left}
                  w={'70px'}
                  h={'50px'}
                  cursor={'pointer'}
                  onClick={() => {
                    SkipContentForBackNavigation();
                  }}
                  />}
              
                <Img
                  src={preloadedAssets.right}
                  w={'70px'}
                  h={'50px'}
                  onClick={() => Updatecontent()}
                />
              </Box>
              </Box>
            </Box>
          )}
          {data && type === 'Interaction' && (
            <Interaction
              backGroundImg={backGroundImg}
              data={data}
              option={option}
              options={options}
              optionClick={optionClick}
              InteractionFunction={InteractionFunction}
              navTrack={navTrack}
              preloadedAssets={preloadedAssets}
              selectedPlayer={selectedPlayer}
              LastModiPrevData={LastModiPrevData}
              RepeatSelectOption={RepeatSelectOption}
              RepeatPrevOption={RepeatPrevOption}
              contentByLanguage={contentByLanguage}
              currentScreenId={2}
              gameInfo={gameInfo}
              animateInteraction={animateInteraction}
            />
          )}
          {data && type === 'response' && (
            <Box className="chapter_potrait">
              {/* <Img src={backGroundImg} className="dialogue_screen" /> */}
              {/* <SelectedNPCs preloadedAssets={preloadedAssets} isStartsAnimationPlay={isStartsAnimationPlay} isSpeaking={isSpeaking} selectedNpc={selectedNpc}/> */}
              <Box              
                style={{display: 'flex', justifyContent: 'center'}}
              >
              <Img className={'dialogue_image animateDialog'} src={preloadedAssets.dial} bottom={animateDialog ? '-200px' : '0'} />
              <Box position={'relative'}>
                <Box
                  position={'fixed'}
                  h={'100px'}
                  w={'30%'}
                  left={'5%'}                  
                  bottom={animateDialog ? '-200' : '105px'}
                  className={'animateDialog'}
                >
                  <Img src={preloadedAssets.char} w={'100%'} height={'100%'} />
                  <Box
                    position={'absolute'}
                    top={0}
                    w={'100%'}
                    height={'100%'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    fontSize={{ base: '30px', xl: '2vw' }}
                    fontWeight={500}
                    textAlign={'center'}
                    fontFamily={'AtlantisText'}
                    color={'#312821'}
                    textTransform={'capitalize'}
                  >
                    {data.blockResponseRoll === 'Narrator'
                      ? data.blockResponseRoll
                      : data.blockResponseRoll === '999999'
                        ? getPrevLogDatas?.previewProfile?.name || "player"
                        : formData.gameNonPlayerName}
                  </Box>
                </Box>
              </Box>
              <Box className='dialogue_scroll animateDialog' bottom={animateDialog ? '-200px' : '16px'}>
                {showTypingEffect === false ? (
                  <TypingEffect
                    text={resMsg}
                    speed={50}
                    setSpeedIsOver={setShowTypingEffect}
                  />
                ) : (
                  resMsg
                )}
              </Box>
              <Box
                display={'flex'}
                position={'fixed'}
                justifyContent={'space-between'}
                w={'95%'}
                bottom={animateDialog ? '-200px' : '0'}
                className={'animateDialog'}
              >
                <Img
                  src={preloadedAssets.left}
                  w={'70px'}
                  h={'50px'}
                  cursor={'pointer'}
                  onClick={() => {
                    SkipContentForBackNavigation();
                  }}
                />
                <Img
                  src={preloadedAssets.right}
                  w={'70px'}
                  h={'50px'}
                  onClick={() => Updatecontent()}
                />
              </Box>
              </Box>
            </Box>
          )}
          {data && type === 'feedback' && (
            <Box
              // position="relative"
              // w={'100%'}
              // height="100vh"
              // backgroundImage={backGroundImg}
              // backgroundSize={'cover'}
              // backgroundRepeat={'no-repeat'}
              className="chapter_potrait"
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
                <GridItem colSpan={1} position={'relative'}>
                <motion.div
                  initial={{ y: 800 }}
                  animate={{ y: animateFeedback ? -800 : 0 }}            
                  transition={{ duration: 0.6 }}
                >
                  <Box w={'fit-content'} display={'flex'} position={'relative'}>
                    <Img
                      src={preloadedAssets.feedi}
                      className="story_note_image"
                      loading="lazy"
                    />
                    <Box
                      position={'absolute'}
                      top={{ base: '5%', md: '6%' }}
                      className="story_feedback_content"
                    >
                      <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        h={'100%'}
                      >
                        <Box
                          w={'90%'}
                          h={'70%'}
                          display={'flex'}
                          justifyContent={'center'}
                          position={'relative'}
                        >
                          <Img
                            src={preloadedAssets?.feedparch}
                            w={'auto'}
                            h={'100%'}
                          />
                          <Box
                            position={'absolute'}
                            top={{base: '-7px', sm: '-7px', lg: '-15px'}}
                            width={'100%'}
                            h={'100%'}
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            alignItems={'center'}
                          >
                            <Box w={'70%'}>
                              <Img src={preloadedAssets.on} h={'4vh'} w={'100%'} />
                            </Box>
                            <Box className="feed_list"> Interaction </Box>
                            <Box
                              w={'70%'}
                              h={'60%'}
                              overflowY={'auto'}
                              className="feedback_content_text"
                            >
                              <Box display={'flex'} mt={'10px'}>
                                <Img src={preloadedAssets.FB} h={'1em'} w={'1em'} />
                                <Text textAlign={'justify'}>{feed}</Text>
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            w={'120%'}
                            mt={'20px'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            cursor={'pointer'}
                            position={'absolute'}
                            bottom={'-8%'}
                          >
                            <Img
                              src={preloadedAssets.left}
                              className={'interaction_button'}
                              onClick={() => {
                                LastModiPrevData(data);
                              }}
                            />
                            <Img
                              src={preloadedAssets.right}
                              className={'interaction_button'}
                              // onClick={() => getData(data)}
                              onClick={() => upNext()}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
                </GridItem>
              </Grid>
            </Box>
          )}
        </Box>
      </>
    );
  };

export default Story;
