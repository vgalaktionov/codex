import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Input,
    Text,
    Textarea,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Campaign, CampaignSchema } from '../../../lib/campaigns';
import { log } from '../../../lib/util';
import rest from '../../../rest';

const NewCampaign = () => {
    const { colorMode } = useColorMode();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Campaign>({ resolver: zodResolver(CampaignSchema) });
    const router = useRouter();
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);
    const queryClient = useQueryClient();
    const mutation = useMutation(rest.createCampaign, {
        onSuccess: () => {
            queryClient.invalidateQueries('campaigns');
        },
    });
    const onSubmit = async (data: Campaign) => {
        try {
            await mutation.mutateAsync(data);

            router.push('/app/campaigns/list');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                log.error(error.response?.data.error);
                setGeneralError(error.response?.data.error.toString());
            }
        }
    };

    const bgColor = { light: 'gray.100', dark: 'gray.900' };
    return (
        <VStack justifyContent="start" alignItems="center" width="100%" height="calc(100vh - 62px)" pt="6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Heading size="2xl">Create New Campaign</Heading>
                <Text mt="6" mb="6">
                    Let's get you started! Just enter a name and an optional description. The new campaign will be
                    activated automatically.
                </Text>

                <FormControl isInvalid={generalError != null} mb="6">
                    <FormErrorMessage>{generalError}</FormErrorMessage>
                </FormControl>

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
                </HStack>
            </form>
        </VStack>
    );
};

export default NewCampaign;
