import { Box, Button, Divider, Flex, Grid, GridItem, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';
import NFT from 'assets/img/games/badges-game-read-format.png'

interface Option {
    id: number;
  }
  interface InteractionFormProps {
    handleShowComponent: (componentName: string) => void;
}

const InteractionForm: React.FC<InteractionFormProps> = ({ handleShowComponent }) => {

    const [noOfOptions, setNoOfOptions] = useState(1);
    const [options, setOptions] = useState<Option[]>([]);
    const [wrongOption, setWrongOption] = useState(false);    
    const [img, setImg] = useState([NFT, NFT, NFT, NFT, NFT, NFT, NFT, NFT]);    

    const navigate = useNavigate();


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {        
        const value = parseInt(e.target.value, 10) || 1;
        setNoOfOptions(value);
    }

    const handleRight = (i: any) => {

    }

    const handleWrong = ({i, option}: {i : any, option : any}) => {           
        console.log('option', option);               
    }    


    useEffect(() => {        
        setOptions(Array.from({ length: noOfOptions }, (_, index) => ({ id: index + 1 })));
      }, [noOfOptions]);

  return (
    <>
        <Box mt={{ base: '0px', xl: '0px' }}>
            <Card mb={{ base: '0px', xl: '20px', sm: '20px' }}>               
                {/* <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                    <GridItem w='100%' >                
                        <InputField
                            mb="0px"
                            me="30px"
                            w="100%"
                            id="title"
                            label="Title*"
                            placeholder="eg. Game"
                            name="title"                    
                        />
                    </GridItem>  
                    <GridItem w='100%' >                      
                        <TextField
                            mb="0px"
                            me="30px"
                            id="question"
                            label="Question*"
                            placeholder="eg. Game"
                            name="question"                    
                        />
                    </GridItem>
                    <GridItem w='100%' >
                        <InputField
                            mb="0px"
                            me="30px"
                            id="noofoptions"
                            type='number'
                            label="No Of Options"
                            placeholder="eg. 2"
                            name="noofoptions"   
                            onChange={handleChange}                 
                        />
                    </GridItem>
                </Grid> */}

                <Box display={{base: 'block', xl: 'flex'}}>
                    <Box display={'flex'} flexDir={'column'} w={'60%'} mr={'20px'}>
                        <Box display={'flex'} mb={'20px'} justifyContent={'space-between'}> 
                            <Box mr={'10px'}>
                                <InputField
                                    mb="0px"
                                    me="30px"
                                    w="100%"
                                    id="title"
                                    label="Title*"
                                    placeholder="eg. Game"
                                    name="title"                    
                                />
                            </Box>
                            <Box>
                                <InputField
                                    mb="0px"
                                    me="30px"
                                    id="noofoptions"
                                    type='number'
                                    label="No Of Options"
                                    placeholder="eg. 2"
                                    name="noofoptions"   
                                    onChange={handleChange}                 
                                />
                            </Box>
                        </Box>
                        <Box>
                            <TextField
                                mb="0px"
                                me="30px"
                                id="question"
                                label="Question*"
                                placeholder="eg. Game"
                                name="question"                    
                            />
                        </Box>
                    </Box>
                    <Box w={'40%'} display={'flex'} overflow={'hidden'} flexDir={'column'}>
                        <Box display={'flex'} flexDirection={'row'} h={'150px'} w={'100%'} justifyContent={'space-between'}>
                            <Box m={'0 0px 10px 0'}>
                                <Img src={NFT} h={'150px'} w={'100%'} borderRadius={'10px'} boxShadow={'1px 3px 10px #8080803b'} />
                            </Box>
                            {/* <Box display={'flex'} flexDir={'column'} overflowY={'auto'} height={'520px'}>
                                {img.map((img, i)=> (
                                    <Img key={i} src={img} h={'60px'} w={'60px'} mb={'10px'} borderRadius={'10px'} boxShadow={'1px 3px 10px #8080803b'} />                                
                                ))}
                            </Box> */}
                        </Box>
                        <Box overflowX={'auto'} display={'flex'} mt={'10px'} zIndex={'999'} bg={'#fff'}>
                            {img.map((img, i)=> (
                                <Img key={i} src={img} h={'60px'} w={'60px'} mr={'10px'} borderRadius={'10px'} boxShadow={'1px 3px 10px #8080803b'} />                                
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Card>
            <Card mb={{ base: '0px', xl: '20px', sm: '20px' }}>
                <Box>
                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize={18} fontWeight={600} >No of Options</Text>
                        <Flex>
                            <Button w={100} mr={'10px'} bg={'#f4f7fe'} _hover={{bg: '#e9edf7'}} color={'#000'} onClick={()=>handleShowComponent('CustomList')}>Back</Button>
                            <Button w={100} bg={'#3311db'} _hover={{bg: '#3311db'}} color={'#fff'}>Save</Button>
                        </Flex>
                    </Flex>
                </Box>
                <Divider m={'20px 0'} />
                {options.map((option, i) => (               
                    <SimpleGrid key={i} columns={{ sm: 1, md: 6 }} spacing={{ base: '20px', xl: '20px' }} mb={'40px'} >                                         
                        <InputField
                            mb="0px"
                            me="30px"
                            w="100%"
                            id="optionname"
                            label="Option Name"
                            placeholder="eg. Game"
                            name="optionname"                    
                        />
                        <InputField
                            mb="0px"
                            me="30px"
                            w="100%"
                            id="resposnse"
                            label="Resposnse"
                            placeholder="eg. Game"
                            name="resposnse"                    
                        />
                        <InputField
                            mb="0px"
                            me="30px"
                            w="100%"
                            id="feedback"
                            label="Feedback"
                            placeholder="eg. Game"
                            name="feedback"                    
                        />
                        <Box>                            
                            <Flex alignItems={'center'} h={'100%'} mt={'10px'}>
                                <Button mr={'10px'} bg={'#ddd'} color={'#000'} onClick={()=>handleRight(i)}>Right</Button>
                                <Button bg={'#ddd'} color={'#000'} onClick={()=>handleWrong({i, option})}>Wrong</Button>
                            </Flex>
                        </Box>
                        <InputField
                            mb="0px"
                            me="30px"
                            w="100%"
                            id="titletag"
                            label="Title Tag"
                            placeholder="eg. Game"
                            name="titletag"                    
                        />
                        { ((wrongOption)) ? 
                           ( <InputField                                
                                mb="0px"
                                me="30px"
                                w="100%"
                                id="wrongoption"
                                label="Wrong Option"
                                placeholder="eg. Game"
                                name="wrongoption"                    
                            />  ) : null }
                  </SimpleGrid>
                ))}
            </Card>
        </Box>
    </>
  )
}

export default InteractionForm