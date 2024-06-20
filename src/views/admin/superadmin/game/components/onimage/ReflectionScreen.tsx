import {
  Box,
  Img,
  SimpleGrid,
  Text,
  Textarea,
  GridItem
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ref from 'assets/img/screens/refquestions.png';
import qs from 'assets/img/screens/QS.png';

interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const ReflectionScreen: React.FC<{
  formData: any;
  reflectionQuestions: any;
  imageSrc: any;
  reflectionQuestionsdefault: any;
  preview: any;
  preloadedAssets?: any;
  RefelectionAnswer?: any;
}> = ({
  formData,
  reflectionQuestions,
  imageSrc,
  reflectionQuestionsdefault,
  preview,
  preloadedAssets,
  RefelectionAnswer,
}) => {
    const [scaleFactor, setScaleFactor] = useState(1);
    const [answers, setAnswers] = useState<any>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const arrayInfo = [1, 2, 3, 4];
    let i = 0;
    useEffect(() => {
      const snas = !answers.some((ans: any) => (ans?.text == undefined || ans.text == '' || ans.text == null));
      console.log("!!!!!", snas);
      if (formData?.gameIsLearnerMandatoryQuestion == 'false') {
        setIsFormValid(true);
      } else if (formData.gameIsLearnerMandatoryQuestion == 'true') {
        if (formData?.gameReflectionQuestion &&
          answers.length == formData?.gameReflectionQuestion &&
          !answers.some((ans: any) => (ans?.text == undefined || ans.text == '' || ans.text == null))
        ) {

          setIsFormValid(true);
        } else {
          setIsFormValid(false);
        }
      }
      else {
        setIsFormValid(true);
      }
    }, [answers, formData.gameIsLearnerMandatoryQuestion]);

    const updateAnswer = (e: any, index: any) => {
      const updatedAnswers = [...answers];
      updatedAnswers[index] = { ...updatedAnswers[index], text: e.target.value };
      setAnswers(updatedAnswers);
    };
    const arrayInfoQn = formData.gameReflectionQuestion;
    const styleflex = {};

    if (arrayInfoQn === 1) {
      Object.assign(styleflex, {
        display: 'flex',
        justifyContent: 'center',
      });
    } else if (arrayInfoQn === 3) {
      // Apply your styling for arrayInfo 3, for example:
      Object.assign(styleflex, {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // Two columns
        gap: '2px',
        placeItems: 'center',
      });
    }

    useEffect(() => {
      function updateScale() {
        const screenWidth = window.innerWidth;
        const scaledWidth = screenWidth - 30; // Adjust 30 according to your needs
        const newScaleFactor = scaledWidth / screenWidth;
        setScaleFactor(newScaleFactor);
      }

      window.addEventListener('resize', updateScale);
      updateScale(); // Call the function initially to set the correct scale

      return () => {
        window.removeEventListener('resize', updateScale);
      };
    }, []);
    return (
      <>
        {imageSrc && (
          <Box
            w={'100%'}
            h={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Box w={'auto'} position={'relative'} h={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Img src={imageSrc} h={'auto'} w={'100%'} transition={'transform 0.3s ease'} transform={{ lg: 'scale(1)', '2xl': 'scale(1.3)' }} />
              <Box position={'absolute'} transition={'transform 0.3s ease'} transform={{ lg: 'scale(1)', '2xl': 'scale(1.25)' }} display={'flex'} justifyContent={'center'} w={'100%'} h={'30%'} top={'37.5%'} fontFamily={'AtlantisText'}>
                <Box w={'80%'}>
                  <SimpleGrid
                    columns={{ base: 2 }}
                    spacing={2}
                    className="grid"
                    gap={2}
                  >
                    {Array.from(
                      { length: formData.gameReflectionQuestion },
                      (_, index) => (
                        <Box>
                          <Box className='heading-wrapper'
                            lineHeight={1}
                            display={'flex'}
                            wordBreak="break-all"
                            fontFamily={'content'}
                            fontSize={{
                              base: '8px',
                              sm: '12px',
                              md: '13px',
                              lg: '15px',
                            }}
                          >
                            <Img src={qs} alt="ref" w={'20px'} h={'20px'} />
                            {preview ? (
                              <Text
                                className="text drop"
                                style={{ whiteSpace: 'break-spaces' }}
                              >
                                {` ${reflectionQuestions[`ref${index + 1}`]?.padEnd(
                                  90,
                                  ' ',
                                ) ||
                                  reflectionQuestionsdefault[index]?.padEnd(90, ' ')
                                  }`}
                              </Text>
                            ) : (
                              <Text
                                className="text drop"
                                style={{ whiteSpace: 'break-spaces' }}
                                fontFamily={'AtlantisText'}
                                fontSize={'1rem'}
                                letterSpacing={'0.5px'}
                              >
                                {` ${reflectionQuestions[`ref${index + 1}`]?.padEnd(
                                  90,
                                  ' ',
                                ) ||
                                  reflectionQuestionsdefault[index]?.padEnd(90, ' ')
                                  }`}
                              </Text>
                            )}
                          </Box>
                          <Box position={'relative'} className='input-wrapper'>
                            <Img
                              w={'100%'}
                              h={'50px'}
                              padding-top={'20px'}
                              src={ref}
                            />
                            {/* {preview ? ( */}
                            <Textarea
                              padding-top={'20px'}
                              bottom={0}
                              // noOfLines={2}
                              outline={'none'}
                              focusBorderColor="none"
                              border={'none'}
                              position={'absolute'}
                              w={'100%'}
                              color={'#D9C7A2'}
                              minH={0}
                              // h={'100%'}
                              resize={'none'}
                              h={'50px'}
                              _focus={{ boxShadow: 'none', border: 'none' }}
                              fontFamily={'AtlantisText'}
                              value={answers[index]?.text}
                              onChange={(e: any) => updateAnswer(e, index)}
                            />
                            {/* ) : null} */}
                          </Box>
                        </Box>
                        // </GridItem>
                      ),
                    )}
                  </SimpleGrid>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </>
    );
  };
export default ReflectionScreen;
