// Chakra imports
import {
	Icon,
	Flex,
	Text,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
	useColorModeValue
} from '@chakra-ui/react';
// Assets
import {
	MdOutlineMoreHoriz,
	MdOutlinePerson,
    MdContentCopy,
    MdLaunch,
    MdDelete,
   MdPublic,
	MdOutlineCardTravel,
	MdOutlineLightbulb,
	MdOutlineSettings

} from 'react-icons/md';
import { LiaFileDownloadSolid } from "react-icons/lia";
import { useState,useEffect } from 'react';
// Draft:Duplicate,Launch,Delete
// Internal: Duplicate,Assign,Make Public,Delete
// Public:Duplicate,Assign

export default function Banner(props: { [x: string]: any }) {
	const { ...rest } = props;

	const textColor = useColorModeValue('secondaryGray.500', 'white');
	const textHover = useColorModeValue(
		{ color: 'secondaryGray.900', bg: 'unset' },
		{ color: 'secondaryGray.500', bg: 'unset' }
	);
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgList = useColorModeValue('white', 'whiteAlpha.100');
	const bgShadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });
// ...
 
interface MenuItem {
	value: string;
	label: React.ElementType;
	key:any
  }
  
  const [showMenu, setMenu] = useState<MenuItem[]>([]);
  
  useEffect(() => {
	// Define your menu options
	const menus: Record<string, MenuItem[]> = {
	  Creation: [
		{ value: 'Duplicate', label: MdContentCopy , key: props.handelDuplicate },
		{ value: 'Launch', label: MdLaunch ,key: props.handelLaunch },
		{ value: 'Delete', label: MdDelete ,key: props.handelDelete }
	  ],
	  Review: [
		{ value: 'Duplicate', label: MdContentCopy,key: props.handelDuplicate },
		{ value: 'Assign', label: MdOutlinePerson ,key: props.handelAssign },
		{ value: 'Make Public', label: MdPublic ,key: props.handelMakePublic },
		{ value: 'Delete', label: MdDelete , key: props.handelDelete },
		{ value: 'Download', label: LiaFileDownloadSolid , key: props.handleDownload }
	  ],
	  Launched: [
		{ value: 'Duplicate', label: MdContentCopy ,key: props.handelDuplicate },
		{ value: 'Assign', label: MdOutlinePerson ,key: props.handelAssign }
	  ],
	  All: [
		
		{ value: 'Assign', label: MdOutlinePerson ,key: props.handelAssign  }
	  ]
	};
	
	// Use the received string to set the menu
	const selectedMenu = menus[rest.tabState] || [];
  
	// Update the state with the selected menu
	setMenu(selectedMenu);
  }, [rest.tabState]);
  
  // ...
  

	
	const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

	return (
		<Menu isOpen={isOpen1} onClose={onClose1}>
			<MenuButton
				alignItems='center'
				justifyContent='center'
				bg={bgButton}
				_hover={bgHover}
				_focus={bgFocus}
				_active={bgFocus}
				w='37px'
				h='37px'
				lineHeight='100%'
				onClick={onOpen1}
				borderRadius='10px'
				{...rest}>
				<Icon as={MdOutlineMoreHoriz} color={iconColor} w='24px' h='24px' mt='4px' />
			</MenuButton>
			<MenuList
				w='150px'
				minW='unset'
				maxW='150px !important'
				border='transparent'
				backdropFilter='blur(63px)'
				
				boxShadow={bgShadow}
				borderRadius='20px'
                position='absolute'
				p='15px'
                zIndex='1000' // Set a higher z-index value
				right='-28px'
				top='-3px'
                >
 {showMenu &&
            showMenu.map((menu:any, index: number) => (

				<MenuItem
					transition='0.2s linear'
					color={textColor}
					_hover={textHover}
					p='0px'
					borderRadius='8px'
					_active={{
						bg: 'transparent'
					}}
					_focus={{
						bg: 'transparent'
					}}
					mb='10px'
					onClick={() => menu.key(props.id)}
					key={index}
					>
					<Flex align='center'>
						<Icon as={menu.label} h='16px' w='16px' me='8px' />
						<Text fontSize='sm' fontWeight='400'>
							{menu.value}
						</Text>
					</Flex>
				</MenuItem>
				 ))}
			</MenuList>
		</Menu>
	);
}
