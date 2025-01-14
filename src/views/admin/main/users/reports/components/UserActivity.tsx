// Chakra imports
import {
  Box,
  Flex,
  Select,
  Text,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { useState } from 'react';
import Card from 'components/card/Card';
// Custom components
import BarChart from 'components/charts/BarChart';

import {
  barChartDataUserActivity,
  barChartOptionsUserActivity,
} from 'variables/charts';

export default function UserActivity(props: { [x: string]: any }) {
  const { ...rest } = props;

  const theme = useTheme();
  // eslint-disable-next-line
  const [chartColor, setChartColor] = useState(theme.colors.brand[500]);
  const newOptions = {
    ...barChartOptionsUserActivity,
    colors: [chartColor, '#6AD2FF'],
    fill: {
      ...barChartOptionsUserActivity.fill,
      colors: [chartColor, '#6AD2FF'],
    },
  };

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
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
          User Activity
        </Text>
        <Select
          id="user_type"
          w="unset"
          variant="transparent"
          display="flex"
          alignItems="center"
          defaultValue="Weekly"
        >
          <option value="Weekly">Weekly</option>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
        </Select>
      </Flex>

      <Box h="240px" mt="auto">
        <BarChart
          chartData={barChartDataUserActivity}
          chartOptions={newOptions}
        />
      </Box>
    </Card>
  );
}
