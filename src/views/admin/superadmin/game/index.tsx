
import { Navigate, useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import { countByStage} from 'utils/game/gameService';
const Game:React.FC = () => {

  const navigate = useNavigate();
   
      const fetchCount = async () => {
        const result = await countByStage();
        if (result?.status !== 'Success'){
          navigate('/admin/superadmin/game/home');
          return console.log('getbackruond error:' + result?.message);
        }
          else{
            if(result.count!==0){
              navigate('/admin/superadmin/game/home');
            }else{
              navigate('/admin/superadmin/game/template');
            }
        }
      };
      useEffect(() => {
        fetchCount();
      },[]);
  return (
    <>
    
    </>
  );
} 

export default Game