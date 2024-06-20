import React, { useState ,useRef, useEffect } from 'react';

// Chakra imports
import { Flex, FormLabel, Input, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components

//  React Select Imports
import Select from 'react-select';


// Define the type for the options
interface OptionType {
    value: string;
    label: string;
  }


export default function Default(props: {
	id?: string;
	label?: string;
	// options?: Array;
    extra?: string;
    isRequired?: boolean;
	type?: string;
    value?: OptionType | null; // Add the value prop
    isDisabled?: boolean;
    border?: any; 
    handleSeletAttr?:any
  onSelectRefChange?: (selectRef: React.RefObject<Select>) => void; // Add onSelectRefChange prop
  [x: string]: any;
 }) {
	const { id, label, type, extra, isRequired, options, mb,onChange,value,isDisabled,handleSeletAttr,onSelectRefChange, ...rest } = props;
// useEffect(()=>{
// console.log('handleSeletAttrformselect',handleSeletAttr);
// },[handleSeletAttr]);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: handleSeletAttr ? '#f56565':'', // Set the border color to red when focused
      borderRadius: '15px', // Adjust the border radius here
      height: '45px',
      padding :'0 !important',
      maxWidth:'100%',
    }),
    // Add more style modifications as needed
  };
  

	// Chakra Color Mode
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
// console.log('value111',value);

    const [input, setInput] = useState(null);  
    const selectRef = useRef(null);
   
    const handleSelectChange = (selectedOption: OptionType | null ) => {
      console.log('Select Ref:',selectRef.current.select);
        if(selectedOption) {        
           setInput(selectedOption.value);
            if (onChange) {
                onChange(selectedOption ? selectedOption : ''); 
    
              }
            }
            else {
              setInput('');
              if (onChange) {
                onChange(''); 
              }
          }
          if (onSelectRefChange) {
            onSelectRefChange(selectRef);
          }
    };
  
   

	return (
		<Flex direction='column' mb={mb ? mb : '30px'}   >
			<FormLabel
				display='flex'
				// ms='10px'
				htmlFor={id}
				fontSize='sm'
				color={textColorPrimary}
				fontWeight='bold'
				_hover={{ cursor: 'pointer' }}>
				 {label}
        {isRequired && <Text as="span" color="red.500">*</Text>} {/* Display asterisk for required field */}
        <Text fontSize="sm" fontWeight="400" ms="2px">
          {extra}
        </Text>
      </FormLabel>
			<Select
        ref={selectRef}
       options={options}
        onChange={handleSelectChange}
             isClearable={true} // Optional: allow clearing the selection
                isSearchable={true} // Optional: enable searching  
                className='react-select'
                value={value}
                isDisabled={isDisabled}    
               
                styles={customStyles}
            />
		</Flex>
	);
}
