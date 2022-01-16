import {
    Box,
    Button,
    chakra,
    Fade,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tag,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { Dispatch, PropsWithChildren, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { FaDiceD6 } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';
import { DiceRoll, DieType, newRoll } from '../../lib/dice';
import { rollDice } from '../../lib/dice/diceRoll';
import { log } from '../../lib/util';
import rest from '../../rest';

type RollValues = [number, number, number, number, number, number];

interface ModalProps {
    values: RollValues;
    setValues: Dispatch<SetStateAction<RollValues>>;
}

export default function RollModal({ values, setValues }: PropsWithChildren<ModalProps>) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const mountRef = useRef<HTMLDivElement | null>(null);
    const [thrown, setThrown] = useState(0);
    const [stable, setStable] = useState(true);
    const [roll, setRoll] = useState<DiceRoll | undefined>();
    const queryClient = useQueryClient();
    const mutation = useMutation(rest.createDiceRoll, {
        onSuccess: () => {
            queryClient.invalidateQueries('dicerolls');
        },
    });

    const onNext = useCallback(async () => {
        try {
            setStable(false);
            const diceRoll = newRoll(DieType.D6, 4);
            setThrown((v) => v + 1);
            setValues((draft) => {
                draft[thrown] =
                    diceRoll.result
                        .sort(({ roll: a }, { roll: b }) => b - a)
                        .slice(0, 3)
                        .reduce((acc, cur) => acc + cur.roll, 0) ?? 0;
                return draft;
            });
            setRoll(diceRoll);
            await mutation.mutateAsync(diceRoll);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                log.error(error.response?.data.error);
            }
        }
    }, [values, thrown, setStable, setThrown, setValues, setRoll]);

    useEffect(() => {
        if (thrown === 0 && isOpen) onNext();
    }, [thrown, isOpen]);

    useEffect(() => {
        let element: HTMLCanvasElement | null = null;
        if (roll != null && mountRef.current != null) {
            element = rollDice(mountRef, roll);
        }
        return () => (element ? mountRef?.current?.removeChild(element) && undefined : undefined);
    }, [mountRef, roll]);

    const stableListener = () => setStable(true);

    useEffect(() => {
        window.addEventListener('diceStable', stableListener);
        return () => {
            window.removeEventListener('diceStable', stableListener);
        };
    }, [stableListener, setStable]);
    return (
        <>
            <Button
                leftIcon={<FaDiceD6 />}
                colorScheme="orange"
                variant="ghost"
                onClick={() => {
                    setValues([0, 0, 0, 0, 0, 0]);
                    onOpen();
                }}
            >
                {values.every((v) => v === 0) ? 'Roll' : 'Roll again'}
            </Button>
            <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior="inside" size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Roll for ability scores</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody overflowY="hidden">
                        <Box w="100%" h="100%" pt="6" px="6" border="1px" borderColor="gray.500" borderRadius="md">
                            <Heading size="lg" pb="6">
                                Results
                            </Heading>
                            <Text as="div">
                                <strong>Previous rolls: </strong>{' '}
                                {values.filter(Boolean).map((v, id) =>
                                    id === values.filter(Boolean).length - 1 ? (
                                        <Fade in={stable} key={id} style={{ display: 'inline-block' }}>
                                            <Tag colorScheme={'red'} mx="1">
                                                {v}
                                            </Tag>
                                        </Fade>
                                    ) : (
                                        <Tag key={id} colorScheme={'red'} mx="1">
                                            {v}
                                        </Tag>
                                    ),
                                )}
                                <br />
                                <br />
                                <strong>Current dice:</strong>{' '}
                                {roll?.result
                                    .sort(({ roll: a }, { roll: b }) => b - a)
                                    .map((rs, id) => (
                                        <Fade in={stable} key={id} style={{ display: 'inline-block' }}>
                                            <Tag colorScheme={id === 3 ? 'gray' : 'orange'} mx="1">
                                                {rs.roll}
                                            </Tag>
                                        </Fade>
                                    ))}
                                <br />
                                <br />
                                <strong>Current total:</strong>{' '}
                                {
                                    <Fade in={stable}>
                                        {roll?.result
                                            .sort(({ roll: a }, { roll: b }) => b - a)
                                            .slice(0, 3)
                                            .reduce((acc, cur) => acc + cur.roll, 0)}
                                    </Fade>
                                }
                            </Text>
                            <br />
                            <chakra.div
                                ref={mountRef}
                                minH={['20vh', '75vh']}
                                mt="-12rem"
                                mb="6rem"
                                overflowY="hidden"
                            ></chakra.div>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        {thrown < 6 && (
                            <Button colorScheme="orange" onClick={onNext}>
                                Next
                            </Button>
                        )}
                        {thrown === 6 && (
                            <Button colorScheme="orange" onClick={onClose}>
                                Finish
                            </Button>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
