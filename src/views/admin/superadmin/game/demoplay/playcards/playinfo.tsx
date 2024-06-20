/* eslint-disable */

import {
  Box,
  Modal,
  Button,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  SortingState,
} from '@tanstack/react-table';
// Custom components

import * as React from 'react';
import { useParams } from 'react-router-dom';
export default function PlayInfo(props: {
  // tableData: any;
  onOpen?: any;
  onClose?: any;
  isOpen?: any;
  startDemo?:any;
  setIsGetsPlayAudioConfirmation?: any;
}) {
  const { onOpen, onClose, isOpen,startDemo, setIsGetsPlayAudioConfirmation } = props;
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <>
    <Modal isOpen={true} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box
            width={'100%'}
            h={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'flex-end'}
          >
            <Box>
              <Text mt={'20px'} fontSize={'25px'} fontWeight={700} mb={'10px'} >Welcome To Atlantis..!</Text>
              <Box ml={'20px'} color={textColor} fontSize={'sm'}>
                Please play in landscape for Better quality<br/> <span style={{textAlign: 'center'}}>Thank you.</span>
              </Box>
              
              {/* <Text mt={'20px'} mb={'10px'} fontSize={'25px'} fontWeight={700}>Thank You...!</Text> */}
            <Box w={'100%'} display={'flex'} justifyContent={'flex-end'}>
              <Button
                bg="#11047a"
                _hover={{ bg: '#190793' }}
                color="#fff"
                h={'46px'}
                w={'128px'}
                mb={'10px'}
                onClick={()=>window.location.reload()}
              >
                Refresh
              </Button>
            </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
     </>
  );
}
