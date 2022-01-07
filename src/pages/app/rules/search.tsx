import {
    Box,
    Button,
    Flex,
    FormControl,
    Heading,
    HeadingProps,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Text,
    TextProps,
    useColorMode,
    VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { GiArchiveResearch } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { searchRules } from '../../../db/rules';
import { PUBLIC_ROUTES } from '../../../lib/auth';
import { DBRule, linkHref } from '../../../lib/rules/base';
import { SearchForm, SearchFormSchema } from '../../../lib/search';

const Search = ({ results, query }: { results: DBRule[]; query: string }) => {
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
    return (
        <VStack w="100%" alignItems="start" py="6" px="20">
            <Heading size="2xl" mb="6">
                Search results
            </Heading>

            <Text size="md">
                <strong>Query:</strong> {query}
            </Text>

            <form
                onSubmit={handleSubmit(({ q }) => {
                    router.push({ pathname: '/app/rules/search', query: { q } });
                })}
                style={{ width: '80%' }}
            >
                <FormControl isInvalid={errors.q != null} mb="6" pt="2">
                    <InputGroup>
                        <Input type="search" {...register('q')}></Input>
                        <InputRightElement pointerEvents="none" children={<GiArchiveResearch />} />
                    </InputGroup>
                </FormControl>
                <Flex w="100%" justifyContent="end" pt="2" pb="4">
                    <Button colorScheme="orange" ml="auto" type="submit">
                        Search rules
                    </Button>
                </Flex>
            </form>
            {results.length === 0 && <Text>No results... try a different term?</Text>}
            {results.map((r) => (
                <Box key={r.name} backgroundColor={bgColor[colorMode]} p="6" m="6" width="100%" maxWidth="70vw">
                    <NextLink href={linkHref(r)} passHref>
                        <Link>
                            <Heading size="md">{r.name}</Heading>
                        </Link>
                    </NextLink>
                    <br />
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        children={r.highlighted ?? ''}
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
                            p: (props: TextProps) => (
                                <Text>
                                    {props.children} <br />
                                    <br />
                                </Text>
                            ),
                            code: (props: TextProps) => (
                                <Text as="span" backgroundColor="orange.500">
                                    {props.children}
                                </Text>
                            ),
                        }}
                    />
                </Box>
            ))}
        </VStack>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (!context.query || !context.query.q || context.query.q.length === 0)
        return { props: { query: '', results: [] } };

    const query = (typeof context.query.q === 'string' ? context.query.q : context.query.q.join('')).replace('+', ' ');
    const results = await searchRules(query);
    return { props: { query, results } };
};

export default Search;
