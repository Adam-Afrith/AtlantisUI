import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, TableInstance } from 'react-table';
import SelectField from 'components/fields/SelectField';
import { SiAnswer } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";

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
    FormLabel,
    Img,
    Table, 
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
  } from '@chakra-ui/react';

  // Custom Imports
import InputField from 'components/fields/InputFieldtwo';
import TextField from 'components/fields/TextField';
import Card from 'components/card/Card';
import OnToast from 'components/alerts/toast';
import { addLearner, getLearnerById, learnerAdd, updateLearner } from 'utils/leaner/leaner';
import Select from 'react-select';
import { createCompany, editCompany, getCompany, getCountries } from 'utils/company/companyService';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompanyList, getSelectCreator } from 'utils/creator/creator';
import { getAllCohorts, getAllLearner } from 'utils/leaner/leaner';
import { SearchIcon } from '@chakra-ui/icons';
import {getGameWiseData} from 'utils/activitycontrols/activities'
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import { BiCommentDetail } from "react-icons/bi";

import {
    IconButton,
    InputGroup,
    InputLeftElement,
  } from '@chakra-ui/react';

// interface CreatorData {
//     lenId: number;
//   creator: {
//     ctName: string;
//     // other properties of creator...
//   };
//   lenUserName: string; 
//   lenMail: string;
  
//   lenStatus: string;
//   lenCompanyId:string;
// }

// interface CreatorData {
//     lenId: number;
//     creator: {
//       ctName: string;
//       // other properties of creator...
//     };
//     lenUserName: string; 
//     lenMail: string;
    
//     lenStatus: string;
//     lenCompanyId:string;
//   }
  
  // interface RowObj {
  //   sNo: number;
  //   creatorName: string;
  //   learnerName: string;
  //   learnerMail: string;
  //   cohorts: any;
  //   status: any;
  //   addGame: any;
  //   action: any;
  // }
  interface CreatorData {
    sNo: number;
    lenCreatorId: any;
    GameName: string;
    learnerMail: string;
    
    status: any;
/////////////////////////
gamesAssignCount:any,
    started:any,
    completed:any,
    passed:any,
    originalScore:any,
    finalScore:any,
    progress:any,
    skillWiseScore:any,
    timesAttended:any,
    answers:any,
    // timeSpent:any,
    learnerFeedback:any,
    gameID:any,
 /////////////////////////  
    // action: any;
    // companyName:any;
    // lenId: number;
    // lenStatus: string;
     lenCompanyId:any
  };
  
  type RowObj = {
    sNo: number;
    lenCreatorId: any;
    GameName: string;
    learnerMail: string;
    
    status: any;
/////////////////////////
gamesAssignCount:any,
    started:any,
    completed:any,
    passed:any,
    originalScore:any,
    finalScore:any,
    progress:any,
    skillWiseScore:any,
    timesAttended:any,
    answers:any,
    // timeSpent:any,
    learnerFeedback:any,
    gameID:any;
 /////////////////////////  
    // action: any;
    // companyName:any;
    // lenId: number;
    // lenStatus: string;
    // lenCompanyId:string
    lenCompanyId:any
  };
  
  interface OptionType {
    value: string;
    label: string;
  }
  interface ColumnObj {
    Header: number | string;
    accessor: keyof RowObj;
  }
  interface planType {
    plPlan: string;
    plId: string;
    // other properties if any
  }
  interface CreatorDataTableProps {
    data: RowObj[];
    setApiData: React.Dispatch<React.SetStateAction<CreatorData[]>>;
    setCompany:any;
    setCreators:any;
    apiData:any;
  }
  
  type DataCol = TableInstance<RowObj>;

