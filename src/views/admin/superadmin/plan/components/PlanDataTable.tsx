import React, { useEffect, useState } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  TableInstance,
} from 'react-table';
import { Navigate, useNavigate } from 'react-router-dom';

// Chakra imports
import {
  Flex,
  SimpleGrid,
  Text,
  Box,
  Icon,
  Image,
  Button,
  Grid,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Spacer,
  ButtonGroup,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FaEllipsisH, FaBolt, FaPlus } from 'react-icons/fa';
import { MdEdit,MdOutlineMoreHoriz } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { TfiLayoutMenuSeparated } from 'react-icons/tfi';
import { CiMenuKebab } from 'react-icons/ci';
import SetPasswordCentered from 'views/auth/setPassword/setPasswordCentered';
import { AiFillGold } from 'react-icons/ai';
import { FaAngleDown } from 'react-icons/fa6';
import { IoIosArrowUp } from 'react-icons/io';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { IoIosArrowDown } from 'react-icons/io';
import Popup from 'components/alerts/Popup';
import { deleteplan, getplan, deleteplanName } from 'utils/plan/plan';
import { useColorMode } from '@chakra-ui/react';

type RowObj = {
  sNo: number;
  planName: string;
  planType: string;
  validity: string;
  // planPrice: string;
  planStatus: string;
  action: any;
};
interface PlanData {
  psId: number;
  psPlanName: string;
  psPlanType: string;
  psPlanDuration: string;
  psStatus: string;
  psDeleteStatus: string;
  someAlias: {
    plId: number;
    plStatus: string;
    plDeleteStatus: string;
    plPlanName: string;
    // Add other properties if needed
  };
  // Add more fields as needed
}


interface ColumnObj {
  Header: number | string;
  accessor: keyof RowObj;
}

interface CompanyDataTableProps {
  data: any[]; // Assuming RowObj is your data structure type
  onDataDeleted: () => void;}

type DataCol = TableInstance<RowObj>;

const PlanDataTable: React.FC<CompanyDataTableProps> = ({ data , onDataDeleted}) => {
  // const {data} = props;

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('creation');
  };

  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const handleedit = (psId?: number) => {
    // if (sub?.psId) {
    navigate(`/admin/superadmin/plan/updation/${psId}`);
    // } else {
    //   navigate('creation');
    // }
  };
  const handleAddPlanDuration = (psId?: number) => {
    // if (sub?.psId) {
    navigate(`/admin/superadmin/plan/updatePlanDuration/${psId}`);
    // } else {
    //   navigate('creation');
    // }
  };
  const [apiData, setApiData] = useState<PlanData[]>([]);
  const [filled, setFilled] = useState<any[]>(data);
  const fetchData = async () => {
    try {
      const result = await getplan();

      console.log('Subscription Plan Result:', result);

      if (result?.status !== 'Success') {
        console.error('Failed to fetch subscription plans:', result?.message);

      } else {
        console.log('plandata', result.data);
        setFilled(result.data);
      }

    } catch (error) {
      console.error('Error fetching subscription plans:', error);

    }
  }
  const handleDelete = async (psId: number) => {
    console.log("psId", psId)
    setDeleteId(psId);
    setIsOpen(true);
    // setTimeout(() => {
    //   navigate('/admin/superadmin/plan');
    // }, 50);
  };
  const handleDeletePlan = async (plId: number) => {
    console.log("psId", plId);
    setDeleteIds(plId);
    setIsOpen(true);
    // setTimeout(() => {
    //   navigate('/admin/superadmin/plan');
    // }, 50);
  };
  const [isConfirm, setIsConfirm] = useState(false);
  // const [deleteId, setDeleteId] = useState<number>();
  const [deleteId, setDeleteId] = useState(null);

  const [deleteIds, setDeleteIds] = useState<number>();
