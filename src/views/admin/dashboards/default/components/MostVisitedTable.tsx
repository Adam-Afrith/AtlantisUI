// Chakra imports
import {
	Flex,
	Image,
	Icon,
	Text,
	useColorModeValue,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
  } from '@chakra-ui/react';
  
  // Custom components
  import Transaction from 'components/dataDisplay/Transaction';
  import Card from 'components/card/Card';
  
  // Assets
  import balanceImg from 'assets/img/dashboards/balanceImg.png';
  import fakeGraph from 'assets/img/dashboards/fakeGraph.png';
  import {
	MdOutlineMoreHoriz,
	MdDomain,
	MdElectricCar,
	MdSchool,
  } from 'react-icons/md';
  // Assets
  import {
	MdOutlinePerson,
	MdOutlineCardTravel,
	MdOutlineLightbulb,
	MdOutlineSettings,
  } from 'react-icons/md';
  
  export default function MostVisitedTable(props: { [x: string]: any, count:number}) {
	const { ...rest } = props;
	// Ellipsis modals
	const {
	  isOpen: isOpen1,
	  onOpen: onOpen1,
	  onClose: onClose1,
	} = useDisclosure();
  
	// Chakra Color Mode
	const blueIcon = useColorModeValue('blue.500', 'white');
	const greenIcon = useColorModeValue('green.500', 'white');
	const yellowIcon = useColorModeValue('yellow.500', 'white');
	const balanceBg = useColorModeValue('brand.900', '#1B254B');
	const textColor = useColorModeValue('secondaryGray.500', 'white');
	const textHover = useColorModeValue(
	  { color: 'secondaryGray.900', bg: 'unset' },
	  { color: 'secondaryGray.500', bg: 'unset' },
	);
	const bgList = useColorModeValue('white', 'whiteAlpha.100');
	const bgShadow = useColorModeValue(
	  '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
	  'unset',
	);
	return (
	  <Card flexDirection="column" w="100%" {...rest}>
		<Flex
		  justify="space-between"
		  p="20px"
		  mb="20px"
		  borderRadius="16px"
		  bgColor={balanceBg}
		  bgImage={balanceImg}
		  bgPosition="right"
		  bgSize="cover"
		>
		  <Flex align="center" justify="space-between" w="100%">
			<Flex flexDirection="column" me="20px">
			  <Text color="white" fontSize="sm" fontWeight="500">
				Total Games
			  </Text>
			  <Text
				color="white"
				fontSize="34px"
				fontWeight="700"
				lineHeight="100%"
			  >
				{rest.count}
			  </Text>
			</Flex>
			<Flex
			  flexDirection="column"
			  ms="auto"
			  justify="space-between"
			  align="flex-end"
			>
			 
			</Flex>
		  </Flex>
		</Flex>
	
		
	  </Card>
	);
  }
  