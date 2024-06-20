// Chakra Imports
import {
  Button,
  Badge,
  Box,
  Flex,
  Icon,
  Text,
  Image,
  useColorModeValue,
  useColorMode,
  useDisclosure,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useBreakpointValue,
  DrawerProps,
  Img,
} from '@chakra-ui/react';

// Games Image

import bk from 'assets/img/games/17.png';
import note from 'assets/img/games/note.png';
import next from 'assets/img/screens/next.png';
import dial from 'assets/img/games/Dialogue.png';
import char from 'assets/img/games/charbox.png';
import right from 'assets/img/games/right.png';
import left from 'assets/img/games/left.png';
import parch from 'assets/img/games/parch.png';
import on from 'assets/img/games/on.png';
import off from 'assets/img/games/off.png';
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import InitialImg from 'assets/img/games/load.jpg';
import { Canvas, useLoader, useFrame } from 'react-three-fiber';
// import Sample from '../../../../assets/img/games/Character_sample.glb';
import Sample from 'assets/img/games/Character_sample.glb';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const EntirePreview: React.FC<{
  prevdata?: any;
  isOpen?: any;
  onOpen?: any;
  onClose?: any;
  show?: any;
  formData?: any;
}> = ({ prevdata, show, isOpen, onOpen, onClose, formData }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [showFullText, setShowFullText] = useState(false);
  const maxTextLength = 80;

  // const find = show.find((it: any) => it.gasId === formData.gameBackgroundId);
  // const img = find.gasAssetImage;

  const [option, setOption] = useState(null);
  const [item, setItem] = useState(null);
  const [data, setData] = useState(null);
  const [showNote, setShowNote] = useState(false),
    [first, setFirst] = useState(false);
  const [intOpt, setIntOpt] = useState([]);
  console.log(item);
  useEffect(() => {
    setShowNote(true);
    setFirst(true);
    setTimeout(() => {
      setFirst(false);
      setShowNote(false);
    }, 1000);
    setItem(prevdata.items[0]);
    setData(findKeyByTex(prevdata.input, prevdata.items[0]));
  }, []);

  function findKeyByValue(obj: any, value: any) {
    const key = Object.keys(obj).find((key) => obj[key]['id'] === value);
    return obj[key];
  }
  function findKeyByTex(obj: any, value: any) {
    const dt = String(value.type + value.input);
    return obj[dt];
  }
  useEffect(() => {
    setShowNote(true);
    setTimeout(() => {
      setShowNote(false);
    }, 1000);
  }, [item]);
  const getData = (next: any) => {
    const delay = findKeyByValue(prevdata.items, next.upNext);
    if (delay) {
      if (delay.type === 'Interaction') {
        const mins = findKeyByTex(prevdata.input, delay);
        if (delay && mins) {
          setItem(delay);
          setData(mins);
        }
        const getOption = () => {
          const alp = prevdata.alp;
          const matchedOptions = [];
          for (const key in alp) {
            if (alp[key]?.seqs === delay?.id) {
              matchedOptions.push(alp[key]?.option);
            }
          }
          setIntOpt(matchedOptions);
        };
        getOption();
      } else {
        const mins = findKeyByTex(prevdata.input, delay);

        if (delay && mins) {
          setItem(delay);
          setData(mins);
        }
      }
    }
    console.log('this is the item', item, 'and the data', data);
  };

  const cameraPosition = new THREE.Vector3(3, 3, 10);
  //  const directionalLightPosition = new Vector3(5, 5, 5);
  //  const planePosition = new Vector3(0, -5, 0);
  // const options = item?.type === 'Interaction' ? getOption() : null;
  console.log('whole item', prevdata);
  console.log('this is the item', item, 'and the data', data);
  // const options = [1, 2, 3, 4];
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent backgroundColor="rgba(0, 0, 0, 0.9)">
        <ModalCloseButton zIndex={99999999999} color={'white'} />
        <ModalBody p={0}>
          <Flex height="100vh">
            {item && data && item.type === 'Note' && (
              <Box
                w={'100%'}
                h={'100vh'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                position={'relative'}
                overflow={'visible'}
                style={{ perspective: '1000px' }}
              >
                {/* <Box w={'80%'}> */}
                <Box
                  backgroundImage={bk}
                  w={'100%'}
                  h={'100vh'}
                  backgroundRepeat={'no-repeat'}
                  backgroundSize={'cover'}
                  transform={`scale(${first ? 1 : 1.3}) translateY(${first ? 0 : -10}%) translateX(${first ? 0 : -10}%)`}
                  transition={'transform 0.9s ease-in-out'}
                >
                  <Box
                    position={'fixed'}
                    top={'200px'}
                    // left={0}
                    right={'0px'}
                    bottom={0}
                    zIndex={999}
                    w={'300px'}
                  >
                    <Canvas
                      camera={{ position: [3, 3, 10] }}
                      // style={{ width: '50%', height: '50vh'}}
                    >
                      <directionalLight
                        position={[5, 5, 5]}
                        intensity={0.8}
                        color={0xffccaa}
                        castShadow
                      />
                      <ambientLight intensity={5.5} />
                      <pointLight
                        position={[5, 5, 5]}
                        color={0xff0000}
                        intensity={1}
                      />
                      <Model />
                      <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, -5, 0]}
                        receiveShadow
                      >
                        <planeGeometry args={[100, 100]} />
                        <shadowMaterial opacity={0.5} />
                      </mesh>
                    </Canvas>
                  </Box>
                </Box>
                {/* <Img
                  src={bk}
                  maxW={'100%'}
                  maxH={'100%'}
                  w={'100%'}
                  h={'100vh'}
                  objectFit={'cover'}
                  transform={`scale(${first ? 1 : 1.3}) translateY(${
                    first ? 0 : -10
                  }%) translateX(${first ? 0 : -10}%) `}
                  transition={'transform 0.9s ease-in-out'}
                /> */}

                {/* </Box> */}
                <Box
                  // backgroundImage={note}
                  style={{
                    transform: `scale(${showNote ? 0.2 : 1})`,
                    transition: 'transform 0.5s ease-in-out',
                  }}
                  position={'fixed'}
                  w={'40%'}
                  h={'80vh'}
                  // backgroundRepeat={'no-repeat'}
                  // backgroundSize={'contain'}
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Img w={'80%'} h={'80vh'} src={note} />
                  <Box
                    position={'fixed'}
                    // mr={'110px'}
                    w={'50%'}
                    mt={'10px'}
                    display={'flex'}
                    flexDirection={'column'}
                    textAlign={'center'}
                    justifyContent={'center'}
                    style={{
                      fontWeight: '900',
                      color: '#D9C7A2',
                      fontSize: '18px',
                      // fontFamily: 'serif, georgia',
                      lineHeight: 1,
                      fontFamily:'cont',
                    }}
                  >
                    {data.note}
                    <Box
                      w={'100%'}
                      // backgroundImage={next}
                      onClick={() => getData(item)}
                      mt={'20px'}
                      display={'flex'}
                      justifyContent={'center'}
                      // backgroundRepeat={'no-repeat'}
                      // backgroundSize={'contain'}
                      cursor={'pointer'}
                    >
                      <Img src={next} w={'200px'} h={'60px'} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {item && data && item.type === 'Dialog' && (
              <Box
              w={'100%'}
              h={'100vh'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                position={'relative'}
              >
                <Img
                  src={bk}
                  maxW={'100%'}
                  maxH={'100%'}
                  w={'100%'}
                  h={'100vh'}
                  transform={'scale(1.3}) translateY(-10%) translateX(-10%)'}
                  transition={'transform 0.9s ease-in-out'}
                />
                <Img
                  style={{
                    transform: `translateY(${showNote ? 200 : 0}px)`,
                    transition:
                      'transform 0.3s ease-in-out, translateY 0.3s ease-in-out',
                  }}
                  position={'fixed'}
                  maxW={'100%'}
                  maxH={'100%'}
                  w={'100%'}
                  h={'240px'}
                  bottom={'0'}
                  src={dial}
                />
                {!showNote && (
                  <>
                    <Box
                      backgroundImage={char}
                      position={'fixed'}
                      h={'70px'}
                      w={'25%'}
                      left={'13%'}
                      fontSize={'25'}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      fontWeight={700}
                      textAlign={'center'}
                      bottom={'150px'}
                      backgroundRepeat={'no-repeat'}
                      backgroundSize={'contain'}
                      fontFamily={'albuma'}
                    >
                      {data.character === '999999'
                        ? 'Player'
                        : data.character === '99999'
                        ? 'Narrator'
                        : formData.gameNonPlayerName}
                    </Box>
                    <Box
                      display={'flex'}
                      position={'fixed'}
                      justifyContent={'space-between'}
                      w={'75%'}
                      bottom={'55px'}
                      fontFamily={'cont'}
                    >
                      {data.dialog}
                    </Box>
                    <Box
                      display={'flex'}
                      position={'fixed'}
                      justifyContent={'space-between'}
                      w={'80%'}
                      bottom={'0'}
                    >
                      <Img
                        src={left}
                        w={'50px'}
                        h={'50px'}
                        cursor={'pointer'}
                      />
                      <Img
                        src={right}
                        w={'50px'}
                        h={'50px'}
                        cursor={'pointer'}
                        onClick={() => getData(item)}
                      />
                    </Box>
                  </>
                )}
              </Box>
            )}
            {item && data && item.type === 'Interaction' && (
              <Box
                w={'100%'}
                h={'100vh'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                position={'relative'}
              >
                <Img
                  src={bk}
                  maxW={'100%'}
                  maxH={'100%'}
                  w={'100%'}
                  h={'100vh'}
                  transform={`scale(1.3}) translateY(-10%) translateX(${showNote ? -200 : 0}px)`}
                  transition={'transform 0.9s ease-in-out'}
                />
                <Box
                  style={{
                    transform: `translateX(${showNote ? -200 : 0}px)`,
                    transition:
                      'transform 0.3s ease-in-out, translateY 0.3s ease-in-out',
                  }}
                  backgroundImage={parch}
                  position={'fixed'}
                  w={'500px'}
                  h={'76vh'}
                  left={'120px'}
                  backgroundSize={'contain'}
                  backgroundRepeat={'no-repeat'}
                >
                  <Box
                    textAlign={'center'}
                    h={'100px'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    fontWeight={700}
                    fontFamily={'cont'}
                  >
                    {data.quesionTitle}
                  </Box>
                  <Box w={'400px'} fontWeight={700} ml={'15%'}>
                    {Object.keys(data.optionsObject).map((item, ind) => (
                      <Box
                        w={'320px'}
                        lineHeight={1}
                        color={option === ind ? 'purple' : ''}
                        textAlign={'center'}
                        cursor={'pointer'}
                        onClick={() => setOption(ind === option ? null : ind)}
                        fontFamily={'cont'}
                      >
                        <Img
                          src={option === ind ? on : off}
                          h={'30px'}
                          w={'100%'}
                        />
                        {data.optionsObject[item]}
                      </Box>
                    ))}
                  </Box>
                  <Box
                    display={'flex'}
                    position={'fixed'}
                    justifyContent={'space-between'}
                    w={'500px'}
                    left={'-10px'}
                  >
                    <Img src={left} w={'50px'} h={'50px'} cursor={'pointer'} />
                    {option !== null && (
                      <Img
                        src={right}
                        w={'50px'}
                        h={'50px'}
                        cursor={'pointer'}
                        onClick={() => getData(item)}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Model: React.FC = () => {
  const groupRef = useRef<any>();
  const gltf = useLoader(GLTFLoader, Sample);

  const mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);

  useFrame((state, delta) => {
    // Rotate the model on the Y-axis
    if (groupRef.current) {
      // groupRef.current.rotation.y += 0.01;
      groupRef.current.castShadow = true;
    }

    mixer.update(delta);
  });
  action.play();

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
    }
  }, []);

  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.color.set(0xffccaaf0); // Set your desired color
      child.material.roughness = 0.4; // Adjust roughness as needed
      child.material.metalness = 0.8; // Adjust metalness as needed
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default EntirePreview;
