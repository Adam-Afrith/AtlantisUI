import React from 'react'
import { Button, Text, Box, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NoAuth: React.FC<{ isAuthFailed: boolean }> = ({ isAuthFailed }) => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/auth/sign-in/default');
    }
    return (
        <Box width={'100%'} h={'100vh'} display={'flex'} justifyContent={"center"} alignItems={"center"}>
            {isAuthFailed ?
                <>
                    <Box w={{ base: '90%', md: '60%', lg: '30%' }}>
                        <Text mb={'10px'}  textAlign={'center'}> {"You are not Authorized User...! You are not allowed"}</Text>
                        <Button
                            fontSize="sm"
                            variant="brand"
                            fontWeight="500"
                            w="100%"
                            h="50"
                            mb="24px"
                            onClick={goHome}
                        >
                            Go to Login
                        </Button>
                    </Box>

                    {/* <Button bg="#11047a" 
                _hover={{ bg: '#190793' }} 
                color="#fff" 
                h={'46px'} 
                w={'128px'} 
                display={'block'} 
                mr={'17px'} 
                mt={'6px'} 
                ml={'11px'}
                onClick={()=>goHome()}> {"Go to Login page"}
            </Button> */}
                </>
                :
                <>
                    <Text>{"You are not Authorized User...! Please login."}</Text>
                    <Button bg="#11047a"
                        _hover={{ bg: '#190793' }}
                        color="#fff"
                        h={'46px'}
                        w={'128px'}
                        display={'block'}
                        mr={'17px'}
                        mt={'6px'}
                        ml={'11px'}
                        onClick={() => goHome()}> {"Go to Login page"}
                    </Button>
                </>
            }
        </Box>
    )
}

export default NoAuth;