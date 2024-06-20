import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Img,
  SimpleGrid,
  Step,
  Stepper,
  StepIndicator,
  Text,
  Tooltip,
  StepNumber,
  StepIcon,
  StepStatus,
  StepSeparator,
  StepTitle,
  TabPanels,
  Tab,
  Tabs,
  TabList,
  useColorModeValue,
  TabPanel,
  RadioGroup,
  Stack,
  Radio,
  Icon,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectField';
import {
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from '@chakra-ui/react';
import Select from 'react-select';
import logo from 'assets/img/games/log.png';
import badge from 'assets/img/games/new-level-final.png';
import {
  getImages,
  getAudio,
  getLanguages,
  getCreatedLanguages,
  updatelanguages,
  getVoices,
  getOldLanguages, // Lokie Add 12/06/2024
} from 'utils/game/gameService';
import Dropzone from 'views/admin/main/ecommerce/settingsProduct/components/Dropzone';
import { MdClose, MdOutlineCloudUpload, MdOutlineCheck } from 'react-icons/md';
import BadgeImages from './BadgeImages';
import PreferenceAudio from './PreferenceAudio';
import { FaMusic, FaPause, FaPlay, FaStop } from 'react-icons/fa6';
import CharacterPreviewTranslate from './CharacterPreviewTranslate';
import { SearchIcon } from '@chakra-ui/icons';
import { updatePreviewData, onFieldContentModified} from '../../../../../store/preview/previewSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit'; // Import Dispatch type from @reduxjs/toolkit

interface OptionType {
  value: string;
  label: string;
}
interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}
const GreetingsForm: React.FC<{
  handleChange: (e: any, selectedOption?: OptionType) => void;
  formData: any;
  updateSummaryState: (isOpen: any) => void;
  updateLanguage: (selectedOption: OptionType | null) => void;
  updateImageBackGround: (e: any) => void;
  setFormData: any;
  setSentAud: any;
  setBadge: any;
  selectedAud: any;
  setSelectedAud: any;
  fetchLanguagescount:() => void;
  setLoading:any;
  loading:any;
  handleVoiceBack:any;
  launchPopup:any;
  setLaunchPopup:any;
  handleLaunchConfirm:any;
  modalPopup:any;
  setModalPopup:any;
}> = ({
  selectedAud,
  setSelectedAud,
  handleChange,
  formData,
  setBadge,
  updateSummaryState,
  updateLanguage,
  updateImageBackGround,
  setFormData,
  setSentAud,
  fetchLanguagescount,
  setLoading,
  loading,
  handleVoiceBack,
launchPopup,
  handleLaunchConfirm,
  modalPopup,
  setModalPopup,
  setLaunchPopup,
}) => {
    const [isOpenSummary, setIsOpenSummary] = useState<any>(false);
    const [tab, setTab] = useState<number>(1);
    const [img, setImg] = useState<any[]>([]);
    let [tabState, setTabState] = useState('Preferences');
    // const [selectedAud, setSelectedAud] = useState(null);
    const [backgroundIndex, setBackgroundIndex] = useState<number>();
    const [languageOptions, setLanguageOptions] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [defaultLang, setDefaultLang] = useState('');
    const [mappedlanguageOptions, setMappedlanguageOptions] = useState([]);
    const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
    const textColorTertiary = useColorModeValue(
      'secondaryGray.600',
      'secondaryGray.500',
    );
    const [languageOptions2, setLanguageOptions2] = useState([]);
     const { id,val } = useParams();
    // alert(id);
    const isEmptyObject = (obj: any) => {
      return Object.keys(obj).length === 0;
    };
    const [updateData, setUpdateData] = useState({});
    const toast = useToast();
    const options = [
      { value: 'Each', name: 'Immediately After Each Interaction' },
      { value: 'Completion', name: ' Together After Completion Screen' },
    ];
    const steps = [
      { title: 'BackGround' },
      { title: 'Non Playing Charater' },
      { title: 'About Story' },
      { title: 'Customzation' },
      { title: 'Score' },
      { title: 'Summaries' },
      { title: 'Endpage' },
    ];
    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const textColor = useColorModeValue('secondaryGray.900', 'white');

// Lokie Add 12/06/2024
const [oldLanguage, setOldLanguage] = useState(null);

    const [selectedBadge, setSelectedBadge] = useState(null);
    
    const [badgeData, setBadgeData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
    const [isPaused, setIsPaused] = useState<boolean | null>(null);
    const dispatch: Dispatch<any> = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      if (selectedAud) {
        updateAudioUrl(selectedAud);
      }
    }, [selectedAud]);

    useEffect(() => {
      const audioElement = audioRef.current;
      console.log('audioElement', audioElement);
      if (audioElement) {
        audioElement.addEventListener('ended', handleEndedBtnClick);

        return () => {
          audioElement.removeEventListener('ended', handleEndedBtnClick);
        };
      }
    }, [audioRef.current]);

    const handleSummary = () => {
      setIsOpenSummary(!isOpenSummary);
      updateSummaryState(!isOpenSummary);
    };
    const fetchData = async () => {
      const result = await getImages(5);
      if (result?.status !== 'Success')
        return alert('getbackruond error:' + result?.message);
      setImg(result?.data);
    };
    const handleSetBackground = (i: any) => {
      setBackgroundIndex(i);
    };
    
    const boxStyles = {

    };
    const fetchData3 = async () => {
      // alert(id);
      let data = JSON.stringify({ gameId: id });
      // alert(data);
      const result = await getCreatedLanguages(data);
      if (result?.status !== 'Success')
        return console.log('getCreatedLanguages Error :', result?.message);
      setDefaultLang(result?.lngchoosen);
      setSelectedLanguages(result?.data);

      // console.log(result);
    };
    // const isEnglish = (selectedLanguages.length == 0) || (selectedLanguages.length == 1 && defaultLang === selectedLanguages[0]?.translationId);
    const defaultLanguage = { value: 1, label: 'English' };
    const getLanguageLabel = (translationId: any) => {
      const selectedLanguage = languageOptions.find(
        (lang) => lang.value === translationId,
      );
      return selectedLanguage ? selectedLanguage.label : defaultLanguage.label;
    };
    const fetchData4 = async (updataData: any) => {
      // alert(id);
      setLoading(true);
      if (isEmptyObject(updateData)) {
        setLoading(false);
      } else {
        let data = JSON.stringify(updateData);
        // alert(data);
        const result = await updatelanguages(data);
        setLoading(false);
        if (result?.status !== 'Success')
          return console.log('updatelanguages Error :', result?.message);
        if (result?.status == 'Success') {
          setFormData((prevFormData:any) => ({
            ...prevFormData,
            gameLanguageId: parseInt(result.data), // Replace 'gamelanguageId' with the appropriate property name
          }));
          
          
         await fetchData2();
         fetchData3();
         setDefaultLang(result.data);
        }
        if (result?.status == 'AlreadyExist') {
          setDefaultLang(result?.lngchoosen);
          setSelectedLanguages(result?.data);
        }
      }
    };
    // Lokie Add 12/06/2024
    useEffect(() => {
      const getSelectedLanguagesOld = async ()=>{
        const result = await getOldLanguages(id);
        setOldLanguage(result?.data);
      };
      getSelectedLanguagesOld();
     
    }, []);
   
    const fetchData2 = async () => {
      try {
        const result = await getLanguages();
        if (result?.status !== 'Success') {
          console.log('getLanguages Error:', result?.message);
          return;
        }
        fetchLanguagescount();
        setLanguageOptions(result?.data);

  const indicesToRemove = oldLanguage.map((lang: any) => lang.translationId);

      const filteredLanguages_1 = result.data.filter((lange: any) => !indicesToRemove.includes(lange.value));
  

        const filteredLanguages = filteredLanguages_1.filter(
          (language: any) =>
            !selectedLanguages.some(
              (selectedLanguage) =>
                selectedLanguage.translationId === language.value ||
                language.value === 1,
            ),
        );

        if (filteredLanguages.length === 0) {
          setLanguageOptions2(filteredLanguages_1);
          setMappedlanguageOptions(filteredLanguages_1);
        } else {
          setLanguageOptions2(filteredLanguages);
          setMappedlanguageOptions(filteredLanguages);
        }
      } catch (error) {
        console.error('Error in fetchData2:', error);
      }
    };
    useEffect(() => {
      fetchData2();
    }, [oldLanguage]);
  // Lokie End 12/06/2024
    useEffect(() => {
      fetchData();
      // fetchData2();
      fetchData3();
      console.log('formData', formData);
      console.log(updateData);
    }, [backgroundIndex, updateData]);

    const handleChan = (e: any) => {
      setFormData((prev: any) => ({ ...prev, gameIsShowInteractionFeedBack: e }));
       /*** To handle & trigger the modification in data in Preview ***/
       dispatch(onFieldContentModified({gameId: id, modifiedField: 'gameIsShowInteractionFeedBack', updatedValue : e, tabState: 'Translation'? 1 : 0}));
       /***  End  ***/
    };
    const handleAud = (e: any) => {
      e.preventDefault();
      let selectedFile;
      if (e.target.files) {
        selectedFile = e.target.files[0];
      } else if (e.dataTransfer && e.dataTransfer.files) {
        selectedFile = e.dataTransfer.files[0];
      }
      if (selectedFile) {
        setSentAud(selectedFile);
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedAud(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    };
    const handleClear = () => {
      setFormData((prev: any) => ({
        ...prev,
        gameIntroMusic: '',
        // gameIntroMusic: ''
      }));

/*** To handle & trigger the modification in data in Preview ***/
dispatch(onFieldContentModified({gameId: id, modifiedField: ['gameIntroMusic', 'gameIntroMusicName'], updatedValue :  ["", ""], currentSubTab:  tabState==='Translations' ? 1 : 0}));
  /***  End  ***/

      setSelectedBadge(null);
      setBadge(null);
      setIsPlaying(null);
      setIsPaused(null);
    };
    const handleBadgeImages = async () => {
      const result = await getImages(7);
      if (result?.status !== 'Success')
        return console.log('getbackruond error:' + result?.message);
      else {
        setBadgeData(result?.data);
        setIsModalOpen(true);
      }
      setImg(result?.data);
    };

    const handleBadgeSelection = (badge: Badge) => {
      setFormData((prev: any) => ({
        ...prev,
        gameIntroMusic: badge.gasId,
        gameIntroMusicName: badge.gasAssetImage,
        // gameBadgeName: badge.gasAssetName
      }));

      if(selectedBadge !== badge){
        /*** To handle & trigger the modification in data in Preview ***/
        dispatch(onFieldContentModified({gameId: id, modifiedField: ['gameIntroMusic', 'gameIntroMusicName'], updatedValue :  [badge.gasId, badge.gasAssetImage], currentSubTab:  tabState==='Translations' ? 1 : 0}));
        /***  End  ***/
      }


      setSelectedBadge(badge);
      setIsModalOpen(false);
      updateAudioUrl(badge.gasAssetImage);
    };

    const updateAudioUrl = (url: string) => {
      if (url) {
        const audio = new Audio(url);
        audioRef.current = audio;
        setAudioUrl(url);
      } else {
        setAudioUrl(null);
        audioRef.current = null;
      }
    };

    const playAudio = () => {
      if (audioUrl) {
        if (audioRef.current?.paused) {
          audioRef.current.play();
          setIsPlaying(true);
          setIsPaused(false);
        } else {
          audioRef.current.pause();
          setIsPaused(true);
          setIsPlaying(false);
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      playAudio();
    };
    const handlePause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPaused(true);
      }
    };

    useEffect(() => {
      if (audioUrl && isPlaying) {
        audioRef.current.play();
      }
    }, [isPlaying]);

    useEffect(() => {
      if (isPaused) {
        audioRef.current.pause();
      }
    }, [isPaused]);

    const handleEndedBtnClick = () => {
      if (audioRef?.current && audioRef.current?.currentTime != 0) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(null);
      setIsPaused(null);
    };

    /////////////////////////changes on 20-01-2024/////////////////////////////////////
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen3, setIsModalOpen3] = useState(false);

    const [selectedOption, setSelectedOption] = useState(null);
    const [voiceValues, setVoiceValues] = useState({
      gameNonPlayerVoice: formData.gameNonPlayerVoice,
      gamePlayerMaleVoice: formData.gamePlayerMaleVoice,
      gamePlayerFemaleVoice: formData.gamePlayerFemaleVoice,
      gameNarratorVoice: formData.gameNarratorVoice,
    });
    const [voices, setVoices] = useState([]);
    const voic = async () => {
      const result = await getVoices();
            if (result) {
        setVoices(result?.voices);
      }
    };
    const handleLanguageChangeGPT = (selectedOption: any) => {
      setSelectedOption(selectedOption);
      setIsModalOpen1(true);
    };
    const handleLanguageChangeGPTdata = (
      translationId: any,
      sellanguage: any,
      otherProperties: any,
    ) => {
      // alert(translationId+sellanguage+gameNonPlayerVoice);

      // console.log(translationId, sellanguage, otherProperties);
      const selectedoptionfromcard = {
        value: translationId,
        label: sellanguage,
      };
      setVoiceValues({
        gameNonPlayerVoice: otherProperties.gameNonPlayerVoice,
        gamePlayerMaleVoice: otherProperties.gamePlayerMaleVoice,
        gamePlayerFemaleVoice: otherProperties.gamePlayerFemaleVoice,
        gameNarratorVoice: otherProperties.gameNarratorVoice,
      });
      setSelectedOption(selectedoptionfromcard);
      setIsModalOpen2(true);
    };
    useEffect(() => {
      voic();
    }, []);
    const handleInputChange2 = (fieldName: any, value: any) => {
      setVoiceValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    };

    const handleModalClose = () => {
      console.log("2612")
      setIsModalOpen2(false);
      // Reset values after closing the modal
      setVoiceValues({
        gameNonPlayerVoice: formData.gameNonPlayerVoice,
        gamePlayerMaleVoice: formData.gamePlayerMaleVoice,
        gamePlayerFemaleVoice: formData.gamePlayerFemaleVoice,
        gameNarratorVoice: formData.gameNarratorVoice,
      });
    };
    // Example using useEffect
    useEffect(() => {
      // Your logic that depends on the updated voiceValues
      console.log('voiceValues', voiceValues);
    }, [voiceValues]);

    const handleSavefromCharacterVoice = () => {
      console.log('voiceValues', voiceValues);
      // Send selectedOption and voiceValues to setUpdateData
      setUpdateData({
        gameId: id,
        translationId: selectedOption.value,
        lng: selectedOption.label,
        ...voiceValues,
      });

      // Close the modal after saving
      handleModalClose1();
      setIsModalOpen3(true);
    };
    const handleSave = () => {
      console.log('voiceValues', voiceValues);
      // Send selectedOption and voiceValues to setUpdateData
      setUpdateData({
        gameId: id,
        translationId: selectedOption.value,
        lng: selectedOption.label,
        ...voiceValues,
      });

      // Close the modal after saving
      handleModalClose();
      setIsModalOpen3(true);
    };
    const handleConfirmModal = () => {
      // setIsModalOpen1(false); // Close the confirmation modal

      setIsModalOpen2(true);
      // setTimeout(() => {
      setIsModalOpen1(false);
      // }, 500); // 2000 milliseconds (2 seconds)
    };
    const handleModalClose1 = () => {
      setIsModalOpen1(false);
      // Reset values after closing the modal
      setVoiceValues({
        gameNonPlayerVoice: formData.gameNonPlayerVoice,
        gamePlayerMaleVoice: formData.gamePlayerMaleVoice,
        gamePlayerFemaleVoice: formData.gamePlayerFemaleVoice,
        gameNarratorVoice: formData.gameNarratorVoice,
      });
    };
    const handleModalClose3 = (values:number) => {
      setIsModalOpen3(false);
      // Reset values after closing the modal
      if(values===1){
      setVoiceValues({
        gameNonPlayerVoice: formData.gameNonPlayerVoice,
        gamePlayerMaleVoice: formData.gamePlayerMaleVoice,
        gamePlayerFemaleVoice: formData.gamePlayerFemaleVoice,
        gameNarratorVoice: formData.gameNarratorVoice,
      });
      
      fetchData4(updateData);
    }
    };

    useEffect(()=>{
      if(formData?.gameId){
        const previewData = {
          gameId: formData.gameId,
          // currentTab: tab,
          currentSubTab: tabState ==='Translations' ? 1 : 0,
        };
        dispatch(updatePreviewData(previewData));
      }
    },[tabState])

    return (
      <>
        <Modal isOpen={isModalOpen3} onClose={() => handleModalClose3(0)} isCentered>
          <ModalOverlay zIndex={999999999} />
          <ModalContent containerProps={{zIndex:999999999}} position="fixed" overflowY="auto" m={0} w={{sm:'80%',md:'100%'}}>
            <ModalHeader>
              <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
                Confirmation
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0} pl={'25px'}>
              <Text color={textColor} fontSize="18px" fontWeight="600">
                A (language) version of your game has been saved to your drafts.
                The translations are AI-generated; hence we strongly recommend
                reviewing them before launch. Would you like to review the
                (language) version right now?
              </Text>
            </ModalBody>
            <ModalFooter>
              <Flex
                justify="space-between"
                w="50%"
                marginTop="15px"
                p="0 15px"
                display="flex"
              >
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  mr={'10px'}
                  onClick={() => handleModalClose3(1)}
                >
                  Yes
                </Button>
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  onClick={() => handleModalClose3(0)}
                >
                  No
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isModalOpen1}  onClose={() => handleModalClose1()} isCentered>
          <ModalOverlay zIndex={999999999}/>
          <ModalContent containerProps={{zIndex:999999999}} position="fixed" overflowY="auto" m={0} w={{sm:'80%',md:'100%'}}>
            <ModalHeader>
              <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
                Confirmation
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0} pl={'25px'}>
              <Text color={textColor} fontSize="18px" fontWeight="600">
                Would you like to change character voices for the translated
                version?
              </Text>
            </ModalBody>
            <ModalFooter>
              <Flex
                justify="space-between"
                w="50%"
                marginTop="15px"
                p="0 15px"
                display="flex"
              >
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  mr={'10px'}
                  onClick={() => handleConfirmModal()}
                >
                  Yes
                </Button>
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  onClick={() => handleSavefromCharacterVoice()}
                >
                  No
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={modalPopup}  onClose={() => handleVoiceBack()} isCentered>
          <ModalOverlay zIndex={999999999}/>
          <ModalContent containerProps={{zIndex:999999999}} position="fixed" overflowY="auto" m={0} w={{sm:'80%',md:'100%'}}>
            <ModalHeader>
              <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
              Voiceover Confirmation
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0} pl={'25px'}>
              <Text color={textColor} fontSize="18px" fontWeight="600">
              Is the game content final?
