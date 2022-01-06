import { loadDefaultRules } from '.';

describe('Default Rules', () => {
    it('should load without errors', async () => {
        await loadDefaultRules();
    });
});
