import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterForm, RegisterFormSchema } from '../lib/auth';
import { log } from '../lib/util';

const Register = () => {
    const { colorMode } = useColorMode();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>({ resolver: zodResolver(RegisterFormSchema) });
    const router = useRouter();
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);
    const onSubmit = async (data: RegisterForm) => {
        try {
            await axios.post('/api/auth/register', data);
            router.push('/app/characters/sheet');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                log.error(error.response?.data.error);
                setGeneralError(error.response?.data.error);
            }
        }
    };

    const bgColor = { light: 'gray.100', dark: 'gray.900' };
    return (
        <Flex justifyContent="center" alignItems="center" width="100vw" height="calc(100vh - 62px)">
            <Flex backgroundColor={bgColor[colorMode]} p="10">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Heading size="2xl">Register</Heading>
                    <Text mt="6" mb="6">
                        Nice to meet you! Please fill out this form to get started. <br /> Already have an account?
                        Click
                        <NextLink href="/login" passHref>
                            <Link color="teal.500"> here </Link>
                        </NextLink>
                        to login.
                    </Text>

                    <FormControl isInvalid={generalError != null} mb="6">
                        <FormErrorMessage>{generalError}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.email != null} mb="6">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input type="email" {...register('email')} />
                        <FormHelperText>Enter the email you'd like to use to log in.</FormHelperText>
                        {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                    </FormControl>
                    <FormControl isInvalid={errors.password != null} mb="6">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input type="password" {...register('password')} />
                        <FormHelperText>Enter a secure password.</FormHelperText>
                        {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                    </FormControl>
                    <FormControl isInvalid={errors.confirmPassword != null} mb="6">
                        <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                        <Input type="password" {...register('confirmPassword')} />
                        <FormHelperText>Repeat your password to confirm.</FormHelperText>
                        {errors.confirmPassword && (
                            <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>
                        )}
                    </FormControl>

                    <HStack>
                        <Button type="submit" colorScheme="teal" ml="auto">
                            Submit
                        </Button>
                    </HStack>
                </form>
            </Flex>
        </Flex>
    );
};

export default Register;
