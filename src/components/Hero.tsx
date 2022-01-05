import { Button, Flex, Heading, HStack, ListItem, UnorderedList, useMediaQuery, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Hero = () => {
    const [isLargeScreen] = useMediaQuery('(min-width: 1280px)');
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            minHeight="calc(100vh - 62px)"
            overflowX="hidden"
            width="100vw"
            bgSize="cover"
            bgImage="linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero.jpeg')"
        >
            <VStack height="100%" justifyContent="center" alignItems="start" mx="20" width="100%">
                <Heading fontSize="6vw" maxWidth="50vw">
                    Your tabletop D20 RPG companion.
                </Heading>

                <UnorderedList my="10">
                    <ListItem>Generate and track your character sheet</ListItem>
                    <ListItem>Take notes by typing, handwriting or drawing</ListItem>
                    <ListItem>Search rules</ListItem>
                    <ListItem>Add custom rules</ListItem>
                    <ListItem>Roll dice</ListItem>
                    <ListItem>All of the above over multiple campaigns</ListItem>
                </UnorderedList>

                <HStack mt="10" pt="5">
                    <NextLink href="/register" passHref>
                        <Button as="a" mx="2" colorScheme="teal">
                            Get started
                        </Button>
                    </NextLink>
                    <Button as="a" href="/#features" mx="2">
                        Tell me more
                    </Button>
                </HStack>
            </VStack>
        </Flex>
    );
};
