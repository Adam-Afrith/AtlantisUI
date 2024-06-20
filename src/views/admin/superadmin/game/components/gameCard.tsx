// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
  FormLabel,
  VStack,
  IconButton,
  Badge,
} from '@chakra-ui/react';

import { getSkills } from 'utils/game/gameService';
// Custom components
import Card from 'components/card/Card';
import Menu from './gameCardMenu';
import InputField from 'components/fields/InputField';
import { MdPlayArrow } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
import { getCategoryList } from 'utils/category/category';

// Assets

import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { MdMoreVert } from 'react-icons/md';

import React, { useEffect, useState } from 'react';
const audioFiles = {
  Antoni: require('../../../../../assets/adiuo/Antoni.mp3'),
  Bill: require('../../../../../assets/adiuo/Bill.mp3'),
  Josh: require('../../../../../assets/adiuo/Josh.mp3'),
  Nicole: require('../../../../../assets/adiuo/Nicole.mp3'),
  Serena: require('../../../../../assets/adiuo/Serena.mp3'),
};

export default function NFT(props: {
  image: string;
  name: string;
  author: string;
  tabState: string;
  handleButtonOne: any;
  handleButtonTwo: any;
  game?: any;
  id: any;
  handelDuplicate: any;
  handelLaunch: any;
  handelAssign: any;
  handelMakePublic: any;
  handelDelete: any;
  gameview?: any;
  handleDownload: any;
}) {
  const {
    image,
    name,
    author,
    tabState,
    game,
    handleButtonOne,
    handleButtonTwo,
    id,
    handelDuplicate,
    handelLaunch,
    handelAssign,
    handelMakePublic,
    handelDelete,
    gameview,
    handleDownload,
  } = props;

  const [skills, setSkills] = useState<any[]>([]);
  const [authorArray, setauthorArray] = useState<any[]>([]);

  const gameSkill = async () => {
    const data = '';
    if (tabState === 'All') {
      const result = await getCategoryList();
      if (result?.status !== 'Success') {
        setSkills([]);
        return console.log('getbackruond error:' + result?.message);
      } else {
        setSkills(result.data);
      }
    } else {
      const result = await getSkills();
      if (result?.status !== 'Success') {
        setSkills([]);
        return console.log('getbackruond error:' + result?.message);
      } else {
        setSkills(result.data);
      }
    }
  };

  // useEffect(() => {

  //   gameSkill();
  //   if(author){
  //     const Array = author.split(',');
  //     setauthorArray(Array)
  //   }

  // },[]);

  const findSkillName = (authorNumber: any) => {
    const matchedSkill = skills.find(
      (option) => option.id === Number(authorNumber),
    );

    return matchedSkill ? matchedSkill.name : null;
  };

  const findCatgoryName = (authorNumber: any) => {
    const matchedSkill = skills.find(
      (option) => option.value === Number(authorNumber),
    );
    return matchedSkill ? matchedSkill.label : null;
  };

  const [selectedAudio, setSelectedAudio] = useState('');
  type AudioFiles = {
    Antoni: string;
    Bill: string;
    Josh: string;
    Nicole: string;
    Serena: string;
  };
  const handlePlay = (audioName: keyof AudioFiles) => {
    const audio = new Audio(audioFiles[audioName]);
    audio.play();
  };

  const [like, setLike] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorBid = useColorModeValue('brand.500', 'white');
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  let [datePart, timePart] = '';
  if (game) {
    if (game?.gameStageDate) {
      [datePart, timePart] = game?.gameStageDate?.split('T');
    } else {
      [datePart, timePart] = '0T0'.split('T');
    }
  }
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  function formatLikesCount(count: any) {
    if (count >= 1000000) {
      const roundedCount = Math.round(count / 100000) / 10; // rounding to one decimal place
      return `${roundedCount}M`;
    } else if (count >= 1000) {
      const roundedCount = Math.round(count / 100) / 10; // rounding to one decimal place
      return `${roundedCount}K`;
    }
    return count?.toString();
  }

  const handleNonPlayerVoice: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    handelDuplicate((prev: any) => ({
      ...prev,
      gameNonPlayerVoice: e.target.value || '',
    }));
  };
  const handlePlayerMale: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    handelDuplicate((prev: any) => ({
      ...prev,
      gamePlayerMaleVoice: e.target.value || '',
    }));
  };

  const handlePlayerFemale: React.ChangeEventHandler<HTMLSelectElement> = (
    e,
  ) => {
    handelDuplicate((prev: any) => ({
      ...prev,
      gamePlayerFemaleVoice: e.target.value || '',
    }));
  };
  const handleNarrator: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    handelDuplicate((prev: any) => ({
      ...prev,
      gameNarratorVoice: e.target.value || '',
    }));
  };
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    handelDuplicate((prev: any) => ({
      ...prev,
      gameNonPlayerName: e.target.value || '',
    }));
  };

  let lightBlue = useColorModeValue('#3311db5c', '#3311db5c');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Card
      p="20px"
      boxShadow={'1px 4px 29px #44445429'}
      border={
        handelAssign.gameNonPlayingCharacterId === id
          ? '2px solid #11047a'
          : '' 
          // ||
          //   (game?.gameDuplicated === 'YES' &&
          //     game?.gameGameStage === 'Creation' &&
          //     datePart === getCurrentDate()) ||
          //   (game?.gameDuplicated !== 'YES' &&
          //     game?.gameGameStage === 'Creation' &&
          //     datePart === getCurrentDate()) ||
          //   (game?.gameDuplicated !== 'YES' &&
          //     game?.gameGameStage === 'Review' &&
          //     datePart === getCurrentDate()) ||
          //   (game?.gameDuplicated !== 'YES' &&
          //     game?.gameGameStage === 'Launched' &&
          //     datePart === getCurrentDate())
          //   ? '5px solid #ADD8E6'
          //   : 'none'
      }
      borderColor={
        handelAssign.gameNonPlayingCharacterId === id ? '#11047a' : ''
      }
    >
      <Flex direction={{ base: 'column' }} justify="center">
        <Box
          mb={{ base: '20px', '2xl': '20px' }}
          position="relative"
          w="100%"
          h="100%"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {tabState !== 'charater' ? (
            <Image
              src={image}
              w={{ base: '100%', '2xl': '100%' }}
              h={{ base: '220px', '2xl': '220px' }}
              borderRadius="20px"
            />
          ) : (
            <Image
              src={image}
              w={{ base: '250px', xl: '250px' }} // Adjust the values based on your design
              h={{ base: '400px', sm: '400px', md: '300px' }}
              borderRadius="20px"
            />
          )}

          {(isHovered && tabState !== 'charater') || (windowWidth < 768 && tabState !== 'charater') ? (
            <Menu
              tabState={tabState}
              position="absolute"
              top="3px"
              right="3px"
              id={id}
              handelDuplicate={handelDuplicate}
              handelLaunch={handelLaunch}
              handelAssign={handelAssign}
              handelMakePublic={handelMakePublic}
              handelDelete={handelDelete}
              handleDownload={handleDownload}
            />
          ) : null}
          {/* {isHovered && (
  <Flex
    position='absolute'
    top='50%'
    right='50%'
    transform='translate(50%, -50%)'
    flexDirection='row' // Set flexDirection to 'row'
    alignItems='center'
  >
    <Button variant="brand" borderRadius="70px" ml="2">
      Perivew
    </Button>
    <Button variant="brand" borderRadius="70px" ml="2">
      Edit
    </Button>
  </Flex>
)} */}

          {/* { game.gameDuplicated==='Yes' && <Badge  position='absolute'
              top='3px'
              left='5px' variant='solid' >New</Badge>
            } */}
          {/* dsfsdfdsssssssssssssssssssssssssssss */}
          {game && tabState !== 'charater' && (
            <>
              {game.gameDuplicated === 'YES' &&
                game.gameGameStage === 'Creation' &&
                datePart === getCurrentDate() && (
                  <Badge
                    position="absolute"
                    top="0px"
                    left="0px"
                    variant="solid"
                    borderTopLeftRadius={'5px'}
                    borderBottomLeftRadius={'0px'}
                    borderTopRightRadius={'0px'}
                  >
                    Duplicated
                  </Badge>
                )}

              {game.gameDuplicated !== 'YES' &&
                game.gameGameStage === 'Creation' &&
                datePart === getCurrentDate() && (
                  <Badge
                    position="absolute"
                    top="0px"
                    left="0px"
                    variant="solid"
                    borderTopLeftRadius={'5px'}
                    borderBottomLeftRadius={'0px'}
                    borderTopRightRadius={'0px'}
                  >
                    NEW
                  </Badge>
                )}

              {game.gameDuplicated !== 'YES' &&
                game.gameGameStage === 'Review' &&
                datePart === getCurrentDate() && (
                  <Badge
                    position="absolute"
                    top="0px"
                    left="0px"
                    variant="solid"
                    borderTopLeftRadius={'5px'}
                    borderBottomLeftRadius={'0px'}
                    borderTopRightRadius={'0px'}
                  >
                    New Launched
                  </Badge>
                )}

              {game.gameDuplicated !== 'YES' &&
                game.gameGameStage === 'Launched' &&
                datePart === getCurrentDate() && (
                  <Badge
                    position="absolute"
                    top="0px"
                    left="0px"
                    variant="solid"
                    borderTopLeftRadius={'5px'}
                    borderBottomLeftRadius={'0px'}
                    borderTopRightRadius={'0px'}
                  >
                    New Published
                  </Badge>
                )}
            </>
          )}
          {!game && tabState !== 'charater' && (
            <>
              {/*{gameview === null || gameview <= 1 ? (
      <Badge
        position='absolute'
        top='0px'
        left='0px'
        variant='solid'
        borderTopLeftRadius={'5px'}
        borderBottomLeftRadius={'0px'}
        borderTopRightRadius={'0px'}
      >
        New
      </Badge>
    ) : (
      <>
      <Badge
        position='absolute'
        top='0px'
        left='0px'
        variant='solid'
        borderTopLeftRadius={'5px'}
        borderBottomLeftRadius={'0px'}
        borderTopRightRadius={'0px'}
        w={'50px'}
        h={'25px'}
      >
       
        
      </Badge>*
       <IconButton
       position='absolute'
       top='10px'
       left='-8px'
       icon={<FaRegEye />}
       colorScheme="solid"
       aria-label="views"
       w={'1px'}
       h={'3px'}
       fontSize='18px'
     />
     <Text
      position='absolute'
       top='2.5px'
       left='22px'
       fontSize='13px'
       color='white'
       >{formatLikesCount(gameview)}</Text>
     </>
    )}*/}
            </>
          )}

          {/* dsfdffffffffffffffffffffffffff */}
          {isHovered || windowWidth < 768 ? (
            <Flex
              position="absolute"
              bottom="0px"
              transform="translate(-50%, 0)"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              style={{
                opacity: '1',
                transform: 'translateY(0)',
                transition: 'transform 0.5s ease, opacity 0.5s ease',
              }}
            >
              <Box
                bg="white"
                width="50%"
                height="35px"
                borderBottomLeftRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{
                  bg: '#f0f0f0',
                }}
                onClick={() => handleButtonOne(id)}
              >
                <span style={{ color: 'black' }}>Preview</span>
              </Box>
              <Box
                bg="#11047a"
                width="50%"
                height="35px"
                borderBottomRightRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                _hover={{
                  bg: '#11047ae3',
                }}
                onClick={() => handleButtonTwo(id, name)}
              >
                <span style={{ color: 'white' }}>
                  {tabState === 'charater'
                    ? handelAssign.gameNonPlayingCharacterId === id
                      ? 'Selected'
                      : 'Select' // or any text you want to display when the condition is not met
                    : 'Edit'}
                </span>
              </Box>
            </Flex>
          ) : (
            <Flex
              position="absolute"
              bottom="0"
              transform="translate(-50%, 0)"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              style={{
                opacity: '0',
                transform: 'translateY(20px)',
                transition: 'transform 0.5s ease, opacity 0.5s ease',
              }}
            >
              <Box
                bg="white"
                width="50%"
                height="35px"
                borderBottomLeftRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
              >
                <span style={{ color: 'black' }}></span>
              </Box>
              <Box
                bg="#11047a"
                width="50%"
                height="35px"
                borderBottomRightRadius="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
              >
                <span style={{ color: 'white' }}></span>
              </Box>
            </Flex>
          )}
        </Box>
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex
            justify="space-between"
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mb="auto"
          >
            <Flex direction="column" width={'100%'} alignItems={'start'}>
              {/* {handelAssign.gameNonPlayingCharacterId === id ? (
             <>
             <Box
                      width={'100%'}
                      justifyContent={'space-between'}
                      display={'flex'}
                    >

<InputField
    mb="0px"
    me="30px"
    id="title"
    label=""
    placeholder="eg. Oliver"
    name="gameTitle"
    value={handelAssign.gameNonPlayerName ?? name}
    onChange={handleChange}
    w={{ base: '50px', md: '150px' }}
    marginBottom={'5px'}
  />
  
  {/* <VStack align="center" spacing={4}>
      <Select
        placeholder="Select an audio file"
        onChange={(e) => setSelectedAudio(e.target.value)}
        value={selectedAudio}
      >
        {Object.keys(audioFiles).map((audioName) => (
          <option key={audioName} value={audioName}>
            <IconButton
            icon={<MdPlayArrow />}
            colorScheme="teal"
            aria-label="Play"
            w={'3px'}
            h={'3px'}
            onClick={() => handlePlay(selectedAudio as keyof AudioFiles)}
          />{audioName}
          </option>
        ))}
      </Select>

      {selectedAudio && (
        <Flex align="center">
          <IconButton
            icon={<MdPlayArrow />}
            colorScheme="teal"
            aria-label="Play"
            onClick={() => handlePlay(selectedAudio as keyof AudioFiles)}
          />
          <Text ml={2}>{`Selected: ${selectedAudio}.mp3`}</Text>
        </Flex>
      )}
    </VStack>   // recommand here when un command
   <Select
  fontSize="sm"
  id="currency"
  variant="main"
  h="44px"
  maxH="44px"
  w={{ base: '50px', md: '150px' }}
  onChange={handleNonPlayerVoice}
  value={handelAssign.gameNonPlayerVoice}
>
<option value="">Non Player Voice</option>
<option value="1">
<MdPlayArrow style={{ marginRight: '8px' }} />
Adam</option>
<option value="2"><MdPlayArrow style={{ marginRight: '8px' }} />Charlie</option>
<option value="3"><MdPlayArrow style={{ marginRight: '8px' }} />Freya</option>
<option value="4"><MdPlayArrow style={{ marginRight: '8px' }} />Domi</option>
</Select> 


             </Box>
                <Box
                width={'100%'}
                justifyContent={'space-between'}
                display={'flex'}
              >

<Select
fontSize="sm"
id="currency"
variant="main"
h="44px"
maxH="44px"
w={{ base: '50px', md: '150px' }} // Adjust the width here
onChange={handlePlayerMale}
value={handelAssign.gamePlayerMaleVoice}
>
<option value=""> Player Male</option>
<option value="1">Adam</option>
<option value="2">Charlie</option>
<option value="3">Freya</option>
<option value="4">Domi</option>
</Select>


<Select
fontSize="sm"
id="currency"
variant="main"
h="44px"
maxH="44px"
w={{ base: '50px', md: '150px' }} // Adjust the width here
onChange={handlePlayerFemale}
value={handelAssign.gamePlayerFemaleVoice}
>
<option value="">Player Female</option>
<option value="1">Adam</option>
<option value="2">Charlie</option>
<option value="3">Freya</option>
<option value="4">Domi</option>
</Select>


       </Box>
       <Box
                width={'100%'}
                justifyContent={'space-between'}
                display={'flex'}
              >

<Select
marginTop={'5px'}
fontSize="sm"
id="currency"
variant="main"
h="44px"
maxH="44px"
w={{ base: '50px', md: '150px' }} // Adjust the width here
onChange={handleNarrator}
value={handelAssign.gameNarratorVoice}
>
<option value=""> Narrator </option>
<option value="1">Adam</option>
<option value="2">Charlie</option>
<option value="3">Freya</option>
<option value="4">Domi</option>
</Select>





       </Box>

  
              </>
             
 
) : ( */}
              <Text
                color={textColor}
                // fontSize={{
                //   base: 'xl',
                //   md: 'lg',
                //   lg: 'lg',
                //   xl: 'lg',
                //   '2xl': 'md',
                //   '3xl': 'lg'
                // }}
                mb="5px"
                fontWeight="bold"
                textAlign="center"
                fontSize="lg"
                textTransform={'capitalize'}
                // fontFamily="DM Sans, sans-serif"
              >
                {name}
              </Text>
              {/* )} */}

              <Text
                color="secondaryGray.600"
                fontSize={{
                  base: 'sm',
                }}
                fontWeight="400"
                display="flex"
                flexWrap="wrap"
                gap="8px"
              >
                {/* {author} */}
                {author &&
                  Array.isArray(author) &&
                  author.map((authorItem: any, index: any) => (
                    <Tag
                      key={index}
                      size="md"
                      variant="solid"
                      colorScheme="brandScheme"
                      // mr="2"
                      bg="lightblue" // Assuming lightBlue is a variable or constant containing the background color
                    >
                      <TagLabel color={'#11047a'}>{authorItem}</TagLabel>
                    </Tag>
                  ))}
                {/* <Tag
          
          size="md"
          variant="solid"
          colorScheme="teal"
          m="2"
        >
          <TagLabel>dsadsaf</TagLabel>
          
         
        </Tag> */}
              </Text>
            </Flex>
          </Flex>
          {/* <Flex
            justify="space-between"
            align={{
              base: 'center',
              md: 'start',
              lg: 'center',
              xl: 'start',
              '2xl': 'center',
            }}
            direction={{
              base: 'row',
              md: 'column',
              lg: 'row',
              xl: 'column',
              '2xl': 'row',
            }}
            mt="25px"
          > */}
            {/* <Text fontWeight='700' fontSize='sm' color={textColorBid}>
                       
						</Text> */}
          {/* </Flex> */}
        </Flex>
      </Flex>
    </Card>
  );
}
