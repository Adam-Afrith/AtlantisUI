// App.tsx
import React, { useState } from 'react';
import ChatPopup from './ChatPopup';
import { MdAdd } from 'react-icons/md';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ChatGPTIcon from '../../../../../assets/img/chatgpt/gpticon2.png';
import {
  Box,
  Text,
  Flex,
  Button,
  Icon,
  List,
  ListItem,
  Img,
  useToast,
  Divider,
  Tooltip,
} from '@chakra-ui/react';

const API_KEY = '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';
const ChatButton: React.FC = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([
    // Adjust the type based on your actual message structure
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: 'just now',
      sender: 'ChatGPT',
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendRequest = async (message: string) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: 'ChatGPT',
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages: any[]) {
    // Adjust the type based on your actual message structure
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === 'ChatGPT' ? 'assistant' : 'user';
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }
  const handleCloseChat = () => {
    setShowChat(false);
  };
  return (
    <div className="App">
      {showChat && (
        <ChatPopup
          messages={messages}
          isTyping={isTyping}
          onSend={handleSendRequest}
          onClose={handleCloseChat}
        />
      )}
      <Box
        position="fixed"
        bottom={{ base: '105px', xl: '20px' }}
        right={{ base: '12px', xl: '20px' }}
      >
        <Tooltip hasArrow label="Ask From ChatGPT" placement='top-start'>
          <div>
            <Button
              bg={'#279b7e'}
              _hover={{
                transform: 'translateY(-2px)', // Apply a slight upward translation on hover
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
              color={'#fff'}
              mr={'10px'}
              w="50px"
              h="50px"
              className="showFormBox"
              onClick={() => setShowChat(!showChat)}
            >
              <Img
                src={ChatGPTIcon}
                style={{ height: '30px', maxWidth: '30px' }}
              />
            </Button>
          </div>
        </Tooltip>
      </Box>
    </div>
  );
};

export default ChatButton;
