import axios from 'axios';
import { LoginForm, RegisterForm } from './lib/auth';
import { Campaign, CampaignSchema } from './lib/campaigns';
import { Character, CharacterSchema } from './lib/characters';
import { DiceRoll, DiceRollSchema } from './lib/dice';
import { RuleLinksSchema } from './lib/rules/base';

const client = axios.create();

async function getRuleLinks() {
    const res = await client.get('/api/rules/links');
    return RuleLinksSchema.parse(res.data.rulesLinks);
}

async function getCampaigns() {
    const res = await client.get('/api/campaigns');
    return res.data.campaigns.map((c: unknown) => CampaignSchema.parse(c));
}
async function createCampaign(data: Campaign) {
    await axios.post('/api/campaigns', data);
}

async function login(data: LoginForm) {
    await axios.post('/api/auth/login', data);
}

async function register(data: RegisterForm) {
    await axios.post('/api/auth/register', data);
}

async function logout() {
    await axios.post('/api/auth/logout');
}

async function createDiceRoll(data: DiceRoll) {
    await axios.post('/api/dice/roll', data);
}

async function getDiceRollHistory() {
    return (await axios.get('/api/dice/history')).data.history.map((dr: unknown) => DiceRollSchema.parse(dr));
}

async function getCharacters() {
    const res = await client.get('/api/characters');
    return res.data.characters.map((c: unknown) => CharacterSchema.parse(c));
}
async function createCharacter(data: Character) {
    await axios.post('/api/characters', data);
}

export default {
    getRuleLinks,
    getCampaigns,
    login,
    register,
    logout,
    createDiceRoll,
    createCampaign,
    getDiceRollHistory,
    getCharacters,
    createCharacter,
};
