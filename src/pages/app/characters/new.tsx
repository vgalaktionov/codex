import {
    Box,
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Select,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { dehydrate, QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import AbilityScorePicker from '../../../components/characters/AbilityScorePicker';
import InfoModal from '../../../components/InfoModal';
import { getCharacterOptions } from '../../../db/rules';
import { getUserId } from '../../../lib/auth';
import { Character, CharacterOptions, NewCharacter, NewCharacterSchema } from '../../../lib/characters';
import { lexicographic, log } from '../../../lib/util';
import rest from '../../../rest';

const NewCharacter = () => {
    const { colorMode } = useColorMode();
    const { data } = useQuery<CharacterOptions>('characterOptions', rest.getCharacterOptions);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<NewCharacter>({
        resolver: zodResolver(NewCharacterSchema),
    });

    const chosenRace = watch('race');
    const chosenSubrace = watch('subrace');
    const chosenClass = watch('class');
    const router = useRouter();
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);
    const queryClient = useQueryClient();
    const mutation = useMutation(rest.createCharacter, {
        onSuccess: () => {
            queryClient.invalidateQueries('characters');
        },
    });
    const onSubmit = async (data: Character) => {
        try {
            await mutation.mutateAsync(data);

            router.push('/app/characters/sheet');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                log.error(error.response?.data.error);
                setGeneralError(error.response?.data.error.toString());
            }
        }
    };

    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    return (
        <VStack
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="calc(100vh - 62px)"
            pt="6"
            px={['2', '20']}
        >
            <Heading size="2xl">Create New Character</Heading>
            <chakra.form
                onSubmit={handleSubmit(onSubmit)}
                height="100%"
                width="100%"
                d="flex"
                flexDir={'column'}
                justifyContent={'start'}
            >
                <FormControl isInvalid={generalError != null} mb="6">
                    <FormErrorMessage>{generalError}</FormErrorMessage>
                </FormControl>
                <VStack w="100%" pt="2" mx="auto" pb="10" justifyContent="start">
                    <FormControl>
                        <FormLabel htmlFor="race">Race:</FormLabel>
                        <Select {...register('race')}>
                            {data?.races.options
                                .sort(({ name: a }, { name: b }) => lexicographic(a, b))
                                .map((r) => (
                                    <option key={r.name} value={r.name}>
                                        {r.name}
                                    </option>
                                ))}
                        </Select>
                    </FormControl>
                    <HStack w="100%">
                        <InfoModal title="Races" content={data?.races.description} />
                        <InfoModal
                            title="Chosen Race"
                            buttonText={chosenRace}
                            content={data?.races.options.find((r) => r.name === chosenRace)}
                        />
                    </HStack>
                </VStack>
                <VStack w="100%" pt="2" mx="auto" pb="10" justifyContent="start">
                    <FormControl>
                        <FormLabel htmlFor="subrace">Subrace:</FormLabel>
                        <Select
                            {...register('subrace')}
                            disabled={
                                data?.subraces.options.filter(({ rule: { raceName } }) => raceName === chosenRace)
                                    .length === 0
                            }
                        >
                            <option key="none" value={undefined}>
                                No subrace
                            </option>
                            {data?.subraces.options
                                .filter(({ rule: { raceName } }) => raceName === chosenRace)
                                .sort(({ name: a }, { name: b }) => lexicographic(a, b))
                                .map((r) => (
                                    <option key={r.name} value={r.name}>
                                        {r.name}
                                    </option>
                                ))}
                        </Select>
                    </FormControl>
                    {chosenSubrace && (
                        <Box w="100%">
                            <InfoModal
                                title="Chosen Subrace"
                                buttonText={chosenSubrace}
                                content={data?.subraces.options.find((r) => r.name === chosenSubrace)}
                            />
                        </Box>
                    )}
                </VStack>
                <VStack w="100%" pt="2" mx="auto" pb="10" justifyContent="start">
                    <FormControl>
                        <FormLabel htmlFor="race">Class:</FormLabel>
                        <Select {...register('class')}>
                            {data?.classes.options
                                .sort(({ name: a }, { name: b }) => lexicographic(a, b))
                                .map((r) => (
                                    <option key={r.name} value={r.name}>
                                        {r.name}
                                    </option>
                                ))}
                        </Select>
                    </FormControl>
                    <HStack w="100%">
                        <InfoModal title="Classes" content={data?.classes.description} />
                        <InfoModal
                            title="Chosen Class"
                            buttonText={chosenClass}
                            content={data?.classes.options.find((r) => r.name === chosenClass)}
                        />
                    </HStack>
                </VStack>
                <Text mb="6">Determine ability scores:</Text>
                <AbilityScorePicker />
            </chakra.form>
        </VStack>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const queryClient = new QueryClient();

    const userId = getUserId(context.req, context.res);

    await queryClient.prefetchQuery('characterOptions', async () => await getCharacterOptions(userId));

    return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default NewCharacter;
