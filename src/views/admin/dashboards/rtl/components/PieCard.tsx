// Chakra imports
import {
  Box,
  Flex,
  Text,
  Select,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
// Custom components
import Card from 'components/card/Card';
import PieChart from 'components/charts/PieChart';
import { noOfLeaners } from 'utils/dashboard/dashboardService';
import { VSeparator } from 'components/separator/Separator';


export default function Conversion(props: { [x: string]: any }) {
  const { ...rest } = props;
  const theme = useTheme();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardColor = useColorModeValue('white', 'navy.700');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );
  const [piechartData, setpieChartData] = useState([]);
  /*********Filter Creator Data********************** */

  const [selectedValue, setSelectedValue] = useState('');
  const handleSelectChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);
  };

  /***********End Filter component************************* */

  useEffect(() => {
    const fetchData = async () => {
      const res = await noOfLeaners();
      console.log('nooflearners', res);
      if (res?.status !== 'Success') return console.log('noOf useEffect Error :', res?.message);
      let combinedLearnerData;
      if (selectedValue !== '') {
        if (selectedValue === 'daily') {
          const todayLearnerCount = res?.data?.todayLearnerCount || 0;
          const todayActiveLearnerCount = res?.data?.todayActiveLearnerCount || 0;
          combinedLearnerData = [todayLearnerCount, todayActiveLearnerCount];
        }
        if (selectedValue === 'monthly') {
          const monthLearnerCount = res?.data?.monthLearnerCount || 0;
          const monthActiveLearnerCount = res?.data?.monthActiveLearnerCount || 0;
          combinedLearnerData = [monthLearnerCount, monthActiveLearnerCount];
        }
        if (selectedValue === 'yearly') {
          const yearLearnerCount = res?.data?.yearLearnerCount || 0;
          const yearActiveLearnerCount = res?.data?.yearActiveLearnerCount || 0;
          combinedLearnerData = [yearLearnerCount, yearActiveLearnerCount];
        }
      }
      else {
        const totalLearnerCount = res?.data?.totalLearnerCount || 0;
        const Activelearnercount = res?.data?.Activelearnercount || 0;
        combinedLearnerData = [totalLearnerCount, Activelearnercount];
      }
      setpieChartData(combinedLearnerData);
    }
    fetchData();
  }, [selectedValue]);
  const pieChart = piechartData;
  const pieChartOptions = {
    labels: ['Total Learners', 'Total Active Learners'],
    colors: ['#4318FF', '#6AD2FF'],
    chart: {
      width: '50px'
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    // hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false
          }
        }
      }
    },
    fill: {
      colors: ['#4318FF', '#6AD2FF']
    },
    tooltip: {
      enabled: true,
      theme: 'dark'
    }
  };
  return (
    <Card
      p="20px"
      alignItems="center"
      flexDirection="column"
      w="100%"
      {...rest}
    >
      <Flex
        px={{ base: '0px', '2xl': '10px' }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          Learners
        </Text>
        <Select
          fontSize="sm"
          variant="subtle"
          width="unset"
          fontWeight="700"
          id='filterData'
          onChange={handleSelectChange}
          placeholder='Total'
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </Flex>

      {/* <PieChart
        h="100%"
        w="100%"
        chartData={pieChart}
        chartOptions={pieChartOptions}
      /> */}
      {pieChart.length > 0 ? (

        <PieChart
          h="100%"
          w="100%"
          chartData={pieChart}
          chartOptions={pieChartOptions}
        />
      ) : (
        <Text>Loading chart...</Text>
      )}
      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        <Flex direction="column" py="5px">
          <Flex align="center">
            <Box h="8px" w="8px" bg="brand.500" borderRadius="50%" me="4px" />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              Learners
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {pieChart[0]}%
          </Text>
        </Flex>
        <VSeparator mx={{ base: '60px', xl: '60px', '2xl': '60px' }} />
        <Flex direction="column" py="5px" me="10px">
          <Flex align="center">
            <Box h="8px" w="8px" bg="#6AD2FF" borderRadius="50%" me="4px" />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              Active Learners
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {pieChart[1]}%
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
