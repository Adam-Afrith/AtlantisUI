import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Img,
  SimpleGrid,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Grid,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { MdCheck, MdClose, MdTimer, MdDelete } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
interface PropsNote {
  listQuest?: any;
  handleGet?: any;
  fetchBlocks?: any;
  questTabState?: any;
  setQuestTabState?: any;
  deleteQuest?: any;
}

const QuestTab: React.FC<PropsNote> = ({
  listQuest,
  handleGet,
  fetchBlocks,
  questTabState,
  setQuestTabState,
  deleteQuest,
}) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuestNo, setSelectedQuestNo] = useState<number | null>(null); // Initialize as null
  const [deletequestgameId, setDeleteQuestGameId] = useState<number | null>(null); // Initialize as null
  const [QuestTabStateDelete, setQuestTabStateDelete] = useState<any>(false);
  const handleNavigation = (nid: number) => {
    if (nid) {
      setQuestTabState(nid);
      handleGet(nid);
      fetchBlocks();
    }
  };
  const handleDeleteClick = (item: any) => {

    setQuestTabStateDelete(false)
    setSelectedQuestNo(item.gameQuestNo); // Set the selected quest number
    setDeleteQuestGameId(item.gameId);
    console.log("selectedQuestNo", item.gameQuestNo, item.gameId)
    onOpen();

  };

  const handleCancelDelete = () => {
    // Close the modal without deleting
    setSelectedQuestNo(null); // Set the selected quest number
    setDeleteQuestGameId(null);
    onClose();
  };

  return (
    <>
      <Tabs variant='soft-rounded' colorScheme='brandTabs'>
        <TabList mx={{ base: '0px', lg: '10px' }} overflowX={{ sm: 'scroll', lg: 'unset' }}>
          <Flex>
            {listQuest ? (listQuest.map((item: any, index: number) => (
              <Tab
                // onClick={function () {
                //   setTabState('Review');
                // }}
                onClick={() => handleNavigation(item.gameQuestNo)}
                pb='0px'
                pl={'10px'}
                paddingInline={0}
                me='40px'
                bg='unset'
                _selected={{
                  bg: 'none'
                }}
                _focus={{ border: 'none' }}
                minW='max-content'
                flexDirection='column'>
                <Flex align='center'>
                  <Text color={textColor} fontSize='lg' fontWeight='500' me='12px'>
                    Quest {item.gameQuestNo}
                  </Text>
                  {/* indu modified on 06-02-2024 for ask confirmation for delete */}
                  <Icon as={MdDelete} fontSize={'md'} color={'grey'} cursor={'pointer'} onClick={() => handleDeleteClick(item)} />

                  {/* Confirmation Modal */}
                  <Modal isOpen={isOpen} onClose={onClose} size="md">
                    <ModalOverlay />
                    <ModalContent>
                      {(QuestTabStateDelete === false) ?
                        <><ModalHeader>
                          Confirm Deletion</ModalHeader>
                          <ModalBody>
                            <Text color={textColor} fontSize="18px" fontWeight="600"
                            >

                              Are you sure you want to delete Quest {selectedQuestNo} ?
                            </Text>

                          </ModalBody>
                          <ModalFooter>
                            <Button color={'#fff'}
                              bg={'#11047a'}
                              _hover={{ color: '#fff', bg: '#11047a' }}
                              mr={'10px'} onClick={() => { deleteQuest(deletequestgameId, selectedQuestNo); onClose(); }} >
                              Delete
                            </Button>
                            <Button color={'#fff'}
                              bg={'#11047a'}
                              _hover={{ color: '#fff', bg: '#11047a' }}
                              mr={'10px'} onClick={handleCancelDelete}>Cancel</Button>
                          </ModalFooter></>
                        : <>
                          <ModalBody>
                            <Text color={textColor} fontSize="18px" fontWeight="600">

                              Please do not delete Quest {selectedQuestNo ?? 1}. You can delete the items associated with it instead.
                            </Text>

                          </ModalBody>
                          <ModalFooter>
                            <Button color={'#fff'}
                              bg={'#11047a'}
                              _hover={{ color: '#fff', bg: '#11047a' }}
                              mr={'10px'} onClick={() => { onClose() }}>Okey</Button>
                          </ModalFooter></>
                      }
                    </ModalContent>
                  </Modal>
                </Flex>
                <Box
                  height='4px'
                  w='100%'
                  transition='0.1s linear'
                  bg={questTabState === item.gameQuestNo ? 'brand.500' : 'transparent'}
                  mt='15px'
                  borderRadius='30px'
                />
              </Tab>
            ))) : (null)}

          </Flex>
        </TabList>
        {/* <TabPanels>
						<TabPanel px='0px'>{panelExample}</TabPanel>
						<TabPanel px='0px'>{panelExample}</TabPanel>
						<TabPanel px='0px'>{panelExample}</TabPanel>
					</TabPanels> */}
      </Tabs>
    </>
  );
};

export default QuestTab;
