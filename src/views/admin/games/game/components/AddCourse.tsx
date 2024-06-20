import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  Text,
  Icon,
  Spinner,
  Select,
  useToast,

} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import InputField from 'components/fields/InputField';
import { addgame } from 'utils/game/gameService';
import { getCategoryList,createCategory } from 'utils/category/category';
import { Navigate } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import OnToast from 'components/alerts/toast';


interface Course {
  name: string;
  description: string;
  categoryname?: string;
}

// ...

const AddCourse: React.FC<{ setOpenCourse: any }> = ({ setOpenCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [nameInput, setNameInput] = useState<string>('');
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [categories, setCategories] = useState<{ value: number; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<{ value: number; label: string }[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false); // New state to track if adding
  const [input, setInput] = useState<string>('');
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');
  const toast = useToast();
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

  const handleCategoryClick = (category: { value: number; label: string }) => {
    setSelectedCategories((prevSelectedCategories) => {
      const index = prevSelectedCategories.findIndex((cat) => cat.value === category.value);

      if (index === -1) {
        return [...prevSelectedCategories, category];
      } else {
        return [...prevSelectedCategories.slice(0, index), ...prevSelectedCategories.slice(index + 1)];
      }
    });
  };

  const handleSave = async () => {
    console.log("test", selectedCategories.map((category) => category.value));
    try {
    
            const response = await addgame({
        gameCourseName: nameInput,
        gameCourseDescription: "descriptionInput",
        gameCategoryId: 1,

      });
      if (!nameInput.trim()) {
        setMsg('Please enter a valid course name');
        setToastStatus('error');
        setAlert(true);
  
        return false;
        // alert('Please enter a valid course name.');
        // return;
      }
  
      // Validate descriptionInput
      if (!descriptionInput.trim()) {
        setMsg('Please enter a valid course description');
        setToastStatus('error');
        setAlert(true);
  
        return false;

        // alert('Please enter a valid course description.');
        // return;
      }
  
      if (selectedCategories.length === 0) {
        setMsg('Please select at least one category');
        setToastStatus('error');
        setAlert(true);
  
        return false;

        // alert('Please select at least one category.');
        // return;
      }
      // Log the raw response to see its format
      console.log('addgame Raw Response:', response);

      // Assuming the response is JSON, you can check if it's successful
      const success = response && response.success;

      if (success) {
        const newCourse: Course = {
          name: nameInput,
          description: descriptionInput,
          // Assign the selected category names to the course
          categoryname: selectedCategories.map((category) => category.label).join(', '),
        };

        setCourses([...courses, newCourse]);
        setNameInput('');
        setDescriptionInput('');
        setSelectedCategories([]);
        // setOpenCourse(false);
        navigate('/admin/games/game/gamecreation');
      } else {
        // Handle the case where saving the category fails
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };
  const handleAddClick = () => {
    // Toggle the value of isAdding
    setIsAdding((prevIsAdding) => !prevIsAdding);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleSaveCategory = async () => {
    try {
      if (!input.trim()) {
        setMsg('Please enter a valid category name');
        setToastStatus('error');
        setAlert(true);
  
        return false;
        // alert('Please enter a valid category name.');
        // return;
      }

      const formattedData = {
        catName: input,
      };
      const data = JSON.stringify(formattedData)
      const result = await createCategory(data);

      if (result?.status === 'Success') {
        // After successfully adding a category, refresh the category list
        const updatedCategories = await getCategoryList();
        
        if (updatedCategories?.status === 'Success') {
          setCategories(updatedCategories.data || []);
          setMsg('Category created');
        setToastStatus('success');
        setAlert(true);
        } else {
          console.error('Error fetching updated category list:', updatedCategories?.message);
        }

        setInput('');
        setIsAdding(false); // Hide the category input fields after saving
      } else {
        console.error('Error adding category:', result?.message);
      }
    } catch (error) {
      console.error('An error occurred while adding category:', error);
    }
  };
  return (
    <Flex _before={{ content: '""', background: '#1b1b1c4a', height: '100%', width: '100%', position: 'fixed', top: '0', left: '0', right: '0' }}>
      <Card
        position='fixed'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        background='#fff'
        width='500px'
        display='flex'
        alignItems='center'
        boxShadow='1px 2px 17px #42414556'
        p='20px'
      >
        <Flex justify='space-between' align='center' w='100%'>
          <Text fontSize={25}>Add Course</Text>
        </Flex>

        <Box w='100%'>
          <FormControl>
            <InputField label='Course Name' onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)} value={nameInput} placeholder='Enter Course Name' />

            <InputField
              label='Course Description'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
              value={descriptionInput}
              placeholder='Enter Course Description'
            />
             <Flex justify='space-between' align='center' w='100%'>
          <Text fontSize={25}>Add category</Text>
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
                  <Button onClick={handleSaveCategory} w='100%' bg='#54ad17' color='#fff'>
                    Save
                  </Button>
                  {/* {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null} */}
                </>
              )}
            </FormControl>
          </Box>
        )}

            {isLoading ? (
              <Spinner size='lg' />
            ) : (
              <Box display='flex' flexWrap='wrap' justifyContent='flex-start' w='100%' p='20px 0px' mt='15px'>
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    margin='0 10px 10px 0'
                    onClick={() => handleCategoryClick(category)}
                    color={selectedCategories.some((cat) => cat.value === category.value) ? '#fff' : ''}
                    bg={selectedCategories.some((cat) => cat.value === category.value) ? 'green' : ''}
                  >
                    {category.label}
                  </Button>
                ))}
              </Box>
            )}
          </FormControl>
        </Box>

        <Flex justify='end' w='100%' marginTop='15px' p='0 15px'>
          <Button bg='#3a96cc' color='#fff' onClick={handleSave}>
            Save
          </Button>
          <Button onClick={() => setOpenCourse(false)}>Cancel</Button>
        </Flex>
      </Card>
      {alert ? <OnToast msg={msg} status={toastStatus}  setAlert={setAlert} /> : null}
    </Flex>
  );
};

export default AddCourse;
