import { Avatar, Box, Button, Divider, Flex, Grid, GridItem, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { motion } from 'framer-motion';

import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import Log from 'assets/img/games/log.png';
import Level from 'assets/img/games/new-level-final.png';
import Character from 'assets/img/games/select-character-final.png';
import Badges from 'assets/img/games/badges-game-read-format.png';

const GameCreation = () => {
    const [showCards, setShowCards] = useState(true);
    const [img, setImg] = useState([Log,Level,Character,Badges]);
    const [fetchImg, setFetchImg] = useState<any>('');
    
        
    

  return (  
    <>
        <Box className='game-creation' mt={{ base: '0px', xl: '100px' }}>            
            <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                <GridItem w='100%' colSpan={2}>
                    { showCards ?                        
                        ( <Card mb={{ base: '0px', xl: '20px', sm: '20px' }} >
                                {/* <InputField /> */}
                                <Text fontSize={18} fontWeight={500} mb='20px'>Background Image</Text>
                                <Box display='flex' flexDirection='row'>
                                    {img.map((img, i)=> (
                                        <Img 
                                            src={img} 
                                            key={i} 
                                            onClick={()=>setFetchImg(img)} 
                                            w='100px' 
                                            h='100px' 
                                            mr='20px' 
                                            borderRadius='8px' 
                                            boxShadow='1px 3px 17px #332f2f4d' 
                                            cursor={'pointer'} />
                                    ))}                                    
                                </Box>
                            </Card> )
                        :
                        ( <>
                            <Card  mb={{ base: '0px', xl: '20px', sm: '20px' }}>
                                <Text fontSize={20} fontWeight={500}>Non Playing Character</Text>
                                <Flex flexDirection='column'>
                                    <Text>Male</Text>
                                        <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
                                        <Divider />
                                    <Box>Female</Box>
                                </Flex>
                            </Card>
                            <Card mb='20px'>
                                <Text fontSize={20} fontWeight={500}>Playing Character</Text>
                                <Flex flexDirection='column'>
                                    <Box>Male</Box>
                                    <Box>Female</Box>
                                </Flex>
                            </Card>
                        </> )                       
                    }
                </GridItem>
                <GridItem w='100%' colSpan={1}>
                    <Card>
                        { fetchImg !== '' ? <Img src={fetchImg} h='200' w='200' borderRadius='8px' boxShadow='1px 3px 17px #332f2f4d' /> : '' }
                    </Card>
                </GridItem>                
            </Grid>
            <Flex justify='center'>
                <Card display='flex' justifyContent='center' w='200px' flexDirection='row'>
                    <Button bg='#3311db' color='#fff' w='80px' mr='10px' onClick={()=>setShowCards(false)}>Next</Button>
                    <Button bg='#12101b' color='#fff' w='80px' onClick={()=>setShowCards(true)}>Back</Button>
                </Card>
            </Flex>
        </Box>
    </>
  )
}

export default GameCreation