
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {getSkillWiseScore} from 'utils/activitycontrols/activities';
// import { FaCheck, FaTimes } from 'react-icons/fa';

interface BlockData {
  blockQuestNo: number;
  blockSkillTag: string | null;
}

// interface GameData {
//   gameQuestNo: any;
//   gameTitle:any
//   dummyQuestions: { interaction: string }[];
//   data: BlockData[];
//   maxscoredata: Record<string, string>;
// }


interface GameData {
  gameQuestNo: any;
  gameTitle: any;
  gameStoryLine: any;
  dummyQuestions: { interaction: string }[]; // Add this line
  blockQuestion:any

  data: BlockData[];
  maxscoredata: Record<string, string>;
}

interface GameResponse {
  status: string;
  data: GameData[];
//   gameTitle: string;
//   gameStoryLine: string;
}
interface OutPut {
  gameTitle: string;
  gameStoryLine: string;
}
const SkillWiseScorePrint: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL params
  const [skillScore, setSkillScore] = useState<GameData[]>([]);
  const [gamedata, setGameData] = useState<OutPut>({ gameTitle: '', gameStoryLine: '' });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
console.log("gamedata",gamedata);
  useEffect(() => {
    const fetchSkillScore = async () => {
      try {
        if (id) {
          const result = await getSkillWiseScore(Number(id));
          console.log("result", result);
          setSkillScore(result.data);
         
        setGameData(result.game);

          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching game answer:', err);
        setError('Failed to fetch game answer');
        setLoading(false);
      }
    };

    fetchSkillScore();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !skillScore.length) {
    return <p>Error: {error || 'No data available'}</p>;
  }

  console.log("skillScore",skillScore);
  
return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '30px'}}>     
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black'}}>
        <thead>
           
            <tr style={{ textAlign: 'center' }}>
            <td colSpan={4} style={{ border: '1px solid black', padding: '8px' }}>{gamedata?.gameTitle}</td>
            </tr>
            <tr style={{ textAlign: 'center' }}>
            <td colSpan={4} style={{ border: '1px solid black', padding: '8px', margin: '0' }}>{gamedata?.gameStoryLine}</td>
            </tr>

          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>S.No</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Interaction</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Skill</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Max Score</th>
          </tr>
        </thead>
        <tbody>
        {skillScore.map((game: GameData, gameIndex: number) => {
    console.log("game:", game); // Add console log for game
    console.log("maxscoredata", game.maxscoredata.length);
    return (
        <React.Fragment key={`game-${gameIndex}`}>
            <tr>
                <td style={{ border: '1px solid black', padding: '8px' }} colSpan={4}>Game Quest No: {game.gameQuestNo}</td>
            </tr>
            {game.blockQuestion && game.blockQuestion[0] && // Add conditional check here
                <tr>
                    <td style={{ border: '1px solid black', padding: '8px' }}>{gameIndex + 1}</td> {/* Adding S.No */}
                    <td style={{ border: '1px solid black', padding: '8px' }}>{game.blockQuestion}</td> {/* Adding interaction */}
                    <td style={{ border: '1px solid black', padding: '8px' }}>{game.data && game.data[0] && game.data[0].blockSkillTag || ""}</td> {/* Add conditional check */}
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                        {/* Displaying the maximum score value without showing the key */}
                        {Object.values(game.maxscoredata).map((score: string, scoreIndex: number) => (
                            <div key={`score-${scoreIndex}`}>
                                {score}
                            </div>
                        ))}
                    </td>
                </tr>
            }
        </React.Fragment>
    );
})}

        </tbody>
      </table>
    </div>
  );
  
  
};

export default SkillWiseScorePrint;




