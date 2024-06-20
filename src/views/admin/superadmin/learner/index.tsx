import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
  Button,
  useColorModeValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import LeanerDataTable from './components/learnerDataTable';
import {
  MdEdit,
  MdDelete,
  MdGroupAdd,
  MdDone,
  MdClose,
  MdVideogameAsset,
} from 'react-icons/md';
import {
  addLearner,
  getLearnerById,
  updateLearner,
  learnerStatus,
} from 'utils/leaner/leaner';
import { deleteLearner, getAllLearner } from 'utils/leaner/leaner';
import AddCoharts from './components/AddCoharts';
import AddGame from './components/AddlearnerGame';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import { Switch } from '@chakra-ui/react';
interface CreatorData {
  lenId: number;
  creator: {
    ctName: string;
    // other properties of creator...
  };
  lenUserName: string;
  lenMail: string;

  lenStatus: string;
  lenCompanyId: string;
}

interface RowObj {
  sNo: number;
  creatorName: string;
  learnerName: string;
  learnerMail: string;
  status: any;
  action: any;
  companyName: any;
}

interface CreatorDataTableProps {
  data: RowObj[];
}

const CreatorCreation: React.FC = () => {
  const storage = JSON.parse(localStorage.getItem('user'));

  const UserRole = storage.data.role;
  const [apiData, setApiData] = useState<CreatorData[]>([]);
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
  const fetchData = async () => {
    const result = await getAllLearner();
    if (result?.status !== 'Success')
      return console.log('getCreator Error :', result?.message);
    setApiData(result?.data);
  };
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
      if (isConfirm) {
        if (deleteId) {
          const result = await deleteLearner(deleteId);
          if (result?.status !== 'Success') {
            console.log('deleteLearner Error :', result?.message);
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
    };
    deleteData();
  }, [isConfirm, deleteId]);

  const handleCoharts = (lenId?: number) => {
    setLearnerId(lenId || null);
    setOpenCoharts(true);
  };

  const handleGame = (lenId?: number) => {
    setLearnerId(lenId || null);
    setOpenGame(true);
  };

  const getCompanyNameLabel = (lenCompanyId: string): string => {
    const companyOption = companyNames.find(
      (option) => option.value === Number(lenCompanyId),
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
  const handleStatus = async (lenId?: number, status?: string) => {
    setFormData((formData) => ({
      ...formData,
      lenStatus: status,
    }));
    let data = JSON.stringify(formData);
    if (lenId) {
      const result = await learnerStatus(lenId, data);

      if (result?.status !== 'Success')
        return console.log('updateLearner Error:', result?.message);
      fetchData();
      navigate('/admin/superadmin/learner');
    }
  };

  const actionBtns = (data: any) => {
    return (
      <Flex>
        <Tooltip placement="top" label="Edit">
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
        <Tooltip placement="top" label="Delete">
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
      </Flex>
    );
  };

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
  const transformData = (
    apiData: CreatorData[],
    UserRole: string,
  ): RowObj[] => {
    return apiData.map((data, index) => {
      // Define common properties
      const commonProperties = {
        sNo: index + 1,
        learnerName: data.lenUserName,
        learnerMail: data.lenMail,
        creatorName: data.creator ? data.creator.ctName : '',
        action: actionBtns(data),
        status: (
          <>
            {/* data?.lenStatus */}
            <Switch
              colorScheme={'brandScheme'}
              onChange={() => handleStatus(data?.lenId, 'Active')}
              defaultChecked={data?.lenStatus === 'Active'}
            />
          </>
        ),
      };

      // Define role-specific properties
      let roleSpecificProperties: any = {};
      if (UserRole === 'Admin') {
        roleSpecificProperties = {
          companyName: getCompanyNameLabel(data.lenCompanyId),
        };
      } else {
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
      <Box mb={{ base: '75px', md: '100px', xl: '100px' }}></Box>

      <LeanerDataTable
        data={transformedData}
        setApiData={setApiData}
        setCompany={setCompany}
      />

      {openCoharts ? (
        <AddCoharts
          setOpenCoharts={setOpenCoharts}
          onSaveSelectedValues={handleSaveSelectedValues}
          learnerId={learnerId as number}
        />
      ) : null}
      {openGame ? (
        <AddGame setOpenGame={setOpenGame} learnerId={learnerId as number} />
      ) : null}
      {isOpen ? (
        <Popup
          setIsConfirm={setIsConfirm}
          setIsOpen={setIsOpen}
          msg={''}
          setmsg={''}
        />
      ) : null}
      {alert ? (
        <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
      ) : null}
    </>
  );
};

export default CreatorCreation;
