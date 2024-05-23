import Store from 'electron-store';
import { userSettingsSchema } from '../../config/schemas/userSettings'

export const store = new Store({
    schema: userSettingsSchema,
    clearInvalidConfig: true,
    // encryptionKey: '8s84d1fas8d54f2a95df2as8d5f2asd85f2asd85fas2d8fas12',
    watch: true
});
    