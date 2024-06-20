import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import { CircularProgress, Table, Thead, Tbody, Tr, Th, Td, border } from '@chakra-ui/react';
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
import { createSubscription, updateSubscription, getSubscriptionPlanById } from 'utils/subscriptionPlans/subscriptionPlan';
import { MdBorderColor } from 'react-icons/md';

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
const Plan: React.FC = () => {
  const isInvalid = true;
  const toast = useToast();
  type FormData = {

    plPlanName: string;
    plMaxLearner: string;
    plMaxGame: string;
    plMaxBackgrounds: string;
    plMaxCharacters: string;
    plMaxAnalyticsDashboard: string;
    plMAxGameHours: string;
    plStatus: string;

  };
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
    plStatus: '',
  });
  // const [formDatas, setFormDatas] = useState(() => ({
  //   psPlanType: '',
  //   psPlanId: [],
  //   psPlanDuration: [],
  //   psPrice: [],
  // }));

  interface PlanData {
    psPlanType: string;
    psPlanId: string;
    psPlanDuration: string;
    psPrice: string;
  }

  const [formDatas, setFormDatas] = useState<{ [key: string]: PlanData }>({});


  const { id } = useParams();
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [noOfRows, setNoOfRows] = useState<any>(1);
  const [rows, setRows] = useState<RowType[]>([{ psPlanType: '', psPlanDuration: '', psPrice: '' }]);
  const [specificInvalidIds, setspecificInvalidIds] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const planId = id;
        const result = await getPlanById(planId);
        console.log('Result:', result);
        if (result.status !== 'Success') {
          console.log('getPlan Error', result?.message);
          return;
        }

        let planData = result?.data;
        console.log('planData:', planData);

        // Initialize formData state
        setFormData(planData);
        const results = await getSubscriptionPlanById(planId);
        console.log('Result:', result);
        if (result.status !== 'Success') {
          console.log('getPlan Error', result?.message);
          return;
        }

        let planDatas = results?.data;
        console.log('planData:', planData);

        // Initialize formData state
        setRows(planDatas);
        // setFormData({
        //   plPlanName: planData.plPlan,
        //   plStatus: planData.plStatus,
        //   plMaxLearner: planData.plGameLimit,
        //   plMaxGame: planData.plGameLimit,
        //   plMaxBackgrounds: planData.plBackgroundsLimit,
        //   plMaxCharacters: planData.plCharactersLimit,
        //   plMaxAnalyticsDashboard: planData.plDashboardLimit,
        //   plMAxGameHours: planData.plGameDurationLimit,
        // });

        // Initialize rows state based on subscription plans
        const subscriptionData = planData?.psSubscriptionPlans;
        if (subscriptionData && subscriptionData.length > 0) {
          setRows(subscriptionData.map((subscription: any) => ({
            psPlanType: subscription.psPlanType,
            psPlanDuration: subscription.psPlanDuration,
            psPrice: subscription.psPrice,
          })));
        }
      }
    };

    fetchData();
    setHandleSeletAttr(!handleSeletAttr);
    console.log('handleSeletAttr', handleSeletAttr);
  }, [id]);

  const handleRowChange = (index: number, key: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
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
  const handleTimeChange = (value: string) => {
    setFormData({ ...formData, plMAxGameHours: value });
  };
  // const handleSelectChange = (selectedOption: OptionType | null) => {
  //   setFormDatas((prevFormData) => ({
  //     ...prevFormData,
  //     psPlanType: selectedOption ? selectedOption.value : '',
  //   }));
  // };


  const handleSelectChange = (selectedOption: OptionType | null, rowIndex: string) => {
    console.log('selectedOption', selectedOption);
    setFormDatas((prevFormDatas) => ({
      ...prevFormDatas,
      [rowIndex]: {
        ...prevFormDatas[rowIndex],
        psPlanType: selectedOption ? selectedOption.value : '',
      },
    }));
  };
  const handleSelectChange1 = (selectedOption: OptionType | null, rowIndex: string) => {
    console.log('selectedOption', selectedOption);
    // Create a new copy of the rows array
    const updatedRows = [...rows];
    // Update the psPlanType for the specific row index
    updatedRows[parseInt(rowIndex, 10)].psPlanType = selectedOption ? selectedOption.value : '';
    // Update the state with the new rows array
    setRows(updatedRows);
  };



  const handleStatusChange = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData({
      ...formData,
      plStatus: selectedOption ? selectedOption.value : '',
    });
    // Check if the function is triggered by user interaction
    const isUserInteraction = selectedOption !== null;

    // Set handleSeletAttr based on whether cpIndustry has a value or not
    setHandleSeletAttr(isUserInteraction ? !value.trim() : handleSeletAttr);

    const currentIndex = Object.keys(formData).indexOf('plStatus');
    const emptyKeys = Object.keys(formData).filter((key, index) => {
      // Exclude cpIndustry from emptyKeys if it has a value
      if (key === 'plStatus' && value.trim() !== '') {
        return false;
      }

      // For other keys, use the existing condition
      return index < currentIndex && formData[key as keyof FormData] === '';
    });

    // Update the border color based on emptyKeys
    Object.keys(formData).forEach((key) => {
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
    console.log('formData', formData);
    console.log('emptyKeys', emptyKeys);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("HandleSumbit");
    setAlert(false);
    e.preventDefault();

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
    if (!formData["plStatus"]) {
      setHandleSeletAttr(true);
    } else {
      setHandleSeletAttr(false);
    }
    if (!formData.plPlanName) {
      handleToast('Please enter the Plan name', 'error', true);
      return false;
    }
    // if (!formDatas.psPlanType) {
    //   handleToast('Please select the Plan type', 'error', true);
    //   return false;
    // }
    // if (!formData.plValidityDays) {
    //   handleToast('Please enter the Plan validity days', 'error', true);
    //   return false;
    // }
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
    if (!formData.plStatus) {
      handleToast('Please select the status', 'error', true);
      return false;
    }
    for (const [index, row] of rows.entries()) {
      const subscriptionData = {
        psPlanType: formDatas[index]?.psPlanType,
        psPlanDuration: row?.psPlanDuration,
      };
      const mergerPosition = `psPlanType-${index}`;
      const mergerPositionDuration = `psPlanDuration-${index}`;
      const inputFieldElement = document.getElementById(mergerPosition);
      const inputFieldElementDuration = document.getElementById(mergerPositionDuration);
      if (!subscriptionData.psPlanType) {
        setspecificInvalidIds([mergerPosition]);

        return false;
      }
      if (!subscriptionData.psPlanDuration) {
        setspecificInvalidIds([mergerPositionDuration]);
        console.log('specificInvalidIds', specificInvalidIds)
        inputFieldElementDuration.focus();
        return false;
      }


      console.log(subscriptionData.psPlanType, 'subscriptionData.psPlanType')
    }
    try {

      setButtonDisabled(true);
      let data = JSON.stringify(formData);
      if (id) {
        const result = await updateplan(id, data);
        if (result?.status !== 'Success') {
          setButtonDisabled(false);
          handleToast('Failed to update Plan', 'error', true);
          // setTimeout(() => {
          //   navigate('/admin/superadmin/plan');
          // }, 2000);
          return;
        } else {
          handleToast('Plan updated Successfully', 'success', true);
          const { psPlanType, psPlanDuration } = formDatas;
          console.log('result.data', result.data);
          // Make a request to createplansubscription API
          // const subscriptionData = {
          //   psPlanId: result.data?.plId,
          //   psPlanType: psPlanType,
          //   psPlanDuration: psPlanDuration,
          //   // ... (other fields needed for createplansubscription API)
          // };
          let rowIndex: string;

          for (const row of rows) {
            const subscriptionData = {
              psPlanId: result.data?.plId,
              psPlanType: row.psPlanType,
              psPlanDuration: row.psPlanDuration,
            };
            const datass = JSON.stringify(subscriptionData);

            const subscriptionResult = await updateSubscription(id, datass);

            if (subscriptionResult?.status !== 'Success') {
              console.error('Failed to update subscription:', subscriptionResult?.message);
            } else {
              console.log('Subscription updated successfully:', subscriptionResult.data);
            }
          }
          // setTimeout(() => {
          //   navigate('/admin/superadmin/plan');
          // }, 2000);
        }
        // navigate('/admin/superadmin/plan/');
      }
      else {

        const result = await createplan(data);
        if (result?.status !== 'Success') {
          setButtonDisabled(false);
          // console.log('updatePlan Error :', result?.message);
          handleToast('Failed to Add plan', 'error', true);
          // setTimeout(() => {
          //   navigate('/admin/superadmin/plan/');
          // }, 2000);
          // return;
        } else {
          handleToast('Plan Created Successfully', 'success', true);

          // console.log('result.data', formDatas);
          // Make a request to createplansubscription API
          // const subscriptionData = {
          //   psPlanId: result.data?.plId,
          //   psPlanType: psPlanType,
          //   psPlanDuration: psPlanDuration,
          //   // ... (other fields needed for createplansubscription API)
          // };
          let rowIndex: string;
          for (const [index, row] of rows.entries()) {
            const subscriptionData = {
              psPlanId: result.data?.plId,
              psPlanType: formDatas[index].psPlanType,
              psPlanDuration: row.psPlanDuration,
            };


            const subscriptionResult = await createSubscription(JSON.stringify(subscriptionData));

            if (subscriptionResult?.status !== 'Success') {
              console.error('Failed to create subscription:', subscriptionResult?.message);
            } else {
              console.log('Subscription created successfully:', subscriptionResult.data);
              setTimeout(() => {
                navigate('/admin/superadmin/plan');
              }, 200);
            }

          }

          // Redirect to the plan listing page

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

  const handleAddRow = () => {
    setNoOfRows(noOfRows + 1);
    const newRowId = noOfRows;
    setRows((prevRows) => [
      ...prevRows,
      { psPlanType: '', psPlanDuration: '', psPrice: '' } // Initialize additional details
    ]);
    setFormDatas((prevFormDatas) => ({
      ...prevFormDatas,
      [newRowId.toString()]: {
        psPlanType: '',
        psPlanId: '',
        psPlanDuration: '',
        psPrice: ''
      },
    }));
  };

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={'75px'} position={'relative'}>
        <Card alignItems={'center'}>       
          <Card bg={'linear-gradient(to bottom, #7551ff, #3311db)'} w={'100%'} h={{base: '170', sm: '170', md: '300', lg: '300'}} position={'relative'} alignItems={'center'}></Card>
          <Card mb={{ base: '0px', xl: '20px' }} width={{base: '95%', md: '70%'}} marginTop={'-120px'} >
            <Flex direction="column" >
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700" mb="20px">
                Plan {id ? 'Updation' : 'Creation'}
              </Text>

            </Flex>
            <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '25px' }}>
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
              // isDisabled={isDisabled.plPlanName}
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
                id="plStatus"
                label="Active Status"
                name="plStatus"
                options={statusOptions}
                value={statusOptions.find((option) => option.value === formData.plStatus) || null}
                onChange={handleStatusChange}
                isRequired={true}
                handleSeletAttr={handleSeletAttr}
              // isDisabled={isDisabled.plStatus}
              />
            </SimpleGrid>
            <Box m={'50px 0 20px 0'} w={'100%'} overflowX={'auto'}>              
              <Table boxShadow={'1px 2px 17px #f7f7f7'} border={'2px solid #f1f1f1'} mb={'30px'}>
                <Thead whiteSpace={'nowrap'}>
                  <Tr>
                    <Th color={'#000'} fontFamily={'Nunito Sans'} borderRight={'2px solid #f1f1f1'}> Plan Type<span style={{ color: 'red' }}>*</span></Th>
                    <Th color={'#000'} fontFamily={'Nunito Sans'} borderRight={'2px solid #f1f1f1'}>Plan Duration<span style={{ color: 'red' }}>*</span></Th>
                  </Tr>
                </Thead>
                <Tbody whiteSpace={'nowrap'}>
                  {rows.map((row, i) => (
                    <Tr key={i} whiteSpace={'nowrap'}>
                      <Td width="51%" p={'0.5rem 1.0rem'} borderRight={'2px solid #f1f1f1'}>
                        <SelectField
                          mb='0px'
                          me='30px'
                          id={`plantype-${i}`}
                          name={`psPlanType-${i}`}
                          options={options}
                          value={options.find((option) => option.value === formDatas[i.toString()]?.psPlanType) || null}
                          onChange={(selectedOption: OptionType | null) => handleSelectChange(selectedOption, i.toString())}
                          style={{
                            borderColor: isInvalid && specificInvalidIds.includes(`plantype-${i}`) ? 'red' : ''
                          }}
                        />
                      </Td>
                      <Td width="49%" p={'0.5rem 1.0rem'} borderRight={'2px solid #f1f1f1'}>
                        <InputField
                          mb='0px'
                          me='30px'
                          id={`psPlanDuration-${i}`}
                          name={`psPlanDuration-${i}`}
                          placeholder='eg. 1'
                          autoComplete="off"
                          value={row.psPlanDuration}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleRowChange(i, 'psPlanDuration', e.target.value)
                          }
                          style={{ borderColor: specificInvalidIds.includes(`psPlanDuration-${i}`) ? 'red' : '' }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex mb={'20px'}>
                <Button onClick={handleAddRow} fontSize="sm" 
                color={'#190793'} 
                border={'1px solid #190793'} 
                bg={'transparent'} 
                _hover={{bg: '#11047a', color: '#fff'}}
                >Add Row</Button>
              </Flex>
            </Box>
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