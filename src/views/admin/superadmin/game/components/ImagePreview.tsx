
import React from 'react'
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
  CloseButton,
  DrawerProps,
  Img
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Light from '../../../../../assets/img/layout/Light.png';
import { HSeparator } from '../../../../../components/separator/Separator';
import Card from 'components/card/Card';



const ImagePreview: React.FC<{ fetchImg?: any, isOpen?: any, onOpen?: any, onClose?: any, values?: any, setValues?: any, selectedCardIndex?: any, handleBackground?: any, truncateTex?: any }> = ({ fetchImg, isOpen, onOpen, onClose, values, setValues, selectedCardIndex, handleBackground, truncateTex, }) => {

  //eslint-disable-next-line
  const { colorMode, toggleColorMode } = useColorMode();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState('Purple');
  const [contrast, setContrast] = useState(false);
  const [toggleBtn, setToggleBtn] = useState<any>();

  // const drawerSize = useBreakpointValue({ base: '100%', lg: '400px' });

  const [showFullText, setShowFullText] = useState(false);
  const maxTextLength = 80; // Maximum characters to display before truncating

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const handle = () => {
    if (!selectedCardIndex) {
      setValues('Selected')
      onClose();
    }
    else if (selectedCardIndex) {
      onClose();
      setValues('Select')
    }

  };
  /////////


  //////////////Changes - 12-Dec-23//////////////////



  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent backgroundColor="#ffffff"  containerProps={{ zIndex: 999999}}>

        <ModalCloseButton color={'black'}/>
        <ModalBody>
          <Flex
            flexDirection={{base:'column',lg:"row"}}
            // justifyContent="Center"
            alignItems="Center"
            height="100vh"
            background="#ffffff" // Adjust the opacity as needed
          >
            <Box w={{base:'100%',lg:'80%'}} m={0} pt={'15px'}>
              {/* Top Content */}
              <Text fontSize={"1.25rem"} color={'#1B2559'} pb={'15px'} fontWeight={'700'}>
                Preview
              </Text>
              <Image
                borderRadius={'20px'}
                src={fetchImg.gasAssetImage}
                alt="Preview"
                width={{base:'100%',lg:"95%"}}
                height={{base:'85%',md:'90%',lg:"80%"}}
              />
            </Box>
            <Box m={0} w={{base:'100%',lg:'30%'}} p={0}>
              <Card
                borderRadius={'none'}
                boxShadow={'5px 5px 20px #c5c5c5'}
                // alignItems={'center'}

                m={0}
                p={5}
              >
                {/* Truncated Text Content */}
                <Text fontSize={"1.25rem"} color={'#1B2559'} fontWeight={'700'}>
                  Title
                </Text>
                <Text fontSize={"1rem"} style={{ whiteSpace: 'pre-wrap' }}>
                  {fetchImg?.temp?.tempTitle}
                </Text>
                <Text fontSize={"1.25rem"} color={'#1B2559'} fontWeight={'700'}>
                  Story Line
                </Text>
                <Text fontSize={"1rem"} style={{ whiteSpace: 'pre-wrap' }}>
                  {fetchImg.temp?.tempStoryLine}
                  {/* {truncateTex(fetchImg.stroyline,400,120)}  */}
                </Text>

                <Button
                  bg="#3311db"
                  _hover={{ bg: '#3311db' }}
                  color="#fff"
                  fontSize={{ base: '14px', lg: '16px' }}
                  // mt={{ base: 2, lg: 0 }}
                  mt={'20px'}
                  w={'100%'}
                  // float={"right"}
                  onClick={() => handleBackground(fetchImg, fetchImg.i)}
                >


                  <Text>{selectedCardIndex === fetchImg.i ? 'Selected' : 'Click to select'}</Text>
                </Button>
              </Card>
            </Box>
            <Box mt={4} alignSelf="flex-end"> {/* Align the button to the right */}
              {/* Button */}
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreview;