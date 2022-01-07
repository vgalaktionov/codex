import axios from 'axios';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import Turndown from 'turndown';
import * as TurndownGFM from 'turndown-plugin-gfm';
import sql from '../../db/client';
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

            const name = classDom.window.document.querySelector('h1')?.innerHTML ?? 'rogue';
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

measurePromise(() =>
    Promise.all([scrapeClasses(false), scrapeRaces(false)]).then(() => setTimeout(() => sql.end(), 1000)),
);
