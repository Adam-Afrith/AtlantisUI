import { Box, Button, Flex, Grid, GridItem, Icon, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React, { ChangeEvent, FormEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from 'components/card/Card';
import InputField from 'components/fields/InputField';
import TextField from 'components/fields/TextField';

import Log from 'assets/img/games/log.png';
import Level from 'assets/img/games/new-level-final.png';
import Character from 'assets/img/games/select-character-final.png';
import Badges from 'assets/img/games/badges-game-read-format.png';
import { MdBolt, MdPersonSearch } from 'react-icons/md';

// import { createBlocks } from 'utils/blocks/blocks';

interface NoteFormProps {
    handleShowComponent: (componentName: string) => void;
    close?: any;
    setItems? : any;
}

const NoteForm: React.FC<NoteFormProps> = ({ handleShowComponent, setItems, close }) => {


    const [img, setImg] = useState([Log,Level,Character,Badges,Log]);
    const [number, setNumber] = useState<any>([]);
    const [showPoses, setShowPoses] = useState<any>(false);

    const navigate = useNavigate();

    const [input, setInput] = useState<any>({note: '', imgId: '', img: ''});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput((prev: any)=> {
            return {
                ...prev, 
                [e.target.name]: e.target.value
            } 
        })        
    }

    const handleClickImg = (id: any, img: any) => {                
        setInput((prev: any)=> {
            return { ...prev, imgId: id, img: img } 
        })        
    }

    // useEffect(()=> {
        
    // },[input])

    const handleStore = async () => {

        try {        
            let form = {
                blockGameId: 2,
                blockText: input.note,
                blockCharacterposesId : input.imgId,
                blockChoosen: 'Note',    
            }

            // const data = JSON.stringify(form);
            // const result = await createBlocks(data);

            // if(result.status == 'Success') {
            //     navigate('/admin/superadmin/games/NDI');
            // }

            // console.log('result', result);
        }   
        catch (err: any) {
            // setMsg(err?.message);
            // setToastStatus('error');
            // setAlert(true);

            console.log('err', err);
        }   
    }
  

    const handleSubmit = () => {
        setItems((prev:any)=> {
            const previousId = prev.length > 0 ? prev[prev.length - 1].id : 0;
            const newId = String(parseInt(previousId, 10) + 1);
            console.log('prev', newId);
            return [...prev,{
                    id: newId,
                    name: input?.note,
                    imgId: input.imgId,
                    img: input?.img,
                }];           
        });
        close(false);
        setInput('');
    }
  

  return (
    <>
        <Box mt={{ base: '0px', xl: '0px' }}>
            {/* <Card mb={{ base: '0px', xl: '20px', sm: '20px' }}> */}
                <Grid templateColumns='repeat(2, 1fr)' gap={6} >
                    <GridItem w='100%'  >                
                        <TextField                            
                            mb="0px"
                            me="30px"
                            w="100%"
                            id="note"
                            label="Note*"
                            placeholder="eg. Game"
                            name="note"  
                            onChange={handleChange}
                            value={input.note}      
                        />
                    </GridItem>                      
                    <GridItem w='100%' >                      
                        <Text fontSize={14} fontWeight={600} mb={'10px'}>Pose NON Player</Text>   
                        <Grid templateColumns={{sm: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)'}} gap={{sm: '2', xl: '2'}}>
                                {img.map((img, i)=> (
                                    <GridItem w='100%' key={i}>
                                        <Img src={img} data-name='imgId' onClick={()=>handleClickImg(i, img)} h={{sm: '45px',xl: '75px'}} w={{sm: '45px',xl: '75px'}} borderRadius='50px' boxShadow='1px 3px 17px #332f2f4d' /> 
                                    </GridItem>                   
                                ))}
                        </Grid>                         
                    </GridItem>                   
                </Grid>
                
           
                <Button onClick={handleSubmit} bg={'#3311db'} _hover={{bg: '#3311db'}} color={'#fff'} mt={'20px'}>Save</Button>
                {/* <Box>
                    <Flex justifyContent={'center'} mt={'30px'} mb={'10px'}>
                        <Button mr={'10px'} bg={'#000'} color={'#fff'} onClick={() => handleShowComponent('CustomList')}>Back</Button>
                        <Button bg={'#3311db'} color={'#fff'} onClick={handleStore}>Save</Button>
                    </Flex>
                </Box> */}
            {/* </Card>             */}
        </Box>
    </>
  )
}

export default NoteForm