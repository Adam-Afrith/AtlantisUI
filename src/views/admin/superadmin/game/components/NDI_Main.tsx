import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Card from 'components/card/Card';
import {
  Box,
  Text,
  Flex,
  Button,
  Icon,
  List,
  ListItem,
  Img,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useColorModeValue, 
  Tooltip,
  ScaleFade,
} from '@chakra-ui/react';
import {
  MdAdd,
  MdDelete,
  MdInbox,
  MdNote,
  MdNoteAdd,
  MdOutlineStickyNote2,
  MdTextsms,
} from 'react-icons/md';
import { AiFillInteraction, AiOutlineInteraction } from 'react-icons/ai';
import { CgNotes } from 'react-icons/cg';
import OnToast from 'components/alerts/toast';
import { Draggable } from 'react-beautiful-dnd';
import CustomAccordion from './dragNdrop/CustomAccordion';
import NoteCompo from '../blocksCompo/NoteCompo';
import DialogCompo from '../blocksCompo/DialogCompo';
import InteractionCompo from '../blocksCompo/InteractionCompo';
import Avatar11 from 'assets/img/avatars/avatar11.png';
import Avatar1 from 'assets/img/avatars/avatar1.png';
import Avatar2 from 'assets/img/avatars/avatar2.png';
import Avatar3 from 'assets/img/avatars/avatar3.png';
import { TbHandClick, TbMessages } from 'react-icons/tb';
import pro from 'assets/img/crm/pro.png';
import { setStory, storyEngAudio, StoryInteractionAudio, storyModGameContentLang,BlockModifiedLog} from 'utils/game/gameService';
import NDITabs from './dragNdrop/QuestTab';
import ChatButton from './ChatButton';
import { addReadStatus } from 'utils/reviews/reviews';
import { updatePreviewData, onFocusField,onBlurField } from '../../../../../store/preview/previewSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit'; // Import Dispatch type from @reduxjs/toolkit
import { RootState } from 'store/reducers';
interface NDIMainProps {
  handleShowComponent?: (componentName: string) => void;
  id?: any;
  formData: any;
  setBlockItems: any;
  serias: any;
  setserias: any;
  setInput?: any;
  input?: any;
  setItems?: any;
  items?: any;
  alphabet?: any;
  setAlphabet?: any;
  interactionBlock?: any;
  setInteractionBlock?: any;
  countalphabet?: any;
  setAlphabetCount?: any;
  count?: any;
  setCount?: any;
  sequence?: any;
  setSequence?: any;
  dummySequence?: any;
  setDummySequence?: any;
  showSelectBlock?: any;
  setSelectBlock?: any;
  targetSequence?: any;
  handleKeyDown?: any;
  isDeleteSeq?: any;
  setDeleteseq?: any;
  handleGet?: any;
  fetchBlocks: any;
  listQuest?: any;
  questTabState?: any;
  setQuestTabState?: any;
  deleteQuest?: any;
  upNextCount?: any;
  setUpNextCount?: any;
  reviews?: any;
  reviewers?: any;
  validation?: any;
  setValidation?: any;
  ShowReview?: any;
  setReviews?: (value: any) => void;
  listBlockItems?: any;
}

const initial = {
  Note: {
    0: { name: '' },
    1: { name: '' },
  },
};

