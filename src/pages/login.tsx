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
import { LoginForm, LoginFormSchema } from '../lib/auth';
import { log } from '../lib/util';

const Login = () => {
    const { colorMode } = useColorMode();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoginForm>({ resolver: zodResolver(LoginFormSchema) });
    const router = useRouter();
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);
    const onSubmit = async (data: LoginForm) => {
        try {
            await axios.post('/api/auth/login', data);
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
                    <Heading size="2xl">Login</Heading>
                    <Text mt="6" mb="6">
                        Welcome back! Please enter your login details to get started. <br /> Don't have an account yet?
                        Click
                        <NextLink href="/login" passHref>
                            <Link color="teal.500"> here </Link>
                        </NextLink>
                        to register.
                    </Text>

                    <FormControl isInvalid={generalError != null} mb="6">
                        <FormErrorMessage>{generalError}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.email != null} mb="6">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input type="email" {...register('email')} />
                        <FormHelperText>Enter the email you use to log in.</FormHelperText>
                        {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                    </FormControl>
                    <FormControl isInvalid={errors.password != null} mb="6">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input type="password" {...register('password')} />
                        <FormHelperText>Enter your password.</FormHelperText>
                        {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
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

export default Login;
