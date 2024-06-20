import React, { useState, useEffect,useRef } from 'react';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import { CircularProgress} from '@chakra-ui/react';
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
import { createSubscription,updateSubscription,getSubscriptionPlanById1 } from 'utils/subscriptionPlans/subscriptionPlan';

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
    psPlanId:'',
    psStatus:'',
  });
 
  
  

  const { id } = useParams();
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



  useEffect(() => {
    const fetchData = async () => {
        if (id) {
          try {
            console.log('edit', id);
            const planId = id;
            const result = await getSubscriptionPlanById1(planId);
    
            if (result.status !== 'Success') {
              console.log('getPlan Error', result?.message);
              return;
            }
    
            let planData = result.data[0].someAlias; // Assuming data is an array with one element
            console.log('planData:', planData);
            let planDatas = result.data[0]; // Assuming data is an array with one element
            console.log('planDatas:', planDatas);
           const ids= planDatas.psPlanId;
           console.log("ids",ids);
            // Initialize formData state
            setFormData({
              plPlanName: planData.plPlanName,
            //   plStatus: planData.plStatus,
              plMaxLearner: planData.plMaxLearner,
              plMaxGame: planData.plMaxGame,
              plMaxBackgrounds: planData.plMaxBackgrounds,
              plMaxCharacters: planData.plMaxCharacters,
              plMaxAnalyticsDashboard: planData.plMaxAnalyticsDashboard,
              plMAxGameHours: planData.plMAxGameHours,
            });
            setFormDatas({
                psPlanDuration:planDatas.psPlanDuration,
                psPlanType:planDatas.psPlanType,
                psPlanId:planDatas.psPlanId,
                psStatus:planDatas.psStatus,
              });

    
            // Initialize rows state based on subscription plans
            // const subscriptionData = planDatas?.psSubscriptionPlans;
    
            // if (subscriptionData && subscriptionData.length > 0) {
            //   const initialRows = subscriptionData.map((subscription: any) => ({
            //     psPlanType: subscription.psPlanType,
            //     psPlanDuration: subscription.psPlanDuration.toString(), // Assuming psPlanDuration is a string, adjust if needed
            //     psPrice: subscription.psPrice?.toString() || '', // Convert to string or use an empty string if null
            //   }));
    
            //   setRows(initialRows);
            // }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      };
    fetchData();
    setHandleSeletAttr(!handleSeletAttr);
    setHandlePlanType(!handlePlanType);
  }, [id]);
  

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

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("HandleSumbit");
    setAlert(false);
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

    if(!formDatas["psStatus"]){
      setHandleSeletAttr(true);
    }else{
      setHandleSeletAttr(false);
    }
    e.preventDefault();
    if (!formData.plPlanName) {
      handleToast('Please enter the Plan name', 'error', true);
      return false;
    }
    if (!formDatas.psPlanType) {
      handleToast('Please select the Plan type', 'error', true);
      return false;
    }
    if (!formDatas.psPlanDuration) {
      psPlanDurationRef.current.style.borderColor = 'red'; 
      handleToast('Please enter the Plan validity days', 'error', true);
      return false;
    }
    if (!formData.plMaxLearner) {
      handleToast('Please select the Learner Limit', 'error', true);
      return false;
    }
    if (!formData.plMaxGame) {
      handleToast('Please select the Game Limit', 'error', true);
      return false;
    }
    if (!formData.plMaxBackgrounds) {
      handleToast('Please select the Backgrounds Limit', 'error', true);
      return false;
    }
    if (!formData.plMaxCharacters) {
      handleToast('Please select the Characters Limit', 'error', true);
      return false;
    }
    if (!formData.plMaxAnalyticsDashboard) {
      handleToast('Please select the Dashboard Limit', 'error', true);
      return false;
    }
    if (!formData.plMAxGameHours) {
      handleToast('Please select the Game Duration Limit', 'error', true);
      return false;
    }
    if (!formDatas.psStatus) {
      handleToast('Please select the status', 'error', true);
      return false;
    }
    try {
      setButtonDisabled(true);
     const ids= formDatas.psPlanId
      let data = JSON.stringify(formData);
      console.log("datasd",data)

      if (id) {

        const result = await updateplan(ids, data);
        if (result?.status !== 'Success') {
          setButtonDisabled(false);
          handleToast('Failed to update Plan', 'error', true);
          // setTimeout(() => {
          //   navigate('/admin/superadmin/plan');
          // }, 2000);
          return;
        }else{
        handleToast('Plan updated Successfully', 'success', true);
        console.log('result.data', result.data);

        for (const row of rows) {
          const datass = JSON.stringify(formDatas);

          const subscriptionResult = await updateSubscription(id,datass);

          if (subscriptionResult?.status !== 'Success') {
            console.error('Failed to update subscription:', subscriptionResult?.message);
          } else {
            console.log('Subscription updated successfully:', subscriptionResult.data);
            setTimeout(() => {
          navigate('/admin/superadmin/plan');
        }, 200);
          }
        }
        // setTimeout(() => {
        //   navigate('/admin/superadmin/plan');
        // }, 2000);
      }
        // navigate('/admin/superadmin/plan/');
      }
    //   else {
    //     const result = await createplan(data);
    //     if (result?.status !== 'Success') {
    //       setButtonDisabled(false);
    //       // console.log('updatePlan Error :', result?.message);
    //       handleToast('Failed to Add plan', 'error', true);
    //       // setTimeout(() => {
    //       //   navigate('/admin/superadmin/plan/');
    //       // }, 2000);
    //       // return;
    //     } else {
    //       handleToast('Plan Created Successfully', 'success', true);
    //       console.log('result.data', result.data);
          
    //       let rowIndex: string;

    //       for (const row of rows) {
    //         const subscriptionData = {
    //           psPlanId: result.data?.plId,
    //           psPlanType: row.psPlanType,
    //           psPlanDuration: row.psPlanDuration,
    //         };

    //         const subscriptionResult = await createSubscription(JSON.stringify(subscriptionData));

    //         if (subscriptionResult?.status !== 'Success') {
    //           console.error('Failed to create subscription:', subscriptionResult?.message);
    //         } else {
    //           console.log('Subscription created successfully:', subscriptionResult.data);
    //         }
    //       }

    //       // Redirect to the plan listing page
    //       // setTimeout(() => {
    //       //   navigate('/admin/superadmin/plan');
    //       // }, 2000);}
    //     }
    //   }
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



  return (
    <>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'75px'} position={'relative'}>
        <Card alignItems={'center'}>    
          <Card bg={'linear-gradient(to bottom, #7551ff, #3311db)'} w={'100%'} h={{base: '170', sm: '170', md: '300', lg: '300'}} position={'relative'} alignItems={'center'}></Card>
          <Card mb={{ base: '0px', xl: '20px' }} width={{base: '95%', md: '70%'}} marginTop={'-120px'} >
            <Flex direction="column">
              <Text color={textColorPrimary} fontSize="2xl" p={'23px 0px'} fontWeight="700" mb="0px">
                Plan {id ? 'Updation' : 'Creation'}
              </Text>
            </Flex>
            <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '25px' }}  style={{ display: 'none' }}>              
              <InputField
                mb="0px"
                me="30px"
                name="plPlanName"
                value={formData.plPlanName}
                onChange={handleChange}
                label="Plan Name"
                placeholder="eg. High Demand"
                isRequired={true}
                ref={plPlanNameRef}
              />

              <InputField
                mb="0px"
                me="30px"
                name="plMaxLearner"
                onChange={handleChange}
                id="plMaxLearner"
                value={formData.plMaxLearner}
                label="Learner Limit"
                type="number"
                isRequired={true}
                // isDisabled={isDisabled.plMaxLearner}
                placeholder="Enter Learner Limit"
                ref={plMaxLearnerRef}
              />
              <InputField
                mb="0px"
                me="30px"
                name="plMaxGame"
                onChange={handleChange}
                id="plMaxGame"
                value={formData.plMaxGame}
                label="Game Limit"
                type="number"
                isRequired={true}
                // isDisabled={isDisabled.plMaxGame}
                placeholder="Enter Game Limit"
                ref={plMaxGameRef}
              />
              <InputField
                mb="0px"
                me="30px"
                name="plMaxBackgrounds"
                onChange={handleChange}
                id="plMaxBackgrounds"
                value={formData.plMaxBackgrounds}
                label="Backgrounds Limit"
                type="number"
                isRequired={true}
                // isDisabled={isDisabled.plMaxBackgrounds}
                placeholder="Enter Background sLimit"
                ref={plMaxBackgroundsRef}
              />
              <InputField
                mb="0px"
                me="30px"
                name="plMaxCharacters"
                onChange={handleChange}
                id="plMaxCharacters"
                value={formData.plMaxCharacters}
                label="Characters Limit"
                type="number"
                isRequired={true}
                // isDisabled={isDisabled.plMaxCharacters}
                placeholder="Enter Characters Limit"
                ref={plMaxCharactersRef}
              />
              <InputField
                mb="0px"
                me="30px"
                name="plMaxAnalyticsDashboard"
                onChange={handleChange}
                id="plMaxAnalyticsDashboard"
                value={formData.plMaxAnalyticsDashboard}
                label="Dashboard Limit"
                type="number"
                isRequired={true}
                // isDisabled={isDisabled.plMaxAnalyticsDashboard}
                placeholder="Enter Dashboard Limit"
                ref={plMaxAnalyticsDashboardRef}
              />
              <InputField
                mb="0px"
                me="30px"
                name="plMAxGameHours"
                onChange={handleChange}
                id="plMAxGameHours"
                value={formData.plMAxGameHours}
                label="Game DurationLimit"
                type="number"
                isRequired={true}
                // isDisabled={isDisabled.plMAxGameHours}
                placeholder="Enter Game Duration"
                ref={plMAxGameHoursRef}
              />

              <SelectField
                mb="0px"
                me="30px"
                id="psStatus"
                label="Active Status"
                name="psStatus"
                options={statusOptions}
                value={statusOptions.find((option) => option.value === formDatas.psStatus) || null}
                onChange={handleStatusChange}
                isRequired={true}
                handleSeletAttr={handleSeletAttr}
              // isDisabled={isDisabled.plStatus}

              />
              </SimpleGrid>
              <SimpleGrid  columns={{ sm: 1, md: 2 }}
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
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert} /> : null}
    </>
  );
};

export default Plan;