interface MyObject {
  seqs: any;
  option: any;
  secondaryId: any;
}
type ItemType = {
  option: any;
  id: string;
  name: string;
  content: string;
  type: string;
};
interface BlockItem {
  id: string;
  blockId: any; // Adjust the type as needed
}
const NDIMain: React.FC<NDIMainProps> = ({
  id,
  formData,
  setBlockItems,
  serias,
  setserias,
  setInput,
  input,
  setItems,
  items,
  alphabet,
  setAlphabet,
  interactionBlock,
  setInteractionBlock,
  countalphabet,
  setAlphabetCount,
  count,
  setCount,
  sequence,
  setSequence,
  dummySequence,
  setDummySequence,
  showSelectBlock,
  setSelectBlock,
  targetSequence,
  handleKeyDown,
  isDeleteSeq,
  setDeleteseq,
  handleGet,
  fetchBlocks,
  listQuest,
  questTabState,
  setQuestTabState,
  deleteQuest,
  upNextCount,
  setUpNextCount,
  reviews,
  reviewers,
  validation,
  setValidation,
  ShowReview,
  setReviews,
  listBlockItems,
}) => {
  
  const dragRef = useRef<any>();
  const bodyRef = useRef<any>();
  const toast = useToast();
  const [showBox, setShowBox] = useState(false),
    [showMiniBox, setShowMiniBox] = useState<any>(),
    [type, setType] = useState<any>(),
    [alert, setAlert] = useState(false),
    [upNext, setUpNext] = useState<any>(),
    [blockInput, setBlockInput] = useState<any>(),
    [animateBtn, setAnimateBtn] = useState<any>(),
    [number, setNumber] = useState<any>([]),
    [notify, setNotify] = useState<any>(''),
    [blockNumber, setBlockNumber] = useState<any>(),
    [lastInputName, setLastInputName] = useState<any>();
  const [inputtextValue, setinputtextValue] = useState('');
  const [blockWiseReviewCount, setBlockWiseReviewCount] = useState<{ [key: string]: { readCount: number, unReadCount: number, Total: number } }>({});
  const [focusInputValue, setFocusInputValue] = useState<string>('');
  const [focusedSeqId, setFocusedSeqId] = useState<string>(null);
  const user: any = JSON.parse(localStorage.getItem('user'));
  const previewStoreData = useSelector((state: RootState) => state.preview);
  const dispatch: Dispatch<any> = useDispatch();
  // For Character Options
  const characterOption = [
    { value: 'player', label: 'Player' },
    { value: 'NPC Name', label: 'NPC_Name' },
    { value: 'narrator', label: 'Narrator' },
  ];
  // For Dialog Options
  const dialogOption = [
    { value: `${Avatar11}`, label: 'Asking' },
    { value: `${Avatar1}`, label: 'Angry' },
    { value: `${Avatar2}`, label: 'laughing' },
    { value: `${Avatar3}`, label: 'Happy' },
  ];
  // For VoicePose Options
  const voicePoseOption = [
    { value: 'talking', label: 'Talking' },
    { value: 'sad', label: 'Sad' },
  ];
  const GameId = id;
  // onClick Function
  const handleNDI = (NDI: any) => {
    const id = `${serias}.${count}`;
    const upNext = `${serias}.${count + 1}`;
    setUpNext(upNext);
    setType(NDI);
    setShowBox(false);
    setItems((prevItems: any) => [
      ...prevItems,
      {
        id,
        type: NDI,
        upNext,
        input: count,
        questNo: serias,
      },
    ]);

    setSequence([...sequence, id]);
    setDummySequence([...dummySequence, id]);
    setUpNextCount([...upNextCount, upNext]);
    setCount(count + 1);
    setInput((prevInput: any) => {
      const noteKey = `Note${count}`;
      const dialogKey = `Dialog${count}`;
      const interactionKey = `Interaction${count}`;
      if (NDI == 'Note') {
        return {
          ...prevInput,
          [noteKey]: {
            ...prevInput[noteKey],
            id: id,
            note: '',
            dtime: null,
            status: 'yes',
          },
        };
      }
      if (NDI == 'Dialog') {
        return {
          ...prevInput,
          [dialogKey]: {
            ...prevInput[dialogKey],
            id: id,
            dialog: '',
            character: formData.gameNonPlayingCharacterId,
            animation: '',
            voice: '',
            dtime: null,
          },
        };
      }
      if (NDI == 'Interaction') {
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: id,
            interaction: '',
            status: 'yes',
            blockRoll: formData.gameNonPlayingCharacterId,
            responseRoll: formData.gameNonPlayingCharacterId,
            optionsObject: { A: null, B: null, C: null },
            ansObject: { A: null, B: null, C: null },
            feedbackObject: { A: null, B: null, C: null },
            responseObject: { A: null, B: null, C: null },
            optionTitleObject: { A: null, B: null, C: null },
            optionsemotionObject: { A: null, B: null, C: null },
            optionsvoiceObject: { A: null, B: null, C: null },
            scoreObject: { A: null, B: null, C: null },
            navigateObjects: { A: null, B: null, C: null },
          },
        };
      }
    });
    if (NDI === 'Interaction') {
      const currentAlpha = alphabet
        .slice()
        .find((item: any) => item.seqs === id);
      if (id !== currentAlpha?.seqs) {
        let secondaryArray: any = [];
        let makcount = countalphabet;

        for (let i = 0; i < 3; i++) {
          // Insert data into the array
          let inc = makcount + i + 1;
          secondaryArray.push(inc);
        }
        setAlphabetCount(secondaryArray[2]);
        setAlphabet((prev: any) => [
          ...prev,
          { seqs: id, option: 'A', secondaryId: secondaryArray[0] },
          { seqs: id, option: 'B', secondaryId: secondaryArray[1] },
          { seqs: id, option: 'C', secondaryId: secondaryArray[2] },
        ]);
      }
    }
  };
  const handleMiniNDI = (seq?: any, i?: any, name?: any) => {
    const sequencial = `${count / 10 + 1}`;
    const upNextSequencial = `${(count + 1) / 10 + 1}`;
    const floatRegex = /^[-+]?(\d*\.\d+|\.\d+)$/;

    const id = `${serias}.${count}`;
    const upNext = `${serias}.${count + 1}`;
    setUpNext(upNext);
    setCount(count + 1);
    const newArr = { id, type: name, upNext, input: count,questNo:serias };
console.log('enter changes',newArr)
    setItems((prevArray: any) => {
      const nextIndex = i + 1;
      setNumber([...number, newArr.input]);
      return [
        ...prevArray.slice(0, nextIndex),
        newArr,
        ...prevArray
          .slice(nextIndex)
          .map((item: any) => ({ ...item, upNext: id})),
      ];
    });

    setSequence([...sequence, id]);
    setDummySequence([...dummySequence, id]);
    setUpNextCount([...upNextCount, upNext]);
    if (name === 'Interaction') {
      const currentAlpha = alphabet
        .slice()
        //  .reverse() // Reverse the array to start searching from the end
        .find((item: any) => item.seqs === id);
      if (id !== currentAlpha?.seqs) {
        let secondaryArray: any = [];
        let makcount = countalphabet;

        for (let i = 0; i < 3; i++) {
          // Insert data into the array
          let inc = makcount + i + 1;
          secondaryArray.push(inc);
        }
        setAlphabetCount(secondaryArray[2]);
        console.log('secondaryArray', secondaryArray);
        setAlphabet((prev: any) => [
          ...prev,
          { seqs: id, option: 'A', secondaryId: secondaryArray[0] },
          { seqs: id, option: 'B', secondaryId: secondaryArray[1] },
          { seqs: id, option: 'C', secondaryId: secondaryArray[2] },
        ]);
      }
    }
    setInput((prevInput: any) => {
      const noteKey = `Note${count}`;
      const dialogKey = `Dialog${count}`;
      const interactionKey = `Interaction${count}`;
      if (name == 'Note') {
        return {
          ...prevInput,
          [noteKey]: {
            ...prevInput[noteKey],
            id: id,
            note: '',
            dtime: null,
          },
        };
      }
      if (name == 'Dialog') {
        return {
          ...prevInput,
          [dialogKey]: {
            ...prevInput[dialogKey],
            id: id,
            dialog: '',
            character: formData.gameNonPlayingCharacterId,
            animation: '',
            voice: '',
            dtime: null,
          },
        };
      }
      if (name == 'Interaction') {
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: id,
            interaction: '',
            blockRoll: formData.gameNonPlayingCharacterId,
            responseRoll: formData.gameNonPlayingCharacterId,
            optionsObject: { A: null, B: null, C: null },
            ansObject: { A: null, B: null, C: null },
            feedbackObject: { A: null, B: null, C: null },
            responseObject: { A: null, B: null, C: null },
            optionTitleObject: { A: null, B: null, C: null },
            optionsemotionObject: { A: null, B: null, C: null },
            optionsvoiceObject: { A: null, B: null, C: null },
            scoreObject: { A: null, B: null, C: null },
            navigateObjects: { A: null, B: null, C: null },
          },
        };
      }
    });

    setShowMiniBox(false);
  };
  const getSeq = (seq: any, i: any, name: any) => {
    setShowMiniBox((prev: any) => (seq.id == prev ? null : seq.id));
  };

  const duplicateSeq = (seq: any, i: any, name: any) => {

    const sequencial = `${count / 10 + 1}`;
    const upNextSequencial = `${(count + 1) / 10 + 1}`;
    const floatRegex = /^[-+]?(\d*\.\d+|\.\d+)$/;
    const id = `${serias}.${count}`;
    const upNext = `${serias}.${count + 1}`;
    setUpNext(upNext);
    setCount(count + 1);
    const newArr = { id, type: name, upNext, input: count, questNo: parseInt(serias) };

    setItems((prevArray: any) => {
      const nextIndex = i + 1;
      setNumber([...number, newArr.input]);
      return [
        ...prevArray.slice(0, nextIndex),
        newArr,
        ...prevArray
          .slice(nextIndex)
          .map((item: any) => ({ ...item, upNext: id })),
      ];
    });

    setSequence([...sequence, id]);
    setDummySequence([...dummySequence, id]);
    setUpNextCount([...upNextCount, upNext]);

    if (name === 'Interaction') {
   
      const currentAlpha = alphabet.filter((item: any) => item.seqs === seq.id);
      let lastData = alphabet[alphabet.length - 1].secondaryId+1;
     
      const duplicateAlpha = currentAlpha.map((item: ItemType, index: string | number) => {

        return { seqs:id ,  option: item.option, secondaryId: lastData++ };
      });
      setAlphabet((prev: any) => [
        ...prev,
        ...duplicateAlpha
      ]);
     
      // return false

      // if (id !== currentAlpha?.seqs) {
      //   let secondaryArray: any = [];
      //   let makcount = countalphabet;

      //   for (let i = 0; i < 3; i++) {
      //     // Insert data into the array
      //     let inc = makcount + i + 1;
      //     secondaryArray.push(inc);
      //   }
      //   setAlphabetCount(secondaryArray[2]);
      //   setAlphabet((prev: any) => [
      //     ...prev,
      //     { seqs: id, option: 'A', secondaryId: secondaryArray[0] },
      //     { seqs: id, option: 'B', secondaryId: secondaryArray[1] },
      //     { seqs: id, option: 'C', secondaryId: secondaryArray[2] },
      //   ]);
      // }
    }
    setInput((prevInput: any) => {
      const noteKey = `Note${count}`;
      const dialogKey = `Dialog${count}`;
      const interactionKey = `Interaction${count}`;

      // Previous Data Object
      const oldNoteKey = prevInput?.[`Note${seq.input}`];
      const oldDialogKey = prevInput?.[`Dialog${seq.input}`];
      const oldInteractionKey = prevInput?.[`Interaction${seq.input}`];

      // Activate RFST
      if (oldInteractionKey?.responseObject?.A !== '' || null) {
        setInteractionBlock((prev: any) => {
          return { ...prev, [`Resp${[count]}`]: count };
        });
      }
      if (oldInteractionKey?.feedbackObject?.A !== '' || null) {
        setInteractionBlock((prev: any) => {
          return { ...prev, [`Feedbk${[count]}`]: count };
        });
      }
      if (oldInteractionKey?.SkillTag !== '' || null) {
        setInteractionBlock((prev: any) => {
          return { ...prev, [`Skills${[count]}`]: count };
        });
      }
      if (oldInteractionKey?.optionTitleObject?.A !== '' || null) {
        setInteractionBlock((prev: any) => {
          return { ...prev, [`Title${[count]}`]: count };
        });
      }

      if (seq.type == 'Note') {
        return {
          ...prevInput,
          [noteKey]: {
            ...prevInput?.noteKey,
            id: id,
            note: oldNoteKey?.note,
          },
        };
      }
      if (seq.type == 'Dialog') {
        return {
          ...prevInput,
          [dialogKey]: {
            ...prevInput[dialogKey],
            id: id,
            dialog: oldDialogKey?.dialog,
            character: oldDialogKey?.character,
            animation: oldDialogKey?.animation,
            voice: '',
          },
        };
      }
      if (seq.type == 'Interaction') {

        //Previous Object Data's
        const optionsObject = oldInteractionKey?.optionsObject;

     

        const ansObject = oldInteractionKey?.ansObject;
        const feedbackObject = oldInteractionKey?.feedbackObject;
        const responseObject = oldInteractionKey?.responseObject;
        // Lokie
        const responseemotionObject = oldInteractionKey?.responseemotionObject;
        //End Lokie
        const optionTitleObject = oldInteractionKey?.optionTitleObject;
        const optionsemotionObject = oldInteractionKey?.optionsemotionObject;
        const optionsvoiceObject = oldInteractionKey?.optionsvoiceObject;
        const scoreObject = oldInteractionKey?.scoreObject;
        const navigateObjects = oldInteractionKey?.navigateObjects;
        const navigateshowObjects=oldInteractionKey?.navigateshowObjects;
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: id,
            interaction: oldInteractionKey?.interaction,
            blockRoll: oldInteractionKey?.blockRoll,
            QuestionsEmotion: oldInteractionKey?.QuestionsEmotion,
            QuestionsVoice: oldInteractionKey?.QuestionsVoice,
            SkillTag: oldInteractionKey?.SkillTag,
            quesionTitle: oldInteractionKey?.quesionTitle,
             // Lokie
             responseRoll : oldInteractionKey?.responseRoll,
             //End Lokie
            optionsObject: optionsObject,
            ansObject: ansObject,
            feedbackObject: feedbackObject,
            responseObject: responseObject,
                // Lokie
                responseemotionObject:responseemotionObject,
                //End Lokie
            optionTitleObject: optionTitleObject,
            optionsemotionObject:optionsemotionObject,
            optionsvoiceObject: optionsvoiceObject,
            scoreObject: scoreObject,
            navigateObjects: navigateObjects,
            navigateshowObjects:navigateshowObjects
          },
        };
      }
    });
  };
  const delSeq = (seq: any, i: any, name: any) => {
    // removeDataBySeqs(seq.id);
    dispatch(
      updatePreviewData({ isDispatched: true ,gameId:parseInt(id) }),
    );
    const filteredNotes = Object.keys(input)
      .filter((noteKey) => input[noteKey].Notenavigate === seq.input)
      .map((noteKey) => {
        input[noteKey].Notenavigate = null;
        input[noteKey].NoteleadShow = null;
        return input[noteKey];
      });
    const filteredDialog = Object.keys(input)
      .filter((dialogKey) => input[dialogKey].Dialognavigate === seq.input)
      .map((dialogKey) => {
        input[dialogKey].Dialognavigate = null;
        input[dialogKey].DialogleadShow = null;
        return input[dialogKey];
      });
    const filteredInteraction = Object.keys(input)
      .filter(
        (interactionkey) =>
          input[interactionkey].navigateObjects &&
          Object.values(input[interactionkey].navigateObjects).includes(
            seq.input,
          ),
      )
      .map((interactionkey) => {
        Object.keys(input[interactionkey].navigateObjects).forEach((option) => {
         
          if (input[interactionkey].navigateObjects[option] === seq.input) {
            input[interactionkey].navigateObjects[option] = null;
            input[interactionkey].navigateshowObjects[option] = null;
          }
        });
        return input[interactionkey];
      });

    if (name === 'Interaction') {
      setAlphabet((prevAlphabet: any) => {
        // Use filter to create a new array without items that match the condition
        const updatedAlphabet = prevAlphabet?.filter(
          (item: any) => item.seqs !== seq.id,
        );
        return updatedAlphabet;
      });

    }
    setItems((previtems: any) => {
      // Use filter to create a new array without items that match the condition
      const updatedItems = previtems?.filter(
        (item: any) => item.input !== seq.input,
      );
      return updatedItems;
    });
    setDeleteseq(true);
   
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const sequencial = `${count / 10 + 1}`;
    const floatRegex = /^[-+]?(\d*\.\d+|\.\d+)$/;

    const id = `${serias}.${count}`;
    const upNext = `${serias}.${count + 1}`;
    if (blockInput === 'N') {
      setType('Note');
      setCount(count + 1);
      setUpNext(upNext);
      setSequence([...sequence, id]);
      setDummySequence([...dummySequence, id]);
      setUpNextCount([...upNextCount, upNext]);
      setItems((prevItems: any) => [
        ...prevItems,
        {
          id,
          type: 'Note',
          upNext,
          input: count,
          questNo: serias,
        },
      ]);
    } else if (blockInput === 'D') {
      setType('Dialog');
      setCount(count + 1);
      setUpNext(upNext);
      setSequence([...sequence, id]);
      setDummySequence([...dummySequence, id]);
      setUpNextCount([...upNextCount, upNext]);
      setItems((prevItems: any) => [
        ...prevItems,
        {
          id,
          type: 'Dialog',
          upNext,
          input: count,
          questNo: serias,
        },
      ]);
    } else if (blockInput === 'I') {
      setType('Interaction');

      const currentAlpha = alphabet
        .slice()
        //  .reverse() // Reverse the array to start searching from the end
        .find((item: any) => item.seqs === id);
      if (id !== currentAlpha?.seqs) {
        let secondaryArray: any = [];
        let makcount = countalphabet;

        for (let i = 0; i < 3; i++) {
          // Insert data into the array
          let inc = makcount + i + 1;
          secondaryArray.push(inc);
        }
        setAlphabetCount(secondaryArray[2]);
        setAlphabet((prev: any) => [
          ...prev,
          { seqs: id, option: 'A', secondaryId: secondaryArray[0] },
          { seqs: id, option: 'B', secondaryId: secondaryArray[1] },
          { seqs: id, option: 'C', secondaryId: secondaryArray[2] },
        ]);
      }
      setCount(count + 1);
      setUpNext(upNext);
      setSequence([...sequence, id]);
      setDummySequence([...dummySequence, id]);
      setUpNextCount([...upNextCount, upNext]);
      setItems((prevItems: any) => [
        ...prevItems,
        {
          id,
          type: 'Interaction',
          upNext,
          input: count,
          questNo: serias,
        },
      ]);
    } else {
      return '';
    }

    setInput((prevInput: any) => {
      const noteKey = `Note${count}`;
      const dialogKey = `Dialog${count}`;
      const interactionKey = `Interaction${count}`;
      if (blockInput === 'N') {
        return {
          ...prevInput,
          [noteKey]: {
            ...prevInput[noteKey],
            id: id,
            note: '',
            dtime: null,
          },
        };
      }
      if (blockInput === 'D') {
        return {
          ...prevInput,
          [dialogKey]: {
            ...prevInput[dialogKey],
            id: id,
            dialog: '',
            character: formData.gameNonPlayingCharacterId,
            animation: '',
            voice: '',
            dtime: null,
          },
        };
      }
      if (blockInput === 'I') {
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: id,
            interaction: '',
            responseRoll: formData.gameNonPlayingCharacterId,
            optionsObject: { A: null, B: null, C: null },
            ansObject: { A: null, B: null, C: null },
            feedbackObject: { A: null, B: null, C: null },
            responseObject: { A: null, B: null, C: null },
            optionTitleObject: { A: null, B: null, C: null },
            optionsemotionObject: { A: null, B: null, C: null },
            optionsvoiceObject: { A: null, B: null, C: null },
            scoreObject: { A: null, B: null, C: null },
            navigateObjects: { A: null, B: null, C: null },
          },
        };
      }
    });

    setBlockInput('');
    setNotify('');
  };
  const handleBottomNDI = (NDI: any) => {
    const sequencial = `${count / 10 + 1}`;
    const upNextSequencial = `${(count + 1) / 10 + 1}`;
    const floatRegex = /^[-+]?(\d*\.\d+|\.\d+)$/;
    const id = `${serias}.${count}`;
    const upNext = `${serias}.${count + 1}`;
    setUpNext(upNext);
    setType(NDI);
    setShowBox(false);
    setItems((prevItems: any) => {
      return [
        ...prevItems,
        {
          id: id,
          type: NDI,
          upNext: upNext,
          input: count,
          questNo: serias,
        },
      ];
    });
    setSequence([...sequence, id]);
    setDummySequence([...dummySequence, id]);
    setUpNextCount([...upNextCount, upNext]);
    setCount(count + 1);
    if (NDI === 'Interaction') {
      const currentAlpha = alphabet
        .slice()
        //  .reverse() // Reverse the array to start searching from the end
        .find((item: any) => item.seqs === id);
      if (id !== currentAlpha?.seqs) {
        let secondaryArray: any = [];
        let makcount = countalphabet;

        for (let i = 0; i < 3; i++) {
          // Insert data into the array
          let inc = makcount + i + 1;
          secondaryArray.push(inc);
        }
        setAlphabetCount(secondaryArray[2]);
        setAlphabet((prev: any) => [
          ...prev,
          { seqs: id, option: 'A', secondaryId: secondaryArray[0] },
          { seqs: id, option: 'B', secondaryId: secondaryArray[1] },
          { seqs: id, option: 'C', secondaryId: secondaryArray[2] },
        ]);
      }
    }
    setInput((prevInput: any) => {
      const noteKey = `Note${count}`;
      const dialogKey = `Dialog${count}`;
      const interactionKey = `Interaction${count}`;
      if (NDI == 'Note') {
        return {
          ...prevInput,
          [noteKey]: {
            ...prevInput[noteKey],
            id: id,
            note: '',
            dtime: null,
          },
        };
      }
      if (NDI == 'Dialog') {
        return {
          ...prevInput,
          [dialogKey]: {
            ...prevInput[dialogKey],
            id: id,
            dialog: '',
            character: formData.gameNonPlayingCharacterId,
            animation: '',
            voice: '',
            dtime: null,
          },
        };
      }
      if (NDI == 'Interaction') {
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: id,
            interaction: '',
            blockRoll: formData.gameNonPlayingCharacterId,
            responseRoll: formData.gameNonPlayingCharacterId,
            
            optionsObject: { A: null, B: null, C: null },
            ansObject: { A: null, B: null, C: null },
            feedbackObject: { A: null, B: null, C: null },
            responseObject: { A: null, B: null, C: null },
            optionTitleObject: { A: null, B: null, C: null },
            optionsemotionObject: { A: null, B: null, C: null },
            optionsvoiceObject: { A: null, B: null, C: null },
            scoreObject: { A: null, B: null, C: null },
            navigateObjects: { A: null, B: null, C: null },
          },
        };
      }
    });
  };
  const handleSave = async () => {
    const data = {
      items: items,
      input: input,
      alphabet: alphabet,
    };
    try {
      const result = await setStory(id, JSON.stringify(data));
      if (result?.status !== 'Success') {
        return console.log('updateBackground error :' + result?.err);
      } else {
        console.log('result data', result.data);
      }
    } catch (error) {
      console.error('An error occurred while sending the request:', error);
    }
    console.log('save', JSON.stringify(input));
  };

  const handleBlockRoll = (selectedOption: any, i: any, keyvalue: any) => {
    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const blockroll = selectedOption.value;

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          blockRoll: blockroll,
        },
      };
    });
  };
  const handleDialogBlockRoll = (selectedOption: any, i: any,keyvalue: any) => {
    let key = i - 1;
    setInput((prevInput: any) => {
      // const interactionKey = `Dialog${items[key]?.input}`;
      const dialogKey = keyvalue;
      const blockroll = selectedOption.value;
      return {
        ...prevInput,
        [dialogKey]: {
          ...prevInput[dialogKey],
          id: items[i]?.id,
          character: blockroll,
        },
      };
    });
  };
  const handleResponseRoll = (selectedOption: any, i: any, keyvalue: any) => {
    let key = i - 1;
    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const responseRoll = selectedOption.value;

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          responseRoll: responseRoll,
        },
      };
    });
  };
  const handleTagsChange = (tags: any, interaction: any) => {
    const tagNames = tags.map((tag: any) => tag.name);

    // Convert the array of tag names into a string
    const tagsString = tagNames.join(', ');

    setInput((prevInput: any) => {
      const interactionKey = `${interaction}`;
      const SkillTag = tagsString;

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          SkillTag: SkillTag,
        },
      };
    });
  };
  const handleQuestionEmotion = (
    selectedOption: any,
    i: any,
    keyvalue: any,
  ) => {
    const selectedValues = selectedOption.map((option: any) => option.value);

    const resultString = selectedValues.join(', ');
    const resultArray = resultString.split(', ');
    const arrayLength = resultArray.length;

    setValidation({
      ...validation,
      [`QuestionsEmotion${i}`]: selectedOption === '' ? true : false,
    });
    // Lokie 0007
    if(selectedOption != ''){
      setValidation({
        ...validation,
        [`Interaction${i}`]: false,
      });
    }
    if (arrayLength <= 2) {
      setInput((prevInput: any) => {
        const interactionKey = keyvalue;
        const QuestionsEmotion = resultString;

        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: items[i]?.id,
            QuestionsEmotion: QuestionsEmotion,
          },
        };
      });
    }
  };

  const handleDialogEmotion = (selectedOption: any, i: any) => {
    const selectedValues = selectedOption.map((option: any) => option.value);

    // Use the array of strings as needed, for example, join them into a single string
    const resultString = selectedValues.join(', ');
    const resultArray = resultString.split(', ');
    const arrayLength = resultArray.length;

    if (arrayLength <= 2) {
      setInput((prevInput: any) => {
        const interactionKey = `Dialog${i}`;
        const DialogEmotion = resultString;
        setValidation({
          ...validation,
          [`dailogAnimation${i}`]: DialogEmotion === '' ? true : false,
        });
            // Lokie 0007
        if(DialogEmotion != ''){
          setValidation({
            ...validation,
            [`Dialog${i}`]: false,
          });
        }
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: items[i]?.id,
            animation: DialogEmotion,
          },
        };
      });
    }
  };

  const handleDialogVoice = (selectedOption: any, i: any) => {
    let key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = `Dialog${items[key]?.input}`;
      const Dialogvoice = selectedOption.value;

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          voice: Dialogvoice,
        },
      };
    });
  };

  const handleQuestionVoice = (selectedOption: any, i: any, keyvalue: any) => {
    let key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const QuestionsVoice = selectedOption.value;

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          QuestionsVoice: QuestionsVoice,
        },
      };
    });
  };

  const handleOptionEmotion = (
    selectedOption: any,
    i: any,
    optionemotion: any,
    keyvalue: any,
  ) => {
    const key = i - 1;
    const selectedValues = selectedOption.map((option: any) => option.value);

    const resultString = selectedValues.join(', ');
    const resultArray = resultString.split(', ');
    const arrayLength = resultArray.length;
    if (arrayLength <= 2) {
      setInput((prevInput: any) => {
        const interactionKey = keyvalue;
        const OptionEmotion = selectedOption.value;
        const optionsemotionObject: any = {};

        alphabet.forEach((item: any) => {
          const optValue =
            optionemotion === `Option${item.option}`
              ? resultString
              : prevInput[interactionKey]?.optionsemotionObject?.[item.option];
          handleValidation(item, validation, setValidation);
          optionsemotionObject[item.option] = optValue;
        });
        function handleValidation(
          item: any,
          validation: any,
          setValidation: any,
        ) {
          const optionEmotionKey = `optionsEmotion${i}${item?.option}`;
          const isValid =
            optionsemotionObject?.[item?.option] === '' ? true : false;

          setValidation((prevValidation: any) => ({
            ...prevValidation,
            [optionEmotionKey]: isValid,
          }));
          // Lokie 0007
          if(isValid === false){
         
            setValidation((prevValidation: any) => ({
            ...prevValidation,
            [`Interaction${i}`]: false,
          }));
          }
        }
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: items[i]?.id,
            optionsemotionObject: optionsemotionObject,
          },
        };
      });
    }
  };

  const handleOptionVoice = (
    selectedOption: any,
    i: any,
    optionvoice: any,
    keyvalue: any,
  ) => {
    const key = i - 1;
    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const OptionVoice = selectedOption.value;
      const optionsvoiceObject: any = {};

      alphabet.forEach((item: any) => {
        const optValue =
          optionvoice === `Option${item.option}`
            ? selectedOption.value
            : prevInput[interactionKey]?.optionsvoiceObject?.[item.option];
        optionsvoiceObject[item.option] = optValue;
      });
      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          optionsvoiceObject: optionsvoiceObject,
        },
      };
    });
  };

  const handleResponseEmotion = (
    selectedOption: any,
    i: any,
    responseemotion: any,
    keyvalue: any,
  ) => {
    const key = i - 1;
    const selectedValues = selectedOption.map((option: any) => option.value);

    const resultString = selectedValues.join(', ');
    const resultArray = resultString.split(', ');
    const arrayLength = resultArray.length;
    if (arrayLength <= 2) {
      setInput((prevInput: any) => {
        const interactionKey = keyvalue;
        const OptionEmotion = selectedOption.value;
        const responseemotionObject: any = {};

        alphabet.forEach((item: any) => {
          const optValue =
            responseemotion === `Option${item.option}`
              ? resultString
              : prevInput[interactionKey]?.responseemotionObject?.[item.option];
          responseemotionObject[item.option] = optValue;
        });
        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: items[i]?.id,
            responseemotionObject: responseemotionObject,
          },
        };
      });
    }
  };

  const handleCheckBox = (
    checked: any,
    i: any,
    optionright: any,
    keyvalue: any,
  ) => {
    const isChecked = checked.target.checked;
    const key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const ansObject: any = {};

      alphabet.forEach((item: any) => {
        const optValue =
          optionright === `Option${item.option}`
            ? checked.target.checked
            : prevInput[interactionKey]?.ansObject?.[item.option];
        ansObject[item.option] = optValue;
      });
      const checkAnsObject: any = Object.values(ansObject).filter(
        (item: any) => item === true,
      );
      const checkedIsTrue: any = checkAnsObject.find(
        (item: any) => item === true,
      );
      setValidation({
        ...validation,
        [`checkbox${i}`]: checkedIsTrue === undefined ? true : false,
      });
      // Lokie 0007
      if(checkedIsTrue != undefined){
        setValidation({
          ...validation,
          [`Interaction${i}`]: false,
          [`checkbox${i}`]:false
        });
      }
    

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          ansObject: ansObject,
        },
      };
    });
  };

  const setNavigation = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    const key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigateObjects: any = {};
      const navigateshowObjects: any = {};
      alphabet.forEach((item: any) => {
        const optValue =
          foroption === `Option${item.option}`
            ? menuvalue
            : prevInput[interactionKey]?.navigateObjects?.[item.option];

        const optValueS =
          foroption === `Option${item.option}`
            ? menuvalue
            : prevInput[interactionKey]?.navigateshowObjects?.[item.option];
        navigateObjects[item.option] = optValue;
        navigateshowObjects[item.option] = optValueS;
        // Lokie 0007
        if(optValueS){
            
          setValidation((prevValidation: any) => ({
          ...prevValidation,
          [`Interaction${i}`]: false,
        }));
        }
        
      });

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          navigateObjects: navigateObjects,
          navigateshowObjects: navigateshowObjects,
        },
      };
    });
  };
  const handleNoteNavigation = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    let key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigate = menuvalue.value;
      // Lokie 0007
      if(navigate){
                  
        setValidation((prevValidation: any) => ({
        ...prevValidation,
        [`Note${i}`]: false,
      }));
      }
      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          Notenavigate: navigate,
        },
      };
    });
  };

  const setNoteNavigation = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    let key = i - 1;
    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigate = menuvalue;
      // Lokie 0007
      if(navigate){
                  
        setValidation((prevValidation: any) => ({
        ...prevValidation,
        [`Note${i}`]: false,
      }));
      }
      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          Notenavigate: navigate,
          NoteleadShow: navigate,
        },
      };
    });
  };
  const setNotelead = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    let key = i - 1;
    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigate = menuvalue;
       // Lokie 0007
       if(navigate){
                  
        setValidation((prevValidation: any) => ({
        ...prevValidation,
        [`Note${i}`]: false,
      }));
      }
      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          NoteleadShow: navigate,
          Notenavigate: null,
        },
      };
    });
  };

  const handleDialogNavigation = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    let key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigate = menuvalue.value;
      // Lokie 0007
      if(navigate){
                  
        setValidation((prevValidation: any) => ({
        ...prevValidation,
        [`Dialog${i}`]: false,
      }));
      }
      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          Dialognavigate: navigate,
        },
      };
    });
  };

  const setDialogNavigation = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    let key = i - 1;
    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigate = menuvalue;
       // Lokie 0007
       if(navigate){
            
        setValidation((prevValidation: any) => ({
        ...prevValidation,
        [`Dialog${i}`]: false,
      }));
      }

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          Dialognavigate: navigate,
          DialogleadShow: navigate,
        },
      };
    });
  };
  const setDialoglead = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    let key = i - 1;
    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigate = menuvalue;

       // Lokie 0007
       if(navigate){
            
        setValidation((prevValidation: any) => ({
        ...prevValidation,
        [`Dialog${i}`]: false,
      }));
      }

      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          DialogleadShow: navigate,
          Dialognavigate: null,
        },
      };
    });
  };

  const handleBlock = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {

    const key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigateshowObjects: any = {};
      const navigateObjects: any = {};

      alphabet.forEach((item: any) => {
        const optValue =
          foroption === `Option${item.option}`
            ? menuvalue
            : prevInput[interactionKey]?.navigateshowObjects?.[item.option];
        navigateshowObjects[item.option] = optValue;
        const optValue1 =
          foroption === `Option${item.option}`
            ? ''
            : prevInput[interactionKey]?.navigateObjects?.[item.option];
        navigateObjects[item.option] = optValue1;
      });
      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          navigateshowObjects: navigateshowObjects,
          navigateObjects: navigateObjects,
        },
      };
    });
  };

  const handleSelectBlock = (
    menuvalue: any,
    i: any,
    foroption: any,
    keyvalue: any,
  ) => {
    const key = i - 1;

    setInput((prevInput: any) => {
      const interactionKey = keyvalue;
      const navigateObjects: any = {};

      alphabet.forEach((item: any) => {
        const optValue =
          foroption === `Option${item.option}`
            ? menuvalue.value
            : prevInput[interactionKey]?.navigateObjects?.[item.option];
        navigateObjects[item.option] = optValue;
         // Lokie 0007
         if(optValue){
            
          setValidation((prevValidation: any) => ({
          ...prevValidation,
          [`Interaction${i}`]: false,
        }));
        }
      });
      return {
        ...prevInput,
        [interactionKey]: {
          ...prevInput[interactionKey],
          id: items[i]?.id,
          navigateObjects: navigateObjects,
        },
      };
    });
  };
  //navin-end

  //handles the content updation for Demoplay
  const blockOnFocusHanlder = async (e:any,seqId:any)=>{
        setFocusInputValue(e.target.value);
        setFocusedSeqId(seqId);
        // {gameId: id, focusValue: string}
        dispatch(onFocusField({gameId: id, focusValue: e.target.value}))
        
    }
    const blockOnBlurHanlder = (e:any,seqId:any)=>{
       // {gameId: id, blurValue: string}
      dispatch(onBlurField({gameId: id, blurValue: e.target.value}))
    } 
