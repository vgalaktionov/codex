import { FormControl, FormErrorMessage, FormLabel, HStack, Select, Tag, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAbilityScoresStore } from './store';

export const DefaultScores = () => {
    const scores = [15, 14, 13, 12, 10, 8];
    const [taken, setTaken] = useState([false, false, false, false, false, false]);

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
            <Text textAlign={'center'}>Available scores: </Text>
            <HStack justifyContent="center" mt="6" mb="6">
                {scores.map((score, i) => (
                    <Tag key={i} colorScheme={!taken[i] ? 'orange' : 'gray'}>
                        {score}
                    </Tag>
                ))}
            </HStack>
            <FormControl isInvalid={generalError != null} mb="6">
                <FormErrorMessage>{generalError}</FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="strength">Strength:</FormLabel>
                <Select
                    name="strength"
                    value={strength}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTaken((draft) => {
                            draft[scores.findIndex((v, i) => v === strength && draft[i])] = false;
                            draft[scores.findIndex((v, i) => v === +value && !draft[i])] = true;
                            return draft;
                        });
                        setStrength(+value);
                    }}
                >
                    <option value={strength}>{strength}</option>
                    {scores
                        .filter((_, i) => !taken[i])
                        .map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    {strength && <option></option>}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="constitution">Constitution:</FormLabel>
                <Select
                    name="constitution"
                    value={constitution}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTaken((draft) => {
                            draft[scores.findIndex((v, i) => v === constitution && draft[i])] = false;
                            draft[scores.findIndex((v, i) => v === +value && !draft[i])] = true;
                            return draft;
                        });
                        setConstitution(+value);
                    }}
                >
                    <option value={constitution}>{constitution}</option>
                    {scores
                        .filter((_, i) => !taken[i])
                        .map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    {constitution && <option></option>}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="intelligence">Intelligence:</FormLabel>
                <Select
                    name="intelligence"
                    value={intelligence}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTaken((draft) => {
                            draft[scores.findIndex((v, i) => v === intelligence && draft[i])] = false;
                            draft[scores.findIndex((v, i) => v === +value && !draft[i])] = true;
                            return draft;
                        });
                        setIntelligence(+value);
                    }}
                >
                    <option value={intelligence}>{intelligence}</option>
                    {scores
                        .filter((_, i) => !taken[i])
                        .map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    {intelligence && <option></option>}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="dexterity">Dexterity:</FormLabel>
                <Select
                    name="dexterity"
                    value={dexterity}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTaken((draft) => {
                            draft[scores.findIndex((v, i) => v === dexterity && draft[i])] = false;
                            draft[scores.findIndex((v, i) => v === +value && !draft[i])] = true;
                            return draft;
                        });
                        setDexterity(+value);
                    }}
                >
                    <option value={dexterity}>{dexterity}</option>
                    {scores
                        .filter((_, i) => !taken[i])
                        .map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    {dexterity && <option></option>}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="wisdom">Wisdom:</FormLabel>
                <Select
                    name="wisdom"
                    value={wisdom}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTaken((draft) => {
                            draft[scores.findIndex((v, i) => v === wisdom && draft[i])] = false;
                            draft[scores.findIndex((v, i) => v === +value && !draft[i])] = true;
                            return draft;
                        });
                        setWisdom(+value);
                    }}
                >
                    <option value={wisdom}>{wisdom}</option>
                    {scores
                        .filter((_, i) => !taken[i])
                        .map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    {wisdom && <option></option>}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="charisma">Charisma:</FormLabel>
                <Select
                    name="charisma"
                    value={charisma}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTaken((draft) => {
                            draft[scores.findIndex((v, i) => v === charisma && draft[i])] = false;
                            draft[scores.findIndex((v, i) => v === +value && !draft[i])] = true;
                            return draft;
                        });
                        setCharisma(+value);
                    }}
                >
                    <option value={charisma}>{charisma}</option>
                    {scores
                        .filter((_, i) => !taken[i])
                        .map((value, i) => (
                            <option key={i} value={value}>
                                {value}
                            </option>
                        ))}
                    {charisma && <option></option>}
                </Select>
            </FormControl>
        </>
    );
};
