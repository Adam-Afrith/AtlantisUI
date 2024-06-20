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
import { SearchIcon } from '@chakra-ui/icons';
import {
  gameDuplicateQuestionEntirely,
  getImages,
  updateGame,
} from 'utils/game/gameService';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import BadgeImages from '../BadgeImages';
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md';
import { onFieldContentModified, onFocusField,onBlurField } from '../../../../../../store/preview/previewSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit'; // Import Dispatch type from @reduxjs/toolkit

interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const CompletionScreenRight: React.FC<{
  handleChange: (e: any) => void;
  formData: any;
  setSelectedBadge: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setBadge: any;
  compliData: any;
  setCompliData: any;
  CompKeyCount: any;
  handlecompletion: any;


}> = ({ handleChange, formData, setSelectedBadge, setFormData, setBadge, compliData, setCompliData, CompKeyCount, handlecompletion }) => {
  const searchIconColor = useColorModeValue('gray.700', 'white');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const [imgb, setbImg] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setImg] = useState<any[]>([]);
  const [badgeData, setBadgeData] = useState(null);
  const dispatch: Dispatch<any> = useDispatch();
  const [lastFocusedValue, setLastFocusedValue] = useState('');

  const fetchData = async () => {
    const result = await getImages(6);
    if (result?.status !== 'Success')
      return alert('getbackruond error:' + result?.message);
    setImg(result?.data);
  };
  const handleBadgeImages = async () => {
    const result = await getImages(4);
    if (result?.status !== 'Success')
      return console.log('getbackruond error:' + result?.message);
    else {
      setBadgeData(result?.data);
      setIsModalOpen(true);
    }
    setImg(result?.data);
  };
  const handleBadgeSelection = (badge: Badge) => {
    // setShowBadge(badge.gasAssetImage);
    // setFormData((prev:any)=>({...prev,gameBadgeName:badge.gasAssetName}))

    setCompliData((prevInput: any) => {
      return {
        ...prevInput,
        [CompKeyCount]: {
          ...prevInput[CompKeyCount],
          gameBadge: badge.gasId,
          gameBadgeName: badge.gasAssetName,

        }
      }
    });

    setSelectedBadge(badge);
    setIsModalOpen(false);
    console.log('Selected Image:', badge);
  };
  const handleClear = () => {

    setCompliData((prevInput: any) => {
      return {
        ...prevInput,
        [CompKeyCount]: {
          ...prevInput[CompKeyCount],
          gameBadge: '',
          gameBadgeName: '',

        }
      }
    });

    setSelectedBadge(null);
    setBadge(null);
    setbImg(null);
  };
  useEffect(() => {
    const fetchDatass = async () => {
      if (compliData[CompKeyCount]?.gameBadge) {
        const result = await getImages(4);

        if (result?.status !== 'Success') {
          console.error('getbackground error:' + result?.message);
          return;
        }
        const selectedGasId = compliData[CompKeyCount]?.gameBadge;
        const selectedGasImage = result?.data.find(
          (gas: any) => gas.gasId == selectedGasId,
        );
        const imageUrl =
          selectedGasImage?.gasAssetImage || 'defaultImageURL.jpg';

        setbImg(imageUrl);

      }
    };

    fetchDatass(); // Call the asynchronous function
  }, [compliData]);
  const handleKeyPress = (e: any) => {
    const charCode = e.which ? e.which : e.keyCode;
    const enteredValue = e.target.value + String.fromCharCode(charCode);

    if (
      charCode > 31 &&
      (charCode < 48 ||
        charCode > 57 ||
        parseInt(enteredValue, 10) > compliData[CompKeyCount]?.gameTotalScore)
    ) {
      e.preventDefault();
    }
  };
  const handleKeyPresss = (e: any) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      e.preventDefault();
    }
  };
