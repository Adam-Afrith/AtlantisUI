import React, { useEffect, useState } from 'react';
import {
  IconButton,
  InputGroup,
  InputLeftElement,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  TableInstance,
} from 'react-table';
import { Navigate, useNavigate } from 'react-router-dom';
import SelectField from 'components/fields/SelectField';
import { SearchIcon } from '@chakra-ui/icons';

// Chakra imports
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Box,
  Button,
  FormControl,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import {
 getCreatorName,getCompanyList,getSelectCreator
} from 'utils/creatorActivity/CreatorActivity';
import { getPlanName } from 'utils/plan/plan';

// type RowObj = {
//   sNo: number;
//   creatorName: string;
//   // creatorDesignation: string;
//   status:string;
//   creatorMail: string;
//   action: any;
// };
type RowObj = {
  id: number;
  sNo: number;
  // companyName: string;
  // CreatorName: string;
  CreatorName: string;
  createdUserId: number;
  company: number;
 
  nooflearners: number;
  noofgamespublished: number;
  noofgameslaunched: number;
  noofgames: number;
  timeSpent:any;
  // timeSpent: string | null;
  LastActiveDate:string;
  // action: JSX.Element; // Adjust the type according to your requirements
  // CreatorMail: string;
  // planexpiry: string;
  // renewplan: any;
  // planduration: string;
  // creatorAge: number;
  // creatorGender:string;
  // creatorDesignation: string;
  // status: any;
  plan: string;
  validity: string;
};
interface CreatorActivityData {
  id: number;
  name: string;
  createdUserId: number | null;
  company: number;
  
  
  // status: string;
  nooflearners: number;
  noofgamespublished: number;
  noofgameslaunched: number;
  noofgames: number;
  timeSpent:any;
  // timeSpent: { lgTotalTime: string; lgUserId: number }[];
  // companyName: string;
  LastActiveDate:string;
  // validityLogs?: ValidityLog[];
}

interface ColumnObj {
  Header: number | string;
  accessor: keyof RowObj;
}
interface OptionType {
  value: string;
  label: string;
}
interface CreatorActivityDataTableProps {
  data: RowObj[];
}

