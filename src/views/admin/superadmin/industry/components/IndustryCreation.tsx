import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import { CircularProgress } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import SweetAlert from "react-bootstrap-sweetalert"
import { useParams } from 'react-router-dom';
// Chakra imports
import {
  Flex,
  SimpleGrid,
  Text,
  Box,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

// Custom Imports
import InputField from 'components/fields/InputField';
import SelectField from 'components/fields/SelectField';
import Card from 'components/card/Card';
import OnToast from 'components/alerts/toast';
import { addIndustry, updateIndustry ,getIndustryById} from 'utils/industry/industry';
// import IndustryCreation from '..';

// Define the type for the options
interface OptionType {
  value: string;
  label: string;
}

const IndustryCreation: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    itIndustryName: '',
    itStatus: '',
   
  });
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState(''); // Add success message state
  const navigate = useNavigate(); // Use the useNavigate hook
  const [isItIndustryNameValid, setisItIndustryNameValid] = useState<boolean>(false);
  const [isItStatusValid, setisItStatusValid] = useState<boolean>(false);



  useEffect(() => {
  const fetchData = async () => {
    if (id) {
      try {
        const itId = id;
        const result = await getIndustryById(itId);
        if (result.status !== 'Success') {
          console.log('getIndustry Error', result?.message);
          // Handle error, e.g., set an error state or show an error message
        } else {
          let industryData = result?.data;
          setFormData({
            itIndustryName: industryData.itIndustryName,
            itStatus: industryData.itStatus,
          });
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        // Handle error, e.g., set an error state or show an error message
      }
    }
  };

  fetchData();
}, [id]);

useEffect(() => {

  formData.itIndustryName ? setisItIndustryNameValid(true) :  setisItIndustryNameValid(false);
   (formData.itStatus && formData.itIndustryName) ? setisItStatusValid(true) :  setisItStatusValid(false);
  
},[formData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleStatusChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, itStatus: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setAlert(false);
    e.preventDefault();
    if (!formData.itIndustryName) {
     
      setMsg('Please enter the IndustryName ');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
   
    if (!formData.itStatus) {
     
      setMsg('Please select the status');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
    try {
      setButtonDisabled(true);
      let data = JSON.stringify(formData);
      if (id) {
        const result = await updateIndustry(id,data); 
        if(result?.status !== 'Success')
        {
          setButtonDisabled(false);
           console.log('updateIndustry Error :',result?.message);
        //  alert(result?.message);
         setMsg('Failed to update Industry');
          setToastStatus('error');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/industry');
          }, 200);
          return;} 
          setMsg('Industry updated');
          setToastStatus('success');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/industry');
          }, 200);
        // navigate('/admin/superadmin/industry/');
      }
       else {
        const result = await addIndustry(data);
        if(result?.status !== 'Success') { 
          setButtonDisabled(false);
          console.log('updateIndustry Error :',result?.message);
          setMsg('Failed to Add industry');
          setToastStatus('error');
          setAlert(true);
          setTimeout(() => {
         navigate('/admin/superadmin/industry/'); 
        }, 200);
         return; }
         setMsg('industry Stored');
         setToastStatus('success');
         setAlert(true);
         setTimeout(() => {
           navigate('/admin/superadmin/industry');
         }, 200);
      }
    } catch (error) {
      setButtonDisabled(false);
      console.error('An error occurred while sending the request:', error);
    }
  };

  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/admin/superadmin/industry/');
  };


  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  if (loading) {
    return <CircularProgress isIndeterminate color="blue.300" />;
  }

  // Sample options data
  // const options: OptionType[] = [
  //   { value: 'Days', label: 'Days' },
  //   { value: 'Month', label: 'Month' },
  //   { value: 'Year', label: 'Year' },
  // ];
  const statusOptions: OptionType[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];
  return (
    <>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'75px'} position={'relative'}>      
        <Card alignItems={'center'}>    
          <Card bg={'linear-gradient(to bottom, #7551ff, #3311db)'} w={'100%'} h={{base: '170', sm: '170', md: '300', lg: '300'}} position={'relative'} alignItems={'center'}></Card>
          <Card mb={{ base: '0px', xl: '20px' }} width={{base: '95%', md: '70%'}} marginTop={'-120px'}>
            <Flex direction="column" >
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700" mb="20px">
                Industry {id? 'Updation':'Creation'}
              </Text>
            
            </Flex>
            <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '25px' }}>
              <InputField
                mb="0px"
                me="30px"
                name="itIndustryName"
                value={formData.itIndustryName}
                onChange={handleChange}
                label="Industry Name"
                placeholder="eg. High Demand"
                isRequired={true}
              />
              <SelectField
                mb="0px"
                me="30px"
                id="itStatus"
                label="Active Status"
                name="itStatus"
                options={statusOptions}
                value={statusOptions.find((option) => option.value === formData.itStatus) || null}
                onChange={handleStatusChange}
                isRequired={true}
                isDisabled={!isItIndustryNameValid}
              />
            </SimpleGrid>
            <Flex justify="space-between">
              <Button
                fontSize="sm"
                borderRadius="16px"
                border={'1px solid #00000024'}
                w={{ base: '128px', md: '148px' }}
                h="46px"
                mt="20px"
                mr="20px"
                bg={'transparent'}
                _hover={{bg: '#11047a', color: '#fff'}}
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button
                mt="20px"
                variant="darkBrand"
                fontSize="sm"
                borderRadius="16px"
                w={{ base: '128px', md: '148px' }}
                h="46px"                
                onClick={handleSubmit}
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </Flex>
          </Card>
        </Card>
      </Box>
      {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null}
    </>
  );
};

export default IndustryCreation;