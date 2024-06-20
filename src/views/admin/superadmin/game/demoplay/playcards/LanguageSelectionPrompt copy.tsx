import { Box, Button, FormLabel, Img, useToast, Text, Modal, ModalBody, ModalOverlay, ModalCloseButton, ModalContent, useDisclosure } from '@chakra-ui/react';
import React,{useState, useEffect} from 'react'
import { getContentRelatedLanguage } from 'utils/game/gameService';

type languageProps = {
    formData: any;
    preloadedAssets: any;
    gameLanguages: any;
    hasMulitLanguages: boolean;
    setHasMulitLanguages: any;
    profileData: any;
    setProfileData:any;
    isOpenCustomModal: boolean;
    setIsOpenCustomModal: (value: boolean)=> void;
}

const LanguageSelectionPrompt : React.FC<languageProps> = ({formData, preloadedAssets, gameLanguages, hasMulitLanguages, setHasMulitLanguages, profileData,setProfileData, setIsOpenCustomModal, isOpenCustomModal}) => {
const [select, setSelect] = useState<boolean>(false);
const [gameContentId, setGameContentId] = useState(null);
const {isOpen, onOpen, onClose} = useDisclosure();

const handleProfile = (e: any, lang?: any, langId?: any) => {
    const { id, value } = e.target;
    setSelect(false);
    setProfileData((prev: any) => ({
      ...prev,
      [id]: id === 'name' ? value : lang,
    }));
    setGameContentId(langId);
  };

  useEffect(() => {
    const fetchGameContent = async() => {
      
        const gameContentResult = await getContentRelatedLanguage(formData.gameId,gameContentId);
        if (gameContentResult.status === 'Success'){
          const data = gameContentResult.data;
          setProfileData((prev:any)=>({
            ...prev,
            content: data.map((x:any)=>({content: x.content})),
            audioUrls: data.map((x:any)=>({audioUrls: x.audioUrls})),
            textId:data.map((x:any)=>({textId: x.textId})),
            fieldName:data.map((x:any)=>({fieldName: x.fieldName})),
            Audiogetlanguage: data.map((x:any) => ({
              content: x.content,
              audioUrls: x.audioUrls,
              textId: x.textId,
              fieldName: x.fieldName,
            })),
          }))
        }
    };
    if(gameContentId){
      fetchGameContent();
    }
  },[gameContentId])

return (
    <>
        <Modal isOpen={hasMulitLanguages && isOpenCustomModal } onClose={()=>{onClose(); setIsOpenCustomModal(false)}}>
        <ModalOverlay />
        <ModalContent>
        <ModalCloseButton />
        <ModalBody>
        <Box id="container" className="Play-station">
          <Box className="top-menu-home-section">
            {hasMulitLanguages && (
              <Box className="Setting-box">
                <Img src={preloadedAssets.Lang} className="setting-pad" />
                <Box className="vertex">
                  <FormLabel className={'label'} me={'0'}>
                    Language
                  </FormLabel>
                  <Box position={'relative'}>
                    <Img
                      className="formfield"
                      w={'100%'}
                      h={'auto'}
                      src={preloadedAssets.FormField}
                      onClick={() => setSelect(!select)}
                    />
                    <Box w={'100%'} position={'absolute'} display={'flex'} top={'7%'}>
                      <Box w={'80%'} display={'flex'} justifyContent={'center'}>
                        <Text className={'choosen_lang'}>
                          {profileData?.language}
                        </Text>
                      </Box>
                      <Box w={'20%'}>
                        <Img src={preloadedAssets.Selected} className={'select'} mt={'18%'} />
                      </Box>
                      {select && (
                        <Box className="dropdown">
                          {gameLanguages &&
                            gameLanguages.map((lang: any, num: any) => (
                              <Text
                                className={'choosen_langs'}
                                ml={'5px'}
                                key={num}
                                _hover={{ bgColor: '#377498' }}
                                id={'language'}
                                onClick={(e: any) =>
                                  handleProfile(e, lang.label, lang.value)
                                }
                              >
                                {lang.label}
                              </Text>
                            ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box display={'flex'} justifyContent={'center'} w={'100%'}>
                    <Button
                      className="okay"
                    //   onClick={() => onClose(); setHasMulitLanguages(false);}
                      onClick={() => setIsOpenCustomModal(false)}
                    >
                      <Img src={preloadedAssets.OkayBtn} w={'100%'} h={'auto'} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          </Box>
        </ModalBody></ModalContent></Modal>
    </>
  );
}
export default LanguageSelectionPrompt;