import {
  Box, Button, FormControl, FormLabel, Grid, GridItem, Icon, Img, SimpleGrid, Text, useColorModeValue,
  useDisclosure, Flex, TagLabel, Tag, TagCloseButton, Input, Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Checkbox,
} from "@chakra-ui/react"
import Select from 'react-select';
import InputField from "components/fields/InputField"
import TextField from "components/fields/TextField"
import React, { useEffect, useState, useRef } from "react"
import Card from 'components/card/Card'
import TagsField from "components/fields/TagsField"
import { MdAdd, MdAddCircle } from "react-icons/md"
import AddCourse from "./AddCourse"
import narrator from 'assets/img/games/meeting_room.png';
import back from 'assets/img/games/narrator.png';
import { getSkills, getDefaultCat, getDefaultSkill, getGameStoryLine } from "utils/game/gameService"
import { getallcategory,getCategoryList } from "utils/category/category"

import { useParams } from "react-router-dom"
import { AiOutlineEnter } from "react-icons/ai";
// import ResizeTextarea from "react-textarea-autosize";
// import {autosize} from "autosize";
import { updatePreviewData, onFocusField,onBlurField, onFieldContentModified } from '../../../../../store/preview/previewSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit'; // Import Dispatch type from @reduxjs/toolkit
// const AboutStory : React.FC<{handleChange:(e:any)=>void,formData:any,setTags:any,setFormData:any,setCat:any,id:any}>= ({handleChange,formData,setTags,setFormData,setCat,id}) => {
const AboutStory: React.FC<{ handleChange: (e: any) => void, defaultskills: any, setDefaultSkills: any, formData: any, setTags: any, setFormData: any, setCat: any, id: any, languages: any, }> = ({ handleChange, setDefaultSkills, defaultskills, formData, setTags, setFormData, setCat, id, languages }) => {
  //navin 16-12
  const [openCourse, setOpenCourse] = useState(false),
    // [defaultskills,setDefaultSkills] = useState([]),
    [defaultCat,setDefaultCat] = useState([]),
    [skills, setSkills] = useState([]),
    [Catgory, setCatgory] = useState([]),

    [apiSkill, setApiSkill] = useState([]),
    [apiCat, setApiCat] = useState([
      {
        name: 'War',
        id: 1,

      },
    ]);
    
  const [storyLine, setStoryline] = useState<String>();
  const [title, setTitle] = useState<String>();
  const [nonplayerName, setNonplayerName] = useState<String>();
  const dispatch: Dispatch<any> = useDispatch();
  const [lastFocusedValue, setLastFocusedValue] = useState('');

  //nivetha
  const fetchCategoryList = async () => {
    setDefaultCat([]);
    const result = await getCategoryList();
    if (result?.status !== 'Success')
      return console.log('getbackruond error:' + result?.message);
      setDefaultCat(result?.data);

  };
  //nivetha end 
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      gameSkills: defaultskills.length !== 0 ? defaultskills : '',

    }));
  }, [defaultskills])
  
  useEffect(() => {
    if (formData.gameSkills) {
      try {
        const gameSkillsArray = JSON.parse(formData.gameSkills);
        const categoryArray = formData?.gameCategoryId;
        // Now, categoryArray is an array of objects
      } catch (error) {
        console.error('Error parsing gameCategoryId:', error);
      }
    }
  }, []);

  useEffect(() => {
    // fetchDefaultcat();
    fetchCategoryList();
  }, [])
  
  let borderColor = useColorModeValue('secondaryGray.100', 'whiteAlpha.100');
  let bg = useColorModeValue('brand.500', 'brand.400');
  let pastelBlue = useColorModeValue('brand.100', 'brand.300');
  // let lightBlue = 'hsl(252, 100%, 66%)'; 
  // let lightBlue = 'hsl(252.41,98.86%,65.49%)';

  // let lightBlue = 'hsl(252,100%,66%)';
  let lightBlue = useColorModeValue('#3311db5c', '#3311db5c')
  // let lightBlue = useColorModeValue('brand.100', 'brand.300');


  let textColor = useColorModeValue('black', 'white');

    const keyPressSkill = (e: any) => {
    if (e.keyCode === 13) {
      const trimmedValue = e.target.value.trim(); // Remove leading and trailing whitespaces

      if (trimmedValue !== '') {
        setDefaultSkills([
          ...defaultskills,
          {
            crSkillName: trimmedValue,
            crSkillId: defaultskills.length === 0 ? 1 : defaultskills[defaultskills.length - 1].crSkillId + 1
          }
        ]);
        /*** Start - To track the changes */
        const newSkillValues = [
          ...defaultskills,
          {
            crSkillName: trimmedValue,
            crSkillId: defaultskills.length === 0 ? 1 : defaultskills[defaultskills.length - 1].crSkillId + 1
          }
        ];
       foundValueChange(defaultskills, newSkillValues);
          /***End - To track the changes */

        setFormData((prev: any) => ({
          ...prev,
          isSkillsInvalid: false, // Include the new property in the state
        }));
      }

      e.target.value = '';
    }
  };
  //navin 16-12
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const bgHover = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.50' },
  );
  const bgFocus = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.100' },
  );
  let previousLength = 0;

  const handleInput = (event: any) => {
    const bullet = "\u2022";
    const currentValue = event.target.value;
    const newLength = currentValue.length;
    setValue(event.target.value);

    if (event.nativeEvent instanceof InputEvent) {
      const keyCode = (event.nativeEvent as InputEvent).inputType;

      if (keyCode === 'insertLineBreak') {
        // Handle Enter key or newline
        event.preventDefault(); // Prevent the default behavior (line break)
        event.target.value = `${currentValue}${bullet} `;
      } else if (keyCode === 'deleteContentBackward') {
        // Handle Backspace key
        const lastBulletIndex = currentValue.lastIndexOf(bullet);
        if (lastBulletIndex !== -1 && lastBulletIndex === newLength - 1) {
          // If the last character is a space after a bullet, remove both
          event.target.value = currentValue.slice(0, lastBulletIndex);
        }
      } else {
        // Handle other key presses or additions
        if (previousLength === 0 && currentValue.length <= 1) {
          event.target.value = `${bullet} ${currentValue}`;
        }
        if (newLength > previousLength) {
          if (currentValue.endsWith(bullet) || currentValue.trim() === bullet) {
            // If the last character is a bullet or bullet with space, add a space after the bullet
            event.preventDefault(); // Prevent the default behavior
            event.target.value = `${currentValue} `;
          }
        }
      }
    }

    setFormData((prev: any) => ({ ...prev, gameLearningOutcome: event.target.value }));
    previousLength = event.target.value.length;
  };


  const fetch = async () => {
    const result = await getSkills();
    if (result?.status !== 'Success') return console.log('getSkills Error :', result?.error)
    setApiSkill(result?.data);
  }
  useEffect(() => {
    // fetch()
  }, [])
  const handleSkillsChange = (updatedSkills: any) => {
    setSkills(updatedSkills);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();


  //nivetha
  const selectHandler = (selectedOption: any) => {
    // Check if selectedOption is null (i.e., when clearing the selection)
    const categoryId = selectedOption ? selectedOption.value : ""; // Assuming value is the property holding the category ID
  
    setFormData((prev: any) => ({
      ...prev,
      gameCategoryId: categoryId,
      isCategoryIdInvalid: false,
    }));
  }; 

 //nivetha end 
 const maxCharacters=45
  const checkvalue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedValue1 = e.currentTarget.value.trim(); // Use currentTarget instead of target
    if (trimmedValue1 !== '') {
      setFormData((prev: any) => ({
        ...prev,
        isStoryTitleInvalid: false,
      }));
    }
  };
 
  const [height, setHeight] = useState(0);

  const resizer = (e: any) => {
    const length = e.target.value.length;

    if (length <= 10) {
      setHeight(0);
    } else if (length <= 20) {
      setHeight(100);
    } else if (length <= 30) {
      setHeight(200);
    } else {
      setHeight(300);
    }
  }

  ///////////////////////////////////////////////////////
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaRefs = useRef<HTMLTextAreaElement | null>(null);
  const textareaRefss = useRef<HTMLTextAreaElement | null>(null);

  const [value, setValue] = useState<String>();

  // This function is triggered when textarea changes
  const textAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    setFormData((prev: any) => ({ ...prev, gameStoryLine: event.target.value }))
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Call getBlockData with both game ID and translation ID
  //       if (languages) {
  //         const blockData = await getGameStoryLine(id, languages);

  //         console.log("updatedBlockData", blockData.gameStoryLine);
  //         setStoryline(blockData.gameStoryLine)
  //         setTitle(blockData.gameTitle)
  //         setNonplayerName(blockData.gameNonPlayerName)
  //       }

  //       // textareaRef.current.value = blockData.content;
  //     } catch (error) {
  //       console.error("getBlockData Error:", error);
  //     }
  //   };
  //   fetchData();
  // }, [languages, id]);
  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [value]);
  useEffect(() => {
    if (textareaRefss && textareaRefss.current) {
      textareaRefss.current.style.height = "0px";
      const scrollHeight = textareaRefss.current.scrollHeight;
      textareaRefss.current.style.height = scrollHeight + "px";
    }
  }, [value]);
  useEffect(() => {
    if (textareaRefs && textareaRefs.current) {
      textareaRefs.current.style.height = "0px";
      const scrollHeight = textareaRefs.current.scrollHeight;
      textareaRefs.current.style.height = scrollHeight + "px";
    }
  }, [value]);
  
  // useEffect(()=>{
  //   const handleVisibilityChange = () => {
  //     console.log("handleVisibilityChange", lastFocusedValue)
  //     if (document.hidden && lastFocusedValue) 
  //     dispatch(onBlurField({gameId: id,blurValue: lastFocusedValue}));
  //   };
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  
  //   return () => {
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //   };
  // },[])
  
