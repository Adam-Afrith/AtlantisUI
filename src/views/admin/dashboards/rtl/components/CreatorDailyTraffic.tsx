// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import BarChart from 'components/charts/BarChart';
import { RiArrowDownSFill } from "react-icons/ri";
// Custom components
import Card from 'components/card/Card';

// Assets
import { RiArrowUpSFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { noOfCreators } from 'utils/dashboard/dashboardService';

export default function CreatorDailyTraffic(props: { [x: string]: any }) {
  const { ...rest } = props;
  const theme = useTheme();
  const [creatorchartData, setCreatorChartData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await noOfCreators();
      if (res?.status !== 'Success') return console.log('noOf useEffect Errorrrrrr:', res?.message);
      const dailyData = res?.data?.dailyCreatorCount || [];
      setCreatorChartData(dailyData);
    };
    fetchData();
  }, []);

  const barChartDataLearnerDailyTraffic = [
    {
      name: "Active Creators",
      data: creatorchartData.map((item) => item.Activecount).reverse(),
    },
  ];

  const barChartOptionsLearnerDailyTraffic = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
        },
      },
      theme: "dark",
    },
    xaxis: {
      categories: creatorchartData.map((item) => item.day).reverse(),
      show: false,
      labels: {
        show: true,
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      color: "black",
      labels: {
        show: true,
        style: {
          colors: "#CBD5E0",
          fontSize: "14px",
        },
      },
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: [
          [
            {
              offset: 0,
              color: "#4318FF",
              opacity: 1,
            },
            {
              offset: 100,
              color: "rgba(67, 24, 255, 1)",
              opacity: 0.28,
            },
          ],
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "40px",
      },
    },
  };
  let currentCount, yesterdayCount, currencountget, yesterdayCountget, total;
  const currentDate = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]; // Yesterday's date in YYYY-MM-DD format
  const currentDateExists = creatorchartData.some((item) => item.day === currentDate);

  if (currentDateExists) {
    currentCount = creatorchartData.find((item) => item.day === currentDate).Activecount;
  }
  const yesterdayDateExists = creatorchartData.some((item) => item.day === yesterdayDate);
  if (yesterdayDateExists) {
    yesterdayCount = creatorchartData.find((item) => item.day === yesterdayDate).Activecount;
  }
  currencountget = currentCount !== undefined ? currentCount : 0;
  yesterdayCountget = yesterdayCount !== undefined ? yesterdayCount : 0;

  total = currencountget - yesterdayCountget;
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (

    <Card alignItems="center" flexDirection="column" w="100%" h="100%" {...rest}>
      <Flex justify="space-between" align="start" px="10px" pt="5px" w="100%">
        <Flex flexDirection="column" align="start" me="20px">
          <Flex w="100%">
            <Text
              color="secondaryGray.600"
              me="auto"
              fontSize="sm"
              fontWeight="500"
            >
              Daily Creators
            </Text>
          </Flex>

          <Flex align="end">
            <Text
              color={textColor}
              fontSize="34px"
              fontWeight="700"
              lineHeight="100%"
            >
              {currentCount !== undefined ? currentCount : 'N/A'}
            </Text>

          </Flex>
        </Flex>
        <Flex align="center">
          {(currencountget >= yesterdayCountget) ? (total != 0) ? <Icon as={RiArrowUpSFill} color="green.500" /> : "" : <RiArrowDownSFill />}

          <Text color={(currencountget >= yesterdayCountget) ? "green.500" : "red.500"} fontSize="sm" fontWeight="700">
            {(currencountget >= yesterdayCountget) ? (total != 0) ? "+ " + total : total : "" + total}
          </Text>

        </Flex>
      </Flex>
      {creatorchartData.length > 0 ? (

        <Box h="240px" mt="auto">
          <BarChart
            chartData={barChartDataLearnerDailyTraffic}
            chartOptions={barChartOptionsLearnerDailyTraffic}
          />
        </Box>
      ) : (
        <Text>Loading chart...</Text>
      )}
    </Card>
  );
}
