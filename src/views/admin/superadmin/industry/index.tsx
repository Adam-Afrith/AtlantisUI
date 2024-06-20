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
import IndustryDataTable from './components/IndustryDataTable';
import { MdEdit, MdDelete } from 'react-icons/md';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import {
  getIndustry,
  deleteIndustry,
  IndustryStatus,
} from 'utils/industry/industry';
import { Switch } from '@chakra-ui/react';
interface IndustryData {
  itId: number;
  itIndustryName: string;
  itStatus: string;
}

interface RowObj {
  itId: number;
  sNo: number;
  industryName: string;
  status: any;
  action: any;
}

interface IndustryDataTableProps {
  data: RowObj[];
}

const IndustryCreation: React.FC = () => {
  const [apiData, setApiData] = useState<IndustryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number>();
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const [formData, setFormData] = useState({
    lenStatus: '',
  });
  const navigate = useNavigate();
  const fetchData = async () => {
    const result = await getIndustry();
    if (result?.status !== 'Success')
      return console.log('getIndustry Error :', result?.message);
    setApiData(result?.data);
  };

  const handleDelete = async (itId: number) => {
    setDeleteId(itId);
    setIsOpen(true);
  };

  const handleNavigate = (itId?: number) => {
    if (itId) {
      navigate(`/admin/superadmin/industry/creation/${itId}`);
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
      const result = await IndustryStatus(lenId, data);

      if (result?.status !== 'Success')
        return console.log('updateLearner Error:', result?.message);
      fetchData();
      navigate('/admin/superadmin/industry');
    }
  };
  const actionBtns = (data: any) => {
    return (
      <Flex>
        <Tooltip placement="top" label="Edit">
          <div>
            <IconButton
              icon={<MdEdit />}
              onClick={() => handleNavigate(data?.itId)}
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
              onClick={() => handleDelete(data?.itId)}
              aria-label="Delete"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
      </Flex>
    );
  };

  const transformData = (apiData: IndustryData[]): RowObj[] => {
    return apiData.map((data, index) => ({
      itId: data.itId,
      sNo: index + 1,
      industryName: data.itIndustryName,

      status: (
        <>
          <Switch
            colorScheme={'brandScheme'}
            onChange={() => handleStatus(data?.itId, 'Active')}
            defaultChecked={data?.itStatus === 'Active'}
          />
        </>
      ),
      action: actionBtns(data),
    }));
  };

  useEffect(() => {
    const deleteData = async () => {
      try {
        if (isConfirm && deleteId) {
          const result = await deleteIndustry(deleteId);
          if (result?.status !== 'Success') {
            setIsOpen(false);
            setMsg('Industry Not Deleted: ' + result?.message);
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            return;
          }

          setIsOpen(false);
          setMsg('Industry Deleted');
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

  useEffect(() => {
    fetchData();
  }, []);

  const transformedData: RowObj[] = transformData(apiData);

  return (
    <>
      <Box mb={{ base: '75px', md: '100px', xl: '100px' }}></Box>
      {/* <Card mb={{ base: '0px', xl: '20px' }} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'}>             */}
      <IndustryDataTable data={transformedData} />
      {/* </Card> */}
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

export default IndustryCreation;
