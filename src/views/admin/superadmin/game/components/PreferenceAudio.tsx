// new file PreferenceAudio.tsx by brindha to display badge images

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Image,
  useColorModeValue,
  Flex,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FaMusic, FaPlay, FaPause } from 'react-icons/fa6';
import { GiMusicalNotes } from 'react-icons/gi';
import { getAudio, getIntroAudio } from 'utils/game/gameService';
import { TiTick } from 'react-icons/ti';
import { MdClose, MdOutlineCloudUpload, MdOutlineCheck } from 'react-icons/md';
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

interface BadgeImagesProps {
  isModalOpen: boolean;
  onClose: () => void;
  badgeData: Badge[];
  handleBadgeSelection: (badge: Badge) => void;
  textColorPrimary?: any;
}

const PreferenceAudio: React.FC<BadgeImagesProps> = ({
  isModalOpen,
  onClose,
  badgeData,
  handleBadgeSelection,
  textColorPrimary,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  useEffect(() => {
    if (hoveredIndex || hoveredIndex === 0) {
      //start playing the corresponding music
      setAudioBlobUrl(badgeData[hoveredIndex].gasAssetImage); //url
    } else {
      // stop music play
      console.log('stop music play', hoveredIndex);
      if (audioBlobUrl) {
        audioRef.current.pause();
        setAudioBlobUrl(null); //url
      }
    }
  }, [hoveredIndex]);

  const toggleSelection = (imageUrl: string) => {
    setSelectedImage(selectedImage === imageUrl ? null : imageUrl);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} size="4xl">
      <ModalOverlay  zIndex={9999999}/>
      <ModalContent w={{base:'80%',md:'100%'}} containerProps={{zIndex:99999999}}>
        <ModalHeader>Select Introduction Music</ModalHeader>
        <ModalBody>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            {badgeData &&
              badgeData.map((badge, index) => (
                <Flex
                  direction="column"
                  bg={
                    
                    hoveredIndex === index
                      ? boxBg
                      : 'transparent'
                  }
                  p="16px 20px"
                  position="relative"
                  borderRadius="14px"
                  mb="38px"
                  boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
                  onClick={() => {
                    toggleSelection(badge.gasAssetImage);
                    handleBadgeSelection(badge);
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  cursor="pointer"
                  border={
                    // selectedImage === badge.gasAssetImage ||
                    hoveredIndex === index
                      ? '2px solid #11047a'
                      : 'none'
                  }
                >
                  {/* {selectedImage === badge.gasAssetImage && (
                    <Flex
                      position="absolute"
                      top="-10px"
                      right="-10px"
                      width="20px"
                      height="20px"
                      borderRadius="50%"
                      bg={
                        selectedImage === badge.gasAssetImage ||
                        hoveredIndex === index
                          ? '#11047a'
                          : 'transparent'
                      }
                      alignItems="center"
                      justifyContent="center"
                      zIndex="1"
                      overflow="hidden"
                    >
                      <Icon
                        as={MdOutlineCheck}
                        w="15px"
                        h="15px"
                        color="white"
                      />
                    </Flex>
                  )} */}
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    height="100%" // Ensure the Flex container takes the full height of the Box
                  >
                    <FaMusic
                      size={50}
                      color="blue"
                      opacity={hoveredIndex === index ? 0.1 : 0.5}
                    />
                  </Flex>
                  {hoveredIndex === index && (
                    <Box
                      position="absolute"
                      top="40%" // Adjust as needed
                      left="55%" // Adjust as needed
                      transform="translate(-50%, -50%)"
                    >
                      <FaPlay size={22} color="#11047a" />
                    </Box>
                  )}
                  <Text fontSize="sm" color={textColorPrimary}>
                    {badge?.gasAssetImage?.split('/').pop()}
                  </Text>
                </Flex>
              ))}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="brand" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
      {/*Hidden Audio Player */}
      <div>
        <audio
          ref={audioRef}
          hidden={true}
          autoPlay={true}
          src={audioBlobUrl}
        />
      </div>
    </Modal>
  );
};
export default PreferenceAudio;
