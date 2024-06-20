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

		key: any
	}

	const [showMenu, setMenu] = useState<MenuItem[]>([]);
	const [showNewBlock, newBlockState] = useState<MenuItem[]>([]);


	useEffect(() => {

		const lastInput = rest?.items?.length > 0 ? rest?.items[rest?.items?.length - 1]?.input : null;
		console.log('lastInput', rest?.items)
	}, [rest?.items]);




	useEffect(() => {
		// const maxIdItem = rest?.items?.reduce((max: any, item: any) => (item.id > max.id ? item : max), rest?.items[0]);
		const maxIdItem = rest?.items?.reduce((max: any, item: any) => {
			const itemIdParts = item.id.split('.').map(Number); // Split and convert to numbers
			const maxIdParts = max.id.split('.').map(Number); // Split and convert to numbers

			if (itemIdParts[0] === maxIdParts[0]) {
				// If the whole part is the same, compare the decimal part
				return itemIdParts[1] > maxIdParts[1] ? item : max;
			} else {
				// If the whole part is different, compare the whole part
				return itemIdParts[0] > maxIdParts[0] ? item : max;
			}
		}, rest?.items[0]);

		// Now maxIdItem contains the object with the maximum id value
		console.log('maxIdItem', maxIdItem);
		console.log("props.seq.id", props.seq)
		// Get the maximum id value from the items array, ensuring rest?.items is not undefined or null
		const maxId = rest?.items ? Math.max(...rest?.items.map((item: any) => item.id || 0)) : 0;
		console.log("maxIdItem === props.seq.id", maxIdItem === props.seq.id)
		// Define your menu options
		const menus: Record<string, MenuItem[]> = {
			navigation: [
				{ value: 'Select Block', key: props.handleBlock },
				...(props.seq && (maxIdItem && maxIdItem.id === props.seq.id) ? [{ value: 'New Block', key: props.handleBlock }] : []),
				{ value: 'Repeat Question', key: props.setNavigation },
				{ value: 'Replay Point', key: props.setNavigation },
				{ value: 'Complete', key: props.setNavigation },
			],
			leadDialog: [
				{ value: 'Select Block', key: props.handleBlock },
				...(props.seq && (maxIdItem && maxIdItem.id === props.seq.id) ? [{ value: 'New Block', key: props.handleBlock }] : []),
				{ value: 'Repeat Question', key: props.setNavigation },
				{ value: 'Replay Point', key: props.setNavigation },
				{ value: 'Complete', key: props.setNavigation },
			],
		};

		// Use the received string to set the menu
		const selectedMenu = menus[rest.tabState] || [];

		// Update the state with the selected menu
		setMenu(selectedMenu);
	}, [rest.tabState, rest.items]);

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
				{...rest}>
				<Icon as={IoNavigate} color={iconColor} w='24px' h='24px' mt='4px' />
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
					showMenu.map((menu: any, i: any) => (

						<MenuItem
							key={i}
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
							onClick={() => menu.key(menu.value, props.id, rest.option, rest.for)}
						>
							<Flex align='center'>

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




