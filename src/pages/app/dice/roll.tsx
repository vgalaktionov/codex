import {
    Box,
    Button,
    chakra,
    Fade,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaDiceD20 } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { DiceRoll, DiceRollSchema, DieType, newRoll } from '../../../lib/dice';
import { rollDice } from '../../../lib/dice/diceRoll';
import { log } from '../../../lib/util';
import rest from '../../../rest';

const Roll = () => {
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.100', dark: 'gray.900' };
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<DiceRoll>({
        resolver: zodResolver(DiceRollSchema.omit({ result: true, createdAt: true, updatedAt: true })),
    });
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);
    const [stable, setStable] = useState(true);
    const [roll, setRoll] = useState<DiceRoll | undefined>();
    const queryClient = useQueryClient();
    const mutation = useMutation(rest.createDiceRoll, {
        onSuccess: () => {
            queryClient.invalidateQueries('dicerolls');
        },
    });
    const onSubmit = async (data: DiceRoll) => {
        console.log(data);
        try {
            setStable(false);
            const diceRoll = newRoll(data.type, data.amount);
            setRoll(diceRoll);
            await mutation.mutateAsync(diceRoll);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                log.error(error.response?.data.error);
                setGeneralError(error.response?.data.error?.toString());
            }
        }
    };

    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let element: HTMLCanvasElement | null = null;
        if (roll != null && mountRef.current != null) {
            element = rollDice(mountRef, roll);
        }
        return () => (element ? mountRef?.current?.removeChild(element) && undefined : undefined);
    }, [mountRef, roll]);

    const stableListener = () => setStable(true);

    useEffect(() => {
        window.addEventListener('diceStable', stableListener);
        return () => {
            window.removeEventListener('diceStable', stableListener);
        };
    }, [stableListener, setStable]);

    return (
        <VStack w="100%" h="calc(100vh - 62px)" px={['2', '20']} py="6" justifyContent={'start'}>
            <Heading size="2xl">Roll Dice</Heading>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', marginBottom: '2rem' }}>
                {/* <Text mt="6" mb="6">
                    Welcome back! Please enter your login details to get started. <br /> Don't have an account yet?
                    Click
                    <NextLink href="/register" passHref>
                        <Link color="teal.500"> here </Link>
                    </NextLink>
                    to register.
                </Text> */}

                <FormControl isInvalid={generalError != null} mb="6">
                    <FormErrorMessage>{generalError}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.type != null} w="100%" px="6" py="2" mx="auto">
                    <FormLabel htmlFor="email">Type</FormLabel>
                    <Select defaultValue="d20" {...register('type')}>
                        {Object.values(DieType).map((v) => (
                            <option key={v.toString()} value={v.toString()}>
                                {v.toString()}
                            </option>
                        ))}
                    </Select>
                    <FormHelperText>Select the type of dice you'd to roll.</FormHelperText>
                    {errors.type && <FormErrorMessage>{errors.type.message}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={errors.amount != null} w="100%" px="6" py="2" mx="auto">
                    <FormLabel htmlFor="amount">Amount</FormLabel>
                    <NumberInput defaultValue={1} min={1}>
                        <NumberInputField {...register('amount')} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>Enter the amount of dice to roll.</FormHelperText>
                    {errors.amount && <FormErrorMessage>{errors.amount.message}</FormErrorMessage>}
                </FormControl>

                <HStack w="100%">
                    <Button type="submit" colorScheme="orange" leftIcon={<FaDiceD20 />} mt="2" mx="auto">
                        Roll
                    </Button>
                </HStack>
            </form>

            {roll && (
                <Box w="100%" h="100%" pt="6" px="6" border="1px" borderColor="gray.500" borderRadius="md">
                    <Heading size="lg" pb="6">
                        Results
                    </Heading>
                    <Text as="div">
                        <strong>Dice:</strong>{' '}
                        {roll?.result.map((rs, id) => (
                            <Fade in={stable} key={id}>
                                <chakra.span
                                    display="inline-block"
                                    backgroundColor="gray.500"
                                    textAlign="center"
                                    w="2rem"
                                    py="1"
                                    mx="1"
                                    as="kbd"
                                >
                                    {rs.roll}
                                </chakra.span>
                            </Fade>
                        ))}
                        <br />
                        <br />
                        <strong>Total:</strong>{' '}
                        {<Fade in={stable}>{roll.result.reduce((acc, cur) => acc + cur.roll, 0)}</Fade>}
                    </Text>
                    <br />
                    <chakra.div ref={mountRef} minH={['20vh', '40vh']} mt="-12rem" mb="6rem"></chakra.div>
                </Box>
            )}
        </VStack>
    );
};

export default Roll;
