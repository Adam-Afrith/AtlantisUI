/* eslint-disable */

import {
	Box,
	Checkbox,
	Flex,
	Modal,
	Input,
	Button,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Progress,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	TagLabel,
	Tag,
	TagCloseButton,
	Tr,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { AndroidLogo, AppleLogo, WindowsLogo } from 'components/icons/Icons';
import * as React from 'react';
import TextField from 'components/fields/TextField';
import { useParams } from 'react-router-dom';
import { addReviewers } from 'utils/reviews/reviews';

// Assets

type RowObj = {
	name: [string, boolean];
	progress: string;
	quantity: number;
	date: string;
	info: boolean;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function ShareReviewTable(props: {
	tableData: any;
	onOpen: any;
	onClose: any;
	isOpen: any;
}) {
	const { tableData, onOpen, onClose, isOpen } = props;
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const iconColor = useColorModeValue('secondaryGray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	let defaultData = tableData;
	const columns = [
		columnHelper.accessor('name', {
			id: 'name',
			header: () => (
				<Text
					justifyContent="space-between"
					align="center"
					fontSize={{ sm: '10px', lg: '12px' }}
					color="gray.400"
				>
					NAME
				</Text>
			),
			cell: (info: any) => (
				<Flex align="center">
					<Checkbox
						isChecked={info.getValue()[1]}
						colorScheme="brandScheme"
						me="10px"
					/>
					<Text color={textColor} fontSize="sm" fontWeight="700">
						{info.getValue()[0]}
					</Text>
				</Flex>
			),
		}),
		// columnHelper.accessor('progress', { 
		// 	id: 'progress',
		// 	header: () => (
		// 		<Text
		// 			justifyContent='space-between'
		// 			align='center'
		// 			fontSize={{ sm: '10px', lg: '12px' }}
		// 			color='gray.400'>
		// 		   Company Name
		// 		</Text>
		// 	),
		// 	cell: (info) => (
		// 		<Text color={textColor} fontSize='sm' fontWeight='700'>
		// 			{info.getValue()}
		// 		</Text>
		// 	)
		// }),
		// columnHelper.accessor('quantity', {
		// 	id: 'quantity',
		// 	header: () => (
		// 		<Text
		// 			justifyContent='space-between'
		// 			align='center'
		// 			fontSize={{ sm: '10px', lg: '12px' }}
		// 			color='gray.400'>
		// 			QUANTITY
		// 		</Text>
		// 	),
		// 	cell: (info) => (
		// 		<Text color={textColor} fontSize='sm' fontWeight='700'>
		// 			{info.getValue()}
		// 		</Text>
		// 	)
		// }),
		// columnHelper.accessor('date', {
		// 	id: 'date',
		// 	header: () => (
		// 		<Text
		// 			justifyContent='space-between'
		// 			align='center'
		// 			fontSize={{ sm: '10px', lg: '12px' }}
		// 			color='gray.400'>
		// 			DATE
		// 		</Text>
		// 	),
		// 	cell: (info) => (
		// 		<Text color={textColor} fontSize='sm' fontWeight='700'>
		// 			{info.getValue()}
		// 		</Text>
		// 	)
		// })
	];
	const [data, setData] = React.useState(() => [...defaultData]);
	const [tags, setTags] = React.useState<string[]>([]);
	const [formData, setFormData] = React.useState({
		creatorIds: [],
		emailIds: [],
		activeStatus: 'YES',
		gameId: null,
	});
	const { id } = useParams();

	const toast = useToast();
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
	});

	const keyPressSkill = (e: any) => {
		if (e.key === 'Enter') {
			e.preventDefault(); // Prevent the default newline behavior

			const trimmedValue = e.target.value.trim();

			if (trimmedValue !== '') {
				console.log('Adding tag:', trimmedValue);
				setTags((prevTags) => [...prevTags, trimmedValue]);
			}

			e.target.value = '';
		}
	};

	let lightBlue = useColorModeValue('#3311db5c', '#3311db5c');

	const submitEmails = async () => {
		let invalidEmailFound = false;
		if (tags.length === 0) {
			toast({
				title: 'Please type and press Enter',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return false;
		}
		tags.forEach((item, ind) => {
			const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
			const test = item.match(emailRegex);
			if (!test) {
				invalidEmailFound = true;
			}
		});
		if (invalidEmailFound) {
			toast({
				title: 'Please Enter Valid Email Id',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} else {
			const mails: {
				data: {
					creatorIds: string[];
					emailIds: string[];
					activeStatus: string;
					gameId: string | null;
				};
			} = {
				data: {
					creatorIds: [],
					emailIds: tags,
					activeStatus: 'YES',
					gameId: id,
				},
			}
			const data = JSON.stringify(mails);
			const res = await addReviewers(data);
			if (res && res.status === 'Success') {
				toast({
					title: 'Review Assigned',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				onClose();
			} else {
				toast({
					title: res?.message || 'email not sent',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		}
	};
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalBody
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
				>
					{/* <Box w={'100%'} ></Box> */}
					<Box width={'100%'} h={'100%'}>
						<Flex
							px="2px"
							mb="1px"
							justifyContent="space-between"
							align="center"
						>
							<Box>
								<Text
									color={textColor}
									fontSize="20px"
									mb="3px"
									fontWeight="500"
									lineHeight="250%"
									textAlign="center"
								>
									Share Review
								</Text>
								<Text
									color={'grey'}
									fontSize={'12px'}
									//   fontWeight="300"
									//   lineHeight="250%"
									//   textAlign="center"
									mb="3px"
								>
									You can invite your team members to review your game and share their feedback. To inivte them,Please type their Email id's below and press enter after each email id:
								</Text>
							</Box>


							<ModalCloseButton
								color={'black'}
								onClick={onClose}
								cursor={'pointer'}
								zIndex={9999999}
							/>
						</Flex>
						<Flex
							align="center"
							justify="space-between"
							mt="1"
							style={{ marginRight: '19px' }}
						>
							<Box width="400px" h={'300px'} overflowY={'scroll'}>
								<Flex
									direction="row"
									p="10px"
									wrap="wrap"
									bg="transparent"
									border="1px solid"
									borderColor={borderColor}
									borderRadius="16px"
									_focus={{ borderColor: 'teal.300' }}
									h="stretch"
									cursor="text"
									style={{ overflowY: 'auto' }}
								>
									{tags.map((tag, index) => (
										<Tag
											key={index}
											fontSize="xs"
											h="25px"
											mb="6px"
											me="6px"
											borderRadius="12px"
											variant="solid"
											bg={lightBlue}
										>
											<TagLabel w="200%" color={textColor}>
												{tag}
											</TagLabel>
											<TagCloseButton
												justifySelf="flex-end"
												color="black"
												onClick={() => {
													setTags((prevTags) =>
														prevTags.filter((t: any) => t !== tag),
													);
												}}
											/>
										</Tag>
									))}
									<TextField
										resize="none"
										variant="main"
										bg="transparent"
										border="none"
										p="0px"
										onKeyDown={(e: any) => keyPressSkill(e)}
										fontSize="md"
										width={'200%'}
									// height={'150px'}
									/>
								</Flex>
							</Box>
						</Flex>
						<Box w={'100%'} display={'flex'} justifyContent={'flex-end'}>
							<Button
								bg="#11047a"
								_hover={{ bg: '#190793' }}
								color="#fff"
								h={'46px'}
								w={'128px'}
								mr={'17px'}
								mt={'16px'}
								ml={'11px'}
								mb={'16px'}
								onClick={submitEmails}
							>
								Send
							</Button>
						</Box>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
