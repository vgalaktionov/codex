import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <meta name="description" content="Your tabletop D20 RPG companion" />
                    <meta name="keywords" content="Tabletop, D20, D&D, Dungeons and Dragons, 5e, character sheet" />
                    <meta name="author" content="Vadim Galaktionov" />
                </Head>
                <body>
                    <ColorModeScript initialColorMode="system" />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
