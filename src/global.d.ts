declare module 'postgres-shift' {
    import postgres from 'postgres';
    export default function migrate(props: { sql: postgres.Sql });
}

declare module 'turndown-plugin-gfm';
