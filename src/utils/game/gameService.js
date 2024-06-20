import { API_SERVER } from 'config/constant';
import { getMethod, postMethod, putMethod ,urls,postMethodfile,postMethodVoice,postMethodGameReview} from 'utils/url/urls';
const person = localStorage.getItem('user');
const user = JSON.parse(person);

export async function addgame(data) {
  try {
    const person = localStorage.getItem('user'); 
    const user = JSON.parse(person);    
    const response = await fetch(`${API_SERVER}${urls.addgame}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: user?.token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('addgame Error:', err);
  }
}
export async function getPreview(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getpreview}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getAllGame(data,type) {
  try {
    const response = await fetch(`${API_SERVER}${urls.gameList}${type}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function countByStage() {
  try {
    const response = await fetch(`${API_SERVER}${urls.countByStage}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getBadge(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getBadge}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getAudio(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getAudio}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
} 
// export async function getLearnerById(id) {
//   try {
//     const response = await fetch(`${API_SERVER}${urls.getLearnerById}${id}`,getMethod);
//     const result = await response.json();
//     return result;
//   } catch (err) {
//     console.log('getCreator Error:', err);
//   }
// }
export async function getBlocks(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.gameBlocks}${id}`,getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getGameById(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getGameById}${id}`, getMethod);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function updateGame(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.updateGame}${id}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error :', err.message);
  }
}
// export async function learnerStatus(idv, data) {
//   try {
//     const response = await fetch(`${API_SERVER}${urls.learnerStatus}${idv}`, putMethod(data));
//     const result = await response.json();
//     return result;
//   } catch (err) {
//     console.log('updateStatus Error:', err);
//   }
// }


export async function getImages(id){
    try { 
        const response = await fetch(`${API_SERVER}${urls.getImages}${id}`,getMethod);
        const result = await response.json();
        return result;
      }
    catch (err) {
        console.log('editCompany Error:', err.message);
      }
}


export async function getPlayer(){
  try{
      const response = await fetch(`${API_SERVER}${urls.getPlayer}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}


export async function getNonPlayer(){
  try{
      const response = await fetch(`${API_SERVER}${urls.getNonPlayer}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}



export async function getDuplicate(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.gameduplicate}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}

export async function getLaunch(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.gamelaunch}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}
export async function createReflection(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.createReflection}`, postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error :', err.message);
  }
}
export async function getAssign(id,data){
  try{
      const response = await fetch(`${API_SERVER}${urls.gameassign}${id}`,putMethod(data));
      const result = await response.json();
      return result;
  } 
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}

export async function getPublic(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.gamepublic}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}

export async function gameDelete(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.gamedelete}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}
export async function gameAssignList(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.gameassignlist}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}
export async function getSkills() {
  try {
    const response = await fetch(`${API_SERVER}${urls.getSkills}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function createCategories(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.createCategories}${id}`, postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {   
    console.log('updateCreator Error :', err.message);
  } 
}

export async function createSkills(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.createSkill}${id}`, postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error :', err.message);
  }
}
export async function gameDuplicateQuestionEntirely(id,data){
  try {
    const response = await fetch(`${API_SERVER}${urls.entireQuestion}${id}`, postMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error :', err.message);
  }
}
export async function getCreatorBlocks(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.creatorBlocks}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function uploadAudio(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.uploadAudio}`, postMethodfile(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error :', err.message);
  }
}

export async function getDefaultCat(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.defaultcat}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}

export async function getDefaultSkill(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.defaultskill}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editCompany Error:', err.message);
    }
}
export async function uploadBadge(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.uploadBadge}`, postMethodfile(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('updateCreator Error :', err.message);
  }
}

export async function getVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices');
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function setStory(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.storyInsterting}${id}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getStory(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getStory}${id}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getListStory(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.listStory}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getTemplates(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.gettemplategames}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function MaintainGameView(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.gameviewhistory}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function templateEdit(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.opentemplate}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getReflection(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getReflection}${id}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getIntroAudio(id) {
  
  try {
    const response = await fetch(`${API_SERVER}${urls.getAudio}${id}`,getMethod);
    const result = await response.blob(); 
    const blobUrl = URL.createObjectUrl(result);
    // const result = await response.blob(); 
    return blobUrl;
  } catch (err) {
    console.log('getIntro Audio Error:', err);
  }
 
} 
export async function getLanguages(){
  try{
      const response = await fetch(`${API_SERVER}${urls.languages}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editLanguage Error:', err.message);
    }
}
// Lokie Add 12/06/2024
export async function getOldLanguages(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.getOldLanguages}/${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editLanguage Error:', err.message);
    }
}

