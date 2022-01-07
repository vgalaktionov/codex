import { Container, Heading, HeadingProps, Text, TextProps, VStack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getRule } from '../../../db/rules';
import { render, Rule } from '../../../lib/rules/base';

const RuleView = ({ rule }: { rule: Rule }) => {
    return (
        <VStack>
            <Container px="20" py="16" width="100%" maxWidth="70vw" height="100%">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    children={render(rule)}
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
                    }}
                />
            </Container>
        </VStack>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (!context.params || !context.params.rule || context.params.rule.length !== 2) return { notFound: true };

    const [category, name] = context.params.rule;
    const rule = await getRule(category, name);
    if (!rule) return { notFound: true };

    return {
        props: { rule },
    };
};

export default RuleView;
