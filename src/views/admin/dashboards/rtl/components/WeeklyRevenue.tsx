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
import Card from 'components/card/Card';
// Custom components
import BarChart from 'components/charts/BarChart';
import { MdBarChart } from 'react-icons/md';
import { noOfGames } from 'utils/dashboard/dashboardService';

export default function WeeklyRevenue(props: { [x: string]: any }) {
  const [weekchartData, setweekChartData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const res = await noOfGames();
      if (res?.status !== 'Success') {return console.log('noOf useEffect Error :', res?.message)}
      const weekgamecountsget = res?.data?.weekGameCounts || '';
      setweekChartData(weekgamecountsget);
    }
    fetchData();
  }, []);
  const weekgamedaysget = weekchartData.map((weekend: any) => weekend.day).reverse();
  const weekgametotalcountget = weekchartData.map((weekend: any) => weekend.totalgamecount).reverse();
  const weekgametotallaunchedget = weekchartData.map((weekend: any) => weekend.totalgamelaunchcount).reverse();
console.log('weekgamedaysget',weekgamedaysget,'...2...',weekgametotallaunchedget,'...3..',weekgametotalcountget,'...4...',weekchartData,'...5...',weekgamedaysget);
  const barChartDataConsumption = [
    {
      name: 'Game Created',
      data: weekgametotalcountget
    },
    {
      name: 'Game Launched',
      data: weekgametotallaunchedget
    },
  ];
  const barChartOptionsConsumption = {
    chart: {
      stacked: true,
      toolbar: {
        show: false
      }
    },
    tooltip: {
      style: {
        fontSize: '12px'
      },
      onDatasetHover: {
        style: {
          fontSize: '12px'
        }
      },
      theme: 'dark'
    },
    xaxis: {
      categories: weekgamedaysget,
      show: false,
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
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
      show: false,
      color: 'black',
      labels: {
        show: false,
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
          fontWeight: '500'
        }
      }
    },

    grid: {
      borderColor: 'rgba(163, 174, 208, 0.3)',
      show: true,
      yaxis: {
        lines: {
          show: false,
          opacity: 0.5
        }
      },
      row: {
        opacity: 0.5
      },
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    fill: {
      type: 'solid',
      colors: ['#5E37FF', '#6AD2FF', '#E1E9F8']
    },
    colors: ['#5E37FF', '#6AD2FF', '#E1E9F8'],
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '20px'
      }
    }
  };


console.log('barChartOptionsConsumption',barChartOptionsConsumption,'...0..',barChartDataConsumption)
  const { ...rest } = props;
  const theme = useTheme();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
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
  return (
    <Card alignItems="center" flexDirection="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Weekly Games
        </Text>
        <Button
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
      {weekgamedaysget.length > 0 ? (
      <Box h="240px" mt="auto" w="100%">
      <BarChart
        chartData={barChartDataConsumption}
        chartOptions={barChartOptionsConsumption}
      />
    </Box>
    ) : (
      <Text>Loading chart...</Text>
    )}
      
    </Card>
  );
}