const foundValueChange = async(original: any, updated: any)=>{
  if (original?.length !== updated?.length) dispatch(onFieldContentModified({gameId: id, modifiedField: null, updatedValue : null}));
}
const triggerValueChange = async()=>{
  dispatch(onFieldContentModified({gameId: id, modifiedField: null, updatedValue : null}))
}

const handleOnBlurValue = (e: any) =>{ 
  const {name, value } = e.target;
 if(lastFocusedValue.trim() !== value)
  {
    dispatch(onFieldContentModified({gameId: formData.gameId, modifiedField: name, updatedValue : value}));
  }
  }
  
  return (
    <>
      <Card mb={{ base: '0px', xl: '20px', sm: '20px' }}>
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Card w={{ sm: '100%', md: '65%' }} boxShadow={{ base: '', md: '1px 4px 29px #44445429' }} p={{ base: '0', md: '25px' }}>
            <Text fontSize={20} textAlign={'start'} fontWeight={800} mb={'20px'}>
              Game Overview
            </Text>
            {/* <Box> */}
            <SimpleGrid columns={{ base: 1, md: 1 }} >
              <FormLabel fontWeight='bold' fontSize='sm' mb='8px' mt='10px' ml='10px'>
                Title<Text as='span' color='red.500'>*</Text>
              </FormLabel>
              <InputField
                id="title"
                 mb="0px"
                 width="100%"
                value={formData?.gameTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Check if languages is empty
                  // if (languages === undefined || languages === null || languages === '') {
                    // Call the handleChange function
                    handleChange(e);
                  // };
                }}

                onBlur={handleOnBlurValue}
                onFocus={(e:any)=>setLastFocusedValue(e.target.value)}
                maxLength="45"
                placeholder="eg. Marketing Strategy"
                name="gameTitle"
                onKeyPress={checkvalue}
                style={{
                  border: formData.isStoryTitleInvalid ? '1px solid red' : '1px solid #ccc',
                }}
              />
              <Text
                    fontSize={'12px'}
                    ml="2.5px"
                    color={
                     formData?.gameTitle?.length >
                        maxCharacters
                        ? 'red'
                        : 'grey'
                    }

                  >
                    {maxCharacters -
                      ( formData?.gameTitle?.length ||
                        0)}{' '}
                    Character left
                  </Text>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 1 }} mt={'10px'}>
              <Box>
                <FormLabel fontWeight='bold' fontSize='sm' mb='8px' mt='10px' ml='10px'>
                  Skills<Text as='span' color='red.500'>*</Text>
                </FormLabel>
                <Flex
                  direction='row'
                  p='12px'
                  wrap='wrap'
                  bg='transparent'
                  border='1px solid'
                  borderColor={borderColor}
                  borderRadius='16px'
                  _focus={{ borderColor: 'teal.300' }}
                  minH='30px'
                  maxH='300px !important'
                  h='stretch'
                  cursor='text'
                  style={{ overflowY: 'auto', border: formData.isSkillsInvalid ? '1px solid red' : '1px solid #ccc', }}
                >
                  {defaultskills && defaultskills?.map((tag: any, index: any) => {
                    return (
                      <Tag
                        fontSize='xs'
                        h='25px'
                        mb='6px'
                        me='6px'
                        borderRadius='12px'
                        variant='solid'
                        // bg={bg}
                        bg={lightBlue}
                        key={index}>
                        {/* <TagLabel w='100%'>{tag.crSkillName}</TagLabel> */}
                        <TagLabel w='100%' color={textColor}>{tag.crSkillName}</TagLabel>
                        <TagCloseButton
                          justifySelf='flex-end'
                          color='black'
                          onClick={() => {
                            const updatedDefaultSkill = defaultskills.filter((element: any) => element.crSkillId !== tag.crSkillId);
                            setDefaultSkills(updatedDefaultSkill);
                            triggerValueChange(); //Trigger value change when delete the Skill to update preview
                          }}
                        />
                      </Tag>
                    );
                  })}
                  <textarea
                    ref={textareaRef}
                    onKeyDown={(e: any) => keyPressSkill(e)}
                    style={styles.textareaStyle}
                    onFocus = {(e:any)=>dispatch(onFocusField({gameId: id,focusValue: defaultskills}))}
                  ></textarea>
                </Flex>
                <Text fontSize='xs' color='gray.500' mt='2px' style={{ textAlign: 'left' }}>
                  <b>Note: </b> Press {' '}<Icon as={AiOutlineEnter} color='gray.500' />{' '} To Add Skill
                </Text>
              </Box>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, ml: 10 }} mt={'20px'}>
              <Box >
                <FormLabel fontWeight='bold' fontSize='sm' mb='8px' mt='10px' ml='10px'>
                  Storyline
                </FormLabel>
                <textarea
                  ref={textareaRef}
                  style={styles.textareaDefaultStyle}
                  // onFocus = {(e:any)=>dispatch(onFocusField({gameId: id,focusValue: e.target.value}))}
                  // onBlur={(e:any)=>dispatch(onBlurField({gameId: id,blurValue: e.target.value}))}
                  id="storyline"
                  placeholder="eg. Embark on the 'Market Mastery Quest' where entrepreneur Alex navigates a virtual realm, mastering marketing strategy through dynamic challenges, rivalries, and ethical choices, aiming to emerge as the ultimate market master. Transforming learning into a thrilling adventure, this game blends strategy and innovation for real-world business success."
                  name="gameStoryLine"
                  value={formData?.gameStoryLine}
                  onChange={handleChange}
                  onBlur={handleOnBlurValue}
                  onFocus={(e:any)=>setLastFocusedValue(String(e.target.value))}
                >
                </textarea>
              </Box>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, ml: 10 }} mt={'20px'}>
              <Box>
                <FormLabel fontWeight='bold' fontSize='sm' mb='8px' mt='10px' ml='10px'>
                  Learning Outcomes
                </FormLabel>
                <textarea
                  ref={textareaRefs}
                  style={styles.textareaDefaultStyle}
                  onChange={handleInput}
                  // mb="10px"
                  id="learningOutcome"
                  placeholder="eg. Problem Solving"
                  name="gameLearningOutcome"
                  value={formData.gameLearningOutcome}
                  // onFocus = {(e:any)=>dispatch(onFocusField({gameId: id,focusValue: e.target.value}))}
                  // onBlur={(e:any)=>dispatch(onBlurField({gameId: id,blurValue: e.target.value}))}
                  onBlur={handleOnBlurValue}
                  onFocus={(e:any)=>setLastFocusedValue(String(e.target.value))}
                >
                </textarea>
              </Box>

            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, ml: 10 }} mt={'20px'}>
              <Box>
                <FormControl>
                  <FormLabel fontWeight='bold' fontSize='sm' mb='8px' ml='10px'>
                    Category<Text as='span' color='red.500'>*</Text>
                  </FormLabel>
                

