import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Tag,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAbilityScoresStore } from './store';

export const CustomizeScores = () => {
    const [strength, setStrength] = useState(8);
    const [constitution, setConstitution] = useState(8);
    const [dexterity, setDexterity] = useState(8);
    const [intelligence, setIntelligence] = useState(8);
    const [wisdom, setWisdom] = useState(8);
    const [charisma, setCharisma] = useState(8);
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);

    const [spent, setSpent] = useState(0);
    useEffect(() => {
        const total = [strength, constitution, dexterity, intelligence, wisdom, charisma].reduce((acc, cur) => {
            switch (cur) {
                case 8:
                    return acc;
                case 9:
                    return acc + 1;
                case 10:
                    return acc + 2;
                case 11:
                    return acc + 3;
                case 12:
                    return acc + 4;
                case 13:
                    return acc + 5;
                case 14:
                    return acc + 7;
                case 15:
                    return acc + 9;
                default:
                    return acc;
            }
        }, 0);
        setSpent(total);
        if (total > 27) {
            setGeneralError('You have a maximum of 27 points to spend!');
        } else setGeneralError(undefined);
    }, [strength, constitution, dexterity, intelligence, wisdom, charisma, setGeneralError, setSpent]);

    const store = useAbilityScoresStore();
    useEffect(() => {
        if (!generalError) store.setScores({ strength, dexterity, constitution, intelligence, wisdom, charisma });
    }, [strength, dexterity, constitution, intelligence, wisdom, charisma, generalError]);

    return (
        <>
            <HStack justifyContent={'center'}>
                <Text textAlign={'center'}>Customize your scores </Text>
                <Tag colorScheme="orange">To spend: 27</Tag>
                <Tag colorScheme={spent < 27 ? 'yellow' : spent > 27 ? 'red' : 'green'}>Spent: {spent}</Tag>
            </HStack>
            <FormControl isInvalid={generalError != null} mb="6">
                <FormErrorMessage>{generalError}</FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="strength">Strength:</FormLabel>
                <NumberInput
                    step={1}
                    min={8}
                    defaultValue={8}
                    max={15}
                    keepWithinRange
                    onChange={(_, v) => setStrength(v)}
                >
                    <NumberInputField name="strength" value={strength} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="constitution">Constitution:</FormLabel>
                <NumberInput
                    step={1}
                    min={8}
                    defaultValue={8}
                    max={15}
                    keepWithinRange
                    onChange={(_, v) => setConstitution(v)}
                >
                    <NumberInputField name="constitution" value={constitution} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="intelligence">Intelligence:</FormLabel>
                <NumberInput
                    step={1}
                    min={8}
                    defaultValue={8}
                    max={15}
                    keepWithinRange
                    onChange={(_, v) => setIntelligence(v)}
                >
                    <NumberInputField name="intelligence" value={intelligence} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="dexterity">Dexterity:</FormLabel>
                <NumberInput
                    step={1}
                    min={8}
                    defaultValue={8}
                    max={15}
                    keepWithinRange
                    onChange={(_, v) => setDexterity(v)}
                >
                    <NumberInputField name="dexterity" value={dexterity} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="wisdom">Wisdom:</FormLabel>
                <NumberInput
                    step={1}
                    min={8}
                    defaultValue={8}
                    max={15}
                    keepWithinRange
                    onChange={(_, v) => setWisdom(v)}
                >
                    <NumberInputField name="wisdom" value={wisdom} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="charisma">Charisma:</FormLabel>
                <NumberInput
                    step={1}
                    min={8}
                    defaultValue={8}
                    max={15}
                    keepWithinRange
                    onChange={(_, v) => setCharisma(v)}
                >
                    <NumberInputField name="charisma" value={charisma} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        </>
    );
};
