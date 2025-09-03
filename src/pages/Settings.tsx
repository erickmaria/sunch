
import { Tab, Tabs } from "@/components/Tabs/Tabs"
import { CSSProperties, useEffect, useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MdOutlineNotificationsActive, MdOutlineNotificationsOff } from "react-icons/md";
import { ChatBotIcon, ChatGptIcon, Chatting01Icon, Layout07Icon, LayoutBottomIcon } from 'hugeicons-react';
import { RiClaudeFill, RiGeminiFill } from "react-icons/ri";
import Separator from "@/components/Separator/Separator";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Theme, useTheme } from "@/contexts/ThemeProvider";
import { useUserSettings } from "@/hooks/useUserSettings";
import GPTService from "@/services/GPTService";
import GeminiService from "@/services/GeminiService";
import ClaudeService from "@/services/ClaudeService";

export default function Settings() {

  const lineSelectContextStyle: CSSProperties = {
    maxHeight: '300px'
  }
  const { setConfigValue, getConfigValue, syncConfig } = useUserSettings()

  const { setTheme, theme } = useTheme();
  const [genAI, setGenAI] = useState<string>(getConfigValue('models.current'));

  const [notification, setNotification] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<boolean>((getConfigValue("general.layout.mode") as string) == "full" ? true : false);

  const [chatMode, setChatMode] = useState<boolean>(getConfigValue("general.chatMode.enable") as boolean);

  const [version, setVersion] = useState<string>("");
  const [gptModels, setGptModels] = useState<Array<string>>([]);
  const [geminiModels, setGeminiModels] = useState<Array<string>>([]);
  const [claudeModels, setClaudeModels] = useState<Array<string>>([]);

  // sync configs
  useEffect(() => {
    window.system.syncConfig((data) => {
      if (data.key == `general.layout.mode`) setLayoutMode(data.value == "full" ? true : false)
      if (data.key == `general.chatMode.enable`) setChatMode(data.value as boolean)
    });
  });

  useEffect(() => {
    setConfigValue('general.notification.enable', notification)
  }, [notification])

  useEffect(() => {
    setConfigValue('general.chatMode.enable', chatMode)
    syncConfig('general.chatMode.enable', chatMode)
  }, [chatMode])

  useEffect(() => {
    setConfigValue('general.layout.mode', layoutMode ? "full" : "minimalist")
    syncConfig('general.layout.mode', layoutMode ? "full" : "minimalist")
  }, [layoutMode])

  useEffect(() => {
    window.system.getAppVersion().then((v) => {
      setVersion(v);
    })
  }, []);

  useMemo(() => {
    loadModels()
  }, []);

  function loadModels() {

    if (gptModels.length == 0) {
      console.log('loading gpt models')
      GPTService.getInstance()
        .listModels().then((models) => {
          setGptModels(models)
        }).catch((err) => {
          setGptModels(err)
        })
    }


    if (geminiModels.length == 0) {
      console.log(geminiModels.length == 0)
      console.log('loading gemini models')
      GeminiService.getInstance()
        .listModels().then((models) => {
          setGeminiModels(models)
        }).catch((err) => {
          console.log(err)
          setGeminiModels(err)
        })
    }

    if (claudeModels.length == 0) {
      console.log('loading claude models')
      ClaudeService.getInstance()
        .listModels().then((models) => {
          setClaudeModels(models)
        }).catch((err) => {
          console.log(err)
          setClaudeModels(err)
        })
    }
  }

  function setDefaulGenAI(value: string) {
    setConfigValue('models.current', value)
    syncConfig('models.current', value as string)
    setGenAI(value)
  }

  return (
    <>
      <div data-theme={theme} className="bg-background">
        <div>
          <div className="absolute right-1 mt-1 cursor-pointer">
            <X
              onClick={() => { window.system.closeWindow("settings") }}
              className="hover:bg-red-500" />
          </div>
          <div className="bg-secondary draggable absolute right-8 w-[213px] h-[30px]"></div>
          <Tabs initialTabIndex={0}>
            <Tab label="General">
              <div className="flex flex-col justify-between space-y-6 mb-5">
                <div className="flex justify-between">
                  <h1 className="text-sm font-medium leading-none pt-3">Themes</h1>
                  <Select value={theme}
                    onValueChange={(value: Theme) => {
                      setTheme(value)
                      syncConfig('general.theme', value)
                    }} >
                    <SelectTrigger className="w-[230px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent style={lineSelectContextStyle}>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-sm font-medium leading-none pt-3">Lenguague</h1>
                  <Select defaultValue={getConfigValue('general.language')}
                    onValueChange={(value) => {
                      setConfigValue('general.language', value)
                    }}>
                    <SelectTrigger className="w-[230px]">
                      <SelectValue placeholder="Lenguague" />
                    </SelectTrigger>
                    <SelectContent style={lineSelectContextStyle}>
                      <SelectItem className="hover:" value="es-us">English</SelectItem>
                      <SelectItem value="pt-br">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator color={'var(--secondary)'} />

              <div className=" flex items-center space-x-4 rounded-md border p-4 mt-5">
                {layoutMode ? <Layout07Icon size={30} /> : <LayoutBottomIcon size={30} />}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Layout - {layoutMode ? "Full" : "Minimalist"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Change the UI layout as per your preference
                  </p>
                </div>
                <Switch
                  checked={layoutMode}
                  onCheckedChange={(checked) => { setLayoutMode(checked) }}
                />
              </div>

              <div className=" flex items-center space-x-4 rounded-md border p-4 mt-5">
                {chatMode ? <Chatting01Icon size={30} /> : <ChatBotIcon size={30} />}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Chat Mode
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {chatMode ? "when enabled your previous messages are saved in the LLM context window" : "each message you send is treated as a simple message to LLM, not saving the context"}
                  </p>
                </div>
                <Switch
                  checked={chatMode}
                  onCheckedChange={(checked) => { setChatMode(checked) }}
                />
              </div>

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
              <div className="flex justify-between mb-5">
                <h1 className="text-sm font-medium leading-none pt-3">Default Model</h1>
                <Select value={genAI}
                  onValueChange={(value) => {
                    setDefaulGenAI(value)
                  }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent style={lineSelectContextStyle}>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="gpt">GPT</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator color={'var(--secondary)'} />
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
                  <Input defaultValue={getConfigValue("models.gemini.apikey")}
                    type="password"
                    placeholder="provide your API key"
                    className="w-[500px] placeholder:text-xs placeholder:opacity-20" onChange={(e) => {
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
                    type="password"
                    placeholder="provide your API key"
                    className="w-[500px] placeholder:text-xs placeholder:opacity-20" onChange={(e) => {
                      setConfigValue('models.gpt.apikey', e.target.value)
                    }} />
                </div>
              </div>

              <div className=" rounded-md border p-4 mt-5">
                <div className=" flex items-center space-x-4">
                  <RiClaudeFill size={30} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Claude
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Set configuration
                    </p>
                  </div>
                  <Select onOpenChange={loadModels} defaultValue={getConfigValue('models.claude.version')}
                    onValueChange={(value) => {
                      setConfigValue('models.claude.version', value)
                    }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Claude Version" />
                    </SelectTrigger>
                    <SelectContent style={lineSelectContextStyle}>
                      {claudeModels.map((model) => {
                        return <SelectItem value={model}>{model}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-4 justify-between">
                  <p className="pl-2 text-sm text-muted-foreground">
                    Api Key
                  </p>
                  <Input
                    defaultValue={getConfigValue("models.claude.apikey")}
                    type="password"
                    placeholder="provide your API key"
                    className="w-[500px] placeholder:text-xs placeholder:opacity-20" onChange={(e) => {
                      setConfigValue('models.claude.apikey', e.target.value)
                    }} />
                </div>
              </div>

            </Tab>
          </Tabs>
        </div>
        <div className="bg-transparent flex justify-end pr-0.5 m-1">
          <p className="text-sm">version: {version} </p>
        </div>
      </div>
    </>
  )
}