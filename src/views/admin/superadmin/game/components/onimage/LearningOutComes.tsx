import React from 'react';
import { Box, Img, Text } from '@chakra-ui/react';

const LearningOutComes:React.FC<{data: any, preloadedAssets: any}> = ({data, preloadedAssets}) => {
    return (
          <>
           

    {data &&
        data.map((it: any, ind: number) => {
          const bulletIndex = it.indexOf('\u2022');
          const contentAfterBullet =
            bulletIndex !== -1
              ? it.slice(bulletIndex + 1).trim()
              : it;
          return (
            <Box key={ind} className='slo-content'> 
              <Img src={preloadedAssets?.write} className='welcomescreen-bulletsImg' />
                  <Text className="welcomescreen-content slo-content">
                    {contentAfterBullet}
                  </Text>
              </Box>
          );
        })}
</>
)}


export default LearningOutComes;