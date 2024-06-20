


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGameAssignData } from 'utils/activitycontrols/activities';

interface GameData {
  gameTitle: string;
  gameStoryLine: string;
  ctName: string;
  cpCompanyName: string;
}

interface LearnerData {
  lenUserName: string;
  lenMail: string;
}

interface Result {
  LeanerData: LearnerData[];
  GameData: GameData;
}
interface OutPut {
  gameTitle: string;
  gameStoryLine: string;
  cpCompanyName:any;
  ctName:any;
}

const GameAssignPrint: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL params
  const [leanerData, setLeanerData] = useState<LearnerData[]>([]);
  // const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gamedata, setGameData] = useState<OutPut>({ gameTitle: '', gameStoryLine: '' ,cpCompanyName:'',ctName:''});
  useEffect(() => {
    const fetchGameAssignData = async () => {
      try {
        if (id) {
          const result = await getGameAssignData(Number(id));
          console.log("result", result);
          setLeanerData(result.LeanerData);
          setGameData(result);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching game answer:', err);
        setError('Failed to fetch game answer');
        setLoading(false);
      }
    };

    fetchGameAssignData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  console.log("leanerData", leanerData);
  console.log("gameData", gamedata);

  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <br />
      <br />
      <table style={{ borderCollapse: 'collapse', width: '75%', marginLeft: "110px", marginRight: "60px" }}>
        <thead>
          <tr style={{ border: '1px solid black', padding: '8px' }}>
            <td colSpan={2} style={{ padding: '8px', textAlign: 'left' }}>{gamedata?.gameTitle}</td>
            <td colSpan={1} style={{ padding: '8px', textAlign: 'right' }}>{gamedata?.ctName}</td>
          </tr>
          <tr style={{ border: '1px solid black', padding: '8px' }}>
            <td colSpan={2} style={{ padding: '8px', textAlign: 'left' }}>{gamedata?.gameStoryLine}</td>
            <td colSpan={1} style={{ padding: '8px', textAlign: 'right' }}>{gamedata?.cpCompanyName}</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>S.No</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Learner Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Learner Mail</th>
          </tr>
        </thead>
        <tbody>
          {leanerData.map((learner, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{learner.lenUserName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{learner.lenMail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  

};

export default GameAssignPrint;