const CreatorDataTable: React.FC<CreatorDataTableProps> = ({ data,setApiData,setCompany,setCreators,apiData }) => {
  // console.log("receivedID",fetchedID)
  const storage = JSON.parse(localStorage.getItem('user'));
 

  let storageCreatorId = '';
  const UserRole=storage.data.role;
  if (storage.data.role === 'Creator') {
    storageCreatorId = storage.data.id;
  }
  const [lastPage, setLastPage] = useState<any>();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [selectedAssignOption, setSelectedAssignOption] = useState<OptionTypecon | null>(null);
  const [assignedOptions, setAssignedOptions] = useState([
    { value: '1', label: 'Assigned' },
    { value: '2', label: 'Not Assigned' },
  ]);

  const [progressOptions] = useState([
    { value: '<50%', label: '<50%' },
    { value: '>50%', label: '>50%' },
    { value: '>75%', label: '>75%' },
    // Add more options as needed
  ]);
  const [selected,setSelected] = useState({companyId:'',creatorId:'',cohortId:'',gamesAssignCount:'',progress:''});
  // const [creators, setCreators] = useState([]),
       const [cohorts,setCohorts] = useState([]);
  const navigate = useNavigate();  
  const searchIconColor = useColorModeValue('gray.700', 'white');
let menuBg = useColorModeValue('white', 'navy.800');
 const shadow = useColorModeValue(
  '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
  '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
);       
  interface OptionTypecon {
    value: string;
    label: string;
    CompanyId: string;
}                   
  const handleNavigate= () => {
    navigate('creation');
  } 

  const columns: ColumnObj[] = React.useMemo(() => {
    let userRoleColumns: ColumnObj[];
  
    // Define columns based on user role
    if (UserRole === 'Creator') {
      userRoleColumns = [
        { Header: 'S.No', accessor: 'sNo' },
        //  { Header: 'Company Name', accessor: 'lenCompanyId' },
        // { Header: 'Creator Name', accessor: 'lenCreatorId' },
        { Header: 'Game Name', accessor: 'GameName' },
        { Header: 'Games Assigned', accessor: 'gamesAssignCount' },
        { Header: 'Started', accessor: 'started' },
        { Header: 'Completed', accessor: 'completed' },
        { Header: 'Passed', accessor: 'passed' },
        { Header: 'Original Scores', accessor: 'originalScore' },
        { Header: 'Final Scores', accessor: 'finalScore' },
        { Header: 'Progress', accessor: 'progress' },
        { Header: 'Skill-Wise Scores', accessor: 'skillWiseScore' },
        { Header: 'No.of Times Attended', accessor: 'timesAttended' },
        { Header: 'Answers', accessor: 'answers' },
        // { Header: 'Time Spent', accessor: 'timeSpent' },
        { Header: 'Learner Feedback', accessor: 'learnerFeedback' },
        // { Header: '', accessor: 'action' },
      ];
    } else if (UserRole === 'Admin') {
      // Define columns for creator role
      userRoleColumns = [
        { Header: 'S.No', accessor: 'sNo' },
        // { Header: 'Company Name', accessor: 'lenCompanyId' },
        // { Header: 'Creator Name', accessor: 'lenCreatorId' },
        { Header: 'Game Name', accessor: 'GameName' },
        { Header: 'Games Assigned', accessor: 'gamesAssignCount' },
        { Header: 'Started', accessor: 'started' },
        { Header: 'Completed', accessor: 'completed' },
        { Header: 'Passed', accessor: 'passed' },
        { Header: 'Original Scores', accessor: 'originalScore' },
        { Header: 'Final Scores', accessor: 'finalScore' },
        { Header: 'Progress', accessor: 'progress' },
        { Header: 'Skill-Wise Scores', accessor: 'skillWiseScore' },
        { Header: 'No.of Times Attended', accessor: 'timesAttended' },
        { Header: 'Answers', accessor: 'answers' },
        // { Header: 'Time Spent', accessor: 'timeSpent' },
        { Header: 'Learner Feedback', accessor: 'learnerFeedback' },
        // { Header: 'Action', accessor: 'action' },
      ];
    } 
    return userRoleColumns;
  }, [UserRole]);

  
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
    usePagination
  );
  // const mappedPlanOptions = Array.isArray(creators)
  // ? creators.map((creators) => ({
  //   value: creators.plId, // Convert to string if necessary
  //   label: creators.plPlan,
  // }))
  // : [];
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
    const pageCount = 5; // Adjust the number of visible page numbers as needed
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
  console.log("data came")
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const coh = await getAllCohorts();
        // if (coh?.status !== 'Success') return console.log('getCountries Error :', coh?.message);
        // setCohorts(coh?.data);
        const company = await getCompanyList();
        if (company?.status !== 'Success')
          return console.log('getCountries Error :', company?.message);
        setCompanyOptions(company?.data);
        setCompany(company?.data);

        const creator = await getSelectCreator(); // Replace with your actual function to get plan names
        if (creator?.status !== 'Success')
          return console.log('getPlanNames Error:', creator?.message);
          setCreatorOptions(creator.data);
          setCreators(creator.data)
          
        if (storage.data.role === 'Creator') {
        const selectCreatorData: OptionTypecon[] = creator?.data || [];
        const foundItem = selectCreatorData.find(item => item.value === storageCreatorId);
        setSelected({ ...selected, companyId: foundItem?.CompanyId });
        }
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleCompanyChange = (selectedOption: OptionType | null) => {
      
       
    setSelected({
        ...selected,
        
        companyId: selectedOption.value,
        creatorId: '',
      });
    
};


  const handleCreatorIdChange = (selectedOption: OptionTypecon | null) => {
    if (selectedOption) {
      setSelected({
        ...selected,
        creatorId: selectedOption.value,
        companyId: selectedOption.CompanyId
      });
    } else {
      // Handle the case where selectedOption is null if needed
    }
  };

  // const handleGameAssign = (selectedOption:any) => {
  //   setSelected({ ...selected, gamesAssignCount: selectedOption?.value });
  //   // Perform any other operations based on the selected option if needed
  // };
  const gameAssignid=apiData.map((data:any)=>data.gameID);
  
  const handleGameAssign = (selectedOption: OptionTypecon | null) => {
    // Check if the selected option is "Assigned"
    if (selectedOption && selectedOption.value === '1') {
      setSelected({ ...selected, gamesAssignCount: gameAssignid });
    } else {
      // If "Not Assigned" or any other option is selected, don't send gameID
      setSelected({ ...selected, gamesAssignCount: null });
    }
    
    setSelectedAssignOption(selectedOption);
  };


  const handleProgress = (selectedOption:any) => {
    setSelected({ ...selected, progress: selectedOption?.value });
    // Perform any other operations based on the selected option if needed
  };

  const handleCohortChange = (selectedOption: OptionType | null) => {
    setSelected({ ...selected, cohortId: selectedOption?.value });
  };
  const handleClick = async () => {
    let data = JSON.stringify(selected);
    const result = await getGameWiseData(data);
    if (result?.status !== 'Success') return setApiData([]);
    setApiData(result?.data);
  }
  console.log("apiData",apiData)
  const gameId=apiData.map((data:any)=>data.gameID)
  console.log("gameId",gameId)
  
  useEffect(() => {
    handleClick();
  }, [selected.companyId,selected.creatorId,selected.gamesAssignCount]);


  
  return (
    <>
     {/* <Box w={'100%'} display={'flex'} justifyContent={'center'}> */}
      <Card mt={'20px'} width={'100%'}>
      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 3 }}
        
        // ml="30px"
        spacing={6}
      >
        {/* fsdfdsa */}

        {UserRole === 'Admin' ? (
  <>
    {/* Admin content goes here */}
    <SelectField
      mb="0px"
      id="ctCompanyId"
      name="companyId"
      label="Company Name"
      options={companyOptions}
      onChange={handleCompanyChange}
      value={
        companyOptions.find(
          (option) => option.value === selected.companyId,
        ) || null
      }
      isDisabled={storage.data.role === 'Creator'}
      isClearable={true}
    />
    <SelectField
      mb="0px"
      id="ctCompanyId"
      name="planId"
      label="Creator Name"
      // options={creatorOptions}
      options={selected.companyId ? creatorOptions.filter((option:any) => option.CompanyId === selected.companyId):creatorOptions}

      onChange={handleCreatorIdChange}
      value={
        creatorOptions.find(
          (option) => option.value === selected.creatorId,
        ) || null
      }
      isClearable={true}
    />
        <SelectField
      mb="0px"
      id="gamesAssigned"
      name="gamesAssigned"
      label="Games Assigned"
      options={assignedOptions}
      onChange={handleGameAssign}
      // value={
      //   assignedOptions.find(
      //     (option) => option.value === selected.gamesAssignCount,
      //   ) || null
      // }
      value={selectedAssignOption}
      isDisabled={storage.data.role === 'Creator'}
      isClearable={true}
    />
    {/* <SelectField
        mb="0px"
        id="progress"
        name="progress"
        label="Progress"
        options={progressOptions}
        onChange={handleProgress}
        value={
          progressOptions.find((option) => option.value === selected.progress) || null
        }
        isDisabled={storage.data.role === 'Creator'}
        isClearable={true}
        // Rest of your props for the Progress dropdown
      /> */}
  </>
) : null}

       

         {/* <SelectField
          mb="0px"
          id="ctCompanyId" 
          name="planId"
          label="Cohorts"
          options={cohorts}
          onChange={handleCohortChange}
          value={
            cohorts.find(
              (option) => option.value === selected.cohortId,
            ) || null
          }
          isClearable={true}
        /> */}
        {/* <Button
          mt="25px"
          padding={2}
          boxShadow={'3px 4px 12px #2e292940'}
          _hover={{ bg: '#3311db', boxShadow: '3px 4px 12px #2e292975' }}
          background="#3311db"
          color="#fff"
          w={70}
          onClick={handleClick}
        >
          Go
        </Button> */}
      </SimpleGrid>
      </Card> 
      {/* </Box> */}
      
      <Flex
        justifyContent="flex-end"
        align={'center'}
        mb={'10px'}
        p={'20px'}
      >
      <Flex
      w={{ sm: '100%', md: 'auto' }}

      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={{ base: 'wrap', md: 'nowrap' }}
      p="10px"
      borderRadius="999px"
      boxShadow={shadow}
    >
        <InputGroup w={{ base: '100%', md: '200px' }} >
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
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
          />
        }
      />
          <Input
            type="text"
            placeholder="Search..."
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            bg={'#f9f9f9'}
            borderRadius={'14px'}
            w={{ base: '200px', xl: '300px' }}
          />
       
          </InputGroup>
          {/* <Button
         ml={10}
          padding={2}
          boxShadow={'3px 4px 12px #2e292940'}
          _hover={{ bg: '#3311db', boxShadow: '3px 4px 12px #2e292975' }}
          background="#3311db"
          color="#fff"
          w={70}
          onClick={handleNavigate}
        >
          New
        </Button> */}
       
        </Flex>
       
      </Flex>
      {/* <Card mb={{ base: '0px', xl: '20px' }} mt={'20px'} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'}> */}
      <Box overflowX={{ sm: 'scroll', xl: 'scroll'}} padding="20px">
        <Table
          {...getTableProps()}
          variant={'simple'}
          overflowX={{ base: 'auto', xl: 'unset' }}
        >
          {/* <Card> */}
          <Thead
            className="thead"
            bg={'#E9EDF7'}
          >
            {headerGroups.map((headerGroup) => (
              <Tr
                {...headerGroup.getHeaderGroupProps()}
                borderBottom={'2px solid #f7f7f7'}
              >
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    color={'#191919'}
                    textAlign={'start'}
                    p={'15px 10px'}
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
                <Tr {...row.getRowProps()} borderBottom={'2px solid #E0E0E0'}>
                  {row.cells.map((cell) => {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        className='learnerForAction'
                        p={'12px'}
                        textAlign={'start'}
                      >
                       
                {cell.column.id === 'gamesAssignCount' ? (
               
                  row.original.gamesAssignCount === 'yes' ? (
                  
                  row.original.gamesAssignCount
                ) : (
                 
                  row.original.gamesAssignCount
                )
              ) : (
                
                cell.render('Cell')
              )}

                             
                  {/* {cell.column.id === 'learnerFeedback'&& apiData.map ? (
                  <button  onClick={()=>handleFeedBackClick(data.gameID)}>
                   
                            <VscFeedback />
                  </button>
                ) : null} */}
                
                {/* {cell.column.id === 'learnerFeedback'  ? (

) : null}


                       
                         {cell.column.id === 'answers' ? (
                        
                      ) : null} */}
                     
                      </Td>
                    );
                  })}
                  
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Box
        p={'20px'}
        display={{ base: 'block', xl: 'flex' }}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box>
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
          <Box mr={'10px'}>
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              bg={'#f3f0f0'}
              h={'35px'}
              w={'40px'}
             borderRadius='50%'
              lineHeight="1em"
              flexShrink={0}
              fontWeight={800}
            >
              {'<'}
            </Button>{' '}
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                mr={'5px'}
                h={'35px'}
                w={'40px'}
                borderRadius='50%'
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
              h={'35px'}
              w={'40px'}
              borderRadius='50%'
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
            </span>{' '}
            <select
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

export default CreatorDataTable;