<Select
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999, }), control: (provided: any, state: any) => ({
                  ...provided,
                  borderRadius: '15px',
                  height: '45px',
                  padding: '0 !important',
                  width: '100%'
                  // window.innerWidth < 768 ? '100%' : '300px'
                }),
              }}
              options={defaultCat}
              onChange={(selectedOption) => selectHandler(selectedOption)}
              isClearable={true} // Optional: allow clearing the selection
              isSearchable={true} // Optional: enable searching  
              className='react-select'
              value={
                defaultCat.find((option) => option?.value === parseInt(formData.gameCategoryId)) || null
              }
            />
                </FormControl>
              </Box>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 1 }} mt={'20px'}>
              <InputField
                mb="0px"
                // me="30px"
                id="author"
                label="Author"
                placeholder="eg. Penelope Sterling"
                name="gameAuthorName"
                width="100%"
                value={formData?.gameAuthorName}
                onChange={handleChange}
                // onFocus = {(e:any)=>dispatch(onFocusField({gameId: id,focusValue: e.target.value}))}
                // onBlur={(e:any)=>dispatch(onBlurField({gameId: id,blurValue: e.target.value}))}
                onBlur={handleOnBlurValue}
                onFocus={(e:any)=>setLastFocusedValue(String(e.target.value))}
              />
            </SimpleGrid>
          </Card>
        </Flex>
      </Card>
      {openCourse ? <AddCourse setOpenCourse={setOpenCourse} isOpen={isOpen} onClose={onClose} onOpen={onOpen} /> : null}
    </>
  );
}
export default AboutStory;


