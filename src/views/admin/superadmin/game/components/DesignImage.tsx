import { Box, Img } from "@chakra-ui/react";
import CompletionContentScreen from './onimage/CompletionScreen';
import ReflectionContentScreen from './onimage/ReflectionScreen';
import TakeAwaysContentScreen from './onimage/TakeAwaysScreen';
import TyContentScreen from './onimage/TyContentScreen';
import WelcomeContentScreen from './onimage/WelcomeContentScreen';


const DesignImage: React.FC<{
  currentTab?: any,
  selectedBadge?: any,
  formData?: any,
  ScreenMainImages?: any,
  compliData?: any,
  setCompliData?: any,
  CompKeyCount?: any,
  reflectionQuestions?: any,
  reflectionQuestionsdefault?: any,
}> = ({
  currentTab,
  selectedBadge,
  formData,
  ScreenMainImages,
  compliData,
  setCompliData,
  CompKeyCount,
  reflectionQuestions,
  reflectionQuestionsdefault,

}) => {

    return (
      <Box className="Images">
        {currentTab === 0 && (
          <CompletionContentScreen
            selectedBadge={selectedBadge}
            formData={formData}
            imageSrc={ScreenMainImages[currentTab]}
            compliData={compliData}
            setCompliData={setCompliData}
            CompKeyCount={CompKeyCount}
          />
        )}
        {currentTab === 1 && (
          <Box
            w={'100%'}
            h={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Box w={'auto'} position={'relative'} h={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <Img src={ScreenMainImages[currentTab]} h={'auto'} w={'100%'} transition={'transform 0.3s ease'} transform={{ lg: 'scale(1)', '2xl': 'scale(1.3)' }} />
            </Box>
          </Box>
        )}
        {currentTab === 2 && (
          <ReflectionContentScreen
            preview={false}
            formData={formData}
            imageSrc={ScreenMainImages[currentTab]}
            reflectionQuestions={reflectionQuestions}
            reflectionQuestionsdefault={reflectionQuestionsdefault}
          />
        )}
        {currentTab === 3 && (
          <TakeAwaysContentScreen
            preview={false}
            formData={formData}
            imageSrc={ScreenMainImages[currentTab]}
          />
        )}
        {currentTab === 4 && (
          <WelcomeContentScreen
            preview={false}
            formData={formData}
            imageSrc={ScreenMainImages[currentTab]}
          />
        )}
        {currentTab === 5 && (
          <TyContentScreen
            preview={false}
            formData={formData}
            imageSrc={ScreenMainImages[currentTab]}
          />
        )}
      </Box>
    )
  }

export default DesignImage;