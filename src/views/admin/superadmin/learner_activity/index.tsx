import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import Card from 'components/card/Card';
import LearnerActivityDataTable from './components/learnerActivtyDataTable'
import { MdEdit, MdDelete, MdGroupAdd, MdDone, MdClose, MdVideogameAsset, MdVisibility  } from 'react-icons/md';
// import { addLearner, getLearnerById, updateLearner, learnerStatus } from 'utils/leaner/leaner';
import { getAllLearners} from 'utils/activitycontrols/activities';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast'; 
import { Switch } from '@chakra-ui/react'
interface LearnerActivityData {
  sNo: number;
  lenUserName: string;
  lenCompanyId:any;
  lenMail: string;
  gamesAssignedCount:any,
  gamePlayed:any,
  score:any,
  leanerId:number,
  originalScore:any,
  finalScore:any,
  progress:any,
  skillWiseScore:any,
  timeSpent:any,
  lastActive:any,
  
}

interface RowObj {
  sNo: number;
 
  lenUserName: string;
  lenCompanyId:any;
  lenMail: string;
  // status: any;
  gamesAssignedCount:any,
  gamePlayed:any,
  score:any,
  originalScore:any,
  finalScore:any,
  progress:any,
  skillWiseScore:any,
  timeSpent:any,
  lastActive:any,
  // timesAttended:any,
  // answers:any,
 
/////////////////////////  
}

interface LearnerActivityDataTableProps {
  data: RowObj[];
}