console.log('isConfirm',isConfirm);
  useEffect(() => {
    const deleteData = async () => {
      if (isConfirm) {
        if (deleteIds) {
          console.log("deleteIds", deleteIds)
          const result = await deleteplanName(deleteIds); // Change this to deleteplan if needed
          console.log("result", result)
          if (result?.status !== 'Success') {
            setIsConfirm(false)
            console.log('deletePlan Error :', result?.message);
            setIsOpen(false);
            setMsg('Plan Not Deleted');
            setToastStatus('error');
            setAlert(true);
            
            return;
          }else{
            setIsConfirm(false)
            setIsOpen(false);
            setMsg('Plan Deleted');
            setToastStatus('success');
            setAlert(true);
            onDataDeleted();
          }
         
          // await fetchData();
          // window.location.reload();
        }
      }
    };
    deleteData();
  }, [isConfirm, deleteIds]);

  useEffect(() => {
    const deleteDatas = async () => {
      if (isConfirm){
      if (deleteId) {
        try {
          const result = await deleteplan(deleteId);
  
          if (result?.status !== 'Success') {
            setIsConfirm(false)
            console.log('deletePlan Error:', result?.message);
            setIsOpen(false);
            setMsg('Plan Not Deleted');
            setToastStatus('error');
            setAlert(true);
          } else {
            setIsConfirm(false)
            setMsg('Plan Deleted');
            setToastStatus('success');
            setAlert(true);
            console.log('Calling fetchData after delete...');
            onDataDeleted();
          }
        } catch (error) {
          console.error('Error deleting plan:', error);
        } finally {
          setIsOpen(false);
        }
      }
    };
    };
    // Call deleteData only when isConfirm and deleteId change
    deleteDatas();
  }, [isConfirm, deleteId]); // Empty dependency array to run only once on mount
  
  
  
  const [alert, setAlert] = useState(false);

  const [lastPage, setLastPage] = useState<any>();
  const [open, setOpen] = useState(false),
    [ind, setInd] = useState<number>(),
    [parent, setParent] = useState<number>(),
    [op, setOp] = useState(false),
    [fil, setFil] = useState<string>(''),
    [menu, setMenu] = useState<number>();
  const columns: ColumnObj[] = React.useMemo(
    () => [
      { Header: 'S.No', accessor: 'sNo' },
      { Header: 'Plan Name', accessor: 'planName' },
      { Header: 'Plan Type', accessor: 'planType' },
      { Header: 'Validity', accessor: 'validity' },
      // { Header: 'Plan Price', accessor: 'planPrice' },
      { Header: 'Plan Status', accessor: 'planStatus' },
      { Header: 'Action', accessor: 'action' },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    gotoPage,
    setPageSize,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  }: DataCol = useTable<RowObj>(
    {
      columns,
      data: data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    const lastPage = Math.floor(data.length / pageSize);
    setLastPage(Math.floor(data.length / pageSize));
  }, []);

  const totalPages = Math.ceil(data.length / pageSize);

  const textColor = useColorModeValue('secondaryGray.500', 'white');
  const textHover = useColorModeValue(
    { color: 'secondaryGray.900', bg: 'unset' },
    { color: 'secondaryGray.500', bg: 'unset' }
  );
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgList = useColorModeValue('white', 'whiteAlpha.100');
  const bgShadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const { colorMode, toggleColorMode } = useColorMode();
  let bgButton2 = 'linear(to-b, brand.400, brand.600)';
  const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
  const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const handleGoPage = (pageNumber: number) => {
    // Ensure the page number is within valid range
    if (pageNumber >= 0 && pageNumber < totalPages) {
      gotoPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pageCount = 3;
    const currentPage = pageIndex + 1;
    const pages = [];

    if (totalPages <= pageCount) {

      for (let i = 0; i < totalPages; i++) {
        pages.push(i + 1);
      }
    } else {

      const start = Math.max(1, currentPage - Math.floor(pageCount / 2));
      const end = Math.min(totalPages, start + pageCount - 1);

      if (start > 1) {
        pages.push(1, '...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        pages.push('...', totalPages);
      }
    }

    return pages;
  };
  const handleEnter = (i: number) => {
    setInd(i);
    setOpen(true);
  };
  const handleLeave = () => {
    setInd(null);
    setOpen(false);
  };
  const handleParent = (i: number) => {
    setParent(i);
    setOp(true);
  };
  const handleParentLeave = () => {
    setParent(null);
    setOp(false);
  };
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const handleMenu = (i: any) => {
    setMenu(i);
    onOpen1()
  }

  const vill = [{ plPlan: 'Elite', plPrice: 200, plPlanType: 'Month' }]
  console.log('Data :', data);
  return (
    <>
      <Flex
        justifyContent="space-between"
        align={'center'}
        mb={'10px'}
        p={'20px'}
      >
        <Box>
          <Input
            type="text"
            placeholder="Search..."
            value={globalFilter || ''}
            onChange={(e) => setFil(e.target.value)}
            bg={'#f9f9f9'}
            borderRadius={'14px'}
            w={{ base: '200px', xl: '300px' }}
          />
        </Box>
        <Tooltip label="Create a New Plan" hasArrow placement="right-start">
          <Button
            mt="10px"
            mb="15px"
            padding={2}
            boxShadow={'3px 4px 12px #2e292940'}
            _hover={{ bg: '#3311db', boxShadow: '3px 4px 12px #2e292975' }}
            background="#3311db"
            color="#fff"
            w={70}
            onClick={handleNavigate}
          >
            New
          </Button>
        </Tooltip>
      </Flex>

      <Box w={'100%'} display={'flex'} justifyContent={'center'}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {data &&
            data
              .filter((item) =>
                item?.plPlanName.toLowerCase().includes(fil?.toLowerCase()),
              )
              .map((item, i) => (
                <Box position={'relative'} key={i}>
                  <Card
                    w={'300px'}
                    h={'330px'}
                    borderRadius={'none'}
                    boxShadow={'5px 5px 20px #c5c5c5'}
                    alignItems={'left'}
                    onMouseEnter={() => handleParent(i)}
                    onMouseLeave={handleParentLeave}
                    m={0}
                    p={5}
                  >
                    <Flex align="center" mb="20px">
                      <Box
                        h="55px"
                        w="55px"
                        bgGradient={bgButton2}
                        borderRadius="50px"
                        display="flex"
                        p="0px"
                        me="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBolt} h="22px" w="22px" color="white" />
                      </Box>
                      <Flex direction="column">
                        <Text
                          color={textColorPrimary}
                          fontWeight="bold"
                          fontSize="2xl"
                        >
                          {item?.plPlanName}
                        </Text>
                      </Flex>
                    </Flex>
                    <Box
                      mt={'0px'}
                      w={'80%'}
                      justifyContent={'center'}
                      textAlign={'start'}
                    >
                      <Box w={'90%'}>
                        <Flex justifyContent={'space-between'}>
                          <Text
                            color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                          >
                            Max Games
                          </Text>
                          <Box w={'50px'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                              {item?.plMaxGame}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                          <Text
                            color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                          >
                            Max Learners
                          </Text>
                          <Box w={'50px'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                              {item?.plMaxLearner}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                          <Text
                            color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                          >
                            Max Backgrounds
                          </Text>
                          <Box w={'50px'}>
                            <Text
                              textAlign={'start'}
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                              {item?.plMaxBackgrounds}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                          <Text
                            color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                          >
                            Max DashBoards
                          </Text>
                          <Box w={'50px'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                              {item?.plMaxAnalyticsDashboard}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                          <Text
                            color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                          >
                            Max Characters
                          </Text>
                          <Box w={'50px'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                              {item?.plMaxCharacters}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                          <Text
                            color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                          >
                            Max Duration
                          </Text>
                          <Box w={'50px'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                              {item?.plMAxGameHours}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    </Box>
                    <ButtonGroup mt={'0px'}>
                      <Button
                        p={'0px 30px'}
                        mt={'20px'}
                        color={'#fff'}
                        _hover={{
                          bg: '#3311db',
                        }}
                        bg={'#3311db'}
                        onClick={() => navigate(`updationPlan/${item?.plId}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        p={'0px 30px'}
                        mt={'20px'}
                        color={'#fff'}
                        _hover={{
                          bg: '#3311db',
                        }}
                        bg={'#3311db'}
                        onClick={() => handleDeletePlan(item?.plId)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Card>
                  <Box position={'absolute'} top={'5px'} right={'10px'}>
                    <Menu isOpen={isOpen1} onClose={onClose1}>
                      <MenuButton
                        alignItems="center"
                        justifyContent="center"
                        bg={bgButton}
                        _hover={bgHover}
                        _focus={bgFocus}
                        _active={bgFocus}
                        w="37px"
                        h="37px"
                        lineHeight="100%"
                        onClick={() => handleMenu(i)}
                        borderRadius="10px"
                      >
                        <Icon
                          as={MdOutlineMoreHoriz}
                          color={iconColor}
                          w="24px"
                          h="24px"
                          mt="4px"
                        />
                      </MenuButton>
                      {menu === i && (
                        <MenuList
                          w="150px"
                          minW="unset"
                          maxW="150px !important"
                          border="transparent"
                          backdropFilter="blur(63px)"
                          bg={bgList}
                          boxShadow={bgShadow}
                          borderRadius="20px"
                          p="15px"
                        >
                          {item?.someAlias.map((sub: any, subi: any) => (
                            <MenuItem
                              key={subi}
                              transition="0.2s linear"
                              color={textColor}
                              p="0px"
                              borderRadius="8px"
                              _focus={{
                                bg: 'transparent',
                              }}
                              mb="10px"
                            >
                              <Flex
                                minWidth="max-content"
                                alignItems="center"
                                justifyContent={'space-between'}
                                w="100%"
                              >
                                <Box>
                                  <Text fontSize="sm" fontWeight="400">
                                    {sub?.psPlanDuration} {sub?.psPlanType}
                                  </Text>
                                </Box>
                                <Spacer />
                                <ButtonGroup>
                                  <Icon
                                    _hover={textHover}
                                    _active={{
                                      bg: 'transparent',
                                    }}
                                    as={MdEdit}
                                    onClick={() => handleedit(sub?.psId)}
                                    h="16px"
                                    w="16px"
                                    me="8px"
                                  />
                                  <Icon
                                    _hover={textHover}
                                    _active={{
                                      bg: 'transparent',
                                    }}
                                    as={MdDelete}
                                    onClick={() => handleDelete(sub?.psId)}
                                    h="16px"
                                    w="16px"
                                    me="8px"
                                  />
                                </ButtonGroup>
                              </Flex>
                            </MenuItem>
                          ))}
                          <ButtonGroup
                            _hover={textHover}
                            onClick={() =>
                              navigate(`updatePlanDuration/${item?.plId}`)
                            }
                          >
                            <Icon
                              mt={'5px'}
                              _hover={textHover}
                              alignItems={'center'}
                              color={textColor}
                              cursor={'pointer'}
                              as={FaPlus}
                              h="16px"
                              w="16px"
                              me="8px"
                            />
                            <Text
                              color={textColor}
                              _hover={textHover}
                              cursor={'pointer'}
                            >
                              Add more
                            </Text>
                          </ButtonGroup>
                        </MenuList>
                      )}
                    </Menu>
                  </Box>
                </Box>
              ))}
        </SimpleGrid>
        {isOpen ? (
          <Popup
            setIsConfirm={setIsConfirm}
            setIsOpen={setIsOpen}
            msg={''}
            setmsg={''}
          />
        ) : null}
      </Box>
    </>
  );
};

export default PlanDataTable;
