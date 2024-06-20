import React from 'react';
import { Divider, Flex } from '@chakra-ui/react';
interface PropsNote {
  name?: any,

}

const StrightConnector: React.FC<PropsNote> = ({ name }) => {
  return (
    <Flex direction="row" align="center">
      <Divider orientation="horizontal" borderColor="grey" borderWidth="1px" width="50px" my={4} />
      {/* Dot at the end */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '20',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'grey',
            zIndex: 1, // Set a higher zIndex to make the dot overlap the line
          }}
        />
        <span style={{ marginLeft: '22px', textAlign: 'right', fontSize: '14px', top: '5px', color: 'grey' }}>
          {name}
        </span>
      </div>

      {/* Your other content */}

    </Flex>


  );
};

export default StrightConnector;