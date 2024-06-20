import React, { useState } from 'react';

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
	[x: string]: any;
}) {
	const { id, label, type, extra, isRequired, options, mb,onChange,value,isDisabled, ...rest } = props;
  const customStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '15px',
      height: '45px',
      padding: '0 !important',
    }),
    // Add more style modifications as needed
  };
  
  // Chakra Color Mode
	const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
// console.log('value111',value);

    const [input, setInput] = useState(null);  

   
    const handleSelectChange = (selectedOption: OptionType | null) => {
      console.log(input);
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
            
    };
  
   

	return (
		<Flex direction='column' mb={mb ? mb : '30px'}>
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
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999, }), control: (provided: any, state: any) => ({
              ...provided,
              borderRadius: '15px',
              height: '45px',
              padding: '0 !important',
              borderColor: '#e0e5f2',
              width: '100%',
              maxWidth: '100%'

            }), }}
            options={options}
            onChange={handleSelectChange}
            isClearable={true} // Optional: allow clearing the selection
            isSearchable={true} // Optional: enable searching  
            className='react-select'
            value={value}
            isDisabled={isDisabled}  
            // styles={customStyle}           
        />
		</Flex>
	);
}
