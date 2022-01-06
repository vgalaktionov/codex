import { Flex, Heading, Text } from '@chakra-ui/react';

export default function Custom404() {
    return (
        <Flex alignItems="center" justifyContent="center" h="100%" w="100%">
            <Heading>You rolled a natural 1 on your Perception check.</Heading>
            <Text>Just kidding, there's nothing here.</Text>
        </Flex>
    );
}
