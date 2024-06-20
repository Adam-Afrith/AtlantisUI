import React from 'react';
import { Box, Img, Text } from '@chakra-ui/react';

const Skills: React.FC<{
  authorArray: any;
  preloadedAssets: any;
  findSkillName: any;
}> = ({ authorArray, preloadedAssets, findSkillName }) => {
  return (
    <>

      {authorArray && authorArray
        .map((authorItem: any, index: number) => {
          const skillName = findSkillName(authorItem);
          return skillName;
        })
        .filter((skillName: any) => skillName !== null)
        .map((filteredSkillName: any, index: number) => (
          <Box key={index} className="slo-content">
            <Img
              src={preloadedAssets?.write}
              className="welcomescreen-bulletsImg"
            />
            <Text className="welcomescreen-content slo-content">
              {filteredSkillName}
            </Text>
          </Box>
        ))}
    </>
  );
};
export default Skills;
