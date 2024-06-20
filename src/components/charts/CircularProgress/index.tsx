import { Box, Text, useColorModeValue, useTheme } from '@chakra-ui/react';
import { useState } from 'react';
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CircProgress(props: {
  title: string;
  percentage: number;
}) {
  const { title, percentage } = props;
  let textColor = useColorModeValue('secondaryGray.900', 'white');
  const theme = useTheme();
  //eslint-disable-next-line
  const [chartColor, setChartColor] = useState(theme.colors.brand[500]);
  //eslint-disable-next-line
  const [chartColorDark, setChartColorDark] = useState(theme.colors.brand[400]);

  let arcColor = chartColor;
  let stylesColorMode = useColorModeValue(
    {
      rotation: 0.25,
      textSize: '0px',
      textColor: 'transparent',
      pathTransitionDuration: 0.5,
      pathColor: arcColor,
      trailColor: '#E9EDF7',
      backgroundColor: '#3e98c7',
    },
    {
      rotation: 0.25,
      textSize: '0px',
      pathTransitionDuration: 0.5,
      pathColor: chartColorDark,
      textColor: 'transparent',
      trailColor: '#1B254B',
    },
  );
  return (
    <CircularProgressbarWithChildren
      value={percentage}
      text={`${percentage}%`}
      styles={buildStyles(stylesColorMode)}
    >
      <Box>
        <Text fontSize="sm" color="secondaryGray.600" fontWeight="500">
          {title}
        </Text>
        <Text
          fontSize="xl"
          textAlign="center"
          color={textColor}
          fontWeight="700"
        >
          {percentage}%
        </Text>
      </Box>
    </CircularProgressbarWithChildren>
  );
}

export function CircProgressMini(props: { step: string; percentage: number }) {
  const { step, percentage } = props;
  let textColor = useColorModeValue('secondaryGray.900', 'white');
  let stylesColorMode = useColorModeValue(
    {
      rotation: 0.25,
      textSize: '0px',
      textColor: 'transparent',
      pathTransitionDuration: 0.5,
      pathColor: `#01B574`,
      trailColor: '#E9EDF7',
      backgroundColor: '#3e98c7',
    },
    {
      rotation: 0.25,
      textSize: '0px',
      pathTransitionDuration: 0.5,
      pathColor: `#01B574`,
      textColor: 'transparent',
      trailColor: '#1B254B',
    },
  );
  return (
    <CircularProgressbarWithChildren
      value={percentage}
      text={`${step}`}
      styles={buildStyles(stylesColorMode)}
    >
      <Box>
        <Text fontSize="sm" color={textColor} fontWeight="700">
          {step}
        </Text>
      </Box>
    </CircularProgressbarWithChildren>
  );
}
