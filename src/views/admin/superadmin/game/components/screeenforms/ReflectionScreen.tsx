

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
import { gameDuplicateQuestionEntirely, getImages, updateGame,getReflection} from 'utils/game/gameService';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';
import BadgeImages from '../BadgeImages'
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md';
import { updatePreviewData, onFocusField,onBlurField, onFieldContentModified } from '../../../../../../store/preview/previewSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit'; // Import Dispatch type from @reduxjs/toolkit

interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}


const ReflectionScreen: React.FC<{
  handleChange: (e: any) => void;
  formData: any;

  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setReflection: any;
  handleReflectionInput: any;
  reflectionQuestions: any;
  reflectionQuestionsdefault: any;
  handlesaveReflection: any;
}> = ({
  handleChange,
  formData,
  setFormData,
  setReflection,
  handleReflectionInput,
  reflectionQuestions,
  reflectionQuestionsdefault,
  handlesaveReflection,
}) => {
    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const [showTextArea, setTexArea] = useState(4);
    const [showTextarea, setShowTextarea] = useState('');
    const [arra, setArra] = useState([]);
    const [characterCount, setCharacterCount] = useState<number[]>(
      // Array.from({ length: showTextArea }, () => 150)
      Array.from({ length: showTextArea }, (_, index) => (
        (reflectionQuestions[`ref${index + 1}`]?.length) ? (90 - reflectionQuestions[`ref${index + 1}`]?.length) : 90)
      )
    );
    const dispatch: Dispatch<any> = useDispatch();
    const [lastFocusedValue, setLastFocusedValue] = useState('');

    // useEffect(()=>{
    //   // formData
    //   Array.from({ length: showTextArea }, (_, index) => (
    //     {reflectionQuestions[`ref${index + 1}`]} 
    // ));
    // },[])

    const handleTextReflectionChange = (e: any, index: number) => {
      const inputText = e.target.value;
      const updatedCharacterCount = characterCount.map((count, i) =>
        i === index - 1 ? 90 - inputText.length : count
      );
      setCharacterCount(updatedCharacterCount);
      handleReflectionInput(e, index + 1);
    };
    const handleArra = (e: any) => {
      const selectedValue = parseInt(e.target.value);
      setTexArea(selectedValue);
      setFormData((prev: any) => ({
        ...prev, gameReflectionQuestion: selectedValue,

      }))
      /** Handle the data updation on change to show realtime preview */
      dispatch(onFieldContentModified({gameId: formData.gameId, modifiedField: e.target.name, updatedValue : selectedValue}));
      /**End -  Handle the data updation on change to show realtime preview */

      if (selectedValue === 1) {
        setShowTextarea('A')
      }
      else if (selectedValue === 2) {
        setShowTextarea('AB')
      }
      else if (selectedValue === 3) {
        setShowTextarea('ABC')
      }
      else if (selectedValue === 4) {
        setShowTextarea('ABCD')
      }
      else if (isNaN(selectedValue)) {
        setShowTextarea('E')
      }
      setArra(Array.from({ length: e.target.value }, (_, index) => ({ id: index + 1, value: '' })));
      setReflection(['']);
    }
    useEffect(() => {
      const selectedValue = parseInt(formData.gameReflectionQuestion);
      setTexArea(selectedValue);

      if (selectedValue === 1) {
        setShowTextarea('A');
      } else if (selectedValue === 2) {
        setShowTextarea('AB');
      } else if (selectedValue === 3) {
        setShowTextarea('ABC');
      } else if (selectedValue === 4) {
        setShowTextarea('ABCD');
      } else if (isNaN(selectedValue)) {
        setShowTextarea('E');
      }

      setArra(Array.from({ length: selectedValue }, (_, index) => ({ id: index + 1, value: '' })));
      setReflection(['']);
    }, [formData.gameReflectionQuestion]);


     const handleOnBlurValue = (e: any) =>{ 
        const {name, value } = e.target;
        console.log("value", value)
        if(lastFocusedValue.trim() !== value)
          {
            dispatch(onFieldContentModified({gameId: formData.gameId, modifiedField: name, updatedValue : value}));
          }
    }
          console.log("lastFocusedValue", lastFocusedValue)


    return (
      <Stack direction="column" gap="20px">
        <Card>
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
            mt="10px"
          >
            <FormLabel htmlFor="email-" mb="10px" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
              Show Reflection Screen
            </FormLabel>
            <Switch
              isChecked={formData.gameIsShowReflectionScreen === 'true' ? true : false}

              color="#fff"
              colorScheme='brandScheme'
              size='md'
              id="gameIsShowReflectionScreen"
              name="gameIsShowReflectionScreen"
              onChange={handleChange}
            />
          </FormControl>
          {/* brindha start */}
          {formData.gameIsShowReflectionScreen === 'true' && (
            <>
              <Flex display="flex"
                alignItems="center"
                justifyContent={'space-between'}
                mt="20px">
                <FormLabel htmlFor="email-" mb="0" fontSize="sm" fontWeight="bold" color={textColorPrimary}>
                  How many questions would you like?
                </FormLabel>
                <Select
                  mb="0px"
                  id="Collection"
                  isDisabled={formData?.gameIsShowReflectionScreen === 'true' ? false : true}

                  value={formData.gameReflectionQuestion}
                  name="gameReflectionQuestion"
                  onChange={handleArra}
                  isRequired
                  ml="10px" // Add margin between the FormLabel and Select
                  width={'15%'}
                  h={'25%'}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </Select>
              </Flex>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
                mt="20px"
              >
                <FormLabel htmlFor="email-" mb="0" fontSize='sm' fontWeight='bold' color={textColorPrimary}>
                  Make these questions mandatory for the learner
                </FormLabel>
                <Switch
                  isChecked={formData.gameIsLearnerMandatoryQuestion === 'true' ? true : false}
                  disabled={formData?.gameIsShowReflectionScreen === 'true' ? false : true}
                  color="#fff"
                  colorScheme='brandScheme'
                  size='md'
                  id="gameIsLearnerMandatoryQuestion"
                  name="gameIsLearnerMandatoryQuestion"
                  onChange={handleChange}
                  isRequired
                />
              </FormControl>
            </>
          )}
          {/* brindha end */}

        </Card>
        {/* brindha start */},
        {formData.gameIsShowReflectionScreen === 'true' && (
          <Card>
            <Stack gap="20px">
              {Array.from({ length: showTextArea }, (_, index) => (
                <div>
                  <TextField
                    key={index}
                    mb="0px"
                    id={`reflectionQuestion${index + 1}`}
                    placeholder={reflectionQuestionsdefault[index]}
                    label={` Question ${index + 1}`}
                    // onChange={(e:any) => handleReflectionInput( e,index+1,)}
                    onChange={(e: any) => {handleTextReflectionChange(e, index + 1); }}
                    // onFocus = {(e:any)=>dispatch(onFocusField({gameId: formData.gameId,focusValue: e.target.value}))}
                    // onBlur={(e:any)=>dispatch(onBlurField({gameId: formData.gameId,blurValue: e.target.value}))}
                    name={`ref${index + 1}`}
                    onBlur={handleOnBlurValue}
                    onFocus={(e:any)=>setLastFocusedValue(e.target.value)}
                    value={reflectionQuestions[`ref${index + 1}`]} // Access the specific question using the index
                    maxLength={90}
                    style={{
                      border: formData.gameIsShowReflectionScreen === 'true' && !reflectionQuestions[`ref${index + 1}`] ? '1px solid red' : '1px solid #ced4da',
                      // Add other styles as needed
                    }}
                  />
                  <p style={{ fontSize: '12px', color: 'grey' }}>{characterCount[index]} characters left</p>
                </div>
              ))}
            </Stack>

          </Card>
        )}
        {/* brindha end */}
        {/* <SimpleGrid columns={{ base: 1, md: 1 }} mt={'20px'}>
{arra && formData?.gameIsShowReflectionScreen ==='true' && (
  <Card>
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      {arra.map((it, i) => (
        <Stack key={i} gap="20px">
          <TextField
            key={i}
            mb="0px"
            id="Collection"
            placeholder="eg. How can you apply these learnings back at work?"
            label={`Reflection Question ${i + 1}`}
            onChange={(e:any) => handleInputChange(i, e.target.value)}
          />
        </Stack>
      ))}
    </SimpleGrid>
  </Card>
)}
</SimpleGrid> */}
      </Stack>
    );
  }
export default ReflectionScreen;