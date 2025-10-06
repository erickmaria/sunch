// import { userSettingsSchema } from '../../config/schemas/userSettings'

// type Schema = typeof userSettingsSchema

export function useUserSettings(){

  const getConfig = (key: string) => window.system.store.get(key)

  const setConfig = (key: string, value: unknown) => window.system.store.set(key, value)

  const delConfig = (key: string) => window.system.store.delete(key)

  const dispatchSyncConfig = (key: string, value: unknown) => window.system.dispatchSyncConfig(key, value)

  // const getConfig = <K extends keyof Schema>(key: K) => window.system.store.get(key)

  // const setConfig = <K extends keyof Schema>(key: K, value: unknown) => window.system.store.set(key, val)

  return {
    getConfig,
    setConfig,
    delConfig,
    dispatchSyncConfig
  }
}
