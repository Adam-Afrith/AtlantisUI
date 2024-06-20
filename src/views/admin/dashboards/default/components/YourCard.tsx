import React, { useState } from 'react';

// Chakra imports
import {
  Flex,
  Box,
  Button,
  IconButton,
  Icon,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';

// Custom components
import Card from 'components/card/Card';
import Mastercard from 'components/card/Mastercard';
import Transaction from 'components/dataDisplay/Transaction';

// Assets
import {
  MdOutlineShoppingBasket,
  MdAddCircle,
  MdOutlineDirectionsBus,
  MdOutlineSubscriptions,
  MdLocalBar,
  MdOutlineWeekend,
  MdCached,
  MdAdd,
  MdAttachMoney,
  MdMoreHoriz,
} from 'react-icons/md';
import { RiNetflixFill } from 'react-icons/ri';

export default function YourCard(props: { [x: string]: any }) {
  const { ...rest } = props;

  let [tabState, setTabState] = useState('card1');

  // Chakra Color Mode
  const iconColor = useColorModeValue('brand.500', 'white');
  const greenIcon = useColorModeValue('green.500', 'white');
  const redIcon = useColorModeValue('red.500', 'white');
  const blueIcon = useColorModeValue('blue.500', 'white');
  const yellowIcon = useColorModeValue('yellow.500', 'white');
  const bgIconButton = useColorModeValue('white', 'whiteAlpha.100');
  const bgIconHover = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.50' },
  );
  const bgIconFocus = useColorModeValue(
    { bg: 'grey.100' },
    { bg: 'whiteAlpha.100' },
  );
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const bgHover = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.50' },
  );
  const bgFocus = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.100' },
  );
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const shadow = useColorModeValue(
    '18px 17px 40px 4px rgba(112, 144, 176, 0.1)',
    'unset',
  );
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Card {...rest}>
      <Flex justify="space-between" px="10px" pt="5px" mb="25px" align="center">
        <Text
          color={textColor}
          fontSize="lg"
          fontWeight="700"
          lineHeight="100%"
        >
          Your Plans
        </Text>
        <Button
          alignItems="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w="37px"
          h="37px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdAddCircle} color={iconColor} w="24px" h="24px" />
        </Button>
      </Flex>
     
    
    
     
      <Transaction
        mb="26px"
        name="Gold Plan"
        date="22 days"
        sum="-$15.50"
        icon={
          <Icon
            as={MdAdd}
            color={yellowIcon}
            w="20px"
            h="18px"
          />
        }
      />
       <Transaction
        mb="26px"
        name="Gold Plan"
        date="366 hours"
        sum="-$15.50"
        icon={
          <Icon
            as={MdAdd}
            color={yellowIcon}
            w="20px"
            h="18px"
          />
        }
      />
       <Transaction
        mb="26px"
        name="Silver Plan"
        date="41 days"
        sum="-$15.50"
        icon={
          <Icon
            as={MdAdd}
            color={yellowIcon}
            w="20px"
            h="18px"
          />
        }
      />
       <Transaction
        mb="26px"
        name="Silver Plan"
        date="400 hours"
        sum="-$15.50"
        icon={
          <Icon
            as={MdAdd}
            color={yellowIcon}
            w="20px"
            h="18px"
          />
        }
      />
       <Transaction
        mb="26px"
        name="Silver Plan"
        date="22 months"
        sum="-$15.50"
        icon={
          <Icon
            as={MdAdd}
            color={yellowIcon}
            w="20px"
            h="18px"
          />
        }
      />
       <Transaction
        mb="26px"
        name="Platinum Plan"
        date="52 days"
        sum="-$15.50"
        icon={
          <Icon
            as={MdAdd}
            color={yellowIcon}
            w="20px"
            h="18px"
          />
        }
      />
       <Transaction
        mb="26px"
        name="Platinum Plan"
        date="223 hours"
        sum="-$15.50"
        icon={
          <Icon
            as={MdAdd}
            color={yellowIcon}
            w="20px"
            h="18px"
          />
        }
      />
    </Card>
  );
}
