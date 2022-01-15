import {
    Button,
    Heading,
    HeadingProps,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    TextProps,
    useDisclosure,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { render, Rule } from '../lib/rules/base';

interface ModalProps {
    title: string;
    content?: Rule | string;
}

export default function InfoModal({ title, content }: PropsWithChildren<ModalProps>) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button leftIcon={<FaInfoCircle />} colorScheme="orange" variant="ghost" onClick={onOpen}>
                {title}
            </Button>
            <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior="inside" size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            children={typeof content === 'string' ? content : render(content)}
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
                                h3: (props: HeadingProps) => (
                                    <Heading size="md">
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
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
