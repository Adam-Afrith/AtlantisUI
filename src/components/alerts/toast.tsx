import { useToast } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';



const Toast = (props: {msg:any, status:any, setAlert?:any, position?:any}) => {

    const {msg, status, setAlert, position} = props;    
    const toast  = useToast();
      

    useEffect(()=>{                              
       toast({        
              title: msg,
              status: status,
              duration: 3000,
              isClosable: true,
              position: position        
          });        
        
        setTimeout(()=>{          
          setAlert(false);          
        },300)        
    },[msg, status, toast])
           

  return (
    <></>
  );  
}

export default Toast;