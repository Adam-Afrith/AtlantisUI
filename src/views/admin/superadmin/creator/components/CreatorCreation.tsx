import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

// Chakra imports
import {
  Flex,
  SimpleGrid,
  Text,
  Box,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Checkbox,
} from '@chakra-ui/react';

// Custom Imports
import InputField from 'components/fields/InputFieldtwo';
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectFieldtwo';
import Card from 'components/card/Card';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import OnToast from 'components/alerts/toast';
import { useNavigate, useParams } from 'react-router-dom';

import {
  addCreator,
  getCompanyList,
  getCreator,
  updateCreator,
  emailExistenceChecker,
} from 'utils/creator/creator';
import {
  getAllCompanies,
  getCountries,
  geoLocation,
} from 'utils/company/companyService';
import { getPlanName } from 'utils/plan/plan';
import {
  creatPlanValidity,
  updatePlanValidity,
  getPlanTypeInCreator,
} from 'utils/planvalidity/planvalidity';
import { getPlanType } from 'utils/subscriptionPlans/subscriptionPlan';
import {
  getEndDateById,
  getPlanValidity,
  getEndDate,
} from 'utils/planvalidity/planvalidity';
import { useAuth } from 'contexts/auth.context';
const CreatorCreation = () => {
  const toast = useToast();
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  /*****tost */
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [showRenewPlanFields, setShowRenewPlanFields] = useState(false);
  console.log('showRenewPlanFields', showRenewPlanFields);

  /******* */
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [planOptions, setPlanOptions] = useState([]);
  const [plan, setplan] = useState<planType[]>([]);
  // ****
  const [showPlanValidity, setShowPlanValidity] = useState(true);
  const [showRenewPlanValidity, setShowRenewPlanValidity] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<OptionType | null>(
    null,
  );

  const [isCtNameValid, setIsCtNameValid] = useState<boolean>(false);
  const [isCtCompanyValid, setIsCtCompanyValid] = useState<boolean>(false);
  const [isCtMailValid, setIsCtMailValid] = useState<boolean>(false);
  const [isCtStatusValid, setIsCtStatusValid] = useState<boolean>(false);
  const [isCtPlanIdValid, setisCtPlanIdValid] = useState<boolean>(false);
  const [isCtPlanValidity, setisCtPlanValidity] = useState<boolean>(false);

  const ctNameRef = useRef<HTMLInputElement | null>(null);
  const ctMailRef = useRef<HTMLInputElement | null>(null);
  const [handleSeletAttr, setHandleSeletAttr] = useState<boolean>(true);
  const [handleStatus, sethandleStatus] = useState<boolean>(true);
  const [handlePlan, sethandlePlan] = useState<boolean>(true);
  const [handlePlanType, sethandlePlanType] = useState<boolean>(true);

  const [endDate, setEndDate] = useState([]);
  // *****
  const [selectedStatus, setSelectedStatus] = useState({
    value: 'Active',
    label: 'Active',
  });

  const [emailExisted, setEmailExisted] = useState(null);

  type FormData = {
    ctCompanyId: string;
    ctName: string;
    ctMail: string;
    ctCountry: string;
    ctDesignation: string;
    ctAge: string;
    ctGender: string;
    ctPassword: null;
    ctCreatedUserId: number;
    ctEditedUserId: number;
    ctCreatedDate: string;
    ctEditedDate: string;
    ctCreateAdminId: number;
    ctEditAdminId: string;
    ctCreateAdminDate: string;
    ctEditAdminDate: string;
    ctStatus: string;
    ctPlanId: string;
    phPlanId: string;
    phRenewalPlanId: string;
    phRenewalValidityDays: string;
  };

  const [formData, setFormData] = useState<FormData>({
    ctName: '',
    ctCompanyId: '',
    ctMail: '',
    ctAge: null,
    ctGender: null,
    ctCountry: '',
    ctDesignation: '',
    ctStatus: 'Active',
    ctPlanId: '',
    phPlanId: '',
    ctPassword: null,
    ctCreatedUserId: 1,
    ctEditedUserId: 1,
    ctCreatedDate: '',
    ctEditedDate: '',
    ctCreateAdminId: 1,
    ctEditAdminId: '',
    ctCreateAdminDate: '',
    ctEditAdminDate: '',
    phRenewalPlanId: '',
    phRenewalValidityDays: '',
  });

  interface OptionType {
    value: string;
    label: string;
  }
  interface planType {
    plId: string;
    plPlanName: string;
    plPlanType: string; // Add plPlanType property
    // other properties if any
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          const setGeolocation = {
            ctCountry: '',
          };
          const response = await geoLocation();
          setGeolocation.ctCountry = response.data[0].id;
          console.log('response', setGeolocation);
          setFormData((prevForm) => ({
            ...prevForm,
            ctCountry: setGeolocation.ctCountry,
          }));
        }

        if (id) {
          const result = await getCreator(id);
          if (result?.status !== 'Success')
            return console.log('getCreator Error :', result?.message);
          setFormData(result?.data);

          const selectedPlan = result?.data.ctPlanId;
          setSelectedPlanType(selectedPlan?.ctPlanId || '');

          console.log('Selected plan in getcreator:', selectedPlan);
          // setFormData((prevFormData) => ({
          //   ...prevFormData,
          //   phPlanId: result?.data.phPlanId || '', // Set the default value
          // }));
        }
        const company = await getCompanyList();
        if (company?.status !== 'Success')
          return console.log('getCountries Error :', company?.message);
        setCompanyOptions(company?.data);
        if (id) {
          const getPlanType = await getPlanTypeInCreator(id);
          console.log('getPlanType', getPlanType);
          if (getPlanType?.status === 'Success' && getPlanType?.data) {
            const { phValidityDays, phPlanType } = getPlanType.data;
            setSelectedPlanType({
              value: `${phValidityDays}-${phPlanType}`,
              label: `${phValidityDays}`,
            });
          } else {
            console.error(
              'Error fetching plan type data:',
              getPlanType?.message,
            );
          }
        }

        const result = await getCountries();
        if (result?.status !== 'Success')
          return console.log('getCountries Error :', result?.message);
        setCountryOptions(result?.data);
        const plans = await getPlanName(); // Replace with your actual function to get plan names
        if (plans?.status !== 'Success')
          return console.log('getPlanNames Error:', plans?.message);
        setplan(plans.data);
        setPlanOptions(plans?.data);
        console.log('plans', plans);
        console.log('plan', plan);
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
    setHandleSeletAttr(!handleSeletAttr);
    sethandleStatus(!handleStatus);
    sethandlePlan(!handlePlan);
    sethandlePlanType(!handlePlanType);
  }, []);
  useEffect(() => {
    // console.log("ctPlanId:", formData?.ctPlanId);

    formData.ctName ? setIsCtNameValid(true) : setIsCtNameValid(false);
    formData.ctCompanyId && formData.ctName
      ? setIsCtCompanyValid(true)
      : setIsCtCompanyValid(false);
    formData.ctStatus && formData.ctCompanyId && formData.ctName
      ? setIsCtStatusValid(true)
      : setIsCtStatusValid(false);

    formData.ctPlanId &&
    formData.ctCompanyId &&
    formData.ctName &&
    formData.ctStatus
      ? setisCtPlanIdValid(true)
      : setisCtPlanIdValid(false);
  }, [formData]);
  // Sample options data

  const mappedCompanyOptions = Array.isArray(companyOptions)
    ? companyOptions.map((company) => ({
        value: company.cpId,
        label: company.cpCompanyName,
      }))
    : [];
  const mappedPlanOptions = Array.isArray(plan)
    ? plan.map((plan) => ({
        value: plan.plId, // Convert to string
        label: plan.plPlanName,
      }))
    : [];

  console.log(mappedPlanOptions, 'mappedPlanOptions');
  console.log('form:', formData);
  const mappedCountryOptions = Array.isArray(countryOptions)
    ? countryOptions.map((country) => ({
        value: country.value.toString(), // Change 'Id' to 'value'
        label: country.label,
      }))
    : [];

  console.log(mappedCountryOptions, 'mappedCountryOptions');

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' },
  ];
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  const date = new Date();
  const getYear = date.getFullYear();
  const getMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const getDate = date.getDate().toString().padStart(2, '0');
  const [plantype, setPlantype] = useState({
    status: '',
    message: '',
    data: [],
  });
  const [selected, setSelected] = useState({
    ctPlanId: '',
    phPlanId: '',
    phRenewalValidityDays: '',
  });

  const isoFormatDate = `${getYear}-${getMonth}-${getDate}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    selectedOption?: OptionType,
  ) => {
    const { name, value } = e.target;
    console.log(`Value for ${name}:`, value);
    // If a selectedOption is provided, set the value of that field in the formData state
    if (selectedOption) {
      setFormData({ ...formData, [name]: selectedOption.value });
      validDataSet({});
    } else {
      // Set the value of the field to the current value of the target
      setFormData({ ...formData, [name]: value });
      validDataSet({ name, value });
    }
  };

  function validDataSet(obj: any) {
    const formDataKeysOrder: (keyof FormData)[] = [
      'ctName',
      'ctCompanyId',
      'ctMail',
      'ctAge',
      'ctGender',
      'ctCountry',
      'ctDesignation',
      'ctStatus',
      'ctPlanId',
      'phPlanId',
      'ctPassword',
      'ctCreatedUserId',
      'ctEditedUserId',
      'ctCreatedDate',
      'ctEditedDate',
      'ctCreateAdminId',
      'ctEditAdminId',
      'ctCreateAdminDate',
      'ctEditAdminDate',
      'phRenewalPlanId',
      'phRenewalValidityDays',
    ];

    const currentIndex = formDataKeysOrder.indexOf(obj.name);
    const emptyKeys = Object.keys(formData).filter((key, index) => {
      return index < currentIndex && formData[key as keyof FormData] === '';
    });

    Object.keys(formData).forEach((key) => {
      const inputRef = getRefForKey(key);
      if (inputRef && inputRef.current) {
        if (emptyKeys.includes(key)) {
          inputRef.current.style.borderColor = 'red';
        } else {
          inputRef.current.style.borderColor = '';
        }

        if (emptyKeys.includes('ctCompanyId')) {
          setHandleSeletAttr(true);
        } else {
          setHandleSeletAttr(false);
        }

        if (emptyKeys.includes('ctStatus')) {
          sethandleStatus(true);
        } else {
          sethandleStatus(false);
        }

        if (emptyKeys.includes('ctPlanId')) {
          sethandlePlan(true);
        } else {
          sethandlePlan(false);
        }

        if (emptyKeys.includes('phPlanId')) {
          sethandlePlanType(true);
        } else {
          sethandlePlanType(false);
        }
      }
    });
    // console.log('currentIndex',currentIndex);

    // console.log('emptyKeys',emptyKeys);
    // console.log('form',formData);
  }
  const getRefForKey = (key: any) => {
    switch (key) {
      case 'ctName':
        return ctNameRef;
      case 'ctMail':
        return ctMailRef;
      default:
        return null;
    }
  };
  const handleCompanyChange = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData({ ...formData, ctCompanyId: value });
    validDataSet({ name: 'ctCompanyId', value: value });
  };
  const handleCountryChange = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData({ ...formData, ctCountry: selectedOption.value });
    validDataSet({ name: 'ctCountry', value: value });
  };

  const handleGenderChange = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData({ ...formData, ctGender: selectedOption.value });
    validDataSet({ name: 'ctGender', value: value });
  };
  const handleStatusChange = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    setSelectedStatus(selectedOption);
    setFormData({ ...formData, ctStatus: value });

    validDataSet({ name: 'ctStatus', value: value });
  };

  const fetchPlanType = async (planId: string) => {
    try {
      const result = await getPlanType(planId);
      console.log('fetchPlanType', result);
      setPlantype(result);
    } catch (error) {
      console.error('An error occurred while fetching plan types:', error);
    }
  };

  // const handleChangeplan = (selectedOption: OptionType | null) => {
  //   console.log('Selected plan option:', selectedOption?.value);

  //   const fetchData = async () => {
  //     setFormData({ ...formData, ctPlanId: selectedOption?.value });

  //     try {
  //       const plantype = await getPlanType(formData.ctPlanId);
  //       console.log("plantype", plantype);
  //       // Handle plantype data as needed
  //     } catch (error) {
  //       console.error('Error fetching plan type:', error);
  //     }
  //   };

  //   fetchData(); // Call the async function
  // };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowRenewPlanFields(e.target.checked);
  };

  const handleChangeplan = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    if (selectedOption) {
      setFormData({ ...formData, ctPlanId: selectedOption?.value });
      fetchPlanType(selectedOption?.value || '');
      // setSelected({ ctPlanId: selectedOption?.value || '', phPlanId: '' });
      validDataSet({ name: 'ctPlanId', value: value });
    }
  };
  const handleChangeRenewplan = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, phRenewalPlanId: selectedOption?.value });
    // setSelected({ ctPlanId: selectedOption?.value || '', phPlanId: '' });
    fetchPlanType(selectedOption?.value || '');
  };

  const handleChangePlanType = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    // console.log('Selected Plan Type:', selectedOption);
    setSelectedStatus(selectedOption);
    validDataSet({ name: 'phPlanId', value: value });
    setFormData({ ...formData, phPlanId: selectedOption.value });
  };
  const handleChangeRenewPlanType = (selectedOption: OptionType | null) => {
    // console.log('Selected Plan Type:', selectedOption);
    setSelectedStatus(selectedOption);
    setFormData({ ...formData, phRenewalValidityDays: selectedOption.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setAlert(false);
    e.preventDefault();

    // Iterate through the keys of the form
    Object.keys(formData).forEach((key) => {
      // Access the corresponding ref based on the key
      const inputRef =
        key === 'ctName' ? ctNameRef : key === 'ctMail' ? ctMailRef : null;

      // If the field is empty and there is a corresponding ref
      if (!formData[key as keyof FormData] && inputRef && inputRef.current) {
        // Set the border color to red
        inputRef.current.style.borderColor = 'red';
      } else if (inputRef && inputRef.current) {
        // If the field is not empty, reset the border color
        inputRef.current.style.borderColor = '';
      }
    });

    if (!formData['ctCompanyId']) {
      setHandleSeletAttr(true);
    } else {
      setHandleSeletAttr(false);
    }

    if (!formData['ctStatus']) {
      sethandleStatus(true);
    } else {
      sethandleStatus(false);
    }
    if (!id) {
      if (!formData['ctPlanId']) {
        sethandlePlan(true);
      } else {
        sethandlePlan(false);
      }

      if (!formData['phPlanId']) {
        sethandlePlanType(true);
      } else {
        sethandlePlanType(false);
      }
    }
    if (emailExisted) {
      setMsg('Please use different Email Id');
      setToastStatus('error');
      setAlert(true);
      return false;
    }

    if (!formData.ctCompanyId) {
      setMsg('Please select the company name');
      setToastStatus('error');
      setAlert(true);

      return false;
    }
    if (!formData.ctName) {
      setMsg('Please select the creator name');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.ctMail) {
      setMsg('Please Fill the Mail');
      setToastStatus('error');
      setAlert(true);
      return false;
    }

    if (!formData.ctStatus) {
      setMsg('Please select the Status');
      setToastStatus('error');
      setAlert(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(formData.ctMail);

    if (!isValidEmail) {
      // You can show an error message or handle it as needed
      console.log('Invalid email format');
      // Optionally, you can display an error message to the user
      setMsg('Invalid email format');
      setToastStatus('error');
      setAlert(true);
      return;
    }
    if (!id) {
      if (!formData.ctPlanId) {
        setMsg('Please select the plan name');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
      if (!formData.phPlanId) {
        setMsg('Please select the plan validity');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
    }
    let data = JSON.stringify(formData);
    try {
      setButtonDisabled(true);
      setAlert(false);
      if (id) {
        console.log('creatorid', id);
        const result = await updateCreator(id, data);
        // console.log('result', result);
        if (result?.status !== 'Success') {
          setButtonDisabled(false);
          console.log('updateCreator Error :', result?.message);
          setMsg('Failed to update creator');
          setToastStatus('error');
          setAlert(true);
          return;
        } else {
          setMsg('Creator updated');
          setToastStatus('success');
          setAlert(true);

          setTimeout(() => {
            if (user.data.role === 'Admin') {
              navigate('/admin/superadmin/creator');
            } else {
              navigate('/admin/superadmin/dashboards');
            }
          }, 200);
        }
      } else {
        const result = await addCreator(data);
        console.log('result', result);
        console.log('ctId:', result.result.ctId);
        if (result?.status === 'MailFailure') {
          // setButtonDisabled(false);
          // setMsg(result?.message);
          // setToastStatus('error');
          // setAlert(true);
          return;
        }
        if (result?.status !== 'Success') {
          setButtonDisabled(false);
          setMsg('Failed to Add creator');
          setToastStatus('error');
          setAlert(true);
          return;
        } else {
          setMsg('Creator Stored');
          setToastStatus('success');
          setAlert(true);
          console.log('result', result);

          const formDatas = {
            phCreatorId: result.result.ctId,
            phPlanId: result.result.ctPlanId,
            phValidityDays: formData.phPlanId,
            phPlanValidityFrom: Date.now(),
            phPlanValidityTo: calculateValidityTo(formData.phPlanId), // Calculate the validity to date
            // phValidityType: '',
          };

          function calculateValidityTo(validityDays: string): Date | null {
            const regexResult = validityDays.match(/(\d+)-(\w+)/);

            if (!regexResult || regexResult.length !== 3) {
              // Handle invalid input
              return null; // or some default value
            }

            const numericValue = parseInt(regexResult[1], 10);
            const unit = regexResult[2].toLowerCase();

            if (isNaN(numericValue) || numericValue <= 0) {
              // Handle invalid numeric value
              return null; // or some default value
            }

            const today = new Date();
            const validityTo = new Date(today);

            switch (unit) {
              case 'day':
              case 'days':
                validityTo.setDate(today.getDate() + numericValue);
                break;
              case 'month':
              case 'months':
                validityTo.setMonth(today.getMonth() + numericValue);
                break;
              case 'year':
              case 'years':
                validityTo.setFullYear(today.getFullYear() + numericValue);
                break;
              default:
                // Handle unknown unit
                return null; // or some default value
            }

            // Correct the date to the last day of the month for months and last day of the year for years
            if (unit === 'months') {
              validityTo.setDate(0); // Set to the last day of the current month
            } else if (unit === 'years') {
              validityTo.setMonth(11); // Set to December
              validityTo.setDate(31); // Set to the last day of December
            }

            return validityTo;
          }

          let datas = JSON.stringify(formDatas);
          console.log('datasdatas', datas);
          const validityResult = await creatPlanValidity(datas);
          if (validityResult?.status !== 'Success') {
            setButtonDisabled(false);
            console.log('creatPlanValidity Error :', result?.message);
            setMsg('Failed to create PlanValidity');
            setToastStatus('error');
            setAlert(true);
            return;
          }

          // setToastStatus('success');
          // setAlert(true);
          setTimeout(() => {
            navigate('/admin/superadmin/creator');
          }, 200);

          // setTimeout(() => {
          //   navigate('/admin/superadmin/creator');
          // }, 2000);
        }
      }
    } catch (error: any) {
      setButtonDisabled(false);
      setMsg(error?.message);
      setToastStatus('error');
      setAlert(true);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    // Navigate back to the previous page
    if (user.data.role === 'Admin') {
      navigate('/admin/superadmin/creator/');
    } else {
      navigate('/admin/superadmin/dashboards');
    }
  };
  const handleEmailOnBlur = async (e: any) => {
    const validationResult = await emailExistenceChecker(
      JSON.stringify({ email: e.target.value }),
    );
    console.log('validationResult', validationResult);
    if (
      validationResult?.valid === false ||
      validationResult?.status == 'Failure'
    ) {
      validationResult?.valid === false && setEmailExisted(true);
      setMsg(validationResult.message);
      setToastStatus('error');
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 100);
    }
    validationResult?.valid === true && setEmailExisted(false);
  };
  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        marginTop={'75px'}
        position={'relative'}
      >
        <Card alignItems={'center'}>
          <Card
            bg={'linear-gradient(to bottom, #7551ff, #3311db)'}
            w={'100%'}
            h={{ base: '170', sm: '170', md: '300', lg: '300' }}
            position={'relative'}
            alignItems={'center'}
          ></Card>
          <Card
            mb={{ base: '0px', xl: '20px' }}
            width={{ base: '95%', md: '70%' }}
            marginTop={'-120px'}
          >
            <Flex direction="column">
              <Text
                color={useColorModeValue('secondaryGray.900', 'white')}
                fontSize="2xl"
                fontWeight="700"
                mb="20px"
              >
                Creator {id ? 'Updation' : 'Creation'}
              </Text>
              {/* <Text fontSize="md" color={textColorSecondary}>
                Here you can change your Creator details
              </Text> */}
            </Flex>
            <SimpleGrid
              columns={{ sm: 1, md: 2 }}
              spacing={{ base: '20px', xl: '25px' }}
            >
              <InputField
                mb="0px"
                me="30px"
                id="ctName"
                name="ctName"
                label="Creator Name"
                isRequired={true}
                placeholder="eg. Adam Copeland"
                onChange={handleChange}
                value={formData?.ctName}
                ref={ctNameRef}
              />
              <SelectField
                mb="0px"
                me="30px"
                id="ctCompanyId"
                name="ctCompanyId"
                label="Creator Company Name"
                options={companyOptions}
                isRequired={true}
                onChange={handleCompanyChange}
                value={
                  companyOptions.find(
                    (option) => option.value === formData.ctCompanyId,
                  ) || null
                }
                handleSeletAttr={handleSeletAttr}
              />

              <InputField
                mb="0px"
                me="30px"
                id="ctMail"
                name="ctMail"
                type="mail"
                label="Creator Mail"
                isRequired={true}
                placeholder="eg. Mail@sample.com"
                onChange={handleChange}
                value={formData?.ctMail}
                onBlur={handleEmailOnBlur}
                autoComplete="off"
                ref={ctMailRef}
              />
              <SelectField
                mb="0px"
                me="30px"
                id="ctPlanId"
                isRequired={true}
                label="Plan"
                placeholder="Select Plan"
                name="ctPlanId"
                value={
                  mappedPlanOptions.find(
                    (option) => option.value === formData?.ctPlanId,
                  ) || null
                }
                handleSeletAttr={handlePlan}
                onChange={handleChangeplan}
                options={mappedPlanOptions}
                isDisabled={!!id}
              />
              {!id && (
                <SelectField
                  mb="0px"
                  me="30px"
                  id="phPlanId"
                  name="phPlanId"
                  label="Plan Type"
                  isRequired={true}
                  options={plantype.data.map((pt) => ({
                    value: `${pt.psPlanDuration}-${pt.psPlanType}`,
                    label: `${pt.psPlanDuration}-${pt.psPlanType} `, // Adjust the label format as needed
                  }))}
                  onChange={handleChangePlanType}
                  value={plantype.data.find(
                    (pt) => pt.phPlanId === selected.phPlanId,
                  )}
                  handleSeletAttr={handlePlanType}
                />
              )}
              {id && (
                <SelectField
                  mb="0px"
                  me="30px"
                  id="phPlanId"
                  name="phPlanId"
                  label="Plan Type"
                  isRequired={true}
                  options={plantype.data.map((pt) => ({
                    value: `${pt.psPlanDuration}-${pt.psPlanType}`,
                    label: `${pt.psPlanDuration}-${pt.psPlanType} `, // Adjust the label format as needed
                  }))}
                  onChange={handleChangePlanType}
                  value={selectedPlanType}
                  handleSeletAttr={handlePlanType}
                  isDisabled={!!id}
                />
              )}
              <SelectField
                mb="0px"
                me="30px"
                id="ctStatus"
                name="ctStatus"
                label="Active Status"
                isRequired={true}
                options={statusOptions}
                onChange={handleStatusChange}
                value={
                  statusOptions.find(
                    (option) => option.value === selectedStatus.value,
                  ) || null
                }
                handleSeletAttr={handleStatus}
                isDisabled={user.data.role === 'Creator'}
              />
              <InputField
                mb="0px"
                me="30px"
                id="ctAge"
                name="ctAge"
                label="Creator Age"
                placeholder="eg. 30"
                type="number"
                onChange={handleChange}
                value={formData?.ctAge}
              />
              <SelectField
                mb="0px"
                me="30px"
                id="ctGender"
                name="ctGender"
                label="Creator Gender"
                isRequired={false}
                options={genderOptions}
                onChange={handleGenderChange}
                autoComplete="off"
                value={
                  genderOptions.find(
                    (option) => option.value === formData.ctGender,
                  ) || null
                }
              />

              <SelectField
                mb="0px"
                me="30px"
                id="ctCountry"
                name="ctCountry"
                label="Creator Country Name"
                options={mappedCountryOptions}
                isRequired={false}
                onChange={handleCountryChange}
                value={
                  mappedCountryOptions.find(
                    (option) => option.value === formData.ctCountry,
                  ) || null
                }
              />
              <InputField
                mb="0px"
                me="30px"
                id="ctDesignation"
                name="ctDesignation"
                label="Creator Designation"
                placeholder='eg. I"m a Creator'
                onChange={handleChange}
                value={formData?.ctDesignation}
              />
              <InputField
                mb="0px"
                me="30px"
                id="creatorEntryDate"
                label="Creator Entry Date"
                type="date-local"
                defaultValue={isoFormatDate}
                disabled={true}
              />

              {user?.data?.role === 'Creator' && (
                <InputField
                  mb="0px"
                  me="30px"
                  id="ctPassword"
                  name="ctPassword"
                  label="Password"
                  placeholder='eg. I"m a Creator'
                  onChange={handleChange}
                  type="password"
                  value={formData?.ctPassword}
                />
              )}
            </SimpleGrid>

            <Flex justify="space-between">
              <Button
                // variant="light"
                fontSize="sm"
                borderRadius="16px"
                border={'1px solid #00000024'}
                w={{ base: '128px', md: '148px' }}
                h="46px"
                mt="20px"
                mr="20px"
                bg={'transparent'}
                _hover={{ bg: '#11047a', color: '#fff' }}
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
      {alert ? (
        <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
      ) : null}
    </>
  );
};

export default CreatorCreation;
