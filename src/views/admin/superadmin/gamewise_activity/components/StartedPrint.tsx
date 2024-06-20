
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameWiseStartedPrint } from 'utils/game/gameService'; // Adjust the import path as needed

interface LearnerData {
  learnerName: string;
  learnerMail?: string;
  status?: string;
}

interface CreatorData {
  creatorName: string;
  companyName: string;
}

interface GameData {
  gameTitle: string;
  startedGamesData: Array<{
    creatorName: string;
    companyName: string;
    feedback: LearnerData[];
  }>;
}

const StartedPrint: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL params
  const [startedDetails, setStartedDetails] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStartedDetails = async () => {
    try {
      if (id) {
        const result = await GameWiseStartedPrint(Number(id));
        // Assuming this function fetches data
        console.log("Fetched Data:", result);
        if (result && result.data && result.data.length > 0) {
          setStartedDetails({
            gameTitle: result.data[0].gameTitle,
            startedGamesData: result.data.map((data: any) => ({
              creatorName: data.creator ? data.creator.ctName : '',
              companyName: data.company ? data.company.cpCompanyName : '',
              feedback: [{
                learnerName: data.learner ? data.learner.lenUserName : '',
                learnerMail: data.learner ? data.learner.lenMail : '',
                status: data.galGameState
              }]
            }))
          });
        } else {
          setError('No data available.');
        }
      }
    } catch (err) {
      console.error('Error fetching game details:', err);
      setError('Error fetching game details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartedDetails();
  }, [id]); // Trigger the effect whenever the id changes

  const renderFeedback = (gameStartedFeedback: LearnerData) => (
    <>
      {gameStartedFeedback.learnerName && <div>Learner Name: {gameStartedFeedback.learnerName}</div>}
      {gameStartedFeedback.learnerMail && <div>Learner Mail: {gameStartedFeedback.learnerMail}</div>}
      {gameStartedFeedback.status && <div>Status: {gameStartedFeedback.status}</div>}
    </>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!startedDetails) {
    return <div>No data available.</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <table style={{ borderCollapse: 'collapse', width: '80%', border: '1px solid black', margin: '20px auto' }}>
        <thead>
          <tr>
            <th colSpan={4} style={{ padding: '3px', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '1px' }}>{startedDetails.gameTitle}</h2>
            </th>
          </tr>
        </thead>
        <tbody>
          {startedDetails.startedGamesData.map((learner, index) => (
            <React.Fragment key={index}>
              <tr>
                {/* <td colSpan={4} style={{ padding: '3px', textAlign: 'center',border: '1px solid black' }}>
                  <h3>{learner.creatorName}, {learner.companyName}</h3>
                </td> */}
                <td colSpan={4} style={{ padding: '3px', textAlign: 'center', border: '1px solid black' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: '0' }}>{learner.creatorName}</h3>
                    <h3 style={{ margin: '0' }}>{learner.companyName}</h3>
                  </div>
                </td>
              </tr>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>S.No</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Learner Name</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Learner Mail</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
              </tr>
              {learner.feedback.map((feedback, feedbackIndex) => (
                <tr key={feedbackIndex}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{feedbackIndex + 1}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{feedback.learnerName}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{feedback.learnerMail}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{feedback.status}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StartedPrint;
