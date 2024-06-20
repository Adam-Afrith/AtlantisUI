

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
  IconButton
  // brindha end
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { gameDuplicateQuestionEntirely, getImages, updateGame } from 'utils/game/gameService';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import BadgeImages from '../BadgeImages'
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md';
import TextField from 'components/fields/TextField';
import { updatePreviewData, onFocusField,onBlurField } from '../../../../../../store/preview/previewSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit'; // Import Dispatch type from @reduxjs/toolkit

interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}


const ThankyouScreen: React.FC<{
  handleChange: (e: any) => void;
  formData: any;
  handleEnables: (e: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;


}> = ({
  handleChange,
  formData,
  setFormData,
  handleEnables
}) => {

    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const [textTakeawayTyped, setTextTakeawayTyped] = React.useState('');
    const [msgCharacterCount, setMsgCharacterCount] = useState(200);
    const [feedbackLinkCount, setfeedbackLinkCount] = useState(50);
    const [characterCountQ1, setCharacterCountQ1] = useState(100);
    const [characterCountQ2, setCharacterCountQ2] = useState(100);
    const [characterCountQ3, setCharacterCountQ3] = useState(100);
    const [characterCountQ4, setCharacterCountQ4] = useState(100);
    const dispatch: Dispatch<any> = useDispatch();
    const handleTextChange = (e: any, maxChars: number, setCharCount: React.Dispatch<React.SetStateAction<number>>) => {
      const inputText = e.target.value;
      if (inputText !== '') {
        setFormData({
          ...formData,
          isfeedbackthankyou: false,
        });
      }
      const remainingCharacters = maxChars - inputText.length;
      setCharCount(remainingCharacters);
      handleChange(e);
      handleEnables(e);
    };
    ///////////////////////ScreenStates////////////////////////////////
    ///Afrith-modified-29-Dec-23

    return (
      <Stack direction="column" gap="20px">
        <Card>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap="0px">
            <FormLabel htmlFor="email-" mb="0px" fontSize='sm' ml={"9px"} fontWeight='bold' color={textColorPrimary}>
              Thank You Message
            </FormLabel>
            <TextField
              mb="0px"
              onChange={(e: any) => handleTextChange(e, 200, setMsgCharacterCount)}
              onFocus = {(e:any)=>dispatch(onFocusField({gameId: formData.gameId,focusValue: e.target.value || ''}))}
              onBlur={(e:any)=>dispatch(onBlurField({gameId: formData.gameId,blurValue: e.target.value || ''}))}
              name='gameThankYouMessage'
              id="Collection"
              placeholder="eg. Thank You For Playing"
             value={formData?.gameThankYouMessage}
              maxLength={200}
              style={{
                border: formData.isfeedbackthankyou ? '1px solid red' : '1px solid #ccc',
              }}
            />
            <p style={{ fontSize: '12px', color: 'grey' }}>{msgCharacterCount} characters left</p>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="20px"
            >
              <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                Collect Learner Feedback
              </FormLabel>
              <Switch
                isChecked={formData.gameIsCollectLearnerFeedback === 'true' ? true : false}
                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsCollectLearnerFeedback"
                name="gameIsCollectLearnerFeedback"
                onChange={handleChange}
                mr={"7px"}
              />
            </FormControl>
          </SimpleGrid>
          {formData.gameIsCollectLearnerFeedback === 'true' && (
            <>
              <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}  >
                Which parameters would you like to include?
                <p style={{ color: 'grey', fontSize: '12px' }}>(You may include upto 4 parameters)</p>
              </FormLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  mt="20px"
                >
                  <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                    Content
                  </FormLabel>
                  <Switch
                    isChecked={formData.gameContent === 'true' ? true : false}

                    color="#fff"
                    colorScheme='brandScheme'
                    size='md'
                    id="gameContent"
                    name="gameContent"
                    onChange={handleEnables}
                  />
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  mt="20px"
                >
                  <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                    Recommendation
                  </FormLabel>
                  <Switch
                    isChecked={formData.gameRecommendation === 'true' ? true : false}

                    color="#fff"
                    colorScheme='brandScheme'
                    size='md'
                    id="gameRecommendation"
                    name="gameRecommendation"
                    onChange={handleEnables}
                  />
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  mt="20px"
                >
                  <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                    Relevance
                  </FormLabel>
                  <Switch
                    isChecked={formData.gameRelevance === 'true' ? true : false}

                    color="#fff"
                    colorScheme='brandScheme'
                    size='md'
                    id="gameRelevance"
                    name="gameRelevance"
                    onChange={handleEnables}
                  />
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  mt="20px"
                >
                  <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                    Gamification
                  </FormLabel>
                  <Switch
                    isChecked={formData.gameGamification === 'true' ? true : false}

                    color="#fff"
                    colorScheme='brandScheme'
                    size='md'
                    id="gameGamification"
                    name="gameGamification"
                    onChange={handleEnables}
                  />
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  mt="20px"
                >
                  <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                    Behaviour
                  </FormLabel>
                  <Switch
                    isChecked={formData.gameBehaviour === 'true' ? true : false}

                    color="#fff"
                    colorScheme='brandScheme'
                    size='md'
                    id="gameBehaviour"
                    name="gameBehaviour"
                    onChange={handleEnables}
                  />
                </FormControl>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  mt="20px"
                >
                  <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                    Others
                  </FormLabel>
                  <Switch
                    isChecked={formData.gameOthers === 'true' ? true : false}

                    color="#fff"
                    colorScheme='brandScheme'
                    size='md'
                    id="gameOthers"
                    name="gameOthers"
                    onChange={handleEnables}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
                mt="20px"
              >
                <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                  Make above feedback mandatory for learners
                </FormLabel>
                <Switch
                  isChecked={formData.gameIsFeedbackMandatory === 'true' ? true : false}
                  color="#fff"
                  colorScheme='brandScheme'
                  size='md'
                  id="gameIsFeedbackMandatory"
                  name="gameIsFeedbackMandatory"
                  onChange={handleChange}
                  // mr="273"
                  mb={"5px"}
                />
              </FormControl>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
                mt="20px"
              >
                <FormLabel htmlFor="email-" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                  Share a custom feedback form
                </FormLabel>
                <Switch
                  isChecked={formData.gameFeedBack === 'true' ? true : false}
                  color="#fff"
                  colorScheme='brandScheme'
                  size='md'
                  id="gameFeedBack"
                  name="gameFeedBack"
                  onChange={handleChange}
                  // mr="273"
                  mb={"5px"}
                />
              </FormControl>
              {formData.gameFeedBack === 'true' && (
                <InputField
                  mb="10px"
                  me="30px"
                  id="gameFeedBackLink"
                  placeholder="eg. FeedBackLink"
                  value={formData.gameFeedBackLink}
                  onChange={handleChange}
                  name='gameFeedBackLink'
                  maxLength={50}
                />
              )}
            </>
          )}
        </Card>
      </Stack>
    );
  }
export default ThankyouScreen;