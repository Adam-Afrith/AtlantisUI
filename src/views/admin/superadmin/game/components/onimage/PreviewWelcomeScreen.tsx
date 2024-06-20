import { Box, Img, Icon, Text, Grid, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getGameById, getSkills } from 'utils/game/gameService';
import rew from 'assets/img/screens/Reward Bar.png';
import back from 'assets/img/screens/back.png';
import write from 'assets/img/screens/Writing.png';
import { useParams } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import Author from 'assets/img/screens/Author.png';
import LearningOutcome from 'assets/img/screens/Learning Outcome.png';
import Note from 'assets/img/screens/Note.png';
import Skills from 'assets/img/screens/Skills.png';
import Story from 'assets/img/screens/Story.png';
import SkillsLearningOutcome from 'assets/img/screens/Skills & Learning outcome.png';
import LearningOutComes from './LearningOutComes';
import Skill from './Skills';


interface Badge {
  gasId: number;
  gasAssetImage: string;
  gasAssetName: string;
}

const extractLink = (text: any) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (text) {
    const urls = text?.match(urlRegex);

    return urls ? urls[0] : null;
  }
  return null;
};
const PreviewWelcomeScreen: React.FC<{
  formData: any;
  imageSrc: any;
  preview: any;
  preloadedAssets?: any;
}> = ({ formData, imageSrc, preview, preloadedAssets }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>([]);
  const [apSkl, setApSkl] = useState([]);
  const [authorArray, setauthorArray] = useState<any[]>([]);
  const { currentTab } = useSelector((state: RootState) => state.preview);

  const [data, setData] = useState<any[]>([]);
  const fetch = async () => {
    const result = await getGameById(id);
    if (result?.status !== 'Success') {
      setProfile([]);
      return console.log('getbackruond error:' + result?.message);
    } else {
      setProfile(result.data);
    }

    const res = await getSkills();
    if (res?.status === 'Success') {
      setApSkl(res?.data);
    }
  };
  const customStylesicon = {
    cursor: 'pointer',
    color: '#D9C7A2',
    marginRight: '4px',
  };

  useEffect(() => {
    fetch();
    const dataLearn =
      formData?.gameLearningOutcome !== null
        ? formData?.gameLearningOutcome?.split('\n')
        : [];
    setData(dataLearn);
  }, []);

  useEffect(() => {
    if (profile.gameSkills) {
      const Array = profile.gameSkills.split(',');
      setauthorArray(Array);
    }
  }, [profile]);

  const findSkillName = (authorNumber: any) => {
    const matchedSkill = apSkl.find(
      (option: any) => option.id === Number(authorNumber),
    );
    return matchedSkill ? matchedSkill.name : null;
  };

  const renderContent = () => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;

    const parts = formData?.gameAdditionalWelcomeNote?.split(linkRegex);

    const contentWithLinks = parts?.map((part: any, index: any) => {
      if (linkRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            style={{ color: '#caa784', textDecoration: 'underline' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        );
      } else {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }
    });

    return <React.Fragment>{contentWithLinks}</React.Fragment>;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, background: '#000' }}
        animate={{ opacity: 1, background: '#0000' }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Box className="screen-preview-content-wrapper">
          <Img src={preloadedAssets.backgroundImage} className="preview-welcome-texture" />
          <Box className='welcome-screen-head-content'>
            <Text
              className='welcomescreen-heading'
            >
              {formData?.gameTitle}
            </Text>
            {((currentTab !== 3 && formData.gameIsShowGameDuration === 'true') || (currentTab === 3)) &&
              <Text
                className='welcomescreen-content'
              >
                <>
                  <span style={customStylesicon}>
                    <Icon as={FaClock} />{' '}
                    {formData?.gameDuration > 1
                      ? ' ' + formData?.gameDuration + ' mins'
                      : 'Few mins'}
                  </span>
                </>
              </Text>
            }
          </Box>

          <Box className="screen-preview-welcome-grid">
            {((currentTab !== 3 && formData.gameIsShowStoryline === 'true') || (currentTab === 3)) &&
              <Box className="screen-preview-storyline screen-preview-grid-items">

                <Text className='welcomescreen-content'>{formData?.gameStoryLine}</Text>
              </Box>
            }
            {((currentTab !== 3 && (formData.gameIsShowLearningOutcome === 'true' || formData.gameIsShowSkill === 'true')) || (currentTab === 3)) &&
              <>
                <Box className='screen-welcome-rewardswrapper'>
                  <Img src={preloadedAssets.rew} alt="rew" className='screen-welcome-rewardsImg' />
                </Box>
                <Box className='screen-preview-earnings'>
                  {((currentTab !== 3 && formData.gameIsShowSkill === 'true') || (currentTab === 3)) &&
                    <Box className="screen-preview-grid-items ">
                      <Img src={preloadedAssets?.back} className="screen-preview-welcome-slo-box" />
                      <Text className='learnig-outcome-tit welcomescreen-content'> Skills</Text>
                      <Box className="screen-preview-welcome-slo-content">
                        <Skill authorArray={authorArray} preloadedAssets={preloadedAssets} findSkillName={findSkillName} />
                      </Box>
                    </Box>
                  }
                  {((currentTab !== 3 && formData.gameIsShowLearningOutcome === 'true') || (currentTab === 3)) &&
                    <Box className="screen-preview-grid-items ">
                      <Img src={preloadedAssets?.back} className="screen-preview-welcome-slo-box" />
                      <Text className='learnig-outcome-tit welcomescreen-content'> Learning OutComes</Text>
                      <Box className="screen-preview-welcome-slo-content">
                        <LearningOutComes data={data} preloadedAssets={preloadedAssets} />
                      </Box>
                    </Box>
                  }
                </Box></>
            }
            {((currentTab !== 3 && (formData.gameIsShowAuhorName === 'true' || formData.gameIsShowAdditionalWelcomeNote === 'true')) || currentTab == 3) &&
              <Box className="screen-preview-author screen-preview-grid-items">
                <Text className="text-center">
                  {((currentTab !== 3 && formData.gameIsShowAuhorName === 'true') || currentTab == 3) &&
                    <>
                      <Text className="welcomescreen-content">Author</Text>
                      <Text className="screen-preview-text welcomescreen-content">{formData?.gameAuthorName}</Text>
                    </>
                  }
                  {currentTab !== 3 && formData.gameIsShowAdditionalWelcomeNote === 'true' &&
                    <Text className="screen-preview-text welcomescreen-content welcome-additionaltext">{renderContent()}</Text>
                  }
                </Text>
              </Box>
            }
          </Box>
          <Box className='screen-preview-nxtbtn '><Img src={preloadedAssets.next} className='welcome-nxtbtn' /></Box>
        </Box>
      </motion.div>
    </>
  );
};
export default PreviewWelcomeScreen;
