// Lokie Worked 04/06/2024
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignedGames } from 'utils/activitycontrols/activities';

const PrintGameWiseActivity: React.FC = () => {
  const { id } = useParams(); // Extract id from URL params
  const [assignData, setAssignData] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<{ companyName: string; lenUserName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gameAnswer = async () => {
      try {
        if (id) {
          const result = await getAssignedGames(id);
          console.log('result111', result.data);

          const data = result.data;
          const lastItem = data[data.length - 1];
          setUserInfo({ companyName: lastItem.companyName, lenUserName: lastItem.lenUserName });
          data.pop();
          setAssignData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching game answer:', err);
        setLoading(false);
      }
    };

    gameAnswer();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Define cell and row styles
  const cellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'left',
  };

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
    // borderLeft: '1px solid black',
    // borderRight: '1px solid black',
  };

  const rowStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    border: '1px solid black',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '30px' }}>
      <>       
        <table style={{ borderCollapse: 'collapse',  width: '100%', border: '1px solid black'}}>
          <thead>
            <tr>
              <th colSpan={5} style={{ ...headerStyle }}>
                <div style={{ ...userInfoStyle }}>
                  <span>User Name: {userInfo ? userInfo.lenUserName : 'N/A'}</span>
                  <span>Company Name: {userInfo ? userInfo.companyName : 'N/A'}</span>
                </div>
              </th>
            </tr>
            <tr>
              <th style={{ ...cellStyle }}>S.No</th>
              <th style={{ ...cellStyle }}>Game Name</th>
              <th style={{ ...cellStyle }}>Game Status</th>
            </tr>
          </thead>
          <tbody>
            {assignData.map((item, index) => (
              <tr key={index} style={{ ...rowStyle }}>
                <td style={{ ...cellStyle }}>{index + 1}</td>
                <td style={{ ...cellStyle }}>{item.gameName }</td>
                <td style={{ ...cellStyle }}>{item.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default PrintGameWiseActivity;
