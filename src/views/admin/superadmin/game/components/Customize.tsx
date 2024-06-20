import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomList from './NDI_Main';
import Note from './NoteForm';
import Dialog from './DialogForm';
import Interaction from './InteractionForm';

interface PropsInteraction {
  id?: any;
  formData?: any;
  setBlockItems?: any;
  serias?: any;
  setserias?: any;
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
  fetchBlocks?: any;
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
  ShowReview?:any;
  listBlockItems?:any;
}

const Customize: React.FC<PropsInteraction> = ({
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
  setUpNextCount,
  upNextCount,
  reviewers,
  reviews,
  validation,
  setValidation,
  ShowReview,
  listBlockItems,
}) => {
  const [showComponent, setComponent] = useState('CustomList');
  const navigate = useNavigate();

  const handleShowComponent = (componentName: string) => {
    setComponent(componentName);
  };
  return (
    <>
      {showComponent === 'CustomList' && (
        <CustomList
          handleShowComponent={handleShowComponent}
          id={id}
          formData={formData}
          setBlockItems={setBlockItems}
          serias={serias}
          setserias={setserias}
          setInput={setInput}
          input={input}
          setItems={setItems}
          items={items}
          alphabet={alphabet}
          setAlphabet={setAlphabet}
          interactionBlock={interactionBlock}
          setInteractionBlock={setInteractionBlock}
          countalphabet={countalphabet}
          setAlphabetCount={setAlphabetCount}
          count={count}
          setCount={setCount}
          sequence={sequence}
          setSequence={setSequence}
          dummySequence={dummySequence}
          setDummySequence={setDummySequence}
          showSelectBlock={showSelectBlock}
          setSelectBlock={setSelectBlock}
          targetSequence={targetSequence}
          handleKeyDown={handleKeyDown}
          isDeleteSeq={isDeleteSeq}
          setDeleteseq={setDeleteseq}
          handleGet={handleGet}
          fetchBlocks={fetchBlocks}
          listQuest={listQuest}
          questTabState={questTabState}
          setQuestTabState={setQuestTabState}
          deleteQuest={deleteQuest}
          upNextCount={upNextCount}
          setUpNextCount={setUpNextCount}
          reviews={reviews}
          reviewers={reviewers}
          validation={validation}
          setValidation={setValidation}
          ShowReview={ShowReview}			
          listBlockItems={listBlockItems}			
        />
      )}
      {showComponent === 'Note' && (
        <Note handleShowComponent={handleShowComponent} />
      )}
      {showComponent === 'Dialog' && (
        <Dialog handleShowComponent={handleShowComponent} />
      )}
      {showComponent === 'Interaction' && (
        <Interaction handleShowComponent={handleShowComponent} />
      )}
    </>
  );
};

export default Customize;
