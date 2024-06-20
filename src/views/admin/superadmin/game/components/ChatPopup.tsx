import React, { useEffect, useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import { Box } from '@chakra-ui/react';

interface ChatPopupProps {
  messages: any[]; // Adjust the type based on your actual message structure
  isTyping: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ messages, isTyping, onSend, onClose }) => {
  const [trans,setTrans] = useState(true);
 useEffect(()=>{
    setTimeout(()=>{setTrans(false)},1000)
 },[])
  return (
    <Box
      position={'fixed'}
      top={'20px'}
      right={'20px'}
      height={{base:'78%',xl:"85%"}}
      width = {{base:'90%',md:'32%',xl:"25%"}}
      background={'#fff'}
      zIndex={9999999}
      borderRadius={'8px'}
      padding={'5px 5px 50px 5px'}
      border={'3px solid #11047a'}
      transform={
        trans
          ? 'scale(0.5) translate(30px 100px)'
          : 'scale(1) translate(0px 0px)'
      }
      transition="transform 0.3s ease-in-out"
    >
      <div
        style={{
          paddingBottom: '10px',
          paddingTop: '10px',
          textAlign: 'center',
          backgroundColor: '#11047a',
          borderRadius: '8px 8px 0px 0px',
        }}
      >
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '0',
            color: '#fff',
          }}
        >
          ChatGPT
        </h2>
      </div>
      <MainContainer
        style={{
          padding: '10px 0px',
          borderRadius: '0px 0px 8px 8px',
          border: 'none',
        }}
      >
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null
            }
          >
            {messages.map((message, i) => (
              <Message key={i} model={message} />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Message ChatGPT..."
            onSend={onSend}
            attachButton={false}
            sendButton={true}
          />
        </ChatContainer>
      </MainContainer>
      {/* <button onClick={onClose}>Close</button> */}
    </Box>
  );
};

export default ChatPopup;
