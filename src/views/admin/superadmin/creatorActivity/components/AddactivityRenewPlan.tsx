import React, { ChangeEvent, useEffect, useState } from 'react';

import {
  Box,
  SimpleGrid,
  Button,
  Card,
  Flex,
  FormControl,
  Icon,
  Text,
  Spinner,
  useToast,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  AlertDialog,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Center,
  Badge,
} from '@chakra-ui/react';
import { MdGroupAdd, MdModeEdit, MdClose, MdDelete } from 'react-icons/md';
// import InputField from 'components/fields/InputField';
import {
  addcohorts,
  getcohorts,
  updatecohorts,
  checkCohorts,
  reomvecohorts,
} from 'utils/leaner/leaner';
import {
  addLearner,
  getLearnerById,
  updateLearner,
  learnerStatus,
} from 'utils/leaner/leaner';
import { useNavigate } from 'react-router-dom';
import OnToast from 'components/alerts/toast';
import { SlOptionsVertical } from 'react-icons/sl';
import Popup from 'components/alerts/Popup';
import {
  creatPlanValidity,
  updatePlanValidity,
  getPlanTypeInCreator,
} from 'utils/planvalidity/planvalidity';
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectFieldtwo';
import { getPlanName } from 'utils/plan/plan';
import { getPlanType } from 'utils/subscriptionPlans/subscriptionPlan';

import PlanImg from 'assets/img/users/Project2.png';

// AddCoharts component
interface AddCohortsProps {
  setOpenCoharts: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveSelectedValues: (selectedIds: number[]) => void;
  learnerId: number;
}
interface planType {
  plId: string;
  plPlanName: string;
  plPlanType: string; // Add plPlanType property
  // other properties if any
}
interface Cohort {
  chId: number;
  chCohortsName: string;
}
interface OptionType {
  value: string;
  label: string;
}

