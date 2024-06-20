import React from 'react';
import { Flex, Card, Text, Button, Icon } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import Profile from './GameProfile';
import { MaintainGameView} from 'utils/game/gameService';
import { useNavigate, useParams } from 'react-router-dom';
import {DemoPlayRoutePath} from 'config/constant';

const ModalComponent: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const playPerview = async () => {
    const result = await MaintainGameView(id);
    if (result?.status !== 'Success') {
      return console.log('getbackruond error:' + result?.message);
    }
    navigate(`${DemoPlayRoutePath+id}`);
  };
  return (
    <Flex _before={{ content: '""', background: '#1b1b1c4a', height: '100%', width: '100%', position: 'fixed', top: '0', left: '0', right: '0' }} >
      <Card position='fixed' top='55%' left='50%' transform='translate(-50%, -50%)' background='#fff' width='500px' display='flex' alignItems='center' boxShadow='1px 2px 17px #42414556' p='20px' borderRadius={'22px'} overflow='auto' maxHeight='80vh'>
        <Flex justify='space-between' align='center' w='100%' borderBottom={'1px solid #efefef'} pb={'10px'}>
          <Text fontSize={25}></Text>
          <Text fontSize={25}>
            <Icon as={MdClose} cursor='pointer' />
          </Text>
        </Flex>

        <Profile name="Vlad Mihalache" data={'GAME Title'} avatar={'http://192.168.1.51:5556/uploads/background/29977_1701772077260.jpg'} banner={'DASDAS'} />

        <Flex justify='end' w='100%' marginTop='15px' p='0 15px'>
          <Button
            variant='darkBrand'
            color='white'
            fontSize='sm'
            fontWeight='500'
            borderRadius='70px'
            px='24px'
            py='5px'
            onClick={playPerview}
            >
            See Preview
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default ModalComponent;
