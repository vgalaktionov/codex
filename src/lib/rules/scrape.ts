import axios from 'axios';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import Turndown from 'turndown';
import * as TurndownGFM from 'turndown-plugin-gfm';
import { log, measurePromise } from '../util';

const HOST = 'https://5e.d20srd.org';
const turndown = new Turndown();
turndown.use(TurndownGFM.gfm);

async function scrapeClasses(verbose = false) {
    const classesPage = await axios.get(HOST + '/indexes/classes.htm');
    const dom = new JSDOM(classesPage.data);
    const links: string[] = [];
    dom.window.document.querySelectorAll('a[href^="/srd/classes/"]').forEach((el) => {
        const a = el as HTMLAnchorElement;
        if (!/(multiclassing|beyond|characterAdvancement)/.test(a.href)) {
            links.push(a.href);
        }
    });
    verbose && log.info(links);

    await Promise.all(
        links.map(async (l) => {
            const classPage = await axios.get(HOST + l);
            const classDom = new JSDOM(classPage.data);
            const elements: string[] = [];
            classDom.window.document
                .querySelectorAll('center ~ *:not(.footer):not(script):not(noscript)')
                .forEach((el) => elements.push(el.outerHTML));

            const name = classDom.window.document.querySelector('h1')?.innerHTML ?? 'Rogue';
            const content = `---\nname: ${name}\n---\n\n` + turndown.turndown(elements.join('\n'));
            verbose && log.info(content);
            const filename = name.toLowerCase().replace(' ', '_') + '.md';
            if (!existsSync(`rules/classes/${filename}`)) await fs.writeFile(`rules/classes/${filename}`, content);
        }),
    );
}

async function scrapeRaces(verbose = false) {
    const racesPage = await axios.get(HOST + '/srd/races.htm');
    const dom = new JSDOM(racesPage.data);
    const blocks: { name: string; content: string }[] = [];
    dom.window.document.querySelectorAll('h2, h2 ~ h3, h2 ~ h3 ~ p').forEach((el) => {
        switch (el.tagName) {
            case 'H2':
                blocks.push({ name: el.firstChild?.textContent ?? '', content: el.outerHTML });
                break;
            case 'H3':
            case 'P':
                blocks[blocks.length - 1].content = blocks[blocks.length - 1].content + '\n' + el.outerHTML;
                break;
        }
    });
    verbose && log.info(blocks);

    await Promise.all(
        blocks.map(async (b) => {
            const content = `---\nname: ${b.name}\n---\n\n` + turndown.turndown(b.content);
            verbose && log.info(content);
            const filename = b.name.toLowerCase().replace(' ', '_') + '.md';
            if (!existsSync(`rules/races/${filename}`)) await fs.writeFile(`rules/races/${filename}`, content);
        }),
    );
}

async function scrapeSpells(verbose = false) {
    const spellsPage = await axios.get(HOST + '/indexes/spells.htm');
    const dom = new JSDOM(spellsPage.data);
    const links: string[] = [];
    dom.window.document.querySelectorAll('a[href^="/srd/spells/"]').forEach((el) => {
        const a = el as HTMLAnchorElement;
        if (!/(multiclassing|beyond|characterAdvancement)/.test(a.href)) {
            links.push(a.href);
        }
    });
    verbose && log.info(links);

    await Promise.all(
        links.map(async (l) => {
            if (l.includes('divineFavor')) return;
            const spellPage = await axios.get(HOST + l);
            const spellDom = new JSDOM(spellPage.data);
            const elements: string[] = [];
            spellDom.window.document
                .querySelectorAll('center ~ *:not(.footer):not(script):not(noscript)')
                .forEach((el) => elements.push(el.outerHTML));

            const name = spellDom.window.document.querySelector('body h1')?.innerHTML ?? 'Unknown';
            const type = spellDom.window.document.querySelector('body h4')?.innerHTML ?? 'Unknown Type';
            const level = /\d/.test(type[0]) ? +type[0] : undefined;
            const castingTime =
                spellDom.window.document.querySelector('.statBlock tr:nth-child(1) td')?.innerHTML ??
                'Unknown Casting Time';
            const range =
                spellDom.window.document.querySelector('.statBlock tr:nth-child(2) td')?.innerHTML ?? 'Unknown Range';
            let components: string | undefined;
            let duration: string;
            const durationEl = spellDom.window.document.querySelector('.statBlock tr:nth-child(4) td');
            if (durationEl != null) {
                components =
                    spellDom.window.document.querySelector('.statBlock tr:nth-child(3) td')?.innerHTML ??
                    'Unknown Components';
                duration = durationEl.innerHTML;
            } else {
                duration =
                    spellDom.window.document.querySelector('.statBlock tr:nth-child(3) td')?.innerHTML ??
                    'Unknown Duration';
            }

            const content =
                `---\nname: ${name}\ntype: ${type}\nlevel: ${
                    level ?? 0
                }\ncastingTime: ${castingTime}\nrange: ${range}\ncomponents: ${
                    components ?? ''
                }\nduration: ${duration}\n---\n\n` + turndown.turndown(elements.join('\n'));
            verbose && log.info(content);
            const filename =
                name.trim().toLowerCase().replaceAll('&nbsp;', '').replaceAll(' ', '_').replaceAll('/', '_or_') + '.md';
            if (!existsSync(`rules/spells/${filename}`)) await fs.writeFile(`rules/spells/${filename}`, content);
        }),
    );
}

measurePromise(() => Promise.all([scrapeClasses(false), scrapeRaces(false), scrapeSpells(false)]));
