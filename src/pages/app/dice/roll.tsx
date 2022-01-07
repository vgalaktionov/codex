import {
    Box,
    Button,
    chakra,
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
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaDiceD20 } from 'react-icons/fa';
import { DiceRoll, DiceRollSchema, DieType, newRoll } from '../../../lib/dice';
import { rollDice } from '../../../lib/dice/diceRoll';
import { log } from '../../../lib/util';

const Roll = () => {
    const { colorMode } = useColorMode();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<DiceRoll>({ resolver: zodResolver(DiceRollSchema.omit({ result: true })) });
    const router = useRouter();
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);
    const [roll, setRoll] = useState<DiceRoll | undefined>();
    const onSubmit = async (data: DiceRoll) => {
        try {
            setRoll(newRoll(data.type, data.amount));
            await axios.post('/api/dice/roll', data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                log.error(error.response?.data.error);
                setGeneralError(error.response?.data.error?.toString());
            }
        }
    };

    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let element: HTMLCanvasElement | null = null;
        if (roll != null && mountRef.current != null) {
            element = rollDice(mountRef, roll);
        }
        return () => (element ? mountRef!.current!.removeChild(element) && undefined : undefined);
    }, [mountRef, roll]);

    return (
        <VStack w="100%" px="20" py="6">
            <Heading>Roll Dice</Heading>
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

                <HStack w="100%">
                    <FormControl isInvalid={errors.type != null} w="30%" px="6">
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
                    <FormControl isInvalid={errors.amount != null} w="30%" px="6">
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

                    <Button type="submit" colorScheme="orange" leftIcon={<FaDiceD20 />} ml="6">
                        Roll
                    </Button>
                </HStack>
            </form>

            {roll && (
                <Box w="100%" h="100%" pt="6" px="6" border="1px" borderColor="gray.500" mt="6" borderRadius="md">
                    <Heading size="lg" pb="6">
                        Results
                    </Heading>
                    <Text>
                        <strong>Dice:</strong>{' '}
                        {roll?.result.map((rs, id) => (
                            <chakra.div
                                display="inline-block"
                                key={id}
                                backgroundColor="gray.500"
                                textAlign="center"
                                w="2rem"
                                py="1"
                                mx="1"
                                as="kbd"
                            >
                                {rs.roll}
                            </chakra.div>
                        ))}
                        <br />
                        <br />
                        <strong>Total:</strong> {roll.result.reduce((acc, cur) => acc + cur.roll, 0)}
                    </Text>
                    <br />
                    <div ref={mountRef}></div>
                </Box>
            )}
        </VStack>
    );
};

export default Roll;
