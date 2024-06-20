import { Box, Button, Flex } from '@chakra-ui/react'
import React, {useState} from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import AddCourse from './components/AddCourse';

const Game = () => {
    const [openCourse, setOpenCourse] = useState(false);

    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('gamecreation');
    }
    
    const handleCourse = () => {
        setOpenCourse(true);
    }

  return (
    <>
        <Box mb={{ base: '0px', xl: '100px' }}>            
        </Box>               
        <Card>       
            <Flex justifyContent='end'>  
            <Button mt='10px' mb='15px' mr='10px' padding={2} background='#3311db' color='#fff' w={150} onClick={handleCourse}>Add Course</Button>          
                <Button mt='10px' mb='15px' padding={2} background='#3311db' color='#fff' w={70} onClick={handleNavigate}>New</Button>
            </Flex>            
        </Card>  
        {openCourse ? <AddCourse setOpenCourse={setOpenCourse} /> : null }     
    </>
  )
}

export default Game