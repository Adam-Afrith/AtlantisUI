import {
  Box, Button, Flex, Heading, Icon, Img, SimpleGrid, Text, Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel, useColorModeValue, Grid, IconButton,
  InputGroup,
  InputLeftElement, Input, InputRightElement
} from '@chakra-ui/react'
import Select from 'react-select';

import { Navigate, useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import AddCourse from './components/AddCourse';
import { FaRegFolderOpen } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import { GiJoystick } from "react-icons/gi";
import { getImages, getAllGame, countByStage, getDuplicate, getTemplates, templateEdit } from 'utils/game/gameService';
import { getCategoryList } from 'utils/category/category';

import { CiMenuKebab } from "react-icons/ci";
import { IoMdHeart } from 'react-icons/io';
// import GameBG from 'assets/img/account/InvoiceBg.png'
import Navbar from 'assets/img/crm/navbar.png'
import NFTBanner from 'assets/img/auth/topbg.jpg'
import NFT from 'assets/img/nfts/Nft3.png'
import GameBG from 'assets/img/auth/banner.png'
import Rocket from 'assets/img/games/rocket1-removebg-preview.png'
import { MdArrowCircleRight, MdMoreVert } from 'react-icons/md';
import { VSeparator } from 'components/separator/Separator';
import GameCard from './components/gameCard';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import LeanerList from './components/LeanersList'
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import routes from 'routes';
import {API_SERVER} from 'config/constant';
const gameNames = [
  "Super Adventure Quest",
  "Galactic Conquest",
  "Mystic Legends",
  "Epic Dungeon Crawler",
  "Space Explorer",
  "Fantasy Realms",
  "Legends of Valor",
  "Pixel Warriors",
  "Time Traveler's Odyssey",
];


interface OptionType {
  value: string;
  label: string;
}
const SecondPage: React.FC = () => {

  const navigate = useNavigate();
  const searchIconColor = useColorModeValue('gray.700', 'white');

  const [duplicateId, setDuplicate] = useState<number>(0);
  const [msgtwo, setMsgtwo] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [isConfirm, setIsConfirm] = useState(false);
  const [toastStatus, setToastStatus] = useState<string>('');
  const [alert, setAlert] = useState(false);
  const [openLearner, setOpenLearner] = useState(false);
  const [assignGameId, setAssignGameId] = useState<number>();
  const [openCourse, setOpenCourse] = useState(false);
  const [img, setImg] = useState<any[]>([]),
    [Category, setCategory] = useState<any[]>([]),
    [fil, setFil] = useState<string>(''),
    [gamelist, setGameList] = useState<any[]>([]),
    [enter, setEnter] = useState(false),
    [bgIndex, setBgIndex] = useState<number>();
  let [tabState, setTabState] = useState('All');

  const [selected, setSelected] = useState({ gameCategoryId: '' });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const handleCourse = () => {
    // setOpenCourse(true); 
    navigate('/admin/superadmin/game/creation/');
  }
  const fetchData = async () => {
    const result = await getImages(1);
    if (result?.status !== 'Success')
      return console.log('getbackruond error:' + result?.message);
    setImg(result?.data);

  };
  const fetchCategoryList = async () => {

    const result = await getCategoryList();
    if (result?.status !== 'Success')
      return console.log('getbackruond error:' + result?.message);
    setCategory(result.data);

  };

  const gameList = async (type: string) => {

    let data = JSON.stringify(selected);

    const result = await getTemplates(data);
    if (result?.status !== 'Success') {
      setGameList([]);
      return console.log('getbackruond error:' + result?.message);
    }

    console.log('gameList :', result);
    setGameList(result.data);
    console.log('gameList', gamelist)
  };



  useEffect(() => {

    gameList(tabState);
    console.log('selected', selected);
  }, [selected]);

  useEffect(() => {
    fetchData();
    gameList(tabState);
    fetchCategoryList();
  }, []);


  //   const 1 = (selectedOption: OptionType | null) => {
  //     setSelected({ ...selected, gameCategoryId: selectedOption.value });
  //   };
  // const handleCompanyChange: React.ChangeEventHandler<HTMLSelectElement> = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   if (e && e.target) {
  //     console.log('e.target.value', e.target.value);
  //     setSelected({ ...selected, gameCategoryId: e.target.value || '' });
  //   }
  // };
  const handleCompanyChange = (selectedOption: any) => {
    console.log('Selected option:', selectedOption);

    // You can access the selected option's value using selectedOption.value
    setSelected({ ...selected, gameCategoryId: selectedOption ? selectedOption.value : '' });
  };



  const handleMouse = (i: number) => {
    setEnter(true)
    setBgIndex(i)
  }
  const handleMouseLeave = () => {
    setEnter(false)
    setBgIndex(null)
  }

  const handelAssign = (id: any) => {
    console.log('handelAssign', id);
    setAssignGameId(id);
    setOpenLearner(true)
  }


  const handleButtonOne = (id: any) => {
    console.log('handleButtonOne', id)
    const newTab = window.open('', '_blank');

    // Navigate the new tab to the desired URL
    newTab.location.assign(`/admin/game/preview/${id}`);

  }
  const handleButtonTwo = (id: any) => {

    console.log('handelDuplicate', id);
    setDuplicate(id)
    setMsgtwo('Are you in agreement with duplicating this game by making a copy of it ?')
    setIsOpen(true)
  }
  useEffect(() => {
    const gameDuplicate = async () => {
      if (isConfirm) {
        if (duplicateId !== 0) {

          const result = await templateEdit(duplicateId);
          if (result?.status !== 'Success') {
            setMsgtwo('');
            setDuplicate(0);
            setIsOpen(false);
            setMsg('Unable to make edits.');
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);

            return;

          } else {
            // console.log('result',result);
            navigate(`/admin/superadmin/game/creation/${result?.data[0]?.gameId}`)


          }
        }
      }
    }
    gameDuplicate()

  }, [isConfirm, duplicateId]);


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
    <>
      <Box ml={'5px'} position={'fixed'}> <SidebarResponsive routes={routes} /></Box>
      <Box className='Game' position={'relative'} width={'100%'} >
        <Box mb={{ base: '100px', md: '100px', xl: '100px' }} className='box'></Box>
        <Card backgroundImage={NFTBanner} backgroundRepeat={'no-repeat'} backgroundSize={'cover'} justifyContent={'center'} height={{ sm: 'auto', md: 'auto', lg: '180px' }} width={'100%'} overflow={{ sm: 'auto', xl: 'unset' }}>
          <Box display={{ base: 'block', xl: 'flex' }} justifyContent="space-between" alignItems={'center'}>
            <Box display={'flex'} flexDirection={'column'}>
              <Text fontSize={'1.8rem'} fontWeight={700} color={'#fff'} pb={{ sm: '10px', md: '0' }} display={'flex'} alignItems={'center'} >Creation Zone<Img src={Rocket} height={'50px'} width={'50px'} ml={'20px'} transform={'rotate(40deg)'} /></Text>
              <Text fontSize={'15px'} color={'#fff'} letterSpacing={{ sm: '.4px', md: '1px' }}>Building games, where learning becomes an adventure and knowledge is the ultimate reward. </Text>
            </Box>
            <Box display={'flex'} alignItems={'center'} justifyContent={'start'} mt={{base: '15px',sm: '15px', lg: '0'}}>
            <Button             
             padding={5}
              bg="#fff"
              color="##2b2b2b"
              // w={180}
              onClick={handleCourse}
            >
              Create Your Own Story
            </Button>
            </Box>
            {/* <Button mt='10px' mb='15px' padding={2} background='#3311db' color='#fff' w={70} onClick={handleNavigate}>New</Button> */}
          </Box>

        </Card>
        {/* <Text fontSize={'30px'} fontWeight={} mt={'25px'} alignItems={'center'} whiteSpace={'nowrap'}  color={'#1B254B'}  display={'flex'} letterSpacing={'1px'}>Customise Game Templates</Text> */}
        <Text fontSize={'21px'} fontWeight={700} m={'25px 0'} pl={'20px'} color={'#1B254B'} display={'flex'} alignItems={'center'} >Customise Game Templates</Text>
        <Card>
          <Flex gridArea='1 / 1 / 2 / 2' display={{ base: 'block', md: 'flex', lg: 'flex' }}>
            <Select
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999, }), control: (provided: any, state: any) => ({
                  ...provided,
                  borderRadius: '15px',
                  height: '45px',
                  padding: '0 !important',
                  width: windowWidth < 768 ? '100%' : '300px'
                }),
              }}
              options={Category}
              onChange={(selectedOption) => handleCompanyChange(selectedOption)}
              isClearable={true} // Optional: allow clearing the selection
              isSearchable={true} // Optional: enable searching  
              className='react-select'
              value={
                Category.find(
                  (option) => option.value === selected.gameCategoryId,
                ) || null
              }

            // styles={customStyle}           
            />


            <InputGroup w={{ base: '100%', md: '300px' }} mt={{ base: '15px', sm: '15px', md: '0' }} ml="auto" alignItems={'center'}>
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



          {/* <Text mt="10px" mb="10px" fontSize={20} fontWeight={500} color={'#fff'}>
          Games
        </Text> */}
          {/* <Text fontSize={22} fontWeight={800} mb={'20px'}>
          Games
        </Text> */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap='40px'>

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
                  <GameCard
                    name={game.gameTitle}
                    author={game.gameCategoryId}
                    image={game.gameBackgroundId && game?.image.gasAssetImage}
                    // image={'http://35.183.46.127:5555/uploads/background/29977_1701772077260.jpg'}
                    tabState={tabState}
                    id={game.gameId}
                    handleButtonOne={handleButtonOne}
                    handleButtonTwo={handleButtonTwo}
                    handelDuplicate={''}
                    handelLaunch={''}
                    handelAssign={handelAssign}
                    handelMakePublic={''}
                    handelDelete={''}
                    gameview={game?.gameview}
                    handleDownload={''}
                  />

                ))}
          </SimpleGrid>
        </Grid>
        {openCourse ? <AddCourse setOpenCourse={setOpenCourse} /> : null}
      </Box>
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={msgtwo} setmsg={setMsgtwo} /> : null}
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert}
      /> : null}
      {openLearner ? <LeanerList setOpenLearner={setOpenLearner} assignGameId={assignGameId} setMsg={setMsg} setToastStatus={setToastStatus} setAlert={setAlert} /> : null}
    </>
  );
}

export default SecondPage