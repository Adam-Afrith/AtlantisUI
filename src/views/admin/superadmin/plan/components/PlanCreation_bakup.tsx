import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import { CircularProgress } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import SweetAlert from "react-bootstrap-sweetalert"
import { useParams } from 'react-router-dom';
import TimePicker from 'react-time-picker';
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
import { createplan, getPlanById, updateplan } from 'utils/plan/plan';
// import TimePicker from './TimePicker';

// Define the type for the options
interface OptionType {
  value: string;
  label: string;
}

const Plan: React.FC = () => {
  const toast = useToast();
  // const [formData, setFormData] = useState({
  //   plPlan: '',
  //   plPlanType: '',
  //   plValidityDays: '',
  //   plPrice: '',
  //   plStatus: '',

  // });
  const [formData, setFormData] = useState({
    plPlan: '',
    plPlanType: '',
    plValidityDays: '',
    plPrice: '',
    plStatus: '',
    plLearnerLimit: '',
    plGameLimit: '',
    plBackgroundsLimit: '',
    plCharactersLimit: '',
    plDashboardLimit: '',
    plGameDurationLimit: '',
  });
  const { id } = useParams();
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');

  const [successMessage, setSuccessMessage] = useState(''); // Add success message state
  const navigate = useNavigate(); // Use the useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const planId = id;
        const result = await getPlanById(planId);
        if (result.status !== 'Success') return console.log('getPlan Error', result?.message)
        let planData = result?.data;
        setFormData({
          plPlan: planData.plPlan,
          plPlanType: planData.plPlanType,
          plValidityDays: planData.plValidityDays,
          plPrice: planData.plPrice,
          plStatus: planData.plStatus,
          plLearnerLimit: planData.plStatus,
          plGameLimit: planData.plGameLimit,
          plBackgroundsLimit: planData.plBackgroundsLimit,
          plCharactersLimit: planData.plCharactersLimit,
          plDashboardLimit: planData.plDashboardLimit,
          plGameDurationLimit: planData.plGameDurationLimit,

        });
        // Axios.get(`${API_SERVER}/plan/getPlanById/${planId}`)
        //   .then((response) => {
        //     if (response.status === 200) {
        //       const planData = response.data.data;
        //       console.log(' planData.plPlanType', planData);
        //       setFormData({
        //         plPlan: planData.plPlan,
        //         plPlanType: planData.plPlanType,
        //         plValidityDays: planData.plValidityDays,
        //         plPrice: planData.plPrice,
        //         plStatus: planData.plStatus,
        //         plCreatedUserId: planData.plCreatedUserId,
        //       });

        //       setLoading(false);
        //     }
        //   })
        //   .catch((error) => {
        //     console.error('An error occurred while fetching the plan data:', error);
        //     setLoading(false);
        //   });
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
  };
  const handleSelectChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, plPlanType: selectedOption.value });
  };

  const handleStatusChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, plStatus: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setAlert(false);
    e.preventDefault();
    if (!formData.plPlan) {

      setMsg('Please enter the plan name');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
    if (!formData.plPlanType) {

      setMsg('Please select the plan type');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
    if (!formData.plValidityDays) {

      setMsg('Please enter the plan validity days');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
    if (!formData.plPrice) {

      setMsg('Please enter the plan price');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
    if (!formData.plStatus) {

      setMsg('Please select the status');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
    try {
      let data = JSON.stringify(formData);
      if (id) {
        const result = await updateplan(id, data);
        if (result?.status !== 'Success') {
          console.log('updatePlan Error :', result?.message);
          //  alert(result?.message);
          setMsg('Failed to update Plan');
          setToastStatus('error');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/plan');
          }, 200);
          return;
        }
        setMsg('Plan updated');
        setToastStatus('success');
        setAlert(true);
        setTimeout(() => {
          navigate('/admin/superadmin/plan');
        }, 200);
        // navigate('/admin/superadmin/plan/');
      }
      else {
        const result = await createplan(data);
        if (result?.status !== 'Success') {
          console.log('updatePlan Error :', result?.message);
          setMsg('Failed to Add plan');
          setToastStatus('error');
          setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/plan/');
          }, 200);
          return;
        }
        setMsg('Creator Stored');
        setToastStatus('success');
        setAlert(true);
        setTimeout(() => {
          navigate('/admin/superadmin/plan');
        }, 200);
      }
    } catch (error) {
      console.error('An error occurred while sending the request:', error);
    }
  };

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

  // Sample options data
  const options: OptionType[] = [
    { value: 'Days', label: 'Days' },
    { value: 'Month', label: 'Month' },
    { value: 'Year', label: 'Year' },
  ];
  const statusOptions: OptionType[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];
  console.log('formData.plPlanType', formData.plPlanType);
  return (
    <>
      <Box mb={{ base: '0px', xl: '100px' }}></Box>
      <Card mb={{ base: '0px', xl: '20px' }}>
        <Flex direction="column" mb="40px" ms="10px">
          <Text fontSize="xl" color={textColorPrimary} fontWeight="bold">
            Plan {id ? 'Updation' : 'Creation'}
          </Text>

        </Flex>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '20px' }}>
          <InputField
            mb="0px"
            me="30px"
            name="plPlan"
            value={formData.plPlan}
            onChange={handleChange}
            label="Plan Name"
            placeholder="eg. High Demand"
            isRequired={true}
          />
          <SelectField
            id="plantype"
            label="Plan Type"
            name="plPlanType"
            options={options}

            value={options.find(option => option.value === formData.plPlanType) || null}
            onChange={handleSelectChange}
            isRequired={true}
          />
          <InputField
            mb="0px"
            me="30px"
            name="plValidityDays"
            onChange={handleChange}
            id="plValidityDays"
            value={formData.plValidityDays}
            label="Plan Validity"
            type="number"
            isRequired={true}
            placeholder="eg. 12"
          />
          <InputField
            mb="0px"
            onChange={handleChange}
            value={formData.plPrice}
            name="plPrice"
            id="plPrice"
            type="number"
            label="Plan Price"
            placeholder="eg. $180"
            isRequired={true}
          />
          <InputField
            mb="0px"
            me="30px"
            name="plLearnerLimit"
            onChange={handleChange}
            id="plLearnerLimit"
            value={formData.plLearnerLimit}
            label="Learner Limit"
            type="number"
            isRequired={true}
            placeholder="Enter Learner Limit"
          />
          <InputField
            mb="0px"
            me="30px"
            name="plGameLimit"
            onChange={handleChange}
            id="plGameLimit"
            value={formData.plGameLimit}
            label="Game Limit"
            type="number"
            isRequired={true}
            placeholder="Enter Game Limit"
          />
          <InputField
            mb="0px"
            me="30px"
            name="plBackgroundsLimit"
            onChange={handleChange}
            id="plBackgroundsLimit"
            value={formData.plBackgroundsLimit}
            label="Backgrounds Limit"
            type="number"
            isRequired={true}
            placeholder="Enter Background sLimit"
          />
          <InputField
            mb="0px"
            me="30px"
            name="plCharactersLimit"
            onChange={handleChange}
            id="plCharactersLimit"
            value={formData.plCharactersLimit}
            label="Characters Limit"
            type="number"
            isRequired={true}
            placeholder="Enter Characters Limit"
          />
          <InputField
            mb="0px"
            me="30px"
            name="plDashboardLimit"
            onChange={handleChange}
            id="plDashboardLimit"
            value={formData.plDashboardLimit}
            label="Dashboard Limit"
            type="number"
            isRequired={true}
            placeholder="Enter Dashboard Limit"
          />
          <div>
        <label>Game Duration Limit:</label>
        <TimePicker
          onChange={handleTimeChange}
          value={selectedTime}
        />
      </div>
          {/* <InputField
            mb="0px"
            id="plStatus"
            name="plStatus"
            value={formData.plStatus}
            onChange={handleChange}
            label="Active Status"
            placeholder="eg. Active"
          /> */}
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
          />
        </SimpleGrid>
        <Flex flexDirection="row">
          <Button mt="20px" mr="10px" padding={2} background="#3311db" color="#fff" w={70} onClick={handleSubmit}>
            {id ? 'Update' : 'Save'}
          </Button>

          <Button mt="20px" padding={2} background="#3311db" color="#fff" w={70} onClick={handleBack}>
            Cancel
          </Button>
        </Flex>
      </Card>
      {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null}
    </>
  );
};

export default Plan;