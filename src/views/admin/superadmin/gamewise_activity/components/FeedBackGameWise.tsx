import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameCompleteList } from 'utils/activitycontrols/activities'; // Adjust the import path as needed

interface Feedback {
  feedLearnerId: number;
  feedContent?: string;
  feedRecommendation?: string;
  feedRelevance?: string;
  feedGamification?: string;
  feedBehaviour?: string;
  feedOthers?: string;
}

interface LearnerFeedback {
  username: string;
  companyName: string;
  feedback: Feedback[];
}

interface GameDetails {
  gameTitle: string;
  gameStoryLine: string;
  learnerFeedback: LearnerFeedback[];
}

const FeedBackGameWise: React.FC = () => {
  const { id } = useParams(); // Extract id from URL params
  const [gameDetails, setGameDetails] = useState<GameDetails>({
    gameTitle: '',
    gameStoryLine: '',
    learnerFeedback: []
  });
  console.log("passedId",id)
  const gameAnswer = async () => {
    try {
      if (id) {
        const result = await GameCompleteList(Number(id)); // Assuming GameCompleteList function takes game ID as argument
        setGameDetails(result);
       

        console.log("result ", result);
        console.log('username:', result.learnerFeedback[0].username); // Logging the first learner's username
        console.log('companyName:', result.learnerFeedback[0].companyName); // Logging the first learner's companyName
        console.log('feedbackData:', result.learnerFeedback[0].feedback); // Logging the feedback data
         // Assuming the result contains gameTitle, gameStoryLine, and learnerFeedback
      }
     
    } catch (err) {
      console.error('Error fetching game answer:', err);
    }
  };
  console.log("gameDetails",gameDetails)
  useEffect(() => {
    gameAnswer();
  }, [id]); // Trigger the effect whenever the id changes

  const renderFeedback = (feedback: Feedback) => (
    <>
      {feedback.feedContent && feedback.feedContent !== 'N/A' && <div>Content: {feedback.feedContent}</div>}
      {feedback.feedRecommendation && feedback.feedRecommendation !== 'N/A' && <div>Recommendation: {feedback.feedRecommendation}</div>}
      {feedback.feedRelevance && feedback.feedRelevance !== 'N/A' && <div>Relevance: {feedback.feedRelevance}</div>}
      {feedback.feedGamification && feedback.feedGamification !== 'N/A' && <div>Gamification: {feedback.feedGamification}</div>}
      {feedback.feedBehaviour && feedback.feedBehaviour !== 'N/A' && <div>Behaviour: {feedback.feedBehaviour}</div>}
      {feedback.feedOthers && feedback.feedOthers !== 'N/A' && <div>Others: {feedback.feedOthers}</div>}
    </>
  );

  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <table style={{ borderCollapse: 'collapse', width: '80%', border: '1px solid black' ,marginTop: '20px' }}>
          <thead>
            <tr>
              <th colSpan={2} style={{ padding: '3px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1px' }}>{gameDetails.gameTitle}</h2>
                <p style={{ marginBottom: '1px',marginLeft:'30px' }}>{gameDetails.gameStoryLine}</p>
              </th>
            </tr>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Learner Name \ Company Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {gameDetails.learnerFeedback.map((learner, index) => (
              <React.Fragment key={index}>
                <tr style={{ borderBottom: '1px solid black' }}>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{learner.username} \ {learner.companyName}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {learner.feedback.length > 0 ? learner.feedback.map((feedback, feedbackIndex) => (
                      <div key={feedbackIndex} style={{ marginBottom: '10px' }}>
                        {renderFeedback(feedback)}
                      </div>
                    )) : 'No feedback'}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedBackGameWise;
