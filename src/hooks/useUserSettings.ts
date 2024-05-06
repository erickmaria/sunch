import { userSettingsShema } from '../../config/schemas/userSettings'

type Schema = typeof userSettingsShema

export function useUserSettings(){

    const getConfigValue = <K extends keyof Schema>(key: K) => window.electron.store.get(key)

    const setConfigValue = <K extends keyof Schema>(key: K, val: unknown) => window.electron.store.set(key, val)

  return {
    getConfigValue,
    setConfigValue
  }
}