import React, { useState, useEffect } from 'react';

function TypingEffect({ text, speed ,setSpeedIsOver}) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
        
    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          let currentText = displayText + text[currentIndex];
          setDisplayText(currentText);
          setCurrentIndex(prevIndex => prevIndex + 1);
        }, speed);
        return () => clearTimeout(timer);
      }
      else{
        if(currentIndex > 0)
        {
          setSpeedIsOver(true);
        }
        
      }
    }, [currentIndex,text]);
 
    return <div style={{color:'#312821'}}>{displayText}</div>;
  }

  export default TypingEffect;