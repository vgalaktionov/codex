declare module 'postgres-shift' {
    import postgres from 'postgres';
    export default function migrate(props: { sql: postgres.Sql });
}
