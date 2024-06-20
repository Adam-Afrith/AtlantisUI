import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLearnerData } from 'utils/creatorActivity/CreatorActivity';

interface LearnerData {
  lenUserName: string;
  lenMail: string;
}

const PrintLearnerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL params
  const [learnerData, setLearnerData] = useState<LearnerData[] | null>(null); // Note this is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [getCreatorDetails, setCreatorDetails] = useState<any>(null);

  useEffect(() => {
    const learnerFetchDetails = async () => {
      try {
        if (id) {
          console.log('id',id);
          const result = await getLearnerData(Number(id));
          console.log('dataresulr',result);
          setCreatorDetails(result?.CreatorDetail);
          setLearnerData(result.data); 
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching lenData:', err);
        setError('Failed to fetch Len Data');
        setLoading(false);
      }
    };

    learnerFetchDetails();
  }, [id]);

  console.log('learnerDataPLD---',learnerData)

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Define cell and row styles
  const cellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'left'
  };
  const cellStyleee: React.CSSProperties = {
    // border: '1px solid black',
    borderBottom:'none',
    borderTop:'1px solid black',
    borderLeft:'1px solid black',
    borderRight:'1px solid black',
    padding: '8px',
    textAlign: 'center'

  };
  const cellStylee: React.CSSProperties = {
    // border: '1px solid black',
    // boderTop:'1px solid black',
    padding: '8px',
    textAlign: 'center',
    borderTop:'none',
    borderLeft:'1px solid black',
    borderRight:'1px solid black'
  };
  const rowStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    border: '1px solid black',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '30px' }}>
      <h1>Learner Details</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black'}}>
        <thead>
        <tr>
            <th colSpan={5} style={{ ...cellStyleee }} >
            Creator Name :{getCreatorDetails[0]?.ctName}
            </th>
            
          </tr>
          <tr>
            <th colSpan={5} style={{ ...cellStylee }} >
           Company Name : {getCreatorDetails[0]?.lmscompany?.cpCompanyName}
            </th>
            
          </tr>
          <tr style={rowStyle}>
            <th style={cellStyle}>S.No</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Email</th>
          </tr>
        </thead>
        <tbody>
          {learnerData?.map((learner, index) => (
            <tr key={index} style={rowStyle}>
              <td style={cellStyle}>{index + 1}</td>
              <td style={cellStyle}>{learner.lenUserName}</td>
              <td style={cellStyle}>{learner.lenMail}</td>
            </tr>
          ))}
          {learnerData.length === 0? (<tr>
            **No Data Found
          </tr>) : null}
        </tbody>
      </table>
    </div>
  );
};

export default PrintLearnerDetails;
