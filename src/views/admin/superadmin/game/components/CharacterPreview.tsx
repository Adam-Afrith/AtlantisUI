import React, { useRef, useState,useEffect } from 'react';
import {
  Button,
  Box,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Text,
  SimpleGrid,
  useColorModeValue,
  Img, Icon, Spinner
} from '@chakra-ui/react';
import InputField from 'components/fields/InputField';
import Card from 'components/card/Card';
import { getGameStoryLine } from "utils/game/gameService"

import { MdOutlineAdd, MdOutlineCheck } from 'react-icons/md';
import Select from 'react-select';
import { FaVolumeUp, FaPlusCircle, FaSlidersH, FaWindowClose,  FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#e0e0e0' : 'transparent',
    cursor: 'pointer',
    color: 'black',
    zIndex: '101',
    '&:hover': {
      backgroundColor: '#e0e0e0', // Change background color on hover
    },
  }),
};

const customStylesselect = {
  marginRight: '20px',
  position: 'absolute',
  zIndex: 101,
};
const customStylesicon = {
  cursor: 'pointer',
  color: 'grey',
  marginRight: '4px',
};
const customStylesBtn = {
  padding: '0px',
  marginBottom: '0px',
  marginTop: '0px',
  height: '44px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  alignItems: 'center',
  alignContent: 'center',
  display: 'flex',
  justifyContent: 'center',
};

