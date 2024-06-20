import {
  Box, Button, Flex, Heading, Icon, Img, SimpleGrid, Text, Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel, useColorModeValue, Grid, IconButton,
  InputGroup,
  InputLeftElement, Input,InputRightElement, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, FormControl, FormLabel, Select, Checkbox, Stack, CheckboxGroup, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, RadioGroup, Radio, Textarea
} from '@chakra-ui/react'

import { Navigate, useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import AddCourse from './components/AddCourse';
import { FaRegFolderOpen } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import { GiJoystick } from "react-icons/gi";
import { getImages, getAllGame, countByStage, getDuplicate, getLaunch, getAssign, getPublic, gameDelete } from 'utils/game/gameService';
import { CiMenuKebab } from "react-icons/ci";
import { IoMdHeart } from 'react-icons/io';
// import GameBG from 'assets/img/account/InvoiceBg.png'
import Navbar from 'assets/img/crm/navbar.png'
import NFTBanner from 'assets/img/auth/topbg.jpg'
import NFT from 'assets/img/nfts/Nft3.png'
import GameBG from 'assets/img/auth/banner.png'
import Rocket from 'assets/img/games/rocket1-removebg-preview.png'
import { MdArrowCircleRight, MdMoreVert, MdOutlinePublic, MdOutlineRocketLaunch } from 'react-icons/md';
import { VSeparator } from 'components/separator/Separator';
import GameCard from './components/gameCard';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import Preview from './components/perview';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import LeanerList from './components/LeanersList'
import TexttoVoice from './components/SpeeachKit'
import { createScormConfig, getScormConfig, generateScorm } from 'utils/scorm/scorm';
// @ts-ignore
// import loadingImage from 'assets/img/games/loading.gif';
import loadingImage from 'assets/img/games/loady.gif';

import {API_SERVER} from 'config/constant';
import { RiDraftLine } from 'react-icons/ri';
import { HashLoader } from 'react-spinners';

interface Counting {
  draftCount: any;
  internalCount: any;
  publicCount: any;
}

const Game: React.FC = () => {


  const searchIconColor = useColorModeValue('gray.700', 'white');
  const [showcount, setcount] = useState<Counting>({
    draftCount: 0,
    internalCount: 0,
    publicCount: 0,

  });
  const navigate = useNavigate();
  const [openCourse, setOpenCourse] = useState(false);
  const [img, setImg] = useState<any[]>([]),
    [fil, setFil] = useState<string>(''),
    [gamelist, setGameList] = useState<any[]>([]),
    [enter, setEnter] = useState(false),
    [bgIndex, setBgIndex] = useState<number>();
  const [deleteId, setDeleteId] = useState<number>(0);
  const [publicId, setPublicId] = useState<number>(0);
  const [launchId, setLaunchId] = useState<number>(0);
  const [duplicateId, setDuplicate] = useState<number>(0);
  const [msg, setMsg] = useState<string>('');
  const [msgtwo, setMsgtwo] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openLearner, setOpenLearner] = useState(false);
  const [assignGameId, setAssignGameId] = useState<number>();
  const [isConfirm, setIsConfirm] = useState(false);
  const [tabState, setTabState] = useState('Creation');
  const [completionValue, setCompletionValue] = useState<any>([]);
  const [completionStatus, setCompletionStatus] = useState([
    { value: 'Passed/Failed', label: 'Passed/Failed', isChecked: false },
    { value: 'Completed/Incomplete', label: 'Completed/Incomplete', isChecked: false },
    { value: 'Passed/Incomplete', label: 'Passed/Incomplete', isChecked: false },
  ]);
  const [loadingdata, setLoadingdata] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const handleCourse = () => {
    navigate('/admin/superadmin/game/template');
  }
  const fetchData = async () => {
    const result = await getImages(1);
    if (result?.status !== 'Success')
      return console.log('getbackruond error:' + result?.message);
    setImg(result?.data);
  };
  const fetchCount = async () => {

    const result = await countByStage();
    if (result?.status !== 'Success') {
      return console.log('getbackruond error:' + result?.message);
    }
    else {
      setcount({
        ...showcount, draftCount: result?.creationCount || 0,
        internalCount: result?.reviewCount || 0, publicCount: result?.PublicCount || 0
      });
    }
  };
  const gameGameStage = localStorage.getItem('gameGameStage');
useEffect(() => {
 
  if(gameGameStage === 'Review')
  {
    setTabState('Review');
    setLoadingdata(true);
  }
  gameLists(tabState);
}, [tabState]);
  useEffect(() => {
    if(gameGameStage === 'Review')
    {
      setTabState('Review');
      setLoadingdata(true);
    }

    gameLists(tabState);
    fetchData();
    fetchCount();
  }, []);
  const handleMouse = (i: number) => {
    setEnter(true)
    setBgIndex(i)
  }
  const handleMouseLeave = () => {
    setEnter(false)
    setBgIndex(null)
  }
  const handleButtonOne = (id: any) => {
    console.log('handleButtonOne', id)
    const newTab = window.open('', '_blank');

    // Navigate the new tab to the desired URL
    newTab.location.assign(`/admin/game/preview/${id}`);

  }
  const handleButtonTwo = (id: any) => {

    console.log('handleButtonTwo', id)
    navigate(`/admin/superadmin/game/creation/${id}`)
  }


  const handelDuplicate = (id: any) => {
    setDuplicate(id)
    setMsgtwo('Are you certain that you create a duplicate of this game?')
    setIsOpen(true)
  }
  const handelLaunch = (id: any) => {
    setLaunchId(id);
    setMsgtwo('Are you sure that you initiated the launch of this game?')
    setIsOpen(true);
  }
  const handelAssign = (id: any) => {
    setAssignGameId(id);
    setOpenLearner(true)
  }
  const handelMakePublic = async (id: any) => {
    setMsgtwo("Are you sure you've made this game public?")
    setPublicId(id)
    setIsOpen(true);
  }

  const handelDelete = (id: any) => {
    setDeleteId(id);
    setIsOpen(true);

  }
  const containerRef = useRef(null);
  useEffect(() => {
    // Your code to fetch data or handle tab change
    if(gameGameStage === 'Review')
    {
      setTabState('Review');
      setLoadingdata(true);
      
    }
    gameLists(tabState);
    // Scroll to top when tab changes
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [tabState]);

  const [isDownloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadId, setDownloadId] = useState(null);

  const handleDownload = async (id: any) => {
    setDownloadId(id);
    try {
      const response = await getScormConfig(id);
      if (response) {
        let completionStatusArray: string[] = [];
        if (response.completionStatus) {
          completionStatusArray = response.completionStatus.split(',');
        }
        const formData = {
          scormEdition: response?.scormEdition,
          completionStatus: response?.completionStatus,
          scoringMethod: response?.scoringMethod,
          masteryScore: response?.masteryScore,
          trackingTypes: response?.trackingTypes,
          lmsApiVersion: response?.lmsApiVersion,
          dataTransferFrequency: response?.dataTransferFrequency,
          launchBehavior: response?.launchBehavior,
          navigation: response?.navigation,
          bookmarking: response?.bookmarking,
          reportLocation: response?.reportLocation,
          reportFormat: response?.reportFormat,
          debuggingMode: response?.debuggingMode,
          sequencingRules: response?.sequencingRules,
          checkCustomMetadata: response?.checkCustomMetadata,
          customMetadata: response?.customMetadata,
          checkCustomJsHooks: response?.checkCustomJsHooks,
          preLaunchScript: response?.preLaunchScript,
          postLaunchScript: response?.postLaunchScript,
          checkAlternateContent: response?.checkAlternateContent,
          alternateContent: response?.alternateContent,
          textToSpeech: response?.textToSpeech,
          language: response?.language,
          encryption: response?.encryption,
          scormPackageVersion: response?.scormPackageVersion,
        };
        const updatedCompletionStatus = completionStatus.map(option => ({
          ...option,
          isChecked: completionStatusArray.includes(option.value),
        }));
        setCompletionStatus(updatedCompletionStatus);
        setCompletionValue(completionStatusArray);
        setFormData(formData);
        setDownloadDialogOpen(true);
      } else {
        const formData = {
          scormEdition: 'SCORM 1.2',
          completionStatus: '',
          scoringMethod: 'rawScore',
          masteryScore: '',
          trackingTypes: '',
          lmsApiVersion: 'SCORM 1.2',
          dataTransferFrequency: '',
          launchBehavior: 'newWindow',
          navigation: 'sequential',
          bookmarking: 'alwaysResume',
          reportLocation: 'lmsDatabase',
          reportFormat: '',
          debuggingMode: 'enable',
          sequencingRules: 'automatic',
          checkCustomMetadata: false,
          customMetadata: '',
          checkCustomJsHooks: false,
          preLaunchScript: '',
          postLaunchScript: '',
          checkAlternateContent: false,
          alternateContent: '',
          textToSpeech: 'enable',
          language: 'english',
          encryption: 'enable',
          scormPackageVersion: '',
        };
        setFormData(formData);
        setDownloadDialogOpen(true);
      }

      //   const updatedCompletionStatus = completionStatus.map(option => ({
      //     ...option,
      //     isChecked: formData.completionStatus.includes(option.value),
      // }));

      // setFormData(formData);

    } catch (error) {
      console.error('Error fetching SCORM config:', error);
    }
    // setDownloadDialogOpen(true);
  };

  const onCloseDownloadDialog = () => {
    const formData = {
      scormEdition: 'SCORM 1.2',
      completionStatus: '',
      scoringMethod: 'rawScore',
      masteryScore: '',
      trackingTypes: '',
      lmsApiVersion: 'SCORM 1.2',
      dataTransferFrequency: '',
      launchBehavior: 'newWindow',
      navigation: 'sequential',
      bookmarking: 'alwaysResume',
      reportLocation: 'lmsDatabase',
      reportFormat: '',
      debuggingMode: 'enable',
      sequencingRules: 'automatic',
      checkCustomMetadata: false,
      customMetadata: '',
      checkCustomJsHooks: false,
      preLaunchScript: '',
      postLaunchScript: '',
      checkAlternateContent: false,
      alternateContent: '',
      textToSpeech: 'enable',
      language: 'english',
      encryption: 'enable',
      scormPackageVersion: '',
    };
    setFormData(formData);
    setDownloadDialogOpen(false);
  };
  const leastDestructiveRef = useRef(null);

  useEffect(() => {
    const deleteData = async () => {
      if (isConfirm) {
        if (deleteId !== 0) {
          const result = await gameDelete(deleteId);
          if (result?.status !== 'Success') {
            setIsOpen(false);
            setMsg('Game Not Deleted');
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            setDeleteId(0);
            return;
          } else {
            setDeleteId(0);
            setIsOpen(false);
            setMsg('Game Deleted');
            setToastStatus('success');
            setAlert(true);
            setIsConfirm(false);
            fetchCount();
            gameLists(tabState);
          }


        }
      }
    }
    deleteData()

  }, [isConfirm, deleteId]);


  useEffect(() => {

    const makePublic = async () => {
      if (isConfirm) {
        if (publicId !== 0) {

          const result = await getPublic(publicId);
          if (result?.status !== 'Success') {
            setMsgtwo('');
            setPublicId(0);
            setIsOpen(false);
            setMsg('Game Not Published');
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            return;
          } else {
            setMsgtwo('');
            setPublicId(0);
            setIsOpen(false);
            setMsg('Game Published');
            setToastStatus('success');
            setAlert(true);
            setIsConfirm(false);
            setTabState('Launched');
            fetchCount();
            gameLists(tabState);
          }
        }
      }
    }


    makePublic()

  }, [isConfirm, publicId]);


  useEffect(() => {
    const launchGame = async () => {
      if (isConfirm) {
        if (launchId !== 0) {

          const result = await getLaunch(launchId);
          if (result?.status !== 'Success') {
            setLaunchId(0);
            setMsgtwo('');
            setIsOpen(false);
            setMsg('Game Not Launch ');
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            return;
          } else {
            setMsgtwo('');
            setLaunchId(0);
            setIsOpen(false);
            setMsg('Game Launch Sucessfuly');
            setToastStatus('success');
            setAlert(true);
            setIsConfirm(false);
            setTabState('Review');
            fetchCount();
            gameLists(tabState);

          }
        }
      }
    }


    launchGame()
  }, [isConfirm, launchId]);


  useEffect(() => {
    const gameDuplicate = async () => {
      if (isConfirm) {
        if (duplicateId !== 0) {

          const result = await getDuplicate(duplicateId);
          if (result?.status !== 'Success') {
            setMsgtwo('');
            setDuplicate(0);
            setIsOpen(false);
            setMsg('Game Not Duplicated ');
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            return;
          } else {
            setMsgtwo('');
            setDuplicate(0);
            setIsOpen(false);
            setMsg('Game Duplicated Sucessfuly');
            setToastStatus('success');
            setAlert(true);
            setIsConfirm(false);
            setTabState("Creation");
            fetchCount();
            gameLists(tabState);
          }
        }
      }
    }
    gameDuplicate()

  }, [isConfirm, duplicateId]);

  const gameLists = async (type: string) => {
    setLoadingdata(true);
    const data = '';
    const result = await getAllGame(data, type);
    if (result?.status !== 'Success') {
      setGameList([]);
      return console.log('getbackruond error:' + result?.message);
    } else {

      setGameList(result.data);
      localStorage.removeItem('gameGameStage');
    }

    setLoadingdata(false);
    
  };

  const [scormEdition, setScormEdition] = useState('SCORM 1.2');
  const handleScormEditionChange = async (event: any) => {
    const updatedScormEdition = event.target.value;

    const id = downloadId;
    const data = JSON.stringify({ ...formData, scormEdition: updatedScormEdition });
    const result = await createScormConfig(id, data);

    setScormEdition(updatedScormEdition);
    setFormData((prevFormData) => ({
      ...prevFormData,
      scormEdition: updatedScormEdition,
    }));
  };
  const [scoringMethod, setScoringMethod] = useState('rawScore');
  const [masteryScore, setMasteryScore] = useState('');
  const [trackingTypes, setTrackingTypes] = useState([
    { value: 'ContentView', label: 'Content View' },
    { value: 'QuizAttempts', label: 'Quiz Attempts' },
    { value: 'TimeSpent', label: 'Time Spent' },
    { value: 'Interactions', label: 'Interactions' },
  ]);


  const updatedCompletionStatus: any = [];
  let currentStatus: any = [];

  const handleCompletionStatusChange = async (e: any, selectedStatus: any[]) => {
    if ((!completionValue.includes(selectedStatus)) && e.target.checked === true) {
      setCompletionValue([...completionValue, selectedStatus])
      currentStatus = [...completionValue, selectedStatus]
    }
    else if (completionValue.includes(selectedStatus) && e.target.checked === false) {
      const currentStatusElse = [...completionValue]
      currentStatus = currentStatusElse.filter((item: any) => item !== selectedStatus)
      setCompletionValue(currentStatus)
    }
    const id = downloadId;
    const data = JSON.stringify({ ...formData, completionStatus: currentStatus.join(',') });

    try {
      // Perform the asynchronous operation to get additional data
      const result = await createScormConfig(id, data);
      setCompletionStatus(prevStatus => {
        return prevStatus.map((option: any) => {
          if (option.value === selectedStatus) {
            return { ...option, isChecked: !option.isChecked };
          }
          return option;
        });
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        completionStatus: updatedCompletionStatus,
        // Update other fields if necessary based on the result
      }));
    } catch (error) {
      // Handle errors if necessary
      console.error('Error updating completion status:', error);
    }
  };

  const handleScoringMethodChange = async (event: any) => {
    const updatedScoringMethod = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, scoringMethod: updatedScoringMethod });
    const result = await createScormConfig(id, data);
    setScoringMethod(updatedScoringMethod);
    setFormData((prevFormData) => ({
      ...prevFormData,
      scoringMethod: updatedScoringMethod,
    }));
  };
  const handleMasteryScoreChange = async (value: any) => {
    const updatedMasteryScore = value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, masteryScore: updatedMasteryScore });
    const result = await createScormConfig(id, data);
    setMasteryScore(updatedMasteryScore);
    setFormData((prevFormData) => ({
      ...prevFormData,
      masteryScore: updatedMasteryScore,
    }));
  };
  const handleTrackingTypesChange = async (selectedTypes: any) => {
    const updatedTrackingTypes: string[] = [selectedTypes];
    const id = downloadId;
    const data = JSON.stringify({ ...formData, trackingTypes: updatedTrackingTypes.join(',') });
    try {
      const result = await createScormConfig(id, data);
      setTrackingTypes((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          isChecked: updatedTrackingTypes.includes(option.value),
        }))
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        trackingTypes: updatedTrackingTypes.join(','),
      }));
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };


  const [lmsApiVersion, setLMSApiVersion] = useState('SCORM 1.2');
  const [dataTransferFrequency, setDataTransferFrequency] = useState('');
  const handleLMSApiVersionChange = async (event: any) => {
    const updatedLMSApiVersion = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, lmsApiVersion: updatedLMSApiVersion });
    const result = await createScormConfig(id, data);
    setLMSApiVersion(updatedLMSApiVersion);
    setFormData((prevFormData) => ({
      ...prevFormData,
      lmsApiVersion: updatedLMSApiVersion,
    }));
  };
  const handleDataTransferFrequencyChange = async (nextValue: any) => {
    const updatedDataTransferFrequency = nextValue;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, dataTransferFrequency: updatedDataTransferFrequency });
    const result = await createScormConfig(id, data);
    setDataTransferFrequency(nextValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      dataTransferFrequency: nextValue,
    }));
  };

  const [launchBehavior, setLaunchBehavior] = useState('rawScore');
  const [navigation, setNavigation] = useState('sequential');
  const [bookmarking, setBookmarking] = useState('alwaysResume');
  const handleLaunchBehaviorChange = async (event: any) => {
    const updatedLaunchBehavior = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, launchBehavior: updatedLaunchBehavior });
    const result = await createScormConfig(id, data);
    setLaunchBehavior(updatedLaunchBehavior);
    setFormData((prevFormData) => ({
      ...prevFormData,
      launchBehavior: updatedLaunchBehavior,
    }));
  };
  const handleNavigationChange = async (event: any) => {
    const updatedNavigation = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, navigation: updatedNavigation });
    const result = await createScormConfig(id, data);
    setNavigation(updatedNavigation);
    setFormData((prevFormData) => ({
      ...prevFormData,
      navigation: updatedNavigation,
    }));
  };
  const handleBookmarkingChange = async (event: any) => {
    const updatedBookmarking = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, bookmarking: updatedBookmarking });
    const result = await createScormConfig(id, data);
    setBookmarking(updatedBookmarking);
    setFormData((prevFormData) => ({
      ...prevFormData,
      bookmarking: updatedBookmarking,
    }));
  };

  const [reportLocation, setReportLocation] = useState('lmsDatabase');
  const [reportFormat, setReportFormat] = useState('');
  const handleReportLocationChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedReportLocation = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, reportLocation: updatedReportLocation });
    const result = await createScormConfig(id, data);
    setReportLocation(updatedReportLocation);
    setFormData((prevFormData) => ({
      ...prevFormData,
      reportLocation: updatedReportLocation,
    }));
  };
  const handleReportFormatChange = async (nextValue: string) => {
    const updatedReportFormat = nextValue;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, reportFormat: updatedReportFormat });
    const result = await createScormConfig(id, data);
    setReportFormat(updatedReportFormat);
    setFormData((prevFormData) => ({
      ...prevFormData,
      reportFormat: updatedReportFormat,
    }));
  };

  const [debuggingMode, setDebuggingMode] = useState('enable');
  const [sequencingRules, setSequencingRules] = useState('automatic');
  const handleDebuggingModeChange = async (event: any) => {
    const updatedDebuggingMode = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, debuggingMode: updatedDebuggingMode });
    const result = await createScormConfig(id, data);
    setDebuggingMode(updatedDebuggingMode);
    setFormData((prevFormData) => ({
      ...prevFormData,
      debuggingMode: updatedDebuggingMode,
    }));
  };
  const handleSequencingRulesChange = async (event: any) => {
    const updatedSequencingRules = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, sequencingRules: updatedSequencingRules });
    const result = await createScormConfig(id, data);
    setSequencingRules(updatedSequencingRules);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sequencingRules: updatedSequencingRules,
    }));
  };

  const [checkCustomMetadata, setCheckCustomMetadata] = useState(false);
  const [checkCustomJsHooks, setCheckCustomJsHooks] = useState(false);
  const [customMetadata, setCustomMetadata] = useState('');
  const [preLaunchScript, setPreLaunchScript] = useState('');
  const [postLaunchScript, setPostLaunchScript] = useState('');
  const handleCheckCustomMetadataChange = async (event: any) => {
    const updatedCheckCustomMetadata = event.target.checked;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, checkCustomMetadata: updatedCheckCustomMetadata });
    const result = await createScormConfig(id, data);
    setCheckCustomMetadata(updatedCheckCustomMetadata);
    setFormData((prevFormData) => ({
      ...prevFormData,
      checkCustomMetadata: updatedCheckCustomMetadata,
    }));
  };
  const handleCheckCustomJsHooksChange = async (event: any) => {
    const updatedCheckCustomJsHooks = event.target.checked;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, checkCustomJsHooks: updatedCheckCustomJsHooks });
    const result = await createScormConfig(id, data);
    setCheckCustomJsHooks(updatedCheckCustomJsHooks);
    setFormData((prevFormData) => ({
      ...prevFormData,
      checkCustomJsHooks: updatedCheckCustomJsHooks,
    }));
  };
  const handleCustomMetadataChange = async (event: any) => {
    const updatedCustomMetadata = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, customMetadata: updatedCustomMetadata });
    const result = await createScormConfig(id, data);
    setCustomMetadata(updatedCustomMetadata);
    setFormData((prevFormData) => ({
      ...prevFormData,
      customMetadata: updatedCustomMetadata,
    }));
  };
  const handlePreLaunchScriptChange = async (event: any) => {
    const updatedPreLaunchScript = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, preLaunchScript: updatedPreLaunchScript });
    const result = await createScormConfig(id, data);
    setPreLaunchScript(updatedPreLaunchScript);
    setFormData((prevFormData) => ({
      ...prevFormData,
      preLaunchScript: updatedPreLaunchScript,
    }));
  };
  const handlePostLaunchScriptChange = async (event: any) => {
    const updatedPostLaunchScript = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, postLaunchScript: updatedPostLaunchScript });
    const result = await createScormConfig(id, data);
    setPostLaunchScript(updatedPostLaunchScript);
    setFormData((prevFormData) => ({
      ...prevFormData,
      postLaunchScript: updatedPostLaunchScript,
    }));
  };

  const [checkAlternateContent, setCheckAlternateContent] = useState(false);
  const [alternateContent, setAlternateContent] = useState('');
  const [textToSpeech, setTextToSpeech] = useState('enable');
  const handleCheckAlternateContentChange = async (event: any) => {
    const updatedCheckAlternateContent = event.target.checked;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, checkAlternateContent: updatedCheckAlternateContent });
    const result = await createScormConfig(id, data);

    setCheckAlternateContent(updatedCheckAlternateContent);
    setFormData((prevFormData) => ({
      ...prevFormData,
      checkAlternateContent: updatedCheckAlternateContent,
    }));
  };

  const handleAlternateContentChange = async (event: any) => {
    const updatedAlternateContent = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, alternateContent: updatedAlternateContent });
    const result = await createScormConfig(id, data);

    setAlternateContent(updatedAlternateContent);
    setFormData((prevFormData) => ({
      ...prevFormData,
      alternateContent: updatedAlternateContent,
    }));
  };

  const handleTextToSpeechChange = async (event: any) => {
    const updatedTextToSpeech = event.target.value;
    const id = downloadId;
    const data = JSON.stringify({ ...formData, textToSpeech: updatedTextToSpeech });
    const result = await createScormConfig(id, data);

    setTextToSpeech(updatedTextToSpeech);
    setFormData((prevFormData) => ({
      ...prevFormData,
      textToSpeech: updatedTextToSpeech,
    }));
  };

  const [language, setLanguage] = useState('');
  const handleLanguageChange = async (event: any) => {
    const updatedLanguage = event.target.value;
    setLanguage(updatedLanguage);

    const id = downloadId;
    const updatedFormData = { ...formData, language: updatedLanguage };
    const data = JSON.stringify(updatedFormData);

    const result = await createScormConfig(id, data);
  };


  const [encryption, setEncryption] = useState('enable');
  const handleEncryptionChange = async (event: any) => {
    const updatedEncryption = event.target.value;
    setEncryption(updatedEncryption);

    const id = downloadId;
    const updatedFormData = { ...formData, encryption: updatedEncryption };
    const data = JSON.stringify(updatedFormData);

    const result = await createScormConfig(id, data);
  };


  const [scormPackageVersion, setScormPackageVersion] = useState('');
  const handleScormPackageVersionChange = async (event: any) => {
    const updatedScormPackageVersion = event.target.value;
    setScormPackageVersion(updatedScormPackageVersion);

    const id = downloadId;
    const updatedFormData = { ...formData, scormPackageVersion: updatedScormPackageVersion };
    const data = JSON.stringify(updatedFormData);

    const result = await createScormConfig(id, data);
  };


  const initialFormData = {
    scormEdition: 'SCORM 1.2',
    completionStatus: '',
    scoringMethod: 'rawScore',
    masteryScore: '',
    trackingTypes: '',
    lmsApiVersion: 'SCORM 1.2',
    dataTransferFrequency: '',
    launchBehavior: 'newWindow',
    navigation: 'sequential',
    bookmarking: 'alwaysResume',
    reportLocation: 'lmsDatabase',
    reportFormat: '',
    debuggingMode: 'enable',
    sequencingRules: 'automatic',
    checkCustomMetadata: false,
    customMetadata: '',
    checkCustomJsHooks: false,
    preLaunchScript: '',
    postLaunchScript: '',
    checkAlternateContent: false,
    alternateContent: '',
    textToSpeech: 'enable',
    language: 'english',
    encryption: 'enable',
    scormPackageVersion: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const id = downloadId;
      const data = JSON.stringify(formData);
      const response = await generateScorm(id, data);

      const blob = await response.blob();
      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = 'your-scorm-package.zip';
      downloadLink.click();
    } catch (error: any) {
      console.error('Error generating or downloading SCORM package:', error);

      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        console.error('error', error.response)
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
      } else {
        console.error('Error details:', error.message);
      }
    }
    onCloseDownloadDialog();
  };

  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');



  return (
    <>
      <Box className='Game' position={'relative'}>
        <div ref={containerRef} style={{  }}>
        <Box mb={{ base: '100px', md: '100px', xl: '100px' }} className='box'></Box>
        <Card backgroundImage={NFTBanner} backgroundRepeat={'no-repeat'} backgroundSize={'cover'} justifyContent={'center'} height={{sm: 'auto', md: 'auto', lg: '180px'}} width={'100%'} overflow={{ sm: 'auto', xl: 'unset' }}>
          <Box display={{ base: 'block', xl: 'flex' }} justifyContent="space-between" alignItems={'center'}>
            <Box display={'flex'} flexDirection={'column'} >
              <Text fontSize={'1.8rem'} fontWeight={700} color={'#fff'} pb={{sm: '10px', md: '0'}} display={'flex'} alignItems={'center'} >Your Creations<Img src={Rocket} height={'50px'} width={'50px'} ml={'20px'} transform={'rotate(40deg)'} /></Text>
              <Text fontSize={'15px'} color={'#fff'} letterSpacing={{sm: '.4px',md: '1px' }}>Developing games that ignite curiosity, turning every challenge into a lesson.</Text>
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'start'} mt={{base: '15px',sm: '15px', lg: '0'}}>
              <Button                
                padding={5}
                bg="#fff"
                color="#2b2b2b"
                // w={150}
                onClick={handleCourse}
              >
                Create Game
              </Button>
            </Box>
            {/* <Button mt='10px' mb='15px' padding={2} background='#3311db' color='#fff' w={70} onClick={handleNavigate}>New</Button> */}
          </Box>

        </Card>
        <Card m={'30px 0'}>
          <Flex gridArea='1 / 1 / 2 / 2' display={{ base: 'block', md:'flex', lg: 'flex' }}>
            <Tabs variant='soft-rounded' colorScheme='brandTabs'>
              <TabList overflowX={{ base: 'auto', sm: 'unset' }}>
                <Flex width={'100%'} justifyContent={{base: 'space-between', sm: 'space-between'}}>
                  <Tab                                   
                    p={'0.5rem 0 0 0'}
                    flexDirection='column'
                    onClick={function () {
                      setTabState('Creation');
                    }}
                    me={{base: '10px', sm: '10px', md: '30px'}}
                    bg='unset'
                    _selected={{
                      bg: 'none'
                    }}
                    _focus={{ border: 'none' }}
                    minW='max-content'>
                    <Flex align='center'>
                      <Text color={textColor} display={'flex'} alignItems={'center'} fontSize={{base: '14px', sm: '14px', md: '18px'}} fontWeight='500' me={{base: '7px', sm: '7px', md: '12px'}}>
                        <Icon as={RiDraftLine} fontSize={'17px'} mr={{base: 1, sm: 1, md: 2}} color={textColor} /> Draft
                      </Text>
                      <Text color='secondaryGray.600' fontSize={{base: '13px', sm: '13px', md: '17px'}} fontWeight='400'>
                        {showcount.draftCount}
                      </Text>
                    </Flex>
                    <Box
                      height='4px'
                      w='100%'
                      transition='0.1s linear'
                      bg={tabState === 'Creation' ? 'brand.500' : 'transparent'}
                      mt='15px'
                      borderRadius='30px'
                    />
                  </Tab>
                  <Tab
                    onClick={function () {
                      setTabState('Review');
                    }}
                    p={'0.5rem 0 0 0'}
                    me={{base: '10px', sm: '10px', md: '30px'}}
                    bg='unset'
                    _selected={{
                      bg: 'none'
                    }}
                    _focus={{ border: 'none' }}
                    minW='max-content'
                    flexDirection='column'>
                    <Flex align='center'>
                      <Text color={textColor} display={'flex'} alignItems={'center'} fontSize={{base: '14px', sm: '14px', md: '18px'}} fontWeight='500'  me={{base: '7px', sm: '7px', md: '12px'}}>
                        <Icon as={MdOutlineRocketLaunch} fontSize={'17px'} mr={{base: 1, sm: 1, md: 2}} color={textColor} /> Launched
                      </Text>
                      <Text color='secondaryGray.600' fontSize={{base: '13px', sm: '13px', md: '17px'}} fontWeight='400'>
                        {showcount.internalCount}
                      </Text>
                    </Flex>
                    <Box
                      height='4px'
                      w='100%'
                      transition='0.1s linear'
                      bg={tabState === 'Review' ? 'brand.500' : 'transparent'}
                      mt='15px'
                      borderRadius='30px'
                    />
                  </Tab>
                  <Tab
                    p={'0.5rem 0 0 0'}                    
                    flexDirection='column'
                    onClick={function () {
                      setTabState('Launched');
                    }}
                    bg='unset'
                    _selected={{
                      bg: 'none'
                    }}
                    _focus={{ border: 'none' }}
                    minW='max-content'>
                    <Flex align='center'>
                      <Text color={textColor} display={'flex'} alignItems={'center'} fontSize={{base: '14px', sm: '14px', md: '18px'}} fontWeight='500'  me={{base: '7px', sm: '7px', md: '12px'}}>
                        <Icon as={MdOutlinePublic} fontSize={'17px'} mr={{base: 1, sm: 1, md: 2}} color={textColor} /> Public
                      </Text>
                      <Text color='secondaryGray.600' fontSize={{base: '13px', sm: '13px', md: '17px'}} fontWeight='400'>
                        {showcount.publicCount}
                      </Text>
                    </Flex>
                    <Box
                      height='4px'
                      w='100%'
                      transition='0.1s linear'
                      bg={tabState === 'Launched' ? 'brand.500' : 'transparent'}
                      mt='15px'
                      borderRadius='30px'
                    />
                  </Tab>
                </Flex>
              </TabList>
            </Tabs>
            <InputGroup w={{ base: '100%', md: '300px' }} mt={{base: '15px', sm: '15px', md: '0'}} ml="auto" alignItems={'center'}>
              <InputLeftElement
                top={'inherit'}
                children={
                  <IconButton
                    aria-label="search"
                    bg="inherit"
                    borderRadius="inherit"
                    _active={{
                      bg: 'inherit',
                      transform: 'none',
                      borderColor: 'transparent',
                    }}
                    _hover={{
                      background: 'none',
                    }}
                    _focus={{
                      background: 'none',
                      boxShadow: 'none',
                    }}
                    icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
                  />
                }
              />
              <Input
                type="text"
                placeholder="Search..."
                value={fil || ''}
                onChange={(e) => setFil(e.target.value)}
                bg={'#f9f9f9'}
                borderRadius={'14px'}
                w={{ base: '200px', sm: '100%', md: '300px', xl: '300px' }}
              />
              {fil && (
                <InputRightElement
                  children={
                    <IconButton
                      aria-label="clear"
                      bg="inherit"
                      borderRadius="inherit"
                      _active={{
                        bg: 'inherit',
                        transform: 'none',
                        borderColor: 'transparent',
                      }}
                      _hover={{
                        background: 'none',
                      }}
                      _focus={{
                        background: 'none',
                        boxShadow: 'none',
                      }}
                      icon={<CloseIcon color="gray.500" w="10px" h="10px" />}
                      onClick={() => setFil('')} // Clear the input field
                    />
                  }
                />
              )}
            </InputGroup>
          </Flex>
        </Card>
        <Grid
          mb='20px'
          gridTemplateColumns={{ xl: 'repeat(4, 1fr)', '1xl': '1fr 0.46fr' }}
          gap={{ base: '20px', xl: '20px' }}
          display={{ base: 'block', xl: 'grid' }}
          mt={'10px'}
        >
          <SimpleGrid columns={{ base: 1, md: 3 }} gap='40px'>
          {loadingdata && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
          <HashLoader color="#3b38e0" />
        </div>
      )}
            {gamelist &&
              gamelist
                .filter((item) => {
                  const lowerCaseFilter = fil?.toLowerCase();
                  const lowerCaseGameTitle = item?.gameTitle?.toLowerCase();

                  // Skip filter if gameTitle is null or empty
                  if (!lowerCaseGameTitle || lowerCaseGameTitle === '') {
                    return true; // Include the item in the result
                  }

                  return lowerCaseGameTitle.includes(lowerCaseFilter);
                })

                .map((game, i) => (
                  // Your map logic here

                  <GameCard
                    name={game.gameTitle}
                    author={game.gameSkills}
                    image={game.gameBackgroundId && game?.image.gasAssetImage}
                    // image={'http://35.183.46.127:5555/uploads/background/29977_1701772077260.jpg'}
                    tabState={tabState}
                    id={game.gameId}
                    game={game}
                    handleButtonOne={handleButtonOne}
                    handleButtonTwo={handleButtonTwo}
                    handelDuplicate={handelDuplicate}
                    handelLaunch={handelLaunch}
                    handelAssign={handelAssign}
                    handelMakePublic={handelMakePublic}
                    handelDelete={handelDelete}
                    handleDownload={handleDownload}
                  />
                ))}
          </SimpleGrid>
        </Grid>
        {openCourse ? <AddCourse setOpenCourse={setOpenCourse} /> : null}
        </div>
      </Box>
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={msgtwo} setmsg={setMsgtwo} /> : null}
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert}
      /> : null}
      {openLearner ? <LeanerList setOpenLearner={setOpenLearner} assignGameId={assignGameId} setMsg={setMsg} setToastStatus={setToastStatus} setAlert={setAlert} /> : null}
      {/* <TexttoVoice />   */}
      <AlertDialog isOpen={isDownloadDialogOpen} onClose={onCloseDownloadDialog} leastDestructiveRef={leastDestructiveRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader display="flex" alignItems="center" justifyContent="space-between" fontSize='2xl' fontWeight='bold' color={textColorPrimary} >
              Downloading Content
              <IconButton
                aria-label="clear"
                bg="inherit"
                borderRadius="inherit"
                _active={{
                  bg: 'inherit',
                  transform: 'none',
                  borderColor: 'transparent',
                }}
                _hover={{
                  background: 'none',
                }}
                _focus={{
                  background: 'none',
                  boxShadow: 'none',
                }}
                icon={<CloseIcon color="gray.500" w="10px" h="10px" />}
                onClick={onCloseDownloadDialog}
              />
            </AlertDialogHeader>
            <AlertDialogBody>
              <form onSubmit={handleFormSubmit}>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>SCORM Edition</FormLabel>
                  <Select value={formData?.scormEdition} onChange={handleScormEditionChange}>
                    <option value="SCORM 1.2">SCORM 1.2</option>
                    <option value="SCORM 2004 (2nd Edition)">SCORM 2004 (2nd Edition)</option>
                    <option value="SCORM 2004 (3rd Edition)">SCORM 2004 (3rd Edition)</option>
                    <option value="SCORM 2004 (4th Edition)">SCORM 2004 (4th Edition)</option>
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Tracking Metrics</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>Completion Status</FormLabel>
                    <CheckboxGroup >
                      {completionStatus.map((option: any) => {
                        return (

                          <label>
                            <input type='checkbox' value={option.value} checked={option.isChecked} onChange={(e) => handleCompletionStatusChange(e, option.value)} />
                            {'  '} {option.value}
                          </label>
                        )
                      })}
                    </CheckboxGroup>
                    <FormLabel fontSize='sm'>Scoring Method</FormLabel>
                    <Select value={formData?.scoringMethod} onChange={handleScoringMethodChange} >
                      <option value="rawScore">Raw score</option>
                      <option value="minimumScore">Minimum score</option>
                      <option value="maximumScore">Maximum score</option>
                      <option value="scaledScore">Scaled score</option>
                    </Select>
                    <FormLabel fontSize='sm'>Mastery Score</FormLabel>
                    <NumberInput value={formData?.masteryScore || ''} onChange={handleMasteryScoreChange} precision={2} step={1} min={0} max={100}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormLabel fontSize='sm'>Tracking Types</FormLabel>
                    <CheckboxGroup onChange={handleTrackingTypesChange} >
                      {trackingTypes.map((option: any) => (
                        <Checkbox
                          key={option.value}
                          value={option.value}
                          isChecked={option.isChecked}
                        >
                          {option.label}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>LMS Communication</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>LMS API Version</FormLabel>
                    <Select value={formData?.lmsApiVersion} onChange={handleLMSApiVersionChange} >
                      <option value="SCORM 1.2">SCORM 1.2</option>
                      <option value="SCORM 2004">SCORM 2004</option>
                    </Select>
                    <FormLabel fontSize='sm'>Data Transfer Frequency</FormLabel>
                    <RadioGroup value={formData?.dataTransferFrequency} onChange={handleDataTransferFrequencyChange} >
                      <Stack direction="row">
                        <Radio value="realTime">Real-time</Radio>
                        <Radio value="sessionEnd">Session end</Radio>
                        <Radio value="customIntervals">Custom intervals</Radio>
                      </Stack>
                    </RadioGroup>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Content Packaging</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>Launch Behavior</FormLabel>
                    <Select value={formData?.launchBehavior} onChange={handleLaunchBehaviorChange} >
                      <option value="newWindow">In a new window</option>
                      <option value="sameWindow">In the same window</option>
                    </Select>
                    <FormLabel fontSize='sm'>Navigation</FormLabel>
                    <Select value={formData?.navigation} onChange={handleNavigationChange} >
                      <option value="sequential">Sequential</option>
                      <option value="free">Free</option>
                      <option value="restricted">Restricted</option>
                    </Select>
                    <FormLabel fontSize='sm'>Bookmarking</FormLabel>
                    <Select value={formData?.bookmarking} onChange={handleBookmarkingChange} >
                      <option value="alwaysResume">Always resume</option>
                      <option value="neverResume">Never resume</option>
                      <option value="promptToResume">Prompt to resume</option>
                    </Select>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Reporting Options</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>Report Location</FormLabel>
                    <Select value={formData?.reportLocation} onChange={handleReportLocationChange}>
                      <option value="lmsDatabase">LMS database</option>
                      <option value="externalServer">External server</option>
                    </Select>
                    <FormLabel fontSize='sm'>Report Format</FormLabel>
                    <RadioGroup value={formData?.reportFormat} onChange={handleReportFormatChange}>
                      <Stack direction="row">
                        <Radio value="xml">XML</Radio>
                        <Radio value="json">JSON</Radio>
                        <Radio value="csv">CSV</Radio>
                      </Stack>
                    </RadioGroup>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Advanced Options</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>Debugging Mode</FormLabel>
                    <Select value={formData?.debuggingMode} onChange={handleDebuggingModeChange} >
                      <option value="Enable">Enable</option>
                      <option value="Disable">Disable</option>
                    </Select>
                    <FormLabel fontSize='sm'>Sequencing Rules</FormLabel>
                    <Select value={formData?.sequencingRules} onChange={handleSequencingRulesChange} >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </Select>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Customization</FormLabel>
                  <Stack spacing={4}>
                    <Checkbox isChecked={formData?.checkCustomMetadata} onChange={handleCheckCustomMetadataChange} >
                      Include Custom Metadata
                    </Checkbox>
                    <FormControl>
                      <FormLabel fontSize='sm'>Custom Metadata Fields</FormLabel>
                      <Textarea value={formData?.customMetadata} onChange={handleCustomMetadataChange} />
                    </FormControl>
                    <Checkbox isChecked={formData?.checkCustomJsHooks} onChange={handleCheckCustomJsHooksChange} >
                      Include Custom JavaScript Hooks
                    </Checkbox>
                    <>
                      <FormControl>
                        <FormLabel fontSize='sm'>Pre-launch Script</FormLabel>
                        <Textarea value={formData?.preLaunchScript} onChange={handlePreLaunchScriptChange} />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize='sm'>Post-launch Script</FormLabel>
                        <Textarea value={formData?.postLaunchScript} onChange={handlePostLaunchScriptChange} />
                      </FormControl>
                    </>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Accessibility</FormLabel>
                  <Stack spacing={4}>
                    <Checkbox isChecked={formData?.checkAlternateContent} onChange={handleCheckAlternateContentChange} >
                      Include Alternate Content for Users with Disabilities
                    </Checkbox>
                    <FormControl>
                      <FormLabel fontSize='sm'>Alternate Content</FormLabel>
                      <Textarea value={formData?.alternateContent} onChange={handleAlternateContentChange} />
                    </FormControl>
                    <FormLabel fontSize='sm'>Text-to-Speech</FormLabel>
                    <Select value={formData?.textToSpeech} onChange={handleTextToSpeechChange} >
                      <option value="enable">Enable</option>
                      <option value="disable">Disable</option>
                    </Select>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Localization</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>Language</FormLabel>
                    <Select value={language} onChange={handleLanguageChange} >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                    </Select>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Security</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>Encryption</FormLabel>
                    <Select value={encryption} onChange={handleEncryptionChange} >
                      <option value="enable">Enable</option>
                      <option value="disable">Disable</option>
                    </Select>
                  </Stack>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel fontSize='sm' fontWeight='bold'>Versioning</FormLabel>
                  <Stack spacing={4}>
                    <FormLabel fontSize='sm'>SCORM Package Version</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter version number"
                      value={scormPackageVersion}
                      onChange={handleScormPackageVersionChange}
                    />
                  </Stack>
                </FormControl>
                <Button type="submit" ml="auto"
                  variant="darkBrand"
                  color="white"
                  fontSize="sm"
                  fontWeight="500"
                  borderRadius="70px"
                  px="24px"
                  py="5px"
                >Generate SCORM Package</Button>
              </form>
            </AlertDialogBody>
            <AlertDialogFooter>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Game