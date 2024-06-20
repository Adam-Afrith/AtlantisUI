import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { getGameAnswer } from 'utils/activitycontrols/activities';

interface Values {
  ansObject: { [key: string]: string };
  optionsObject: { [key: string]: string };
  scoreObject: { [key: string]: string | number };
}

interface InteractionBlock {
  QuestNo: number;
  question: string;
  values: Values;
}

interface GameData {
  gameTitle: string;
  gameStoryLine: string;
  value: {
    interactionBlocks: InteractionBlock[];
  };
}

const PrintGameWiseActivity: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL params
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        if (id) {
          // const result = await getGameAnswer(Number(id));
          const result = await getGameAnswer(Number(id));
          setGameData(result);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to fetch game data');
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !gameData) {
    return <p>Error: {error || 'No data available'}</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <br />
      <br />
      <table style={{ borderCollapse: 'collapse', width: '75%', marginLeft: "110px", marginRight: "60px" }}>
        <thead>
          <tr>
            <th colSpan={5} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
              {gameData.gameTitle}
            </th>
          </tr>
          <tr>
            <th colSpan={5} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
              {gameData.gameStoryLine}
            </th>
          </tr>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>S.No</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Interaction</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>No. of Options</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Right Answer</th>
            <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {gameData.value.interactionBlocks.map((interactionBlock, index) => (
            <React.Fragment key={index}>
              <tr style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>
                <td colSpan={5}>Game Quest No: {interactionBlock.QuestNo}</td>
              </tr>
              {/* <tr>
                <td colSpan={5} style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{interactionBlock.question}</td>
              </tr> */}
              {Object.entries(interactionBlock.values.ansObject).map(([key, value], ansIndex) => (
                <tr key={`${index}-${ansIndex}`}>
                  {ansIndex === 0 && (
                    <>
                      <td rowSpan={Object.keys(interactionBlock.values.ansObject).length} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td rowSpan={Object.keys(interactionBlock.values.ansObject).length} style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{interactionBlock.question}</td>
                    </>
                  )}
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{interactionBlock.values.optionsObject[key]}</td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                    {value === 'true' ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{interactionBlock.values.scoreObject[key]}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintGameWiseActivity;
