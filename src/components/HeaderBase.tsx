import { Box, Button, Flex, Heading, IconButton, Link, useMediaQuery } from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { GrMenu } from 'react-icons/gr';
import icon from '../../public/android-chrome-512x512.png';
import { DarkModeSwitch } from './DarkModeSwitch';

export default function HeaderBase(props: { onOpen(): void }) {
    const [isLargeScreen] = useMediaQuery('(min-width: 1280px)');
    return (
        <Flex
            py="1"
            width="100vw"
            minH="62px"
            backgroundColor="black"
            color="white"
            justifyContent="space-between"
            alignItems="center"
        >
            {isLargeScreen || <IconButton aria-label="Open sidebar" icon={<GrMenu />} onClick={props.onOpen} ml="5" />}
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
            {isLargeScreen && (
                <Flex px="5" my="auto" justifyContent="space-between" alignItems="center" fontSize="lg" width="80%">
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
