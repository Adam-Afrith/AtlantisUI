import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, useColorModeValue, IconButton } from '@chakra-ui/react';
import Card from 'components/card/Card';
import LeanerDataTable from './components/learnerDataTable';
import { MdEdit, MdDelete, MdGroupAdd, MdDone, MdClose, MdVideogameAsset } from 'react-icons/md';
import { addLearner, getLearnerById, updateLearner, learnerStatus } from 'utils/leaner/leaner';
import { deleteLearner, getAllLearner } from 'utils/leaner/leaner';
import AddCoharts from './components/AddCoharts';
import AddGame from './components/AddlearnerGame';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
interface CreatorData {
  lenId: number;
  lenCreatorId: number;
  lenUserName: string;
  lenMail: string;
  lenCohorts: string;
  lenStatus: string;

}

interface RowObj {
  sNo: number;
  creatorName: string;
  learnerName: string;
  learnerMail: string;
  cohorts: any;
  status: any;
  addGame: any;
  action: any;
}

interface CreatorDataTableProps {
  data: RowObj[];
}

const CreatorCreation: React.FC = () => {
  const [apiData, setApiData] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [msg, setMsg] = useState<string>('');
    const [toastStatus, setToastStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number>();

  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const fetchData = async () => {
    const result = await getAllLearner();
    if (result?.status !== 'Success') return console.log('getCreator Error :', result?.message);
    console.log(result?.data);
    setApiData(result?.data);
  }
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
  
  const handleNavigate = (lenId?: number) => {
    if (lenId) {
      navigate(`/admin/superadmin/learner/creation/${lenId}`);
    } else {
      navigate('creation');
    }
  };
  const handleStatus = async (lenId?: number, status?: string) => {
    setFormData(formData => ({
      ...formData,
      lenStatus: status
    }));
    let data = JSON.stringify(formData);
    if (lenId) {
      const result = await learnerStatus(lenId, data);
      console.log('Backend Response:', result); // Add this line for logging the response
      if (result?.status !== 'Success') return console.log('updateLearner Error:', result?.message);
      fetchData();
      navigate('/admin/superadmin/learner');
    };
  }



  const transformData = (apiData: CreatorData[]): RowObj[] => {
    return apiData.map((data, index) => ({


      sNo: index + 1,
      creatorName: data.lenUserName,
      learnerName: data.lenUserName,
      learnerMail: data.lenMail,
      cohorts: (
        <IconButton
          icon={<MdGroupAdd />}
          onClick={() => handleCoharts(data.lenId)}
          aria-label="Edit"
          variant="ghost"
          colorScheme="blue"
          fontSize={40}
        />

      ),
      status: (
        <>
          {data && data?.lenStatus === 'Active' ? (
            <IconButton
              icon={<MdDone />}
              onClick={() => handleStatus(data?.lenId, 'Inactive')}
              aria-label="Edit"
              variant="ghost"
              colorScheme="green"
              fontSize={35}
            />
          ) : (
            <IconButton
              icon={<MdClose />}
              onClick={() => handleStatus(data?.lenId, 'Active')}
              aria-label="Edit"
              variant="ghost"
              colorScheme="red"
              fontSize={35}
            />
          )}
        </>
      )

      ,
      addGame: (
        <IconButton
          icon={<MdVideogameAsset />}
          onClick={() => handleGame(data.lenId)}
          aria-label="Edit"
          variant="ghost"
          colorScheme="orange"
          fontSize={35}
        />
      ),
      action: (
        <>
          <IconButton
            icon={<MdEdit />}
            onClick={() => handleNavigate(data.lenId)}
            aria-label="Edit"
            variant="ghost"
            colorScheme="blue"
          />
          <IconButton
            icon={<MdDelete />}
            onClick={() => handleDelete(data?.lenId)}
            aria-label="Delete"
            variant="ghost"
            colorScheme="red"
          />
        </>
      ),
    }));
  };

  useEffect(() => {

    fetchData();
  
  }, []);

  const transformedData: RowObj[] = transformData(apiData);
  const handleSaveSelectedValues = (selectedIds: number[]) => {
    // Do something with the selectedIds
    console.log('Selected Values:', selectedIds);
  };
  return (
    <>
      <Box mb={{ base: '0px', xl: '100px' }}></Box>
      <Card mb={{ base: '0px', xl: '20px' }}>
        <Flex justifyContent="end">
          <Button
            mt="10px"
            mb="15px"
            padding={2} 
            background="#3311db"
            color="#fff"
            w={70}
            onClick={() => handleNavigate()}
          >
            New
          </Button>
        </Flex>
        <LeanerDataTable data={transformedData} />
      </Card>
      {openCoharts ? <AddCoharts setOpenCoharts={setOpenCoharts} onSaveSelectedValues={handleSaveSelectedValues} learnerId={learnerId as number} />
        : null}
      {openGame ? <AddGame setOpenGame={setOpenGame} learnerId={learnerId as number} /> : null}
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen}  msg={''} setmsg={''} /> : null }
      {alert  ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert}
 /> : null}
    </>

  );
};

export default CreatorCreation;
