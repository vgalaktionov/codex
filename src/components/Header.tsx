import { Box, Button, Flex, Heading, IconButton, Link } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { GrMenu } from 'react-icons/gr';
import icon from '../../public/android-chrome-512x512.png';
import { PUBLIC_ROUTES } from '../lib/auth';
import { DarkModeSwitch } from './DarkModeSwitch';

export default function Header(props: { onOpen(): void }) {
    const router = useRouter();
    return (
        <Flex
            py="1"
            width="100vw"
            minH="62px"
            backgroundColor="black"
            color="white"
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            top="0px"
        >
            <IconButton
                aria-label="Open sidebar"
                icon={<GrMenu />}
                onClick={props.onOpen}
                ml="5"
                display={['flex', 'none']}
            />

            <NextLink href="/" passHref>
                <Flex px="5" justifyContent="center" as="a">
                    <Box height="36px" width="36px" my="auto">
                        <Image src={icon} />
                    </Box>
                    <Heading size="lg" fontWeight="extrabold" ml="4" my="auto">
                        CODEX
                    </Heading>
                </Flex>
            </NextLink>

            {PUBLIC_ROUTES.includes(router.asPath) && (
                <Flex
                    px="5"
                    my="auto"
                    justifyContent="space-between"
                    alignItems="center"
                    fontSize="lg"
                    width="80%"
                    display={['none', 'flex']}
                >
                    <Box>
                        <Link mx="4" href="/#features">
                            Features
                        </Link>
                        <Link mx="4" href="/#pricing">
                            Pricing
                        </Link>
                        <Link mx="4" href="/#legal">
                            Legal
                        </Link>
                        <Link mx="4" href="/#about">
                            About
                        </Link>
                    </Box>
                    <Box>
                        <NextLink href="/register" passHref>
                            <Button as="a" mx="2" colorScheme="cyan">
                                Register
                            </Button>
                        </NextLink>
                        <NextLink href="/login" passHref>
                            <Button as="a" mx="2" colorScheme="gray">
                                Login
                            </Button>
                        </NextLink>
                    </Box>
                </Flex>
            )}

            <DarkModeSwitch />
        </Flex>
    );
}
