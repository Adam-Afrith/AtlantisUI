import { Box, Flex, Text, Img, useBreakpointValue } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { updatePreviewData } from 'store/preview/previewSlice';
import Replay from 'assets/img/screens/Replay.png';


const PreviewEndOfStory: React.FC<{ preloadedAssets: any, setEndOfQuest: any, replayQuest: () => void }> = ({ preloadedAssets, setEndOfQuest, replayQuest }) => {

  return (
    <Box className="takeaway-screen">
      <Box className="takeaway-screen-box">
        <Box position={'relative'}>
          <Img src={Replay} className="bg-replay" />
          <Box className="replay_content">
            <Box className="replay_content_center">
              <Box className="title_replay">
                <Text fontFamily={'AtlantisContent'} textAlign={'center'}>
                  End of the current Quest.!
                </Text>
                <Text fontFamily={'AtlantisContent'} textAlign={'center'}>
                  Do You Want Play Again ?
                </Text>
              </Box>
              <Box
                w={'100%'}
                display={'flex'}
                justifyContent={'center'}
              >
                <Img
                  src={preloadedAssets?.replayBtn}
                  className='replay_buttons'
                  onClick={replayQuest}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PreviewEndOfStory;
