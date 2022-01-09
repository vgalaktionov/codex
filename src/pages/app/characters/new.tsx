import {
    Box,
    Button,
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HeadingProps,
    HStack,
    Select,
    Text,
    TextProps,
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
import ReactMarkdown from 'react-markdown';
import { dehydrate, QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import remarkGfm from 'remark-gfm';
import { getCharacterOptions } from '../../../db/rules';
import { getUserId } from '../../../lib/auth';
import { Character, CharacterOptions, CharacterSchema } from '../../../lib/characters';
import { render } from '../../../lib/rules/base';
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
    const { data } = useQuery<CharacterOptions>('characterOptions', rest.getCharacterOptions);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Pick<Character, 'race' | 'subrace'>>({
        resolver: zodResolver(CharacterSchema.pick({ race: true, subrace: true })),
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
        <chakra.form
            onSubmit={handleSubmit(onSubmit)}
            height="100%"
            width="100%"
            d="flex"
            flexDir={'column'}
            justifyContent={'space-between'}
        >
            <Heading size="xl">1. Choose a race</Heading>
            <FormControl isInvalid={generalError != null} mb="6">
                <FormErrorMessage>{generalError}</FormErrorMessage>
            </FormControl>
            <FormControl pt="2" mx="auto" pb="10">
                <FormLabel htmlFor="race">Race:</FormLabel>
                <Select {...register('race')}>
                    {data?.races.options.map((r) => (
                        <option key={r.name} value={r.name}>
                            {r.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <HStack
                w="100%"
                h="65vh"
                justifyContent="space-evenly"
                overflowY="auto"
                bgColor={bgColor[colorMode]}
                py="10"
            >
                <Box mt="6" mb="6" w={['100vw', '30vw']} h="100%">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        children={data?.races.description ?? ''}
                        components={{
                            h1: (props: HeadingProps) => (
                                <Heading size="xl">
                                    {props.children}
                                    <br /> <br />
                                </Heading>
                            ),
                            h2: (props: HeadingProps) => (
                                <Heading size="lg">
                                    {props.children} <br />
                                </Heading>
                            ),
                            h3: (props: HeadingProps) => (
                                <Heading size="md">
                                    {props.children} <br />
                                </Heading>
                            ),
                            p: (props: TextProps) => (
                                <Text>
                                    {props.children} <br />
                                    <br />
                                </Text>
                            ),
                        }}
                    />
                </Box>

                <Box mt="6" mb="6" w={['100vw', '30vw']} h="100%">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        children={render(data?.races.options.find((r) => r.name === chosenRace)?.rule)}
                        components={{
                            h1: (props: HeadingProps) => (
                                <Heading size="xl">
                                    {props.children}
                                    <br /> <br />
                                </Heading>
                            ),
                            h2: (props: HeadingProps) => (
                                <Heading size="lg">
                                    {props.children} <br />
                                </Heading>
                            ),
                            h3: (props: HeadingProps) => (
                                <Heading size="md">
                                    {props.children} <br />
                                </Heading>
                            ),
                            p: (props: TextProps) => (
                                <Text>
                                    {props.children} <br />
                                    <br />
                                </Text>
                            ),
                        }}
                    />
                </Box>
            </HStack>
            <HStack w="100%" pb="10" pt="10" justifyContent="space-between" mt="auto">
                <Button colorScheme="orange" leftIcon={<FaBackward />} disabled={true}>
                    Previous
                </Button>

                <Button colorScheme="orange" leftIcon={<FaForward />} type="submit">
                    Next
                </Button>
            </HStack>
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
            {/* <HStack w="100%" pb="10" justifyContent="space-between">
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
            </HStack> */}
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
