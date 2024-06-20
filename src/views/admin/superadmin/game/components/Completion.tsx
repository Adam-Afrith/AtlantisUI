import { Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Img, Radio, RadioGroup, SimpleGrid, Stack, Switch, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import InputField from "components/fields/InputField"
import TextField from "components/fields/TextField"
import React, { useEffect, useRef, useState } from "react"
import Card from 'components/card/Card';
import SelectField from 'components/fields/SelectField';
 
import { getImages, getBlocks } from "utils/game/gameService"
import { useParams } from "react-router-dom";
import { addBulkComplete } from "utils/complete/complete";
import { MdVerified } from "react-icons/md";

const CompletionScreen: React.FC<{ handleChange: (e: any) => void, formData: any, inputRef: any }> = ({ handleChange, formData, inputRef }) => {
  const [img, setImg] = useState<any[]>([]);
  const [isOpenBadge, setIsOpenBadge] = useState<any>(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [backgroundIndex, setBackgroundIndex] = useState<number>();
  const [chosen, setChosen] = useState<any>('A');
  const options = [{ value: 'A', name: 'End Of Game' }, { value: 'B', name: 'Each Question' }];
  const musicOptions = [
    { value: 1, label: 'Jazz' },
    { value: 1, label: 'Melodic Harmony' }, 
    { value: 1, label: 'Rhythmic Serenity' },
    { value: 1, label: 'Echoes of Euphoria' },
    { value: 1, label: 'Sonic Reverie' },
    { value: 1, label: 'Tranquil Melodies' },
    { value: 1, label: 'Harmonic Bliss' },
    { value: 1, label: 'Mystical Cadence' },
    { value: 1, label: 'Celestial Rhythms' },
    { value: 1, label: 'Enchanted Sonata' },
    { value: 1, label: 'Symphony of Dreams' },
  ];
  const { id } = useParams();
  const fetchData = async () => {
    const result = await getImages(4);
    if (result?.status !== 'Success'){
      return alert('getbackruond error:' + result?.message);
    }
    setImg(result?.data);
   
    const block = await getBlocks(id);
    if (block?.status !== 'Success')
     return alert('getbackruond error:' + block?.message);
    setBlocks(block?.data);
  };
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleGa = (value: any) => {
    setChosen(value);
  }
  const handleComplete = (e: any, index: number,idv?:number) => {
    const { name, value, checked,id } = e.target;
    if (name === 'csBadge' || name === 'csSkillwiseScore') {
      setBlocks((prev) => {
        const newData = [...prev];
        newData[index] = {
          ...newData[index],
          [name]: checked,
        };
        return newData;
      });
    }
    else if(id ==='csBadge') {
      setBlocks((prev) => {
        const newData = [...prev];
        newData[index] = {
          ...newData[index],
          [id]: idv,
        };
        return newData;
      });
    }
    else {
      setBlocks((prev) => {
        const newData = [...prev];
        newData[index] = {
          ...newData[index],
          [name]: value,
        };
        return newData;
      });
    }
  };
 const save = async () =>{ 
     const bulk = blocks.map((item,index)=>{
        return {...item,csGameId:id,csBlockId:blocks[index]?.blockId,csType:'QUESTION'}
     })
     const data =JSON.stringify(bulk);
     const result = await addBulkComplete(data);
     if(result?.status !== 'Success') return console.log('bulk Upload Error:',result?.message);
     console.log(result?.data); 
 }

 const handleImg = () => {
    // setIsOpenBadge(!isOpenBadge);
 }
  console.log('badges',img);
  return (
    <Card mb={{ base: '0px', xl: '20px', sm: '20px' }}>
      <Text fontSize={20} fontWeight={800} mb={'20px'}>
        Launch
      </Text>
      <Box w={'100%'} h={'300px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Box as={MdVerified} color={'green.300'} h={'250px'} width={'250px'} />
      
      </Box>
      <Box w={'100%'} display={'flex'} justifyContent={'flex-end'}>
      <Button bg="#3311db" _hover={{ bg: '#3311db' }} color="#fff"w="80px">Preview</Button>
      </Box>
      {/* <Button mt='10px' bg="green.500" onClick={save}>Save</Button> */}
    </Card>
  );
}
export default CompletionScreen;