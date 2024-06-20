import { Flex, FormLabel, Input, Text, useColorModeValue } from '@chakra-ui/react';
import React, {ChangeEvent }  from 'react';

const InputField = React.forwardRef<HTMLInputElement, {
  id?: string;
  value?:any;
  name?: string;
  label?: string;
  extra?: JSX.Element;
  placeholder?: string;
  type?: string;
  isRequired?: boolean;
  mb?: string;
  border?: any; 
  me?: string; // Add this line
  onChange?: any;
  disabled?: boolean;
  autoComplete?: string;
  defaultValue?: any;
  style?: any;
  onBlur?: any;
}>(function Default(props, ref) {
  const { id, name, value, label, extra, placeholder, type, isRequired, border, mb,me,onChange,disabled,autoComplete,style,defaultValue,onBlur, ...rest } = props;
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex direction='column' mb={mb ? mb : '30px'}>
      <FormLabel
        display='flex'
        // ms='10px'
        me='30px'
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
        name={name}
        value = {value}
        fontWeight='500'
        variant='main'
        placeholder={placeholder}
        _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
        h='44px'
        maxH='44px'
        ref={ref}
		border={border}
    onChange = {onChange}
    disabled ={disabled}
    autoComplete ={autoComplete}
    defaultValue={defaultValue}
    style = {style}
    onBlur={onBlur}
      />
    </Flex>
  );
});

export default InputField;
