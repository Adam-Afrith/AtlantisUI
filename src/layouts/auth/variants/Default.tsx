// Chakra imports
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Footer from 'components/footer/FooterAuthDefault';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
// Custom components
import { NavLink } from 'react-router-dom';
// Assets
import { FaChevronLeft } from 'react-icons/fa';

function AuthIllustration(props: {
  children: JSX.Element;
  illustrationBackground: string;
}) {
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    <Flex position="relative" h="max-content">
      <Flex
        h={{
          sm: 'initial',
          md: 'unset',
          lg: '100vh',
          xl: '97vh',
        }}
        w="100%"
        maxW={{ md: '66%', lg: '1313px' }}
        mx="auto"
        pt={{ sm: '50px', md: '0px' }}
        px={{ lg: '30px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent="start"
        direction="column"
      >
        <NavLink
          to="/admin"
          style={() => ({
            width: 'fit-content',
            marginTop: '40px',
          })}
        >
          <Flex
            align="center"
            ps={{ base: '25px', lg: '0px' }}
            pt={{ lg: '0px', xl: '0px' }}
            w="fit-content"
          >
            {/* <Icon
              as={FaChevronLeft}
              me="12px"
              h="13px"
              w="8px"
              color="secondaryGray.600"
            /> */}
            <Text ms="0px" fontSize="sm" color="secondaryGray.600">
              {/* Dashboard */}
            </Text>
          </Flex>
        </NavLink>
        {children}
        <Box
          display={{ base: 'none', md: 'none', lg: 'block' }}
          h="100%"
          minH="100vh"
          w={{ lg: '50vw', '2xl': '44vw' }}
          position="absolute"
          right="0px"
          bgGradient="linear(to-b, brand.400, brand.600)"
          borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
        >
                   
          <Flex
            // bg={`url(${illustrationBackground})`}
            justify="center"
            align="center"
            // w="100px"
            // h="100px"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
          />
          <Flex justify="center" align="center" w="100%" h="100%" flexDirection='column' >
            <Box bg={`url(${illustrationBackground})`} w='200px' h='200px' backgroundSize='contain' backgroundPosition='center' backgroundRepeat='no-repeat'></Box>
            <Text color='#fff' letterSpacing={2.3} pl='20px' display="flex" justifyContent='center' alignItems='center' fontSize={60} fontWeight={600} position='relative' bottom='23px' >ATLANTIS</Text> 
          </Flex>
        </Box>
        {/* <Footer /> */}
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}
// PROPS

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
