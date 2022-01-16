import { Box, chakra, FormControl, FormLabel, Heading, HStack, Select, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { AbilityScoreIncrease, Race } from '../../lib/rules/races';
import { Subrace } from '../../lib/rules/subraces';
import { range } from '../../lib/util';

export interface BonusesProps {
    race?: Race;
    subrace?: Subrace;
}

export default function AbilityScoreBonuses({ race, subrace }: BonusesProps) {
    const raceGetBonuses = (race?.traits?.['Ability Score Increase']?.value as AbilityScoreIncrease | undefined)
        ?.get ?? {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
    };
    const raceChooseBonuses = (race?.traits?.['Ability Score Increase']?.value as AbilityScoreIncrease | undefined)
        ?.choose ?? {
        amount: 0,
        choices: [],
    };
    const subraceGetBonuses = (subrace?.traits?.['Ability Score Increase']?.value as AbilityScoreIncrease | undefined)
        ?.get ?? {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
    };
    const subraceChooseBonuses = (
        subrace?.traits?.['Ability Score Increase']?.value as AbilityScoreIncrease | undefined
    )?.choose ?? {
        amount: 0,
        choices: [],
    };

    const [chosen, setChosen] = useState<(string | undefined)[]>(
        range(raceChooseBonuses.amount + subraceChooseBonuses.amount).map((_) => undefined),
    );

    return (
        <VStack width="50%" height="100%">
            {Object.values(raceGetBonuses).some(Boolean) && (
                <Box>
                    <Heading size="md">Race bonuses:</Heading>
                    <chakra.dl>
                        {Object.entries(raceGetBonuses).map(([k, v]) => (
                            <HStack key={k} ml="16">
                                <strong>
                                    <chakra.dd>{k}:</chakra.dd>
                                </strong>
                                <chakra.dt>{v}</chakra.dt>
                            </HStack>
                        ))}
                    </chakra.dl>
                </Box>
            )}
            {raceChooseBonuses.amount && (
                <Box>
                    <Heading size="md" mb="2">
                        Race bonus choices:
                    </Heading>
                    {range(raceChooseBonuses.amount).map((id) => (
                        <FormControl key={id} w="100%">
                            <HStack w="100%">
                                <FormLabel htmlFor={id + 'race'} w="30px">
                                    +&nbsp;1
                                </FormLabel>
                                <Select
                                    size="sm"
                                    name={id + 'race'}
                                    value={chosen[id]}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setChosen((draft) => {
                                            draft[id] = value;
                                            return draft;
                                        });
                                    }}
                                >
                                    {raceChooseBonuses.choices.map((value, i) => (
                                        <option key={i} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </Select>
                            </HStack>
                        </FormControl>
                    ))}
                </Box>
            )}
            {Object.values(subraceGetBonuses).some(Boolean) && (
                <Box>
                    <Heading size="md">Subrace bonuses:</Heading>
                    <chakra.dl>
                        {Object.entries(subraceGetBonuses).map(([k, v]) => (
                            <HStack key={k} ml="16">
                                <strong>
                                    <chakra.dd>{k}:</chakra.dd>
                                </strong>
                                <chakra.dt>{v}</chakra.dt>
                            </HStack>
                        ))}
                    </chakra.dl>
                </Box>
            )}
            {subraceChooseBonuses.amount && (
                <Box>
                    <Heading size="md" mb="2">
                        Subrace bonus choices:
                    </Heading>
                    {range(subraceChooseBonuses.amount).map((id) => (
                        <FormControl key={id} w="100%">
                            <HStack w="100%">
                                <FormLabel htmlFor={id + 'subrace'} w="30px">
                                    +&nbsp;1
                                </FormLabel>
                                <Select
                                    size="sm"
                                    name={id + 'subrace'}
                                    value={chosen[id + raceChooseBonuses.amount]}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setChosen((draft) => {
                                            draft[id + raceChooseBonuses.amount] = value;
                                            return draft;
                                        });
                                    }}
                                >
                                    {subraceChooseBonuses.choices.map((value, i) => (
                                        <option key={i} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </Select>
                            </HStack>
                        </FormControl>
                    ))}
                </Box>
            )}
        </VStack>
    );
}
