import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
// import { useRef } from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  Icon,
  List,
  ListItem,
  Img,
  Textarea,
  Input,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import Select from 'react-select';
import {
  MdAdd,
  MdCloudUpload,
  MdInbox,
  MdNote,
  MdNoteAdd,
  MdTextsms,
  MdDelete,
  MdOutlineStickyNote2,
} from 'react-icons/md';
import { BiSolidDuplicate } from 'react-icons/bi';
import Menu from '../components/Navigate';
import TextField from 'components/fields/TextField';
import InputField from 'components/fields/InputField';
import StrightConector from '../components/dragNdrop/strightConector';
// import { useTranslation } from 'react-i18next';
// import i18n from 'translate';
import { getBlockData } from 'utils/game/gameService';
import { TbHandClick, TbMessages } from 'react-icons/tb';

interface PropsNote {
  reviews?: any;
  id?: number;
  language?: any;
  seq?: any;
  index?: number;
  handleNDI?: any;
  name?: any;
  handleInput?: any;
  input?: any;
  getSeq?: any;
  handleMiniNDI?: any;
  duplicateSeq?: any;
  delSeq?: any;
  alphabet?: any;
  setNavigation: any;
  handleBlock: any;
  items?: any;
  formDataGamelanguageCode?: any;
  handleSelectBlock?: any;
  showSelectBlock?: any;
  setSelectBlock?: any;
  validation?: any;
  currentseq?: any;
  ShowReview?: any;
  targetSequence?: any;
  blockOnFocusHanlder:any;
  blockOnBlurHanlder:any;
}
interface Block {
  blockPrimarySequence: string;
  // Add other properties as needed
  content: string | undefined; // Adjust the type according to your data structure
}
const NoteCompo: React.FC<PropsNote> = ({
  targetSequence,
  id,
  language,
  seq,
  index,
  name,
  handleInput,
  input,
  getSeq,
  duplicateSeq,
  delSeq,
  alphabet,
  setNavigation,
  handleBlock,
  handleSelectBlock,
  items,
  formDataGamelanguageCode,
  showSelectBlock,
  handleNDI,
  handleMiniNDI,
  setSelectBlock,
  validation,
  currentseq,
  reviews,
  ShowReview,
  blockOnFocusHanlder,
  blockOnBlurHanlder,
}) => {
  const textareaRef = useRef(null);
  const [blockData, setBlockData] = useState<Block[]>([]);
  const [matchingBlockContent, setMatchingBlockContent] = useState('');

  useEffect(() => {
    // Assume you have a function to get the translation ID dynamicallyz
    const getTranslationId = () => {
      // Use formDataGamelanguageCode as the dynamic translation ID
      return formDataGamelanguageCode;
    };
    const fetchData = async () => {
      try {
        // Call getBlockData with both game ID and translation ID
        const fetchedBlockData = await getBlockData(
          id,
          formDataGamelanguageCode,
        );

        // Find the block with matching blockPrimarySequence and seq.id
        const matchingBlock = fetchedBlockData.data.blockData.find(
          (block: any) => block.blockPrimarySequence === seq.id,
        );

        // Update the state variable with the matching block content
        if (matchingBlock) {
          setMatchingBlockContent(matchingBlock.content);
        }

        // Set the block data in the state
        // setBlockData(updatedBlockData);
      } catch (error) {
        console.error('getBlockData Error:', error);
      }
    };

    fetchData();
  }, [formDataGamelanguageCode, id, seq.id]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input?.[`Note${seq.input}`]?.note]);

  const customButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '15px',
    borderColor: '#ccc', // Optional: Change border color for disabled state
    borderWidth: '1px', // Add this line to set the border width
    borderStyle: 'solid', // Add this line to set the border style
    cursor: 'not-allowed', // Optional: Change cursor for disabled state
    padding: '5px 10px',
    width: '144px',
    // textAlign: "left",
    outerWidth: '10px',
    outline: 'none',
  };

  const customStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '15px',
      borderColor: 'inherit',
      background: 'transparent',
      // height: '45px',
      width: '130px',
      padding: '0 !important',
    }),
  };

  const handleMiniNDInewblock = (value?: any, seq?: any, i?: any) => {
    handleNDI(value);
    if (value !== '') {
      handleSelectBlock(
        { value: currentseq },
        currentseq,
        `Note${seq.input}`,
        `Note${seq.input}`,
      );
    }
  };
  const MiniBox1 = (props: {
    seq?: any;
    i?: number;
    name?: any;
    bodyRef?: any;
  }) => {
    const { seq, i, name, bodyRef } = props;
    return (
      <Box
        position={'absolute'}
        background={'#fff'}
        p={'10px'}
        boxShadow={'1px 1px 17px #69627914'}
        borderRadius={'8px'}
        zIndex={99}
        className="MiniShowBox"
      >
        <List cursor={'pointer'}>
          <ListItem
            onClick={() => handleMiniNDInewblock('Note', seq, i)}
            p={'10px'}
            display={'flex'}
            alignItems={'center'}
            borderBottom={'2px solid #f1f1f170'}
          >
            <Icon as={MdOutlineStickyNote2} mr={'10px'} color={'#3311db'} />
            Note
          </ListItem>
          <ListItem
            onClick={() => handleMiniNDInewblock('Dialog', seq, i)}
            p={'10px'}
            display={'flex'}
            alignItems={'center'}
            borderBottom={'2px solid #f1f1f170'}
          >
            <Icon as={TbMessages} mr={'10px'} color={'#3311db'} />
            Dialog
          </ListItem>
          <ListItem
            onClick={() => handleMiniNDInewblock('Interaction', seq, i)}
            p={'10px'}
            display={'flex'}
            alignItems={'center'}
          >
            <Icon as={TbHandClick} mr={'10px'} color={'#3311db'} />
            Interaction
          </ListItem>
        </List>
      </Box>
    );
  };

  // const optionsnewblock = [
  //   { value: 'Note', label: 'Note' },
  //   { value: 'Dialog', label: 'Dialog' },
  //   { value: 'Interaction', label: 'Interaction' },
  // ];
  let focusSeqRef: any;
  const justClick = (event: any, seq: any) => {
    if (event.type === 'click') {
      focusSeqRef = document.getElementsByClassName(seq.id);
      const element = focusSeqRef?.[0];

      if (element) {
        element.classList.remove('non-caret');
        element.removeAttribute('readonly');
        element.focus();
      }
    }
  };

  return (
    <Flex
      // className="block-compo"
      // mb={'20px'}
      padding={'10px 0'}
      alignItems={'start'}
      overflowY={'hidden'}
    >
      <Box className="block-action-icons">
        <Tooltip hasArrow label="Choose New Block">
          <div>
            <Icon
              as={MdAdd}
              transitionDelay={'0s !important'}
              fontSize={'18px'}
              color={'grey'}
              mr={'10px'}
              cursor={'pointer'}
              onClick={() => getSeq(seq, index, name)}
            />
          </div>
        </Tooltip>
        <Tooltip hasArrow label="Duplicate">
          <div>
            <Icon
              as={BiSolidDuplicate}
              transitionDelay={'0.1s !important'}
              fontSize={'18px'}
              color={'grey'}
              mr={'10px'}
              cursor={'pointer'}
              onClick={() => duplicateSeq(seq, index, name)}
            />
          </div>
        </Tooltip>
        <Tooltip hasArrow label="Delete Note">
          <div>
            <Icon
              as={MdDelete}
              transitionDelay={'0.2s !important'}
              fontSize={'18px'}
              color={'grey'}
              cursor={'pointer'}
              onClick={() => delSeq(seq, index, name)}
            />
          </div>
        </Tooltip>
      </Box>
      <Box
        className="block-id"
        mr={'10px'}
        w={'50px'}
        fontSize={'17px'}
        color={'#1b2559'}
        fontWeight={'700'}
      >
        {seq.id}
      </Box>
      <Box className="box-block" w={{ base: '100%', lg: 'auto' }} flexDirection={{ base: 'column', lg: 'row' }} display={'flex'} alignItems={'center'}>
        <Box className="block-character-name" mr={'10px'} mb={{ base: '10px', lg: '0px' }} w={{ base: '100%', lg: '150px' }}>
          <button style={customButtonStyles} disabled={true} onClick={() => { }}>
            <span style={{ textAlign: 'left' }}>Narrator</span>
          </button>
        </Box>
        <Box className="block-input-text" mr={'10px'} mb={{ base: '10px', lg: '0px' }} w={{ base: '100%', lg: '400px' }}>
          <Textarea
            ref={textareaRef}
            placeholder="Note"
            id="Note"
            className={`${seq.id}`}
            name={`Note${seq.input}`}
            onChange={handleInput}
            onFocus={(e:any) => blockOnFocusHanlder(e,seq)}
            onBlur={(e:any) => blockOnBlurHanlder(e,seq)}

            onClick={(e) => justClick(e, seq)}
            value={
              formDataGamelanguageCode
                ? matchingBlockContent
                : input?.[`Note${seq.input}`]?.note
            }
            isRequired={true}
            minHeight="65px"
            height={
              seq?.id === targetSequence?.id ? 'auto' : '65px !important'
            }
            borderRadius={'18px'}
            style={{
              overflow: 'hidden',
              border: validation?.[`Note${seq.input}`] && '2px solid red',
            }}
            overflow="auto" // Allow vertical scrolling
            _focusVisible={{
              borderColor: '#0000',
              border: '1px solid #e5e5e5',
              boxShadow: 'unset',
            }}
            tabIndex={0}
            readOnly={true}
          />
        </Box>
        <Box className="navigation-icon" h={'100%'} display={'flex'} alignItems={'center'} mr={'40px'} width={'auto'}>
          <Flex>
            <Box>
              <Tooltip hasArrow label="Add Navigations">
                <div>
                  <Menu
                    tabState={'leadDialog'}
                    id={seq.input}
                    for={`Note${seq.input}`}
                    setNavigation={setNavigation}
                    handleBlock={handleBlock}
                    items={items}
                    seq={seq}
                  />
                </div>
              </Tooltip>
            </Box>
            <Box
              ml={'4px'}
              cursor={'pointer'}
              display={
                input?.[`Note${seq.input}`]?.NoteleadShow ? 'block' : 'none'
              }
              zIndex={9999}
            >
              {input?.[`Note${seq.input}`]?.NoteleadShow === 'New Block' &&
                !input?.[`Note${seq.input}`]?.Notenavigate ? (
                // Render content for New Block
                <>
                  <MiniBox1 seq={seq} i={index} />
                </>
              ) : input?.[`Note${seq.input}`]?.NoteleadShow === 'Select Block' &&
                !input?.[`Note${seq.input}`]?.Notenavigate ? (
                // Render select tag for Select Block
                <Select
                  placeholder={'Blocks...'}
                  id="Dialog"
                  name={`Note${seq.input}`}
                  menuPortalTarget={document.body}
                  styles={customStyles}
                  options={showSelectBlock.filter(
                    (option: any) => option.value !== seq.input,
                  )}
                  isSearchable={true}
                  className="react-select"
                  value={
                    showSelectBlock.find(
                      (option: any) =>
                        option.value ===
                        parseInt(input?.[`Note${seq.input}`]?.Notenavigate, 10),
                    ) || null
                  }
                  onChange={(e: any) =>
                    handleSelectBlock(
                      e,
                      seq.input,
                      `Note${seq.input}`,
                      `Note${seq.input}`,
                    )
                  }
                />
              ) : (
                // Render content for the 'else' condition
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StrightConector
                      name={
                        input?.[`Note${seq.input}`]?.NoteleadShow === 'New Block'
                          ? showSelectBlock.find(
                            (option: any) =>
                              option.value ===
                              input?.[`Note${seq.input}`]?.Notenavigate,
                          )?.label !== undefined
                            ? showSelectBlock.find(
                              (option: any) =>
                                option.value ===
                                input?.[`Note${seq.input}`]?.Notenavigate,
                            )?.label
                            : `${(parseFloat(seq.id) + 0.1).toFixed(1)}`
                          : input?.[`Note${seq.input}`]?.NoteleadShow ===
                            'Select Block'
                            ? showSelectBlock.find(
                              (option: any) =>
                                option.value ==
                                input?.[`Note${seq.input}`]?.Notenavigate,
                            )?.label
                            : input?.[`Note${seq.input}`]?.Notenavigate
                      }
                    />
                  </div>
                </>
              )}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default NoteCompo;