const AddCoharts: React.FC<AddCohortsProps> = ({
  setOpenCoharts,
  onSaveSelectedValues,
  learnerId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [plantype, setPlantype] = useState({
    status: '',
    message: '',
    data: [],
  });

  const toast = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const [input, setInput] = useState<string>('');
  const [labelset, setLabel] = useState<string>('ADD');
  const [updateId, setupdateId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false); // New state to track if adding
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const [planData, setPlanData] = useState(null);
  const [plan, setplan] = useState<planType[]>([]);
  const [selected, setSelected] = useState({
    ctPlanId: '',
    phRenewalPlanId: '',
    phRenewalValidityDays: '',
  });
  const [selectedPlanTypeValues, setSelectedPlanTypeValues] = useState<
    string[]
  >([]);
  const [RenewalPlan, setRenewalPlan] = useState<boolean>(true);
  const [RenewalValidityDays, setRenewalValidityDays] = useState<boolean>(true);

  const mappedPlanOptions = Array.isArray(plan)
    ? plan.map((plan) => ({
        value: plan.plId, // Convert to string
        label: plan.plPlanName,
      }))
    : [];

  console.log(mappedPlanOptions, 'mappedPlanOptions');

  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  type FormData = {
    phCreatorId: number;
    ctPlanId: string;
    phRenewalPlanId: string;
    phRenewalValidityDays: string;
    phRenewalPlanValidityFrom: string;
    phRenewalPlanValidityTo: string;
  };
  const [formData, setFormData] = useState<FormData>({
    phCreatorId: learnerId,
    ctPlanId: '',
    phRenewalPlanId: '',
    phRenewalValidityDays: '',
    phRenewalPlanValidityFrom: '',
    phRenewalPlanValidityTo: '',
  });
  const [planTypeOptions, setPlanTypeOptions] = useState<OptionType[]>([]);
  const [refreshField, setRefreshField] = useState(false);

  const navigate = useNavigate();
  console.log('updateId', updateId);
  const fetchCohorts = async () => {
    try {
      const result = await getcohorts();
      if (result?.status === 'Success') {
        setCohorts(result?.data || []);
      } else {
        console.error('Error fetching cohorts:', result?.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching cohorts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchPlanNames = async () => {
      try {
        const plans = await getPlanName(); // Replace with your actual function to get plan names
        if (plans?.status !== 'Success')
          return console.log('getPlanNames Error:', plans?.message);
        setplan(plans.data);
        console.log('plans', plans);
        console.log('plan', plan);
      } catch (error) {
        console.error('Error fetching plan names:', error);
      }
    };

    fetchPlanNames();
    setRenewalPlan(!RenewalPlan);
    setRenewalValidityDays(!RenewalValidityDays);
  }, []); // Em

  function validDataSet(obj: any) {
    const currentIndex = Object.keys(formData).indexOf(obj.name);
    const emptyKeys = Object.keys(formData).filter((key, index) => {
      const formDataKey = key as keyof FormData;
      return index < currentIndex && formData[formDataKey] === '';
    });

    Object.keys(formData).forEach((key) => {
      if (emptyKeys.includes('phRenewalPlanId')) {
        setRenewalPlan(true);
      } else {
        setRenewalPlan(false);
      }

      if (emptyKeys.includes('phRenewalValidityDays')) {
        setRenewalValidityDays(true);
      } else {
        setRenewalValidityDays(false);
      }
    });

    console.log('currentIndex', currentIndex);
    console.log('emptyKeys', emptyKeys);
  }
  const fetchPlanType = async (planId: string) => {
    try {
      const result = await getPlanType(planId);
      console.log('fetchPlanType', result);
      setPlantype(result);
    } catch (error) {
      console.error('An error occurred while fetching plan types:', error);
    }
  };
  const handleChangeplan = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      const value = selectedOption ? selectedOption.value : '';
      setFormData({ ...formData, phRenewalPlanId: selectedOption?.value });
      fetchPlanType(selectedOption?.value || '');
      setRefreshField((prev) => !prev);
      validDataSet({ name: 'phRenewalPlanId', value: value });
      // console.log('selectedOption :',value);
      // Find the index of phRenewalPlanId within the keys of formData
      // const currentIndex = Object.keys(formData).indexOf('phRenewalPlanId');
      // console.log('currentIndex :', currentIndex);
      // setRefreshField((prev) => !prev);
    }
  };

  // const handleChangeplan1 = (selectedOption: OptionType | null) => {
  //     setFormData({ ...formData, phRenewalPlanId: selectedOption?.value });
  //     // setSelected({ ctPlanId: selectedOption?.value || '', phPlanId: '' });
  //     fetchPlanType(selectedOption?.value || '');

  //     const selectedValuesForPlanType = [];
  //     // setSelectedPlanTypeValues(selectedValuesForPlanType);

  // };
  const handleChangePlanType = (selectedOption: OptionType | null) => {
    const value = selectedOption ? selectedOption.value : '';
    setFormData({ ...formData, phRenewalValidityDays: value });
    validDataSet({ name: 'phRenewalValidityDays', value: value });
    console.log('formData:', formData);
  };
  useEffect(() => {
    // Fetch plan type data when phRenewalPlanId changes
    if (formData.phRenewalPlanId) {
      fetchPlanType(formData.phRenewalPlanId);
    }
  }, [formData.phRenewalPlanId]);
  useEffect(() => {
    // Update plan type options when plantype data changes
    if (plantype.data) {
      const newPlanTypeOptions = plantype.data.map((pt) => ({
        value: `${pt.psPlanDuration}-${pt.psPlanType}`,
        label: `${pt.psPlanDuration}-${pt.psPlanType}`,
      }));
      setPlanTypeOptions(newPlanTypeOptions);
    }
  }, [plantype.data]);
  useEffect(() => {
    const fetchLearnerById = async () => {
      try {
        const results = await getPlanTypeInCreator(learnerId);
        console.log('results', results);
        if (results?.status === 'Success') {
          setPlanData(results);
        } else {
          console.error('Error fetching learner:', results?.message);
        }
      } catch (error) {
        console.error('An error occurred while fetching learner:', error);
      }
    };

    if (learnerId) {
      fetchLearnerById();
    }
  }, [learnerId]);

  const fetchUpcomingPlanData = async () => {
    try {
      const results = await getPlanTypeInCreator(learnerId);
      console.log('results', results);
      if (results?.status === 'Success') {
        setPlanData(results);
      } else {
        console.error('Error fetching learner:', results?.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching learner:', error);
    }
  };
  function calculateNextPlanValidityStartDate(
    currentValidityTo: string,
  ): number | null {
    const currentDate = new Date(currentValidityTo);

    if (isNaN(currentDate.getTime())) {
      // Handle invalid date format
      return null; // or some default value
    }

    // Add one day to the current plan's validity end date
    const nextStartDate = new Date(currentDate);
    nextStartDate.setDate(currentDate.getDate() + 1);

    return nextStartDate.getTime();
  }

  const handleSave = async (e: React.FormEvent) => {
    const startDate = calculateNextPlanValidityStartDate(
      planData.data.phPlanValidityTo,
    );
    console.log('formData:', formData);

    if (!formData['phRenewalPlanId']) {
      setRenewalPlan(true);
    } else {
      setRenewalPlan(false);
    }

    if (!formData['phRenewalValidityDays']) {
      setRenewalValidityDays(true);
    } else {
      setRenewalValidityDays(false);
    }

    //     const formData = {
    //         //     phCreatorId: result.data.ctId,
    //         //     phPlanId: result.data.phRenewalPlanId,
    //         //     phPlanType: formData.phPlanId,
    //         //     phValidityDays:formData.phRenewalValidityDays,
    //         //     phPlanValidityFrom: Date.now(),
    //         //     phPlanValidityTo:  Date.now(),
    //         //     // phValidityType: ''
    //         //     phValidityType: '',
    //         //   };
    //
    const formDataWithDates = {
      ...formData,
      // phRenewalPlanValidityFrom: Date.now(),
      phRenewalPlanValidityFrom: calculateNextPlanValidityStartDate(
        planData.data.phPlanValidityTo,
      ),
      phRenewalPlanValidityTo: calculateValidityTo(
        formData.phRenewalValidityDays,
        startDate,
      ),
    };
    console.log('formdata', formDataWithDates);
    let datas = JSON.stringify(formDataWithDates);
    function calculateValidityTo(
      validityDays: string,
      startDate: number,
    ): Date | null {
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
      const validityTo = new Date(startDate);

      switch (unit) {
        case 'day':
        case 'days':
          validityTo.setDate(validityTo.getDate() + numericValue);
          break;
        case 'month':
        case 'months':
          validityTo.setMonth(validityTo.getMonth() + numericValue);
          break;
        case 'year':
        case 'years':
          validityTo.setFullYear(validityTo.getFullYear() + numericValue);
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
    console.log('datas', datas);
    const validityResult = await updatePlanValidity(learnerId, datas);
    if (validityResult?.status !== 'Success') {
      //    setButtonDisabled(false);
      console.log('updatePlanValidity Error :', validityResult?.message);
      setMsg('Failed to create PlanValidity');
      setToastStatus('error');
      setAlert(true);
      return;
    }
    console.log('validityResult', validityResult);
    setToastStatus('success');
    setAlert(true);
    //  setTimeout(() => {
    //    navigate('/admin/superadmin/creator');
    //  }, 200);
    fetchUpcomingPlanData();
  };
  // finally {
  //   setOpenCoharts(false);
  // }
  // finally {
  //   setTimeout(() => {
  //     setOpenCoharts(false);
  //   }, 1000);    }

  const getPlanNameById = (planId: string): string => {
    const foundPlan = plan.find((p: planType) => p.plId === planId);
    return foundPlan ? foundPlan.plPlanName : 'Unknown Plan';
  };
  const handleClose = () => {
    setOpenCoharts(false);
    navigate('/admin/superadmin/creator/');
  };

  return (
    <>
      <Flex
        _before={{
          content: '""',
          background: '#1b1b1c4a',
          height: '100%',
          width: '100%',
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
        }}
      >
        <Card
          position="fixed"
          w={{ sm: '87%', md: '500px' }}
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          background="#fff"
          display="flex"
          alignItems="center"
          boxShadow="1px 2px 17px #42414556"
          p="20px"
          zIndex={9}
          borderRadius={'22px'}
        >
          <Flex justify="space-between" align="center" w="100%" pb={'10px'}>
            <Text fontSize={22}>Renew Plan</Text>

            <Text fontSize={25}>
              <Icon as={MdClose} cursor="pointer" onClick={handleClose} />
            </Text>
          </Flex>
          <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
            {planData?.data && (
              <>
                <Box w={'100%'} display={'flex'}>
                  <Box width={'100%'} borderRadius={'10px'} padding={'10px'}>
                    <Text fontSize={16} fontWeight={700}>
                      Active Plan
                    </Text>
                    <Text fontSize={14} mb={'10px'}>
                      {' '}
                      Expires on {planData.data.phPlanValidityTo}{' '}
                    </Text>
                    <Divider color={'grey'} mb={'10px'} />
                    <Box display={'flex'} justifyContent={'space-between'}>
                      <Box>
                        <Text fontSize={17} fontWeight={600}>
                          {getPlanNameById(planData.data.phPlanId)}
                        </Text>
                        <Text fontSize={14}>
                          Validity:{' '}
                          {planData.data.phValidityDays.replace(/-/g, ' ')}
                        </Text>

                        <Text fontSize={14}>
                          Renews on {planData.data.phPlanValidityFrom}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
            <>
              <Box
                w={'100%'}
                border="1px solid"
                backgroundImage="linear-gradient(to bottom, #7551FF, #3311db)"
                color="#ffffff"
                boxShadow="rgba(112, 144, 176, 0.08) 14px 17px 40px 4px"
                borderRadius="20px"
              >
                <Box
                  boxShadow={'1px 3px 16px #8080803b'}
                  borderRadius={'10px'}
                  width={'100%'}
                  padding={'10px'}
                >
                  <Text fontSize={16} fontWeight={700}>
                    Upcoming Plan
                  </Text>
                  {planData?.data?.phRenewalPlanId && (
                    <>
                      <Text fontSize={14} mb={'10px'}>
                        Renews on {planData.data.phRenewalPlanValidityFrom}
                      </Text>
                      <Divider color={'grey'} mb={'10px'} />
                      <Box display={'flex'} justifyContent={'space-between'}>
                        <Box>
                          {planData?.data?.phRenewalPlanId !== 0 && (
                            <>
                              <Text fontSize={17} fontWeight={600}>
                                {getPlanNameById(planData.data.phRenewalPlanId)}
                              </Text>
                              <Text fontSize={14}>
                                Validity:{' '}
                                {planData.data.phRenewalValidityDays.replace(
                                  /-/g,
                                  ' ',
                                )}
                              </Text>
                            </>
                          )}
                        </Box>

                        <Box></Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </>
          </Box>
          <>
            <Box
              width={'100%'}
              mb={'20px'}
              mt={'20px'}
              padding={'10px'}
              borderRadius={'10px'}
              boxShadow={'1px 3px 16px #8080803b'}
            >
              <Text fontSize={20} fontWeight={700} textAlign={'center'}>
                Renew Plan Validity
              </Text>
              <Box width={'100%'} mt={'20px'} padding={'10px'}>
                <SelectField
                  id="phRenewalPlanId"
                  isRequired={true}
                  label="Renew Plan"
                  placeholder="Select Plan"
                  name="phRenewalPlanId"
                  value={
                    mappedPlanOptions.find(
                      (option) => option.value === formData?.phRenewalPlanId,
                    ) || null
                  }
                  onChange={handleChangeplan}
                  options={mappedPlanOptions}
                  handleSeletAttr={RenewalPlan}
                  //   isDisabled={!!id}

                  // isDisabled={!isCtStatusValid}
                />

                <SelectField
                  id="phRenewalValidityDays"
                  name="phRenewalValidityDays"
                  label="Renew Plan Type"
                  isRequired={true}
                  options={plantype.data.map((pt) => ({
                    value: `${pt.psPlanDuration}-${pt.psPlanType}`,
                    label: `${pt.psPlanDuration}-${pt.psPlanType} `, // Adjust the label format as needed
                  }))}
                  // options={plantype.data.map((pt) => ({ value: pt.phPlanId, label: pt.phPlanId }))}
                  onChange={handleChangePlanType}
                  value={plantype.data.find(
                    (pt) =>
                      pt.phRenewalPlanId === selected.phRenewalValidityDays,
                  )}
                  handleSeletAttr={RenewalValidityDays}
                  // value={selectedPlanType}
                  // isDisabled={!!id}
                />
              </Box>
              <Box w={'100%'} display={'flex'} justifyContent={'flex-end'}>
                <Button
                  _hover={{ backgroundColor: 'none' }}
                  onClick={handleSave}
                  bg={'linear-gradient(to bottom, #7551ff, #3311db)'}
                  color="#fff"
                  borderRadius={'none'}
                  width={'100%'}
                >
                  {labelset}
                </Button>
              </Box>
            </Box>
          </>
        </Card>
      </Flex>
    </>
  );
};

export default AddCoharts;
