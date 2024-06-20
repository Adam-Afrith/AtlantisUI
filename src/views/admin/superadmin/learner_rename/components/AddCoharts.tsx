import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Card, Flex, FormControl, Icon, Text, Spinner, useToast, Divider, } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import InputField from 'components/fields/InputField';
import { addcohorts, getcohorts } from 'utils/leaner/leaner';
import { addLearner, getLearnerById, updateLearner, learnerStatus } from 'utils/leaner/leaner';
import { useNavigate } from 'react-router-dom';
import OnToast from 'components/alerts/toast';


// AddCoharts component
interface AddCohortsProps {
  setOpenCoharts: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveSelectedValues: (selectedIds: number[]) => void;
  learnerId: number;
}

interface Cohort {
  chId: number;
  chCohortsName: string;
}

const AddCoharts: React.FC<AddCohortsProps> = ({ setOpenCoharts, onSaveSelectedValues, learnerId }) => {
  const toast = useToast();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false); // New state to track if adding
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const navigate = useNavigate(); 

  useEffect(() => {
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

    fetchCohorts();
  }, []);

  useEffect(() => {
    const fetchLearnerById = async () => {
      try {
        const result = await getLearnerById(learnerId);
        if (result?.status === 'Success') {
          const selectedValues = result?.data?.lenCohorts
            ? result.data.lenCohorts
                .split(',')
                .map((value: string) => value.trim())
                .filter((value: string) => value !== '')
                .map((value: string) => parseInt(value, 10))
            : [];

          setSelectedValues(selectedValues);
        } else {
          console.error('Error fetching learner:', result?.message);
        }
      } catch (error) {
        console.error('An error occurred while fetching learner:', error);
      }
    };

    if (learnerId) {
      fetchLearnerById();
    }
  }, [learnerId]);

  const handleClick = (item: Cohort) => {
    setSelectedValues((prevSelectedValues) => {
      const index = prevSelectedValues.indexOf(item.chId);

      if (index === -1) {
        return [...prevSelectedValues, item.chId];
      } else {
        return [...prevSelectedValues.slice(0, index), ...prevSelectedValues.slice(index + 1)];
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSave = async (e: React.FormEvent) => {
    
    try {
      setAlert(false);
    e.preventDefault();
      if (!input.trim()) {
       
      setMsg('Please enter a valid cohort name.');
      setToastStatus('error');
      setAlert(true);

        return;
      }

      const formattedData = {
        chCohortsName: input,
      };

      const result = await addcohorts(formattedData);

      if (result?.status === 'Success') {
        setCohorts((prevCohorts) => [...prevCohorts, result.data]);
        setInput('');
      } else {
        console.error('Error adding cohort:', result?.message);
      }
    } catch (error) {
      console.error('An error occurred while adding cohort:', error);
    } 
    
  };
  // finally {
  //   setOpenCoharts(false);
  // }
  // finally {
  //   setTimeout(() => {
  //     setOpenCoharts(false);
  //   }, 1000);    }
  const handleSaveSelectedValues = async () => {
    try {
      // if (!selectedValues || selectedValues.length === 0) {
      //   // alert('Please select at least one cohort.');
      //   setMsg('Please select at least one cohort');
      // setToastStatus('error');
      // setAlert(true);
      // // setOpenCoharts(true);
      //   return false;
      // }

      const data = {
        lenCohorts: selectedValues.join(', '),
      };

      const result = await updateLearner(learnerId, JSON.stringify(data));

      if (result?.status === 'Success') {
        // alert(result?.message);
        setMsg('Cohorts Updated Successfully');
        setToastStatus('success');
        setAlert(true);
        setTimeout(() => {
          navigate('/admin/superadmin/learner/'); 
         }, 200);
        //
      } else {
        console.error('updateLearner Error:', result?.message);
      }
    } catch (error) {
      console.error('An error occurred during the update:', error);
    } finally {
      setTimeout(() => {
        setOpenCoharts(false);
      }, 200);    }
  };
  const handleAddClick = () => {
    // Toggle the value of isAdding
    setIsAdding((prevIsAdding) => !prevIsAdding);
  };
  return (
    <Flex _before={{ content: '""', background: '#1b1b1c4a', height: '100%', width: '100%', position: 'fixed', top: '0', left: '0', right: '0' }}>
      <Card position='fixed' top='50%' left='50%' transform='translate(-50%, -50%)' background='#fff' w={{ sm: '350px', md:'600px', xl: '1000px'}}  display='flex' alignItems='center' boxShadow='1px 2px 17px #42414556' p='20px' zIndex={1}>
        <Flex justify='space-between' align='center' w='100%'>
          <Text fontSize={25}>Add Cohorts</Text>
          <Text fontSize={25}>
            <Icon as={MdAdd} cursor='pointer' onClick={handleAddClick} />
          </Text>
        </Flex>
        {isLoading ? (
          <Spinner size='lg' />
        ) : (
          <Box w='100%'>
            <FormControl>
              {isAdding && (
                <>
                  <InputField label='Name' onChange={handleChange} value={input} />
                  <Button onClick={handleSave} w='100%' bg='#54ad17' color='#fff'>
                    Save
                  </Button>
                  {/* {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null} */}
    
                </>
              )}
            </FormControl>
          </Box>
        )}
        <Divider m='20px' borderColor={'#dfdfdf'} />
        <Box w='100%' display={'flex'} justifyContent={'start'} >
          <Text fontSize={20} fontWeight={500}>List Cohorts : </Text>
        </Box>        
        <Box display='flex' flexWrap='wrap' justifyContent='flex-start' w='100%' p='20px 0px' mt='15px' h={{ sm: '300px', xl:'100%'}} overflowY={'auto'}>
          {cohorts.map((item, i) => (
            <Button
              key={i}
              margin='0 10px 10px 0'
              onClick={() => handleClick(item)}
              color={selectedValues.includes(item.chId) ? '#fff' : ''}
              bg={selectedValues.includes(item.chId) ? 'green' : ''}
              fontWeight={400}
              border={' 1px solid #dfdfdf'}
              // _active={{ background: 'green'}}
              // _focus={{ background: 'green'}}
            >
              {item.chCohortsName}
            </Button>
          ))}
        </Box>

        <Flex justify='space-between' w='100%' marginTop='15px' p='0 15px'>
          <Button bg='#3a96cc' color='#fff' onClick={handleSaveSelectedValues}>
            Save Selected Values
          </Button>
          <Button onClick={() => setOpenCoharts(false)}>Cancel</Button>
          {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null}

        </Flex>
      </Card>
    </Flex>
    
    
  );
};

export default AddCoharts;