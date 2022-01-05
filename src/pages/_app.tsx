import { ChakraProvider, Flex, useDisclosure, VStack } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Container } from '../components/Container';
import Header from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import theme from '../theme';

function CODEX({ Component, pageProps }: AppProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <ChakraProvider resetCSS theme={theme}>
            <VStack height="100vh" width="100vw" overflowX="hidden">
                <Header onOpen={onOpen} />

                <Flex width="100vw" mt="0px !important">
                    <Sidebar onClose={onClose} isOpen={isOpen} />
                    <Container height="calc(100vh - 62px)" mt="0px">
                        <Component {...pageProps} />
                    </Container>
                </Flex>
            </VStack>
        </ChakraProvider>
    );
}

export default CODEX;
