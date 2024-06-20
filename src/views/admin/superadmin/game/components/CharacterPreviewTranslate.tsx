import React, { useEffect, useRef, useState } from 'react';
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
  FormLabel,
  Text,
  SimpleGrid,
  useColorModeValue,
  ChakraProvider, CSSReset, Img, Icon, Spinner
} from '@chakra-ui/react';
import InputField from 'components/fields/InputField';
import Card from 'components/card/Card';

import { MdOutlineAdd, MdOutlineCheck } from 'react-icons/md';
import Select, { components } from 'react-select';
import { FaVolumeUp, FaPlusCircle, FaSlidersH, FaWindowClose,  FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import OptionWithSubcategories from './options';
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
//

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

const CharacterPreviewTranslate: React.FC<{
  handleSave?:any;
  selectedOption?: any;
  setVoiceValues?: any;
  voiceValues?: any;
   isModalOpen2?: any;
  setIsModalOpen2?: any;
  handleInputChange2?: any;
  voices: any;
  handleModalClose:any;

}> = ({
  handleSave,
  selectedOption,
  setVoiceValues,
  voiceValues,
  isModalOpen2,
  setIsModalOpen2,
 handleInputChange2,
  voices,
  handleModalClose,
 
}) => {
    const textContent =
      'Game Content means any templates, modules, functions, features, images, audio data, video data, or other content that may be used by a Game Creator when creating a Game.';
    const truncatedText = textContent.slice(0, 80) + '...';

 
    const handleNonPlayerVoice: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setVoiceValues((prev: any) => ({
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
    const handleCloseModal = () => 
    {
      console.log("working")
      // Additional logic if needed
      handleModalClose(); // Call the function from the prop
    };

    const handleMouseLeave = () => {
      setIconColor('grey');
    };
    const handlePlayerMale: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setVoiceValues((prev: any) => ({
        ...prev,
        gamePlayerMaleVoice: e.target.value || '',
      }));
    };

    const handlePlayerFemale: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setVoiceValues((prev: any) => ({
        ...prev,
        gamePlayerFemaleVoice: e.target.value || '',
      }));
    };

    const handleNarrator: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setVoiceValues((prev: any) => ({
        ...prev,
        gameNarratorVoice: e.target.value || '',
      }));
    };

    const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setVoiceValues((prev: any) => ({
        ...prev,
        gameNonPlayerName: e.target.value || '',
      }));
    };
  
   
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
    // useEffect(() => {
    //   if (demo && audioRef.current) {
    //     audioRef.current.load();
    //     const handleLoadedData = () => {
    //       audioRef.current.play();
    //       audioRef.current.removeEventListener('loadeddata', handleLoadedData);
    //     };
    //     audioRef.current.addEventListener('loadeddata', handleLoadedData);
    //   }
    // }, [demo]);
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


    const handleSelectChange = (selectedOption: any, type: string) => {
      setDemo(selectedOption?.audio)
      if (type === 'NPC') {
        setVoiceValues((prev: any) => ({ ...prev, gameNonPlayerVoice: selectedOption.value }));
        setShowModal(false); // Function to close the modal
        setChosenModal('')
        setChosenVoiceNPC(selectedOption.label)
      }
      else if (type === 'MALE') {
        setVoiceValues((prev: any) => ({ ...prev, gamePlayerMaleVoice: selectedOption.value }));
        setShowModal(false); // Function to close the modal
        setChosenModal('')
        setChosenVoiceMALE(selectedOption.label)
      }
      else if (type === 'FEMALE') {
        setVoiceValues((prev: any) => ({ ...prev, gamePlayerFemaleVoice: selectedOption.value }));
        setShowModal(false); // Function to close the modal
        setChosenModal('')
        setChosenVoiceFEMALE(selectedOption.label)
      }
      else {
        if (type === 'NARRATOR') {
          setVoiceValues((prev: any) => ({ ...prev, gameNarratorVoice: selectedOption.value }));
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
        <Modal isOpen={isModalOpen2} onClose={handleCloseModal} isCentered>
          <ModalOverlay zIndex={2}/>
          <ModalContent containerProps={{zIndex:2}} position="fixed" overflowY="auto" m={100} w={{sm:'80%',md:'100%'}}>
          <ModalHeader>Voices</ModalHeader>
            <ModalCloseButton  onClick={handleCloseModal}/>
            <ModalBody p={0} pl={'25px'} >
              {/* {voiceValues.gameNonPlayingCharacterId === previewId ? ( */}
              <Flex
                flexDirection="row"
                justifyContent="Center"
                alignItems="Center"               
                background="#ffffff"
              >
                  <Box w={'100%'} h={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} mb={"0px"}>
                    <Card flex="1" w={'100%'}>
                                         
                      <Flex direction='column'  mt="10px">
                       <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>
                          Select Voices for {selectedOption.label} version of game
                        </Text>
                        <Text fontSize='md' color={textColorSecondary}>
                          Here you can select voices for Characters
                        </Text>
                      </Flex>
                      <FormControl mb="5px" mt="10px">

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
                                value={voiceValues.gameNonPlayerVoice !== '' ? filterByVoiceId(voiceValues.gameNonPlayerVoice) : chosenVoiceNPC}

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
                          {showModal && (
                            <Modal isOpen={showModal} onClose={closeModal} size="full">

                              <ModalOverlay />
                              <ModalContent>
                                <ModalHeader></ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                  <>
                                    <SimpleGrid
                                      columns={{ sm: 16, md: 16, xl: 16 }}
                                      w="100%" border={"1px solid grey"} alignItems="center" style={{ position: 'sticky', top: '0', background: 'white', zIndex: 3 }}
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
                                        style={{
                                          // overflow: "hidden",
                                          border: "1px solid grey",
                                          background: "#ececec",
                                          gridColumn: "span 16", // Adjust this to your grid layout
                                          width: "100%",
                                          alignItems: "center",
                                          display: "grid", // Add this line
                                          gridTemplateColumns: "repeat(16, 1fr)", // Adjust this based on your grid layout
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
                                        <Box pl={"20px"} pr="150px" gridColumn={{ sm: 'span 16', md: 'span 4', xl: 'span 4' }} alignItems="center">
                                          <div style={{ borderRight: "1px solid grey", margin: '0', paddingTop: '20px', paddingBottom: '20px' }}>
                                            <Text fontSize='13px' color={textColorPrimary}>
                                              ADVANCED FILTERS
                                            </Text>
                                          </div>
                                        </Box>



                                        <Box p="10px" gridColumn={{ sm: 'span 14', md: 'span 10', xl: 'span 10' }} display="flex" alignItems="center" mr="0px" position="relative">
                                          <div style={{ marginRight: '20px', position: 'absolute', left: '-130px', width: '150px', zIndex: '500' }}>
                                            <Select
                                              placeholder="Gender"
                                              options={genderOptions}
                                              styles={customStyles}
                                              value={
                                                // Conditionally set the value based on some condition
                                                selectedGender !== ""
                                                  ? genderOptions.find((option) => option.value === selectedGender)
                                                  : ""
                                              }
                                              onChange={handleGenderChange}


                                            />
                                          </div>
                                          <div style={{ marginRight: '20px', position: 'absolute', left: '50px', width: '150px', zIndex: '500' }}>
                                            {/* Render other dropdowns similarly */}
                                            <Select
                                              placeholder="Accent"
                                              options={accentOptions}
                                              styles={customStyles}
                                              value={
                                                // Conditionally set the value based on some condition
                                                selectedAccent !== ""
                                                  ? accentOptions.find((option) => option.value === selectedAccent)
                                                  : ""
                                              }

                                              onChange={handleAccentChange}
                                            />
                                          </div> <div style={{ marginRight: '20px', position: 'absolute', left: '230px', width: '150px', zIndex: '500' }}>
                                            <Select
                                              placeholder="Age"
                                              options={ageOptions}
                                              styles={customStyles}
                                              value={
                                                // Conditionally set the value based on some condition
                                                selectedAge !== ""
                                                  ? ageOptions.find((option) => option.value === selectedAge)
                                                  : ""
                                              }

                                              onChange={handleAgeChange}
                                            />    </div>  </Box>
                                        <Box p="5px" gridColumn={{ sm: 'span 2', md: 'span 2', xl: 'span 2' }} display="flex" alignItems="center" mr="0px">
                                          <Button
                                            variant="light"
                                            fontSize="sm"
                                            borderRadius="16px"
                                            position="absolute"
                                            zIndex="500"
                                            right="-60px"
                                            h="46px"
                                            m="80px"
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
                                            bg = voiceValues.gameNonPlayerVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = voiceValues.gameNonPlayerVoice === voice.value ? '#11047a' : 'transparent';
                                            border = voiceValues.gameNonPlayerVoice === voice.value ? '2px solid #11047a' : borderColors[index];

                                          } else if (chosenModal === 'MALE') {
                                            bg = voiceValues.gamePlayerMaleVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = voiceValues.gamePlayerMaleVoice === voice.value ? '#11047a' : 'transparent';
                                            border = voiceValues.gamePlayerMaleVoice === voice.value ? '2px solid #11047a' : borderColors[index];
                                          } else if (chosenModal === 'FEMALE') {
                                            bg = voiceValues.gamePlayerFemaleVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = voiceValues.gamePlayerFemaleVoice === voice.value ? '#11047a' : 'transparent';
                                            border = voiceValues.gamePlayerFemaleVoice === voice.value ? '2px solid #11047a' : borderColors[index];
                                          } else if (chosenModal === 'NARRATOR') {
                                            bg = voiceValues.gameNarratorVoice === voice.value ? boxBg : bgColors[index];
                                            bg2 = voiceValues.gameNarratorVoice === voice.value ? '#11047a' : 'transparent';
                                            border = voiceValues.gameNarratorVoice === voice.value ? '2px solid #11047a' : borderColors[index];
                                          }
                                          const isVoiceSelected =
                                            (chosenModal === 'NPC' && voiceValues.gameNonPlayerVoice === voice.value) ||
                                            (chosenModal === 'MALE' && voiceValues.gamePlayerMaleVoice === voice.value) ||
                                            (chosenModal === 'FEMALE' && voiceValues.gamePlayerFemaleVoice === voice.value) ||
                                            (chosenModal === 'NARRATOR' && voiceValues.gameNarratorVoice === voice.value);



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
                          )}

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
                      value={voiceValues.gameNonPlayerVoice}
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
                              value={voiceValues.gamePlayerMaleVoice !== '' ? filterByVoiceId(voiceValues.gamePlayerMaleVoice) : chosenVoiceMALE}
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
                        value={voiceValues.gamePlayerMaleVoice}
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
                              value={voiceValues.gamePlayerFemaleVoice !== '' ? filterByVoiceId(voiceValues.gamePlayerFemaleVoice) : chosenVoiceFEMALE}
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
                        value={voiceValues.gamePlayerFemaleVoice}
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
                              value={voiceValues.gameNarratorVoice !== '' ? filterByVoiceId(voiceValues.gameNarratorVoice) : chosenVoiceNAR}
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
                      value={voiceValues.gameNarratorVoice}
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
                        onClick={handleSave}
                      >
                        Submit
                      </Button>
                    </Card>
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

export default CharacterPreviewTranslate;
