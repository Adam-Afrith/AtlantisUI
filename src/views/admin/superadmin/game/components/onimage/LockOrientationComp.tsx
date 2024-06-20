import React, { useEffect, useState } from 'react';
import ScreenPreview from 'views/admin/superadmin/game/components/ScreenPreview';
// const getOppositeOrientation = () => {
//   return window.matchMedia('(orientation: portrait)').matches
//     ? 'landscape'
//     : 'portrait';
// };
const getOrientation = () => {
  return window.matchMedia('(orientation: portrait)').matches
    ? 'portrait'
    : 'landscape';
}

const OrientationLock = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  // useEffect(() => {
  //   window.addEventListener('orientationchange', handleOrientationChange);
  //   return () => {
  //     window.removeEventListener('orientationchange', handleOrientationChange);
  //   };
  // }, []);

  // const handleOrientationChange = () => {
  //   setOrientation(getOrientation());
  // };
useEffect(()=>{

    const rotate = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }
        await window.screen.orientation.lock('landscape');
      };
      if(orientation =='portrait'){
        // window.screen.orientation.unlock();
        rotate();
      }
    
    
},[orientation])

  const unlock = () => {
    setOrientation('portrait');
  };

console.log("screen orientation",orientation);
  return (
    <ScreenPreview />
  );
};

export default OrientationLock;
