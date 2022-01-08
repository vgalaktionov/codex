import { Button, Checkbox, Heading, HStack, Text, useColorMode, VStack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getCharacters } from '../../../db/characters';
import { getUserId } from '../../../lib/auth';
import { Character } from '../../../lib/characters';
import { serializeDates } from '../../../lib/util';
import rest from '../../../rest';

const CharactersList = () => {
    const { data } = useQuery<Character[]>('characters', rest.getCharacters);
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    return (
        <VStack w="100%" h="calc(100vh - 62px)" px={['2', '20']} py="6" justifyContent={'start'}>
            <Heading my="6" size="2xl">
                Characters List
            </Heading>
            <HStack w="100%" justifyContent="end">
                <NextLink href="/app/characters/new" passHref>
                    <Button as="a" colorScheme="orange" leftIcon={<FaPlus />}>
                        Create new character
                    </Button>
                </NextLink>
            </HStack>
            {data?.length === 0 && (
                <VStack maxH="calc(100vh - 62px)" h="100%" justifyContent="center">
                    <Heading size="md">You have no active characters.</Heading>
                    <Text pb="6">Create a new one to get started.</Text>
                </VStack>
            )}
            {(data?.length ?? 0) > 0 && (
                <VStack w="100%" pt="6">
                    {data?.map((c) => (
                        <HStack
                            key={c.id}
                            mt="6"
                            w="100%"
                            justifyContent="space-between"
                            bgColor={bgColor[colorMode]}
                            p={6}
                        >
                            <Heading size="sm">{c.name}</Heading>
                            <Text>{c.level}</Text>
                            <Text>{c.race}</Text>
                            <Text>{c.updatedAt?.toLocaleString('en-gb')}</Text>
                            <Checkbox defaultChecked={c.active}>Active</Checkbox>
                        </HStack>
                    ))}
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

export default CharactersList;
