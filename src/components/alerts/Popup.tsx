import { Button, Card, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Popup = (props: {setIsConfirm:any, setIsOpen:any ,msg:any,setmsg:any}) => {

    const {setIsConfirm, setIsOpen,setmsg} = props;
    
    const handleDelete = () => {
        setIsConfirm(true);
    }
    const handleCancel = () => {
        setIsConfirm(false);
        setIsOpen(false);
        // setmsg(''); //Commanded By Lokie
    }
 
  return (
    <>
    <Flex _before={{ content:'""', background:'#1b1b1c4a', height:'100%', width:'100%', position:'fixed', top: '0', left: '0', right: '0'}}  >
        <Card position='fixed' top='50%' left='50%' transform='translate(-50%, -50%)' background='#fff' width={{base:'87%',sm:'87%',md:'87%',lg:'500px'}} display='flex'  alignItems='center' boxShadow='1px 2px 17px #42414556' p='20px' >
            {props.msg ? (
            <Text display='flex' w='100%'>
              {props.msg}
            </Text>
          ) : (
            <>
              <Text display='flex' w='100%'>
              Are you sure to delete?
              </Text>
              {/* Add more default content here if needed */}
            </>
          )}
            <Flex justify='end' w='100%' marginTop='15px' p='0 15px'>
            <Button
								variant='darkBrand'
								color='white'
								fontSize='sm'
								fontWeight='500'
								borderRadius='70px'
								px='24px'
								py='5px'onClick={handleDelete}
                >
								Yes
							</Button>
               
                <Button onClick={handleCancel}>Cancel</Button>
            </Flex> 
        </Card>
    </Flex>
    </>
  )
}

export default Popup