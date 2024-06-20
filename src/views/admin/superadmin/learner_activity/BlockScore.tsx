import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlocklWiseScore } from 'utils/activitycontrols/activities';

// Define the types based on the expected data structure
interface Question {
  qpQuestNo: number;
  qpOptionText: string;
  qpSkillTag: string;
  qpScore: number;
}

interface GameData {
  lenUserName: string;
  companyName: string;
  getQuest: Question[];
}

interface ApiResponse {
  getGameId: GameData[];
}

const BlockScore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [skillScore, setSkillScore] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const fetchSkillScore = async () => {
      try {
        if (id) {
          const result: ApiResponse = await getBlocklWiseScore(id);
          setSkillScore(result.getGameId);
          if (result.getGameId.length > 0) {
            setUserName(result.getGameId[0].lenUserName);
            setCompanyName(result.getGameId[0].companyName);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching game answer:', err);
        setLoading(false);
      }
    };

    fetchSkillScore();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const headerStyle: React.CSSProperties = {
    padding: '8px',
    textAlign: 'center',
    borderTop: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    borderBottom: 'none',
  };
  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <br />
      <br />
      <table style={{ borderCollapse: 'collapse', width: '75%', marginLeft: "110px", marginRight: "60px" }}>
        <thead>
          <tr>
            <th colSpan={5} style={{ ...headerStyle }}>
              <div style={{ ...userInfoStyle }}>
                <span>User Name: {userName}</span>
                <span>Company Name: {companyName}</span>
              </div>
            </th>
          </tr>
          <tr style={{ textAlign: 'center' }}>
            <td colSpan={4} style={{ border: '1px solid black', padding: '8px' }}>Quest</td>
          </tr>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>S.No</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Skill</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Interaction</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {skillScore.map((item, index) => (
            item.getQuest.map((quest: Question, idx: number) => (
              <tr key={idx}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{quest.qpSkillTag}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{quest.qpOptionText}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{quest.qpScore}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockScore;
