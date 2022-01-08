import { FormControl, FormErrorMessage, Heading, Text, useColorMode, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Character, CharacterSchema } from '../../../lib/characters';
import { log } from '../../../lib/util';
import rest from '../../../rest';

const NewCharacter = () => {
    const { colorMode } = useColorMode();
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
        <VStack
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="calc(100vh - 62px)"
            pt="6"
            px={['2', '20']}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Heading size="2xl">Create New Character</Heading>
                <Text mt="6" mb="6">
                    Voluptate veniam reprehenderit cupidatat sit deserunt dolore dolore quis ipsum laborum commodo
                    laboris veniam. Proident ut ipsum dolore ad ad sit. Id et adipisicing occaecat dolore dolor
                    excepteur nulla id culpa consequat incididunt elit. Aute culpa consequat magna cupidatat Lorem
                    deserunt duis ex enim quis labore.
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
            </form>
        </VStack>
    );
};

export default NewCharacter;
