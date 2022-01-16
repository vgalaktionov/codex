import {
    FormControl,
    FormLabel,
    HStack,
    Input,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    VStack,
} from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';
import { NewCharacter } from '../../lib/characters';
import AbilityScoreBonuses, { BonusesProps } from './AbilityScoreBonuses';
import { CustomizeScores } from './CustomizeScores';
import { DefaultScores } from './DefaultScores';
import { ManualScores } from './ManualScores';
import { RollScores } from './RollScores';
import { useAbilityScoresStore } from './store';

export default function AbilityScorePicker({
    race,
    subrace,
    register,
}: BonusesProps & {
    register: UseFormRegister<NewCharacter>;
}) {
    const store = useAbilityScoresStore();
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
                    <VStack>
                        <FormControl>
                            <FormLabel htmlFor="strength">Strength:</FormLabel>
                            <Input value={store.strength} {...register('strength')} disabled />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="constitution">Constitution:</FormLabel>
                            <Input value={store.constitution} {...register('constitution')} disabled />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="intelligence">Intelligence:</FormLabel>
                            <Input value={store.intelligence} {...register('intelligence')} disabled />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="dexterity">Dexterity:</FormLabel>
                            <Input value={store.dexterity} {...register('dexterity')} disabled />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="wisdom">Wisdom:</FormLabel>
                            <Input value={store.wisdom} {...register('wisdom')} disabled />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="charisma">Charisma:</FormLabel>
                            <Input value={store.charisma} {...register('charisma')} disabled />
                        </FormControl>
                    </VStack>
                </HStack>
            </Tabs>
        </VStack>
    );
}