interface creatorType {
  ctName: string;
  ctId: string;
  // other properties if any
}
type DataCol = TableInstance<RowObj>;
interface CustomCreatorDataTableProps {
  data: RowObj[];
  setApiData: React.Dispatch<React.SetStateAction<CreatorActivityData[]>>;
  setCompany: any;
  setCreator:any;
  // Other props as needed
}
const CreatorActivityDataTable: React.FC<CustomCreatorDataTableProps> = ({
  data,
  setApiData,
  setCompany,
  setCreator,
}) => {
  const storage = JSON.parse(localStorage.getItem('user'));

  let storageCreatorId = '';
  const UserRole = storage.data.role;
  if (storage.data.role === 'Creator') {
    storageCreatorId = storage.data.id;
  }
  interface OptionTypecon {
    value: string;
    label: string;
    CompanyId: string;
  }
  const [lastPage, setLastPage] = useState<any>();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [CreatorOptions, setCreatorOptions] = useState([]);

  const [selected, setSelected] = useState({ companyId: '', id: '',
  creatorId: '', });
  const [creator, setcreator] = useState<creatorType[]>([]);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('creation')
  };
  const mappedPlanOptions = Array.isArray(creator)
    ? creator.map((creator) => ({
        value: creator.ctId, // Convert to string if necessary
        label: creator.ctName,
      }))
    : [];
  const options: OptionType[] = [
    { value: 'Days', label: 'Days' },
    { value: 'Month', label: 'Month' },
    { value: 'Year', label: 'Year' },
  ];
  const searchIconColor = useColorModeValue('gray.700', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const columns: ColumnObj[] = React.useMemo(
    () => [
      { Header: 'S.No', accessor: 'sNo' },
      // { Header: 'company Name', accessor: 'company' },
      { Header: 'Creator Name', accessor: 'CreatorName' },
      { Header: 'No of Games ', accessor: 'noofgames' },
      { Header: 'No of Games Launched', accessor: 'noofgameslaunched' },
      { Header: 'No of Games Published', accessor: 'noofgamespublished' },

      { Header: 'No of Learners', accessor: 'nooflearners'},

      { Header: 'Spent Time', accessor: 'timeSpent' },

      // { Header: 'Age', accessor: 'creatorAge' },
      // { Header: 'Gender', accessor: 'creatorGender' },
      // { Header: 'creatorDesignation', accessor: 'creatorDesignation' },

      { Header: 'Last Active Date', accessor: 'LastActiveDate' },
      // { Header: 'Status', accessor: 'status' },

      // { Header: 'Action', accessor: 'action' },
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

  const handleGoPage = (pageNumber: number) => {
    // Ensure the page number is within valid range
    if (pageNumber >= 0 && pageNumber < totalPages) {
      gotoPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pageCount = 3; // Adjust the number of visible page numbers as needed
    const currentPage = pageIndex + 1;
    const pages = [];

    if (totalPages <= pageCount) {
      // Display all pages if total pages are less than or equal to the page count
      for (let i = 0; i < totalPages; i++) {
        pages.push(i + 1);
      }
    } else {
      // Display a range of pages with three dots in between
      const start = Math.max(1, currentPage - Math.floor(pageCount / 2));
      const end = Math.min(totalPages, start + pageCount - 1);

      if (start > 1) {
        pages.push(1, '...'); // Display first page and three dots if not in the initial range
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        pages.push('...', totalPages); // Display three dots and last page if not in the final range
      }
    }

    return pages;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const company = await getCompanyList();
        if (company?.status !== 'Success')
          return console.log('getCompanylist Error :', company?.message);
        setCompanyOptions(company?.data);
        setCompany(company?.data);
        // const plans = await getPlanName(); // Replace with your actual function to get plan names
        // if (plans?.status !== 'Success')
        //   return console.log('getPlanNames Error:', plans?.message);
        // setplan(plans.data);
        
        const creator = await getSelectCreator(); // Replace with your actual function to get plan names
        if (creator?.status !== 'Success')
          return console.log('getPlanNames Error:', creator?.message);
          setCreatorOptions(creator?.data);
      setCreator(creator?.data)
        if (storage.data.role === 'Creator') {
          const selectCreatorData: OptionTypecon[] = creator?.data || [];
          const foundItem = selectCreatorData.find(
            (item) => item.value === storageCreatorId,
          );
          setSelected({ ...selected, companyId: foundItem?.CompanyId });
        }
       
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, []);

  
  // const handleCompanyChange = (selectedOption: OptionType | null) => {
  //   setSelected({ ...selected, companyId: selectedOption.value });
  // };
  const handleCompanyChange = (selectedOption: OptionType | null) => {
    setSelected({
      ...selected,

      companyId: selectedOption.value??'',
      creatorId: '',
    });
  };
  const handleCreatorIdChange = (selectedOption: OptionTypecon | null) => {
    if (selectedOption) {
      setSelected({
        ...selected,
        creatorId: selectedOption.value??'',
        companyId: selectedOption.CompanyId??'',
      });
    } else {
      // Handle the case where selectedOption is null if needed
    }
  };

  // const handlePlanChange = (selectedOption: OptionType | null) => {
  //   setSelected({ ...selected, id: selectedOption.value });
  // };
  const handleClick = async () => {
    let data = JSON.stringify(selected);
    const result = await getCreatorName(data);
    console.log('API Result:', result); // Log the result to check if data is fetched
    if (result?.status !== 'Success') return setApiData([]);
  //    const nestedData = result?.data[0]; // Assuming the nested array is at index 0
  // setApiData(nestedData); // Update the state with the nested data
 setApiData(result?.data)
  };

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const result = await getCreatorName();
//       console.log('API Result:', result);
//       if (result?.status !== 'Success') return setApiData([]);
//       setApiData(result?.data);
//     } catch (error) {
//       console.error('An error occurred while fetching data:', error);
//     }
//   };

//   fetchData();
// }, []);
const handleNoOfGameClick = (creatorId: number) => {
  // const id = 2;
  // Open a new window with specified dimensions
  window.open(
    `/Noofgame/${creatorId}`, // Replace with your desired URL or route /gameAnswer/:id
    'PrintGamesList',
    'width=800,height=600'
  );
};
const handleNoOfGameLaunchedClick = (creatorId: number) => {
  // const id = 2;
  // Open a new window with specified dimensions
  window.open(
    `/Noofgamelaunch/${creatorId}`, // Replace with your desired URL or route /gameAnswer/:id
    'PrintGamesList',
    'width=800,height=600'
  );
};
const handleNoOfGamePublishedClick = (creatorId: number) => {
  // const id = 2;
  // Open a new window with specified dimensions
  window.open(
    `/Noofgamepublish/${creatorId}`, // Replace with your desired URL or route /gameAnswer/:id
    'PrintGamesList',
    'width=800,height=600'
  );
};
const handleNoOfLearnersClick = (id: number) => {
  // Open a new window with specified dimensions
  window.open(
    `/learnerDetails/${id}`,
    'PrintLearnerDetails',
    'width=800,height=600'
  );
};
useEffect(() => {
  handleClick();
}, [selected.companyId, selected.creatorId]);

  return (
    <>
      <Card mt={'20px'} width={'100%'}>
        <SimpleGrid columns={{ base: 1, md: 3, lg: 3 }} spacing={6}>
          <SelectField
            mb="0px"
            id="ctCompanyId"
            name="companyId"
            label="Company Name"
            options={companyOptions}
            isClearable={true}
            onChange={handleCompanyChange}
            value={
              companyOptions.find(
                (option) => option.value === selected.companyId,
              ) || null
            }
            isDisabled={storage.data.role === 'Creator'}
          />
          <SelectField
            mb="0px"
            id="ctId"
            name="creatorId"
            label="Creator Name"
            // options={CreatorOptions}
            options={selected.companyId ? CreatorOptions.filter((option:any) => option.CompanyId === selected.companyId):CreatorOptions}

            onChange={handleCreatorIdChange}
            value={
              CreatorOptions.find(
                (option) => option.value === selected.creatorId
              ) || null
            }
          />

          {/* <Button 
              mt='25px' 
              padding={2} 
              boxShadow={'3px 4px 12px #2e292940'} 
              _hover={{ bg: '#3311db', boxShadow:'3px 4px 12px #2e292975'}} 
              background='#3311db' 
              color='#fff' w={70} 
              onClick={handleClick}>Go</Button> */}
        </SimpleGrid>
      </Card>
      <Flex
        justifyContent="flex-end"
        align={'center'}
        mb={'10px'}
        p={{ sm: '20px 0px', md: '20px' }}
      >
        <Flex
          w={{ sm: '100%', md: 'auto' }}
          alignItems="center"
          flexDirection={{base:'column',sm:'column',md:"row"}}
          bg={menuBg}
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          p="10px"
          borderRadius="20px"
          boxShadow={shadow}
          justifyContent={'space-between'}
        >
          {/* <InputGroup w={{ base: '100%', sm: '100%', md: '200px' }}>
            <InputLeftElement
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
                  icon={
                    <SearchIcon color={searchIconColor} w="15px" h="15px" />
                  }
                />
              }
            /> */}
            {/* <Input
              type="text"
              placeholder="Search..."
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              bg={'#f9f9f9'}
              borderRadius={'14px'}
              w={{ base: '100%', sm: '100%', xl: '300px' }}
            /> 
          </InputGroup>
          {/* <Tooltip
            label="Create a New Creator"
            hasArrow
            placement="right-start"
          >
          <Button
            ml={{ sm: 0, md: 10 }}
            mt={{sm:5,md:0}}
            padding={2}
            boxShadow={'3px 4px 12px #2e292940'}
            _hover={{ bg: '#3311db', boxShadow: '3px 4px 12px #2e292975' }}
            background="#3311db"
            color="#fff"
            w={{ sm: '100%', md: 70 }}
            onClick={handleNavigate}
          >
            New
          </Button>
          </Tooltip> */}
        </Flex>
      </Flex>
      {/* <Card mb={{ base: '0px', xl: '20px' }} mt={'20px'} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'}> */}
      <Box
        overflowX={{ sm: 'scroll', xl: 'scroll' }}
        padding="2px"
        borderRadius={'13px 13px 20px 20px'}
      >
        {/* <Box overflowX={{ sm: 'scroll', xl: 'scroll'}} > */}
        <Table
          {...getTableProps()}
          variant={'simple'}
          overflowX={{ base: 'auto', xl: 'scroll' }}
          style={{
            border: '2px solid #f7f7f7',
          }}
        >
          {/* <Card> */}
          <Thead className="thead" bg={'#f9f9f9'}>
            {headerGroups.map((headerGroup) => (
              <Tr
                {...headerGroup.getHeaderGroupProps()}
                borderBottom={'2px solid #f7f7f7'}
              >
                {headerGroup.headers.map((column) => (
                  <Th
                    whiteSpace={'nowrap'}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    color={'#191919'}
                    textAlign={'start'}
                    // p={'10px 10px'}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} fontSize={'17px'}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  borderBottom={'2px solid #f7f7f7'}
                  _hover={{ bg: '#FAF9F6' }}
                  cursor={'pointer'}
                >
                  {row.cells.map((cell) => {
                    return (
                      <Td
                      whiteSpace={'nowrap'}
                      {...cell.getCellProps()}
                      // p={'12px'}
                      textAlign={'start'}
                      onClick={() => {
                        if (cell.column.id === 'noofgames') {
                          handleNoOfGameClick(row.original.id);
                        } else if (cell.column.id === 'noofgameslaunched') {
                          handleNoOfGameLaunchedClick(row.original.id);
                        } else if (cell.column.id === 'noofgamespublished') {
                          handleNoOfGamePublishedClick(row.original.id);
                        } else if (cell.column.id === 'nooflearners') {
                          handleNoOfLearnersClick(row.original.id);
                        }
                      }}
                    >  {cell.render('Cell')}</Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {/* </Box> */}
      </Box>
      <Box
        pt={'20px 5px'}
        display={{ base: 'block', xl: 'flex' }}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box mb={5}>
          <Box mr={'10px'} color={'#000'}>
            <span style={{ color: '#20212396' }}>
              Page{' '}
              <span>
                {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
              </span>{' '}
            </span>
          </Box>
        </Box>
        <Box display={{ base: 'flex', xl: 'flex' }}>
          <Box mr={'10px'} display={'flex'} alignItems={'center'}>
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              bg={'#f3f0f0'}
              mr={'5px'}
              h={'40px'}
              w={'40px'}
              borderRadius="50%"
              lineHeight="1em"
              flexShrink={0}
              fontWeight={800}
            >
              {'<'}
            </Button>{' '}
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                h={'40px'}
                w={'40px'}
                mr={'5px'}
                borderRadius="100px"
                lineHeight="1em"
                flexShrink={0}
                fontWeight={800}
                background={pageIndex + 1 === page ? '#3311db' : 'unset'}
                color={pageIndex + 1 === page ? '#fff' : 'unset'}
                onClick={() =>
                  typeof page === 'number' ? handleGoPage(page - 1) : null
                }
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              bg={'#f3f0f0'}
              h={'40px'}
              w={'40px'}
              borderRadius="100px"
              lineHeight="1em"
              flexShrink={0}
              fontWeight={800}
            >
              {'>'}
            </Button>{' '}
          </Box>
          <Box>
            {/* <span>
              {' '}
              <Input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '50px' }}
              />
            </span>{' '} */}
            {/* <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              style={{
                border: '1px solid #56555930',
                padding: '5px',
                borderRadius: '7px',
                height: '40px',
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select> */}
          </Box>
        </Box>
      </Box>

      {/* </Card> */}
    </>
  );
};

export default CreatorActivityDataTable;
