import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
    Icon, 
    Img,
    Input,
    List,
    ListIcon,
    ListItem,
    Progress,
    SimpleGrid,
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Text,
    VStack,
    useSteps,
    keyframes,
    useToast,
    Heading,
    Collapse,
    StepDescription,
    useColorModeValue,
    HStack,
    useDisclosure
    , UnorderedList
  } from '@chakra-ui/react';
  import { MdCheck, MdClose, MdTimer } from 'react-icons/md';
  import { TbView360 } from 'react-icons/tb';
import { FaRobot } from 'react-icons/fa';
import { MdPageview } from 'react-icons/md';
import { GiBlackBook } from 'react-icons/gi';
import { FaCubes } from 'react-icons/fa';
import { MdTune } from 'react-icons/md';
import { MdRocketLaunch } from 'react-icons/md';
import { MdOutlineSubtitles } from 'react-icons/md';
  import { HSeparator } from 'components/separator/Separator';
  import React, { useEffect, useRef, useState } from 'react';
// import '../../game.css'
  
    const StepperBar: React.FC<{ handleTrans?:any,formData?:any,tab?:any }> = ({ handleTrans,formData,tab }) => {
    
    const textColor = useColorModeValue('black', 'black');
	const iconColor = useColorModeValue('secondaryGray.600', 'white');
	const inActive = useColorModeValue('gray.50', 'white');
    const boxes = Array.from({ length: 7 }, (_, index) => index + 1);
    // const leftIconNames = [
    //     'MdRocketLaunch',
    //     'MdTune',
    //     'FaCubes',
    //     'GiBlackBook',
    //     'MdOutlineSubtitles',
    //     'FaRobot',
    //     'TbView360'
    //   ];
    const leftIconNames = [
        TbView360,FaRobot,MdOutlineSubtitles,GiBlackBook,FaCubes,MdTune,MdRocketLaunch
      ];
      const tabNames = ['BackGround','Character','Overview','Story','Design','Preferences','Launch'];
    return (
        <Box
        position="fixed"
        h="92vh" // Set height to 92% of the viewport height
        w="18%"  // Set width to 20% of the viewport width
        bg="#ececec"
        borderRadius="10px"
        borderColor="#11047a" // Set border color to #11047a
        border="2px solid #11047a" // Set default border style and width
        overflowX={'auto'}
      >
<Flex alignItems="center" flexDirection="column" p={'0px'} mb={'20px'}>
<Text fontSize={25} fontWeight={800}  letterSpacing={'2px'} color={'#000'} mr={'7px'} >ATLANTIS</Text>
    </Flex>
<Flex
//   visibility="hidden"
  justify="center"
  direction="column"
  align="center"
   // Example gradient colors: orange to orangered
  borderRadius="20px"
  me="20px"
  position="relative"
  
>
{ <HSeparator mt="20px" ml='10px' /> }
</Flex>
<Flex
//   visibility="hidden"
  justify="space-between"
  direction="column"
  align="center"
   // Example gradient colors: orange to orangered
  borderRadius="20px"
  me="20px"
  position="relative"
 
>
<Box
      bg={"green.600"}
      borderRadius="10px"
      position="absolute"
      left="12%"
      bottom={`${70}%`} // Bottom position based on the percentage
      top="10%" // Start halfway through the first box
      width="6px" // Width of the progress bar
      zIndex="-1" // Place behind the looped boxes
      style={{
        transition: "background-color 10s ease-in-out" // Animation duration and easing
      }}
    ></Box>
{/* stepper bar */}
{boxes.map((index) => (
    <>
<Flex justifyContent="space-between" width="100%" mt={'5px'} cursor={'pointer'}
  onClick={() => handleTrans(index)}
>
<Box
      key={`box-${index}-icon`}
      w="10%"
      bg="white"
      borderRadius="50%"
      p="25px"
      ml="5px"
      borderColor={formData.gameLastTabArray.includes(index) ?'green.500':''}
      border={formData.gameLastTabArray.includes(index) ? '1.5px solid' : 'none'}
      position="relative" // Adjusted position to accommodate absolute positioning of the icon
    >
      <Icon
        as={leftIconNames[index - 1]}
        color={tab===index||formData.gameLastTabArray.includes(index)? '#11047a': iconColor}
        position="absolute"
        w={'27px'}
        h={'27px'}
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      />
    </Box>
{/* 
        <Box
  w="40%"
  bg="green.200"
  borderRadius="8px"
  p="25px"
  mx="auto" // Center the second Box
  display="flex"
  justifyContent="center"
  alignItems="center"
> */}

<Text color={textColor} fontSize='md' me='6px' fontWeight='500' mt={'14px'} mr={'28px'}>
					{tabNames[index-1]}
				</Text>
  
{/* </Box> */}

        <Box
          w="19%"
          bg="white"
      borderRadius="50%"
      p="25px"
      ml="5px"
      position="relative"
      borderColor={formData.gameLastTabArray.includes(index) ?'green.300':''}
      border={formData.gameLastTabArray.includes(index) ? '1.5px solid' : 'none'}
        >
            <Icon
        as={formData.gameLastTabArray.includes(index)? MdCheck :MdTimer}
       
        position="absolute"
        w={'27px'}
        h={'27px'}
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color={formData.gameLastTabArray.includes(index)? 'green.500':iconColor}
      />
           
          {/* Content for Box 3 */}
        </Box>
      </Flex>
      <Flex justifyContent="space-between" width="100%" h={'10px'} mt={'5px'}></Flex>
      </>
      ))}
    
  {/* Your content here */}
</Flex>

</Box>
    );
  };
  
  export default StepperBar;
  