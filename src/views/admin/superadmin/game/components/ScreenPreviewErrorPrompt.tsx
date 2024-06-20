import { Box, Img, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React from 'react'

type ErrorPromptType = {
    preloadedAssets: any;
    errMessage: string;
}


const ScreenPreviewErrorPrompt : React.FC<ErrorPromptType>= ({preloadedAssets, errMessage}) => {
  return (
    <motion.div
    initial={{ opacity: 0, background: '#000' }}
    animate={{ opacity: 1, background: '#0000' }}
    transition={{ duration: 1, delay: 0.5 }}
  >
          <Box id="container" className="Play-station">
          <Box className="top-menu-home-section">  
              <Box className="Setting-box">
                {/* <Box className="vertex"> */}
                  <Box className="Setting-box">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                <Img src={preloadedAssets.Replay} className="setting-pad" />
                <Box position={'absolute'}>
                <Text color={"white"}>{errMessage}</Text>
                </Box>
              </motion.div>
              </Box>

          </Box></Box></Box>
         

  </motion.div>


  )
}

export default ScreenPreviewErrorPrompt