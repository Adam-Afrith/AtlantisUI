import { Box, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { FaCubes, FaRobot } from "react-icons/fa";
import { MdOutlineSubtitles, MdTune } from "react-icons/md";
import { GiBlackBook } from "react-icons/gi";
import { TbView360 } from "react-icons/tb";

const SimpleSlider:React.FC<{setTab:any,completed?:any,ctab?:any}> = ({setTab,completed,ctab}) => {
  const tabs = [
    {
      name: "BackGround",
      tabNo: 1,
      icon: TbView360,
    },
    {
      name: "Character",
      tabNo: 2,
      icon: FaRobot,
    },
    {
      name: "Overview",
      tabNo: 3,
      icon: MdOutlineSubtitles,
    },
    {
      name: "Story",
      tabNo: 4,
      icon: GiBlackBook,
    },
    {
      name: "Design",
      tabNo: 5,
      icon: FaCubes,
    },
    {
      name: "Preferences",
      tabNo: 6,
      icon: MdTune,
    },
  ];
  const containerRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (containerRef.current) {
  //       const containerWidth = containerRef.current.offsetWidth;
  //       const scrollLeft = containerRef.current.scrollLeft;

  //       const distances = tabs.map((_, index) => {
  //         const item = containerRef.current.children[index];
  //         const itemWidth = item.offsetWidth;
  //         const itemLeft = item.offsetLeft;
  //         const center = scrollLeft + containerWidth / 2;
  //         const distance = Math.abs(itemLeft + itemWidth / 2 - center);
  //         return distance;
  //       });

  //       const closestIndex = distances.indexOf(Math.min(...distances));
  //       setCenterIndex(closestIndex);
  //     }
  //   };

  //   if (containerRef.current) {
  //     containerRef.current.addEventListener('scroll', handleScroll, { passive: true });
  //   }

  //   return () => {
  //     if (containerRef.current) {
  //       containerRef.current.removeEventListener('scroll', handleScroll);
  //     }
  //   };
  // }, [tabs]);
  const iconColor = useColorModeValue('secondaryGray.600', 'white');
  const scrollToIndex = (index:any) => {
    const container = containerRef.current;
    const tabWidth = container.scrollWidth / tabs.length;
    if (container) {
      container.scrollTo({
        left: tabWidth * index,
        behavior: 'smooth',
      });
    }
  };
 
  // useEffect(() => {
  //   scrollToIndex(centerIndex);
  // }, [centerIndex]);
  
  const handleScrollLeft = () => {
    setCenterIndex(centerIndex === 0 ? centerIndex : centerIndex - 1)
    scrollToIndex(centerIndex === 0 ? centerIndex : centerIndex - 1);
  };

  const handleScrollRight = () => {
    setCenterIndex(centerIndex === 5 ? centerIndex : centerIndex + 1)
    scrollToIndex(centerIndex === 5 ? centerIndex : centerIndex + 1);
  };

  return (
    <>
      <Box h={'130px'} w={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <Icon as={FaCircleChevronLeft} w={8} h={8} onClick={handleScrollLeft} />
        <Box h={'100%'} w={'100%'} ref={containerRef} display={'flex'} overflowX={'scroll'} sx={{ scrollBehavior: 'smooth', transition: 'overflow-x 1s ease' }}>
          {tabs && tabs.map((tab, i) => (
            <Box key={i} className="mobile_progress" display={'flex'} justifyContent={'center'}>
              <Box display={'flex'} width={'65%'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                {/* <Card w={'100%'} h={'100%'} as={tab?.icon} borderRadius={'50%'}>
                </Card> */}
                <Icon as={tab?.icon} color={completed && completed.includes(i+1) ? 'green.500' : iconColor} borderRadius={'50px'} onClick={() => setTab(completed && completed.includes(i+1) ? i+1 : ctab)} p={'10px'} boxShadow={'14px 17px 40px 4px rgba(112, 144, 176, 0.08)'} w={'80px'} h={'80px'}/>
                <Text mt={'15px'} color={'#1B2559'} fontSize={'md'} fontWeight={'500'} textAlign={'center'}>{tab?.name}</Text>
              </Box>
            </Box>
          ))}
        </Box>
        <Icon as={FaCircleChevronRight} onClick={handleScrollRight} w={8} h={8} />
      </Box >
    </>
    // <div className="slider-container">
    //   <Slider {...settings}>
    //     <div>
    //       <h3>1</h3>
    //     </div>
    //     <div>
    //       <h3>2</h3>
    //     </div>
    //     <div>
    //       <h3>3</h3>
    //     </div>
    //     <div>
    //       <h3>4</h3>
    //     </div>
    //     <div>
    //       <h3>5</h3>
    //     </div>
    //     <div>
    //       <h3>6</h3>
    //     </div>
    //   </Slider>
    // </div>
  );
}

export default SimpleSlider;
