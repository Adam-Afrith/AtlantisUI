// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import { useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import { changePassword } from 'utils/creator/creator';
import OnToast from 'components/alerts/toast'
import { useAuth } from 'contexts/auth.context';
export default function Settings() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState(''),
 
    [password, setPassword] = useState({ first: '', confirmed: '' });
  const { id } = useParams();
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const { user, setUser } = useAuth();
  const handlePassword = (e: any) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = async () => {
    if (password.first !== password.confirmed)
      return console.log('enter same password');
    const change = {
      oldPassword: oldPassword,
      confirmed: password?.confirmed,
    };
    const data = JSON.stringify(change);
    const result = await changePassword(id, data);
	if(result?.status !=='Success') {
    setMsg(result?.message);
    setToastStatus('error');
    setAlert(true);
    return console.log('Error :'+ result?.message) }else{
      setMsg('Updated Sucessfuly');
      setToastStatus('success');
      setAlert(true);
      setTimeout(() => {
       
        setUser(null);
        localStorage.removeItem('user')
        navigate('/auth/sign-in/default')

      }, 300);
    console.log('succesfully Updated');
  }
   
  };
  return (
    <FormControl>
      <Card>
        <Flex direction="column" mb="40px">
          <Text fontSize="xl" color={textColorPrimary} fontWeight="bold">
            Change password
          </Text>
        </Flex>
        <FormControl>
          <Flex flexDirection="column">
            <InputField
              mb="25px"
              id="old"
              label="Old Password"
              placeholder="@john123"
              onChange={(e: any) => setOldPassword(e.target.value)}
            />
            <InputField
              mb="25px"
              id="new"
              name="first"
              label="New Password"
              placeholder="@john123"
              onChange={handlePassword}
            />
            <InputField
              mb="25px"
              id="confirm"
              name="confirmed"
              label="New Password Confirmation"
              placeholder="@john123"
              onChange={handlePassword}
            />
          </Flex>
        </FormControl>
        <Button
          variant="brand"
          minW={{base:'100%',sm:'100%',md:"183px"}}
          fontSize="sm"
          fontWeight="500"
          ms="auto"
          onClick={handleChange}
        >
          Change Password
        </Button>
      </Card>
      {alert ? <OnToast msg={msg} status={toastStatus} setAlert={setAlert} /> : null}
    </FormControl>
  );
}
