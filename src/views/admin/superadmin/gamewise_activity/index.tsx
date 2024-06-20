import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import Card from 'components/card/Card';
import GameWiseActivity from './components/gamewiseActivity';
import { MdEdit, MdDelete, MdGroupAdd, MdDone, MdClose, MdVideogameAsset, MdVisibility  } from 'react-icons/md';
import { addLearner, getLearnerById, updateLearner, learnerStatus } from 'utils/leaner/leaner';
import { deleteLearner, getAllLearner } from 'utils/leaner/leaner';
import {getGameWiseData} from 'utils/activitycontrols/activities'
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import { Switch } from '@chakra-ui/react'
import { SiAnswer } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { RiQuestionAnswerFill ,RiFeedbackFill } from "react-icons/ri";
// interface CreatorData {
//  
//   creator: {
//     ctName: string;
//     // other properties of creator...
//   };
//   lenUserName: string;
//   lenMail: string;
// lenId: number;
//   lenStatus: string;
//   lenCompanyId:string;
// }

interface CreatorData  {
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
/////////////////////////  
  // action: any;
  lenCompanyId:any,
  // lenId: number;
  // lenStatus: string;
  // lenCompanyId:string;
  gameID:any
};

interface RowObj {
  sNo: number;
  lenCreatorId: any;
  GameName: string;
  learnerMail: string;
  status: any;
  // action: any;
  lenCompanyId:any
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
gameID:any
// lenId: number;
// lenStatus: string;
// lenCompanyId:string
/////////////////////////  
}

interface CreatorDataTableProps {
  data: RowObj[];
}

