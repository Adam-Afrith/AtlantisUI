// Chakra imports
import { Flex, Text, useColorModeValue,Icon,Button,Box,InputGroup,InputLeftElement,IconButton,Input,FormLabel,InputRightElement} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { MdGroupAdd, MdModeEdit, MdClose, MdDelete } from 'react-icons/md';
import { SearchIcon,CloseIcon } from '@chakra-ui/icons';
import React, {useEffect, useState} from 'react';
// Custom components
import { Switch } from '@chakra-ui/react'
import SwitchField from 'components/fields/SwitchField';
import Menu from 'components/menu/MainMenu';
import { gameAssignList} from 'utils/game/gameService';
import {gameAssign} from 'utils/leaner/leaner'

    const LeanersList = (props: {setOpenLearner:any,assignGameId:any,setMsg:any,setToastStatus:any,setAlert:any}) => {
	const {setOpenLearner,assignGameId,setMsg,setToastStatus,setAlert} = props;
    const searchIconColor = useColorModeValue('gray.700', 'white');
	// Chakra Color Mode
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
    const [fil, setFil] = useState<string>('');
    const[showLearner, setLearner] = useState<any[]>([]);
    const  [showAssignList, setAssignList] = useState<any[]>([]);

   
    const [selectedToggle, setSelectedToggle] = useState<any>([]);
    const [selectedToggledb, setdbSelectedToggle] = useState<any>([]);
 


 const handleClick = (item: any,isChecked:boolean) => {
 
        if (selectedToggle.includes(item)) {
            setSelectedToggle((prevToggle:any) => prevToggle.filter((toggleId:any) => toggleId !== item));
          } else {
            setSelectedToggle((prevToggle:any) => [...prevToggle, item]); // Add the ID to selectedToggle
          }
        
    };
    const handleAssign = async () => {
      const data = {
        learnerId: selectedToggle,
        gameid: assignGameId,
       
      };
      const jsonString = JSON.stringify(data);
    const result = await gameAssign(jsonString);
    if(result?.status !== 'Success'){
   
      setMsg('The game has not been assigned to any learners.');
      setToastStatus('error');
      setAlert(true);
      
      return;
    }else{
      setMsg('The game has been successfully assigned.');
      setToastStatus('success');
      setAlert(true); 
      setOpenLearner(false)
    }
   
    console.log('result',result);
    };
    
console.log('toggle',selectedToggle);
    useEffect(() => {
        const getlist = async () => {
            const result = await gameAssignList(assignGameId);

            if(result?.status !== 'Success'){
              console.log('data not getting')
              return;
            } else{
                console.log('result',result.learner);
                setLearner(result.learner);
                setAssignList(result.assign);
                setdbSelectedToggle(result.assign);
                setSelectedToggle(result.assign);
            }
           
console.log('showLearner :',showLearner);
console.log('showAssignList :',showAssignList)



        }

        getlist()
    }, []);


    const chunkArray = (arr:any, chunkSize:any) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
      };

      const filteredLearners = showLearner.filter((item, index) =>
      item?.lenUserName && fil ?
      item.lenUserName.toLowerCase().includes(fil.toLowerCase()) :
      false
    );


    const dataToUse = fil ? filteredLearners : showLearner;

    const learnerChunks = chunkArray(dataToUse, 3);
console.log('learnerChunks',learnerChunks)
	return (
        <Flex _before={{ content:'""', background:'#1b1b1c4a', height:'100%', width:'100%', position:'fixed', top: '0', left: '0', right: '0'}}  >
		
        <Card position='fixed' top='50%' left='50%' transform='translate(-50%, -50%)' background='#fff' width='50%' display='flex'  alignItems='center' boxShadow='1px 2px 17px #42414556' p='10px' mb='20px' >
			<Flex align='center' w='100%' justify='space-between' mb='30px'>
				<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
                Assign Learners
				</Text>
                <Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
                <InputGroup w={{ base: '100%', md: '300px' }} ml="auto">
  <InputLeftElement
    children={
      <IconButton
        aria-label="search"
        bg="inherit"
        borderRadius="inherit"
        _active={{
          bg: 'inherit',
          transform: 'none',
          borderColor: 'transparent',
        }}
        _hover={{
          background: 'none',
        }}
        _focus={{
          background: 'none',
          boxShadow: 'none',
        }}
        icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
      />
    }
  />
  <Input
    type="text"
    placeholder="Search..."
    value={fil || ''}
    onChange={(e) => setFil(e.target.value)}
    bg={'#f9f9f9'}
    borderRadius={'14px'}
    w={{ base: '200px', xl: '300px' }}
  />
  {fil && (
    <InputRightElement
      children={
        <IconButton
          aria-label="clear"
          bg="inherit"
          borderRadius="inherit"
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          }}
          _hover={{
            background: 'none',
          }}
          _focus={{
            background: 'none',
            boxShadow: 'none',
          }}
          icon={<CloseIcon color="gray.500"  w="10px" h="10px"/>}
          onClick={() => setFil('')} // Clear the input field
        />
      }
    />
  )}
</InputGroup>
				</Text>
				<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
                <Icon as={MdClose} cursor='pointer'  onClick={() => setOpenLearner(false)}  />
                {/* */}
				</Text>
			</Flex>
      <Box maxH="350px" overflowY="auto" width={'100%'}>
      <table  style={{ borderCollapse: 'collapse', width: '100%',marginBottom:'20px'}}>
        
  {learnerChunks &&
    learnerChunks.map((chunk, index) => (
     
        <tbody>
          {chunk.length > 0 && (
            <tr style={{ height:'40px' }}>
              {chunk.map(({ lenId, lenUserName }: { lenId: any; lenUserName: string }) => (
                <>
                  <td style={{  textAlign: 'right', }}>{lenUserName}</td>

                  <td style={{  textAlign: 'center' }}>
                  <Switch
  id={`len-${lenId}`}
  name={`len-${lenId}`}
  colorScheme="brandScheme"
  onChange={(event) => handleClick(lenId,event.target.checked)}
  isChecked={selectedToggle.includes(lenId)}
 
/>

</td>
                </>
              ))}
            </tr>
          )}
        </tbody>
    
    ))}
      </table>
</Box>




            
            
      <Flex
  align="right"
  justify="flex-end"
  w='100%' 

>
  <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl" mb="4px">
    {/* Your text content */}
  </Text>
  <Button
    ml="auto" // Use 'ml="auto"' to push the button to the right
    variant="darkBrand"
    color="white"
    fontSize="sm"
    fontWeight="500"
    borderRadius="70px"
    px="24px"
    py="5px"
    onClick={handleAssign}
  >
    Assign Game
  </Button>
</Flex>

		</Card>
    
        </Flex>
	);
}
export default LeanersList