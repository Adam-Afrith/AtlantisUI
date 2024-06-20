import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Img,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
  useTheme,
  useToast,
  // brindha start
  Select,
  Textarea,
  Link,
  Slider,
  Image,
  IconButton,
  // brindha end
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  gameDuplicateQuestionEntirely,
  getImages,
  getSkills,
  updateGame,
} from 'utils/game/gameService';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import BadgeImages from '../BadgeImages';
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md';
import TextField from 'components/fields/TextField';
import next from 'assets/img/screens/next.png';

interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const extractLink = (text: any) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (text) {
    const urls = text?.match(urlRegex);

    return urls ? urls[0] : null;
  }
  return null
};
const WelcomeScreen: React.FC<{ formData: any; imageSrc: any }> = ({
  formData,
  imageSrc,
}) => {
  const fetch = async () => {
    const res = await getSkills();
    if (res?.status === 'Success') {
      console.log(res?.data);
      // setSkills()
    }
  }
  useEffect(() => {
    fetch();
  }, [])

  const link = extractLink(formData.gameAdditionalWelcomeNote);
  return (
    <>
      {imageSrc && (
        <Box className='welcome-screen'>
          <Box className='welcome-screen-box'>
            <Img src={imageSrc} className='bg-img' />
          </Box>
          <Box className='content-box' fontFamily={'gametext'}>
            <Box w={'60%'} className='content'>
              <Text
                fontSize={{
                  base: '13px',
                  sm: '13px',
                  md: '15px',
                  lg: '20px',
                }}
              >
                {formData.gameTitle}
              </Text>
              <Text
                fontSize={{
                  base: '11px',
                  sm: '12px',
                  md: '13px',
                  lg: '15px',
                }}
              >
                {link}
              </Text>
              {formData.gameIsShowSkill === 'true' && (
                <Text
                  fontSize={{
                    base: '11px',
                    sm: '12px',
                    md: '13px',
                    lg: '15px',
                  }}
                >
                  {formData.gameSkills}
                </Text>
              )}
              {formData.gameIsShowStoryline === 'true' && (
                <Text
                  fontSize={{
                    base: '11px',
                    sm: '12px',
                    md: '13px',
                    lg: '15px',
                  }}
                >
                  {formData.gameStoryLine}
                </Text>
              )}
              {formData.gameIsShowLearningOutcome === 'true' && (
                <Text
                  fontSize={{
                    base: '11px',
                    sm: '12px',
                    md: '13px',
                    lg: '15px',
                  }}
                >
                  {formData.gameLearningOutcome}
                </Text>
              )}
              {formData.gameIsShowGameDuration === 'true' && (
                <Text
                  fontSize={{
                    base: '11px',
                    sm: '12px',
                    md: '13px',
                    lg: '15px',
                  }}
                >
                  {formData.gameDuration}
                </Text>
              )}
              {formData.gameIsShowAuhorName === 'true' && (
                <Text
                  fontSize={{
                    base: '11px',
                    sm: '12px',
                    md: '13px',
                    lg: '15px',
                  }}
                >
                  {formData.gameAuthorName}
                </Text>
              )}
              {formData.gameIsShowAdditionalWelcomeNote === 'true' && (
                <Text
                  fontSize={{
                    base: '11px',
                    sm: '12px',
                    md: '13px',
                    lg: '15px',
                  }}
                >
                  {formData.gameAdditionalWelcomeNote}
                </Text>
              )}
            </Box>

          </Box>

        </Box>
      )}

      {/* {formData.gameIsShowSkill === "true" && (
      
        <Text color="black" fontSize={'14'} fontWeight="700" mb={'100px'}>
          {formData.gameSkills}
        </Text>
      
    )}
    {formData.gameIsShowStoryline === "true" && (
      
      <Text color="black" fontSize={'14'} fontWeight="700" mb={'100px'}>
        {formData.gameStoryLine}
      </Text>
    
  )}
  {formData.gameIsShowLearningOutcome === "true" && (     
      <Text color="black" fontSize={'14'} fontWeight="700" mb={'100px'}>
        {formData.gameLearningOutcome}
      </Text>
    
  )}
  {formData.gameIsShowGameDuration === "true" && (
      
      <Text color="black" fontSize={'14'} fontWeight="700" mb={'100px'}>
        {formData.gameDuration}
      </Text>
    
  )}
  {formData.gameIsShowAuhorName === "true" && (
      
      <Text color="black" fontSize={'14'} fontWeight="700" mb={'100px'}>
        {formData.gameAuthorName}
      </Text>
    
  )}
  {formData.gameIsShowAdditionalWelcomeNote === "true" && (      
      <Text color="black" fontSize={'14'} fontWeight="700" mb={'100px'}>
        {formData.gameAdditionalWelcomeNote}
      </Text>    
  )} */}
    </>
  );
};
export default WelcomeScreen;
