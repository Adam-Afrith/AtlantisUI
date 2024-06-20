// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RiArrowDownSFill } from "react-icons/ri";
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
// Assets
import { RiArrowUpSFill } from 'react-icons/ri';
import { noOfLeaners } from 'utils/dashboard/dashboardService';
export default function LearnerTotalSpent(props: { [x: string]: any }) {
  const { ...rest } = props;
  const theme = useTheme();
  const [graphData, setgraphData] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      const res = await noOfLeaners();
      if (res?.status !== 'Success') return console.log('noOf useEffect Errorrrrrr:', res?.message);
      const monthlyData = res?.data?.monthlyLearnerCount || [];
      setgraphData(monthlyData);
    };

    fetchData();
  }, []);
  let currentCount, lastCount, currentCountGet, lastCountGet, total, currentActiveCount, lastActiveCount;
  const currentMonth = new Date().toISOString().split('-').slice(0, 2).join('-'); // Extract YYYY-MM
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('-').slice(0, 2).join('-');
  const currentMonthExists = graphData.some((item) => item.month.slice(0, 7) === currentMonth);
  const lastMonthExists = graphData.some((item) => item.month.slice(0, 7) === lastMonth);

  if (currentMonthExists) {
    currentCount = graphData.find((item) => item.month.slice(0, 7) === currentMonth).count;
    currentActiveCount = graphData.find((item) => item.month.slice(0, 7) === currentMonth).Activecount;
  }

  if (lastMonthExists) {
    lastCount = graphData.find((item) => item.month.slice(0, 7) === lastMonth).count;
    lastActiveCount = graphData.find((item) => item.month.slice(0, 7) === lastMonth).Activecount;
  }

  currentCountGet = currentCount !== undefined ? currentCount : 0;
  lastCountGet = lastCount !== undefined ? lastCount : 0;
  let currentactiveCountGet = currentActiveCount !== undefined ? currentActiveCount : 0;
  let lastactiveCountGet = lastActiveCount !== undefined ? lastActiveCount : 0;
  total = currentCountGet - lastCountGet;
  let Activetotal = currentactiveCountGet - lastactiveCountGet;
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const bgHover = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.50' },
  );
  const bgFocus = useColorModeValue(
    { bg: 'secondaryGray.300' },
    { bg: 'whiteAlpha.100' },
  );
  const lineChartDataTotalSpent = [
    {
      name: 'Leaners',
      data: graphData.map((item) => item.count).reverse()
    },
    {
      name: 'Active Leaners',
      data: graphData.map((item) => item.Activecount).reverse()//creator date  //graphData.map((item)=>item.count).reverse()
    },

  ];
  const lineChartOptionsTotalSpent = {
    chart: {
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: '#4318FF'
      }
    },
    colors: ['#4318FF', '#39B8FF'],
    markers: {
      size: 0,
      colors: 'white',
      strokeColors: '#7551FF',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      shape: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true
    },
    tooltip: {
      theme: 'dark'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      type: 'line'
    },
    xaxis: {
      type: 'numeric',
      categories: graphData.map(item => new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(item.month))).reverse(),//month 
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    },
    legend: {
      show: false
    },
    grid: {
      show: false,
      column: {
        color: ['#7551FF', '#39B8FF'],
        opacity: 0.5
      }
    },
    color: ['#7551FF', '#39B8FF']
  };
  return (
    <Card
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex
        justify="space-between"
        align="center"
        w="100%"
        ps="0px"
        pe="20px"
        pt="5px"
      >
        <Button
          bg={boxBg}
          fontSize="sm"
          fontWeight="500"
          color={textColorSecondary}
          borderRadius="7px"
        >
          <Icon
            as={MdOutlineCalendarToday}
            color={textColorSecondary}
            me="4px"
          />
          This month
        </Button>
        <Button
          ms="auto"
          alignItems="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w="37px"
          h="37px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
        </Button>
      </Flex>
      <Flex w="100%" flexDirection={{ base: 'column', lg: 'row' }}>
        <Flex flexDirection="column" me="20px" mt="28px">

          <Flex align="center" mb="20px">
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
              mt="4px"
              me="12px"
            >
              Learners
            </Text>
            <Flex align="center">
              {(currentCountGet >= lastCountGet) ? (total != 0) ? <Icon as={RiArrowUpSFill} color="green.500" /> : "" : <RiArrowDownSFill />}

              <Text color={(currentCountGet >= lastCountGet) ? "green.500" : "red.500"} fontSize="sm" fontWeight="700">
                {(currentCountGet >= lastCountGet) ? (total != 0) ? "+ " + total : total : "" + total}
              </Text>
            </Flex>
          </Flex>
          <Flex align="center" mb="20px">
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
              mt="4px"
              me="12px"
              style={{marginLeft:'-14px'}}
            >
              Active Learners
            </Text>
            <Flex align="center">
              {(currentactiveCountGet >= lastactiveCountGet) ? (Activetotal != 0) ? <Icon as={RiArrowUpSFill} color="green.500" style={{marginLeft:'-9px'}} /> : "" : <RiArrowDownSFill style={{marginLeft:'-9px'}} />}

              <Text color={(currentactiveCountGet >= lastactiveCountGet) ? "green.500" : "red.500"} fontSize="sm" fontWeight="700">
                {(currentactiveCountGet >= lastactiveCountGet) ? (Activetotal != 0) ? "+ " + Activetotal : Activetotal : "" + Activetotal}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {/* <Box minH="260px" minW="75%" mt="auto">
          <LineChart
            chartData={lineChartDataTotalSpent}
            chartOptions={lineChartOptionsTotalSpent}
          />
        </Box> */}
         {graphData.length > 0 ? (
        <Box minH="260px" minW="75%" mt="auto">
          <LineChart
            chartData={lineChartDataTotalSpent}
            chartOptions={lineChartOptionsTotalSpent}
          />
        </Box>
         ) : (
          <Text>Loading chart...</Text>
        )}
      </Flex>
    </Card>
  );
}
