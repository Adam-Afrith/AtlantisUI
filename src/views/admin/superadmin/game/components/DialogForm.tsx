import { Box, Button, Flex, Grid, GridItem, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';

import Log from 'assets/img/games/log.png';
import Level from 'assets/img/games/new-level-final.png';
import Character from 'assets/img/games/select-character-final.png';
import Badges from 'assets/img/games/badges-game-read-format.png';

// import { createBlocks } from 'utils/blocks/blocks';

interface DialogFormProps {
    handleShowComponent: (componentName: string) => void;
}

const DialogForm: React.FC<DialogFormProps> = ({ handleShowComponent }) => {


    const [img, setImg] = useState([Log,Level,Character,Badges,Log]);
    const [number, setNumber] = useState<any>([]);

    const navigate = useNavigate();

    const [input, setInput] = useState<any>({dialog: '', imgId: ''});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput((prev: any)=> {
            return {
                ...prev, 
                [e.target.name]: e.target.value
            } 
        })        
    }

    const handleClickImg = (id: any) => {                
        setInput((prev: any)=> {
            return { ...prev, imgId: id } 
        })
    }

    const handleStore = async () => {

        try {        
            let form = {
                blockGameId: 4,
                blockText: input.dialog,
                blockCharacterposesId : input.imgId,
                blockChoosen: 'Dialogue',    
            }

            // const data = JSON.stringify(form);
            // const result = await createBlocks(data);

            // if(result.status == 'Success') {
            //     navigate('/admin/superadmin/games/NDI');
            // }
        }   
        catch (err: any) {
            // setMsg(err?.message);
            // setToastStatus('error');
            // setAlert(true);

            console.log('err', err);
        }   
    }

    console.log('input', input);

    // const handleSubmit = () => {
    //     setItems((prev:any)=> {
    //         return [...prev,{
    //                 id: 5,
    //                 name: input?.note,
    //                 imgId: input.imgId,
    //                 img: input?.img,
    //             }];           
    //     });
    //     close(false);
    //     setInput('');
    // }
  

  return (
    <>
        <Box mt={{ base: '0px', xl: '00px' }}>
            {/* <Card mb={{ base: '0px', xl: '20px', sm: '20px' }}> */}
                <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                    <GridItem w='100%' >                
                        <TextField
                            mb="0px"
                            me="30px"
                            w="100%"
                            id="dialog"
                            label="Dialog*"
                            placeholder="eg. Game"
                            name="dialog"  
                            onChange={handleChange}
                            value={input.dialog}                    
                        />
                    </GridItem>  
                    <GridItem w='100%' >                           
                        <Text fontSize={14} fontWeight={600} mb={'10px'}>Pose NON Player</Text>   
                        <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                                {img.map((img, i)=> (
                                    <GridItem w='100%' >
                                        <Img src={img} data-name='imgId' onClick={()=>handleClickImg(i)} h='75px' w='75px' borderRadius='50px' boxShadow='1px 3px 17px #332f2f4d' /> 
                                    </GridItem>                   
                                ))}
                        </Grid>                            
                    </GridItem>                   
                </Grid>

                <Button  bg={'#3311db'} _hover={{bg: '#3311db'}} color={'#fff'} mt={'20px'}>Save</Button>

                {/* <Box>
                    <Flex justifyContent={'center'} mt={'30px'} mb={'10px'}>
                        <Button mr={'10px'} bg={'#000'} color={'#fff'} onClick={()=>handleShowComponent('CustomList')}>Back</Button>
                        <Button bg={'#3311db'} color={'#fff'} onClick={handleStore}>Save</Button>
                    </Flex>
                </Box> */}
            {/* </Card>             */}
        </Box>
    </>
  )
}

export default DialogForm