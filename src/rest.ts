import axios from 'axios';
import { LoginForm, RegisterForm } from './lib/auth';
import { Campaign, CampaignSchema } from './lib/campaigns';
import { DiceRoll } from './lib/dice';
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

async function createCampaign(data: Campaign) {
    await axios.post('/api/campaigns', data);
}

export default { getRuleLinks, getCampaigns, login, register, logout, createDiceRoll, createCampaign };
