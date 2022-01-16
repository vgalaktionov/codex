import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAbilityScoresStore } from './store';

export const ManualScores = () => {
    const [strength, setStrength] = useState<number>(0);
    const [constitution, setConstitution] = useState<number>(0);
    const [dexterity, setDexterity] = useState<number>(0);
    const [intelligence, setIntelligence] = useState<number>(0);
    const [wisdom, setWisdom] = useState<number>(0);
    const [charisma, setCharisma] = useState<number>(0);
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);

    const store = useAbilityScoresStore();
    useEffect(() => {
        if (!generalError) store.setScores({ strength, dexterity, constitution, intelligence, wisdom, charisma });
    }, [strength, dexterity, constitution, intelligence, wisdom, charisma, generalError]);

    return (
        <>
            <Text textAlign={'center'} mb="12">
                Enter your scores manually:
            </Text>
            <FormControl isInvalid={generalError != null} mb="6">
                <FormErrorMessage>{generalError}</FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="strength">Strength:</FormLabel>
                <NumberInput
                    step={1}
                    min={0}
                    defaultValue={8}
                    max={20}
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
                    min={0}
                    defaultValue={8}
                    max={20}
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
                    min={0}
                    defaultValue={8}
                    max={20}
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
                    min={0}
                    defaultValue={8}
                    max={20}
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
                    min={0}
                    defaultValue={8}
                    max={20}
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
                    min={0}
                    defaultValue={8}
                    max={20}
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
