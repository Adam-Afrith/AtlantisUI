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
  Img,
} from '@chakra-ui/react';

//  React Select Imports
// import Select from 'react-select';

// Custom Imports
import InputField from 'components/fields/InputFieldtwo';
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectFieldtwo';
import Card from 'components/card/Card';
import OnToast from 'components/alerts/toast';
import {
  addLearner,
  getLearnerById,
  learnerAdd,
  updateLearner,
} from 'utils/leaner/leaner';
import Select from 'react-select';
import {
  createCompany,
  editCompany,
  getCompany,
  getCountries,
} from 'utils/company/companyService';
import { useNavigate, useParams } from 'react-router-dom';

const LearnerUpdation = () => {
  const stroage = JSON.parse(localStorage.getItem('user'));

  let storageCreatorId = '';
  if (stroage.data.role === 'Creator') {
    storageCreatorId = stroage.data.id;
  }

  const { id } = useParams();
  console.log('id', id);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [toastStatus, setToastStatus] = useState<string>('');
  const navigate = useNavigate();
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  interface OptionType {
    value: string;
    label: string;
  }

  type FormData = {
    lenUserName: string;
    lenMail: string;
    lenCountryId: string;
    lenDepartment: string;
    lenDesignation: string;
    lenAge: string;
    lenGender: string;
    lenEditedUserId: string;
    lenEditedDate: string;
    lenStatus: string;
    lenIpAddress: string;
    lenDeviceType: string;
    lenUserAgent: string;
  };

  const lenUserNameRef = useRef<HTMLInputElement | null>(null);
  const lenDepartmentRef = useRef<HTMLInputElement | null>(null);
  const lenDesignationRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    lenUserName: '', // Ensure lenUserName is initialized as an array
    lenMail: '',
    lenCountryId: '',
    lenDepartment: '',
    lenDesignation: '',
    lenAge: '',
    lenGender: '',
    lenEditedUserId: storageCreatorId,
    lenEditedDate: '',
    lenStatus: 'Active',
    lenIpAddress: '',
    lenDeviceType: '',
    lenUserAgent: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    selectedOption?: OptionType,
  ) => {
    const { name, value } = e.target;
    const validationData: { [key: string]: string } = {
      lenUserName: formData.lenUserName,
      lenDepartment: formData.lenDepartment,
      lenDesignation: formData.lenDesignation,
    } as { [key in keyof FormData]: string };

    const currentIndex = Object.keys(validationData).indexOf(name);

    if (currentIndex > -1) {
      const emptyKeys = Object.keys(validationData).filter((key, index) => {
        return index < currentIndex && validationData[key] === '';
      });

      Object.keys(validationData).forEach((key) => {
        const inputRef = getRefForKey(key);
        if (inputRef && inputRef.current) {
          if (emptyKeys.includes(key)) {
            inputRef.current.style.borderColor = 'red';
          } else {
            inputRef.current.style.borderColor = '';
          }
        }
      });
    }

    if (selectedOption) {
      setFormData({ ...formData, [name]: selectedOption.value });
    } else {
      // Set the value of the field to the current value of the target
      setFormData({ ...formData, [name]: value });
    }
  };
  const getRefForKey = (key: any) => {
    switch (key) {
      case 'lenUserName':
        return lenUserNameRef;
      case 'lenDepartment':
        return lenDepartmentRef;
      case 'lenDesignation':
        return lenDesignationRef;

      default:
        return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const result = await getLearnerById(id);
        if (result?.status !== 'Success')
          return console.log('getLearnerById Error :', result?.message);
        setFormData(result?.data);
      }
      const result = await getCountries();
      if (result?.status !== 'Success')
        return console.log('getCountries Error :', result?.message);
      setCountryOptions(result?.data);
    };

    fetchData();
  }, [id]);

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' },
  ];
  const mappedCountryOptions = Array.isArray(countryOptions)
    ? countryOptions.map((country) => ({
        value: String(country.value), // Convert value to string
        label: country.label,
      }))
    : [];

  const handleCountryChange = (selectedOption: any) => {
    if (selectedOption) {
      setFormData({ ...formData, lenCountryId: String(selectedOption.value) });
    } else {
      setFormData({ ...formData, lenCountryId: null });
    }
  };

  const selectedCountry = mappedCountryOptions.find(
    (option) => option.value === String(formData.lenCountryId),
  );
  const handleGenderChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, lenGender: selectedOption.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('fsfsf');
    const validationData: { [key: string]: string } = {
      lenUserName: formData.lenUserName,
      lenDepartment: formData.lenDepartment,
      lenDesignation: formData.lenDesignation,
    };
    // Iterate through the keys of the form
    Object.keys(validationData).forEach((key) => {
      // Access the corresponding ref based on the key
      const inputRef =
        key === 'lenUserName'
          ? lenUserNameRef
          : key === 'lenDepartment'
          ? lenDepartmentRef
          : key === 'lenDesignation'
          ? lenDesignationRef
          : null;

      // If the field is empty and there is a corresponding ref
      if (!validationData[key] && inputRef && inputRef.current) {
        // Set the border color to red
        inputRef.current.style.borderColor = 'red';
      } else if (inputRef && inputRef.current) {
        // If the field is not empty, reset the border color
        inputRef.current.style.borderColor = '';
      }
    });

    if (!formData.lenUserName) {
      setMsg('Please select the Learner Name');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenMail) {
      setMsg('Please select the Learner Mail');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenDepartment) {
      setMsg('Please select the Learner Department');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenDesignation) {
      setMsg('Please select the Learner Designation');
      setToastStatus('error');
      setAlert(true);
      return false;
    }

    let data = JSON.stringify(formData);
    console.log('data', data);
    try {
      setButtonDisabled(true);
      if (id) {
        const result = await updateLearner(id, data);
        if (result?.status !== 'Success') {
          setButtonDisabled(false);
          console.log('updateLearner Error :', result?.message);
          setMsg('Failed to Update Learner');
          setToastStatus('error');
          setAlert(true);
          return;
        }
        setMsg('Learner Updated');
        setToastStatus('success');
        setAlert(true);
        setTimeout(() => {
          navigate('/admin/superadmin/learner');
        }, 200);
      }
    } catch (error) {
      setButtonDisabled(false);
      console.error('An error occurred while sending the request:', error);
    }
  };
  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/admin/superadmin/learner/');
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
              <Box>
                <Text
                  color={useColorModeValue('secondaryGray.900', 'white')}
                  fontSize="2xl"
                  fontWeight="700"
                  mb="20px"
                >
                  Learner Updation
                </Text>
              </Box>
            </Flex>
            <Box>
              <SimpleGrid
                columns={{ sm: 1, md: 2, lg: 3 }}
                spacing={{ base: '20px', xl: '20px' }}
              >
                <Box>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                  >
                    Learner Name<span style={{ color: 'red' }}>*</span>
                  </FormLabel>
                  <InputField
                    mb="0px"
                    me="30px"
                    id={`lenUserName`}
                    name={`lenUserName`}
                    placeholder="eg.james"
                    autoComplete="off"
                    disabled={false}
                    onChange={handleChange}
                    value={formData?.lenUserName}
                    ref={lenUserNameRef}
                  />
                </Box>
                <Box>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                  >
                    Learner Mail<span style={{ color: 'red' }}>*</span>
                  </FormLabel>
                  <InputField
                    mb="0px"
                    me="30px"
                    id={`lenMail}`}
                    name={`lenMail`}
                    placeholder="eg. sample@mail.com "
                    onChange={handleChange}
                    value={formData?.lenMail}
                    disabled
                  />
                </Box>
                <Box>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                  >
                    Learner Department<span style={{ color: 'red' }}>*</span>
                  </FormLabel>

                  <InputField
                    mb="0px"
                    me="30px"
                    id={`lenDepartment`}
                    name={`lenDepartment`}
                    placeholder="eg. mechanical"
                    onChange={handleChange}
                    value={formData?.lenDepartment}
                    ref={lenDepartmentRef}
                  />
                </Box>
                <Box>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                  >
                    Learner Designation<span style={{ color: 'red' }}>*</span>
                  </FormLabel>

                  <InputField
                    mb="0px"
                    me="30px"
                    id={`lenDesignation`}
                    name={`lenDesignation`}
                    placeholder="eg. trainee"
                    onChange={handleChange}
                    value={formData?.lenDesignation}
                    ref={lenDesignationRef}
                  />
                </Box>

                <Box>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                  >
                    Learner Age
                  </FormLabel>
                  <InputField
                    mb="0px"
                    me="30px"
                    id={`lenAge`}
                    name={`lenAge`}
                    placeholder="eg. 30"
                    type="number"
                    onChange={handleChange}
                    value={formData?.lenAge}
                  />
                </Box>
                <Box>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                  >
                    {' '}
                    Learner Gender
                  </FormLabel>
                  <SelectField
                    mb="0px"
                    me="30px"
                    options={genderOptions}
                    id={`lenGender`}
                    name={`lenGender`}
                    onChange={handleGenderChange}
                    value={
                      genderOptions.find(
                        (option) => option.value === formData.lenGender,
                      ) || null
                    }
                    autoComplete="off"
                  />
                </Box>
                <Box>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColorPrimary}
                  >
                    Learner Country
                  </FormLabel>
                  <SelectField
                    mb="0px"
                    me="30px"
                    options={mappedCountryOptions}
                    onChange={handleCountryChange}
                    id={`lenCountryId`}
                    name={`lenCountryId`}
                    // value={mappedCountryOptions.find(option => option.value === formData.lenCountryId) || null}
                    value={selectedCountry || null}
                    autoComplete="off"
                  />
                </Box>
              </SimpleGrid>
            </Box>
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
                ms="auto"
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

export default LearnerUpdation;
