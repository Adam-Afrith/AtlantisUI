import { Img, Text, SimpleGrid, Box, Textarea } from '@chakra-ui/react';
import { forEach } from 'lodash';
import React, { useEffect, useState } from 'react';

/* for reflection question inside the image */
const Reflection: React.FC<{
  formData: any;
  reflectionQuestions?: any;
  imageSrc: any;
  gameInfo?: any;
  setCurrentScreenId?: any;
  preloadedAssets: any;
  setPreLogDatas: any;
  getPrevLogDatas: any;
}> = ({ formData, reflectionQuestions, imageSrc, gameInfo, setCurrentScreenId, preloadedAssets, setPreLogDatas, getPrevLogDatas }) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [answers, setAnswers] = useState<any>([]);
  const [RefAnswer, setrefAnswer] = useState<any>([]);
  const [reflectionFilter,setReflectionFilter] = useState<any>([reflectionQuestions]);
    useEffect(()=>{
const storedRefAnswers =  getPrevLogDatas?.playerInputs?.Reflection;
if(storedRefAnswers)
  {
    setrefAnswer(storedRefAnswers);
    const modifedAnswers = storedRefAnswers.map((item: { [key: string]: string }) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      return { text: item[key] }; // Return a new object with the "text" property
    });
    setAnswers(modifedAnswers)
  }
  if(reflectionQuestions)
    {
       const ReflectionFilter = reflectionQuestions.filter((item: any, index: number) => ((item?.translationId === 0 ? 1 :item?.translationId) === getPrevLogDatas.previewProfile?.language));
          setReflectionFilter(reflectionQuestions);
    }
  },[])

const validateFunc = ()=>{
  if (
    formData?.gameIsLearnerMandatoryQuestion &&
    formData?.gameReflectionQuestion &&
    answers.length == formData?.gameReflectionQuestion
    ) {
    let validate = answers.filter((ans: any) => ans === undefined || ans.text.trim() === '');
    validate.length === 0 ? setIsFormValid(true) : setIsFormValid(false);
    } else {
    formData?.gameIsLearnerMandatoryQuestion ==="true"
    ? setIsFormValid(false)
      : setIsFormValid(true);
  }
}

  useEffect(() => {
    validateFunc();
  }, [answers]);

  useEffect(()=>{
    setReflectionFilter(reflectionQuestions);
  },[reflectionQuestions])
  
  const updateAnswer = (e: any, index: any) => {
   
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], text: e.target.value };
    const updatedRefAnswers = [...RefAnswer];
    updatedRefAnswers[index] = { ...updatedRefAnswers[index], [`ref${index + 1}`]: e.target.value };
    setAnswers(updatedAnswers);
    setrefAnswer(updatedRefAnswers);
    };
    const nextNavigation = () => {
    setPreLogDatas((prev: any) => ({
      ...prev,
      playerInputs: {
        Reflection: RefAnswer,
        ...prev.playerInputs
      }
    }));
    if (gameInfo?.gameData?.gameIsShowTakeaway === 'true') {
      setCurrentScreenId(7);//Navigate to Takeaway screen
    }
    else {
      setCurrentScreenId(5);//Navigate to Thank you screen
    }
  }
  const backNavigation = () => {
    if (gameInfo?.gameData?.gameIsShowLeaderboard === 'true') {
      setCurrentScreenId(4); //Navigate to leaderboard
      return false;
      }
    else {
      setCurrentScreenId(13);
      return false;
    }
  }
useEffect(()=>{
  if(formData?.gameIsLearnerMandatoryQuestion ==='false')
    {
      setIsFormValid(true);
    }
    else{
      validateFunc();
    }
},[formData])
 
  return (
    <>
      {imageSrc && (
        <>
          <Box className="reflection-screen">
            <Img src={imageSrc} className="bg-img" />
            <Box className='title'>
              <Img src={preloadedAssets.question} />
              <Text> Reflection </Text>
            </Box>
            
          {formData?.gameIsShowReflectionScreen ==='true'?
            <>
            <Box className="content-ref">
              <SimpleGrid columns={{ base: 2 }} spacing={2} className="grid">
                {reflectionFilter?.map((item: any, index: number) =>
                (
                  <>
                    <Box key={index}>
                      <Box className='heading-wrapper'
                        w={{
                          base: '150px',
                          sm: '100px',
                          md: '150px',
                          lg: '180px',
                        }}
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
                        <Img src={preloadedAssets.qs} alt="ref" w={'20px'} h={'20px'} />
                        <Text
                          fontFamily={'AtlantisText'}
                          color={'black'}
                          className="text drop"
                          style={{ whiteSpace: 'break-spaces' }}
                          fontSize={'large'}
                        >
                          {item?.refQuestion}
                        </Text>
                      </Box>
                      <Box position={'relative'} className='input-wrapper'>
                        <Img
                          w={'350px'}
                          h={{
                            base: '20px',
                            sm: '30px',
                            md: '50px',
                            lg: '100px',
                          }}
                          src={preloadedAssets.ref}
                        />
                        <Textarea
                          resize={'none'}
                          bottom={0}
                          outline={'none'}
                          focusBorderColor="none"
                          border={'none'}
                          position={'absolute'}
                          w={'350px'}
                          color={'#D9C7A2'}
                          h={{
                            base: '20px',
                            sm: '30px',
                            md: '50px',
                            lg: '100px',
                          }}
                          _focus={{ boxShadow: 'none', border: 'none' }}
                          fontFamily={'AtlantisText'}
                          value={answers[index]?.text}
                          onChange={(e: any) => updateAnswer(e, index)}
                        />
                      </Box>
                    </Box>
                  </>
                ))}
              </SimpleGrid>
            </Box>
            <Box
              w={'100%'}
              display={'flex'}
              justifyContent={'center'}
              position={'absolute'}
              bottom={'0'}
              className='left-right-btn'
            >
              <Box w={'80%'} display={'flex'} justifyContent={'space-between'}>
                <Img src={preloadedAssets.left} w={'50px'} h={'50px'} cursor={'pointer'} onClick={backNavigation} />
                {isFormValid && (
                  <Img
                    src={preloadedAssets.right}
                    w={'50px'}
                    h={'50px'}
                    cursor={'pointer'}
                    onClick={() => nextNavigation()}
                  />
                )}
              </Box>
            </Box>
            </>
            :
            <Box zIndex={9999}>
            <Text>No preview Available - Reflection</Text>
            </Box>
            }
          </Box>
        </>
      )}
    </>
  );
};
export default Reflection;