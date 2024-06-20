// Chakra imports
import {
  Avatar,
  Center,
  Flex,
  Select,
  Button,
  Text,
  useColorModeValue,
  Tag,
  TagLabel,
  Box,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Card from 'components/card/Card';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getGameById,
  getSkills,
  MaintainGameView,
} from 'utils/game/gameService';
import {DemoPlayRoutePath} from 'config/constant';

export default function Settings(props: {
  name: string;
  avatar: string;
  banner: string;
  data?: any;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { name, avatar, banner, data } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const [skills, setSkills] = useState<any[]>([]);
  const [authorArray, setauthorArray] = useState<any[]>([]);

  const [profile, setProfile] = useState<any>([]);

  const gameProfile = async (id: any) => {
    const data = '';

    const result = await getGameById(id);
    if (result?.status !== 'Success') {
      setProfile([]);
      return console.log('getbackruond error:' + result?.message);
    } else {
      setProfile(result.data);
    }
  };
  const playPerview = async () => {
    const result = await MaintainGameView(id);
    if (result?.status !== 'Success') {
      return console.log('getbackruond error:' + result?.message);
    }
    navigate(`${DemoPlayRoutePath+id}`);
  };

  const gameSkill = async () => {
    const data = '';

    const result = await getSkills();
    if (result?.status !== 'Success') {
      setSkills([]);
      return console.log('getbackruond error:' + result?.message);
    } else {
      setSkills(result.data);
    }
  };
  useEffect(() => {
    gameProfile(id);
    gameSkill();
  }, []);

  useEffect(() => {
    if (profile.gameSkills) {
      const Array = profile.gameSkills.split(',');
      setauthorArray(Array);
    }
  }, [profile]);

  const findSkillName = (authorNumber: any) => {
    const matchedSkill = skills.find(
      (option) => option.id === Number(authorNumber),
    );
    return matchedSkill ? matchedSkill.name : null;
  };

  return (
    <Card width={'100%'} mb="20px" alignItems="center" boxShadow={"2px 5px 40px 4px rgba(112, 144,176 / 19%)"}>
      <Flex
        w="100%"
        bgGradient="linear(to-b, brand.400, brand.600)"
        minH={{sm:'100px',md:"127px"}}
        borderRadius="16px"
      ></Flex>
      <Avatar
        mx="auto"
        bg={'#fff'}
        src={avatar}
        h="87px"
        w="87px"
        mt="-43px"
        mb="15px"
      />
      <Box>
      <Text fontSize="2xl" textColor={textColorPrimary} fontWeight="700">
        {profile.gameTitle}
      </Text>
      <Flex  mx="auto" px="15px">
        <Text
          me="4px"
          color={textColorSecondary}
          fontSize="sm"
          fontWeight="400"
          lineHeight="100%"
          textAlign={'center'}
          ps={'0 !important'}
        >
         Story Line : {profile.gameStoryLine}{' '}
        </Text>
      </Flex>
      <Flex mb="15px" mt="15px" mx="auto" px="15px">
        <Text
          color={textColorSecondary}
           fontSize="sm"
          fontWeight="400"
          lineHeight="100%"
        >
          Author : {profile.gameAuthorName}
        </Text>
      </Flex>
      <Flex direction="column" mb="10px">
        <Text fontSize="xl" color={textColorPrimary} fontWeight="bold">
          Learning Outcomes :
        </Text>
        <Text fontSize="md" mb="15px" mt="15px" color={textColorSecondary}>
          {profile.gameLearningOutcome}
        </Text>
      </Flex>
      <Flex direction="column" mb="10px">
        <Text fontSize="xl" color={textColorPrimary} fontWeight="bold">
          Skills :
        </Text>
        <Text fontSize="md" mb="15px" mt="15px" color={textColorSecondary}>
          {authorArray
            .map((authorItem, index) => {
              const skillName = findSkillName(authorItem);
              return skillName;
            })
            .filter((skillName) => skillName !== null)
            .map((filteredSkillName, index) => (
              <Tag
                key={index} // Add a unique key for each Tag
                size="md"
                variant="solid"
                colorScheme="brandScheme"
                m="2"
              >
                <TagLabel>{filteredSkillName}</TagLabel>
              </Tag>
            ))}
        </Text>
      </Flex>
      <Flex direction="column" mb="10px">
        <Text fontSize="xl" color={textColorPrimary} fontWeight="bold">
            Duration : {profile.gameDuration}{' '}mins
        </Text>
        <Text fontSize="md" mb="15px" mt="15px" color={textColorSecondary}></Text>
      </Flex>
      </Box>
      <Box w={'100%'} display={'flex'} justifyContent={'center'} mb="15px" mt="15px">
        <Box w={'80%'} display={'flex'} justifyContent={'center'}>
        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="70px"
          w={{sm:'100%', md:'200px'}}
          px="24px"
          py="5px"
          onClick={playPerview}
        >
          See Preview
        </Button>
        </Box>
      </Box>
      {/* <Flex align="right" mx="auto" px="15px" marginLeft={'80%'}>
      </Flex> */}
    </Card>
  );
}
