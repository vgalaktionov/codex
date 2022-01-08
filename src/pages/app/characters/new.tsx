import {
    Button,
    chakra,
    FormControl,
    FormErrorMessage,
    Heading,
    HStack,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Dispatch, FunctionComponent, SetStateAction, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaBackward, FaForward } from 'react-icons/fa';
import { dehydrate, QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { getCharacterOptions } from '../../../db/rules';
import { getUserId } from '../../../lib/auth';
import { Character, CharacterOptions, CharacterSchema } from '../../../lib/characters';
import { log } from '../../../lib/util';
import rest from '../../../rest';

interface StepProps {
    character: Partial<Character>;
    setCharacter: Dispatch<SetStateAction<Partial<Character>>>;
    next(): void;
    previous(): void;
}

const RaceStep = (props: StepProps) => {
    const { colorMode } = useColorMode();
    const { data } = useQuery<CharacterOptions>('characterOptions');
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Character>({ resolver: zodResolver(CharacterSchema) });
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
        <chakra.form onSubmit={handleSubmit(onSubmit)} height="90%">
            <Heading size="xl">1. Choose a race</Heading>
            <Text mt="6" mb="6">
                Voluptate veniam reprehenderit cupidatat sit deserunt dolore dolore quis ipsum laborum commodo laboris
                veniam. Proident ut ipsum dolore ad ad sit. Id et adipisicing occaecat dolore dolor excepteur nulla id
                culpa consequat incididunt elit. Aute culpa consequat magna cupidatat Lorem deserunt duis ex enim quis
                labore.
            </Text>

            <FormControl isInvalid={generalError != null} mb="6">
                <FormErrorMessage>{generalError}</FormErrorMessage>
            </FormControl>
            {/*
                <FormControl isInvalid={errors.name != null} mb="6">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input type="name" {...register('name')} />
                    <FormHelperText>Enter a unique name.</FormHelperText>
                    {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={errors.description != null} mb="6">
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea type="description" {...register('description')} />
                    <FormHelperText>Enter a description of the campaign.</FormHelperText>
                    {errors.description && <FormErrorMessage>{errors.description.message}</FormErrorMessage>}
                </FormControl>

                <HStack>
                    <Button type="submit" colorScheme="orange" ml="auto">
                        Submit
                    </Button>
                </HStack> */}
        </chakra.form>
    );
};

const STEP_FORMS: FunctionComponent<StepProps>[] = [RaceStep];

const NewCharacter = () => {
    const { colorMode } = useColorMode();
    const [step, setStep] = useState(0);
    const [character, setCharacter] = useState<Partial<Character>>({});

    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    const next = useCallback(() => setStep((s) => Math.min(5, s + 1)), [setStep]);
    const previous = useCallback(() => setStep((s) => Math.max(0, s - 1)), [setStep]);

    const onSubmit = () => {};

    const StepForm = STEP_FORMS[step];
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
            <StepForm character={character} setCharacter={setCharacter} next={next} previous={previous} />
            <HStack w="100%" pb="10" justifyContent="space-between">
                <Button colorScheme="orange" leftIcon={<FaBackward />} onClick={previous} disabled={step === 0}>
                    Previous
                </Button>
                {step < 5 && (
                    <Button colorScheme="orange" leftIcon={<FaForward />} onClick={next}>
                        Next
                    </Button>
                )}
                {step === 5 && (
                    <Button colorScheme="orange" onClick={onSubmit}>
                        Submit
                    </Button>
                )}
            </HStack>
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
