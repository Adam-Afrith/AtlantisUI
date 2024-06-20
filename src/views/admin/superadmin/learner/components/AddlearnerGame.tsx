import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  Icon,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useState, ChangeEvent, useEffect } from 'react';

import { MdAdd, MdGroup, MdPlusOne } from 'react-icons/md';
import InputField from 'components/fields/InputField';
//getAllGame

import { getAllGame } from 'utils/game/gameService';
import { gameAssign, getSelectedGame } from 'utils/leaner/leaner';
import OnToast from 'components/alerts/toast';
interface Cohort {
  chId: number;
  chCohortsName: string;
}
const AddlearnerGame = (props: { setOpenGame: any; learnerId: any }) => {
  const toast = useToast();
  const { setOpenGame } = props;
  // console.log('props',props.learnerId);
  const [game, setGame] = useState([]);
  const [toggle, setToggle] = useState<any>({});
  const [selectedToggle, setSelectedToggle] = useState<any>([]);
  const [alert, setAlert] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [toastStatus, setToastStatus] = useState<string>('');

  const [input, setInput] = useState<any>('');
  const [isOpen, setIsOpen] = useState<any>(false);
  const [selectedValues, setSelectedValues] = useState<number[]>([]); // State to keep track of selected values
  // gaGameId
  const getCurrentDate = (): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentDateTime = (): string => {
    const currentDateTime = new Date();
    return currentDateTime.toISOString();
  };
  const [formData, setFormData] = useState({
      gaDate: getCurrentDate(),
      gaGameId: '',
      gaLearnerId: props.learnerId,
      gaCancelledDate: '',
      gaCancelledReason: '',
      gagameState: '',
      gaVolumeAdjust: '',
      gaCreatedUserId: 1,
      gaEidtedUserId: 1,
      gaCreatedDate: getCurrentDateTime(),
      gaEidtedDate: '',
      gaStatus: 'Active',
      gaDeleteStatus: 'No',
    }),
    [games, setGames] = useState([]);
  /**************************
     * 
     * 
     * 
     * 
    gagamid for{}{
    
            gaVolumeAdjust:'',
    gaDate= gaCancelledDate   
    gaGameId=data.game[key]
    
    
    }
    
    
    
    
    
    
    
    
    
    
    
     */

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllGame();

      if (result?.status !== 'Success')
        return console.log('getLearnerById Error :', result?.message);
      setGame(result.data);
      const selectedGame = await getSelectedGame(props.learnerId);
      if (selectedGame?.status !== 'Success')
        return console.log('selectedGame Error :', selectedGame?.message);
      console.log(typeof selectedGame.data);

      setSelectedToggle(selectedGame.data);
      // console.log('result',result);
    };

    fetchData();
  }, []);
  console.log('selectedToggle', selectedToggle);

  const handleClick = (item: any) => {
    setToggle((prevInput: any) => {
      const currentValue = prevInput[item] !== undefined ? prevInput[item] : '';
      return {
        ...prevInput,
        [item]: currentValue === item ? '' : item,
      };
    });

    if (selectedToggle.includes(item)) {
      setSelectedToggle((prevToggle: any) =>
        prevToggle.filter((toggleId: any) => toggleId !== item),
      );
    } else {
      setSelectedToggle((prevToggle: any) => [...prevToggle, item]); // Add the ID to selectedToggle
    }
  };

  console.log('toggle', toggle);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log('taregt', e.target.value);
    setInput(e.target.value);
  };

  const handleSave = () => {
    // const selectedGameIds = Object.keys(toggle).filter((item) => toggle[item] !== '');
    // setFormData((prev) => ({
    //     ...prev,
    //     gaGameId: [...prev.gaGameId, ...selectedGameIds],
    // }));
    setGame([...game, input]);
    setInput('');
    setIsOpen(false);
    console.log(formData);
  };

  const handleCoh = async () => {
    const selectedGameIds = Object.keys(toggle).filter(
      (item) => toggle[item] !== '',
    );
    setGames(selectedGameIds);
    // console.log('selectedGameIds',selectedToggle)
    // return false;
    let met = {
      games: selectedToggle,
      data: formData,
    };
    let data = JSON.stringify(met);
    let result = await gameAssign(data);
    if (result?.status !== 'Success') {
      console.log('updateLearner Error :', result?.message);
      setMsg('Failed to Add Learner');
      setToastStatus('error');
      setAlert(true);
      return;
    }

    setMsg('Learner Added');
    setToastStatus('success');
    setAlert(true);
    setTimeout(() => {
      setOpenGame(false);
    }, 200);
  };

  // console.log('game', game);
  // console.log('input', input);
  // console.log('toggle', toggle);

  return (
    <>
      <Flex
        _before={{
          content: '""',
          background: '#1b1b1c4a',
          height: '100%',
          width: '100%',
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
        }}
      >
        <Card
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          background="#fff"
          width="500px"
          display="flex"
          alignItems="center"
          boxShadow="1px 2px 17px #42414556"
          p="20px"
          borderRadius={'22px'}
        >
          <Flex justify="space-between" align="center" w="100%">
            <Text fontSize={25}>Add Game</Text>
            {/* <Text fontSize={25} ><Icon as={MdAdd} cursor='pointer' onClick={()=>setIsOpen(true)} /></Text>                 */}
          </Flex>
          {isOpen ? (
            <Box w="100%">
              <FormControl>
                <InputField
                  label="Name"
                  onChange={handleChange}
                  value={input}
                />
                <Button onClick={handleSave} w="100%" bg="#54ad17" color="#fff">
                  Save
                </Button>
              </FormControl>
            </Box>
          ) : null}
          <Box
            display="flex"
            justifyContent="left"
            w="100%"
            p="20px 0px"
            mt="15px"
          >
            {game.map((item, i) => (
              // <Button key={i} margin='0 10px' onClick={() => handleClick(item.gameId)} name={item.gameId} color={toggle[item.gameId] ? '#fff' : ''} bg={toggle[item.gameId] ? 'green' : ''}>{item.gameTitle}-{item.gameId}</Button>
              <Button
                key={i}
                margin="0 10px"
                onClick={() => handleClick(item.gameId)}
                name={item.gameId}
                color={
                  selectedToggle && selectedToggle.includes(item.gameId)
                    ? '#fff'
                    : ''
                }
                bg={
                  selectedToggle && selectedToggle.includes(item.gameId)
                    ? '#11047a'
                    : ''
                }
              >
                {item.gameTitle}
              </Button>
            ))}
          </Box>

          <Flex justify="end" w="100%" marginTop="15px" p="0 15px">
            <Button onClick={() => setOpenGame(false)} bg={'#ddd'} mr={'10px'}>
              Cancel
            </Button>
            <Button
              bg="#3311db"
              color="#fff"
              _hover={{ bg: '#3311db' }}
              onClick={handleCoh}
              w="80px"
            >
              Save
            </Button>
          </Flex>
        </Card>
      </Flex>
      {alert ? (
        <OnToast msg={msg} status={toastStatus} setAlert={setAlert} />
      ) : null}
    </>
  );
};

export default AddlearnerGame;
