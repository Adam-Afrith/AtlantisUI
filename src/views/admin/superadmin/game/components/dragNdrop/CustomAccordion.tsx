import { Box, } from '@chakra-ui/react'
import { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';


type ItemType = {
  id: string;
  name: string;
  content: string; 
  type: string;

};


const CustomAccordion = (props: { items: any, setItems: any, sequence?: any, dummySequence?: any, children?: any, upNextCount?: any, setAlphabet?: any, alphabet?: any, setBlockItems?: any }) => {

  const { items, setItems, sequence, dummySequence, children, upNextCount, setAlphabet, alphabet, setBlockItems } = props;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    // const reorderedItems = Array.from(items);
    const reorderedItems: ItemType[] = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    // Update the id based on the original order        
    // const updatedItems = reorderedItems.map((item: ItemType, index) => (
    //     console.log('from',item.id+'---to---'+sequence[index]);
    //     { ...item, id: sequence[index] || item.id, upNext: upNextCount[index]  }

    //     ));

    const updateInteraction = reorderedItems.map((item, index) => {
      if (item?.type === 'Interaction') {
        return { ...item, from: item.id, to: sequence[index] };
      }
      return null; // Return null for items that don't meet the condition
    }).filter(item => item !== null);

    const updatedAlphabet = alphabet.map((item: { seqs: string; }) => {
      // Find the corresponding updateInteraction item
      const correspondingUpdate = updateInteraction.find(updateItem => updateItem.from === item.seqs);

      // If a corresponding updateInteraction item is found, update the seqs value
      if (correspondingUpdate) {
        return { ...item, seqs: correspondingUpdate.to };
      }

      // If no corresponding updateInteraction item is found, return the original item
      return item;
    });

    const dummySeq = Array.from(new Set(dummySequence))
    const updatedItems = reorderedItems.map((item: ItemType, index) => {
      return { ...item, id: dummySequence[index] || item.id, upNext: upNextCount[index] };
    });

    setAlphabet(updatedAlphabet);
    setItems(updatedItems);
    setBlockItems(updatedItems)
    console.log('reorderedItems', updatedItems);
  };

  return (
    <Box className='section'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="your-droppable-id" >
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className='hooky'>
              {/* {items.map((item, index) => (             */}
              {children}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default CustomAccordion
