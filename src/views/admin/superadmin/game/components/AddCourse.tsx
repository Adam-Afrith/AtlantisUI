import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  useToast,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { MdInfo } from 'react-icons/md';
import InputField from 'components/fields/InputField';
import { addgame } from 'utils/game/gameService';
import { getCategoryList, createCategory } from 'utils/category/category';
import { useNavigate } from 'react-router-dom';
import OnToast from 'components/alerts/toast';

interface Course {
  name: string;
  description: string;
  categoryname?: string;
}

// ...

const AddCourse: React.FC<{ setOpenCourse: any, isOpen?: any, onOpen?: any, onClose?: any }> = ({ setOpenCourse, isOpen, onOpen, onClose }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [nameInput, setNameInput] = useState<string>('');
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [categories, setCategories] = useState<
    { value: number; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<
    { value: number; label: string }[]
  >([]);
  const [isAdding, setIsAdding] = useState<boolean>(false); // New state to track if adding
  const [input, setInput] = useState<string>('');
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [tool, setTool] = useState(false);
  const [toastStatus, setToastStatus] = useState<string>('');
  const toast = useToast();
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const result = await getCategoryList();

        if (result?.status === 'Success') {
          setCategories(result.data || []);
        } else {
          console.error('Error fetching category list:', result?.message);
        }
      } catch (error) {
        console.error('An error occurred while fetching category list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryList();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name') {
      setNameInput(value);
    } else if (field === 'description') {
      setDescriptionInput(value);
    }
  };
  const handleNavigate = () => {
    // navigate('/admin/games/game/`${2}`');
    navigate('/admin/superadmin/game/creation/`${2}`');
  };
  const handleCategoryClick = (category: { value: number; label: string }) => {
    setSelectedCategories((prevSelectedCategories) => {
      const index = prevSelectedCategories.findIndex(
        (cat) => cat.value === category.value,
      );

      if (index === -1) {
        return [...prevSelectedCategories, category];
      } else {
        return [
          ...prevSelectedCategories.slice(0, index),
          ...prevSelectedCategories.slice(index + 1),
        ];
      }
    });
  };

  const handleSave = async () => {
    // if (!nameInput.trim()) {
    //   setMsg('Please enter a valid course name');
    //   setToastStatus('error');
    //   setAlert(true);
    //   return false;
    // }
    // if (!descriptionInput.trim()) {
    //   setMsg('Please enter a valid course description');
    //   setToastStatus('error');
    //   setAlert(true);
    //   return false;
    // }
    if (selectedCategories.length === 0) {
      setMsg('Please select at least one category');
      setToastStatus('error');
      setAlert(true);
      return false;
    }
    try {
      setAlert(false);
      const response = await addgame({
        gameCategoryId: JSON.stringify(
          selectedCategories.map((category) => category.value),
        ),
      });
      // const datas = JSON.stringify(response)
      console.log('addgame Raw Response:', response);
      const gameId = response.data.gameId;
      console.log('Received gameId:', gameId);

      if (response?.status !== 'Success') {
        setMsg('Failed to Add creator');
        setToastStatus('error');
        setAlert(true);
        return;
      }
      setMsg('Course Stored');
      setToastStatus('success');
      setAlert(true);
      setTimeout(() => {
        navigate(`/admin/superadmin/game/${gameId}`);
      }, 2000);
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };
  const handleAddClick = () => {
    setIsAdding((prevIsAdding) => !prevIsAdding);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };


  // modal popup for category

  const finalRef = React.useRef(null)



  const handleSaveCategory = async () => {
    try {
      if (!input.trim()) {
        setMsg('Please enter a valid category name');
        setToastStatus('error');
        setAlert(true);
        return false;
      }
      const formattedData = {
        catName: input,
      };
      const result = await createCategory(JSON.stringify(formattedData));
      if (result?.status === 'Success') {
        const updatedCategories = await getCategoryList();
        if (updatedCategories?.status === 'Success') {
          setCategories(updatedCategories.data || []);
          setMsg('Category created');
          setToastStatus('success');
          setAlert(true);
        } else {
          console.error(
            'Error fetching updated category list:',
            updatedCategories?.message,
          );
        }
        setInput('');
        setIsAdding(false);
      } else {
        console.error('Error adding category:', result?.message);
      }
    } catch (error) {
      console.error('An error occurred while adding category:', error);
    }
  };
  return (
    <Box className="popup">
      {/* <Flex
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
      > */}
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Modal Title</ModalHeader> */}
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-start"
              w="100%"
              p="20px 0px"
            >
              <Box position={'relative'}>
                <Text
                  fontSize='xl'
                  fontWeight={'bold'}
                  color={textColorPrimary}
                >
                  Choose From Existing Categories :
                  <Icon as={MdInfo} cursor={'pointer'} onMouseEnter={() => setTool(true)} onMouseLeave={() => setTool(false)} />
                </Text>
              </Box>
              {tool && <Box p={'0px 10px'} bg={'black'} position={'absolute'} right={'-120px'} top={'30px'}>
                <Text
                  fontSize='sm'
                  color={'#fff'}
                // fontWeight={'bold'}
                // color={textColorPrimary}
                >
                  You may choose multiple categories
                </Text>
              </Box>}
              {/* <span style={{ fontSize:'sm',fontStyle: 'italic', color: '#191919' }}>
                    (You may choose multiple categories)
                  </span>{' '} */}
              <Box p={'20px 0'}>
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    margin="0 10px 10px 0"
                    onClick={() => handleCategoryClick(category)}
                    color={
                      selectedCategories.some(
                        (cat) => cat.value === category.value,
                      )
                        ? '#fff'
                        : ''
                    }
                    bg={
                      selectedCategories.some(
                        (cat) => cat.value === category.value,
                      )
                        ? '#11047a'
                        : '#f4f7fe'
                    }
                    _hover={{
                      color: selectedCategories.some(
                        (cat) => cat.value === category.value,
                      )
                        ? '#fff'
                        : '',
                      bg: selectedCategories.some(
                        (cat) => cat.value === category.value,
                      )
                        ? '#11047a'
                        : '#f4f7fe',
                    }}
                  >
                    {category.label}
                  </Button>
                ))}
              </Box>
            </Box>
            <Flex justify="space-between" align="center" w="100%">
              <Text fontSize='xl' color={textColorPrimary} fontWeight='bold'>Add New Category</Text>
            </Flex>
            <Box w={'100%'} padding={'10px 0'} display={'flex'} justifyContent={'space-between'} >
              <Box
                width={'70%'}
              >
                <InputField
                  // label="Name"
                  onChange={handleChange}
                  value={input}
                />
              </Box>
              <Box
                mt={'10px'}
                width={'25%'}
              >
                <Button
                  onClick={handleSaveCategory}
                  bg="#3311db"
                  color="#fff"
                  _hover={{ bg: '#3311db' }}
                >
                  Save
                </Button>
              </Box>
            </Box>
            {/* <Card
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          background="#fff"
          marginLeft={'90px'}
          width="500px"
          display="flex"
          alignItems="center"
          boxShadow="1px 2px 17px #42414556"
          p="20px"
        >
          <Box w="100%">
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              
            )}
         
          </Box>
        
        </Card> */}
          </ModalBody>

          <ModalFooter>
            <Flex justify="end" w="100%" marginTop="15px" p="0 15px">
              <Button
                onClick={() => setOpenCourse(false)}
                bg={'#f4f7fe'}
                color={'#000'}
                _hover={{ bg: '#e9edf7' }}
                mr={'10px'}
              >
                Cancel
              </Button>
              <Button
                bg="#3311db"
                color="#fff"
                onClick={handleSave}
                _hover={{ bg: '#3311db' }}
              >
                Confirm
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {alert ? (
        <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
      ) : null}
      {/* </Flex> */}
    </Box>
  );
};

export default AddCourse;