useEffect(()=>{
  const handleVisibilityChange = () => {
    if (document.hidden && focusInputValue && focusedSeqId && inputtextValue) {
       blockOnBlurHanlder({ target: { value: inputtextValue }}, focusedSeqId);
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
},[])

  // onChange Function
  const handleInput = async (e: any, i?: any, BlockNum?: any) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setinputtextValue(textarea.value);


    const getLastDigit = e.target.name.slice(-1);
    const match = e.target.name.match(/([a-zA-Z]+)(\d+)/);
    if (match) {
      const textPart = match[1];
      const numberPart = match[2];
    } else {
      console.log('No match found');
    }
    setBlockNumber(BlockNum);
    setLastInputName(Number(match[2]));
    setInput((prevInput: any) => {
      // const noteKey = `Note`;
      const noteKey = `Note${items[i]?.input}`;
      const dialogKey = `Dialog${items[i]?.input}`;
      const interactionKey = `Interaction${items[i]?.input}`;

      if (e.target.name == noteKey) {
        const note =
          e.target.id === 'Note' ? e.target.value : prevInput[noteKey]?.note;
        // setValidation({
        //   ...validation,
        //   [`Note${BlockNum}`]: note === '' ? true : false,
        // });

        // Lokie 0007
        if(note != ''){
          setValidation({
            ...validation,
            [`Note${BlockNum}`]: false,
          });
        }
        return {
          ...prevInput,
          [noteKey]: {
            ...prevInput[noteKey],
            id: items[i]?.id,
            note: note,
          },
        };
      }
      if (e.target.name == dialogKey) {
        const dialog =
          e.target.id === 'Dialog'
            ? e.target.value
            : prevInput[dialogKey]?.dialog;
        // setValidation({
        //   ...validation,
        //   [`Dialog${BlockNum}`]: dialog === '' ? true : false,
        // });

        // Lokie 0007
        if(dialog != ''){
          setValidation({
            ...validation,
            [`Dialog${BlockNum}`]: false,
          });
        }
        return {
          ...prevInput,
          [dialogKey]: {
            ...prevInput[dialogKey],
            id: items[i]?.id,
            dialog: dialog,
          },
        };
      }
      if (e.target.name == interactionKey) {
        const interaction =
          e.target.id === 'interaction'
            ? e.target.value
            : prevInput[interactionKey]?.interaction;
        // const questionTitle =
        //   e.target.id === 'QuestionTitles'
        //     ? e.target.value
        //     : prevInput[interactionKey]?.quesionTitle;
        // Lokie Worked
        const questionTitle = e.target.id === `QuestionTitle${items[i]?.input}` ? e.target.value : prevInput[interactionKey]?.quesionTitle;
        const SkillTag =
          e.target.id === 'skills'
            ? e.target.value
            : prevInput[interactionKey]?.SkillTag;

        const optionsObject: any = {};
        const responseObject: any = {};
        const feedbackObject: any = {};
        const scoreObject: any = {};
        const ansObject: any = {};
        const optionTitleObject: any = {};
        alphabet.forEach((item: any) => {
          const optValue =
            e.target.id === `Option${e.target.title}`
              ? e.target.value
              : prevInput[interactionKey]?.optionsObject?.[item.option];
          const responseValue =
            e.target.id === `Response${e.target.title}`
              ? e.target.value
              : prevInput[interactionKey]?.responseObject?.[item.option];
          const feedbackValue =
            e.target.id === `FeedBack${e.target.title}`
              ? e.target.value
              : prevInput[interactionKey]?.feedbackObject?.[item.option];
          const scoreValue =
            e.target.id === `Score${e.target.title}`
              ? e.target.value
              : prevInput[interactionKey]?.scoreObject?.[item.option];

          const ansValue =
            e.target.id === `Ans${e.target.title}`
              ? e.target.checked
              : prevInput[interactionKey]?.ansObject?.[item.option];
          const optionTitleValue =
            e.target.id === `OptionTitle${e.target.title}`
              ? e.target.value
              : prevInput[interactionKey]?.optionTitleObject?.[item.option];

          optionsObject[item.option] =
            e.target.id === `Option${item.option}`
              ? optValue
              : prevInput[interactionKey]?.optionsObject?.[item.option];

          responseObject[item.option] =
            e.target.id === `Response${item.option}`
              ? responseValue
              : prevInput[interactionKey]?.responseObject?.[item.option];

          feedbackObject[item.option] =
            e.target.id === `FeedBack${item.option}`
              ? feedbackValue
              : prevInput[interactionKey]?.feedbackObject?.[item.option];

          scoreObject[item.option] =
            e.target.id === `Score${item.option}`
              ? scoreValue
              : prevInput[interactionKey]?.scoreObject?.[item.option];

          ansObject[item.option] =
            e.target.id === `Ans${item.option}`
              ? ansValue
              : prevInput[interactionKey]?.ansObject?.[item.option];

          optionTitleObject[item.option] =
            e.target.id === `OptionTitle${item.option}`
              ? optionTitleValue
              : prevInput[interactionKey]?.optionTitleObject?.[item.option];
        });
        // setValidation({
        //   ...validation,
        //   [`Interaction${BlockNum}`]: interaction === '' ? true : false,
        // });
         // Lokie 0007
         if(interaction != ''){
          setValidation({
            ...validation,
            [`Interaction${BlockNum}`]: false,
          });
        }
        for (const alp of alphabet?.filter(
          (alp: any) => items[i]?.id === alp.seqs,
        ) || []) {
          handleValidation(
            alp,
            BlockNum,
            optionsObject,
            validation,
            setValidation,
          );
        }
        function handleValidation(
          alp: any,
          blockNum: any,
          optionsObject: any,
          currentValidation: any,
          setValidation: any,
        ) {
          const optionKey = `options${blockNum}${alp?.option}`;
          const isValid = optionsObject?.[alp?.option] === '' ? true : false;

          setValidation((prevValidation: any) => ({
            ...prevValidation,
            [optionKey]: isValid,
          }));

          if (validation?.[`score${BlockNum}`]) {
            const scoreValid: any = Object.values(scoreObject).find(
              (item: any) => item,
            );
            // setValidation({
            //   ...validation,
            //   [`score${BlockNum}`]: scoreValid > 0 ? false : true,
            // });
            // Lokie 0007
            if(scoreValid > 0){
              setValidation({
                ...validation,
                [`Interaction${BlockNum}`]: false,
                [`score${BlockNum}`]:false
              });
            }
          }
        }

        return {
          ...prevInput,
          [interactionKey]: {
            ...prevInput[interactionKey],
            id: items[i]?.id,
            SkillTag: SkillTag,
            interaction: interaction,
            quesionTitle: questionTitle,
            optionTitleObject: optionTitleObject,
            responseObject,
            feedbackObject,
            optionsObject,
            scoreObject,
            ansObject,
          },
        };
      }
    });
    //newlyadded start
    /*
    if (BlockNum) {
      const NoteKey = `Note${items[i]?.input}`;
      const DialogKey = `Dialog${items[i]?.input}`;
      const InteractionKey = `Interaction${items[i]?.input}`;
      let modifiedid, quest = '';
      if (e.target.name == NoteKey) {
        modifiedid = items[i]?.input;
        quest = items[i]?.questNo;
      }
      if (e.target.name == DialogKey) {
        modifiedid = items[i]?.input;
        quest = items[i]?.questNo;
      }
      if (e.target.name == InteractionKey) {
        modifiedid = items[i]?.input;
        quest = items[i]?.questNo;
      }
      const modified = {
        Input: modifiedid, Quest: quest
      }
      const data = {
        previewGameId: GameId,
        playerId: user?.data?.id,
        playerType: user?.data?.id ? 'creator' : null,
        lastModifiedBlockSeq: modified,
      }
      const modifiedDataString = JSON.stringify(data);
      const result = await BlockModifiedLog(modifiedDataString);
    }
*/
    //end 
  };
  const handleSelect = (selectedOption: any, e: any, data: string) => {
    const getLastDigit = e.name.slice(-1);
    const match = e.name.match(/([a-zA-Z]+)(\d+)/);
    setLastInputName(Number(match[2]));
    const value = selectedOption ? selectedOption : '';
    setInput((prevInput: any) => {
      return {
        ...prevInput,
        [e.name]: {
          ...prevInput[e.name],
          character: data === 'character' ? value : prevInput[e.name].character,
          animation: data === 'animation' ? value : prevInput[e.name].animation,
          voice: data === 'voice' ? value : prevInput[e.name].voice,
        },
      };
    });
  };
  const handleFieldBlock = (e: ChangeEvent<HTMLInputElement>) => {
    const getValue = e.target.value;
    setBlockInput(e.target.value);
    if (getValue === '/') {
      setShowBox(true);
    } else {
      setShowBox(false);
    }

    const keyword = 'Press Enter Button on your Keyboard';
    if (getValue === 'N' || getValue === 'D' || getValue === 'I') {
      setNotify(keyword);
    } else {
      setNotify('');
    }
  };

  // Items will change based on sequence state
  useEffect(() => {
    const updatedSeq = sequence.map(
      (item: any, index: number) => dummySequence[index] || item.id,
    );

    const updatedItems = items.map((item: any, index: number) => ({
      ...item,
      id: updatedSeq[index] || item.id,
      upNext: upNextCount[index],
    }));

    const updateInteraction = items.map((item: any, index: number) => {
      if (item?.type === 'Interaction') {
        return { ...item, from: item.id, to: updatedSeq[index] || item.id };
      }
      return null; // Return null for items that don't meet the condition
    });

    const updatedAlphabet = alphabet.map((item: MyObject) => {
      // Find the corresponding updateInteraction item
      const correspondingUpdate = updateInteraction.find(
        (updateItem: any) => updateItem?.from === item.seqs,
      );
      // If a corresponding updateInteraction item is found, update the seqs value
      if (correspondingUpdate) {
        return { ...item, seqs: correspondingUpdate.to };
      }

      // If no corresponding updateInteraction item is found, return the original item
      return item;
    });

    setAlphabet(updatedAlphabet);

    setItems(updatedItems);
    setBlockItems(updatedItems);
  }, [sequence, dummySequence, id]);
  // upNext count will change based on last Items
  useEffect(() => {
    const data = items.slice(-1);
    const getFilter = data.find((item: any) => item);
    const getUpNext = getFilter?.upNext;
    setUpNext(getUpNext);
  }, [items]);

  useEffect(() => {
    if (isDeleteSeq) {
      const updatedSeq = sequence.map(
        (item: any, index: number) => dummySequence[index] || item.id,
      );

      const updatedItems = items.map((item: any, index: number) => ({
        ...item,
        id: updatedSeq[index] || item.id,
        upNext: upNextCount[index],
      }));
      const updateInteraction = items.map((item: any, index: number) => {
        if (item?.type === 'Interaction') {
          return { ...item, from: item.id, to: updatedSeq[index] || item.id };
        }
        return null; // Return null for items that don't meet the condition
      });

      const updatedAlphabet = alphabet.map((item: MyObject) => {
        // Find the corresponding updateInteraction item
        const correspondingUpdate = updateInteraction.find(
          (updateItem: any) => updateItem?.from === item.seqs,
        );
        // If a corresponding updateInteraction item is found, update the seqs value
        if (correspondingUpdate) {
          return { ...item, seqs: correspondingUpdate.to };
        }

        // If no corresponding updateInteraction item is found, return the original item
        return item;
      });
      setAlphabet(updatedAlphabet);

      setItems(updatedItems);
      setBlockItems(updatedItems);

      setDeleteseq(false);
    }
  }, [isDeleteSeq]);

  const handleClickOutside = (event: any) => {
    const concernedElement = document.querySelector('.MiniShowBox');
    const concernedElementshowBox = document.querySelector('.showBox');
    if (concernedElement && !concernedElement.contains(event.target)) {
      setShowMiniBox(false);
    }
    if (
      concernedElementshowBox &&
      !concernedElementshowBox.contains(event.target)
    ) {
      setShowBox(false);
    }
  };

  // components
  const MiniBox = (props: {
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
        top={'50px'}
        left={'0px'}
        boxShadow={'1px 1px 17px #69627914'}
        borderRadius={'8px'}
        zIndex={99}
        className="MiniShowBox"
      >
        <List cursor={'pointer'}>
          <ListItem
            onClick={() => handleMiniNDI(seq, i, 'Note')}
            p={'10px'}
            display={'flex'}
            alignItems={'center'}
            borderBottom={'2px solid #f1f1f170'}
          >
            <Icon as={MdOutlineStickyNote2} mr={'10px'} color={'#3311db'} />
            Note
          </ListItem>
          <ListItem
            onClick={() => handleMiniNDI(seq, i, 'Dialog')}
            p={'10px'}
            display={'flex'}
            alignItems={'center'}
            borderBottom={'2px solid #f1f1f170'}
          >
            <Icon as={TbMessages} mr={'10px'} color={'#3311db'} />
            Dialog
          </ListItem>
          <ListItem
            onClick={() => handleMiniNDI(seq, i, 'Interaction')}
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

  const handleSubmit1 = () => {
    // Assuming seq.input is the data value to be validated
    if (typeof items === 'object' && items !== null) {
      var inputData = items;
      for (var i = 0; i < inputData.length; i++) {
        var key = inputData[i];
        var inputkey = key.type + key.input;
        if (key.type === 'Note') {
          var note = input[inputkey].note;

          if (note === '') {
            toast({
              title: `Note is Empty On This Sequence ${key.id} `,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            return false;
          }
        }
        if (key.type === 'Dialog') {
          var Dialog = input[inputkey].Dialog;
          var animation = input[inputkey].animation;
          var voice = input[inputkey].voice;

          if (Dialog === '') {
            toast({
              title: `Dialogue is Empty On This Sequence ${key.id} `,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            return false;
          }
          if (animation === '') {
            toast({
              title: `Animation is Empty On This Sequence ${key.id} `,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            return false;
          }
          if (voice === '') {
            toast({
              title: `Voice is Empty On This Sequence ${key.id} `,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            return false;
          }
        }
        if (key.type === 'Interaction') {
          var QuestionsEmotion = input[inputkey].QuestionsEmotion;
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  //This function use for review read state update 0 to 1 
  const handleMouseEnter = async (review: any, index: number) => {
    try {

      if (review.readStatus === 0) {
        const sendreviews = JSON.stringify(review);
        // Make the API call with the extracted data
        const res = await addReadStatus(sendreviews);
        if (res?.status === 200 || res?.status === "Success") {
          // const updatedReview = {...review, "readStatus": 1}
          reviews[index] = { ...review, "readStatus": 1 };
          // console.log updatedReviews
          const updatedReviews = [...reviews];
          setReviews(updatedReviews);
          const filteredReviews = updatedReviews.filter((item: any) => item.tabId === '4');
        }
        // Handle the API response (optional)
      }

      return;

    } catch (error) {
      // Handle errors that may occur during the API call
      console.error('API Error:', error);
    }
  };
  useEffect(() => {
    if (reviews.length > 0) {

      const blockSeqArray: string[] = [];
      reviews.forEach((review: any) => {
        if (review?.tabId === 4 && review?.tabAttribute === "blockSeqId") {
          const tableSeqId = review?.tabAttributeValue;
          blockSeqArray.push(tableSeqId)
        }
      });
      const blockSeqSet = new Set(blockSeqArray);
      // Get all Values
      const myIterator = blockSeqSet.values();
      // List all Values
      for (const seq of myIterator) {
        getBlockReadUnreadCount(seq);
      }
    }
  }, [reviews])
  const getBlockReadUnreadCount = async (seqId: string) => {
    const result = { readCount: 0, unReadCount: 0, Total: 0 }
  
    /** get the reviews of blockSeq  */
    const filteredBlockReviews = reviews && reviews.filter((review: any) => {
      if (review?.tabId === 4 && review?.tabAttribute === "blockSeqId") {
        const tableSeqId = review?.tabAttributeValue;
        if (seqId === tableSeqId) {
          if (review.readStatus === 0) {
            result.unReadCount++; 
          } else {
            result.readCount++; 
          }
          result.Total++;
          return true;
        }
      }
      return false;
    })
    setBlockWiseReviewCount((prev:any) => ({ ...prev, [seqId]: result }));
    // return result;
  }
 useEffect(() => {
    const fetchData = async () => {
      const data = {
        items: items,
        input: input,
        alphabet: alphabet,
      };
      try {
        const result = await storyEngAudio(id, JSON.stringify(data)); // Pass questNo directly
        if (result?.status !== 'Success') {
          return console.log('updateBackground error :' + result?.err);
        } else {
          console.log('result dataZ', result.data);
        }
      } catch (error) {
        console.error('An error occurred while sending the request:', error);
      }
    };
    fetchData(); // Call fetchData function when items change
  }, [items]);

  useEffect(() => {
    const fetchDataInteraction = async () => {
      const data = {
        items: items,
        input: input,
        alphabet: alphabet,
      };
      try {
        const result = await StoryInteractionAudio(id, JSON.stringify(data)); // Pass questNo directly
        if (result?.status !== 'Success') {
          return console.log('updateBackground error :' + result?.err);
        } else {
          console.log('result dataZZ', result.data);
        }
      } catch (error) {
        console.error('An error occurred while sending the request:', error);
      }
    };
    fetchDataInteraction(); // Call fetchDataInteraction function when items change
  }, [items]);
  // Lokie Add 12/06/2024
  useEffect(() => {
    items.forEach((seq:any, i:number) => {
      console.log("items",items)
      if (
        validation &&
        (
          validation[`Note${seq.input}`] ||
          validation[`Dialog${seq.input}`] ||
          validation?.[`Interaction${seq.input}`]
        )
      ) {
        const element = document.getElementById(`tarSeqRef${seq.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
        }
      } 
    });
  }, [validation]);
  // Lokie End 12/06/2024
  return (
    <>
      <Box
        mt={{ base: '0px', xl: '0px' }}
        className="NDI"
        position={'relative'}
      >
        {/* <Card mb={'20px'}> */}
        <Text fontSize={22} fontWeight={800} mb={'20px'}>
          Story
        </Text>
        <NDITabs
          handleGet={handleGet}
          fetchBlocks={fetchBlocks}
          listQuest={listQuest}
          questTabState={questTabState}
          setQuestTabState={setQuestTabState}
          deleteQuest={deleteQuest}
        />
        <Box className="sequence-lists" mt={'40px'} w={'100%'}>
          <CustomAccordion
            items={items}
            setItems={setItems}
            sequence={sequence}
            dummySequence={dummySequence}
            upNextCount={upNextCount}
            setAlphabet={setAlphabet}
            alphabet={alphabet}
            setBlockItems={setBlockItems}
          >
            {(type || items) &&
              items.map((seq: any, i: number) => {
                const getBlockId:any = Object.entries<BlockItem>(listBlockItems).find(([key, blocks]) => blocks.id === seq.id);
                const blockId = getBlockId ? getBlockId[1]?.blockId : null;
                return (
                  <Draggable key={seq.id} draggableId={seq.id} index={i}>
                    {(provided, dragData) => {
                          //Afrith-modified-starts-02/May/24 - drag only in vertical not horizontal
                          if (provided.draggableProps.style && !Object.isFrozen(provided.draggableProps.style)) {
                            let transform = provided.draggableProps.style.transform;
                            if (transform) {
                              let t = transform.split(",")[1];
                              provided.draggableProps.style.transform = "translate(0px," + t;
                            }
                          }
                        //Afrith-modified-ends-02/May/24 - drag only in vertical not horizontal
  
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Box key={i} className='block-item-type'>
                            {seq.type === 'Note' ? (
                              <ScaleFade initialScale={0.9} in={true}>
                                <Card
                                  id={`tarSeqRef${seq.id}`}
                                  className='target-block'
                                  position={'relative'}
                                  boxShadow={
                                    seq.input === lastInputName
                                      ? '1px 2px 13px #a2a1b00a'
                                      : 'unset'
                                  }
                                  borderRadius={'20px'}
                                  transition={'0.1s linear'}
                                  borderWidth={{ base: seq.id === targetSequence?.id && '3px 3px 3px 3px', sm: seq.id === targetSequence?.id && '3px 3px 3px 3px', lg: seq.id === targetSequence?.id && '0 0 0 3px' }}
                                  borderStyle={{ base: seq.id === targetSequence?.id && 'solid solid solid solid', sm: seq.id === targetSequence?.id && 'solid solid solid solid', lg: seq.id === targetSequence?.id && 'unset unset unset solid' }}
                                  borderColor={{ base: seq.id === targetSequence?.id && '#3311db #3311db #3311db #3311db', sm: seq.id === targetSequence?.id && '#3311db #3311db #3311db #3311db', lg: seq.id === targetSequence?.id && 'unset unset unset #3311db' }}
                                  background={
                                    seq.input === lastInputName ||
                                      dragData.isDragging === true ||
                                      seq.id === targetSequence?.id
                                      ? null //Afrith-modified-starts-02/May/24 - unset previous (Note)block focusing color
                                      : 'unset'  //Afrith-modified-starts-02/May/24 - unset previous (Note)block focusing color
                                  }
                                  _hover={{ background: '#f7f7f5' }}
                                  zIndex={
                                    seq.input === lastInputName ? '9' : 'unset'
                                  }
                                  tabIndex={0}
                                  onClick={(e) => handleKeyDown(e, i, seq)}
                                  onKeyDown={(e) => handleKeyDown(e, i, seq)}
                                  height={seq.id === targetSequence?.id ? '100%' : '170px'}
                                // overflowY={'hidden'}    
                                >
                                  <Text color={'gray.400'}>Note</Text>
                                  <NoteCompo
                                    targetSequence={targetSequence}
                                    ShowReview={ShowReview}
                                    seq={seq}
                                    index={i}
                                    name={'Note'}
                                    getSeq={getSeq}
                                    duplicateSeq={duplicateSeq}
                                    delSeq={delSeq}
                                    alphabet={alphabet}
                                    input={input}
                                    setNavigation={setNoteNavigation}
                                    showSelectBlock={showSelectBlock}
                                    handleBlock={setNotelead}
                                    handleSelectBlock={handleNoteNavigation}
                                    items={items}
                                    setSelectBlock={setNotelead}
                                    handleInput={(e: any) => handleInput(e, i, seq.input)}
                                    handleNDI={handleNDI}
                                    validation={validation}
                                    currentseq={count}
                                    blockOnFocusHanlder={blockOnFocusHanlder}
                                    blockOnBlurHanlder={blockOnBlurHanlder}
                                  />
                                  {/* Review Preview Accordian for Note*/}
                                  {ShowReview ? (
                                    <Accordion allowToggle>
                                      <AccordionItem>
                                        <h2>
                                          <AccordionButton>
                                            <Box
                                              as="span"
                                              // flex="1"
                                              w={'100%'}
                                              display={'flex'}
                                              justifyContent={'space-between'}
                                              textAlign="left"
                                              fontSize={'0.875rem'}
                                              color={textColor}
                                            >
                                              <Text>
                                                See All Reviews
                                              </Text>
                                              <Text>Read: {blockWiseReviewCount[blockId]?.readCount ?? '0'}</Text>
                                              <Text>Unread: {blockWiseReviewCount[blockId]?.unReadCount ?? '0'}</Text>
                                            </Box>
                                            <AccordionIcon />
                                          </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                          {reviews &&
                                            reviews
                                              .filter(
                                                (item: any) =>
                                                  item?.tabAttributeValue === blockId
                                              )
                                              .map((value: any, ind: number) => {
                                                const reviewer =
                                                  reviewers &&
                                                  reviewers.find(
                                                    (rev: any) =>
                                                      rev?.gameReviewerId ===
                                                      value?.gameReviewerId,
                                                  );
                                                return (
                                                  <Box key={ind} onMouseEnter={() => handleMouseEnter(value, ind)}>
                                                    <Box
                                                      w={'100%'}
                                                      display={'flex'}
                                                      justifyContent={
                                                        'space-between'
                                                      }
                                                      key={ind}
                                                    >
                                                      <Box
                                                        w={'100%'}
                                                        display={'flex'}
                                                        alignItems={'center'}
                                                      >
                                                        <Img
                                                          src={pro}
                                                          w={'40px'}
                                                          h={'40px'}
                                                          alt="pro"
                                                          borderRadius={'50%'}
                                                        />
                                                        <Text ml={'15px'}>
                                                          {reviewer?.emailId ===
                                                            null
                                                            ? reviewer
                                                              ?.ReviewingCreator
                                                              ?.ctMail
                                                            : reviewer?.emailId}
                                                        </Text>
                                                      </Box>
                                                      <Box whiteSpace={'nowrap'}>
                                                        <Text fontSize={'14'}>
                                                          Posted On :
                                                          {value?.updatedAt
                                                            ? new Date(
                                                              value.updatedAt,
                                                            ).toLocaleDateString()
                                                            : ''}
                                                        </Text>
                                                      </Box>
                                                    </Box>
                                                    <Box mb={'10px'} mt={'10px'}>
                                                      {value?.review}
                                                    </Box>
                                                    </Box>
                                              );
                                            })}
                                        {(!reviews ||
                                          reviews.length === 0 ||
                                          reviews.filter(
                                            (item: any) =>
                                              item?.tabAttributeValue == blockId
                                              // `${seq?.questNo}@${seq?.input}`,
                                          ).length === 0) && (
                                            <Box
                                              w={'100%'}
                                              display={'flex'}
                                              alignItems={'center'}
                                              justifyContent={'center'}
                                            >
                                              <Text>
                                                No Reviews For This Block
                                              </Text>
                                            </Box>
                                          )}
                                      </AccordionPanel>
                                    </AccordionItem>
                                  </Accordion>
                                ) : (
                                  ''
                                )}

                                  {seq.id == showMiniBox ? (
                                    <MiniBox seq={seq} i={i} name={'Note'} />
                                  ) : null}
                                </Card>
                              </ScaleFade>
                            ) : seq.type === 'Dialog' ? (
                              <ScaleFade initialScale={0.9} in={true}>
                                <Card
                                  id={`tarSeqRef${seq.id}`}
                                  className='target-block'
                                  position={'relative'}
                                  boxShadow={
                                    seq.input === lastInputName
                                      ? '1px 2px 13px #a2a1b00a'
                                      : 'unset'
                                  }
                                  borderRadius={'20px'}
                                  transition={'0.1s linear'}
                                  borderWidth={{ base: seq.id === targetSequence?.id && '3px 3px 3px 3px', sm: seq.id === targetSequence?.id && '3px 3px 3px 3px', lg: seq.id === targetSequence?.id && '0 0 0 3px' }}
                                  borderStyle={{ base: seq.id === targetSequence?.id && 'solid solid solid solid', sm: seq.id === targetSequence?.id && 'solid solid solid solid', lg: seq.id === targetSequence?.id && 'unset unset unset solid' }}
                                  borderColor={{ base: seq.id === targetSequence?.id && '#3311db #3311db #3311db #3311db', sm: seq.id === targetSequence?.id && '#3311db #3311db #3311db #3311db', lg: seq.id === targetSequence?.id && 'unset unset unset #3311db' }}

                                  background={
                                    seq.input === lastInputName ||
                                      dragData.isDragging === true
                                      ? null //Afrith-modified-starts-02/May/24 - unset previous (Note)block focusing color
                                      : 'unset'  //Afrith-modified-starts-02/May/24 - unset previous (Note)block focusing color
                                
                                  }
                                  _hover={{ background: '#f7f7f5' }}
                                  zIndex={
                                    seq.input === lastInputName ? '9' : 'unset'
                                  }
                                  tabIndex={0}
                                  onClick={(e) => handleKeyDown(e, i, seq)}
                                  onKeyDown={(e) => handleKeyDown(e, i, seq)}
                                  style={{
                                    backgroundColor: ShowReview
                                      ? reviews && reviews.find((item: any) => {
                                        const tabAttributeValue = `${seq?.questNo}@${seq?.input}`;
                                        const isMatched = item?.tabAttributeValue === tabAttributeValue;
                                        return isMatched;
                                      })
                                        ? '#E2E8F0'
                                        : ''
                                      : '', marginBottom: '10px', // Adjust the value as per your requirement

                                  }}
                                  height={seq.id === targetSequence?.id ? '100%' : '170px'}
                                >
                                  <Text color={'gray.400'}>Dialog</Text>
                                  <DialogCompo
                                    ShowReview={ShowReview}
                                    id={id}
                                    language={formData?.gamelanguageCode}
                                    seq={seq}
                                    targetSequence={targetSequence}
                                    index={i}
                                    name={'Dialog'}
                                    getSeq={getSeq}
                                    duplicateSeq={duplicateSeq}
                                    delSeq={delSeq}
                                    input={input}
                                    handleInput={(e: any) =>
                                      handleInput(e, i, seq.input)
                                    }
                                    handleSelect={handleSelect}
                                    characterOption={characterOption}
                                    dialogOption={dialogOption}
                                    voicePoseOption={voicePoseOption}
                                    animateBtn={animateBtn}
                                    setAnimateBtn={setAnimateBtn}
                                    handleDialogEmotion={handleDialogEmotion}
                                    handleDialogVoice={handleDialogVoice}
                                    formData={formData}
                                    alphabet={alphabet}
                                    handleNDI={handleNDI}
                                    handleBlock={setDialoglead}
                                    setNavigation={setDialogNavigation}
                                    handleSelectBlock={handleDialogNavigation}
                                    items={items}
                                    handleDialogBlockRoll={
                                      handleDialogBlockRoll
                                    }
                                    showSelectBlock={showSelectBlock}
                                    setSelectBlock={setSelectBlock}
                                    validation={validation}
                                    currentseq={count}
                                    blockOnFocusHanlder={blockOnFocusHanlder}
                                    blockOnBlurHanlder={blockOnBlurHanlder}
                                  />
                                  {/* Accordian For Dialog Blocks */}
                                  {ShowReview ? (
                                    <Accordion allowToggle>
                                      <AccordionItem>
                                        <h2>
                                          <AccordionButton>
                                            <Box
                                              as="span"
                                              // flex="1"
                                              w={'100%'}
                                              display={'flex'}
                                              justifyContent={'space-between'}
                                              textAlign="left"
                                              fontSize={'0.875rem'}
                                              color={textColor}
                                            >
                                              <Text>
                                                See All Reviews
                                              </Text>
                                              <Text>Read: {blockWiseReviewCount[blockId]?.readCount ?? '0'}</Text>
                                              <Text>Unread: {blockWiseReviewCount[blockId]?.unReadCount ?? '0'}</Text>
                                            </Box>
                                            <AccordionIcon />
                                          </AccordionButton>
                                        </h2>

                                        <AccordionPanel pb={4}>
                                          {reviews &&
                                            reviews
                                              .filter(
                                                (item: any) =>
                                                  item?.tabAttributeValue === blockId
                                                  // `${seq?.questNo}@${seq?.input}`,
                                              )
                                              .map((value: any, ind: number) => {
                                                const reviewer =
                                                  reviewers &&
                                                  reviewers.find(
                                                    (rev: any) =>
                                                      rev?.gameReviewerId ===
                                                      value?.gameReviewerId,
                                                  );
                                                return (
                                                  <Box key={ind} onMouseEnter={() => handleMouseEnter(value, ind)}>
                                                    <Box
                                                      w={'100%'}
                                                      display={'flex'}
                                                      justifyContent={
                                                        'space-between'
                                                      }
                                                      key={ind}
                                                    >
                                                      <Box
                                                        w={'100%'}
                                                        display={'flex'}
                                                        alignItems={'center'}
                                                      >
                                                        <Img
                                                          src={pro}
                                                          w={'40px'}
                                                          h={'40px'}
                                                          alt="pro"
                                                          borderRadius={'50%'}
                                                        />
                                                        <Text ml={'15px'}>
                                                          {reviewer?.emailId ===
                                                            null
                                                            ? reviewer
                                                              ?.ReviewingCreator
                                                              ?.ctMail
                                                            : reviewer?.emailId}
                                                        </Text>
                                                      </Box>
                                                      <Box whiteSpace={'nowrap'}>
                                                        <Text fontSize={'14'}>
                                                          Posted On :
                                                          {value?.updatedAt
                                                            ? new Date(
                                                              value.updatedAt,
                                                            ).toLocaleDateString()
                                                            : ''}
                                                        </Text>
                                                      </Box>
                                                    </Box>
                                                    <Box mb={'10px'} mt={'10px'}>
                                                      {value?.review}
                                                    </Box>
                                                    </Box>
                                                );
                                              })}
                                          {(!reviews ||
                                            reviews.length === 0 ||
                                            reviews.filter(
                                              (item: any) =>
                                                item?.tabAttributeValue ===blockId
                                                // `${seq?.questNo}@${seq?.input}`,
                                            ).length === 0) && (
                                              <Box
                                                w={'100%'}
                                                display={'flex'}
                                                alignItems={'center'}
                                                justifyContent={'center'}
                                              >
                                                <Text>
                                                  No Reviews For This Block
                                                </Text>
                                              </Box>
                                            )}
                                        </AccordionPanel>
                                      </AccordionItem>
                                    </Accordion>) : ''}
                                  {seq.id == showMiniBox ? (
                                    <MiniBox seq={seq} i={i} name={'Dialog'} />
                                  ) : null}
                                </Card>
                              </ScaleFade>
                            ) : seq.type === 'Interaction' ? (
                              <ScaleFade initialScale={0.9} in={true}>
                                <Card
                                  id={`tarSeqRef${seq.id}`}
                                  position={'relative'}
                                  boxShadow={
                                    seq.input === lastInputName
                                      ? '1px 2px 13px #a2a1b00a'
                                      : 'unset'
                                  }
                                  borderRadius={'20px'}
                                  transition={'0.1s linear'}

                                  // borderLeft={ seq.id === targetSequence?.id ? '3px solid #3311db' : 'unset'}
                                  borderWidth={{ base: seq.id === targetSequence?.id && '3px 3px 3px 3px', sm: seq.id === targetSequence?.id && '3px 3px 3px 3px', lg: seq.id === targetSequence?.id && '0 0 0 3px' }}
                                  borderStyle={{ base: seq.id === targetSequence?.id && 'solid solid solid solid', sm: seq.id === targetSequence?.id && 'solid solid solid solid', lg: seq.id === targetSequence?.id && 'unset unset unset solid' }}
                                  borderColor={{ base: seq.id === targetSequence?.id && '#3311db #3311db #3311db #3311db', sm: seq.id === targetSequence?.id && '#3311db #3311db #3311db #3311db', lg: seq.id === targetSequence?.id && 'unset unset unset #3311db' }}
                                  background={
                                    seq.input === lastInputName ||
                                      dragData.isDragging === true
                                      ? null //Afrith-modified-starts-02/May/24 - unset previous (Note)block focusing color
                                      : 'unset'  //Afrith-modified-starts-02/May/24 - unset previous (Note)block focusing color
                                
                                  }
                                  _hover={{ background: '#f7f7f5' }}
                                  zIndex={
                                    seq.input === lastInputName ? '9' : 'unset'
                                  }
                                  tabIndex={0}
                                  onClick={(e) => handleKeyDown(e, i, seq)}
                                  style={{
                                    backgroundColor: ShowReview
                                      ? reviews && reviews.find((item: any) => {
                                        const tabAttributeValue = `${seq?.questNo}@${seq?.input}`;
                                        const isMatched = item?.tabAttributeValue === tabAttributeValue;
                                        return isMatched;
                                      })
                                        ? '#E2E8F0'
                                        : ''
                                      : '', marginBottom: '10px', // Adjust the value as per your requirement
                                    transition: 'height 1s ease',
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e, i, seq)}
                                  height={seq.id === targetSequence?.id ? '100%' : '170px'
                                  }                   
                                >
                                  <Text color={'gray.400'}>Interaction</Text>
                                  <InteractionCompo
                                    ShowReview={ShowReview}
                                    id={id}
                                    language={formData?.gamelanguageCode}
                                    seq={seq}
                                    targetSequence={targetSequence}
                                    index={i}
                                    name={'Interaction'}
                                    number={number}
                                    dummySequence={dummySequence}
                                    getSeq={getSeq}
                                    duplicateSeq={duplicateSeq}
                                    delSeq={delSeq}
                                    input={input}
                                    handleNDI={handleNDI}
                                    handleInput={(e: any) =>
                                      handleInput(e, i, seq.input)
                                    }
                                    handleSelect={handleSelect}
                                    characterOption={characterOption}
                                    alphabet={alphabet}
                                    setAlphabet={setAlphabet}
                                    animateBtn={animateBtn}
                                    inputtextValue={inputtextValue}
                                    setAnimateBtn={setAnimateBtn}
                                    interactionBlock={interactionBlock}
                                    setInteractionBlock={setInteractionBlock}
                                    formData={formData}
                                    handleBlockRoll={handleBlockRoll}
                                    handleResponseRoll={handleResponseRoll}
                                    handleQuestionEmotion={
                                      handleQuestionEmotion
                                    }
                                    handleOptionEmotion={handleOptionEmotion}
                                    handleResponseEmotion={
                                      handleResponseEmotion
                                    }
                                    handleCheckBox={handleCheckBox}
                                    handleOptionVoice={handleOptionVoice}
                                    handleQuestionVoice={handleQuestionVoice}
                                    setNavigation={setNavigation}
                                    handleSelectBlock={handleSelectBlock}
                                    handleBlock={handleBlock}
                                    countalphabet={countalphabet}
                                    setAlphabetCount={setAlphabetCount}
                                    items={items}
                                    handleTagsChange={handleTagsChange}
                                    showSelectBlock={showSelectBlock}
                                    setSelectBlock={setSelectBlock}
                                    validation={validation}
                                    currentseq={count}
                                    blockOnFocusHanlder={blockOnFocusHanlder}
                                    blockOnBlurHanlder={blockOnBlurHanlder}
                                  />
                                  {/* Accordian for Interaction Blocks */}
                                  {ShowReview ? (
                                    <Accordion allowToggle>
                                      <AccordionItem>
                                        <h2>
                                          <AccordionButton>
                                            <Box
                                              as="span"
                                              // flex="1"
                                              w={'100%'}
                                              display={'flex'}
                                              justifyContent={'space-between'}
                                              textAlign="left"
                                              fontSize={'0.875rem'}
                                              color={textColor}
                                            >
                                              <Text>
                                                See All Reviews
                                              </Text>
                                              <Text>
                                              <Text>Read: {blockWiseReviewCount[blockId]?.readCount ?? '0'}</Text>
                                              <Text>Unread: {blockWiseReviewCount[blockId]?.unReadCount ?? '0'}</Text>
                                              </Text>
                                            </Box>
                                            <AccordionIcon />
                                          </AccordionButton>
                                        </h2>

                                        <AccordionPanel pb={4}>
                                          {reviews &&
                                            reviews
                                              .filter(
                                                (item: any) =>
                                                  item?.tabAttributeValue === blockId
                                                  // `${seq?.questNo}@${seq?.input}`,
                                              )
                                              .map((value: any, ind: number) => {
                                                const reviewer =
                                                  reviewers &&
                                                  reviewers.find(
                                                    (rev: any) =>
                                                      rev?.gameReviewerId ===
                                                      value?.gameReviewerId,
                                                  );
                                                return (
                                                  <>
                                                    <Box
                                                      w={'100%'}
                                                      display={'flex'}
                                                      justifyContent={
                                                        'space-between'
                                                      }
                                                      key={ind}
                                                    >
                                                      <Box
                                                        w={'100%'}
                                                        display={'flex'}
                                                        alignItems={'center'}
                                                      >
                                                        <Img
                                                          src={pro}
                                                          w={'40px'}
                                                          h={'40px'}
                                                          alt="pro"
                                                          borderRadius={'50%'}
                                                        />
                                                        <Text ml={'15px'}>
                                                          {reviewer?.emailId ===
                                                            null
                                                            ? reviewer
                                                              ?.ReviewingCreator
                                                              ?.ctMail
                                                            : reviewer?.emailId}
                                                        </Text>
                                                      </Box>
                                                      <Box whiteSpace={'nowrap'}>
                                                        <Text fontSize={'14'}>
                                                          Posted On :
                                                          {value?.updatedAt
                                                            ? new Date(
                                                              value.updatedAt,
                                                            ).toLocaleDateString()
                                                            : ''}
                                                        </Text>
                                                      </Box>
                                                    </Box>
                                                    <Box mb={'10px'} mt={'10px'}>
                                                      {value?.review}
                                                    </Box>
                                                  </>
                                                );
                                              })}
                                          {(!reviews ||
                                            reviews.length === 0 ||
                                            reviews.filter(
                                              (item: any) =>
                                                item?.tabAttributeValue ===blockId
                                                // `${seq?.questNo}@${seq?.input}`,
                                            ).length === 0) && (
                                              <Box
                                                w={'100%'}
                                                display={'flex'}
                                                alignItems={'center'}
                                                justifyContent={'center'}
                                              >
                                                <Text>
                                                  No Reviews For This Block
                                                </Text>
                                              </Box>
                                            )}
                                        </AccordionPanel>
                                      </AccordionItem>
                                    </Accordion>)
                                    : ''}
                                  {seq.id == showMiniBox ? (
                                    <MiniBox
                                      seq={seq}
                                      i={i}
                                      name={'Interaction'}
                                    />
                                  ) : null}
                                </Card>
                              </ScaleFade>
                            ) : null}
                          </Box>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
          </CustomAccordion>
        </Box>

        <Box
          className="bottom-block"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Tooltip hasArrow label="Add Note">
            <Box
              mr={'20px'}
              p={'20px'}
              h={'60px'}
              w={'60px'}
              color={'#3311db'}
              display={'grid'}
              placeItems={'center'}
              borderRadius={'100px'}
              boxShadow={'1px 3px 10px #6565641f'}
              cursor={'pointer'}
              filter={'drop-shadow(4px 5px 8px #8080807d)'}
              _hover={{ boxShadow: '#7090b01a 0px 18px 22px inset' }}
              onClick={() => handleBottomNDI('Note')}
            >
              <Icon as={MdOutlineStickyNote2} fontSize={'23px'} />
            </Box>
          </Tooltip>
          <Tooltip hasArrow label="Add Dialog">
            <Box
              mr={'20px'}
              p={'20px'}
              h={'60px'}
              w={'60px'}
              color={'#3311db'}
              display={'grid'}
              placeItems={'center'}
              borderRadius={'100px'}
              boxShadow={'1px 3px 10px #6565641f'}
              cursor={'pointer'}
              filter={'drop-shadow(4px 5px 8px #8080807d)'}
              _hover={{ boxShadow: '#7090b01a 0px 18px 22px inset' }}
              onClick={() => handleBottomNDI('Dialog')}
            >
              <Icon as={TbMessages} fontSize={'23px'} />

            </Box>
          </Tooltip>
          <Tooltip hasArrow label="Add Interaction">
            <Box
              mr={'20px'}
              p={'20px'}
              h={'60px'}
              w={'60px'}
              color={'#3311db'}
              display={'grid'}
              placeItems={'center'}
              borderRadius={'100px'}
              boxShadow={'1px 3px 10px #6565641f'}
              cursor={'pointer'}
              filter={'drop-shadow(4px 5px 8px #8080807d)'}
              _hover={{ boxShadow: '#7090b01a 0px 18px 22px inset' }}
              onClick={() => handleBottomNDI('Interaction')}
            >
              <Icon as={TbHandClick} fontSize={'23px'} />
            </Box>
          </Tooltip>
        </Box>
        {/* </Card> */}
      </Box>
      <ChatButton />
    </>
  );
};

export default NDIMain;
