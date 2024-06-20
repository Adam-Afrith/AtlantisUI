import React, { useState, useRef, useEffect } from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import {
  renderThumb,
  renderTrack,
  renderView,
  renderViewMini,
} from 'components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Navbar from 'assets/img/crm/navbar.png';
import Navbar1 from 'assets/img/auth/banner.png';
import NFT from 'assets/img/nfts/NftBanner2.png';
import OverView from 'assets/img/product/OverviewBanner.png';
import './sidebar.css';
import { IoMenuOutline } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';
import { css, keyframes } from '@emotion/react';
const usePath = () => {
  const location = useLocation();
  return location.pathname;
};

function Sidebar(props: { routes: RoutesType[]; [x: string]: any }) {
  const { routes, mini, hovered, setHovered } = props;
  // this is for the rest of the collapses
  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800');
  let sidebarRadius = '30px';
  let sidebarMargins = '0px';

  const path = usePath();

  return (
    <Box
      transform={{
        base: 'translateX(-100%)',
        sm: 'translateX(-100%)',
        md: 'translateX(-100%)',
        lg: 'translateX(-100%)',
        xl:
          path.startsWith('/admin/superadmin/game/creation') ||
          path.startsWith('/admin/superadmin/game/template') ||
          path.startsWith('/admin/game/preview/')
            ? 'translateX(-100%)'
            : 'translateX(0)',
      }}
      transition="transform 1s ease-in-out"
      position="fixed"
      minH="100%"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        // bg={sidebarBg}
        bg={'linear-gradient(to bottom, #7551ff, #3311db)'}
        // backgroundImage={NFT}
        backgroundRepeat={'no-repeat'}
        backgroundSize={'cover'}
        // className='sidebar-bgGradient'
        transition={variantChange}
        w={
          mini === false
            ? '285px'
            : mini === true && hovered === true
            ? '285px'
            : '120px'
        }
        ms={{
          sm: '16px',
        }}
        my={{
          sm: '16px',
        }}
        h="calc(100vh - 32px)"
        m={sidebarMargins}
        borderRadius={sidebarRadius}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={
            mini === false
              ? renderView
              : mini === true && hovered === true
              ? renderView
              : renderViewMini
          }
        >
          <Content mini={mini} hovered={hovered} routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props: {
  routes: RoutesType[];
  [x: string]: any;
}) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('Black.400', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { routes } = props;
  const path = useLocation().pathname;
  const [highlight, setHighlight] = useState(false);
  const [shouldBlink, setShouldBlink] = useState(false);
  useEffect(() => {
    // Check if the path matches the condition for blinking
    if (path.startsWith('/admin/superadmin/game/template')) {
      // Enable blinking
      setShouldBlink(true);

      // Disable blinking after 2 seconds
      const timeout = setTimeout(() => {
        setShouldBlink(false);
      }, 5000);

      // Clean up timeout to avoid memory leaks
      return () => clearTimeout(timeout);
    }
  }, [path]);
  const blinkAnimation = keyframes`
    to {
      opacity: 0.2;
    }
  `;

  const blinkStyles = css`
    animation: ${blinkAnimation} 0.2143s infinite alternate; /* Set iteration count for more than 10 times within 1 second */
  `;

  return (
    <Flex
      display={{
        sm: 'flex',
        xl:
          path.startsWith('/admin/superadmin/game/creation') ||
          path.startsWith('/admin/superadmin/game/template') ||
          path.startsWith('/admin/game/preview/')
            ? 'flex'
            : 'none',
      }}
      alignItems="center"
    >
      <Flex
        ref={btnRef}
        w="max-content"
        h="max-content"
        onClick={onOpen}
        align="center" // Align vertically
        justify="center" // Align horizontally
      >
        {/* <Icon
    as={IoMenuOutline}
    color={menuColor}
    className='kkkooo'
    w="20px"
    h="20px"
    _hover={{ cursor: 'pointer' }}
  /> */}
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          className={`kkkooo ${shouldBlink ? 'blink-animation' : ''}`}
          w="20px"
          h="20px"
          borderRadius={shouldBlink ? '50%' : '0'}
          border={shouldBlink ? '2px solid #3311db' : 'none'}
          boxSizing="content-box"
          p="4px"
          _hover={{
            cursor: 'pointer',
          }}
          css={shouldBlink ? blinkStyles : undefined}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === 'rtl' ? 'right' : 'left'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay zIndex={9999999}/>
        <DrawerContent
        containerProps={{ zIndex: 999999999}}
          w={'285px'}
          maxW="285px"
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
          // bg={sidebarBackgroundColor}
          bg={'linear-gradient(to bottom, #7551ff, #3311db)'}

          // backgroundImage={OverView}
          // className='sidebar-bgGradient'
        >
          <DrawerCloseButton
            zIndex="3"
            onClick={onClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody
            maxW="285px"
            px="0rem"
            pb="0"
            sx={{ overflowY: 'hidden', overflowX: 'hidden', height: '100%' }}
          >
            {/* <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            > */}
            <Content mini={false} routes={routes} onClick={onClose} />
            {/* </Scrollbars> */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

export default Sidebar;
