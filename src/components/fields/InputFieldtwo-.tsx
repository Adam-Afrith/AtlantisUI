import { Flex, FormLabel, Input, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const InputField = React.forwardRef<HTMLInputElement, {
  id?: string;
  label?: string;
  extra?: JSX.Element;
  placeholder?: string;
  type?: string;
  isRequired?: boolean;
  mb?: string;
  border?: any; 
}>(function Default(props, ref) {
  const { id, label, extra, placeholder, type, isRequired, border, mb, ...rest } = props;
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex direction='column' mb={mb ? mb : '30px'}>
      <FormLabel
        display='flex'
        ms='10px'
        htmlFor={id}
        fontSize='sm'
        color={textColorPrimary}
        fontWeight='bold'
        _hover={{ cursor: 'pointer' }}>
        {label}
        {isRequired && <Text as='span' color='red.500'>*</Text>}
        <Text fontSize='sm' fontWeight='400' ms='2px'>
          {extra}
        </Text>
      </FormLabel>
      <Input
        {...rest}
        type={type}
        id={id}
        fontWeight='500'
        variant='main'
        placeholder={placeholder}
        _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
        h='44px'
        maxH='44px'
        ref={ref}
		border={border}
      />
    </Flex>
  );
});

export default InputField;
