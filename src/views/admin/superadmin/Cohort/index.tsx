import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import Card from 'components/card/Card';
import CohortsDataTable from './components/CohortsDataTable';
import { MdEdit, MdDelete } from 'react-icons/md';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import { getIndustry,deleteIndustry,IndustryStatus } from 'utils/industry/industry';
import {getAllCohorts,reomvecohorts} from 'utils/cohorts/cohorts';
import { Switch } from '@chakra-ui/react'
interface IndustryData {
  label: any;
  sNo: number;
  chId:any;
  CohortName: string;
  NoGames: any;
  NoLearners: any;
  Nooflearners:number;
  // status: JSX.Element; // Change from 'string' to 'JSX.Element'
  action: JSX.Element; // Change from 'string' to 'JSX.Element'
  // lenUserName:any;
  // lenMail:any;
  value:any;
}

interface RowObj {
  sNo: number;
  CohortName: string;
  chId:any;
  NoGames: any;
  NoLearners: any;
  // status: JSX.Element; // Change from 'string' to 'JSX.Element'
  action: JSX.Element; // Change from 'string' to 'JSX.Element'
  // lenUserName:any;
  // lenMail:any;
  
  value:any;
}

const CohortsTableCreation: React.FC = () => {
  const [apiData, setApiData] = useState<IndustryData[]>([]);
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [msg, setMsg] = useState<string>('');
    const [toastStatus, setToastStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number>();
  const [formData, setFormData] = useState({
    lenStatus: '',
  });
  const navigate = useNavigate();
  const fetchData = async () =>{
    const result = await getAllCohorts();
    if(result?.status !== 'Success') return console.log('getIndustry Error :',result?.message);
    setApiData(result?.data);
  } 
const cohortId= apiData.map(data => data.value);
  const handleDelete = async (chId: number) => {
    setDeleteId(chId);
    setIsOpen(true); 
  };

  const handleNavigate = (itId?: number) => {
    if (itId) {
      navigate(`/admin/superadmin/cohort/creation/${itId}`);
    } else {
      navigate('creation');
    } 
  };
  const actionBtns = (data: any) => {    
    return (
      <Flex>
        <Tooltip placement='top' label="Edit">
          <div>
            <IconButton
              icon={<MdEdit />}
              onClick={() => handleNavigate(data?.value)}
              aria-label="Edit"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
        <Tooltip placement='top' label="Delete">
          <div>              
            <IconButton
              icon={<MdDelete />}
            onClick={() => handleDelete(data?.value)}
              aria-label="Delete"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
      </Flex>
    )
  }
  const handleCohortsPrintClick = (cohortid:any) => {
    // const id=19;
  
    // window.open(`/CohortsLearnerPrint/${id}`, // Correct URL with dynamic ID
    //   // Correct URL with dynamic ID
      
    //   'width=800,height=600'
    // );

    window.open(
      `/CohortsLearnerPrint/${cohortid}`, // Correct URL with dynamic ID
      `FeedBackGameWise`, // Correct URL with dynamic ID
      
      'width=800,height=600'
    );
  };


  const handlecohortsClick = (cohortid:any) => {
    // const id = 88;
    // Open a new window with specified dimensions
    window.open(
      `/coshorts/${cohortid}`, // Replace with your desired URL or route /gameAnswer/:id
      'coshorts',
      'width=800,height=600'
    );
  };

  const transformData = (apiData: IndustryData[]): RowObj[] => {
   
    return apiData.map((data, index) => ({
      sNo: index + 1,
      chId:data.value,
      CohortName: data.label,
      value:data.value,
      // NoGames: data.NoGames,
      NoGames: (
        <span
        style={{
          backgroundColor: 'transparent', // Make the background transparent
          color: '#007bff', // Change the text color
          padding: '0', // Remove padding
          border: 'none', // Remove border
          borderRadius: '0', // Remove border-radius
          cursor: 'pointer', // Keep the cursor pointer for click indication
          display: 'inline-block',
          fontSize: '14px',
          // textDecoration: 'underline', // Optionally underline the text to indicate it's clickable
        }}
        onClick={() => handlecohortsClick(data.value)}
      >
        {data.NoGames}
      </span>
      ),
      // NoLearners: data.Nooflearners,
      NoLearners: (
        <span
        style={{
          backgroundColor: 'transparent', // Make the background transparent
          color: '#007bff', // Change the text color
          padding: '0', // Remove padding
          border: 'none', // Remove border
          borderRadius: '0', // Remove border-radius
          cursor: 'pointer', // Keep the cursor pointer for click indication
          display: 'inline-block',
          fontSize: '14px',
          // textDecoration: 'underline', // Optionally underline the text to indicate it's clickable
        }}
          onClick={()=>handleCohortsPrintClick(data.value)} // Assuming data.sNo is the ID
        >
          {data.Nooflearners}
        </span>
      ),
      // lenUserName:data.lenUserName,
  // lenMail:data.lenMail,
      // status: (
      //   <Switch
      //     colorScheme={'brandScheme'}
      //     // onChange={() => handleStatus(data?.itId, 'Active')}
      //     // defaultChecked={data?.itStatus === 'Active'}
      //   />
      // ),
      action: actionBtns(data),
    }));
  };

  useEffect(() => {
    const deleteData = async () => {
      try {
        if (isConfirm && deleteId) {
          const result = await reomvecohorts(deleteId);
          if (result?.status !== 'Success') {
            setIsOpen(false);
            setMsg('Cohorts Not Deleted: ' + result?.message);
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            return;
          }
  
          setIsOpen(false);
          setMsg('Cohorts Deleted');
          setToastStatus('success');
          setAlert(true);
          setIsConfirm(false);
          fetchData();
        }
      } catch (error) {
        console.error('Error in deleteData:', error);
      }
    };
  
    deleteData();
  }, [isConfirm, deleteId]);
  
  useEffect(()=>{
    fetchData();
  },[]);

  const transformedData: RowObj[] = transformData(apiData);

  return (
    <>
      <Box mb={{ base: '75px', md:'100px', xl: '100px' }}></Box>
      {/* <Card mb={{ base: '0px', xl: '20px' }} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'}>             */}
        <CohortsDataTable data={transformedData} />
      {/* </Card> */}
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={''} setmsg={''} /> : null }
      {alert  ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert}
 /> : null}  
    </>
  );
};

export default CohortsTableCreation;