Please note that once voiceovers are generated, only limited changes can be made to the content. Any changes made after this step will not reflect in the preview voiceovers until the game is launched.

              </Text>
            </ModalBody>
            <ModalFooter>
              <Flex
                justify="space-between"
                w="80%"
                marginTop="15px"
                p="0 15px"
                display="flex"
              >
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  mr={'10px'}
                  onClick={() => setModalPopup(false)}
                  
                >
                  Finalise Voiceovers 
                </Button>
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  onClick={() => handleVoiceBack()}
                >
                  Go Back
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={launchPopup}  onClose={() => setLaunchPopup(false)} isCentered>
          <ModalOverlay zIndex={999999999}/>
          <ModalContent containerProps={{zIndex:999999999}} position="fixed" overflowY="auto" m={0} w={{sm:'80%',md:'100%'}}>
            <ModalHeader>
              <Text color={textColor} fontSize="2xl" fontWeight="700" mb="20px">
              Voiceover Confirmation
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0} pl={'25px'}>
              <Text color={textColor} fontSize="18px" fontWeight="600">
              If you would like to add voiceovers, please enable them in Preferences.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Flex
                justify="space-between"
                w="80%"
                marginTop="15px"
                p="0 15px"
                display="flex"
              >
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  mr={'10px'}
                  onClick={() => handleLaunchConfirm()}
                  
                >
                  Continue
                </Button>
                <Button
                  color={'#fff'}
                  bg={'#11047a'}
                  _hover={{ color: '#fff', bg: '#11047a' }}
                  onClick={() => setLaunchPopup(false)}
                >
                Cancel
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>



        <Card mt="20px" p={{ base: '20px', md: '20px 40px' }}>
          <Box w="100%" mb="40px">
            <Flex direction={{ base: 'column', '3xl': 'row' }}>
              <Box me={{ md: '40px', '3xl': '40px' }}>
                <Tabs variant="soft-rounded" colorScheme="brandTabs" mb="60px">
                  <TabList overflowX={{ sm: 'scroll', lg: 'unset' }}>
                    <Flex>
                      <Tab
                        pb="0px"
                        flexDirection="column"
                        onClick={function () {
                          setTabState('Preferences');
                        }}
                        bg="unset"
                        _selected={{
                          bg: 'none',
                        }}
                        _focus={{ border: 'none' }}
                        minW="max-content"
                      >
                        <Flex align="center">
                          <Text
                            color={
                              tabState === 'Preferences'
                                ? textColor
                                : textColorTertiary
                            }
                            fontSize="lg"
                            fontWeight="500"
                          >
                            Preferences
                          </Text>
                        </Flex>
                        <Box
                          height="4px"
                          w="100%"
                          transition="0.1s linear"
                          bg={
                            tabState === 'Preferences'
                              ? 'brand.500'
                              : 'transparent'
                          }
                          mt="15px"
                          borderRadius="30px"
                        />
                      </Tab>
                      <Tab
                        onClick={function () {
                          setTabState('Translations');
                        }}
                        pb="0px"
                        me="10px"
                        bg="unset"
                        _selected={{
                          bg: 'none',
                        }}
                        _focus={{ border: 'none' }}
                        minW="max-content"
                        flexDirection="column"
                      >
                        <Flex align="center">
                          <Text
                            color={
                              tabState === 'Translations'
                                ? textColor
                                : textColorTertiary
                            }
                            fontSize="lg"
                            fontWeight="500"
                          >
                            Translations
                          </Text>
                        </Flex>
                        <Box
                          height="4px"
                          w="100%"
                          transition="0.1s linear"
                          bg={
                            tabState === 'Translations'
                              ? 'brand.500'
                              : 'transparent'
                          }
                          mt="15px"
                          borderRadius="30px"
                        />
                      </Tab>
                    </Flex>
                  </TabList>
                  <TabPanels pt="30px">
                    <TabPanel>
                      <Box w={{base:'100%',md:'65%'}}>
                        <SimpleGrid
                          columns={{ sm: 1, md: 1, xl: 1 }}
                          spacing={{ base: '20px', xl: '20px' }}
                        >
                          <FormControl mt="20px">
                            <FormLabel
                              htmlFor="alerts"
                              mb="0"
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColorPrimary}
                              mr="2"
                            >
                              Show Interaction Feedback
                            </FormLabel>
                            <RadioGroup
                              name="gameIsShowInteractionFeedBack"
                              id="alerts"
                              onChange={handleChan}
                              value={
                                formData?.gameIsShowInteractionFeedBack
                                  ? formData?.gameIsShowInteractionFeedBack
                                  :  options[0].value
                              }
                            >
                              <Stack direction="row" spacing={5}>
                                {options.map((option) => (
                                  <Radio
                                    key={option?.value}
                                    value={option?.value}
                                    color="#422afb"
                                  >
                                    <Text fontSize="0.875rem">
                                      {' '}
                                      {option?.name}
                                    </Text>
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          </FormControl>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent={'space-between'}
                            mt={'20px'}
                          >
                            <FormLabel
                              htmlFor="summaryScreen"
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColorPrimary}
                              mr="2"
                            >
                              Shuffle option
                            </FormLabel>
                            <Switch
                              id="gameShuffle"
                              name="gameShuffle"
                              colorScheme={'brandScheme'}
                              onChange={handleChange}
                              defaultChecked={
                                formData.gameShuffle === 'true' ? true : false
                              }
                            />
                          </FormControl>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent={'space-between'}
                            mt={'20px'}
                          >
                            <FormLabel
                              htmlFor="summaryScreen"
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColorPrimary}
                              mr="2"
                            >
                              Disable optional replays
                            </FormLabel>
                            <Switch
                              id="gameDisableOptionalReplays"
                              name="gameDisableOptionalReplays"
                              colorScheme={'brandScheme'}
                              onChange={handleChange}
                              defaultChecked={
                                formData.gameDisableOptionalReplays === 'true'
                                  ? true
                                  : false
                              }
                            />
                          </FormControl>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent={'space-between'}
                            mt={'20px'}
                          >
                            <FormLabel
                              htmlFor="summaryScreen"
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColorPrimary}
                              mr="2"
                            >
                              Change introductory music{' '}
                              <span style={{ color: 'red' }}>*</span>
                            </FormLabel>                       

                            {!formData.gameIntroMusic ||
                              formData.gameIntroMusic === '' ||
                              formData.gameIntroMusic === null ? (
                              <>
                                <input type="file" style={{ display: 'none' }} />
                                <Box
                                  position={'relative'}
                                  mb={'30px'}
                                  left={{base:'-25%',md:'-8%'}}
                                  cursor={'pointer'}
                                  onClick={() => handleBadgeImages()}
                                >
                                  <input
                                    type="file"
                                    style={{
                                      width: '100px',
                                      position: 'absolute',
                                      display: 'none',
                                      textAlign: 'right',

                                      opacity: 0,
                                      zIndex: 2,
                                      height: '100px',
                                    }}
                                  />
                                  <Box
                                    position={'absolute'}
                                    className={'choosebadge'}
                                    top={0}
                                    left={0}
                                    zIndex={1}
                                    backgroundColor={'#422AFB'}
                                    p={'2px'}
                                    borderRadius={'15px'}
                                    pr={'8px'}
                                    pl={'8px'}
                                    display={'flex'}
                                    alignItems="center"
                                    justifyContent={'flex-start'}
                                  >
                                    <SearchIcon
                                      color={'#fff'}
                                      w="15px"
                                      h="15px"
                                    />
                                    <Text
                                      fontSize="sm"
                                      color={'#fff'}
                                      whiteSpace={'nowrap'}
                                      textAlign={'left'}
                                    >
                                      Choose Audio
                                    </Text>
                                  </Box>
                                </Box>
                              </>
                            ) : (
                              <Box
                                position={'relative'}
                                display={'flex'}
                                alignItems={'center'}
                                className={'Box12'}
                                justifyContent={'end'}
                                w={'100%'}
                                ml={'10px'}
                                mb={'10px'}
                              >
                                <Box>
                                  <Text
                                    color={'#3311db'}
                                    textAlign={'center'}
                                    verticalAlign={'center'}
                                    fontSize="md"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    onClick={handleBadgeImages}
                                    cursor="pointer"
                                  >
                                    {formData.gameIntroMusicName
                                      ?.split('/')
                                      ?.pop()
                                      ?.split('.')
                                      ?.slice(0, -1)
                                      ?.join('.')}
                                    .mp3
                                  </Text>
                                  <Icon
                                    as={MdClose}
                                    bg={'#fff'}
                                    color={'red'}
                                    position={'absolute'}
                                    borderRadius={'50%'}
                                    top={'-0'}
                                    right={'0'}
                                    cursor="pointer"
                                    onClick={() => {
                                      handleClear();
                                      handleEndedBtnClick();
                                    }}
                                  />
                                  { }
                                </Box>
                                {isPlaying === null ||
                                  (!isPlaying && isPaused) ? (
                                  <>
                                    <Box
                                      w={'30px'}
                                      h={'30px'}
                                      borderRadius={'50%'}
                                      bg={'#3311db'}
                                      display={'flex'}
                                      alignItems={'center'}
                                      justifyContent={'center'}
                                      mr={'10px'}
                                      ml={'10px'}
                                      onClick={() => handlePlay()}
                                    >
                                      (<FaPlay size={15} color={'#fff'} />)
                                    </Box>
                                    {(isPaused || isPlaying) && (
                                      <Box
                                        w={'30px'}
                                        h={'30px'}
                                        borderRadius={'50%'}
                                        bg={'#3311db'}
                                        display={'flex'}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                        mr={'10px'}
                                        onClick={() => handleEndedBtnClick()}
                                      >
                                        <FaStop size={15} color="#fff" />
                                      </Box>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Box
                                      w={'30px'}
                                      h={'30px'}
                                      borderRadius={'50%'}
                                      bg={'#3311db'}
                                      display={'flex'}
                                      alignItems={'center'}
                                      justifyContent={'center'}
                                      mr={'10px'}
                                      ml={'10px'}
                                      onClick={() => handlePause()}
                                    >
                                      <FaPause size={15} color="#fff" />
                                    </Box>

                                    <Box
                                      w={'30px'}
                                      h={'30px'}
                                      borderRadius={'50%'}
                                      bg={'#3311db'}
                                      display={'flex'}
                                      alignItems={'center'}
                                      justifyContent={'center'}
                                      mr={'10px'}
                                      onClick={() => handleEndedBtnClick()}
                                    >
                                      <FaStop size={15} color="#fff" />
                                    </Box>
                                  </>
                                )}
                              </Box>
                            )}
                          </FormControl>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent={'space-between'}
                            mt={'20px'}
                          >
                            <FormLabel
                              htmlFor="summaryScreen"
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColorPrimary}
                              mr="2"
                            >
                              Track Question Wise Answers
                            </FormLabel>
                            <Switch
                              id="gameTrackQuestionWiseAnswers"
                              name="gameTrackQuestionWiseAnswers"
                              colorScheme={'brandScheme'}
                              onChange={handleChange}
                              defaultChecked={
                                formData.gameTrackQuestionWiseAnswers === 'true'
                                  ? true
                                  : false
                              }
                            />
                          </FormControl>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent={'space-between'}
                            mt={'20px'}
                          >
                            <FormLabel
                              htmlFor="summaryScreen"
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColorPrimary}
                              mr="2"
                            >
                              Disable Learner Email Notifications
                            </FormLabel>
                            <Switch
                              id="gameDisableLearnerMailNotifications"
                              name="gameDisableLearnerMailNotifications"
                              colorScheme={'brandScheme'}
                              onChange={handleChange}
                              defaultChecked={
                                formData.gameDisableLearnerMailNotifications ===
                                  'true'
                                  ? true
                                  : false
                              }
                            />
                          </FormControl>
                          <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent={'space-between'}
                            mt={'20px'}
                          >
                            <FormLabel
                              htmlFor="summaryScreen"
                              fontSize="sm"
                              fontWeight="bold"
                              color={textColorPrimary}
                              mr="2"
                            >
                              Enable voiceovers
                            </FormLabel>
                            <Switch
                              id="gameenableVoiceOver"
                              name="gameenableVoiceOver"
                              colorScheme={'brandScheme'}
                              onChange={handleChange}
                              // defaultChecked={
                              //   formData.gameenableVoiceOver ===
                              //     'true'
                              //     ? true
                              //     : false
                              // }
                              isChecked={formData.gameenableVoiceOver === 'true'}
                            />
                          </FormControl>
                        </SimpleGrid>
                      </Box>
                    </TabPanel>
                    <TabPanel >
                      <Box w={'100%'} display={'flex'} justifyContent={{md:'center',lg:'center',xl:'flex-start'}}>
                        <Box boxShadow={'0 4px 8px rgba(0, 0, 0, 0.1)'} // Adjust the shadow as needed
                          borderRadius={'8px'}
                          p={'16px'} // Adjust the padding as needed
                          w={{sm:'100%',md:'60%'}}>
                          <SimpleGrid
                            columns={{ sm: 1, md: 1, xl: 1 }}
                            spacing={{ base: '20px', xl: '20px' }}
                          >
                            <FormControl
                              display={{ base: 'block', sm: 'block', md: 'block', lg: 'block', xl: "flex" }}
                              alignItems="center"
                              justifyContent={'space-between'}
                              mt={'20px'}
                            >
                              <FormLabel
                                htmlFor="summaryScreen"
                                fontSize="sm"
                                fontWeight="bold"
                                color={textColorPrimary}
                                m="0"
                                mb={{ base: '10px', sm: '10px', md: '10px', lg: '10px', xl: '0' }}
                              >
                                Select Languages for Game Translation
                              </FormLabel>
                              <Select

                                name="gameLanguageId"
                                options={mappedlanguageOptions}
                                value={
                                  mappedlanguageOptions.find(
                                    (option) => option.value === defaultLang,
                                  ) || null
                                }
                                onChange={handleLanguageChangeGPT}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  control: (provided: any, state: any) => ({
                                    ...provided,
                                    borderRadius: '15px',
                                    height: 'auto',
                                    padding: '0 !important',
                                    width: '100%',
                                    '@media (min-width: 1200px)': { // Adjust for lg viewport size
                                      width: '300px', // Set width to 500px for lg view
                                    },
                                  }),
                                }}
                              />
                            </FormControl>
                            {/* changs on 20-01-2024 */}
                            <>
                              {isModalOpen2 && (
                                <CharacterPreviewTranslate
                                  handleSave={handleSave}
                                  selectedOption={selectedOption}
                                  setVoiceValues={setVoiceValues}
                                  voiceValues={voiceValues}
                                  isModalOpen2={isModalOpen2}
                                  setIsModalOpen2={setIsModalOpen2}
                                  voices={voices}
                                  handleInputChange2={handleInputChange2}
                                  handleModalClose={handleModalClose}
                                />
                              )}
                            </>
                            {/* changs on 20-01-2024 */}
                          </SimpleGrid>
                        </Box>
                      </Box>
                      <Box w={'100%'} mt="20px" p="20px 0px">
                        <SimpleGrid
                          columns={{ sm: 1, md: 2, xl: 4 }}
                          spacing={{ base: '20px', xl: '20px' }}
                        >
                          {selectedLanguages.length === 0 ? (
                            <Flex
                              key={defaultLanguage.value}
                              direction="column"
                              bg={
                                parseInt(defaultLang) === defaultLanguage.value
                                  ? boxBg
                                  : 'transparent'
                              }
                              p="16px 20px"
                              position="relative"
                              borderRadius="14px"
                              mb="38px"
                              border={
                                parseInt(defaultLang) === defaultLanguage.value
                                  ? '2px solid #11047a'
                                  : 'none'
                              }
                              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
                            >
                              {parseInt(defaultLang) ===
                                defaultLanguage.value && (
                                  <Flex
                                    position="absolute"
                                    top="-10px"
                                    right="-10px"
                                    width="20px"
                                    height="20px"
                                    borderRadius="50%"
                                    bg={
                                      parseInt(defaultLang) ===
                                        defaultLanguage.value
                                        ? '#11047a'
                                        : 'transparent'
                                    }
                                    alignItems="center"
                                    justifyContent="center"
                                    zIndex="1"
                                    overflow="hidden"
                                  >
                                    <Icon
                                      as={MdOutlineCheck}
                                      w="15px"
                                      h="15px"
                                      color="white"
                                    />
                                  </Flex>
                                )}
                              <Text
                                fontSize="sm"
                                fontWeight="700"
                                color={'black'}
                              >
                                {defaultLanguage.label}
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="500"
                                color="secondaryGray.600"
                              >
                                Your Content Now in {defaultLanguage.label}{' '}
                                Language
                              </Text>
                            </Flex>
                          ) : (
                            <>
                              <Flex
                                key={defaultLanguage.value}
                                direction="column"
                                bg={
                                  parseInt(defaultLang) === defaultLanguage.value
                                    ? boxBg
                                    : 'transparent'
                                }
                                p="16px 20px"
                                position="relative"
                                borderRadius="14px"
                                mb="38px"
                                border={
                                  parseInt(defaultLang) === defaultLanguage.value
                                    ? '2px solid #11047a'
                                    : 'none'
                                }
                                boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
                              >
                                {parseInt(defaultLang) ===
                                  defaultLanguage.value && (
                                    <Flex
                                      position="absolute"
                                      top="-10px"
                                      right="-10px"
                                      width="20px"
                                      height="20px"
                                      borderRadius="50%"
                                      bg={
                                        parseInt(defaultLang) ===
                                          defaultLanguage.value
                                          ? '#11047a'
                                          : 'transparent'
                                      }
                                      alignItems="center"
                                      justifyContent="center"
                                      zIndex="1"
                                      overflow="hidden"
                                    >
                                      <Icon
                                        as={MdOutlineCheck}
                                        w="15px"
                                        h="15px"
                                        color="white"
                                      />
                                    </Flex>
                                  )}
                                <Text
                                  fontSize="sm"
                                  fontWeight="700"
                                  color={'black'}
                                >
                                  {defaultLanguage.label}
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="secondaryGray.600"
                                >
                                  Your Content Now in {defaultLanguage.label}{' '}
                                  Language
                                </Text>
                              </Flex>

                              {selectedLanguages.map(
                                ({
                                  translationId,
                                  gamechoosenId,
                                  ...otherProperties
                                }) => (
                                  <Flex
                                    key={gamechoosenId}
                                    direction="column"
                                    bg={
                                      parseInt(defaultLang) === translationId
                                        ? boxBg
                                        : 'transparent'
                                    }
                                    p="16px 20px"
                                    borderRadius="14px"
                                    mb="38px"
                                    border={
                                      parseInt(defaultLang) === translationId
                                        ? '2px solid #11047a'
                                        : 'none'
                                    }
                                    position="relative" // Position relative for pseudo-element
                                    cursor="pointer"
                                    onClick={() =>
                                      handleLanguageChangeGPTdata(
                                        translationId,
                                        getLanguageLabel(translationId),
                                        otherProperties,
                                      )
                                    }
                                    boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
                                  >
                                    {parseInt(defaultLang) === translationId && (
                                      <Flex
                                        position="absolute"
                                        top="-10px"
                                        right="-10px"
                                        width="20px"
                                        height="20px"
                                        borderRadius="50%"
                                        bg={
                                          parseInt(defaultLang) === translationId
                                            ? '#11047a'
                                            : 'transparent'
                                        }
                                        alignItems="center"
                                        justifyContent="center"
                                        zIndex="1"
                                        overflow="hidden"
                                      >
                                        <Icon
                                          as={MdOutlineCheck}
                                          w="15px"
                                          h="15px"
                                          color="white"
                                        />
                                      </Flex>
                                    )}
                                    <Text
                                      fontSize="sm"
                                      fontWeight="700"
                                      color={'black'}
                                    >
                                      {getLanguageLabel(translationId)}
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      fontWeight="500"
                                      color="secondaryGray.600"
                                    >
                                      Your Content Now in{' '}
                                      {getLanguageLabel(translationId)} Language
                                    </Text>
                                  </Flex>
                                ),
                              )}
                            </>
                          )}
                        </SimpleGrid>
                      </Box>{' '}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Flex>
          </Box >
        </Card >
        <PreferenceAudio
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          badgeData={badgeData}
          handleBadgeSelection={handleBadgeSelection}
          textColorPrimary={textColorPrimary}
        />
      </>
    );
  };

export default GreetingsForm;
