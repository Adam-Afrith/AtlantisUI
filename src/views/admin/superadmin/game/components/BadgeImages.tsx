// new file BadgeImages.tsx by brindha to display badge images

import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box, Image } from "@chakra-ui/react";

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
}

const BadgeImages: React.FC<BadgeImagesProps> = ({ isModalOpen, onClose, badgeData, handleBadgeSelection }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleSelection = (imageUrl: string) => {
    setSelectedImage(selectedImage === imageUrl ? null : imageUrl);
  };
  return (
    <Modal isOpen={isModalOpen} onClose={onClose} size='4xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Badge</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Render images from badgeData in the modal */}
          {/* {badgeData.map((badge, index) => (
            <img key={index} src={badge.gasAssetImage} alt={`Badge ${index + 1}`} onClick={() => handleBadgeSelection(badge.gasAssetImage)} />
          ))} */}
          <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
            {badgeData && badgeData.map((badge, index) => (
              <Box
                key={index}
                m={4}
                textAlign="center"
                border={selectedImage === badge.gasAssetImage ? '2px solid blue' : '2px solid transparent'}
                borderRadius="md"
                cursor="pointer"
                onClick={() => {
                  toggleSelection(badge.gasAssetImage);
                  handleBadgeSelection(badge);
                }}
              >
                <Image
                  src={badge.gasAssetImage}
                  alt={`Badge ${index + 1}`}
                  boxSize="100px"
                  objectFit="cover"
                  // cursor="pointer"
                  // onClick={() => handleBadgeSelection(badge)}
                  borderRadius="md"
                  mb={2}
                  _hover={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
                {/* <p>ID: {badge.gasId}</p> */}
                <p>{badge.gasAssetName}</p>
              </Box>
            ))}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BadgeImages;
