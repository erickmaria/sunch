import Store from 'electron-store';
import { UserSettingsSchema } from './schemas/userSettings'

export const store = new Store({
    schema: UserSettingsSchema,
    clearInvalidConfig: true,
    // encryptionKey: '8s84d1fas8d54f2a95df2as8d5f2asd85f2asd85fas2d8fas12',
    watch: true
});

if (process.env.VITE_DEV_SERVER_URL) console.log(store.path)