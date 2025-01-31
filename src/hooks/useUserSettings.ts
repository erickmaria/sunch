// import { userSettingsSchema } from '../../config/schemas/userSettings'

// type Schema = typeof userSettingsSchema

export function useUserSettings(){

  const getConfigValue = (key: string) => window.system.store.get(key)

  const setConfigValue = (key: string, value: unknown) => window.system.store.set(key, value)

  const syncConfig = (key: string, value: unknown) => window.system.dispatchSyncConfig(key, value)

  // const getConfigValue = <K extends keyof Schema>(key: K) => window.system.store.get(key)

  // const setConfigValue = <K extends keyof Schema>(key: K, value: unknown) => window.system.store.set(key, val)

  return {
    getConfigValue,
    setConfigValue,
    syncConfig
  }
}
