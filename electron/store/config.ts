import Store from 'electron-store';
import { userSettingsShema } from '../../config/schemas/userSettings'

export const store = new Store({
    schema: userSettingsShema,
    watch: true
});
