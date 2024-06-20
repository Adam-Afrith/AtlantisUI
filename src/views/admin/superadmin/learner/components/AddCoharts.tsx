import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
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
} from '@chakra-ui/react';
import { MdGroupAdd, MdModeEdit, MdClose, MdDelete } from 'react-icons/md';
import InputField from 'components/fields/InputField';
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

const AddCoharts: React.FC<AddCohortsProps> = ({
  setOpenCoharts,
  onSaveSelectedValues,
  learnerId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

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

  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();

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
        return [
          ...prevSelectedValues.slice(0, index),
          ...prevSelectedValues.slice(index + 1),
        ];
      }
    });
  };

  const handleEdit = async (item: Cohort) => {
    setLabel('EDIT');
    console.log('entered', item);
    // const result = await getCohortsById(item);
    // if (result?.status === 'Success') {

    setInput(item?.chCohortsName);
    setupdateId(item?.chId);
    // }
  };
  const handleDelete = async (id: number) => {
    setAlert(false);
    // checkCohorts
    const result = await checkCohorts(id);
    if (result?.status === 'Waring') {
      onOpen();
      setDeleteId(id);
      return false;
    }

    if (result?.status !== 'Success') {
      setMsg('coharts Not Deleted');
      setToastStatus('error');
      setAlert(true);
      fetchCohorts();
    } else {
      console.log('result', result);
      setMsg('coharts Deleted');
      setToastStatus('success');
      setAlert(true);
      fetchCohorts();
    }
  };
  const deleteData = async () => {
    if (deleteId) {
      const result = await reomvecohorts(deleteId);
      if (result?.status !== 'Success') {
        console.log('deleteLearner Error :', result?.message);
        fetchCohorts();
        setMsg('cohorts Not Deleted');
        setToastStatus('error');
        setAlert(true);
        setIsConfirm(false);
        return;
      } else {
        fetchCohorts();
        setMsg('cohorts Deleted');
        setToastStatus('success');
        setAlert(true);
        setIsConfirm(false);
        onClose();
      }
    }
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

      if (updateId !== 0) {
        let result = await updatecohorts(
          updateId,
          JSON.stringify(formattedData),
        );
        if (result?.status === 'Success') {
          setCohorts((prevCohorts) => [...prevCohorts, result.data]);
          setInput('');
          setupdateId(0);
          fetchCohorts();
        } else {
          console.error('Error update cohort:', result?.message);
        }
      } else {
        let result = await addcohorts(formattedData);
        if (result?.status === 'Success') {
          setCohorts((prevCohorts) => [...prevCohorts, result.data]);
          setInput('');
          setupdateId(0);
          fetchCohorts();
        } else {
          console.error('Error adding cohort:', result?.message);
        }
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
      }, 200);
    }
  };
  const handleAddClick = () => {
    // Toggle the value of isAdding
    setIsAdding((prevIsAdding) => !prevIsAdding);
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
          w={'500px'}
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          background="#fff"
          display="flex"
          alignItems="center"
          boxShadow="1px 2px 17px #42414556"
          p="20px"
          zIndex={1}
          borderRadius={'22px'}
        >
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            borderBottom={'1px solid #efefef'}
            pb={'10px'}
          >
            <Text fontSize={25}>Add Cohorts</Text>
            <Text fontSize={25}>
              <Icon
                as={MdClose}
                cursor="pointer"
                onClick={() => setOpenCoharts(false)}
              />
            </Text>
          </Flex>

          <Box w="100%">
            {/* <FormControl> */}

            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              mt={'20px'}
            >
              <Box width={'80%'} mr={'10px'}>
                <InputField
                  label="Name"
                  onChange={handleChange}
                  value={input}
                />
              </Box>
              <Box width={'20%'}>
                <Button
                  onClick={handleSave}
                  bg={'linear-gradient(to bottom, #7551ff, #3311db)'}
                  color="#fff"
                  width={'100%'}
                >
                  {labelset}
                </Button>
              </Box>
              {/* {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null} */}
            </Flex>

            {/* </FormControl> */}
          </Box>

          <Divider m="20px" borderColor={'#dfdfdf'} />
          <Box w="100%" display={'flex'} justifyContent={'start'}>
            <Text fontSize={20} fontWeight={500}>
              List Cohorts :{' '}
            </Text>
          </Box>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-start"
            w="100%"
            p="20px 0px"
            mt="15px"
          >
            {cohorts.map((item, i) => (
              <Box key={i} position={'relative'}>
                <Button
                  key={i}
                  margin="0 10px 10px 0"
                  color={selectedValues.includes(item.chId) ? '#fff' : ''}
                  bg={selectedValues.includes(item.chId) ? '#11047a' : ''}
                  _hover={{ bg: '#11047a', color: '#fff' }}
                  fontWeight={400}
                  border={' 1px solid #dfdfdf'}
                  // _active={{ background: 'green'}}
                  // _focus={{ background: 'green'}}
                >
                  {item.chCohortsName}

                  <Popover placement="right">
                    <PopoverTrigger>
                      <Box
                        // position="absolute"
                        // top="10px"
                        // right="10px"
                        mt={'5px'}
                        ml={'10px'}
                        cursor="pointer"
                      >
                        <Icon
                          color={
                            selectedValues.includes(item.chId)
                              ? 'white'
                              : 'black'
                          }
                          _hover={{ color: '#fff' }}
                          as={SlOptionsVertical}
                        />
                      </Box>
                    </PopoverTrigger>
                    <PopoverArrow />
                    <PopoverContent
                      width="150px"
                      maxH="100px"
                      boxShadow={'1px 2px 17px #4b40401f'}
                      border={'none'}
                    >
                      <PopoverBody>
                        {' '}
                        <Box
                          cursor="pointer"
                          display="flex"
                          alignItems="center"
                          mb={'10px'}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEdit(item);
                          }}
                        >
                          <Text fontSize={17} color={'black'}>
                            <Icon as={MdModeEdit} /> Edit
                          </Text>
                        </Box>
                        <Box
                          cursor="pointer"
                          display="flex"
                          mb={'10px'}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(item.chId);
                          }}
                        >
                          <Text fontSize={17} color={'black'}>
                            <Icon as={MdDelete} /> Delete{' '}
                          </Text>
                        </Box>
                        <Box
                          display="flex"
                          cursor="pointer"
                          mb={'10px'}
                          onClick={() => handleClick(item)}
                        >
                          <Text fontSize={17} color={'black'}>
                            <Icon as={MdGroupAdd} /> Add Cohorts{' '}
                          </Text>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Button>
              </Box>
            ))}
          </Box>

          <Flex
            justify="space-between"
            w="100%"
            marginTop="15px"
            p="0 15px"
            pt={'20px'}
            borderTop={'1px solid #ddd'}
          >
            <Button onClick={() => setOpenCoharts(false)} bg={'#ddd'}>
              Cancel
            </Button>
            <Button
              bg="#3311db"
              _hover={{ bg: '#3311db' }}
              color="#fff"
              w="100px"
              onClick={handleSaveSelectedValues}
            >
              Save
            </Button>
            {alert ? (
              <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
            ) : null}
          </Flex>
        </Card>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Cohort
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? this Cohort also Assing in other leaner's.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteData} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AddCoharts;
