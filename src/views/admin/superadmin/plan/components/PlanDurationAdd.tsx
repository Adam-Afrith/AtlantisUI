import React, { useState, useEffect,useRef } from 'react';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import { CircularProgress, Icon} from '@chakra-ui/react';
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
import InputField from 'components/fields/InputFieldtwo';
import SelectField from 'components/fields/SelectFieldtwo';
import Card from 'components/card/Card';
import OnToast from 'components/alerts/toast';
import { createplan, getPlanById, updateplan } from 'utils/plan/plan';
import { createSubscription,updateSubscription,getSubscriptionPlanById } from 'utils/subscriptionPlans/subscriptionPlan';
import { FaBolt, FaInfinity, FaInfo } from 'react-icons/fa';

// Define the type for the options
interface OptionType {
  value: string;
  label: string;
}

interface RowType {
  psPlanType: string;
  psPlanDuration: string;
  psPrice: string; // Example additional detail
}
type FormData = {
   
  plPlanName: string; 
  plMaxLearner: string;
  plMaxGame: string;
  plMaxBackgrounds: string;
  plMaxCharacters: string;
  plMaxAnalyticsDashboard: string;
  plMAxGameHours: string;

};
type FormDatas = {
    psPlanDuration: string,
    psPlanType: string,
    psPlanId: string,
    psStatus: string,
}
const Plan: React.FC = () => {
  const toast = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState<FormData>({
    plPlanName: '',
    // psPlanType: '',
    // plPrice: '',
    // plStatus: '',
    plMaxLearner: '',
    plMaxGame: '',
    plMaxBackgrounds: '',
    plMaxCharacters: '',
    plMaxAnalyticsDashboard: '',
    plMAxGameHours: '',
  });
  const [formDatas, setFormDatas] = useState<FormDatas>({
    psPlanDuration:'',
    psPlanType:'',
    psPlanId:id,
    psStatus:'Active',

  });
 
  
  

  
  console.log('useParams',id);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [noOfRows, setNoOfRows] = useState<any>(1);
  const [rows, setRows] = useState<RowType[]>([{ psPlanType: '', psPlanDuration: '', psPrice: '' }]);

  const [successMessage, setSuccessMessage] = useState(''); // Add success message state
  const navigate = useNavigate(); // Use the useNavigate hook
  const plPlanNameRef = useRef<HTMLInputElement | null>(null);
  const plMaxLearnerRef = useRef<HTMLInputElement | null>(null);
  const plMaxGameRef = useRef<HTMLInputElement | null>(null);
  const plMaxBackgroundsRef = useRef<HTMLInputElement | null>(null);
  const plMaxCharactersRef = useRef<HTMLInputElement | null>(null);
  const plMaxAnalyticsDashboardRef = useRef<HTMLInputElement | null>(null);
  const plMAxGameHoursRef = useRef<HTMLInputElement | null>(null);
  const [handleSeletAttr, setHandleSeletAttr] = useState<boolean>(true);
  const [handlePlanType, setHandlePlanType] = useState<boolean>(true);
  const psPlanDurationRef = useRef<HTMLInputElement | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);

  const handleRowChange = (index: number, key: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };
  const handlePlanDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormDatas({ ...formDatas, psPlanDuration: value });

         // Iterate through the keys of the form
         Object.keys(formData).forEach((key) => {
          // Access the corresponding ref based on the key
          const inputRef =
            key === 'plPlanName'
              ? plPlanNameRef
              : key === 'plMaxLearner'
              ? plMaxLearnerRef
              : key === 'plMaxGame'
              ? plMaxGameRef
              : key === 'plMaxBackgrounds'
              ? plMaxBackgroundsRef
              : key === 'plMaxCharacters'
              ? plMaxCharactersRef
              : key === 'plMaxAnalyticsDashboard'
              ? plMaxAnalyticsDashboardRef
              : key === 'plMAxGameHours'
              ? plMAxGameHoursRef
              : null;
    
          // If the field is empty and there is a corresponding ref
          if (!formData[key as keyof FormData] && inputRef && inputRef.current) {
            // Set the border color to red
            inputRef.current.style.borderColor = 'red';
           
          } else if (inputRef && inputRef.current) {
            // If the field is not empty, reset the border color
            inputRef.current.style.borderColor = '';
          }
         
        }); 
        
    if(value === ""){
      psPlanDurationRef.current.style.borderColor = 'red'; 
    }else{
      psPlanDurationRef.current.style.borderColor = ''; 
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const currentIndex = Object.keys(formData).indexOf(name);
    const emptyKeys = Object.keys(formData).filter((key, index) => {
      return index < currentIndex && formData[key as keyof FormData] === '';
    });
    
    // console.log('isUserInteraction',isUserInteraction);
    // setHandleSeletAttr(!handleSeletAttr);
    Object.keys(formData).forEach((key) => {
      const inputRef = getRefForKey(key);
      if (inputRef && inputRef.current) {
        if (emptyKeys.includes(key)) {
          inputRef.current.style.borderColor = 'red';
        } else {
          inputRef.current.style.borderColor = '';
        }
      }
    });
  };

  const getRefForKey = (key: any) => {
    switch (key) {
      case 'plPlanName':
        return plPlanNameRef;
      case 'plMaxLearner':
        return plMaxLearnerRef;
      case 'plMaxGame':
        return plMaxGameRef;
      case 'plMaxBackgrounds':
        return plMaxBackgroundsRef;
      case 'plMaxCharacters':
        return plMaxCharactersRef;
      case 'plMaxAnalyticsDashboard':
        return plMaxAnalyticsDashboardRef;
      case 'plMAxGameHours':
        return plMAxGameHoursRef;

      default:
        return null;
    }
  };

  const handleSelectChange = (selectedOption: OptionType | null, rowIndex: string) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormDatas({ ...formDatas, psPlanType: selectedOption ? selectedOption.value : '' });
    const isUserInteraction = selectedOption !== null;
   
    setHandlePlanType(isUserInteraction ? !value.trim() : handlePlanType);
 
    const currentIndex = Object.keys(formDatas).indexOf('psPlanType');
    const emptyKeys = Object.keys(formDatas).filter((key, index) => {
      // Exclude cpIndustry from emptyKeys if it has a value
      if (key === 'psPlanType' && value.trim() !== '') {
        return false;
      }

      // For other keys, use the existing condition
      return index < currentIndex && formData[key as keyof FormData] === '';
    });

    // Update the border color based on emptyKeys
    Object.keys(formDatas).forEach((key) => {
      const inputRef = getRefForKey(key);
      console.log('inputRef', inputRef);
      if (inputRef && inputRef.current) {
        if (emptyKeys.includes(key)) {
          inputRef.current.style.borderColor = 'red';
        } else {
          inputRef.current.style.borderColor = '';
        }
      }
    });
    console.log('formData', formDatas);
    console.log('emptyKeys', emptyKeys);
   
      
  };
 
  const handleStatusChange = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormDatas({ ...formDatas, psStatus: selectedOption ? selectedOption.value : '' });
     // Check if the function is triggered by user interaction
     const isUserInteraction = selectedOption !== null;
   
    setHandleSeletAttr(isUserInteraction ? !value.trim() : handleSeletAttr);
 
    const currentIndex = Object.keys(formDatas).indexOf('psStatus');
    const emptyKeys = Object.keys(formDatas).filter((key, index) => {
      // Exclude cpIndustry from emptyKeys if it has a value
      if (key === 'psStatus' && value.trim() !== '') {
        return false;
      }

      // For other keys, use the existing condition
      return index < currentIndex && formData[key as keyof FormData] === '';
    });

    // Update the border color based on emptyKeys
    Object.keys(formDatas).forEach((key) => {
      const inputRef = getRefForKey(key);
      console.log('inputRef', inputRef);
      if (inputRef && inputRef.current) {
        if (emptyKeys.includes(key)) {
          inputRef.current.style.borderColor = 'red';
        } else {
          inputRef.current.style.borderColor = '';
        }
      }
    });
    console.log('formData', formDatas);
    console.log('emptyKeys', emptyKeys);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const result = await getSubscriptionPlanById(id);

          if (result?.status === 'Success') {
            console.log("result", result);
            setSubscriptionPlan(result);
            let planData = result.data[0].someAlias; // Assuming data is an array with one element
            console.log('planData:', planData);
            let planDatas = result.data[0]; // Assuming data is an array with one element
            console.log('planDatas:', planDatas);
          } else {
            console.error('Failed to fetch subscription plan:', result?.message);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription plan:', error);
      }
    };

    fetchData();
  }, [id]); // The dependency array ensures this effect runs when 'id' changes

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("HandleSumbit");
    setAlert(false);
     // Iterate through the keys of the form
    

    if(!formDatas["psStatus"]){
      setHandleSeletAttr(true);
    }else{
      setHandleSeletAttr(false);
    }
    e.preventDefault();
    if (!formDatas.psPlanType) {
        handleToast('Please select the status', 'error', true);
        return false;
      }
      if (!formDatas.psPlanDuration) {
        handleToast('Please select the status', 'error', true);
        return false;
      }
    try {
      setButtonDisabled(true);
    //  const ids= formDatas.psPlanId
    //   let data = JSON.stringify(formData);
    //   console.log("datasd",data)

      if (id) {

       
          const datass = JSON.stringify(formDatas);
console.log("datass",datass)
          const subscriptionResult = await createSubscription(datass);

            if (subscriptionResult?.status !== 'Success') {
              console.error('Failed to create subscription:', subscriptionResult?.message);
            } else {
              console.log('Subscription created successfully:', subscriptionResult.data);
              handleToast('Subscription Created Successfully', 'success', true);
              setTimeout(() => {
                navigate('/admin/superadmin/plan');
              }, 200);
            }
        
       
      }
     
    
    
    } catch (error) {
      setButtonDisabled(false);
      console.error('An error occurred while sending the request:', error);
    }
  };

  const handleToast = (msg: string, status: string, alert: boolean) => {
    setMsg(msg);
    setToastStatus(status);
    setAlert(alert);
  }
  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/admin/superadmin/plan/');
  };


  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  if (loading) {
    return <CircularProgress isIndeterminate color="blue.300" />;
  }
  const options: OptionType[] = [
    { value: 'Days', label: 'Days' },
    { value: 'Month', label: 'Month' },
    { value: 'Year', label: 'Year' },
  ];
  const statusOptions: OptionType[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];
  

  // const fetchData = async () => {
  //   try {
  //     if (id) {
  //       const result = await getSubscriptionPlanById(id);

  //       if (result?.status === 'Success') {
  //         console.log("result", result);
  //         setSubscriptionPlan(result);
  //         let planData = result.data[0].someAlias; // Assuming data is an array with one element
  //         console.log('planData:', planData);
  //         let planDatas = result.data[0]; // Assuming data is an array with one element
  //         console.log('planDatas:', planDatas);
  //       } else {
  //         console.error('Failed to fetch subscription plan:', result?.message);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching subscription plan:', error);
  //   }
  // };
  

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'75px'} position={'relative'}>
        <Card alignItems={'center'}>
          <Card bg={'linear-gradient(to bottom, #7551ff, #3311db)'} w={'100%'} h={{base: '170', sm: '170', md: '300', lg: '300'}} position={'relative'} alignItems={'center'}></Card>
          <Card mb={{ base: '0px', xl: '20px' }} width={{base:'96%',sm:'96%',md:'96%',lg:'70%'}} marginTop={'-120px'} >
            <Flex flexDirection={{base:'column',sm:'column',md:'column',lg:'row'}} justifyContent={'space-between'}>
                <Box position={'relative'} w={{md:'100%',lg:'50%'}} mt={{md:'',lg:'25px'}} ml={{md:'',lg:'25px'}}>
                    <Card
                      w={{md:'100%',lg:'95%'}}
                      h={'285px'}
                      borderRadius={'none'}
                      boxShadow={'5px 5px 20px #c5c5c5'}
                      alignItems={'center'}
                      // onMouseEnter={() => handleParent(i)}
                      // onMouseLeave={handleParentLeave}
                      m={0}
                      p={0}
                    >
                      <Box w={'80%'} display={'flex'}>
                        <Icon
                          as={FaBolt}
                          width={'25px'}
                          h={'25px'}
                          mt={'30px'}
                          boxShadow={'5px 5px 20px grey'}
                          bg={'linear-gradient(to bottom, #7551ff, #3311db)'}
                          color={'#fff'}
                          borderRadius={'50%'}
                        />
                      
                          <Text color={textColorPrimary}  ml={'10px'} fontSize="2xl" p={'23px 0px'} fontWeight="700" mb="0px">
                            
                          {subscriptionPlan?.data[0]?.plPlanName}
                          {/* {item?.plPlanName} */}
                        </Text>
                      </Box>
                      <Box
                        mt={'5px'}
                        w={'80%'}
                        justifyContent={'center'}
                        textAlign={'start'}
                      >
                        <Box w={'100%'}>
                          <Flex justifyContent={'space-between'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                              Max Games
                            </Text>
                            <Box w={'50px'} display={'flex'} justifyContent={'end'}>
                              <Text  color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}>
                                {subscriptionPlan?.data[0]?.plMaxGame}
                                {/* {item?.plMaxGame} */}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex justifyContent={'space-between'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                            Max Learners
                            </Text>
                            <Box w={'50px'} display={'flex'} justifyContent={'end'}>
                              <Text  color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}>
                                {subscriptionPlan?.data[0]?.plMaxLearner}
                                {/* {item?.plMaxLearner} */}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex justifyContent={'space-between'}>
                            <Text
                              color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                            >
                            Max Backgrounds
                            </Text>
                            <Box w={'50px'} display={'flex'} justifyContent={'end'}>
                              <Text
                                
                                textAlign={'start'}
                                color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}
                              >
                                {subscriptionPlan?.data[0]?.plMaxBackgrounds}
                                {/* {item?.plMaxBackgrounds} */}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex justifyContent={'space-between'}>
                            <Text
                              
                            
                              color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                            >
                            Max DashBoards
                            </Text>
                            <Box w={'50px'} display={'flex'} justifyContent={'end'}>
                              <Text  
                                textAlign={'start'}
                                color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}>
                                {subscriptionPlan?.data[0]?.plMaxAnalyticsDashboard}
                                {/* {item?.plMaxAnalyticsDashboard} */}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex justifyContent={'space-between'}>
                            <Text
                            
                            
                            color={'#8f9bba'}
                          fontWeight={500}
                          fontSize={'1rem'}
                            >
                            Max Characters
                            </Text>
                            <Box w={'50px'} display={'flex'} justifyContent={'end'}>
                              <Text  textAlign={'start'}
                                color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}>
                                {subscriptionPlan?.data[0]?.plMaxCharacters}
                                {/* {item?.plMaxCharacters} */}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex justifyContent={'space-between'}>
                            <Text
                            
                              color={'#8f9bba'}
                            fontWeight={500}
                            fontSize={'1rem'}
                            >
                            Max Duration
                            </Text>
                            <Box w={'50px'} display={'flex'} justifyContent={'end'}>
                              <Text  textAlign={'start'}
                                color={'#8f9bba'}
                              fontWeight={500}
                              fontSize={'1rem'}>
                                {subscriptionPlan?.data[0]?.plMAxGameHours}
                                {/* {item?.plMAxGameHours} */}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </Box>
                      {/* <ButtonGroup mt={'20px'}>
                        <Button
                          p={'0px 30px'}
                          mt={'20px'}
                          color={'#fff'}
                          _hover={{
                            bg: '#3311db',
                          }}
                          bg={'#3311db'}
                          onClick={() => navigate(`updationPlan/${item?.plId}`)}
                        >
                          Update
                        </Button>
                        <Button
                          p={'0px 30px'}
                          mt={'20px'}
                          color={'#fff'}
                          _hover={{
                            bg: '#3311db',
                          }}
                          bg={'#3311db'}
                          onClick={() => handleDeletePlan(item?.plId)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup> */}
                    </Card>
                    {/* <Icon as={FaInfo}  position={'absolute'} top={'15px'} right={'-20px'} /> */}
                      {/* <Menu isOpen={isOpen1} onClose={onClose1}>
                        <MenuButton
                          alignItems="center"
                          justifyContent="center"
                          bg={'none'}
                          w="37px"
                          h="37px"
                          lineHeight="100%"
                          onClick={() => handleMenu(i)}
                          borderRadius="10px"
                        >
                          <Icon
                            as={FaEllipsisH}
                            color={'#3311db'}
                            w="20px"
                            h="20px"
                            mt="4px"
                          />
                        </MenuButton>
                        {menu === i && (
                          <MenuList
                            w="150px"
                            minW="unset"
                            maxW="150px !important"
                            border="transparent"
                            backdropFilter="blur(63px)"
                            bg={bgList}
                            boxShadow={bgShadow}
                            borderRadius="20px"
                            p="15px"
                          >
                            {item?.someAlias.map((sub: any, subi: any) => (
                              <MenuItem
                                key={subi}
                                transition="0.2s linear"
                                color={textColor}
                                p="0px"
                                borderRadius="8px"
                                _focus={{
                                  bg: 'transparent',
                                }}
                                mb="10px"
                              >
                                <Flex
                                  minWidth="max-content"
                                  alignItems="center"
                                  justifyContent={'space-between'}
                                  w="100%"
                                >
                                  <Box>
                                    <Text fontSize="sm" fontWeight="400">
                                      {sub?.psPlanDuration} {sub?.psPlanType}
                                    </Text>
                                  </Box>
                                  <Spacer />
                                  <ButtonGroup>
                                    <Icon
                                      _hover={textHover}
                                      _active={{
                                        bg: 'transparent',
                                      }}
                                      as={MdEdit}
                                      onClick={() => handleedit(sub?.psId)}
                                      h="16px"
                                      w="16px"
                                      me="8px"
                                    />
                                    <Icon
                                      _hover={textHover}
                                      _active={{
                                        bg: 'transparent',
                                      }}
                                      as={MdDelete}
                                      onClick={() => handleDelete(sub?.psId)}
                                      h="16px"
                                      w="16px"
                                      me="8px"
                                    />
                                  </ButtonGroup>
                                </Flex>
                              </MenuItem>
                            ))}
                            <ButtonGroup  _hover={textHover}
                              onClick={() =>
                                navigate(`updatePlanDuration/${item?.plId}`)
                              }
                            >
                              <Icon
                                mt={'5px'}
                                _hover={textHover}
                                alignItems={'center'}
                                color={textColor}
                                cursor={'pointer'}
                                as={FaPlus}
                                h="16px"
                                w="16px"
                                me="8px"
                              />
                              <Text color={textColor} _hover={textHover} cursor={'pointer'}>
                                Add more
                              </Text>
                            </ButtonGroup>
                          </MenuList>
                        )}
                      </Menu> */}
                    
            </Box>
          
          <Card mb={{ base: '0px', xl: '20px' }} w={{md:'100%',lg:'50%'}} mt={{base:3,sm:3,md:3,lg:0}} >
            <Flex direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700" mb="20px">
                Plan {id ? 'Updation':'Creation'} 
              </Text>
            </Flex>        
              <SimpleGrid  columns={{ sm: 1, md: 1 }}
              spacing={{ base: '20px', xl: '20px' }}>
              <SelectField
                          mb='0px'
                          me='30px'
                          id="psPlanType"
                          label="Plan Type"
                          name="psPlanType"
                          options={options}
                          value={options.find(option => option.value === formDatas.psPlanType) || null}
                          // value={options.find((option) => option.value === formDatas[i.toString()]?.psPlanType) || null}
                          onChange={handleSelectChange}
                          isRequired={true}
                          handleSeletAttr={handlePlanType}
                          // isRequired={true}
                          
                        />
                        <InputField
                          mb='0px'
                          me='30px'
                          id="psPlanDuration"
                          name="psPlanDuration"
                          label='Plan Duration'
                          placeholder='eg. 1'
                          value={formDatas.psPlanDuration}
                          onChange={handlePlanDurationChange}
                          isRequired={true}
                          ref={psPlanDurationRef}
                        />
            </SimpleGrid>
        
            {/* <Flex flexDirection="row" justifyContent={'center'}>
              <Button mt="20px" mr="10px" padding={2} background="#3311db" color="#fff" w={70} onClick={handleSubmit}
              //  isDisabled={isDisabled.plStatus||isButtonDisabled}
              >
                {id ? 'Update' : 'Save'}
              </Button>

              <Button mt="20px" padding={2} background="#3311db" color="#fff" w={70} onClick={handleBack}>
                Cancel
              </Button>
            </Flex> */}
            <Flex justify="space-between">
              <Button
                  //  variant="light"
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
            </Flex>
          </Card>
        </Card>
      </Box>
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert} /> : null}
    </>
  );
};

export default Plan;