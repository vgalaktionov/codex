import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    LinkProps,
    Select,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { IconType } from 'react-icons';
import { FaBookDead, FaDiceD20, FaHistory, FaScroll, FaSignOutAlt, FaUserCircle, FaUsers } from 'react-icons/fa';
import { GiArchiveResearch, GiOrcHead, GiRuleBook, GiSpellBook, GiWizardFace, GiWomanElfFace } from 'react-icons/gi';
import { useQuery } from 'react-query';
import { PUBLIC_ROUTES } from '../lib/auth';
import { Campaign } from '../lib/campaigns';
import { Character } from '../lib/characters';
import { RuleCategory } from '../lib/rules/base';
import { SearchForm, SearchFormSchema } from '../lib/search';
import { lexicographic } from '../lib/util';
import rest from '../rest';

const CATEGORY_ICONS: Record<string, IconType> = {
    [RuleCategory.GENERAL]: GiRuleBook,
    [RuleCategory.RACE]: GiWomanElfFace,
    [RuleCategory.SUBRACE]: GiOrcHead,
    [RuleCategory.CLASS]: GiWizardFace,
    [RuleCategory.SPELL]: GiSpellBook,
};

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
    const { status, data: ruleLinks, error } = useQuery('ruleLinks', rest.getRuleLinks);
    const { data: campaigns } = useQuery<Campaign[]>('campaigns', rest.getCampaigns);
    const { data: characters } = useQuery<Character[]>('characters', rest.getCharacters);
    const { colorMode } = useColorMode();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SearchForm>({ resolver: zodResolver(SearchFormSchema) });

    const show = !PUBLIC_ROUTES.includes(router.asPath);

    if (!show) return null;

    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    const color = { light: 'black', dark: 'white' };

    const contents = (
        <VStack
            height="calc(100vh - 62px)"
            maxHeight="calc(100vh - 62px)"
            overflowY="auto"
            py="10"
            px="10"
            justifyContent="start"
            alignItems="start"
            width={['100%', '350px']}
        >
            <Heading size="md" color="orange.400" pb="2">
                Characters
            </Heading>
            <SidebarLink href="/app/characters/sheet" icon={FaScroll}>
                Sheet
            </SidebarLink>
            <SidebarLink href="/app/characters/list" icon={FaUsers}>
                List
            </SidebarLink>
            <FormControl pt="2" mx="auto">
                <FormLabel htmlFor="email" color="gray.500">
                    Active character:
                </FormLabel>
                <Select defaultValue={characters?.find((c) => c.active)?.name}>
                    {characters?.map((c) => (
                        <option key={c.name} value={c.name}>
                            {c.name} ({campaigns?.find((campaign) => campaign.id === c.campaignId)?.name})
                        </option>
                    ))}
                </Select>
            </FormControl>

            <Heading size="md" color="orange.400" pt="6" pb="2">
                Dice
            </Heading>
            <SidebarLink href="/app/dice/roll" icon={FaDiceD20}>
                Roll
            </SidebarLink>
            <SidebarLink href="/app/dice/history" icon={FaHistory}>
                History
            </SidebarLink>

            <Heading size="md" color="orange.400" pt="6" pb="2">
                Campaigns
            </Heading>
            <SidebarLink href="/app/campaigns/list" icon={FaBookDead}>
                List
            </SidebarLink>
            <FormControl pt="2" mx="auto">
                <FormLabel htmlFor="email" color="gray.500">
                    Active campaign:
                </FormLabel>
                <Select defaultValue={campaigns?.find((c) => c.active)?.name}>
                    {campaigns?.map((c) => (
                        <option key={c.name} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </Select>
            </FormControl>

            <Heading size="md" color="orange.400" pt="6" pb="2">
                Rules
            </Heading>
            <form
                onSubmit={handleSubmit(({ q }) => {
                    router.push({ pathname: '/app/rules/search', query: { q } });
                })}
                style={{ width: '100%' }}
            >
                <FormControl isInvalid={errors.q != null} mb="6" pt="2">
                    <InputGroup>
                        <Input type="search" {...register('q')}></Input>
                        <InputRightElement pointerEvents="none" children={<GiArchiveResearch />} />
                    </InputGroup>
                </FormControl>
                <Flex w="100%" justifyContent="end" pt="2" pb="4" borderBottom="1px" borderBottomColor="gray">
                    <Button colorScheme="orange" ml="auto" type="submit">
                        Search rules
                    </Button>
                </Flex>
            </form>
            <Heading size="sm" pt="2">
                Browse
            </Heading>
            <Accordion width={['100%']} pt="2" borderTop="none" allowToggle>
                <AccordionItem borderTop="none">
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Rules
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} width={['100%']} pt="2">
                        <Accordion width={['100%']} pt="2" allowToggle>
                            {Object.entries(ruleLinks ?? {}).map(([category, values]) => (
                                <AccordionItem key={category} border="none">
                                    <Heading>
                                        <AccordionButton>
                                            <Icon
                                                as={CATEGORY_ICONS[category] ?? null}
                                                py="auto"
                                                display="block"
                                                mr="2"
                                            />
                                            <Box flex="1" textAlign="left">
                                                {category}
                                            </Box>
                                            <hr />
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </Heading>
                                    <AccordionPanel>
                                        {Object.entries(values)
                                            .sort(([a, _], [b, __]) => lexicographic(a, b))
                                            .map(([name, { href }]) => (
                                                <Box key={name + '-sidebar'} ml="6" my="3">
                                                    <NextLink href={href} passHref>
                                                        <Link> ❖&nbsp;&nbsp; {name}</Link>
                                                    </NextLink>
                                                    <br />
                                                </Box>
                                            ))}
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            <Heading size="md" color="orange.400" pt="6" pb="2">
                Accounts
            </Heading>
            <SidebarLink href="/app/characters/sheet" icon={FaUserCircle}>
                Profile
            </SidebarLink>

            <Link
                onClick={async () => {
                    await rest.logout();
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
                width="350px"
                position="absolute"
                top="62px"
            >
                <Flex width="350px">{contents}</Flex>
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
