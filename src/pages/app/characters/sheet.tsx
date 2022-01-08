import { Button, Heading, Text, useColorMode, VStack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getCharacters } from '../../../db/characters';
import { getUserId } from '../../../lib/auth';
import { Character } from '../../../lib/characters';
import { serializeDates } from '../../../lib/util';
import rest from '../../../rest';

const CharacterSheet = () => {
    const { data } = useQuery<Character[]>('characters', rest.getCharacters);
    const character = data?.find((c) => c.active);
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    return (
        <VStack w="100%" h="calc(100vh - 62px)" px={['2', '20']} py="6" justifyContent={'start'}>
            <Heading my="6" size="2xl">
                Character Sheet
            </Heading>
            {character == null && (
                <VStack maxH="calc(100vh - 62px)" h="100%" justifyContent="center">
                    <Heading size="md">You have no active characters.</Heading>
                    <Text pb="6">Create a new one to get started.</Text>
                    <NextLink href="/app/characters/new" passHref>
                        <Button as="a" colorScheme="orange" leftIcon={<FaPlus />}>
                            Create new character
                        </Button>
                    </NextLink>
                </VStack>
            )}
        </VStack>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();

    const userId = getUserId(context.req, context.res);

    await queryClient.prefetchQuery('characters', async () => (await getCharacters(userId)).map(serializeDates));

    return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default CharacterSheet;
