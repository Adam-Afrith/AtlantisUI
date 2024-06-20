import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Switch } from '@chakra-ui/react'
// Chakra imports
import {  
    Flex,
    Box,       
    Button,
    useColorModeValue,
    Icon,
    Tooltip,
  } from '@chakra-ui/react';



// Custom Imports
import Card from 'components/card/Card';
import CompanyDataTable from './components/CompanyDataTable';
import { MdEdit } from 'react-icons/md';
import {AiTwotoneDelete} from 'react-icons/ai';
import { getAllCompanies, removeCompany,CompanyStatus } from 'utils/company/companyService';
import Popup from 'components/alerts/Popup';


const Company: React.FC = () => {
    const [data,setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [alert, setAlert] = useState(false);
    const [msg, setMsg] = useState<string>('');
    const [toastStatus, setToastStatus] = useState<string>('');
    const [deleteId, setDeleteId] = useState<number>();
    const [formData, setFormData] = useState({
      lenStatus: '',
    });
    // Chakra Color Mode    
    const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
	  const textColorSecondary = 'secondaryGray.600';
   
    const navigate = useNavigate();                            
    const handleNavigate= () => {
      navigate('creation');
    } 
    const handleRemove = async (id:number) => {
      setDeleteId(id);
      setIsOpen(true);  
    }
    useEffect(() => {
      const deleteData = async () => {
     if(isConfirm){
      if(deleteId){
        const result = await removeCompany(deleteId);
        if(result?.status !== 'Success'){
          console.log('deleteCreator Error :',result?.message);
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
          getCompanyList();
      }  
     }
    } 
    deleteData()
    }, [isConfirm,deleteId]);
    useEffect(()=>{
        getCompanyList();
    },[])
    const handleStatus = async (cpId?: number, status?: string) => {
      setFormData(formData => ({
        ...formData,
        lenStatus: status
      }));
      let data = JSON.stringify(formData);
      if (cpId) {
        const result = await CompanyStatus(cpId, data);
    
        if (result?.status !== 'Success') return console.log('updateLearner Error:', result?.message);
        getCompanyList();
        navigate('/admin/superadmin/customer');
      }
    };
    
    const actionBtns = (item: any) => {      
      return (
        <Flex>
          <Tooltip placement='top' label="Edit">
            <div>
              <Icon margin='5px' borderRadius='10px' color='#656565cf' cursor='pointer' as={MdEdit} name='Edit' onClick={() => navigate(`creation/${item?.cpId}`)} />              
            </div>
          </Tooltip>
          <Tooltip placement='top' label="Delete">
            <div>              
              <Icon color='#656565cf' cursor='pointer' margin='5px' as={AiTwotoneDelete} onClick={() => handleRemove(item?.cpId)} />
            </div>
          </Tooltip>
        </Flex>
      )
    }

    const getCompanyList = async () => {
      let values: any[] = [];
      let result = await getAllCompanies();
      if (result?.status === 'Success' && result?.data.length !== 0) {
        result?.data?.forEach((item: any, index: number) => {
          let temp = {
            sNo: index + 1,
            companyName: item?.cpCompanyName,
            adminName: item?.cpAdminName,
            adminMail: item?.cpAdminMail,
            companyStatus: (
              <>
                <Switch
                 colorScheme={'brandScheme'}
                  onChange={() => handleStatus(item.cpId, 'Active')}
                  defaultChecked={item.cpStatus === 'Active'}
                />
              </>
            ),
            action: actionBtns(item)
          };
          values.push(temp);
        });
        setData(values);
      } else {
        setData([]);
      }
    };
    
  return (
    <>
        <Box mb={{ base: '75px',md:'100px', xl: '100px' }}></Box>               
        {/* <Card mb={{ base: '0px', xl: '20px' }} boxShadow={'1px 1px 12px #2e292914'} p={'10px 0'} >             */}
            <CompanyDataTable data={data} />
        {/* </Card> */}
        {isOpen ? <Popup setIsConfirm={setIsConfirm} setIsOpen={setIsOpen} msg={''} setmsg={''} /> : null }
    </>
  )
}

export default Company;