const CreatorCreation: React.FC = () => {
  const storage = JSON.parse(localStorage.getItem('user'));
 
  const UserRole=storage.data.role;
  const [apiData, setApiData] = useState<LearnerActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyNames, setCompany] = useState([]);
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [msg, setMsg] = useState<string>('');
    const [toastStatus, setToastStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number>();

  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  console.log("first index");
  const fetchData = async () => {
    console.log("result  4321 index");
    const resultfromlearners = await getAllLearners();
    console.log("result  4321 indexxx",resultfromlearners);
    if (resultfromlearners?.status !== 'Success') return console.log('getCreator Error :', resultfromlearners?.message);
    setApiData(resultfromlearners?.data);
  }
  const [formData, setFormData] = useState({
    lenStatus: '',
  });
  const [openCoharts, setOpenCoharts] = useState(false);
  const [openGame, setOpenGame] = useState(false);
  const [learnerId, setLearnerId] = useState<number | null>(null);

  console.log("apiData",apiData)
  const handleDelete = async (lenId: number) => {
    setDeleteId(lenId);
    setIsOpen(true);
     
  };


  const handleCoharts = (lenId?: number) => {
    setLearnerId(lenId || null);
    setOpenCoharts(true);
  }
  
  const handleGame = (lenId?: number) => {
    setLearnerId(lenId || null);
    setOpenGame(true);
  }


  const getCompanyNameLabel = (lenCompanyId: string): string => {
   
    const companyOption = companyNames.find(
      option => option.value === Number(lenCompanyId)
    );

    return companyOption ? companyOption.label : '';
  };
  console.log("companyNames",companyNames)
  const handleNavigate = (lenId?: number) => {
    if (lenId) {
      navigate(`/admin/superadmin/learner/update/${lenId}`);
    } else {
      navigate('creation');
    }
  };

  ///Afrith-03-JAN-24
  const handleView = (lenId?: number) => {
    if(lenId){
      navigate(`/admin/superadmin/learner/activity/${lenId}`);
    } else{
      navigate('creation');
    }
      
  };
  ///////////////////////////////////////
 
  // Lokie Worked 04/06/2024
  const handleClickAssinedGame = (leanerId:number)=>{

    window.open(`/AssignedGames/${leanerId}`, 'AssignedGamesWindow', 'width=800,height=600');
  }
  const handleBlockScore = (leanerId:number)=>{

    window.open(`/BlockGameScore/${leanerId}` ,'width=800,height=600');
  }




  const actionBtns = (data: any) => {      
    return (
      <Flex>
        <Tooltip placement='top' label="EditZ">
          <div>
            <IconButton
              icon={<MdEdit />}
              onClick={() => handleNavigate(data?.lenId)}
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
              onClick={() => handleDelete(data?.lenId)}
              aria-label="Delete"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
        {/******Afrith-modified-03-JAN-24***************/}
        <Tooltip placement='top' label="View">
          <div>
            <IconButton
              icon={<MdVisibility />}
              onClick={() => handleView(data?.lenId)}
              aria-label="View"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
        {/******AFrith-modified-03-JAN-24************/}
      </Flex>
    )
  }

  const transformData = (apiData: LearnerActivityData[] | { count: number; rows: LearnerActivityData[] }): RowObj[] => {
    // Extract the array from 'rows' if apiData is an object
    const dataArray = Array.isArray(apiData) ? apiData : apiData.rows;

    // Check if dataArray is an array
    if (!Array.isArray(dataArray)) {
      console.log("Data is not an array!",dataArray);
      return [];
    }

    // Get the current date
    const currentDate = new Date().getTime();

    return dataArray.map((data, index) => ({
     
      sNo: index+1,
      lenUserName: data.lenUserName,
      lenCompanyId:companyNames.find(item => item.value === data.lenCompanyId)?.label,

      lenMail: data.lenMail,
    gamesAssignedCount: (
      <span
      style={{
        backgroundColor: 'transparent',
        // color: '#',
        padding: '0', 
        border: 'none', 
        borderRadius: '0', 
        cursor: 'pointer', 
        display: 'inline-block',
        fontSize: '14px',
        
      }}
      onClick={() => handleClickAssinedGame(data?.leanerId)}
    >
      {data.gamesAssignedCount}
    </span>
    ),
    gamePlayed: data.gamePlayed,
    score:data.score,
    originalScore: data.originalScore,
    finalScore:data.finalScore,
    progress: data.progress,
    // skillWiseScore: null,
    skillWiseScore: (
      <span
      style={{
        backgroundColor: 'transparent',
        // color: '#007bff',
        padding: '0', 
        border: 'none', 
        borderRadius: '0', 
        cursor: 'pointer', 
        display: 'inline-block',
        fontSize: '14px',
        
      }}
      onClick={() => handleBlockScore(data?.leanerId)}
    >
      {data.gamesAssignedCount}
    </span>
    ),
    timeSpent:data.timeSpent,
    lastActive: data.lastActive,
    // timesAttended: data.timesAttended,
    // answers: data.answers,
    // learnerFeedback: "Great work!",
    
    
      ///////////
      // action: actionBtns(data),
      // status: (
      //   <>
      //   {/* data?.lenStatus */}
      //    <Switch  colorScheme={'brandScheme'} onChange={() => handleStatus(data?.lenId, 'Active')} defaultChecked={data?.lenStatus === 'Active'} />
        
      //   </>
      // ),
    }))

    
  };

  // const transformedData: RowObj[] = transformData(apiData);
  const transformedData: RowObj[] = transformData(apiData);

  //     // Define role-specific properties
  //     let roleSpecificProperties: any = {};
  //     if (UserRole === 'Admin') {
  //       roleSpecificProperties = {
         
  //         companyName:getCompanyNameLabel(data.companyName),
         
  //       };
  //     } else{

  //     }
  
  //     // Combine common and role-specific properties
  //     const rowData: RowObj = {
  //       ...commonProperties,
  //       ...roleSpecificProperties,
       
      
  //     };
  
  //     return rowData;
  //   });
  // };
  
  useEffect(() => {

    fetchData();
  
  }, []);

  // const transformedData: RowObj[] = transformData(apiData, UserRole);
  // const handleSaveSelectedValues = (selectedIds: number[]) => {
  //   // Do something with the selectedIds
  //   console.log('Selected Values:', selectedIds);
  // };


  return (
    <> 
      <Box mb={{ base: '135px',md:'100px', xl: '100px' }}></Box> 
                       
        
        <LearnerActivityDataTable data={transformedData} setApiData={setApiData} setCompany={setCompany}/>
        
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={''} setmsg={''} /> : null }
      {alert  ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert}
 /> : null}
    </>

  );
};

export default CreatorCreation;
