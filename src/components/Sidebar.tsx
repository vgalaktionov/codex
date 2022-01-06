import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    LinkProps,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { IconType } from 'react-icons';
import {
    FaBookDead,
    FaDiceD20,
    FaHistory,
    FaScroll,
    FaSearch,
    FaSignOutAlt,
    FaUserCircle,
    FaUsers,
} from 'react-icons/fa';
import { useQuery } from 'react-query';
import { RuleLinksSchema } from '../lib/rules/base';
import { SearchForm, SearchFormSchema } from '../lib/search';
import { log } from '../lib/util';

const SidebarLink = ({
    href,
    children,
    icon,
    ...rest
}: PropsWithChildren<{ icon: IconType; href: string } & LinkProps>) => (
    <NextLink href={href} passHref>
        <Link {...rest}>
            <HStack>
                <Icon as={icon} py="auto" display="block" />
                <Box> {children}</Box>
            </HStack>
        </Link>
    </NextLink>
);

export const Sidebar = (props: { onClose(): void; isOpen: boolean }) => {
    const { status, data, error } = useQuery('ruleLinks', async () =>
        RuleLinksSchema.parse((await axios.get('/api/rules/links')).data.rulesLinks),
    );
    const { colorMode } = useColorMode();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SearchForm>({ resolver: zodResolver(SearchFormSchema) });
    log.info(data);

    const show = !['/', '/login', '/register'].includes(router.asPath);

    if (!show) return null;

    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    const color = { light: 'black', dark: 'white' };

    const contents = (
        <VStack height="calc(100vh - 62px)" py="10" px="10" justifyContent="start" alignItems="start">
            <Heading size="md" textDecoration="underline">
                Characters
            </Heading>
            <SidebarLink href="/app/characters/sheet" icon={FaScroll}>
                Sheet
            </SidebarLink>
            <SidebarLink href="/app/characters/list" icon={FaUsers}>
                List
            </SidebarLink>

            <Heading size="md" textDecoration="underline" pt="10">
                Dice
            </Heading>
            <SidebarLink href="/app/dice/roll" icon={FaDiceD20}>
                Roll
            </SidebarLink>
            <SidebarLink href="/app/dice/history" icon={FaHistory}>
                History
            </SidebarLink>

            <Heading size="md" textDecoration="underline" pt="10">
                Campaigns
            </Heading>
            <SidebarLink href="/app/campaigns/list" icon={FaBookDead}>
                List
            </SidebarLink>

            <Heading size="md" textDecoration="underline" pt="10">
                Rules
            </Heading>
            <FormControl isInvalid={errors.q != null} mb="6">
                <FormLabel htmlFor="q">Search rules</FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<FaSearch />} />
                    <Input type="search" {...register('q')}></Input>
                </InputGroup>
                {/* <FormHelperText>Enter the q you use to log in.</FormHelperText> */}
                {errors.q && <FormErrorMessage>{errors.q.message}</FormErrorMessage>}
            </FormControl>
            <Accordion maxWidth="200px">
                {Object.entries(data ?? {}).map(([category, values]) => (
                    <AccordionItem key={category} border="none">
                        <Heading>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    {category}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </Heading>
                        <AccordionPanel>
                            {Object.entries(values).map(([name, { href }]) => (
                                <>
                                    <NextLink href={href} passHref>
                                        <Link ml="5">{name}</Link>
                                    </NextLink>
                                    <br />
                                </>
                            ))}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>

            <Heading size="md" textDecoration="underline" pt="10">
                Accounts
            </Heading>
            <SidebarLink href="/app/characters/sheet" icon={FaUserCircle}>
                Profile
            </SidebarLink>

            <Link
                onClick={async () => {
                    await axios.post('/api/auth/logout');
                    router.push('/login');
                }}
            >
                <HStack>
                    <Icon as={FaSignOutAlt} py="auto" display="block" />
                    <Box>Logout</Box>
                </HStack>
            </Link>
        </VStack>
    );

    return (
        <>
            <Flex
                as="aside"
                display={['none', 'flex']}
                height="calc(100vh - 62px)"
                backgroundColor={bgColor[colorMode]}
                color={color[colorMode]}
                justifyContent="space-between"
                alignItems="center"
            >
                <Flex>{contents}</Flex>
            </Flex>

            <Drawer placement="left" onClose={props.onClose} isOpen={props.isOpen}>
                <DrawerOverlay mt="62px" />
                <DrawerContent mt="62px">
                    {/* <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader> */}
                    <DrawerBody>{contents}</DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
