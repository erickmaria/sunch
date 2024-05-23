// import { userSettingsSchema } from '../../config/schemas/userSettings'

// type Schema = typeof userSettingsSchema

export function useUserSettings(){

  const getConfigValue = (key: string) => window.electron.store.get(key)

  const setConfigValue = (key: string, val: unknown) => window.electron.store.set(key, val)


  // const getConfigValue = <K extends keyof Schema>(key: K) => window.electron.store.get(key)

  // const setConfigValue = <K extends keyof Schema>(key: K, val: unknown) => window.electron.store.set(key, val)

  return {
    getConfigValue,
    setConfigValue
  }
}
