

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
import { updatePreviewData, onFocusField,onBlurField, onFieldContentModified } from '../../../../../../store/preview/previewSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit'; // Import Dispatch type from @reduxjs/toolkit

interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

 
const TakewayScreen: React.FC<{
  handleChange: (e: any) => void;
  formData: any;

  setFormData: React.Dispatch<React.SetStateAction<any>>;


}> = ({
  handleChange,
  formData,
  setFormData,

}) => {
    const [value, setValue] = useState<String>();
    const [characterCount, setCharacterCount] = useState(250);
    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const [textTakeawayTyped, setTextTakeawayTyped] = React.useState('');
    const textareaRef = useRef(null);
    const dispatch: Dispatch<any> = useDispatch();
    const [lastFocusedValue, setLastFocusedValue] = useState('');
    
    useEffect(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });

    ///////////////////////ScreenStates////////////////////////////////
    ///Afrith-modified-29-Dec-23
    useEffect(() => {
      if (!formData.gameTakeawayContent) {
        setTextTakeawayTyped('');
      } else {
        setTextTakeawayTyped(formData.gameTakeawayContent);
      }
    }, [formData.gameTakeawayContent]);

    const handleTextTakeawayChange = (e: any) => {
      const inputText = e.target.value;
      const remainingCharacters = 250 - inputText.length;
      setCharacterCount(remainingCharacters);
      setTextTakeawayTyped(e.target.value);
      handleChange(e); // Pass the event to the handleChange function to update form data
    };
    let previousLength = 0;
    const handleInput = (event: any) => {
      const bullet = "\u2022";
      const currentValue = event.target.value;
      const newLength = currentValue.length;
      setValue(event.target.value);

      if (event.nativeEvent instanceof InputEvent) {
        const keyCode = (event.nativeEvent as InputEvent).inputType;
        if (keyCode === 'insertLineBreak') {
          event.preventDefault();
          event.target.value = `${currentValue}${bullet} `;
        } else if (keyCode === 'deleteContentBackward') {
          const lastBulletIndex = currentValue.lastIndexOf(bullet);
          if (lastBulletIndex !== -1 && lastBulletIndex === newLength - 1) {
            event.target.value = currentValue.slice(0, lastBulletIndex);
          }
        } else {
          if (previousLength === 0 && currentValue.length <= 1) {
            event.target.value = `${bullet} ${currentValue}`;
          }
          if (newLength > previousLength) {
            if (currentValue.endsWith(bullet) || currentValue.trim() === bullet) {
              event.preventDefault();
              event.target.value = `${currentValue} `;
            }
          }
        }
      }
      dispatch(onFieldContentModified({gameId: formData.gameId, modifiedField: event.target.name, updatedValue : event.target.value}));
      setFormData((prev: any) => ({ ...prev, gameTakeawayContent: event.target.value }));
      previousLength = event.target.value.length;
    };

    
  //   const handleOnBlurValue = (e: any) =>{ 
  //     const {name, value } = e.target;
  //     console.log("%%%%%%%%%value", value)
  //     if(lastFocusedValue.trim() !== value)
  //     {
  //       dispatch(onFieldContentModified({gameId: formData.gameId, modifiedField: name, updatedValue : value}));
  //     }
  // }
    return (
      <Stack direction="column" gap="20px">
        <Card>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap="20px">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              mt="20px"
            >
              <FormLabel htmlFor="email-" mb="10px" ml='10px' fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                Show Takeaways
              </FormLabel>
              <Switch
                isChecked={formData.gameIsShowTakeaway === 'true' ? true : false}
                color="#fff"
                colorScheme='brandScheme'
                size='md'
                id="gameIsShowTakeaway"
                name="gameIsShowTakeaway"
                onChange={handleChange}
              />
            </FormControl>
            {/**********Afrith-Modified-20-12-23****************/}
            {formData.gameIsShowTakeaway === 'true' && (
              <div>
                <TextField
                  ref={textareaRef}
                  mb="0px"
                  disabled={formData?.gameIsShowTakeaway === 'true' ? false : true}
                  placeholder="eg. Try to understand what went wrong before reacting"
                  label="Takeaways Content"
                  id="gameTakeawayContent"
                  name="gameTakeawayContent"
                  value={formData?.gameTakeawayContent}
                  onChange={handleInput}
                  // onFocus={(e:any)=>setLastFocusedValue(e.target.value)}
                  // onBlur={handleOnBlurValue}
                  // onFocus = {(e:any)=>dispatch(onFocusField({gameId: formData.gameId,focusValue: e.target.value}))}
                  // onBlur={(e:any)=>dispatch(onBlurField({gameId: formData.gameId,blurValue: e.target.value}))}
                  maxLength={250}
                  rows="5"
                  wrap="hard"
                  resize="none" // Prevent manual resizing
                  style={{ border: formData.gameIsShowTakeaway === 'true' && !formData?.gameTakeawayContent ? '1px solid red' : '1px solid #ced4da', minHeight: "350px" }}
                />
                <p style={{ fontSize: '12px', color: 'grey' }}>{formData?.gameTakeawayContent?.length ? (`${250 - formData?.gameTakeawayContent?.length}  characters left`) : ('250 characters left')}</p>
              </div>
            )}
            {/**********Afrith-Modified-20-12-23*************************/}
          </SimpleGrid>
        </Card>
      </Stack>
    );
  }
export default TakewayScreen;