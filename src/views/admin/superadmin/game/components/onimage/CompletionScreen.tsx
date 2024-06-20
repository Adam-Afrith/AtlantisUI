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
import rew from 'assets/img/screens/Reward Bar.png';
import back from 'assets/img/screens/back.png';
import point from 'assets/img/screens/points.png';
import skill from 'assets/img/screens/skill.png';
import next from 'assets/img/screens/next.png';
import {
  gameDuplicateQuestionEntirely,
  getImages,
  updateGame,
} from 'utils/game/gameService';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import BadgeImages from '../BadgeImages';
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md';
import TextField from 'components/fields/TextField';
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}
const CompletionScreen: React.FC<{
  formData: any; imageSrc: any; selectedBadge: any; compliData: any;
  setCompliData: any;
  CompKeyCount: any;
}> = ({
  selectedBadge,
  formData,
  imageSrc,
  compliData,
  setCompliData,
  CompKeyCount,
}) => {
    const [imgb, setbImg] = useState<any>();
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
   

    return (
      <>
        {imageSrc && (
          <>
            <Box
              w={'100%'}
              h={'100%'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box w={'auto'} position={'relative'} h={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Img src={imageSrc} h={'auto'} w={'100%'} transition={'transform 0.3s ease'} transform={{ lg: 'scale(1)', '2xl': 'scale(1.3)' }} />
                <Box position={'absolute'} w={'100%'} transition={'transform 0.3s ease'} transform={{ lg: 'scale(1)', '2xl': 'scale(1.25)' }} h={'70%'} top={'21.5%'} fontFamily={'AtlantisText'} >
                  <Text textAlign={'center'} fontSize={{ base: '1.2rem', sm: '1.5rem' }}>
                    {compliData[CompKeyCount]?.gameScreenTitle}
                  </Text>
                  <Box w={'100%'} mt={'30px'} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                    <Box w={'45%'}>
                      <Box className='welcome_note'>
                        {((compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === 'true' || compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === undefined) && compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'false') || (compliData[CompKeyCount]?.gameIsSetCongratsSingleMessage === 'false' && compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'false') || (compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'false' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'false') ? (
                          <>{compliData[CompKeyCount]?.gameCompletedCongratsMessage || "Congratulations! You have Completed..."}</>
                        ) : <></>}
                        {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'true' && compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'false' ? (
                          <>{compliData[CompKeyCount]?.gameAboveDistinctionScoreCongratsMessage}</>
                        ) : <></>}

                        {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'true' && compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'true' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' ? (
                          <>{compliData[CompKeyCount]?.gameAboveDistinctionScoreCongratsMessage} </>
                        ) : <></>}
                        {compliData[CompKeyCount]?.gameIsSetCongratsScoreWiseMessage === 'true' && compliData[CompKeyCount]?.gameIsSetMinPassScore === 'true' && compliData[CompKeyCount]?.gameIsSetDistinctionScore === 'false' ? (
                          <>{compliData[CompKeyCount]?.gameaboveMinimumScoreCongratsMessage}</>
                        ) : <></>}
                        {compliData[CompKeyCount]?.gameCompletedCongratsMessage === '' && (
                          <><div style={{ height: '100px' }}></div></>
                        )}
                      </Box>
                    </Box>
                    <Box w={'100%'} mt={'10px'} display={'flex'} justifyContent={'center'}>
                      <Img w={'58%'} h={'auto'} src={rew} />
                    </Box>
                    <Box className='points-box'>
                      <Box className='box-1'>
                        <Img src={back} className='box-1_img' />
                        <Text className='points-text' fontFamily={'content'}>
                          Points
                        </Text>
                        <Box className='inside-box-1'>
                          <Img src={point} className='inside-box-1_img' />
                          <Text className='inside-points-text' fontFamily={'content'}>
                            {(compliData[CompKeyCount]?.gameMinScore || 100) +
                              '/' +
                              (compliData[CompKeyCount]?.gameTotalScore ? (compliData[CompKeyCount]?.gameTotalScore || 100) : '')}
                          </Text>
                        </Box>
                      </Box>
                      {compliData[CompKeyCount]?.gameIsSetBadge === 'true' && (
                        <Box className='box-2'>
                          <Img src={back} className='box-2_img' />
                          <Text className='points-text' fontFamily={'content'}
                          >
                            {compliData[CompKeyCount]?.gameBadgeName}
                          </Text>
                          {compliData[CompKeyCount]?.gameBadge && (
                            <Img
                              className='inside-img'
                              src={imgb}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                    <Box mt={'35px'} w={'100%'} display={'flex'} justifyContent={'center'}>
                      <Img src={next} w={'auto'} h={'2.5rem'} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </>
    );
  };
export default CompletionScreen; 
