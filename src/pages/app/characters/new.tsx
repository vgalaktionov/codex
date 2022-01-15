import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Select,
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
import InfoModal from '../../../components/InfoModal';
import { getCharacterOptions } from '../../../db/rules';
import { getUserId } from '../../../lib/auth';
import { Character, CharacterOptions, CharacterSchema } from '../../../lib/characters';
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
    } = useForm<Character>({
        resolver: zodResolver(CharacterSchema),
    });

    const chosenRace = watch('race');
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
                <Heading size="xl">1. Choose a race</Heading>
                <FormControl isInvalid={generalError != null} mb="6">
                    <FormErrorMessage>{generalError}</FormErrorMessage>
                </FormControl>
                <HStack w="100%">
                    <FormControl pt="2" mx="auto" pb="10">
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
                    <InfoModal title="Races" content={data?.races.description} />
                    <InfoModal title="Chosen Race" content={data?.races.options.find((r) => r.name === chosenRace)} />
                </HStack>
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