const CharacterPreview: React.FC<{
  id?:any;
  languages?:any;
  players?: any;
  setPreview?: any;
  makeInputFiled?: any;
  onClose?: any;
  values?: any;
  setValues?: any;
  previewId?: any;
  setFormData?: any;
  formData?: any;
  commonNextFunction?: any;
  voices: any;
  show: any,
  prev: any,
}> = ({
  id,
  languages,
  prev,
  players,
  setPreview,
  makeInputFiled,
  onClose,
  values,
  setValues,
  previewId,
  setFormData,
  formData,
  voices,
  commonNextFunction,
  show
}) => {
    const textContent =
      'Game Content means any templates, modules, functions, features, images, audio data, video data, or other content that may be used by a Game Creator when creating a Game.';
    const truncatedText = textContent.slice(0, 80) + '...';

    const selectedPlayer = players.find((player: any) => player.gasId === previewId);

    const handleNonPlayerVoice: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setFormData((prev: any) => ({
        ...prev,
        gameNonPlayerVoice: e.target.value || '',
      }));
    };
    const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const textColorSecondary = 'secondaryGray.600';
    const [iconColor, setIconColor] = useState('grey');
    const handleMouseEnter = () => {
      setIconColor('black');
    };

    const handleMouseLeave = () => {
      setIconColor('grey');
    };
    const handlePlayerMale: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setFormData((prev: any) => ({
        ...prev,
        gamePlayerMaleVoice: e.target.value || '',
      }));
    };

    const handlePlayerFemale: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setFormData((prev: any) => ({
        ...prev,
        gamePlayerFemaleVoice: e.target.value || '',
      }));
    };

    const handleNarrator: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setFormData((prev: any) => ({
        ...prev,
        gameNarratorVoice: e.target.value || '',
      }));
    };

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setFormData((prev: any) => ({
        ...prev,
        gameNonPlayerName: e.target.value || '',
      }));
    };
    const find = show.find((it: any) => (it.gasId === formData.gameBackgroundId));
    const img = find?.gasAssetImage;
    //////////////////////////////////////////////////////////////////////////////
    const [showModal, setShowModal] = useState(false);
    const [chosenModal, setChosenModal] = useState('');
    const [chosenVoiceNPC, setChosenVoiceNPC] = useState('');
    const [chosenVoiceMALE, setChosenVoiceMALE] = useState('');
    const [chosenVoiceFEMALE, setChosenVoiceFEMALE] = useState('');
    const [chosenVoiceNAR, setChosenVoiceNAR] = useState('');
    const handleAddVoice = (character: any) => {
      setChosenModal(character);
      setShowModal(true); // Show the modal when the button is clicked
      
      //alert(chosenModal);
    };
    console.log('showModal',showModal)
    //        const [bgColor, setBgColor] = useState('transparent');
    // const [borderColor, setBorderColor] = useState('1px solid #cacfd8');



    const closeModal = () => {
      setShowModal(false); // Function to close the modal
      setChosenModal('')
    };

    //////////////////////////////////////////////////////////////////////////////////////


    const audioRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [demo, setDemo] = useState(null);
    const handleInputChange = (inputValue: any) => {
      setSearchTerm(inputValue);
    };

    let currentAudio: any = null;
    const playAudio = (audioUrl: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.removeEventListener('ended', resolve);
        }

        const audio = new Audio(audioUrl);

        audio.addEventListener('ended', () => {
          resolve();
        });

        audio.play();
        currentAudio = audio;
      });
    };
    const customFilter = (option: any, rawInput: any) => {
      const inputValue = rawInput.toLowerCase();
      const label = option.label.toLowerCase();

      if (label.includes(inputValue)) {
        return true;
      }
      if (option.data && option.data.subcategories) {
        const subcategoryMatch = option.data.subcategories.some((subcategory: any) =>
          subcategory.toLowerCase().includes(inputValue)
        );
        return subcategoryMatch;
      }
      return false;
    };
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const handleMenuOpen = () => {
      setMenuIsOpen(true);
    };

    const handleMenuClose = () => {
      setMenuIsOpen(false);
    };
    const [menuMaleIsOpen, setMenuMaleIsOpen] = useState(false);

    const handleMaleMenuOpen = () => {
      setMenuMaleIsOpen(true);
    };
    const [nonplayerName, setNonplayerName] = useState<String>();

    const handleMaleMenuClose = () => {
      setMenuMaleIsOpen(false);
    };
    const [menufeMaleIsOpen, setMenufeMaleIsOpen] = useState(false);

    const handlefeMaleMenuOpen = () => {
      setMenufeMaleIsOpen(true);
    };

    const handlefeMaleMenuClose = () => {
      setMenufeMaleIsOpen(false);
    };
    const [menuNarateIsOpen, setMenuNarateIsOpen] = useState(false);

    const handleNarateMenuOpen = () => {
      setMenuNarateIsOpen(true);
    };

    const handleNarateeMenuClose = () => {
      setMenuNarateIsOpen(false);
    };
    const options = voices.map((it: any, ind: number) => {
      const { age, accent, gender, ...remainingLabels } = it.labels;
      const subcategories = Object.values(remainingLabels);
      return {
        label: it.name,
        value: it.voice_id,
        subcategories: subcategories,
        audio: it.preview_url,
        index: ind,
        age: age,
        accent: accent,
        gender: gender,


      };
    });
    //     console.log("options");
    // console.log(options);
    const maleOptions = voices
      .filter((it: any) => it.labels.gender === 'male')
      .map((it: any, ind: number) => {
        const { gender, ...remainingLabels } = it.labels;
        const subcategories = Object.values(remainingLabels);
        return {
          label: it.name,
          value: it.voice_id,
          subcategories: subcategories,
          audio: it.preview_url,
          index: ind,
        };
      });
    const femaleOptions = voices
      .filter((it: any) => it.labels.gender === 'female')
      .map((it: any, ind: number) => {
        const { gender, ...remainingLabels } = it.labels;
        const subcategories = Object.values(remainingLabels);
        return {
          label: it.name,
          value: it.voice_id,
          subcategories: subcategories,
          audio: it.preview_url,
          index: ind,
        };
      });
    const narrationOptions = voices
      .filter((it: any) => it.labels['use case'] === 'narration')
      .map((it: any, ind: number) => {
        const { 'use case': useCase, ...remainingLabels } = it.labels;
        const subcategories = Object.values(remainingLabels);
        return {
          label: it.name,
          value: it.voice_id,
          subcategories: subcategories,
          audio: it.preview_url,
          index: ind,
        };
      });
      // useEffect(() => {
      //   const fetchData = async () => {
      //     try {
      //       // Call getBlockData with both game ID and translation ID
      //       if(languages){
      //         const blockData = await getGameStoryLine(id, languages);
    
      //       console.log("updatedBlockData", blockData.gameStoryLine);
            
      //       setNonplayerName(blockData.gameNonPlayerName)
      //       }
            
      //       // textareaRef.current.value = blockData.content;
      //     } catch (error) {
      //       console.error("getBlockData Error:", error);
      //     }
      //   };
      //   fetchData();
      // }, [languages, id]);

    const handleSelectChange = (selectedOption: any, type: string) => {
      setDemo(selectedOption?.audio)
      if (type === 'NPC') {
        setFormData((prev: any) => ({ ...prev, gameNonPlayerVoice: selectedOption.value }));
        setShowModal(false); // Function to close the modal
        setChosenModal('')
        setChosenVoiceNPC(selectedOption.label)
      }
      else if (type === 'MALE') {
        setFormData((prev: any) => ({ ...prev, gamePlayerMaleVoice: selectedOption.value }));
        setShowModal(false); // Function to close the modal
        setChosenModal('')
        setChosenVoiceMALE(selectedOption.label)
      }
      else if (type === 'FEMALE') {
        setFormData((prev: any) => ({ ...prev, gamePlayerFemaleVoice: selectedOption.value }));
        setShowModal(false); // Function to close the modal
        setChosenModal('')
        setChosenVoiceFEMALE(selectedOption.label)
      }
      else {
        if (type === 'NARRATOR') {
          setFormData((prev: any) => ({ ...prev, gameNarratorVoice: selectedOption.value }));
          setShowModal(false); // Function to close the modal
          setChosenModal('')
          setChosenVoiceNAR(selectedOption.label)
        }
      }
    };
    const [selectedVoice, setSelectedVoice] = useState(null); // To keep track of the selected voice
    const [isPlaying, setIsPlaying] = useState(false);
    const handleClick = async (e: any, data: any) => {
      // e.stopPropagation();
      // setGlobalClickedIndex(data.index);
      setIsPlaying(true);
      setSelectedVoice(data);
      console.log(isPlaying);
      console.log(selectedVoice);
      // playAudio(data.audio).then(() => setIsPlaying(false));
      try {
        await playAudio(data.audio);
        setIsPlaying(false);
      } catch (error) {
        console.error("Error playing audio: ", error);
        setIsPlaying(false); // Ensure isPlaying is set to false in case of an error
      }
    }
    const colors = ['#e0e7ff', '#f3e8ff'];


    const [selectedFilters, setSelectedFilters] = useState([]); // To keep track of selected filters

    // const [mid,setMid] = useState(data);
    const uniqueSubcategories = [...new Set(options.map((voice: any) => voice.subcategories[1]))];
    const uniquegender = [...new Set(options.map((voice: any) => voice.gender))];
    const uniqueaccent = [...new Set(options.map((voice: any) => voice.accent))];
    const uniqueage = [...new Set(options.map((voice: any) => voice.age))];
    console.log(uniqueSubcategories);
    const handleFilterClick = (subcategory: any) => {
      // Check if the subcategory is already selected
      const isSubcategorySelected = selectedFilters.includes(subcategory);
      //alert(subcategory);
      // If selected, remove it from the filters; otherwise, add it
      const updatedFilters = isSubcategorySelected
        ? selectedFilters.filter((filter) => filter !== subcategory)
        : [...selectedFilters, subcategory];

      // Update the selectedFilters state with the updated array
      setSelectedFilters(updatedFilters);
      console.log("UpdatedFilter");
      console.log(updatedFilters);
    };
    const filteredSubcategories = uniqueSubcategories.filter((subcategory) => subcategory !== undefined);
    console.log(filteredSubcategories);
    const filteredgender = uniquegender.filter((subcategory) => subcategory !== undefined);
    const filteredaccent = uniqueaccent.filter((subcategory) => subcategory !== undefined);
    const filteredage = uniqueage.filter((subcategory) => subcategory !== undefined);
    const [genderOptions, setGenderOptions] = useState(filteredgender.map(option => ({ label: option, value: option })));
    const [accentOptions, setAccentOptions] = useState(filteredaccent.map(option => ({ label: option, value: option })));

    const [ageOptions, setAgeOptions] = useState(filteredage.map(option => ({ label: option, value: option })));

    const [searchText, setSearchText] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedAccent, setSelectedAccent] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [isHighlighted, setIsHighlighted] = useState(false);

    const handleInputFocus = () => {
      setIsHighlighted(true);
      setBorderHighlighted(false);
    };

    const handleInputBlur = () => {
      setIsHighlighted(false);
      setBorderHighlighted(false);
    };
    // const narrationOptions = voices
    //       .filter((it: any) => it.labels['use case'] === 'narration')
    //       .map((it: any, ind: number) => {
    //         const { 'use case': useCase, ...remainingLabels } = it.labels;
    //         const subcategories = Object.values(remainingLabels);
    //         return {
    //           label: it.name,
    //           value: it.voice_id,
    //           subcategories: subcategories,
    //           audio: it.preview_url,
    //           index: ind,
    //         };
    //       });
    // console.log("selectedFilters");
    // console.log(selectedFilters);
    // Filtering logic based on search text, gender, accent, and age
    var filteredVoices = options.filter((voice: any) => {
      // Filter based on description search
      // console.log(searchText.toLowerCase());
      const matchesDescription = voice.label.toLowerCase().includes(searchText.toLowerCase());
      // alert(matchesDescription);
      // Filter based on gender
      const matchesGender = selectedGender === '' || voice.gender === selectedGender;

      // Filter based on accent
      const matchesAccent = selectedAccent === '' || voice.accent === selectedAccent;
      // const matchesSubcategories =
      //       selectedFilters.length === 0 || selectedFilters.every(filter => voice.subcategories.includes(filter));

      const matchesSubcategories = selectedFilters.length === 0 || voice.subcategories.some((subcategorySet: any) =>
        selectedFilters.some(filter => subcategorySet.includes(filter)));

      // Filter based on age
      const matchesAge = selectedAge === '' || voice.age === selectedAge;

      // Return true only if all criteria match
      // return matchesDescription || matchesGender || matchesAccent || matchesAge || matchesSubcategories;
      return matchesDescription && matchesSubcategories && (matchesGender && matchesAccent && matchesAge);
    });

    const filterByVoiceId = (voiceIdToFilter: any) => {
      const filteredVoices = options.filter((voice: any) => voice.value === voiceIdToFilter);
      // Replace 'voice_2' with the desired voiceId
      let lbl;
      // Output the label(s) from the filtered result
      filteredVoices.forEach((voice: any) => {
        lbl = voice.label; // Prints the label(s) of the filtered voice(s)
      });
      return lbl;
    };
    const [bgColors, setBgColors] = useState<string[]>(Array(filteredVoices.length).fill('transparent'));

    const [borderColors, setBorderColors] = useState<string[]>(Array(filteredVoices.length).fill('1px solid #cacfd8'));

    const handleMouseEnter2 = (currentIndex: number) => {
      const updatedBorderColors = [...borderColors];
      updatedBorderColors[currentIndex] = '2px solid #11047a';
      setBorderColors(updatedBorderColors);
      const updatedBgColors = [...bgColors];
      updatedBgColors[currentIndex] = boxBg;
      setBgColors(updatedBgColors);
    };

    const handleMouseLeave2 = (currentIndex: number) => {
      const updatedBorderColors = [...borderColors];
      updatedBorderColors[currentIndex] = 'transparent';
      setBorderColors(updatedBorderColors);
      const updatedBgColors = [...bgColors];
      updatedBgColors[currentIndex] = 'transparent';
      setBgColors(updatedBorderColors);
    };

    const [isSecondGridVisible, setIsSecondGridVisible] = useState(false);
    const [isBorderHighlighted, setBorderHighlighted] = useState(false);
    const toggleSecondGrid = () => {
      setIsSecondGridVisible(!isSecondGridVisible);
      setBorderHighlighted(true);
    };
    // Event handlers for dropdown changes
    const handleGenderChange = (selectedOption: any) => {
      setSelectedGender(selectedOption.value);
    };

    const handleAccentChange = (selectedOption: any) => {
      setSelectedAccent(selectedOption.value);
    };

    const handleAgeChange = (selectedOption: any) => {
      setSelectedAge(selectedOption.value);
    };

    // Event handler for search input change
    const handleSearchInputChange = (e: any) => {
      setSearchText(e.target.value);
    };
    // Event handler for clearing filters
    const handleClearFilters = () => {
      setSearchText('');
      setSelectedGender('');
      setSelectedAccent('');
      setSelectedAge('');
      setSelectedFilters([]);
      filteredVoices = voices.map((it: any, ind: number) => {
        const { age, accent, gender, ...remainingLabels } = it.labels;
        const subcategories = Object.values(remainingLabels);
        return {
          label: it.name,
          value: it.voice_id,
          subcategories: subcategories,
          audio: it.preview_url,
          index: ind,
          age: age,
          accent: accent,
          gender: gender,


        };
      });

    };
    //////////////////////////////////////////////////////////////////////////////////////
    const [showLeftButton, setShowLeftButton] = useState(false);
  
    const [showcount, setShowcount] = useState<any>('');

  const handleLeft = () => {
    
    const container = document.getElementById('scroll');
    if (container) {
        container.scrollLeft -= 200;
        
        
        if(container.scrollLeft <= 0 ){
          setShowLeftButton(false);
        }
        
      }
  };

  const handleRight = () => {
    const container = document.getElementById('scroll');
    
    if (container) {
      container.scrollLeft += 200;
      setShowcount(container.scrollLeft+300)
      if(container.scrollLeft > 0){
        setShowLeftButton(true);
      }
      
    }
  };
  const capitalizeFirstLetter = (e:any) => {
  
    return e ? e.charAt(0).toUpperCase() + e.slice(1) : '';
    
  };
    return (
      <>
        <Modal isOpen={setPreview} onClose={setPreview} size="full"  >
          <ModalOverlay />
          <ModalContent position="fixed" overflowY="auto" m={0} className={'model_class'}  containerProps={{ zIndex: 999999}} >
            {/* <ModalHeader>Preview</ModalHeader>
            <ModalCloseButton /> */}
            <ModalBody p={'0 20px'} >
              {/* {formData.gameNonPlayingCharacterId === previewId ? ( */}
              <Flex
                flexDirection={{base: "column", sm: "column", md: "column", lg: 'column'}}
                justifyContent={{base: "start", sm: "start", md: "start", lg: 'start'}}
                alignItems={{base: "center", sm: "center", md: "center", lg: 'start'}}
                height="80vh"
                padding={'20px 0'}
                // overflow={'auto'}
                background="#ffffff"
              >
                <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                  <ModalCloseButton position={'relative'} top={0} /> 
                </Box>
                <Box display={'flex'} w={'100%'} flexDir={{base: 'column', sm: 'column', md: 'column', lg: 'row'}}>
                {formData.gameNonPlayingCharacterId !== previewId ? (

                  <Card w={{base: '100%', sm: '100%', md: '100%', lg: '70%'}} mb={{base: '0px',sm: '0px', lg: '20px'}} h={{base: "40vh", sm: "40vh", md: "40vh", lg: '90vh'}} backgroundImage={img} backgroundSize={'cover'} backgroundPosition={'center'} backgroundRepeat={'no-repeat'} alignItems={'end'} justifyContent={'flex-end'}>
                    <Img src={selectedPlayer?.gasAssetImage} width={'100px'} height={'120px'} />
                  </Card>
                ) : (
                  prev ?
                    <Card w={{base: '100%', sm: '100%', md: '100%', lg: '70%'}} mb={{base: '0px',sm: '0px', lg: '20px'}} h={{base: "40vh", sm: "40vh", md: "40vh", lg: '90vh'}} backgroundImage={img} backgroundSize={'cover'} backgroundPosition={'center'} backgroundRepeat={'no-repeat'} alignItems={'end'} justifyContent={'flex-end'}>
                      <Img src={selectedPlayer?.gasAssetImage} width={'100px'} height={'120px'} />
                    </Card>
                    :
                    <Box flex="1" p={4} w={'80%'}>
                      <Image src={selectedPlayer?.gasAssetImage} alt="Your Image" maxH="675px" mb="4" />
                    </Box>
                )}
                {formData.gameNonPlayingCharacterId !== previewId ? (
                  // <Box w={{base: '100%', sm: '100%', md: '100%', lg: '30%'}} m={{base: '20px 0 0 0', sm: '20px 0 0 0', lg: '0 20px'}} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Card flex="1" w={{base: '100%', sm: '100%', md: '100%', lg: '30%'}} h={'max-content'} m={{base: '20px 0 20px 0', sm: '20px 0 20px 0', lg: '0 0 20px 20px'}} p={4} boxShadow={'5px 5px 20px #c5c5c5'}>
                    <Flex direction='column' mb='20px' mt="0px">
                      <Text fontSize={"1.25rem"} color={'#1B2559'} fontWeight={'700'}>
                      Non Playing Character 
                      </Text>
                      <Text fontSize={"1rem"}  style={{ whiteSpace: 'pre-wrap' }} >
                      {selectedPlayer?.gasAssetName ? capitalizeFirstLetter(selectedPlayer.gasAssetName) : ''}
                      </Text>
                        
                      </Flex> <Button
                        bg="#3311db"
                        _hover={{ bg: '#3311db' }}
                        color="#fff"
                        w="100%"
                        onClick={() => makeInputFiled(previewId, selectedPlayer?.gasAssetName)}
                      >
                        Select
                      </Button>
                    </Card>
                  // </Box>
                  ) : (
                  // <Box w={{base: '100%', sm: '100%', md: '100%', lg: '30%'}} m={{base: '20px 0 0 0', sm: '20px 0 0 0', lg: '0 20px'}} display={'flex'} justifyContent={'center'} alignItems={'center'} mb={"0px"}>
                    <Card flex="1" w={{base: '100%', sm: '100%', md: '100%', lg: '30%'}} h={'max-content'} m={{base: '20px 0 20px 0', sm: '20px 0 20px 0', lg: '0 0 20px 20px'}} p={4} boxShadow={'5px 5px 20px #c5c5c5'}>
                      <Flex direction='column' mb='20px' mt="0px">
                        <Text fontSize='xl' ml="1px" color={textColorPrimary} fontWeight='bold'>
                          Edit Name
                        </Text>
                        <Text ml="1px" fontSize='md' color={textColorSecondary}>
                        The voices selected for the characters will play only after the game has been created entirely.
                        </Text>
                      </Flex>
                      <FormControl mb="5px">
                        <InputField
                          id="title"
                          placeholder="eg. Oliver"
                          isRequired={true}
                          label='Non-Player Name'
                          name="gameTitle"
                          // value={formData.gameNonPlayerName ?? selectedPlayer.gasAssetName}
                          // onChange={handleChange}
                           
                           value={ formData?.gameNonPlayerName }// Lokie Add 12/06/2024

                          // value={languages !== undefined && languages !== null && languages !== '' ? String(nonplayerName) : formData?.gameNonPlayerName}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
                            // Check if languages is empty
                            // if (languages === undefined || languages === null || languages === '') {
                              // Call the handleChange function
                              handleChange(e as React.ChangeEvent<HTMLSelectElement>);
                            // }
                          }}
                          w="100%"
                          mb="0px"
                        />
                      </FormControl>
                      <Flex direction='column' mb='20px' mt="10px">
                        <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
                          Select Voices
                        </Text>
                        <Text fontSize='md' color={textColorSecondary}>
                          Here you can select voices for Characters
                        </Text>
                      </Flex>
                     



                      <FormControl mb="5px">
                     
                        <>
                          <SimpleGrid
                            columns={{ sm: 8, md: 8, xl: 8 }}
                            w="100%"
                            mb="0px"
                            mt="0px"
                          >
                            <Box gridColumn={{ sm: 'span 7', md: 'span 7', xl: 'span 7' }} mb="-10px" alignItems="center" mr="0px">
                              <InputField
                                id="title"
                                isRequired={true}
                                name="Non-PlayerVoice"
                                readOnly="readOnly"
                                w="100%"
                                label='Non-Player Voice'
                                value={formData.gameNonPlayerVoice !== '' ? filterByVoiceId(formData.gameNonPlayerVoice) : chosenVoiceNPC}
                                borderColor={formData.gameNonPlayerVoice === '' || formData.gameNonPlayerVoice === null ? 'red' : null}
                              // m="0px"
                              />

                            </Box>
                            <Box gridColumn={{ sm: 'span 1', xl: 'span 1', md: 'span 1' }} pt="29px" ml="0px" mb="5px" justifyContent="center" alignItems="center">

                              <div

                                style={customStylesBtn}
                                onClick={() => handleAddVoice('NPC')}

                              >
                                <MdOutlineAdd
                                  size={20}
                                  color={iconColor}
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}
                                />
                              </div>
                            </Box>
                          </SimpleGrid>
                          {/* {showModal && ( */}
                            <Modal isOpen={showModal} onClose={closeModal} size="full">

                              <ModalOverlay />
                              <ModalContent containerProps={{ zIndex: 999999}}>
                                <ModalHeader></ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                  <>
                                    <SimpleGrid
                                      columns={{ sm: 1, md: 1, xl: 16 }}
                                      w="100%" border={"1px solid grey"} alignItems="center" style={{ position: 'sticky', top: '0', background: 'white', zIndex: 1000 }}
                                    >
                                      {/* <Box gridColumn={{ sm: 'span 16',md: 'span 4', xl: 'span 4' }} alignItems="center" mr="0px" borderRight={"1px lightgrey"}  alignItems="center"> */}
                                      {/* <Box gridColumn={{ sm: 'span 16', md: 'span 4', xl: 'span 4' }} alignItems="center" mr="0px" borderRight={"1px lightgrey"} > */}
                                      <Box
                                        gridColumn={{ sm: 'span 16', md: 'span 4', xl: 'span 4' }}
                                        mr="0px"
                                        border={`2px solid ${isHighlighted ? 'grey' : 'lightgrey'}`}
                                        borderRadius="4px"
                                        bg={isHighlighted ? 'transparent' : 'transparent'}
                                        display={'flex'}
                                        alignItems={'center'}
                                      >
                                        <InputField
                                           mt={'17px'}
                                           mb={{base: '10px', sm: '10px', md: '30px'}}
                                          bg="transparent"
                                          placeholder="Search Voices..."
                                          margin="0px"
                                          border="none"
                                          p="20px"
                                          fontSize="0.875rem"
                                          onFocus={handleInputFocus}
                                          onBlur={handleInputBlur}
                                          onChange={(e: any) => handleSearchInputChange(e)} />
                                        </Box>

                                  


                                      {/* <Box p="10px" gridColumn={{ sm: 'span 15', md: 'span 11', xl: 'span 11' }} display="flex" alignItems="center" flexWrap="nowrap" overflowX="scroll" mr="0px">

                                        {filteredSubcategories.map((subcategory: any, index: any) => (
                                          <Text

                                            key={index}
                                            fontSize="sm"
                                            display="flex"
                                            flexWrap="nowrap"
                                            fontWeight="700"
                                            float={'left'}
                                            whiteSpace="pre"
                                            border={"1px solid #11047a"}
                                            borderRadius={"10px"}
                                            color={selectedFilters.includes(subcategory) ? 'white' : 'black'}
                                            bg={selectedFilters.includes(subcategory) ? '#11047a' : 'transparent'}
                                            onClick={() => handleFilterClick(subcategory)}
                                            style={{ cursor: 'pointer', marginRight: '10px', marginBottom: '5px', padding: '15px' }}
                                          >
                                            {subcategory}
                                          </Text>
                                        ))}
                                      </Box> */}
                                      <Box p="10px" gridColumn={{ sm: 'span 15', md: 'span 11', xl: 'span 11' }} display="flex" flexDirection="column">
                                      <Box display="flex" alignItems="center" flexWrap="nowrap" overflowX="hidden" mr="0px" id={'scroll'}>
                                        {filteredSubcategories.map((subcategory: any, index: any) => (
                                          <Text
                                            key={index}
                                            fontSize="sm"
                                            display="flex"
                                            flexWrap="nowrap"
                                            fontWeight="700"
                                            float={'left'}
                                            whiteSpace="pre"
                                            border={"1px solid #11047a"}
                                            borderRadius={"10px"}
                                            color={selectedFilters.includes(subcategory) ? 'white' : 'black'}
                                            bg={selectedFilters.includes(subcategory) ? '#11047a' : 'transparent'}
                                            onClick={() => handleFilterClick(subcategory)}
                                            style={{ cursor: 'pointer', marginRight: '10px', marginBottom: '5px', padding: '8px' }}
                                          >
                                            {subcategory}
                                          </Text>
                                        ))}
                                      </Box>
                                      <Box display={'flex'} justifyContent={'space-between'} alignItems="flex-end">
                                        <Icon
                                          as={FaChevronLeft}
                                          style={{ fontSize: '10px', cursor: 'pointer', marginBottom: '5px', display: "block" }}
                                          onClick={handleLeft}
                                        />
                                        <Icon
                                          as={FaChevronRight}
                                          style={{ fontSize: '10px', cursor: 'pointer', marginTop: '5px', display: "block" }}
                                          onClick={handleRight}
                                        />
                                      </Box>
                                    </Box>
                                      <Box p="30px" gridColumn={{ sm: 'span 1', md: 'span 1', xl: 'span 1' }} onClick={toggleSecondGrid} display="flex" alignItems="center" border={`2px solid ${isBorderHighlighted ? 'grey' : 'lightgrey'}`} flexWrap="nowrap" overflowX="scroll" mr="0px" >
                                        {isSecondGridVisible ? <Icon as={FaWindowClose} style={customStylesicon} /> : <Icon as={FaSlidersH} style={customStylesicon} />}
                                      </Box>
                                    </SimpleGrid>
                                    {isSecondGridVisible && (

                                      <motion.div
                                        initial={{ opacity: 0, height: 0,transform: "translateY(-50px)" }}
                                        animate={{
                                          opacity: isSecondGridVisible ? 1 : 0.5,
                                          height: isSecondGridVisible ? "100%" : 0,
                                          transform: isSecondGridVisible ? "translateY(0px)" : "translateY(-50px)",
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className='voice-library-filters'
                                        style={{
                                          // overflow: "hidden",
                                          border: "1px solid grey",
                                          background: "#ececec",
                                          gridColumn: "span 16", // Adjust this to your grid layout
                                          width: "100%",
                                          alignItems: "center",
                                          display: "flex", // Add this line                                                                                    
                                          // gridTemplateColumns: "repeat(16, 1fr)", // Adjust this based on your grid layout
                                          position: 'sticky',
                                          top: '11%',
                                          zIndex: 999,
                                          borderTop: "none"
                                          
                                        }}
                                      >
                                        {/* <Box pl={"20px"} gridColumn={{ sm: 'span 16', md: 'span 4', xl: 'span 4' }} alignItems="center">
                                        <div style={{ borderRight: "1px solid grey", margin: '0', paddingTop: '20px', paddingBottom: '20px' }}>

                                          <Text fontSize='15px'  color={textColorPrimary}>
                                            ADVANCED FILTERS
                                          </Text>
                                        </div>
                                      </Box> */}
                                        <Box pl={{base: "0", sm: "0", lg: "20px"}} pr={{base: "0", sm: "0", lg: "150px"}} gridColumn={{ sm: 'span 16', md: 'span 4', xl: 'span 4' }} alignItems="center">
                                          <Box style={{ margin: '0', paddingTop: '20px', paddingBottom: '20px' }}>
                                            <Text fontSize='13px' color={textColorPrimary}>
                                              ADVANCED FILTERS
                                            </Text>
                                          </Box>
                                        </Box>



                                        <Box p="10px" gridColumn={{ sm: 'span 14', md: 'span 10', xl: 'span 10' }} display="flex" flexDir={{base: 'column', sm: 'column', lg: 'row'}} alignItems="center" mr="0px" position="relative">
                                          <Box position={{ base: 'unset', sm: 'unset', lg: 'absolute' }} mr={{base: '0', sm: 0, lg: '20px'}} style={{  left: '-130px', width: '150px', zIndex: '500' }}>
                                            <Select
                                              placeholder="Gender"
                                              options={genderOptions}
                                               // styles={customStyles}                                             
                                               menuPortalTarget={document.body} 
                                               styles={{ menuPortal: base => ({ ...base, zIndex: 999999, }), option: (provided: any, state: any) => ({
                                                 ...provided,
                                                 backgroundColor: state.isFocused ? '#e0e0e0' : 'transparent',
                                                 cursor: 'pointer',
                                                 color: 'black',
                                                 zIndex: '101',
                                                 '&:hover': {
                                                   backgroundColor: '#e0e0e0', // Change background color on hover
                                                 },
                                               }), }}
                                              value={
                                                // Conditionally set the value based on some condition
                                                selectedGender !== ""
                                                  ? genderOptions.find((option) => option.value === selectedGender)
                                                  : ""
                                              }
                                              onChange={handleGenderChange}


                                            />
                                          </Box>
                                          <Box position={{ base: 'unset', sm: 'unset', lg: 'absolute' }} mr={{base: '0', sm: 0, lg: '20px'}} style={{ left: '50px', width: '150px', zIndex: '500' }}>
                                            {/* Render other dropdowns similarly */}
                                            <Select
                                              placeholder="Accent"
                                              options={accentOptions}
                                              // styles={customStyles}                                             
                                              menuPortalTarget={document.body} 
                                              styles={{ menuPortal: base => ({ ...base, zIndex: 999999, }), option: (provided: any, state: any) => ({
                                                ...provided,
                                                backgroundColor: state.isFocused ? '#e0e0e0' : 'transparent',
                                                cursor: 'pointer',
                                                color: 'black',
                                                zIndex: '101',
                                                '&:hover': {
                                                  backgroundColor: '#e0e0e0', // Change background color on hover
                                                },
                                              }), }}
                                              value={
                                                // Conditionally set the value based on some condition
                                                selectedAccent !== ""
                                                  ? accentOptions.find((option) => option.value === selectedAccent)
                                                  : ""
                                              }

                                              onChange={handleAccentChange}
                                            />
                                          </Box> <Box position={{ base: 'unset', sm: 'unset', lg: 'absolute' }} mr={{base: '0', sm: 0, lg: '20px'}} style={{ left: '230px', width: '150px', zIndex: '500' }}>
                                            <Select
                                              placeholder="Age"
                                              options={ageOptions}
                                              // styles={customStyles}                                             
                                              menuPortalTarget={document.body} 
                                              styles={{ menuPortal: base => ({ ...base, zIndex: 999999, }), option: (provided: any, state: any) => ({
                                                ...provided,
                                                backgroundColor: state.isFocused ? '#e0e0e0' : 'transparent',
                                                cursor: 'pointer',
                                                color: 'black',
                                                zIndex: '101',
                                                '&:hover': {
                                                  backgroundColor: '#e0e0e0', // Change background color on hover
                                                },
                                              }), }}
                                              value={
                                                // Conditionally set the value based on some condition
                                                selectedAge !== ""
                                                  ? ageOptions.find((option) => option.value === selectedAge)
                                                  : ""
                                              }

                                              onChange={handleAgeChange}
                                            />    </Box>  
                                          </Box>
                                        <Box p="5px" gridColumn={{ sm: 'span 2', md: 'span 2', xl: 'span 2' }} display="flex" alignItems="center" mr="0px">
                                          <Button
                                            variant="light"
                                            fontSize="sm"
                                            borderRadius="16px"
                                            position={{base: 'unset', sm: 'unset', lg: 'absolute'}}
                                            zIndex="500"
                                            right="-60px"
                                            h="46px"
                                            m={{base: "0", sm: "0", lg: "80px"}}
                                            onClick={handleClearFilters}>Clear All</Button>
                                        </Box>
                                      </motion.div>
                                    )}
                                  </>
                                  {/* Your modal content goes here */}
                                  <Box w={'100%'} mt="20px" p="20px">
                                    <>

                                      <Flex direction='column' mb='20px' mt="0px">
                                        <Text fontSize='34px' color={textColorPrimary} fontWeight='700'>
                                          Voice Library
                                        </Text>
                                        <Text fontSize='md' color={textColorSecondary}>
                                          Here you can discover voices
                                        </Text>
                                      </Flex>
                                      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing={{ base: '20px', xl: '20px' }}>
                                        {filteredVoices.map((voice: any, index: number) => {

                                          let bg = 'transparent';
                                          let bg2 = 'transparent';
                                          let border = '1px solid #cacfd8';

                                          if (chosenModal === 'NPC') {
                                            bg = formData.gameNonPlayerVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = formData.gameNonPlayerVoice === voice.value ? '#11047a' : 'transparent';
                                            border = formData.gameNonPlayerVoice === voice.value ? '2px solid #11047a' : borderColors[index];

                                          } else if (chosenModal === 'MALE') {
                                            bg = formData.gamePlayerMaleVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = formData.gamePlayerMaleVoice === voice.value ? '#11047a' : 'transparent';
                                            border = formData.gamePlayerMaleVoice === voice.value ? '2px solid #11047a' : borderColors[index];
                                          } else if (chosenModal === 'FEMALE') {
                                            bg = formData.gamePlayerFemaleVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = formData.gamePlayerFemaleVoice === voice.value ? '#11047a' : 'transparent';
                                            border = formData.gamePlayerFemaleVoice === voice.value ? '2px solid #11047a' : borderColors[index];
                                          } else if (chosenModal === 'NARRATOR') {
                                            bg = formData.gameNarratorVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = formData.gameNarratorVoice === voice.value ? '#11047a' : 'transparent';
                                            border = formData.gameNarratorVoice === voice.value ? '2px solid #11047a' : borderColors[index];
                                          }
                                          const isVoiceSelected =
                                            (chosenModal === 'NPC' && formData.gameNonPlayerVoice === voice.value) ||
                                            (chosenModal === 'MALE' && formData.gamePlayerMaleVoice === voice.value) ||
                                            (chosenModal === 'FEMALE' && formData.gamePlayerFemaleVoice === voice.value) ||
                                            (chosenModal === 'NARRATOR' && formData.gameNarratorVoice === voice.value);



                                          return (

                                            <Flex
                                              key={voice.value}
                                              direction="column"
                                              bg={bg}
                                              mb="38px"
                                              className="flex-item"
                                              borderRadius={"10px"}
                                              border={border}
                                              position="relative"
                                              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"

                                            >
                                              <Box p="16px 20px" lineHeight={'1.25rem'}>
                                                {isVoiceSelected && (

                                                  <Flex
                                                    position="absolute"
                                                    top="-10px"
                                                    right="-10px"
                                                    width="20px"
                                                    height="20px"
                                                    borderRadius="50%"
                                                    bg={bg2}
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
                                                <Text fontSize="sm" fontWeight="700" color={'black'} >
                                                  {voice.label}
                                                </Text>
                                                <Text fontSize="sm" fontWeight="500" color={'black'} textTransform={'capitalize'}>
                                                  {voice.age} {voice.accent} {voice.gender}
                                                </Text>
                                                <Box style={{ display: 'flex', alignItems: 'center', }}>

                                                  <Box style={{ display: 'flex' }} fontSize={'14px'} >

                                                    {voice.subcategories && voice.subcategories.length > 0 && (
                                                      <Box style={{ display: 'flex', marginRight: '12px', gap: '.25rem' }}>
                                                        {voice.subcategories.map((subcategory: any, index: number) => (
                                                          <Box key={index} style={{ borderRadius: '20px', whiteSpace: 'nowrap', fontSize: '0.775rem', fontWeight: '400', paddingRight: '6px', paddingLeft: '6px', backgroundColor: colors[index], marginRight: '4px' }}>
                                                            {subcategory}
                                                          </Box>
                                                        ))}
                                                      </Box>
                                                    )}
                                                  </Box>
                                                </Box>
                                              </Box>


                                              <div
                                                style={{

                                                  borderTop: '1px solid #cacfd8',
                                                  marginTop: '10px',
                                                  width: '100%',
                                                  float: 'left' // Pushes buttons to the bottom
                                                }}
                                              >
                                                {/* First Button */}
                                                <Button
                                                  bg={"transparent"}
                                                  w={"50%"}
                                                  borderRadius={"0px"}
                                                  p={"0px"}
                                                  fontSize={"0.875rem"}
                                                  fontWeight={"600"}
                                                  borderRight={"1px solid #cacfd8"}
                                                  onClick={(e) => handleClick(e, voice)}
                                                  disabled={isPlaying ? true : false}
                                                // Define your onClick function
                                                >
                                                  <Box style={{ marginLeft: '4px', marginRight: '12px' }} h={'100%'} display={'flex'} alignItems={'center'}>

                                                    {isPlaying && selectedVoice.value == voice.value ? (
                                                      <Spinner />
                                                    ) : (
                                                      <> <Icon as={FaVolumeUp} style={customStylesicon} /> <span style={customStylesicon}>Sample</span></>
                                                    )}
                                                    {/* <Icon onClick={()=>handleClick} as={FaPlay} /> */}
                                                  </Box>
                                                </Button>
                                                {/* Second Button */}
                                                <Button
                                                  w={"50%"}
                                                  p={"0px"}
                                                  bg={"transparent"}
                                                  fontSize={"0.875rem"}
                                                  fontWeight={"600"}
                                                  borderRadius={"0px"}
                                                  onClick={() => handleSelectChange(voice, chosenModal)}
                                                >
                                                  <> <Icon as={FaPlusCircle} style={customStylesicon} /> <span style={customStylesicon}>Add to Character</span></>
                                                </Button>
                                              </div>

                                            </Flex>

                                          )
                                        })}


                                      </SimpleGrid>
                                    </>
                                  </Box>

                                  {/* You can add the form or any content for adding a voice */}
                                </ModalBody>
                              </ModalContent>
                            </Modal>
                          {/* )} */}

                          {/* <Select
                        options={options}
                        filterOption={customFilter}
                        onInputChange={handleInputChange}
                        components={{ Option: OptionWithSubcategories }}
                        styles={customStyles}
                        menuIsOpen={menuIsOpen}
                        onMenuClose={handleMenuClose}
                        onMenuOpen={handleMenuOpen}
                        onChange={(selectedOption) => handleSelectChange(selectedOption,'NPC')}
                      />
                       
                    <Select
                      id="nonPlayerVoice"
                      variant="main"
                      onChange={handleNonPlayerVoice}
                      value={formData.gameNonPlayerVoice}
                    >
                      <option value="">Select...</option>
                      <option value="1">Adam</option>
                      <option value="2">Charlie</option>
                      <option value="3">Freya</option>
                      <option value="4">Domi</option>
                    </Select> */}
                        </>
                      </FormControl>

                      <FormControl mb="-5px" >


                        <SimpleGrid
                          columns={{ sm: 8, md: 8, xl: 8 }}
                          w="100%"
                        >
                          <Box gridColumn={{ sm: 'span 7', md: 'span 7', xl: 'span 7' }} alignItems="center" mr="0px">
                            <InputField
                              id="male"
                              isRequired={true}
                              name="PlayerMaleVoice"
                              readOnly="readOnly"
                              w="100%"
                              label='Player Male Voice'
                              borderColor={formData.gamePlayerMaleVoice === '' || formData.gamePlayerMaleVoice === null ? 'red' : null}
                              value={formData.gamePlayerMaleVoice !== '' ? filterByVoiceId(formData.gamePlayerMaleVoice) : chosenVoiceMALE}
                              m="0px"
                            />

                          </Box>
                          <Box gridColumn={{ sm: 'span 1', xl: 'span 1', md: 'span 1' }} pt="29px" ml="0px" justifyContent="center" alignItems="center">

                            <div

                              style={customStylesBtn}
                              onClick={() => handleAddVoice('MALE')}


                            >
                              <MdOutlineAdd
                                size={20}
                                color={iconColor}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                              />
                            </div>
                          </Box>
                        </SimpleGrid>

                        {/*<Select
                          options={maleOptions}
                          filterOption={customFilter}
                          onInputChange={handleInputChange}
                          components={{ Option: OptionWithSubcategories }}
                          styles={customStyles}
                          menuIsOpen={menuMaleIsOpen}
                          onMenuClose={handleMaleMenuClose}
                          onMenuOpen={handleMaleMenuOpen}
                          onChange={(selectedOption) => handleSelectChange(selectedOption,'MALE')}
                        />
                        <Select
                        id="playerMaleVoice"
                        variant="main"
                        onChange={handlePlayerMale}
                        value={formData.gamePlayerMaleVoice}
                      >
                        <option value="">Select...</option>
                        <option value="1">Adam</option>
                        <option value="2">Charlie</option>
                        <option value="3">Freya</option>
                        <option value="4">Domi</option>
                      </Select> */}
                      </FormControl>
                      <FormControl mb="-5px">


                        <SimpleGrid
                          columns={{ sm: 8, md: 8, xl: 8 }}
                          w="100%"
                          mt="0px"
                        >
                          <Box gridColumn={{ sm: 'span 7', md: 'span 7', xl: 'span 7' }} alignItems="center" mr="0px" >
                            <InputField
                              id="female"
                              isRequired={true}
                              name="PlayerFemaleVoice"
                              readOnly="readOnly"
                              w="100%"
                              label='Player Female Voice'
                              borderColor={formData.gamePlayerFemaleVoice === '' || formData.gamePlayerFemaleVoice === null ? 'red' : null}
                              value={formData.gamePlayerFemaleVoice !== '' ? filterByVoiceId(formData.gamePlayerFemaleVoice) : chosenVoiceFEMALE}
                              m="0px"
                            />

                          </Box>
                          <Box gridColumn={{ sm: 'span 1', xl: 'span 1', md: 'span 1' }} pt="29px" ml="0px" justifyContent="center" alignItems="center">

                            <div

                              style={customStylesBtn}
                              onClick={() => handleAddVoice('FEMALE')}

                            >
                              <MdOutlineAdd
                                size={20}
                                color={iconColor}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                              />
                            </div>
                          </Box>
                        </SimpleGrid>


                        {/*<Select
                          options={femaleOptions}
                          filterOption={customFilter}
                          onInputChange={handleInputChange}
                          components={{ Option: OptionWithSubcategories }}
                          styles={customStyles}
                          menuIsOpen={menufeMaleIsOpen}
                          onMenuClose={handlefeMaleMenuClose}
                          onMenuOpen={handlefeMaleMenuOpen}
                          onChange={(selectedOption) => handleSelectChange(selectedOption,'FEMALE')}
                        />
                        <Select
                        id="playerFemaleVoice"
                        variant="main"
                        onChange={handlePlayerFemale}
                        value={formData.gamePlayerFemaleVoice}
                      >
                        <option value="">Select...</option>
                        <option value="1">Adam</option>
                        <option value="2">Charlie</option>
                        <option value="3">Freya</option>
                        <option value="4">Domi</option>
                      </Select> */}
                      </FormControl>

                      <FormControl mb="-5px">



                        <SimpleGrid
                          columns={{ sm: 8, md: 8, xl: 8 }}
                          w="100%"
                        >
                          <Box gridColumn={{ sm: 'span 7', md: 'span 7', xl: 'span 7' }} alignItems="center" mr="0px">
                            <InputField
                              id="narrator"
                              isRequired={true}
                              name="NarratorVoice"
                              readOnly="readOnly"
                              w="100%"
                              label='Narrator Voice'
                              borderColor={formData.gameNarratorVoice === '' || formData.gameNarratorVoice === null ? 'red' : null}
                              value={formData.gameNarratorVoice !== '' ? filterByVoiceId(formData.gameNarratorVoice) : chosenVoiceNAR}
                              m="0px"
                            />

                          </Box>
                          <Box gridColumn={{ sm: 'span 1', xl: 'span 1', md: 'span 1' }} pt="29px" ml="0px" mb="5px" justifyContent="center" alignItems="center">

                            <div

                              style={customStylesBtn}
                              onClick={() => handleAddVoice('NARRATOR')}

                            >
                              <MdOutlineAdd
                                size={20}
                                color={iconColor}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                              />
                            </div>
                          </Box>
                        </SimpleGrid>
                        {/*<Select
                        options={narrationOptions}
                        filterOption={customFilter}
                        onInputChange={handleInputChange}
                        components={{ Option: OptionWithSubcategories }}
                        styles={customStyles}
                        menuIsOpen={menuNarateIsOpen}
                        onMenuClose={handleNarateeMenuClose}
                        onMenuOpen={handleNarateMenuOpen}
                        onChange={(selectedOption) => handleSelectChange(selectedOption,'NARRATE')}
                      />
                      <Box 
                      display={'none'}
                      >
                        {demo && 
                        <audio controls ref={audioRef} preload="auto">
                          <source src={demo} type="audio/mp3" />    
                        </audio>}
                      </Box>
                      <Select
                      marginTop={{ base: '4', md: '0' }}
                      id="narratorVoice"
                      variant="main"
                      onChange={handleNarrator}
                      value={formData.gameNarratorVoice}
                    >
                      <option value="">Select...</option>
                      <option value="1">Adam</option>
                      <option value="2">Charlie</option>
                      <option value="3">Freya</option>
                      <option value="4">Domi</option>
                    </Select> */}
                      </FormControl>
                      <Button
                        bg="#3311db"
                        _hover={{ bg: '#3311db' }}
                        color="#fff"
                        w="100%"
                        onClick={commonNextFunction}
                      >
                        Submit
                      </Button>
                    </Card>
                  // </Box>
                  )
                }
                </Box>
              </Flex>
              {/* ) : ( */}
              {/* <Flex justifyContent="space-between" alignItems="center" flexDirection="column" h="100%">
                <Image src={selectedPlayer?.gasAssetImage} alt="Your Image" maxH="600px" w="50%" mb="4" />
              </Flex> */}
              {/* )} */}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>


      </>
    );
  };

export default CharacterPreview;
