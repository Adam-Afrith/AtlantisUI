// Chakra imports
import {
	Box, Button, Flex, Icon, Text, useColorModeValue, Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@chakra-ui/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MdCheck, MdClose, MdTimer, MdDelete } from 'react-icons/md';
import React, { useEffect, useRef, useState } from 'react';

export default function OrderStep(props: {
	quest?: any;
	data?: any;
	date?: string;
	sum?: string;
	icon: JSX.Element;
	status?: string;
	name: string;
	BlockItems?: any;
	listBlockItems?: any;
	listQuest?: any;
	[x: string]: any;
	handleGet?: any;
	fetchBlocks?: any;
	// handleTargetQuest?:any;
	handleTargetQuest?: (T: any, A: any) => void;
	id?: any;
	updateExtensiveNavigation?: (id: any) => void;
	extensiveNavigation?: number | null;
	setQuestTabState?: any;
	questTabState?: any;
	deleteQuest?: any;
	delSeq?: any;
	tabNo?: any;
}) {
	const[deleteQuestNo,setDeleteQuestNo]=useState(null)//nivetha
	const [progressBlockItems, setProgressBlockItems] = useState(null);
	const [questDelete, setQestDelete] = useState(false);
	const [QuestTabProgressDelete, setQuestTabProgressDelete] = useState<any>(false);
	const { date, sum, icon, status, name, quest, data, BlockItems, listBlockItems, listQuest, id, handleTargetQuest, handleGet, fetchBlocks, setQuestTabState, questTabState, deleteQuest, delSeq, tabNo, ...rest } = props;

	const navigate = useNavigate();

	const textColor = useColorModeValue('black', 'black');
	const iconColor = useColorModeValue('secondaryGray.600', 'white');
	const inActive = useColorModeValue('gray.50', 'white');

	useEffect(() => {
		if (BlockItems && Object.keys(BlockItems)?.length !== 0) {
			console.log('Object.values(BlockItems)',Object.values(BlockItems));
			setProgressBlockItems(Object.values(BlockItems));
		}
	}, [BlockItems]);
	
	const handleNavigation = (nid: number) => {

		if (nid) {
			setQuestTabState(nid)
			handleGet(nid);
			fetchBlocks();
		}
	}
	const handleMouseOver = (e: any) => {

		e.currentTarget.style.boxShadow = '0 0 20px rgba(128, 128, 128, 0.9)';
	};

	const handleMouseOut = (e: any) => {

		e.currentTarget.style.boxShadow = 'none';
	};

	const { isOpen, onOpen, onClose } = useDisclosure();	
	const handleDeleteClick = (item: any) => {
	
	
		setDeleteQuestNo(item.gameQuestNo)
		setQuestTabProgressDelete(false);
		onOpen();
	

};
	const handleCancelDelete = () => {
		// Close the modal without deleting
		onClose();
	};
	return (
		<>
			<Flex justifyContent='center' alignItems='center' w='100%' zIndex='2' {...rest} className='OrderStep' id={tabNo === 4 ? 'taby4' : `tab${tabNo}`} title={status}>
				{icon}
				<Flex direction='column' align='start' ms='20px' mr='auto'>
					<Text color={textColor} fontSize='lg' me='6px' fontWeight='600'>
						{name}
					</Text>
					<Text color='secondaryGray.600' fontSize='md' fontWeight='400'>
						{date}
					</Text>
				</Flex>
				{status === 'done' ? (
					<Flex
						align='center'
						justify='center'
						h='30px'
						w='30px'
						borderRadius='50%'
					>
						<Icon borderRadius={'50%'} border='1px solid' h='27px' borderColor={'green.500'} w='29px' bgColor={'transparent'} as={MdCheck} color='green.500' />
					</Flex>
				) : status === 'error' ? (
					<Flex
						align='center'
						justify='center'
						h='30px'
						w='30px'
						borderRadius='50%'
						border='2px solid'
						borderColor='red.500'>
						<Icon h='18px' w='18px' as={MdClose} color='red.500' />
					</Flex>
				) : (
					<Icon h='34px' w='34px' color={iconColor} as={MdTimer} />
				)}
			</Flex>
			{progressBlockItems && name === 'Story' ? (
				<Box className='for-tab4' id={`tab${tabNo}`}>
					{listQuest ? (
						listQuest.map((item: any, index: number) => (
							<Flex  alignItems='center'  zIndex='2' {...rest} ml={'75px'} key={index}>
								<Box>
									<Flex className='QuestList'>
										<Icon as={MdDelete} fontSize={'md'} color={'grey'} cursor={'pointer'} onClick={() => { handleDeleteClick(item) }} className='del-icon' />
										<Modal isOpen={isOpen} onClose={onClose} size="md">
											<ModalOverlay />
											<ModalContent>
												{QuestTabProgressDelete === false ?
													<><ModalHeader>
														Confirm Deletion</ModalHeader>
														<ModalBody>
															<Text color={textColor} fontSize="18px" fontWeight="600"
															>
																Are you sure you want to delete Quest {deleteQuestNo}?
															</Text>
														</ModalBody>
														<ModalFooter>
															<Button color={'#fff'}
																bg={'#11047a'}
																_hover={{ color: '#fff', bg: '#11047a' }}
																mr={'10px'} onClick={() => { deleteQuest(item.gameId, deleteQuestNo); onClose(); }} >
																Delete
															</Button>
															<Button color={'#fff'}
																bg={'#11047a'}
																_hover={{ color: '#fff', bg: '#11047a' }}
																mr={'10px'} onClick={handleCancelDelete}>Cancel</Button>
														</ModalFooter></> : <><ModalBody>
															<Text color={textColor} fontSize="18px" fontWeight="600">
																Please do not delete Quest 1. You can delete the items associated with it instead.
															</Text>
														</ModalBody>
														<ModalFooter>
															<Button color={'#fff'}
																bg={'#11047a'}
																_hover={{ color: '#fff', bg: '#11047a' }}
																mr={'10px'} onClick={() => { onClose() }}>Close</Button>
														</ModalFooter></>}
											</ModalContent>
										</Modal>
										<Text
											fontSize='md'
											me='6px'
											fontWeight='400'
											style={{
												cursor: 'pointer',
												color: textColor,
												display: 'flex',
												position: 'relative',
											}}
											borderBottom={questTabState === item.gameQuestNo ? '3px solid #422afb':'' }
											onClick={() => handleNavigation(item.gameQuestNo)}
										>
											Quest {item.gameQuestNo}
										</Text>
									</Flex>
									{Number(item.gameQuestNo) === Number(progressBlockItems[0].questNo) && progressBlockItems?.map((progressItem: any, progressIndex: number) => (
										<div
											key={progressIndex}
											style={{
												display: 'flex',
												position: 'relative',
											}}
											className='QuestSequence'
											// onMouseOver={(e) => handleMouseOver(e)}
											// onMouseOut={(e) => handleMouseOut(e)}
											onClick={(e) => handleTargetQuest(progressItem, progressIndex)}
										>
											<Icon as={MdDelete} fontSize={'sm'} color={'grey'} cursor={'pointer'}
												onClick={() => delSeq(progressItem, progressIndex, progressItem.type)}
												className='del-icon'
											/>
											<Text color={textColor} fontSize='sm' me='5px' fontWeight='400' style={{ transform: 'scale(1)' }}>
												{progressItem.id}
											</Text>
											<Text color={textColor} fontSize='sm' fontWeight='400' style={{ transform: 'scale(1)' }}>
												{progressItem.type}
											</Text>
										</div>
									))}
									{/* {Number(item.gameQuestNo) !== Number(progressBlockItems[0].questNo) && Object.entries(listBlockItems)
										.filter(([key, value]: [string, any]) => value.questNo === item.gameQuestNo)
										.map(([key, value]: [string, any], i: number) => (
											<Text key={i} fontSize='sm' me='6px' ml={'40px'} fontWeight='400' style={{ color: inActive }}>
												{value.id} {value.type}
											</Text>
										))} */}
								</Box>
							</Flex>
						))
					) : (
						<Box>
							{progressBlockItems?.map((progressItem: any, progressIndex: number) => (
								<Text key={progressIndex} color={textColor} fontSize='sm' me='6px' fontWeight='400'>
									{progressItem.id} {progressItem.type}
								</Text>
							))}
						</Box>
					)}
				</Box>
			) : ''}

		</>
	);
}