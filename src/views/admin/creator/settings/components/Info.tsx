// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';
import SelectField from 'components/fields/SelectField';
import OnToast from 'components/alerts/toast';
import { useEffect, useState } from 'react';
import { getCountries } from 'utils/company/companyService';
import { updateCreator } from 'utils/creator/creator';
import { useNavigate, useParams } from 'react-router-dom';
interface OptionType {
  value: string;
  label: string;
}
export default function Settings(props: { funk: any; setFunk: any }) {
  const storage = JSON.parse(localStorage.getItem('user'));
  const { funk, setFunk } = props;
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const navigate = useNavigate();
  const [countryOptions, setCountryOptions] = useState([]);
  const { id } = useParams();
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' },
  ];
  const mappedCountryOptions = Array.isArray(countryOptions)
    ? countryOptions.map((country) => ({
        value: country.value.toString(), // Change 'Id' to 'value'
        label: country.label,
      }))
    : [];

  const handleGenderChange = (selectedOption: OptionType | null) => {
    setFunk({ ...funk, ctGender: selectedOption.value });
  };
  const handleCountry = (selectedOption: OptionType | null) => {
    setFunk({ ...funk, ctCountry: selectedOption.value });
  };
  useEffect(() => {
    const fetch = async () => {
      const result = await getCountries();
      if (result?.status !== 'Success')
        return console.log('getCountries Error :', result?.message);
      setCountryOptions(result?.data);
    };
    fetch();
  }, []);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFunk((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleUpdate = async () => {
    const data = JSON.stringify(funk);
    const result = await updateCreator(storage.data.id, data);
    if (result?.status !== 'Success') {
      setMsg('NOT UPDATE');
      setToastStatus('error');
      setAlert(true);
      return console.log('error :' + result?.message);
    } else {
      setMsg('Updated Sucessfuly');
      setToastStatus('success');
      setAlert(true);
      setTimeout(() => {
        navigate('/admin/dashboards');
      }, 200);
    }
  };
  console.log(funk);
  return (
    <FormControl>
      <Card>
        <Flex direction="column" mb="40px">
          <Text fontSize="xl" color={textColorPrimary} fontWeight="bold">
            Account Settings
          </Text>
          {/* <Text fontSize='md' color={textColorSecondary}>
						Here you can change user account information
					</Text> */}
        </Flex>
        <SimpleGrid
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: '0px', xl: '20px' }}
        >
          <InputField
            mb="15px"
            me="30px"
            id="ctName"
            name="ctName"
            value={funk?.ctName}
            label="Username"
            placeholder="@john123"
            onChange={handleChange}
          />
          <InputField
            mb="15px"
            id="email"
            label="Age"
            name="ctAge"
            type="number"
            onChange={handleChange}
            value={funk?.ctAge}
            placeholder="eg. 20"
          />
          <SelectField
            mb={{base:'15px',sm:'15px',md:'30px'}}
            id="ctGender"
            name="ctGender"
            label="Gender"
            isRequired={false}
            options={genderOptions}
            onChange={handleGenderChange}
            autoComplete="off"
            value={
              genderOptions.find((option) => option.value === funk?.ctGender) ||
              null
            }
          />
          <SelectField
          mb={{base:'15px',sm:'15px',md:'30px'}}
            id="ctGender"
            name="ctCountry"
            label="Country"
            isRequired={false}
            options={mappedCountryOptions}
            onChange={handleCountry}
            autoComplete="off"
            value={
              mappedCountryOptions.find(
                (option) =>
                  option.value.toString() === funk?.ctCountry.toString(),
              ) || null
            }
          />
        <InputField
          id="job"
          name="ctDesignation"
          label="Designation"
          placeholder="Web Developer"
          value={funk?.ctDesignation}
          onChange={handleChange}
        />
        </SimpleGrid>
        <Button
          variant="brand"
          minW={{base:'100%',sm:'100%',md:"183px"}}
          fontSize="sm"
          fontWeight="500"
          ms="auto"
          onClick={handleUpdate}
        >
          Save changes
        </Button>
      </Card>
      {alert ? (
        <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
      ) : null}
    </FormControl>
  );
}
