import { Button, chakra, Heading, HStack, Text, useColorMode, VStack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { FaDiceD20 } from 'react-icons/fa';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getActiveCampaign } from '../../../db/campaigns';
import { getDiceRolls } from '../../../db/dice';
import { getUserId } from '../../../lib/auth';
import { DiceRoll, DiceRollSchema } from '../../../lib/dice';
import { serializeDates } from '../../../lib/util';
import rest from '../../../rest';

const DiceRollHistory = () => {
    const { data } = useQuery<DiceRoll[]>('dicerolls', rest.getDiceRollHistory);
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    return (
        <VStack w="100%" h="calc(100vh - 62px)" px={['2', '20']} py="6" justifyContent={'start'}>
            <Heading my="6" size="2xl">
                Dice Roll History
            </Heading>
            <HStack w="100%" justifyContent="end">
                <NextLink href="/app/dice/roll" passHref>
                    <Button as="a" colorScheme="orange" leftIcon={<FaDiceD20 />}>
                        Roll the dice
                    </Button>
                </NextLink>
            </HStack>
            {data?.length === 0 && (
                <VStack maxH="calc(100vh - 62px)" h="100%" justifyContent="center">
                    <Heading size="md">You haven't rolled the dice yet.</Heading>
                    <Text pb="6">Roll the dice and you'll find the results here.</Text>
                </VStack>
            )}
            {(data?.length ?? 0) > 0 && (
                <VStack w="100%" pt="6">
                    {data
                        ?.map((dr) => DiceRollSchema.parse(dr))
                        .map((dr) => (
                            <HStack
                                key={dr.id}
                                mt="6"
                                w="100%"
                                justifyContent="space-between"
                                bgColor={bgColor[colorMode]}
                                p={6}
                            >
                                <Heading size="sm">{dr.amount + dr.type}</Heading>
                                <Text>
                                    {dr.result.map((rs, id) => (
                                        <chakra.span
                                            display="inline-block"
                                            backgroundColor="gray.500"
                                            textAlign="center"
                                            w="2rem"
                                            py="1"
                                            mx="1"
                                            as="kbd"
                                            key={id}
                                        >
                                            {rs.roll}
                                        </chakra.span>
                                    ))}
                                </Text>
                                <Text>{dr.createdAt?.toLocaleString('en-gb')}</Text>
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
    const campaignId = (await getActiveCampaign(userId))?.id;

    await queryClient.prefetchQuery('dicerolls', async () =>
        (await getDiceRolls(userId, campaignId)).map(serializeDates),
    );

    return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default DiceRollHistory;