///added by nivetha
const maxCharacters = 14;
const checkvalue = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const trimmedValue1 = e.currentTarget.value.trim(); // Use currentTarget instead of target
  if (trimmedValue1 !== '') {
    setFormData((prev: any) => ({
      ...prev,
      gameIsSetBadge: false,
      
    }));
  }
};
// nivetha end
/*** To track the value change in Each field, to update the preview content */

const handleOnBlurChecked = (e: any) =>{
  const {name, checked } = e.target;
      /*** To handle & trigger the modification in data in Preview ***/
       dispatch(onFieldContentModified({gameId: formData.gameId, modifiedField: name, updatedValue : String(checked)}));
      /***  End  ***/
}
 const handleOnBlurValue = (e: any) =>{ 
    const {name, value } = e.target;
   if(lastFocusedValue.trim() !== value)
    {
      dispatch(onFieldContentModified({gameId: formData.gameId, modifiedField: name, updatedValue : value}));
    }
    }
/*** End of track the value change in Each field, to update the preview content */

  return (
    <>
      <Stack direction="column" gap="20px">
        <Card>
          <Text fontSize={18} fontWeight={700}>
            Score
          </Text>
          <SimpleGrid columns={{ base: 1, md: 1 }} gap="20px">
            <Flex align="center">
              <FormControl
                w={'100%'}
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
              >
                <FormLabel mr={2} fontSize="sm" fontWeight="bold" color={textColorPrimary}>
                  Total Score:<span style={{ color: 'red' }}>*</span>
                </FormLabel>
                <InputField
                  mb="10px"
                  id="gameTotalScore"
                  type="text"
                  placeholder="eg. 1000"
                  name="gameTotalScore"
                  w="220px"
                  value={compliData[CompKeyCount]?.gameTotalScore ? compliData[CompKeyCount]?.gameTotalScore : ''}
                  // onChange={handlecompletion}
                  onKeyPress={handleKeyPresss}
                  readOnly
                />
              </FormControl>
            </Flex>
          </SimpleGrid>
          {/***Afrith-Modified-20-12-23*****/}
          <Flex mt={'10px'}>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              width={'50%'}

            // mt={'10px'}
            >
              <FormLabel
                htmlFor="email-"
                fontSize="sm"
                fontWeight="bold"
                color={textColorPrimary}
              >
                Set a Minimum Pass Score
              </FormLabel>
              <Switch
                mb="10px"
                isChecked={compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true'}
                color="#fff"
                colorScheme="brandScheme"
                size="md"
                id="gameIsSetMinPassScore"
                name="gameIsSetMinPassScore"
                onChange={(e: any)=> {handlecompletion(e); handleOnBlurChecked(e)}}                
              />
            </FormControl>
            {/***********Spacer*****************/}
          </Flex><Flex mt={'10px'}>
            {/* <div style={{ width: '20px' }} /> */}
            {compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' && (
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
                width={'100%'}
                h={'40px'}
                mt={'10px'}
                mb="10px"
              // mt={'5px'}
              >
                <FormLabel
                  htmlFor="email-"
                  fontSize="sm"
                  fontWeight="bold"
                  color={textColorPrimary}
                >
                  Minimum Score
                  {compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' && (
                    <span style={{ color: 'red' }}>*</span>
                  )}
                </FormLabel>
                <InputField
                  mt="10px"
                  id="gameMinScore"
                  name="gameMinScore"
                  type="text"
                  disabled={compliData[CompKeyCount]?.gameIsSetMinPassScore !== 'true'}
                  placeholder="eg. 1000"
                  w="220px"
                  value={compliData[CompKeyCount]?.gameMinScore}
                  onChange={(e: any)=> {handlecompletion(e);}}
                  onBlur={handleOnBlurValue}
                  onFocus={(e:any)=>setLastFocusedValue(e.target.value)}
                
                  onKeyPress={handleKeyPress}
                  style={{
                    border: compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' && !compliData[CompKeyCount]?.gameMinScore ? '1px solid red' : '1px solid #ced4da',
                    // Add other styles as needed
                  }}
                />
              </FormControl>
            )}
          </Flex>
          <Flex mt={'10px'}>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent={'space-between'}
              width={'50%'}
              mt={'10px'}
              mb="10px"
            // mt={'10px'}
            >
              <FormLabel
                htmlFor="email-"
                // mb="0"
                fontSize="sm"
                fontWeight="bold"
                color={textColorPrimary}
              >
                Set a Distinction Score
              </FormLabel>
              <Switch
                isChecked={
                  compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' ? true : false
                }
                color="#fff"
                colorScheme="brandScheme"
                size="md"
                id="gameIsSetDistinctionScore"
                name="gameIsSetDistinctionScore"
                onChange={(e: any)=> {handlecompletion(e); handleOnBlurChecked(e)}} 
                mb="10px"
              />
            </FormControl>
          </Flex>
          <Flex mt={'10px'} >
            {/***********Spacer*****************/}
            {/* <div style={{ width: '20px' }} /> */}

            {compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && (
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
                width={'100%'}
                h={'40px'}
                mt={'10px'}
                mb="10px"
              // mt={'5px'}
              >
                <FormLabel
                  htmlFor="email-"
                  fontSize="sm"
                  fontWeight="bold"
                  color={textColorPrimary}
                >
                  Distinction Score
                  {compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && (
                    <span style={{ color: 'red' }}>*</span>
                  )}
                </FormLabel>
                <InputField
                  mt={'10px'}
                  w="220px"
                  disabled={
                    compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true'
                      ? false
                      : true
                  }
                  id="gameDistinctionScore"
                  name="gameDistinctionScore"
                  type="text"
                  placeholder="eg. 1000"
                  value={compliData[CompKeyCount]?.gameDistinctionScore}
                  onChange={(e: any)=> {handlecompletion(e);}} 
                  onBlur={handleOnBlurValue}
                  onFocus={(e:any)=>setLastFocusedValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    border: compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && !compliData[CompKeyCount]?.gameDistinctionScore ? '1px solid red' : '1px solid #ced4da',
                    // Add other styles as needed
                  }}
                />
              </FormControl>
            )}
          </Flex>

          {/*************SkillWise**********************/}

          {/* <FormControl
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
            width={'40%'}
            mt={'10px'}
          >
            <FormLabel
              htmlFor="email-"
              fontSize="sm"
              fontWeight="bold"
              color={textColorPrimary}
            >
              Skill Wise Score
            </FormLabel>

            <Switch
              isChecked={
                compliData[CompKeyCount]?.gameIsSetSkillWiseScore === 'true' ? true : false
              }
              color="#fff"
              colorScheme="brandScheme"
              size="md"
              mb="10px"
              id="gameIsSetSkillWiseScore"
              name="gameIsSetSkillWiseScore"
              onChange={handlecompletion}
            />
          </FormControl> */}

          {/**********************BADGE*********************/}

          <FormControl
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
            width={'50%'}
            mt={'20px'}
          // ml="150px"
          >
            <FormLabel
              htmlFor="email-"
              mb="0"
              fontSize="sm"
              fontWeight="bold"
              color={textColorPrimary}
            >
              <Text fontSize={18} fontWeight={700}>
                Badge
              </Text>
            </FormLabel>
            <Switch
              isChecked={compliData[CompKeyCount]?.gameIsSetBadge === 'true' ? true : false}
              color="#fff"
              colorScheme="brandScheme"
              size="md"
              id="gameIsSetBadge"
              name="gameIsSetBadge"
              onChange={(e: any)=> {handlecompletion(e); handleOnBlurChecked(e)}} 
            />
          </FormControl>
          {compliData[CompKeyCount]?.gameIsSetBadge === 'true' && (
            <>
              <Flex mt={'10px'} >
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  width={'38%'}
                  mt={'10px'}
                  mb="10px"
                >
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                    mb="10px"
                    whiteSpace={'nowrap'}
                    onClick={handleBadgeImages}
                  >
                    Select Badge:{' '}
                    {compliData[CompKeyCount]?.gameIsSetBadge === 'true' && ( 
                      
                      <span style={{ color: 'red' }}>*</span>
                    )}
                  </FormLabel>
                  <BadgeImages
                    isModalOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    badgeData={badgeData}
                    handleBadgeSelection={handleBadgeSelection}
                  />
                </FormControl>
                {compliData[CompKeyCount]?.gameBadge === 0 || compliData[CompKeyCount]?.gameBadge == null || compliData[CompKeyCount]?.gameBadge == '' ? (
                  <>
                    {/*<input type="file" style={{ display: 'none' }} />
                    <Box
                      w={'70%'}
                      border={'1px solid #e0e5f2'}
                      padding={'5px'}
                      display={'flex'}
                      cursor={'pointer'}
                      h={'34px'}
                      onClick={() => handleBadgeImages()}
                    >
                      <Box
                        h={'25px'}
                        width={'35%'}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        bg={'#3311db'}
                      >
                        <Text color={'#fff'} textAlign={'center'}>
                          Choose
                        </Text>
                      </Box>
 <Text mt={'5px'} ml={'2px'}>
                        No File Choosen
                      </Text> 
                    </Box>
                    */}
                    <Box display={'inline-block'} position={'relative'} mt={'10px'} mb={'10px'} cursor={'pointer'} onClick={() => handleBadgeImages()}>
                      <input type="file" style={{
                        width: '100px',
                        position: 'absolute',
                        display: 'none',
                        textAlign: 'right',

                        opacity: 0,
                        zIndex: 2,
                        height: '100px'
                      }} />
                      <Box position={'absolute'} className={'choosebadge'} top={0} left={0} zIndex={1} backgroundColor={'#422AFB'}
                        p={'2px'}
                        borderRadius={'15px'}
                        pr={'8px'}
                        pl={'8px'} display={'flex'} alignItems="center"
                        justifyContent={'flex-start'} >
                        <SearchIcon color={'#fff'} w="15px" h="15px" />
                        <Text fontSize="sm"
                          //fontWeight="bold"
                          //color={textColorPrimary}
                          color={'#fff'}
                          whiteSpace={'nowrap'} textAlign={'left'}>
                          Choose Badge
                        </Text>
                      </Box>
                    </Box>

                  </>
                ) : (
                  <Box position={'relative'}>
                    <Img
                      id={compliData[CompKeyCount]?.gameBadge}
                      src={imgb}
                      w={'50px'}
                      h={'50px'}
                    />
                    <Icon
                      as={MdClose}
                      bg={'#fff'}
                      position={'absolute'}
                      borderRadius={'50%'}
                      top={'0'}
                      right={'0'}
                      cursor={'pointer'}
                      onClick={handleClear}
                    />
                  </Box>
                )}
              </Flex>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent={'space-between'}
                width={'100%'}
              //mt={'10px'}
              >
                <FormLabel
                  fontSize="sm"
                  fontWeight="bold"
                  color={textColorPrimary}
                  mb="0px"
                  whiteSpace={'nowrap'}

                >

                  Badge Name:{' '}
                  {compliData[CompKeyCount]?.gameIsSetBadge === 'true' && (
                    <span style={{ color: 'red' }}>*</span>
                  )}
                </FormLabel>
                <InputField
                  mb="0px"
                  id="gameBadgeName"
                  name="gameBadgeName"
                  disabled={compliData[CompKeyCount]?.gameIsSetBadge === 'true' ? false : true}
                  placeholder="eg. Bronze"
                  w="220px" // Adjust the width as needed
                  value={compliData[CompKeyCount]?.gameBadgeName}
                  onChange={(e: any)=> {handlecompletion(e);}} 
                  onBlur={handleOnBlurValue}
                  onFocus={(e:any)=>setLastFocusedValue(e.target.value)}                  
                  onKeyPress={checkvalue}
                  maxLength="14"
                  style={{
                    border: compliData[CompKeyCount]?.gameIsSetBadge === 'true' && !compliData[CompKeyCount]?.gameBadgeName ? '1px solid red' : '1px solid #ced4da',
                    // Add other styles as needed
                  }}
                />
              </FormControl>
              <Text
                    fontSize={'12px'}
                    ml="2.5px"
                    color={
                      compliData[CompKeyCount]?.gameBadgeName?.length >
                        maxCharacters
                        ? 'red'
                        : 'grey'
                    }

                  >
                    {maxCharacters -
                      (compliData[CompKeyCount]?.gameBadgeName?.length ||
                        0)}{' '}
                    Character left
                  </Text>
            </>
          )}

          {/******************Criteria for Badge***************************/}

          {compliData[CompKeyCount]?.gameIsSetBadge === 'true' && (
            <>
              <Box>
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                  width={'50%'}
                // mt={'10px'}
                >
                  <FormLabel
                    htmlFor="email-"
                    mb="10px"
                    fontSize="sm"
                    mt="5"
                    fontWeight="bold"
                    whiteSpace={'nowrap'}
                    color={textColorPrimary}
                  >
                    Criteria For Badge
                  </FormLabel>
                  <Switch
                    isChecked={
                      compliData[CompKeyCount]?.gameIsSetCriteriaForBadge === 'true'
                        ? true
                        : false
                    }
                    mt="10px"
                    ml={'10px'}
                    color="#fff"
                    colorScheme="brandScheme"
                    size="md"
                    id="gameIsSetCriteriaForBadge"
                    name="gameIsSetCriteriaForBadge"
                    onChange={(e: any)=> {handlecompletion(e); handleOnBlurChecked(e)}} 
                  />
                </FormControl>

                <div style={{ width: '20px' }} />
                {compliData[CompKeyCount]?.gameIsSetCriteriaForBadge === 'true' && (
                  <>
                    <FormControl
                      display="flex"
                      alignItems="center"
                      justifyContent={'space-between'}
                      width={'100%'}
                    // mt={'10px'}
                    >
                      <FormLabel>
                        <Text
                          fontSize="sm"
                          mt={'15px'}
                          whiteSpace={'nowrap'}
                          fontWeight="bold"
                          color={textColorPrimary}
                        >
                          Score Greater Than{' '}
                          {compliData[CompKeyCount]?.gameIsSetCriteriaForBadge === 'true' && (
                            <span style={{ color: 'red' }}>*</span>
                          )}
                        </Text>
                      </FormLabel>
                      <InputField
                        mb="0px"
                        id="gameAwardBadgeScore"
                        w={'220px'}
                        name="gameAwardBadgeScore"
                        disabled={
                          compliData[CompKeyCount]?.gameIsSetCriteriaForBadge === 'true'
                            ? false
                            : true
                        }
                        placeholder="eg. 200"
                        // Adjust the width as needed
                        value={compliData[CompKeyCount]?.gameAwardBadgeScore}
                        onChange={(e: any)=> {handlecompletion(e);}} 
                        onFocus={(e:any)=>setLastFocusedValue(e.target.value)}
                        onBlur={handleOnBlurValue}
                        onKeyPress={handleKeyPress}
                        style={{
                          border: compliData[CompKeyCount]?.gameIsSetCriteriaForBadge === 'true' && !compliData[CompKeyCount]?.gameAwardBadgeScore ? '1px solid red' : '1px solid #ced4da',
                          // Add other styles as needed
                        }}
                      />
                    </FormControl>
                  </>
                )}
              </Box>
            </>
          )}
        </Card>
      </Stack>
    </>
  );
};
export default CompletionScreenRight;
