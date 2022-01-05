import { Box, Flex, Switch, useColorMode } from '@chakra-ui/react';

export const DarkModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    return (
        <Flex justifyContent="end" mr="5">
            <Box>
                🌝
                <Switch px="2" colorScheme="blue" isChecked={isDark} onChange={toggleColorMode} />
                🌚
            </Box>
        </Flex>
    );
};
