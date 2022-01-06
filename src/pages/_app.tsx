import { ChakraProvider, Flex, useDisclosure, VStack } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { Container } from '../components/Container';
import Header from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { RuleLinks } from '../lib/rules/base';
import theme from '../theme';

function CODEX({ Component, pageProps }: AppProps<{ rulesLinks: RuleLinks }>) {
    const [queryClient] = useState(() => new QueryClient());
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Head>
                <title>CODEX</title>
            </Head>

            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
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
                </Hydrate>
            </QueryClientProvider>
        </>
    );
}

export default CODEX;
