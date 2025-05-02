
import { Tab, Tabs } from "@/components/Tabs/Tabs"
import { CSSProperties, useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MdOutlineNotificationsActive, MdOutlineNotificationsOff } from "react-icons/md";
import { ChatGptIcon } from 'hugeicons-react';
import { RiGeminiFill } from "react-icons/ri";
import Separator from "@/components/Separator/Separator";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Theme, useTheme } from "@/contexts/ThemeProvider";
import { useUserSettings } from "@/hooks/useUserSettings";
import GPTService from "@/services/GPTService";
import GeminiService from "@/services/GeminiService";

export default function Settings() {

  const lineSelectContextStyle: CSSProperties = {
    maxHeight: '300px'
  }

  const { setTheme, theme } = useTheme();
  const { setConfigValue, getConfigValue, syncConfig } = useUserSettings()
  const [notification, setNotification] = useState<boolean>(false);
  const [version, setVersion] = useState<string>("");
  const [gptModels, setGptModels] = useState<Array<string>>([]);
  const [geminiModels, setGeminiModels] = useState<Array<string>>([]);

  useEffect(() => {
    setConfigValue('general.notification.enable', notification)
  }, [notification])

  useEffect(() => {
    window.system.getAppVersion().then((v) => {
      setVersion(v);
    })

    loadModels()

  }, []);

  function loadModels() {
    GPTService.getInstance()
      .listModels().then((models) => {
        setGptModels(models)
      }).catch((err) => {
        setGptModels(err)
      })

    GeminiService.getInstance()
      .listModels().then((models) => {
        setGeminiModels(models)
      }).catch((err) => {
        console.log(err)
        setGeminiModels(err)
      })

  }


  return (
    <>
      <div data-theme={theme} className="bg-background w-screen h-screen">
        <div className="absolute z-10 right-1 mt-1 cursor-pointer">
          <X
            onClick={() => { window.system.closeWindow("settings") }}
            className="hover:bg-red-500" />
        </div>
        <div className="fixed bottom-1 right-1 z-20">
          <p>version: {version} </p>
        </div>
        <div className="bg-secondary draggable absolute right-8 w-[170px] h-[33px]"></div>
        <Tabs initialTabIndex={0}>
          <Tab label="General">
            <div className="flex justify-between  mt-5 mb-5">
              <h1 className="text-lg">Themes</h1>
              <Select value={theme}
                onValueChange={(value: Theme) => {
                  setTheme(value)
                  syncConfig('general.theme', value)
                }} >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent style={lineSelectContextStyle}>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between mt-5 mb-5">
              <h1 className="text-lg">Lenguague</h1>
              <Select defaultValue={getConfigValue('general.language')}
                onValueChange={(value) => {
                  setConfigValue('general.language', value)
                }}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Lenguague" />
                </SelectTrigger>
                <SelectContent style={lineSelectContextStyle}>
                  <SelectItem className="hover:" value="es-us">English</SelectItem>
                  <SelectItem value="pt-br">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator color={'var(--background-secondary-color)'} />
            <div className=" flex items-center space-x-4 rounded-md border p-4 mt-5">
              {notification ? <MdOutlineNotificationsActive size={30} /> : <MdOutlineNotificationsOff size={30} />}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Push Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Send notifications to device.
                </p>
              </div>
              <Switch
                onCheckedChange={(checked) => { setNotification(checked) }}
              />
            </div>

          </Tab>
          <Tab label="Models">
            <div className="flex justify-between mt-5 mb-5">
              <h1 className="text-lg">Select Model</h1>
              <Select value={getConfigValue('models.current')}
                onValueChange={(value) => {
                  setConfigValue('models.current', value)
                  syncConfig('models.current', value as string)
                }}> 
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent style={lineSelectContextStyle}>
                  <SelectItem value="both">All</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="gpt">GPT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator color={'var(--background-secondary-color)'} />
            <div className=" rounded-md border p-4 mt-5">
              <div className=" flex items-center space-x-4">
                <RiGeminiFill size={30} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Gemini
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Set configuration
                  </p>
                </div>
                <Select onOpenChange={loadModels} defaultValue={getConfigValue('models.gemini.version')}
                  onValueChange={(value) => {
                    setConfigValue('models.gemini.version', value)
                  }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Gemini Version" />
                  </SelectTrigger>
                  <SelectContent style={lineSelectContextStyle}>
                    {geminiModels.map((model) => {
                      return <SelectItem value={model}>{model}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4 justify-between  mt-5">
                <p className="pl-2 text-sm text-muted-foreground">
                  Api Key
                </p>
                <Input defaultValue={getConfigValue("models.gemini.apikey")} type="password" className="w-[500px]" onChange={(e) => {
                  setConfigValue('models.gemini.apikey', e.target.value)
                }} />
              </div>
            </div>

            <div className=" rounded-md border p-4 mt-5">
              <div className=" flex items-center space-x-4">
                <ChatGptIcon size={30} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    GPT
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Set configuration
                  </p>
                </div>
                <Select onOpenChange={loadModels} defaultValue={getConfigValue('models.gpt.version')}
                  onValueChange={(value) => {
                    setConfigValue('models.gpt.version', value)
                  }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="GPT Version" />
                  </SelectTrigger>
                  <SelectContent style={lineSelectContextStyle}>
                    {gptModels.map((model) => {
                      return <SelectItem value={model}>{model}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4 justify-between  mt-5">
                <p className="pl-2 text-sm text-muted-foreground">
                  Api Key
                </p>
                <Input
                  defaultValue={getConfigValue("models.gpt.apikey")}
                  type="password" className="w-[500px]" onChange={(e) => {
                    setConfigValue('models.gpt.apikey', e.target.value)
                  }} />
              </div>
            </div>

          </Tab>
        </Tabs>
      </div>
    </>
  )
}