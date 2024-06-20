import React, { useEffect, useState, useRef } from 'react';
import {
  Flex,
  SimpleGrid,
  Text,
  Box,
  Icon,
  Image,
  Button,
  Grid,
  useColorModeValue,
  FormLabel,
} from '@chakra-ui/react';

//  React Select Imports
// import Select from 'react-select';

// Custom Imports
import InputField from 'components/fields/InputFieldtwo';
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectFieldtwo';
import Card from 'components/card/Card';
import OnToast from 'components/alerts/toast';
// icons
import { RiArrowUpSFill } from 'react-icons/ri';
import { RiArrowDownSFill } from 'react-icons/ri';
import { MdOutlineBarChart, MdPerson, MdFileCopy } from 'react-icons/md';
import Select from 'react-select';
import { createCompany, editCompany, getCompany, getCountries,geoLocation } from 'utils/company/companyService';
import { getIndustryName } from 'utils/industry/industry'
import { useNavigate, useParams } from 'react-router-dom';

// Define the type for the options

interface StatusType {
  value: string;
  label: string;
}
interface IndustryType {
  itIndustryName: string;
  itId: number;
  // other properties if any
}
interface OptionType {
  value: string;
  label: string;
}
type FormData = {
   
    cpCompanyName: string; 
    cpAdminName: string;
    cpAdminMail: string;
    cpCountry: string;
    cpIndustry: string;
    cpStatus: string;
    cpCreatedUserId: number;
    cpEditedUserId: number;
  
};
const Company: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState<FormData>({
    cpCompanyName: '',
    cpAdminName: '',
    cpAdminMail: '',
    cpCountry: '',
    cpIndustry: '',
    cpStatus: 'Active',
    cpCreatedUserId: 2,
    cpEditedUserId: 2,
  }),
    [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState<IndustryType[]>([]);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cpCompanyNameRef =useRef<HTMLInputElement | null>(null);
  const cpAdminNameRef =useRef<HTMLInputElement | null>(null);
  const cpAdminMailRef =useRef<HTMLInputElement | null>(null);
  const cpCountryRef =useRef<HTMLInputElement | null>(null);
  const cpIndustryRef =useRef<HTMLSelectElement | null>(null);
  const cpStatusRef =useRef<HTMLInputElement | null>(null);

const [handleSeletAttr,setHandleSeletAttr] = useState<boolean>(true);
  // Assuming industries is an array of OptionType
  // const mappedIndustryOptions = Array.isArray(industries)
  //   ? industries.map((industry) => ({
  //       value: industry.itId,
  //       label: industry.itIndustryName,
  //     }))
  //   : [];
  

  const mappedIndustryOptions:OptionType[] = Array.isArray(industries)
    ? industries.map((industry) => ({
      value: industry.itId.toString(), // Convert to string if necessary
      label: industry.itIndustryName,
    }))
    : [];
    console.log(mappedIndustryOptions, 'mappedIndustryOptions');
    console.log('form:', form);
  const status: StatusType[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'InActive' },
  ];


  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: handleSeletAttr ? '#f56565':'', // Set the border color to red when focused
      borderRadius: '15px', // Adjust the border radius here
      height: '45px',
      padding :'0 !important',
      maxWidth:'100%',
    }),
    // Add more style modifications as needed
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!id){
          const setGeolocation = {
            cpCountry: '',
           
          };
          const response = await geoLocation();
          setGeolocation.cpCountry = response.data[0].id;
           console.log('response',setGeolocation);
           setForm((prevForm) => ({ ...prevForm, cpCountry: setGeolocation.cpCountry }));
          //  console.log('form',form);
        }
        if (id) {
          const response = await getCompany(id);
          response.data[0].cpEditedUserId = parseInt(id);
          setForm(response.data[0]);
        }
        const result = await getCountries();
        if (result.length === 0) return console.log('cannot get Data');
        setCountries(result.data);
        const industryNames = await getIndustryName();
        if (industryNames.length === 0) return console.log('Cannot get industry names');
        setIndustries(industryNames.data); // Assuming you have a state variable for industries
      } catch (err) {
        console.log('Error', err);
      }
    };
    fetchData();
    setHandleSeletAttr(!handleSeletAttr);
  }, []);
  useEffect(() => {
    console.log("cpIndustry:", form?.cpIndustry);
    console.log("id:", id);
  }, [form, id]);

  // const handleInput = (e: any) => {
  //   const { name, value } = e.target;
  //   setForm((prev: any) => ({ ...prev, [name]: value.trim() }));
  // };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value:", e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
    const isUserInteraction = form[e.target.name as keyof FormData] !== "cpIndustry"; 
    setHandleSeletAttr(!isUserInteraction);

    const currentIndex = Object.keys(form).indexOf(e.target.name as keyof FormData);
    const emptyKeys = Object.keys(form).filter((key, index) => {
      return index < currentIndex && form[key as keyof FormData] === "";
    });

    console.log('isUserInteraction',isUserInteraction);
    
    Object.keys(form).forEach((key) => {
      const inputRef = getRefForKey(key);
      if (inputRef && inputRef.current) {
        if (emptyKeys.includes(key)) {
          inputRef.current.style.borderColor = "#f56565";
        } else {
          inputRef.current.style.borderColor = "";
        }
       
      }
    });
  };

  const getRefForKey = (key:any) => {
   
    switch (key) {
      case "cpCompanyName":
        return cpCompanyNameRef;
      case "cpAdminName":
        return cpAdminNameRef;
      case "cpAdminMail":
        return cpAdminMailRef;
     
      default:
        return null;
    }
  };
  
  // const handleChangeIndustry = (selectedOption: any) => {
  //   const value = selectedOption ? selectedOption.value : '';
  //   setForm((prev: any) => ({ ...prev, cpIndustry: value.trim() }));
  // };
  const handleChangeIndustry = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : '';
    setForm((prev: any) => ({ ...prev, cpIndustry: value }));
  
    // Check if the function is triggered by user interaction
    const isUserInteraction = selectedOption !== null;
  
    // Set handleSeletAttr based on whether cpIndustry has a value or not
    setHandleSeletAttr(isUserInteraction ? !value.trim() : handleSeletAttr);
  
    const currentIndex = Object.keys(form).indexOf("cpIndustry");
    const emptyKeys = Object.keys(form).filter((key, index) => {
      // Exclude cpIndustry from emptyKeys if it has a value
      if (key === "cpIndustry" && value.trim() !== "") {
        return false;
      }
      // For other keys, use the existing condition
      return index < currentIndex && form[key as keyof FormData] === "";
    });
  
    // Update the border color based on emptyKeys
    Object.keys(form).forEach((key) => {
      const inputRef = getRefForKey(key);
      if (inputRef && inputRef.current) {
        if (emptyKeys.includes(key)) {
          inputRef.current.style.borderColor = "red";
        } else {
          inputRef.current.style.borderColor = "";
        }
      }
    });
  };
  
  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/admin/superadmin/customer/');
  };
  const save = async () => {


    // Iterate through the keys of the form
  Object.keys(form).forEach((key) => {
    // Access the corresponding ref based on the key
    const inputRef = (key === 'cpCompanyName') ? cpCompanyNameRef :
      (key === 'cpAdminName') ? cpAdminNameRef :
      (key === 'cpAdminMail') ? cpAdminMailRef :
      (key === 'cpCountry') ? cpCountryRef :
      (key === 'cpIndustry') ? cpIndustryRef :
      (key === 'cpStatus') ? cpStatusRef : null;

    // If the field is empty and there is a corresponding ref
    if (!form[key as keyof FormData] && inputRef && inputRef.current) {
      // Set the border color to red
      inputRef.current.style.borderColor = 'red';
    } else if (inputRef && inputRef.current) {
      // If the field is not empty, reset the border color
      inputRef.current.style.borderColor = '';
    }
  });
    

      if (!form.cpCompanyName) {
        setMsg('Please Enter the company name');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
      if (!form.cpAdminName) {
        setMsg('Please Enter the Admin name');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
      if (!form.cpAdminMail) {
        setMsg('Please Enter the Admin mail');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(form.cpAdminMail);

      if (!isValidEmail) {
        // You can show an error message or handle it as needed
        console.log('Invalid email format');
        // Optionally, you can display an error message to the user
        setMsg('Invalid email format');
        setToastStatus('error');
        setAlert(true);
        return;
      }
      if (!form.cpCountry) {
        setMsg('Please select the country');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
      if (!form.cpIndustry) {
        setMsg('Please select the Indutry name');
        setToastStatus('error');
        setAlert(true);
      setHandleSeletAttr(!form.cpIndustry);
        return false;
      }
      if (!form.cpStatus) {
        setMsg('Please select the status ');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
      let data = JSON.stringify(form);
      try {
        setButtonDisabled(true);
      if (id) {
      
        let idv: number = form?.cpEditedUserId
        const result = await editCompany(idv, data)
        if (result && result.status === 'Success') {

          setMsg('Company Updated');
          setToastStatus('success');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/customer');
          }, 200)
        }
        else {
          setButtonDisabled(false);
          setMsg(result?.message);
          setToastStatus('error');
          setAlert(true);
        }
      }
      else {
        
        const result = await createCompany(data);
        if (result?.status === 'Success') {
          setMsg('Company Saved');
          setToastStatus('success');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/customer');
          }, 200)
        } else {
          setButtonDisabled(false);
          setMsg(result?.message);
          setToastStatus('error');
          setAlert(true);
        }
      }
    } catch (err: any) {
      setMsg(err?.message);
      setToastStatus('error');
      setAlert(true);
    }
  };
  return (
    <>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'75px'} position={'relative'}>   
        <Card alignItems={'center'}>       
          <Card bg={'linear-gradient(to bottom, #7551ff, #3311db)'} w={'100%'} h={{base: '170', sm: '170', md: '300', lg: '300'}} position={'relative'} alignItems={'center'}></Card>   
          <Card mb={{ base: '0px', xl: '20px' }} width={{base: '95%', md: '70%'}} marginTop={'-120px'}>
            <Flex direction="column">
              <Text color={textColorPrimary} fontSize="2xl" fontWeight="700" mb="20px">
                Company {id ? 'Updation' : 'Creation'}
              </Text>
            </Flex>
            <SimpleGrid
              columns={{ sm: 1, md: 2 }}
              spacing={{ base: '20px', xl: '25px' }}
            >
              <InputField
                mb="0px"                
                id="comapanyAdminName"
                label="Company Name"
                placeholder="eg. Oliver"
                name="cpCompanyName"
                isRequired={true}
                value={form?.cpCompanyName}
                onChange={handleInput}
                ref={cpCompanyNameRef}
                // border={validation}

              
              />
              <InputField
                mb="0px"                
                id="comapanyAdminName"
                label="Company Admin Name"
                placeholder="eg. Joseph"
                value={form?.cpAdminName}
                name="cpAdminName"
                isRequired={true}
                onChange={handleInput}
                ref={cpAdminNameRef}
                // border={validation}
              />
              <InputField
                mb="0px"
                id="comapanymail"
                label="Company Mail"
                placeholder="eg. mail@sample.com"
                name="cpAdminMail"
                isRequired={true}
                value={form?.cpAdminMail}
                onChange={handleInput}
                disabled={id ? true : false}
                ref={cpAdminMailRef}
                // border={validation}

              />
              {countries && (
                <>
                  <Box>
                    <FormLabel fontSize='sm' fontWeight='bold' color={textColorPrimary}>Country<span style={{ color: 'red' }}>*</span></FormLabel>

                    <Select
                      id="companyCountry"
                      name="cpCountry"
                      options={countries}
                      value={countries.find(item => item.value === form?.cpCountry)}
                      onChange={(val) =>
                        setForm((prev: any) => ({ ...prev, cpCountry: val.value }))
                      }
                      styles={customStyles}
                    />
                  </Box>
                </>
              )}
              

            
            <SelectField
                mb="0px"                
                id="companyIndustry"
                isRequired={true}
                label="Company Industry"
                placeholder="Select Industry"
                name="cpIndustry"
                value={
                  mappedIndustryOptions.find(
                    (option) => option.value.toString() === form?.cpIndustry.toString()
                  )
                }
                onChange={handleChangeIndustry}
                options={mappedIndustryOptions}
                ref={cpIndustryRef}
                // onSelectRefChange={handleSelectRefChange} 
                handleSeletAttr={handleSeletAttr}
            
              />
            
              
              <Box>
                <FormLabel fontSize='sm' fontWeight='bold' color={textColorPrimary}>Status<span style={{ color: 'red' }}>*</span></FormLabel>
                <Select
                  id="comapanyActiveStatus"
                  name="cpStatus"
                  options={status}
                  value={status.find(item => item.value === form?.cpStatus)}
                  onChange={(val) =>
                    setForm((prev: any) => ({ ...prev, cpStatus: val.value }))
                  }
                  styles={customStyles}
                />
              </Box>
            </SimpleGrid>
            {/* <Button
              mt="20px"
              padding={2}
              background="#3311db"
              color="#fff"
              w={70}
              onClick={save}
            >
              Save
            </Button> */}
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
                // ms="auto"
                onClick={save}
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </Flex>
          </Card>
        </Card>
      </Box>
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert}
      /> : null}
    </>
  );
};

export default Company;