const styles: { [name: string]: React.CSSProperties } = {
  container: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textareaDefaultStyle: {
    padding: 5,
    width: '100%',
    display: "block",
    resize: "none",
    backgroundColor: "white",
    borderRadius: "12px",
    borderColor: "#E0E5F2", // Border color
    outlineColor: "#E0E5F2", // Outline color
    borderWidth: "1px", // Border width
    borderStyle: "solid", // Border style
    overflow: "hidden", // Hide the scrollbar
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#1b2559'
  },
  textareaStyle: {
    padding: 2,
    width: '100%',
    // marginLeft:'10px',
    display: "block",
    resize: "none",
    backgroundColor: "white",
    borderRadius: "12px",
    borderColor: "white", // Border color
    outlineColor: "white", // Outline color
    borderWidth: "1px", // Border width
    borderStyle: "solid", // Border style
    overflow: "hidden",
  },
  labelStyle: {
    display: "block",
    fontSize: "smaller",
    fontWeight: "bold",
    marginBottom: "5px", // Add margin to separate label and textarea
    marginRight: "430px"
  },
  labelLearningStyle: {
    display: "block",
    fontSize: "smaller",
    fontWeight: "bold",
    marginBottom: "5px", // Add margin to separate label and textarea
    marginRight: "370px"
  },
};

