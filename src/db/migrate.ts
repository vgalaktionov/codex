import shift from 'postgres-shift';
import sql from './client';

shift({ sql }).then(() => setTimeout(() => sql.end(), 1000));