// getOldLanguages
export async function getGameLanguages(id){
  try{
      const response = await fetch(`${API_SERVER}${urls.gameLanguages}${id}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editLanguage Error:', err.message);
    }
}
///Afrith-modified-starts-20/Mar/24
export async function getContentRelatedLanguage(currGameId,langId){
  try{
    const response = await fetch(`${API_SERVER}${urls.getContentRelatedLanguage}${currGameId}/${langId}`,getMethod);
    const result = await response.json();
    return result;
}
catch (err) {
    console.log('editLanguage Error:', err.message);
  }
}
///Afrith-modified-ends-20/Mar/24
export async function getSelectedLanguages(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getSelectedLanguages}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getSelectedLanguages Error:', err);
  }
}
export async function getBlockData(id, translationId) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getBlockData}${id}/${translationId}`, getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getBlockData Error:', err);
  }
}
export async function getQuestionOptions(id, translationId) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getQuestionOptions}${id}/${translationId}`, getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getQuestionOptions Error:', err);
  }
}
export async function getQuestionResponse(id, translationId) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getQuestionResponse}${id}/${translationId}`, getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getQuestionResponse Error:', err);
  }
}
export async function getGameStoryLine(id, translationId) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getGameStoryLine}${id}/${translationId}`, getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getGameStoryLine Error:', err);
  }
}
export async function getMaxBlockQuestNo(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getMaxBlockQuestNo}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getMaxBlockQuestNo Error:', err);
  }
}
export async function getCreatedLanguages(data){
  try{

      const response = await fetch(`${API_SERVER}${urls.getCreatedLanguages}`,postMethod(data));
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('getCreatedLanguages Error:', err.message);
    }
}
export async function sentFeedbackEmails(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.sentFeedMails}`,postMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function updatelanguages(data){
  try{
      const response = await fetch(`${API_SERVER}${urls.updatelanguages}`,postMethod(data));
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('updatelanguages Error:', err.message);
    }
}


export async function QuestDeletion(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.deletequest}${id}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getCompletionScreen(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.completionscreen}${id}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getTotalMinofWords(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getTotalMinofWords}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getTotalMinofWords Error:', err);
  }
}
export async function UpdateCompletionScreen(id,data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.Compliupdate}${id}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getStoryValidtion(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getStoryValidtion}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getStoryValidtion Error:', err);
  }
}
export async function getVoiceMessage(id,data) {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}`,postMethodVoice(data));
    // const result = response; 
    return response;
  } catch (err) {
    console.log('getStoryValidtion Error:', err);
  }
}
export async function SubmitReview(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.addGameReview}`,postMethodGameReview(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getTestAudios(){
  try{
      const response = await fetch(`${API_SERVER}${urls.testAudios}`,getMethod);
      const result = await response.json();
      return result;
  }
  catch (err) {
      console.log('editLanguage Error:', err.message);
    }
}
export async function getGameDemoData(uuid) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getGameDemoData}${uuid}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function getGameCreatorDemoData(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getGameCreatorPreview}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function getQuestionOptionsText(id, translationId) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getQuestionOptionsText}${id}/${translationId}`, getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getQuestionOptionsText Error:', err);
  }
}
 //nivetha
export async function getLanguagescount(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getLanguagescount}/${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getSelectedLanguages Error:', err);
  }
}
// nivetha end 


//Afrith-modified-starts-10/May/24

export async function storyEngAudio(id, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.storyEngAudio}${id}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('setEngAudio Error:', err);
  }
}

export async function StoryInteractionAudio(id, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.StoryInteractionAudio}${id}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('StoryInteractionAudio Error:', err);
  }
}
//Afrith-modified-ends-10/May/24

//Afrith-modified-starts-11/May/24
export async function storyModGameContentLang(id, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.storyModGameContentLang}${id}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('storyModGameContentLang Error:', err);
  }
}
//AFrith-modified-ends-11/May/24

//Afrith-modified-starts-14/May/24
export async function gameOverviewGameContentLang(id, data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.gameOverviewGameContentLang}${id}`, putMethod(data));
    const result = await response.json();
    return result;
  } catch (err) {
    console.log('gameOverviewGameContentLang Error:', err);
  }
}
//Afrith-modified-ends-14/May/24
export async function getPreviewLogsData(data) {
  try {
    const response = await fetch(`${API_SERVER}${urls.getPreviewLogsData}`,putMethod(data));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function updatePreviewlogs(userDataString) {
  try {
    const response = await fetch(`${API_SERVER}${urls.updatePreviewlogs}`,putMethod(userDataString));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}
export async function BlockModifiedLog(userDataString) {
  try {
    const response = await fetch(`${API_SERVER}${urls.BlockModifiedLog}`,putMethod(userDataString));
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getCreator Error:', err);
  }
}

export async function GameWiseCompletePrint(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.GameWiseCompletePrint}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getAnswer Error:', err);
  }
}
export async function GameWiseStartedPrint(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.GameWiseStartedPrint}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getAnswer Error:', err);
  }
}

export async function GameVoicegenaration(id) {
  try {
    const response = await fetch(`${API_SERVER}${urls.gameVoicegenaration}${id}`,getMethod);
    const result = await response.json(); 
    return result;
  } catch (err) {
    console.log('getAnswer Error:', err);
  }
}
