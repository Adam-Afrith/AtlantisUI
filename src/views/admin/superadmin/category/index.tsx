import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Button, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import Card from 'components/card/Card';
import CategoryDataTable from './components/CategoryDataTable';
import { MdEdit, MdDelete } from 'react-icons/md';
import Popup from 'components/alerts/Popup';
import OnToast from 'components/alerts/toast';
import { getCategory,removeCategory,getOneCategory,getCategoryList,CategoryStatus,CategoryDataGet} from 'utils/category/category';
import { Switch } from '@chakra-ui/react'
interface CategoryData {
  id: number;
  CategoryName: string;
  itStatus: string;
}

interface RowObj {
  id: number;
  sNo: number;
  CategoryName: string;
  status:any;
  action:any;
}

interface CategoryDataTableProps {
  data: RowObj[];
}

const CategoryCreation: React.FC = () => {
  const [apiData, setApiData] = useState<CategoryData[]>([]);
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
  const fetchData = async () =>{
    // const result = await getCategoryList();
    const result = await CategoryDataGet();
    if(result?.status !== 'Success') return console.log('getCategory Error :',result?.message);
    setApiData(result?.data);
  } 

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setIsOpen(true); 
  };

  const handleNavigate = (id?: number) => {
    if (id) {
      navigate(`/admin/superadmin/category/creation/${id}`);
    } else {
      navigate('creation');
    } 
  };
  const handleStatus = async (id?: number, status?: string) => {
    console.log('LOkie__id',id)
    setFormData(formData => ({
      ...formData,
      lenStatus: status
    }));
    let data = JSON.stringify(formData);
    if (id) {
      const result = await CategoryStatus(id,data);

      if (result?.status !== 'Success') return console.log('updateLearner Error:', result?.message);
      fetchData();
      navigate('/admin/superadmin/category');
    };
  }
  const actionBtns = (data: any) => {    
    return (
      <Flex>
        <Tooltip placement='top' label="Edit">
          <div>
            <IconButton
              icon={<MdEdit />}
              onClick={() => handleNavigate(data?.id)}
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
              onClick={() => handleDelete(data?.id)}
              aria-label="Delete"
              variant="ghost"
              color="#656565cf"
            />
          </div>
        </Tooltip>
      </Flex>
    )
  }

  const transformData = (apiData: CategoryData[]): RowObj[] => {
    return apiData.map((data, index) => ({
      id: data.id,
      sNo: index + 1,
      CategoryName: data.CategoryName,
     
      status: (
        <>
       
         <Switch  colorScheme={'brandScheme'} onChange={() => handleStatus(data?.id, 'Active')} defaultChecked={data?.itStatus === 'Active'} />
        
        </>
      ),
      action: actionBtns(data),
    }));
  };
  useEffect(()=>{
    console.log('apiData123',apiData);
  },[apiData])

  useEffect(() => {
    
    const deleteData = async () => {
      try {
        if (isConfirm && deleteId) {
          const result = await removeCategory(deleteId);
          if (result?.status !== 'Success') {
            setIsOpen(false);
            setMsg('Industry Not Deleted: ' + result?.message);
            setToastStatus('error');
            setAlert(true);
            setIsConfirm(false);
            return;
          }
  
          setIsOpen(false);
          setMsg('Category Deleted');
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
        <CategoryDataTable data={transformedData} />
      {/* </Card> */}
      {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={''} setmsg={''} /> : null }
      {alert  ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert}
 /> : null}  
    </>
  );
};

export default CategoryCreation;