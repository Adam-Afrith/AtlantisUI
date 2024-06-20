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
import { getCategory,updateCategory,createCategory} from 'utils/category/category';
// import IndustryCreation from '..';

// Define the type for the options
interface OptionType {
  value: string;
  label: string;
}

const CategoryCreation: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    itCategoryName: '',
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
  const [isItCategoryNameValid, setisItCategoryNameValid] = useState<boolean>(false);
  const [isItStatusValid, setisItStatusValid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
  const fetchData = async () => {
    if (id) {
      try {
        //  const catId = id;
        const result = await getCategory(id);
        if (result.status !== 'Success') {
          console.log('getcategory Error', result?.message);
          // Handle error, e.g., set an error state or show an error message
        } else {
          let categoryData = result?.data;
          setFormData({
            itCategoryName: categoryData.catName,
            itStatus: categoryData.catStatus,
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

  formData.itCategoryName ? setisItCategoryNameValid(true) :  setisItCategoryNameValid(false);
   (formData.itStatus && formData.itCategoryName) ? setisItStatusValid(true) :  setisItStatusValid(false);
  
},[formData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleStatusChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, itStatus: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!formData.itCategoryName || !formData.itStatus || isSubmitting) {
      return; // If form is already submitting or required fields are empty, do nothing
    }
    setAlert(false);
    e.preventDefault();
    if (!formData.itCategoryName) {
     
      setMsg('Please enter the CategoryName ');
      setToastStatus('error');
      setAlert(true);
      setIsSubmitting(false); // Reset form submission state

      return false;
    }
   
    if (!formData.itStatus) {
     
      setMsg('Please select the status');
      setToastStatus('error');
      setAlert(true);
      setIsSubmitting(false); // Reset form submission state

      return false;
    }
    try {
      setButtonDisabled(true);
      setIsSubmitting(true);
      let data = JSON.stringify(formData);
      if (id) {
        const result = await updateCategory(id,data); 
        if(result?.status !== 'Success')
        {
          setButtonDisabled(false);
           console.log('updateCategory Error :',result?.message);
        //  alert(result?.message);
         setMsg('Failed to update Category');
          setToastStatus('error');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/category');
          }, 200);
          setIsSubmitting(false); // Reset form submission state
          return;} 
          setMsg('Category updated');
          setToastStatus('success');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/category');
          }, 200);
        // navigate('/admin/superadmin/industry/');
      }
       else {
        const result = await createCategory(data);
        if(result?.status !== 'Success') { 
          setButtonDisabled(false);
          console.log("result",result)
          console.log('updateCategory Error :',result?.message);
          setMsg('Failed to Add Category');
          setToastStatus('error');
          setAlert(true);
          setTimeout(() => {
         navigate('/admin/superadmin/category/'); 
        }, 200);
        setIsSubmitting(true); 
         return; }
           
         setMsg('Category Stored');
         setToastStatus('success');
         setAlert(true);
         console.log("category");
         setTimeout(() => {
           navigate('/admin/superadmin/category');
         }, 200);
      }
    } catch (error) {
      setButtonDisabled(false);
      console.error('An error occurred while sending the request:', error);
      setIsSubmitting(false); 
    }
  };

  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/admin/superadmin/category/');
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
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'100px'} position={'relative'}>      
        <Card bg={'linear-gradient(to bottom, #7551ff, #3311db)'} w={'100%'} h={'300'} position={'absolute'} alignItems={'center'}></Card>
        <Card mb={{ base: '0px', xl: '20px' }} width={{sm:'95%',lg:'70%'}} marginTop={'120px'}>
          <Flex direction="column"  ms="10px">
          <Text color={textColorPrimary} fontSize="2xl" fontWeight="700" mb="20px">
              Category {id? 'Updation':'Creation'}
            </Text>
          </Flex>
          <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '20px' }}>
            <InputField
              mb="0px"
              me="30px"
              name="itCategoryName"
              value={formData.itCategoryName}
              onChange={handleChange}
              label="CategoryName"
              placeholder="eg. Marketing"
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
              isDisabled={!isItCategoryNameValid}
            />
          </SimpleGrid>
          <Flex justify="space-between">
            <Button
               variant="light"
               fontSize="sm"
               borderRadius="16px"
               w={{ base: '128px', md: '148px' }}
               h="46px"
               mt="20px"
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
              ms="auto"
              onClick={handleSubmit}
            >
              {id ? 'Update' : 'Save'}
            </Button>
          </Flex>
        </Card>
      </Box>
      {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null}
    </>
  );
};

export default CategoryCreation;