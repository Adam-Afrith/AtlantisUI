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

import { MdAdd, MdDelete, MdInbox, MdNote, MdNoteAdd, MdOutlineStickyNote2, MdTextsms } from 'react-icons/md';
import { TbHandClick, TbMessages } from 'react-icons/tb';
import { IoNavigate } from "react-icons/io5";
import { useState, useEffect } from 'react';
// Draft:Duplicate,Launch,Delete
// Internal: Duplicate,Assign,Make Public,Delete
// Public:Duplicate,Assign

export default function Navigation(props: { [x: string]: any }) {
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
		label: any;
		key: any
	}

	const [showMenu, setMenu] = useState<MenuItem[]>([]);

	useEffect(() => {
		// Define your menu options
		const menus: Record<string, MenuItem[]> = {

			Add: [
				{ value: 'Note', label: MdOutlineStickyNote2, key: props.NDI('Note') },
				{ value: 'Dialog', label: TbMessages, key: props.NDI('Dialog') },
				{ value: 'Interaction', label: TbHandClick, key: props.NDI('Interaction') },
			],
			Addmini: [
				{ value: 'Note', label: MdOutlineStickyNote2, key: props.NDI },
				{ value: 'Dialog', label: TbMessages, key: props.NDI },
				{ value: 'Interaction', label: TbHandClick, key: props.NDI },
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

				_hover={bgHover}
				_focus={bgFocus}
				_active={bgFocus}
				w='37px'
				h='37px'
				lineHeight='100%'
				onClick={onOpen1}
				borderRadius='10px'
				bg={props.btclour ? props.btclour : ''}
				{...rest}
			>
				<Icon as={MdAdd} color={props.iconclour} w='24px' h='24px' mt='4px' />
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
			>
				{showMenu &&
					showMenu.map((menu: any, index) => (

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
							onClick={() => menu.key}
						>
							<Flex align='center'>
								<Icon as={menu.label} h='16px' w='16px' me='8px' color={'#3311db'} />
								<Text fontSize='sm' fontWeight='400'>
									{menu.value}--{props.inc}
								</Text>
							</Flex>
						</MenuItem>
					))}
			</MenuList>
		</Menu>
	);
}
