import React, { useState, ChangeEvent, useEffect } from 'react';

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
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectField';
import Card from 'components/card/Card';
import Axios from 'axios';
import { API_SERVER } from 'config/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompanyList, getSelectCreator } from 'utils/creator/creator';
import { getCountries } from 'utils/company/companyService';
import {
  addLearner,
  getLearnerById,
  learnerAdd,
  updateLearner,
} from 'utils/leaner/leaner';
import OnToast from 'components/alerts/toast';
const CreatorCreation = () => {
  const toast = useToast();
  const { id } = useParams();
  console.log(id, 'dsfsdfgdsgdfgsfdg');
  const navigate = useNavigate();
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const [companyOptions, setCompanyOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [creatorOptions, setCreatorOptions] = useState([]);

  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');

  const [selectedStatus, setSelectedStatus] = useState({
    value: 'Active',
    label: 'Active',
  });

  const [formData, setFormData] = useState({
    lenCompanyId: '',
    lenCreatorId: '',
    lenUserName: '',
    lenMail: '',
    lenPassword: '',
    lenCountryId: '',
    lenDepartment: '',
    lenDesignation: '',
    lenAge: '',
    lenGender: '',
    lenCohorts: '',
    lenCreatedUserId: 1,
    lenCreatedDate: '',
    lenEditedUserId: '',
    lenEditedDate: 1,
    lenStatus: 'Active',
    lenIpAddress: '',
    lenDeviceType: '',
    lenUserAgent: '',
  });

  interface OptionType {
    value: string;
    label: string;
  }
  console.log(`${API_SERVER}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const result = await getLearnerById(id);
          if (result?.status !== 'Success')
            return console.log('getLearnerById Error :', result?.message);
          setFormData(result?.data);
          // Fetch existing creator data
          // const response = await Axios.get(`${API_SERVER}/creator/getCreator/${id}`);
          // const response = await Axios.get(`${API_SERVER}/creator/getCreator/${id}`);
          // console.log('API Response:', response);

          // if (response.status === 200) {
          //     const creatorData = response.data.record;
          //     setFormData(creatorData);
          // Update formData state with existing data

          // setFormData({
          //     ...formData,
          //     lenCompanyId: creatorData.lenCompanyId.toString(),
          //     lenCreatorId: creatorData.lenCreatorId,
          //     lenMail: creatorData.lenMail,
          //     lenCountryId: creatorData.lenCountryId.toString(),
          //     ctDesignation: creatorData.ctDesignation,
          //     lenAge: creatorData.lenAge,
          // });
          //     setSelectedStatus({ value: creatorData.lenStatus, label: creatorData.lenStatus });
          // } else {
          //     console.error('An error occurred while fetching the creator data:', response);
          // }
        }
        const company = await getCompanyList();
        if (company?.status !== 'Success')
          return console.log('getCountries Error :', company?.message);
        setCompanyOptions(company?.data);
        // const companiesResponse = await Axios.get(`${API_SERVER}/companies/getAllCompany`);

        // if (companiesResponse.status === 200) {
        //     setCompanyOptions(companiesResponse.data.data);
        // } else {
        //     console.error('An error occurred while fetching the company data:');
        // }
        const result = await getCountries();
        if (result?.status !== 'Success')
          return console.log('getCountries Error :', result?.message);
        setCountryOptions(result?.data);

        const selectCreator = await getSelectCreator();
        if (selectCreator?.status !== 'Success')
          return console.log(
            'getSelectCreator Error :',
            selectCreator?.message,
          );
        setCreatorOptions(selectCreator?.data);
        //     const countriesResponse = await Axios.get(`${API_SERVER}/country/getAllCountries`);

        // if (countriesResponse.status === 200) {
        //     const countriesData = countriesResponse.data.data;
        //     console.log("Countries Response Data:", countriesData);
        //     setCountryOptions(countriesResponse.data.data);
        // } else {
        //     console.error('An error occurred while fetching the country data:', countriesResponse.data.data);
        // }
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  // Sample options data
  console.log('companyOptions', companyOptions);
  const mappedCompanyOptions = Array.isArray(companyOptions)
    ? companyOptions.map((company) => ({
        value: company.cpId,
        label: company.cpCompanyName,
      }))
    : [];
  console.log(mappedCompanyOptions, 'mappedCompanyOptions');
  console.log('countryOptions', countryOptions);
  const mappedCountryOptions = Array.isArray(countryOptions)
    ? countryOptions.map((country) => ({
        value: country.value, // Change 'Id' to 'value'
        label: country.label,
      }))
    : [];

  console.log(mappedCountryOptions, 'mappedCountryOptions');

  const handleBack = () => {
    // Navigate back to the previous page
    navigate('/admin/superadmin/learner/');
  };

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
  const getHours = date.getHours().toString().padStart(2, '0');
  const getMinutes = date.getMinutes().toString().padStart(2, '0');

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
    } else {
      // Set the value of the field to the current value of the target
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleCompanyChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, lenCompanyId: selectedOption.value });
  };
  const handleCreatorChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, lenCreatorId: selectedOption.value });
  };

  const handleCountryChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, lenCountryId: selectedOption.value });
  };

  const handleGenderChange = (selectedOption: OptionType | null) => {
    setFormData({ ...formData, lenGender: selectedOption.value });
  };
  const handleStatusChange = (selectedOption: OptionType | null) => {
    setSelectedStatus(selectedOption);
    setFormData({ ...formData, lenStatus: selectedOption.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('fsfsf');

    if (!formData.lenCompanyId) {
      setMsg('Please select the company name');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenCreatorId) {
      setMsg('Please select the Creator Name');
      setToastStatus('error');
      setAlert(true);
      return false;
    }

    if (!formData.lenUserName) {
      //alert'set  Password')
      setMsg('Please Fill the Learner');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenCountryId) {
      //alert'set  Password')
      setMsg('Please Select the Country');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenMail) {
      //alert'plse fill the Mail')
      setMsg('Please fill the Mail');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenAge) {
      //alert'set  Password')
      setMsg('Please Fill the Age');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    if (!formData.lenGender) {
      //alert'set  Password')
      setMsg('Please Select the Gender');
      setToastStatus('error');
      setAlert(true);
      return false;
    }

    if (!formData.lenPassword) {
      //alert'set  Password')
      setMsg('Please Fill the Password');
      setToastStatus('error');
      setAlert(true);
      return false;
    }

    let data = JSON.stringify(formData);
    console.log(data);
    try {
      if (id) {
        const result = await updateLearner(id, data);
        if (result?.status !== 'Success') {
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

        // const response = await Axios.put(`${API_SERVER}/creator/updatecreator/${id}`, formData);
        // if (response.status === 200) {
        //     console.log('Data was successfully updated.', response);
        // } else {
        //     console.error('Failed to update data.');
        // }
      } else {
        // This is a new plan, create it using POST request
        const result = await addLearner(data);
        if (result?.status === 'MailFailure') {
          setMsg(result?.message);
          setToastStatus('error');
          setAlert(true);
          return;
        }
        if (result?.status !== 'Success') {
          console.log('updateLearner Error :', result?.message);
          setMsg('Failed to Create Learner');
          setToastStatus('error');
          setAlert(true);
          return;
        }

        setMsg('Learner Stored');
        setToastStatus('success');
        setAlert(true);
        setTimeout(() => {
          navigate('/admin/superadmin/learner');
        }, 200);

        const res = await learnerAdd(result?.data?.lenId);

        navigate('/admin/superadmin/learner');
        // const response = await Axios.post(`${API_SERVER}/creator/addcreator`, formData);

        // if (response.status === 201) {
        //     console.log('Data was successfully created.', response);
        // } else {
        //     console.error('Failed to create data.');
        // }
      }
    } catch (error) {
      console.error('An error occurred while sending the request:', error);
    }
  };

  console.log('fsd', formData);
  // console.log('fsfsd', formData);
  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        marginTop={'75px'}
        position={'relative'}
      >
        <Card
          bg={'linear-gradient(to bottom, #7551ff, #3311db)'}
          w={'100%'}
          h={'300'}
          position={'absolute'}
          alignItems={'center'}
        ></Card>
        <Card
          mb={{ base: '0px', xl: '20px' }}
          width={'70%'}
          marginTop={'120px'}
        >
          <Flex direction="column" mb="40px" ms="10px">
            <Text
              color={useColorModeValue('secondaryGray.900', 'white')}
              fontSize="2xl"
              fontWeight="700"
              mb="20px"
            >
              learner {id ? 'Updation' : 'Creation'}
            </Text>
            {/* <Text fontSize='md' color={textColorSecondary}>
                            Here you can change your Creator details
                        </Text> */}
          </Flex>
          <SimpleGrid
            columns={{ sm: 1, md: 2 }}
            spacing={{ base: '20px', xl: '20px' }}
          >
            <SelectField
              mb="0px"
              me="30px"
              id="lenCompanyId"
              name="lenCompanyId"
              label="Learner Company Name"
              options={companyOptions}
              onChange={handleCompanyChange}
              isRequired={true}
              value={
                companyOptions.find(
                  (option) => option.value === formData.lenCompanyId,
                ) || null
              }
            />
            <SelectField
              mb="0px"
              me="30px"
              id="lenCreatorId"
              name="lenCreatorId"
              label="Creator Name"
              options={creatorOptions}
              onChange={handleCreatorChange}
              isRequired={true}
              value={
                creatorOptions.find(
                  (option) => option.value === formData.lenCreatorId,
                ) || null
              }
            />
            <InputField
              mb="0px"
              me="30px"
              id="creatorEntryDate"
              label="Learner Entry Date"
              type="date-local"
              defaultValue={isoFormatDate}
              disabled={true}
            />

            <InputField
              mb="0px"
              me="30px"
              id="lenUserName"
              isRequired={true}
              name="lenUserName"
              label=" learner Name"
              placeholder="eg. jhon "
              onChange={handleChange}
              value={formData?.lenUserName}
            />
            <SelectField
              mb="0px"
              me="30px"
              id="lenCountryId"
              name="lenCountryId"
              label="learner Country"
              options={mappedCountryOptions}
              onChange={handleCountryChange}
              isRequired={true}
              value={
                mappedCountryOptions.find(
                  (option) => option.value === formData.lenCountryId,
                ) || null
              }
            />

            <InputField
              mb="0px"
              me="30px"
              id="lenMail"
              name="lenMail"
              isRequired={true}
              label="Learner Mail"
              placeholder="eg. Mail@sample.com"
              onChange={handleChange}
              value={formData?.lenMail}
              autoComplete="off"
              disabled={id ? true : false}
            />
            <InputField
              mb="0px"
              me="30px"
              id="lenDepartment"
              name="lenDepartment"
              label="learner Department"
              placeholder="eg. sales "
              onChange={handleChange}
              value={formData?.lenDepartment}
            />
            <InputField
              mb="0px"
              me="30px"
              id="lenDesignation"
              name="lenDesignation"
              label=" learner Designation"
              placeholder="eg. new joinee"
              onChange={handleChange}
              value={formData?.lenDesignation}
            />

            <InputField
              mb="0px"
              me="30px"
              id="lenAge"
              isRequired={true}
              name="lenAge"
              label="learner Age"
              placeholder="eg. 30"
              type="number"
              onChange={handleChange}
              value={formData?.lenAge}
            />
            <SelectField
              id="lenGender"
              name="lenGender"
              label="Creator Gender"
              options={genderOptions}
              onChange={handleGenderChange}
              autoComplete="off"
              isRequired={true}
              value={
                genderOptions.find(
                  (option) => option.value === formData.lenGender,
                ) || null
              }
            />

            <InputField
              mb="0px"
              me="30px"
              id="lenPassword"
              name="lenPassword"
              label="learner Password"
              placeholder="eg. pass"
              type="password"
              isRequired={true}
              onChange={handleChange}
              value={formData?.lenPassword}
              autoComplete="off"
            />

            {/* <InputField mb='0px' me='30px' id='lenDesignation' name='lenDesignation' label='Creator Designation' placeholder='eg. I"m a Creator' onChange={handleChange} value={formData?.ctDesignation} />
                        <SelectField
                            id='lenStatus'
                            name='lenStatus'
                            label='Active Status'
                            options={statusOptions}
                            onChange={handleStatusChange}
                            value={statusOptions.find(option => option.value === selectedStatus.value) || null}
                        /> */}
          </SimpleGrid>
          {/* <Button mt='20px' padding={2} background='#3311db' color='#fff' w={70} onClick={handleSubmit}>Save</Button> */}
          {/* <Flex flexDirection="row" justifyContent={'center'}>
                        <Button mt="20px" mr="10px" padding={2} background="#3311db" color="#fff" w={70} onClick={handleSubmit}>
                            {id ? 'Update' : 'Save'}
                        </Button>

                        <Button mt="20px" padding={2} background="#3311db" color="#fff" w={70} onClick={handleBack}>
                            Cancel
                        </Button>
                    </Flex> */}
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
      {alert ? (
        <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
      ) : null}
    </>
  );
};

export default CreatorCreation;