const CreatorCreation: React.FC = () => {
  const storage = JSON.parse(localStorage.getItem('user'));
 
  const UserRole=storage.data.role;
  const [apiData, setApiData] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyNames, setCompany] = useState([]);
  const [creators, setCreators] = useState([]);
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [msg, setMsg] = useState<string>('');
    const [toastStatus, setToastStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number>();

  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const fetchData = async () => {
    const result = await getGameWiseData();
    if (result?.status !== 'Success') return console.log('getCreator Error :', result?.message);
    setApiData(result?.data);
    
  }

  console.log("apiData",apiData)
  const fetchedID = apiData.map(data => data.gameID);
   
    // const fetchedID = apiData.length > 0 ? apiData[0].gameID : null;

    console.log("fetchedID",fetchedID)


    
  const [formData, setFormData] = useState({
    lenStatus: '',
  });
  const [openCoharts, setOpenCoharts] = useState(false);
  const [openGame, setOpenGame] = useState(false);
  const [learnerId, setLearnerId] = useState<number | null>(null);

  const handleDelete = async (lenId: number) => {
    setDeleteId(lenId);
    setIsOpen(true);
     
  };

  
  //   const handleCoharts = () => {
  //     setOpenCoharts(true);
  // }


  useEffect(() => {
    const deleteData = async () => {
   if(isConfirm){
    if(deleteId){

      const result = await deleteLearner(deleteId);
      if(result?.status !== 'Success'){
        console.log('deleteLearner Error :',result?.message);
          setIsOpen(false);
        setMsg('Creator Not Deleted');
        setToastStatus('error');
        setAlert(true);
        setIsConfirm(false);
        return;

      } 
      setIsOpen(false);
      setMsg('Creator Deleted');
        setToastStatus('success');
        setAlert(true);
        setIsConfirm(false);
      fetchData();

    }

   
   }
  }
  deleteData()
  }, [isConfirm,deleteId]);

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
  const handleStatus = async (lenId?: number, status?: string) => {
    setFormData(formData => ({
      ...formData,
      lenStatus: status
    }));
    let data = JSON.stringify(formData);
    if (lenId) {
      const result = await learnerStatus(lenId, data);

      if (result?.status !== 'Success') return console.log('updateLearner Error:', result?.message);
      fetchData();
      navigate('/admin/superadmin/learner');
    };
  }

//kishore start
const handleFeedBackClick = (gameId:any) => {
  // const id=2;
  console.log(`Answer clicked for row: ${gameId}`);

  window.open(
    `/gameFeedback/${gameId}`, // Correct URL with dynamic ID
    `FeedBackGameWise`, // Correct URL with dynamic ID
    
    'width=800,height=600'
  );
};
////kishore end

//leo start
const handleAnswerClick = (gameId:any) => {
  // const id = 2;
  console.log(`Answer clicked for row: ${gameId}`);
  // Open a new window with specified dimensions
  window.open(
    `/gameAnswer/${gameId}`, // Replace with your desired URL or route /gameAnswer/:id
    'printGameWiseActivity',
    'width=800,height=600'
  );
};

const handleSkillScore= (gameId:any) => {
  // const id=2;
  console.log(`Answer clicked for row: ${gameId}`);

  window.open(
    `/getSkillWiseScore/${gameId}`, // Correct URL with dynamic ID
    `SkillWiseScorePrint`, // Correct URL with dynamic ID
    
    'width=800,height=600'
  );
};

//leo end

const handleGameAssign= (gameId:any) => {
  // const id=2;
  console.log(`Answer clicked for row: ${gameId}`);

  window.open(
    `/getGameAssignData/${gameId}`, // Correct URL with dynamic ID
    `SkillWiseScorePrint`, // Correct URL with dynamic ID
    
    'width=800,height=600'
  );
};
const handleComplete= (gameId:any) => {
  // const id=2;
  console.log(`Answer clicked for row: ${gameId}`);

  window.open(
    `/getGameComplete/${gameId}`, // Correct URL with dynamic ID
    `SkillWiseScorePrint`, // Correct URL with dynamic ID
    
    'width=800,height=600'
  );
};

const handleStarted= (gameId:any) => {
  // const id=2;
  console.log(`Answer clicked for row: ${gameId}`);

  window.open(
    `/getStarted/${gameId}`, // Correct URL with dynamic ID
    `StartedPrint`, // Correct URL with dynamic ID
    
    'width=800,height=600'
  );
};

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

  // const transformData = (apiData: CreatorData[], serRole: string): RowObj[] => {
  //   return apiData.map((data, index) => ({

    
  //     sNo: index + 1,
  //     creatorName:  data.creator ? data.creator.ctName : '',
  //     learnerName: data.lenUserName,
  //     learnerMail: data.lenMail,
  //     cohorts: (
  //       <IconButton
  //         icon={<MdGroupAdd />}
  //         onClick={() => handleCoharts(data.lenId)}
  //         aria-label="Edit"
  //         variant="ghost"
  //         color="#5550c9"
         
  //         fontSize={27}
  //       />

  //     ),
  //     status: (
  //       <>
  //         {data && data?.lenStatus === 'Active' ? (
  //           <IconButton
  //             icon={<MdDone />}
  //             onClick={() => handleStatus(data?.lenId, 'Inactive')}
  //             aria-label="Edit"
  //             variant="ghost"
  //             colorScheme="green"
  //             fontSize={27}
  //           />
  //         ) : (
  //           <IconButton
  //             icon={<MdClose />}
  //             onClick={() => handleStatus(data?.lenId, 'Active')}
  //             aria-label="Edit"
  //             variant="ghost"
  //             colorScheme="red"
  //             fontSize={27}
  //           />
  //         )}
  //       </>
  //     )

  //     ,
  //     addGame: (
  //       <IconButton
  //         icon={<MdVideogameAsset />}
  //         onClick={() => handleGame(data.lenId)}
  //         aria-label="Edit"
  //         variant="ghost"
  //         color="#5835ef"
  //         fontSize={35}
  //       />
  //     ),
  //     action: actionBtns(data),
  //   }));
  // };
  const transformData = (apiData: CreatorData[], UserRole: string): RowObj[] => {
    return apiData.map((data, index) => {
      // Define common properties
      const commonProperties = {
        sNo: index + 1,
        GameName: data.GameName,
        learnerMail: data.learnerMail,
        lenCreatorId:creators.find(item => item.value === data.lenCreatorId)?.label,
        // data.creator ? data.creator.ctName : '',
      ////////////
      lenCompanyId:companyNames.find(item => item.value === data.lenCompanyId)?.label,
      // gamesAssignCount:data.gamesAssignCount,
      gamesAssignCount:(
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
        onClick={ ()=>handleGameAssign(data.gameID)} // Assuming data.sNo is the ID
        >
          {/* <RiQuestionAnswerFill /> */}
          {data.gamesAssignCount}
        </span>
      ),
      // started:data.started,
      started:(
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
        onClick={ ()=>handleStarted(data.gameID)} // Assuming data.sNo is the ID
        >
       { data.started}
        </span>
      ),
      // completed:data.completed,
      completed:(
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
        onClick={ ()=>handleComplete(data.gameID)} // Assuming data.sNo is the ID
        >
          {/* <RiQuestionAnswerFill /> */}
          {data.completed}
        </span>
      ),
      passed:"" ,
      originalScore: data.originalScore,
      finalScore:data.finalScore,
      progress: data.progress,
      skillWiseScore:(
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
        onClick={ ()=>handleSkillScore(data.gameID)} // Assuming data.sNo is the ID
        >
          <RiQuestionAnswerFill />
        </span>
      ),
      // timeSpent:data.timeSpent,
      timesAttended: data.timesAttended,
      answers: ( 
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
        onClick={ ()=>handleAnswerClick(data.gameID)} // Assuming data.sNo is the ID
        >
          <SiAnswer />
        </span>
        ),
    
      learnerFeedback:( 
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
          onClick={ ()=>handleFeedBackClick(data.gameID)}
          >
            <RiFeedbackFill />
          </span>
          ), 
        gameID:data.gameID,
      

      ///////////
        // action: actionBtns(data),
        // status: (
        //   <>
        //   {/* data?.lenStatus */}
        //    <Switch  colorScheme={'brandScheme'} onChange={() => handleStatus(data?.lenId, 'Active')} defaultChecked={data?.lenStatus === 'Active'} />
          
        //   </>
        // ),
      };
  
      // Define role-specific properties
      let roleSpecificProperties: any = {};
      if (UserRole === 'Admin') {
        roleSpecificProperties = {
         
          companyName:getCompanyNameLabel(data.lenCompanyId),
         
        };
      } else{

      }
  
      // Combine common and role-specific properties
      const rowData: RowObj = {
        ...commonProperties,
        ...roleSpecificProperties,
      
      
      };
  
      return rowData;
    });
  };
  
 
  useEffect(() => {

    fetchData();
  
  }, []);


  const transformedData: RowObj[] = transformData(apiData, UserRole);
  const handleSaveSelectedValues = (selectedIds: number[]) => {
    // Do something with the selectedIds
    console.log('Selected Values:', selectedIds);
  };


  
  return (
    <> 
      <Box mb={{ base: '135px',md:'100px', xl: '100px' }}></Box> 
                       
        
        <GameWiseActivity data={transformedData} setApiData={setApiData} setCompany={setCompany} setCreators={setCreators} apiData={apiData}/>
        
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={''} setmsg={''} /> : null }
      {alert  ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert}
 /> : null}
    </>

  );
};

export default CreatorCreation;
