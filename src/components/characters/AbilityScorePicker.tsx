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
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useReducer, useState } from 'react';
import AbilityScoreBonuses, { BonusesProps } from './AbilityScoreBonuses';
import RollModal from './RollModal';

const DefaultScores = () => {
    const scores = [15, 14, 13, 12, 10, 8];
    const [taken, setTaken] = useState([false, false, false, false, false, false]);

    const [strength, setStrength] = useState<number>(0);
    const [constitution, setConstitution] = useState<number>(0);
    const [dexterity, setDexterity] = useState<number>(0);
    const [intelligence, setIntelligence] = useState<number>(0);
    const [wisdom, setWisdom] = useState<number>(0);
    const [charisma, setCharisma] = useState<number>(0);
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);

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

const RollScores = () => {
    const [scores, setScores] = useState<[number, number, number, number, number, number]>([0, 0, 0, 0, 0, 0]);
    const [taken, setTaken] = useState([false, false, false, false, false, false]);

    const [strength, setStrength] = useState<number>(0);
    const [constitution, setConstitution] = useState<number>(0);
    const [dexterity, setDexterity] = useState<number>(0);
    const [intelligence, setIntelligence] = useState<number>(0);
    const [wisdom, setWisdom] = useState<number>(0);
    const [charisma, setCharisma] = useState<number>(0);
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);

    const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

    return (
        <>
            <HStack justifyContent={'center'}>
                <Text textAlign={'center'}>Roll for scores: </Text>
                <RollModal values={scores} setValues={setScores} forceUpdate={forceUpdate} />
            </HStack>
            <HStack justifyContent="center" mt="6" mb="6">
                {scores.filter(Boolean).map((score, i) => (
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

const CustomizeScores = () => {
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
        if (total > 27) setGeneralError('You have a maximum of 27 points to spend!');
    }, [strength, constitution, dexterity, intelligence, wisdom, charisma, setGeneralError, setSpent]);

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

const ManualScores = () => {
    const [strength, setStrength] = useState<number>(0);
    const [constitution, setConstitution] = useState<number>(0);
    const [dexterity, setDexterity] = useState<number>(0);
    const [intelligence, setIntelligence] = useState<number>(0);
    const [wisdom, setWisdom] = useState<number>(0);
    const [charisma, setCharisma] = useState<number>(0);
    const [generalError, setGeneralError] = useState<string | undefined>(undefined);

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

export default function AbilityScorePicker({ race, subrace }: BonusesProps) {
    return (
        <VStack w="100%">
            <Tabs variant="soft-rounded" size="sm" colorScheme="orange" w="100%" isFitted>
                <TabList>
                    <Tab>Default</Tab>
                    <Tab>Roll</Tab>
                    <Tab>Customize</Tab>
                    <Tab>Manual</Tab>
                </TabList>
                <HStack w="100%">
                    <TabPanels>
                        <TabPanel>
                            <DefaultScores />
                        </TabPanel>
                        <TabPanel>
                            <RollScores />
                        </TabPanel>
                        <TabPanel>
                            <CustomizeScores />
                        </TabPanel>
                        <TabPanel>
                            <ManualScores />
                        </TabPanel>
                    </TabPanels>
                    <AbilityScoreBonuses race={race} subrace={subrace} />
                </HStack>
            </Tabs>
        </VStack>
    );
}
