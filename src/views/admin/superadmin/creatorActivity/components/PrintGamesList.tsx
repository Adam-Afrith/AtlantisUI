
import React, { useEffect, useState } from 'react';
import { useLocation,useParams } from 'react-router-dom';
import { getGamesList } from 'utils/creatorActivity/CreatorActivity';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface Values {
  ansObject: { [key: string]: string };
  optionsObject: { [key: string]: string };
  scoreObject: { [key: string]: string | number };
}

interface InteractionBlock {
  block: string;
  values: Values;
  QuestNo:any
};

const PrintGameList: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); // Extract id from URL params
  const pathParts = location.pathname.split('/');
  const gameName = pathParts[1]; // "Noofgame"
  console.log('gameName',gameName);
  const [gameData, setGameData] = useState<any>(null);
  const [getCreatorDetails, setCreatorDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const gameAnswer = async () => {
      try {
        if (id) {
          let data:any ={};
          if(gameName === 'Noofgame')
            {
               data ={
                pathName :'Noofgame',
                CreatorId: parseInt(id),
               }
            }
            else if (gameName ==='Noofgamelaunch' )
              {
                data ={
                pathName :'Noofgamelaunch',
                CreatorId: parseInt(id),
               }
              }
              else if (gameName === 'Noofgamepublish')
                {
                  data ={
                    pathName :'Noofgamepublish',
                    CreatorId: parseInt(id),
                   }
                }
                const sendData = JSON.stringify(data)
             const   result = await getGamesList(sendData);
             setCreatorDetails(result?.CreatorDetail);
             console.log('ppppppppp',result);
              setGameData(result?.data);
              setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching game answer:', err);
        setError('Failed to fetch game answer');
        setLoading(false);
      }
    };

    gameAnswer();
  }, [id]);
  // // Log data to console
  console.log(gameData);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !gameData) {
    return <p>Error: {error || 'No data available'}</p>;
  }

  // Define cell and row styles
  const cellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'left'

  };
  const cellscore: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'right'

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
  const cellQuestion: React.CSSProperties = {
    // border: '1px solid black',
    // boderTop:'1px solid black',
    padding: '8px',
    textAlign: 'left',
    borderTop:'none',
    borderLeft:'1px solid black',
    borderRight:'1px solid black'
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
  const cellicon: React.CSSProperties = {
    // border: '1px solid black',
   
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center'

  };
  const rowStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    border: '1px solid black',
  };
  const rowStylee: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    border: '1px solid black',
  };



return (
  <div style={{ fontFamily: 'Arial, sans-serif', margin: '30px' }}>
      <h1>Game Details</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid black' }}>
        <thead>
           <tr>
            {getCreatorDetails[0]?.ctName ? <th colSpan={5} style={{ ...cellStyleee }} >
           
            Creator Name :{getCreatorDetails[0]?.ctName}
            </th> : null}
            
            
          </tr>
          <tr>
            {getCreatorDetails[0]?.lmscompany?.cpCompanyName ? <th colSpan={5} style={{ ...cellStylee }} >
           Company Name : {getCreatorDetails[0]?.lmscompany?.cpCompanyName}
            </th>:null}
            
          </tr>
          <tr style={rowStyle}>
            <th style={cellStyle}>S.No</th>
            <th style={cellStyle}>Game Title</th>
            <th style={cellStyle}>Create Date</th>
          </tr>
        </thead>
        <tbody>
          
          {gameData?.map((items:any, index:number) =>
          {

          // Parse the date string into a Date object
          const timestampString = items.createdAt;
          const date = new Date(timestampString);
          const formattedDate = date.toISOString().split('T')[0];
          
          console.log(formattedDate); // Output: "2024-05-21"
          return(
            <tr key={index} style={rowStyle}>
              <td style={cellStyle}>{index + 1}</td>
              <td style={cellStyle}>{items.gameTitle}</td>
              <td style={cellStyle}>{formattedDate}</td>
            </tr>
          )})}
          {gameData.length === 0 ?
          (
             <tr>
            **No Data Found
          </tr>
          ) : null}
          
           
          
        </tbody>
      </table>
    </div>
  // <div style={{ fontFamily: 'Arial, sans-serif' }}>
  //   <>
  //     <br/>
  //     <br/>
  //     <table style={{ borderCollapse: 'collapse', width: '75%' ,marginLeft:"110px",marginRight:"60px" }}>
  //       <thead>
  //         <tr>
  //           <th style={{ ...cellStyle }}>S.No</th>
  //           <th style={{ ...cellStyle }}>Game Title</th>
  //           <th style={{ ...cellStyle }}>Create Date</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {gameData?.map((items: any, index: number) => {
  //           // const questno = interactionBlock.length;
  //           console.log('items++',items);
  //           return (
  //             <>
  //                   <tr>
  //                         <td colSpan={5}>{index + 1}</td>
  //                         <td colSpan={5}>{items.gameTitle}</td>
  //                         <td colSpan={5}>{items.createdAt}</td>
  //                       </tr>
  //                       </>
  //           );
  //         })}
  //       </tbody>
  //     </table>
  //   </>
  // </div>
);



};

export default PrintGameList;
