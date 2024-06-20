

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
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}


const WelcomeScreen: React.FC<{
  handleChange: (e: any) => void;
  formData: any;

  setFormData: React.Dispatch<React.SetStateAction<any>>;
 

}> = ({
  handleChange,
  formData,
  setFormData,

}) => {

    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const [characterCount, setCharacterCount] = useState(100);

    const handleTextWelcomeChange = (e: any) => {
      const inputText = e.target.value;
      const remainingCharacters = 100 - inputText.length;
      setCharacterCount(remainingCharacters);
      handleChange(e); // Pass the event to the handleChange function to update form data
    };
    const checkvalue = (e: any) => {
      const trimmedValue1 = e.currentTarget.value.trim(); // Use currentTarget instead of target
      if (trimmedValue1 !== '') {
        setFormData((prev: any) => ({
          ...prev,
          gameIsShowAdditionalWelcomeNoteInvalid: false,
        }));
      }
    };
    const maxCharacters=100
    return (
      <Stack direction="column" gap="20px">
        <Card>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap="20px">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="10px"
            >
              <FormLabel htmlFor="email-" mb="0px" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                Skills
              </FormLabel>
              <Switch
                isChecked={formData.gameIsShowSkill === 'true' ? true : false}

                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsShowSkill"
                name="gameIsShowSkill"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="10px"
            >
              <FormLabel htmlFor="email-" mb="0px" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                Story Line
              </FormLabel>
              <Switch
                isChecked={formData.gameIsShowStoryline === 'true' ? true : false}

                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsShowStoryline"
                name="gameIsShowStoryline"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="10px"
            >
              <FormLabel htmlFor="email-" mb="0px" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                Learning Outcome
              </FormLabel>
              <Switch
                isChecked={formData.gameIsShowLearningOutcome === 'true' ? true : false}

                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsShowLearningOutcome"
                name="gameIsShowLearningOutcome"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="10px"
            >
              <FormLabel htmlFor="email-" mb="0px" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                Game Duration
              </FormLabel>
              <Switch
                isChecked={formData.gameIsShowGameDuration === 'true' ? true : false}
                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsShowGameDuration"
                name="gameIsShowGameDuration"
                onChange={handleChange}
              />


            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="-20px"
            ><Text fontSize="12px" textColor="grey">{(formData.gameDuration !== "") ?
              "Estimated duration. " + formData.gameDuration + " mins" : ""}</Text></FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="10px"
            >
              <FormLabel htmlFor="email-" mb="0px" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                Author Name
              </FormLabel>
              <Switch
                isChecked={formData.gameIsShowAuhorName === 'true' ? true : false}
                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsShowAuhorName"
                name="gameIsShowAuhorName"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="10px"
            >
              <FormLabel htmlFor="email-" mb="5px" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                <Text> Additional Welcome Note</Text>

              </FormLabel>


              <Switch
                isChecked={formData.gameIsShowAdditionalWelcomeNote === 'true' ? true : false}
                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsShowAdditionalWelcomeNote"
                name="gameIsShowAdditionalWelcomeNote"
                onChange={handleChange}
              />

            </FormControl>

          </SimpleGrid>
          <SimpleGrid
            columns={{ base: 1, md: 1 }}
            gap="20px"
            mt={'0px'}
          >
            <FormLabel fontSize="12px" mt="5px" color="gray" htmlFor="Collection">
              An additional Note can be used to set the context or share reference material after the Welcome Screen.
            </FormLabel>
          </SimpleGrid>
          <SimpleGrid
            columns={{ base: 1, md: 1 }}
            gap="20px"
            mt={'0px'}
          >
            {/* <Text>Additional WelcomeZ Note {formData?.gameIsShowAdditionalWelcomeNote === 'true' && <span style={{ color: 'red' }}>*</span>}</Text> */}

            {/*************Afrith-Modified-20-12-23********************/}
            {formData.gameIsShowAdditionalWelcomeNote === 'true' && (
              <div>
                <TextField
                  disabled={formData?.gameIsShowAdditionalWelcomeNote === 'true' ? false : true}
                  mb="0px"
                  id="Collection"
                  name='gameAdditionalWelcomeNote'
                  placeholder="eg. Try to understand what went wrong before reacting"
                  onChange={handleTextWelcomeChange}
                  value={formData.gameAdditionalWelcomeNote}
                  maxLength={100}
                  onKeyPress={checkvalue}
                  style={{
                    border: formData.gameIsShowAdditionalWelcomeNoteInvalid ? '1px solid red' : '1px solid #ccc',

                  }}
                />
                {/* <p style={{ fontSize: '12px', color: 'grey' }}>{characterCount} characters left</p> */}
                <Text
                    fontSize={'12px'}
                    ml="2.5px"
                  >
                    {maxCharacters -
                      (formData?.gameAdditionalWelcomeNote?.length ||
                        0)}{' '}
                    Character left
                  </Text>
              </div>
            )}
            {/***************Afrith-Modified-Ends-20-12-23***************************/}

          </SimpleGrid>
        </Card>
      </Stack>
    );
  }
export default WelcomeScreen;