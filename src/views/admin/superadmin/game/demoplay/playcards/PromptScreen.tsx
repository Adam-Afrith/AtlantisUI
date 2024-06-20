import { Box, Img, Button, Text, FormLabel, Input, FormHelperText, FormErrorMessage, FormControl, CloseButton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


type languageProps = {
  formData: any;
  preloadedAssets: any;
  gameLanguages: any;
  hasMulitLanguages: boolean;
  setHasMulitLanguages: any;
  profileData: any;
  setProfileData: any;
  isOpenCustomModal: boolean;
  setIsOpenCustomModal: (value: boolean) => void;
  setPreLogDatas: (val: any) => void;
  getPrevLogDatas: any;
  currentScreenId: number;
  isInitialLoadScreenWelcome: boolean;
  setIsInitialLoadScreenWelcome: (value: boolean) => void;
}
const genderList = ['Male', 'Female', 'Others'];
const IsErrorInitialState: { name: string | null; language: string | null; gender: string | null } = {
  name: null,
  language: null,
  gender: null,
};

const defaultLanguage = ''; // Default to empty string instead of 0
const PromptScreen: React.FC<languageProps> = ({ formData, preloadedAssets, gameLanguages, hasMulitLanguages, setHasMulitLanguages, profileData, setProfileData, setIsOpenCustomModal, isOpenCustomModal, setPreLogDatas, getPrevLogDatas, currentScreenId, isInitialLoadScreenWelcome, setIsInitialLoadScreenWelcome }) => {
  const [isLanguageSelected, setIsLanguageSelected] = useState(false); //to handle the dropdown open and hide for language
  const [isGenderSelected, setIsGenderSelected] = useState(false); //to handle the dropdown open and hide for gender
  const [isError, setIsError] = useState(IsErrorInitialState);
  const [formState, setFormState] = useState<any>({
    name: getPrevLogDatas?.previewProfile?.name || '',
    language: getPrevLogDatas?.previewProfile?.language || 1, //1 for english
    gender: getPrevLogDatas?.previewProfile?.gender || '',
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExistingValueUpdated, setIsExistingValueUpdated] = useState(false);

  const hasFormState = () => {
    if (getPrevLogDatas?.previewProfile?.hasOwnProperty(['name', 'language', 'gender']))
      return true;
    return false;
  }
  useEffect(() => {
    if (hasFormState()) {
      setFormState({
        name: getPrevLogDatas?.previewProfile?.name || '',
        language: getPrevLogDatas?.previewProfile?.language || defaultLanguage,
        gender: getPrevLogDatas?.previewProfile?.gender || '',
      });
    }
  }, [getPrevLogDatas])

  useEffect(() => {
    /*** Profile Screen Control logic */
    if (hasFormState()) {
      const { name, language, gender } = getPrevLogDatas?.previewProfile;
      if (currentScreenId === 1 && name && gender && language) {
        if (hasMulitLanguages && isInitialLoadScreenWelcome) {
          setIsOpenCustomModal(true);
        }
      }
      else {
        if (currentScreenId === 1 && isInitialLoadScreenWelcome) {
          setTimeout(() => {
            setIsOpenCustomModal(true);
          }, 200);
        }
      }
    }
  }, [hasMulitLanguages, currentScreenId])

  const handleProfile = (e: any, input?: any) => {
    const { id, value } = e.target;
    if (id === 'gender') {
      setIsGenderSelected(false);
    } else if (id === 'language') {
      setIsLanguageSelected(false);
    }
    // Restrict the length of 'value' to a maximum of 15 characters if 'id' is 'name'
    const trimmedValue = id === 'name' ? value.slice(0, 15) : value;

    setIsError((prevError) => ({ ...prevError, [id]: null }));
    setFormState((prev: any) => ({ ...prev, [id]: id === 'name' ? trimmedValue : input }));
  };

  const handleProfileSubmit = () => {
    const newErrors = {
      name: formState.name.trim() === '' ? 'Alias name is empty! Please enter an alias name' : null,
      gender: formState.gender === '' ? 'Gender field is mandatory' : null,
      language: gameLanguages.length > 0 && formState.language === '' ? 'Language field is mandatory' : null,
    };

    setIsError(newErrors);
    const isErrorPresent = Object.values(newErrors).some(error => error !== null);
    if (!isErrorPresent) {
      setProfileData((prev: any) => ({ ...prev, ...formState }));
      setPreLogDatas((prev: any) => ({
        ...prev, previewProfile: {
          ...formState,
          score: getPrevLogDatas.previewProfile.score ? getPrevLogDatas.previewProfile.score : []
        }
      }))
      setIsOpenCustomModal(false);
      if (isInitialLoadScreenWelcome) {
        setIsInitialLoadScreenWelcome(false);
      }
    }
  };

  useEffect(() => {
    let timer: any;
    const isErrorPresent = Object.values(isError).some(error => error !== null);

    if (isErrorPresent) {
      setIsAnimating(true);
      timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }
    return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts
  }, [isError]);

  return (
    (isOpenCustomModal || (currentScreenId === 1 && isInitialLoadScreenWelcome)) && (
      <Box id="container" className="Play-station">
        <Box className="top-menu-home-section">
          <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <Box className="Setting-box">
              <Img
                src={preloadedAssets.Lang}
                className="setting-pad"
                h={'100vh !important'}
              />
              <Box className="vertex">
                <FormLabel className={'label'} me={'0'}>
                  Profile
                </FormLabel>
                <Box position={'relative'} mb={'10%'}>
                  <Text
                    className={'choosen_lang'}
                    ml={'9% !important'}
                  >
                    Name
                  </Text>
                  <Img
                    className="formfield"
                    w={'100%'}
                    h={'auto'}
                    src={preloadedAssets.FormField}
                  />
                  <Box
                    w={'100%'}
                    position={'absolute'}
                    display={'flex'}
                    borderRadius={'50px'}
                    top={'100%'}
                    className={isError?.name !== null && isAnimating && 'animate_error'}
                    onFocus={() => setIsAnimating(false)}
                  >
                    <Box
                      w={'100%'}
                      display={'flex'}
                      justifyContent={'center'}
                    >
                      <input
                        style={{
                          width: '100%',
                        }}
                        autoComplete='off'
                        type={'text'}
                        id={'name'}
                        className="player_profilename"
                        placeholder={'Enter Alias Name'}
                        value={formState.name}
                        onChange={(e: any) => handleProfile(e)}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box position={'relative'} mb={'10%'}>
                  <Text
                    onClick={() => setIsGenderSelected(!isGenderSelected)}
                    className={'choosen_lang'}
                    ml={'9% !important'}
                  >
                    Gender
                  </Text>
                  <Img
                    className="formfield"
                    w={'100%'}
                    h={'auto'}
                    src={preloadedAssets.FormField}
                    onClick={() => setIsGenderSelected(!isGenderSelected)}
                  />
                  <Box
                    w={'100%'}
                    position={'absolute'}
                    display={'flex'}
                    className={isError?.gender !== null && isAnimating && 'animate_error'}
                    borderRadius={'50px'}
                    onClick={() => setIsGenderSelected(!isGenderSelected)}
                    onFocus={() => setIsAnimating(false)}
                    top={'95%'}
                  >
                    <Box w={'80%'} display={'flex'} justifyContent={'center'}>
                      <Text
                        onClick={() => setIsGenderSelected(!isGenderSelected)}
                        className={'choosen_lang'}
                      >
                        {formState.gender}
                      </Text>
                    </Box>
                    <Box w={'20%'}>
                      <Img
                        src={preloadedAssets.Selected}
                        className={'select'}
                        mt={'18%'}
                      />
                    </Box>
                    {isGenderSelected && (
                      <Box className="dropdown">
                        {genderList &&
                          genderList.map((gender: any, num: any) => (
                            <Text
                              className={'choosen_langs'}
                              ml={'5px'}
                              key={num}
                              _hover={{ bgColor: '#377498' }}
                              id={'gender'}
                              onClick={(e: any) => handleProfile(e, gender)}
                            >
                              {gender}
                            </Text>
                          ))}
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box position={'relative'} mb={'10%'}>
                  <Text
                    onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                    className={'choosen_lang'}
                    ml={'9% !important'}
                  >
                    Language
                  </Text>
                  <Img
                    className="formfield"
                    w={'100%'}
                    h={'auto'}
                    src={preloadedAssets.FormField}
                    onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                  />
                  <Box
                    w={'100%'}
                    position={'absolute'}
                    className={isError?.language !== null && isAnimating && 'animate_error'}
                    borderRadius={'50px'}
                    display={'flex'}
                    onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                    onFocus={() => setIsAnimating(false)}
                    top={'95%'}
                  >
                    <Box w={'80%'} display={'flex'} justifyContent={'center'}>
                      <Text
                        onClick={() => setIsLanguageSelected(!isLanguageSelected)}
                        className={'choosen_lang'}
                      >
                        {gameLanguages.length > 0 ? gameLanguages.find((lan: any) => lan.value === formState?.language)?.label : 'English'}
                      </Text>
                    </Box>
                    <Box w={'20%'}>
                      <Img
                        src={preloadedAssets.Selected}
                        className={'select'}
                        mt={'18%'}
                      />
                    </Box>
                    {isLanguageSelected && (
                      <Box className="dropdown" >
                        {gameLanguages.length > 0 ? gameLanguages.map((lang: any, num: any) => (
                          <Text
                            className={'choosen_langs'}
                            ml={'5px'}
                            key={num}
                            _hover={{ bgColor: '#377498' }}
                            id={'language'}
                            onClick={(e: any) =>
                              handleProfile(e, lang.value)
                            }
                          >
                            {lang.label}
                          </Text>
                        )) : null}
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box display={'flex'} justifyContent={'center'} w={'100%'}>
                  <Button
                    className="okay"
                    onClick={() => handleProfileSubmit()}
                  >
                    <Img
                      className='profile-okay-btn'
                      src={preloadedAssets.OkayBtn}
                      w={'100%'}
                      h={'auto'}
                    />
                  </Button>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    )
  )
}

export default PromptScreen