
import { Tab, Tabs } from "@/components/Tabs/Tabs"
import { CSSProperties, ReactNode, useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Switch } from "@/components/ui/switch"
import { MdOutlineNotificationsActive, MdOutlineNotificationsOff } from "react-icons/md";
import { ChatBotIcon, ChatGptIcon, Chatting01Icon, Layout07Icon, LayoutBottomIcon } from 'hugeicons-react';
import { RiClaudeFill, RiGeminiFill } from "react-icons/ri";
import Separator from "@/components/Separator/Separator";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Theme, useTheme } from "@/contexts/ThemeProvider";
import { useUserSettings } from "@/hooks/useUserSettings";
import GPTService from "@/services/GPTService";
import GeminiService from "@/services/GeminiService";
import ClaudeService from "@/services/ClaudeService";
import OpenRouterService from "@/services/OpenRouterService";
import OpenRouter from "@/components/icons/OpenRouter/OpenRouter";
import Loading from "@/components/Loading/Loading";
import { usePersistedState } from "@/hooks/usePersistedState";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button"


const lineSelectContextStyle: CSSProperties = {
  maxHeight: '300px'
}

export default function Settings() {


  const { setConfig, getConfig, dispatchSyncConfig } = useUserSettings()
  const { setTheme, theme } = useTheme();

  const [notification, setNotification] = useState<boolean>(false);
  const [genAI, setGenAI] = useState<string>(getConfig('models.current'));
  const [layoutMode, setLayoutMode] = useState<boolean>((getConfig("general.layout.mode") as string) == "full" ? true : false);
  const [chatMode, setChatMode] = useState<boolean>(getConfig("general.chatMode.enable") as boolean);
  const [backgroundOpacity, setBackgroundOpacity] = useState<boolean>((getConfig("general.backgroundOpacity") as boolean));


  const [version, setVersion] = useState<string>("");

  // sync configs
  useEffect(() => {
    const removeListener = window.system.syncConfig((data) => {
      if (data.key == `general.layout.mode`) setLayoutMode(data.value == "full" ? true : false)
      if (data.key == `general.chatMode.enable`) setChatMode(data.value as boolean)
    });

    return () => {
      removeListener();
    };
  });

  useEffect(() => {
    setConfig('general.notification.enable', notification)
  }, [notification])

  useEffect(() => {
    setConfig('general.chatMode.enable', chatMode)
    dispatchSyncConfig('general.chatMode.enable', chatMode)
  }, [chatMode])

  useEffect(() => {
    setConfig('general.layout.mode', layoutMode ? "full" : "minimalist")
    dispatchSyncConfig('general.layout.mode', layoutMode ? "full" : "minimalist")
  }, [layoutMode])

  useEffect(() => {
    setConfig('general.backgroundOpacity', backgroundOpacity)
    dispatchSyncConfig('general.backgroundOpacity', backgroundOpacity)
  }, [backgroundOpacity])

  useEffect(() => {
    window.system.getAppVersion().then((v) => {
      setVersion(v);
    })
  }, []);


  function setDefaulGenAI(value: string) {
    setConfig('models.current', value)
    dispatchSyncConfig('models.current', value as string)
    setGenAI(value)
  }

  return (
    <>
      <div data-theme={theme} className={`bg-background border-b rounded-tl-none rounded-tr-xl rounded-b-xl ${backgroundOpacity && `opacity-95`}`}>
        <div>
          <div className="absolute right-1 mt-1 cursor-pointer">
            <X
              onClick={() => { window.system.closeWindow("settings") }}
              className="hover:bg-red-500" />
          </div>

          {/* <div className="bg-secondary draggable absolute right-8 w-[148px] h-[28px]"></div> */}
          <div className="bg-secondary draggable absolute right-8 w-[225px] h-[28px]"></div>

          <Tabs initialTabIndex={0}>
            <Tab label="General">
              <div className="flex flex-col justify-between space-y-6 mb-5">

                <div className="flex justify-between">
                  <span className="text-sm font-medium leading-none pt-3">Lenguague</span>
                  <Select defaultValue={getConfig('general.language')}
                    disabled
                    onValueChange={(value) => {
                      setConfig('general.language', value)
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

                <div className="rounded-md border p-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium leading-none pt-3">Themes</span>
                      <Select value={theme}
                        onValueChange={(value: Theme) => {
                          setTheme(value)
                          dispatchSyncConfig('general.theme', value)
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

                    <div className="flex items-center mt-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          transparency
                        </p>
                      </div>
                      <Switch
                        checked={backgroundOpacity}
                        onCheckedChange={(checked) => { setBackgroundOpacity(checked) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator color={'var(--secondary)'} />

              <div className=" space-y-4 mt-5">
                <div className="flex items-center space-x-4 rounded-md border p-4">
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

                <div className="flex items-center space-x-4 rounded-md border p-4">
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

                <div className="flex items-center space-x-4 rounded-md border p-4">
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
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator color={'var(--secondary)'} />

              <div className="space-y-4 mt-5">
                <ModelContainer provider="openrouter" icon={<OpenRouter size={24} />} />
                <ModelContainer provider="gemini" icon={<RiGeminiFill size={30} />} />
                <ModelContainer provider="gpt" icon={<ChatGptIcon size={30} />} />
                <ModelContainer provider="claude" icon={<RiClaudeFill size={30} />} />
              </div>

            </Tab>
          </Tabs>
        </div>
        <div className="absolute w-full flex justify-end bottom-0 right-0 pr-2 rounded-b-xl">
          <p>{version}</p>
        </div>
      </div>
    </>
  )
}

// ------------------------------------------------------------------------

type Provider = "gpt" | "gemini" | "claude" | "openrouter"

interface ModelContainerProps {
  provider: Provider
  icon: ReactNode
}

function ModelContainer({ provider, icon }: ModelContainerProps) {

  const { setConfig, getConfig } = useUserSettings()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className=" rounded-md border space-y-2 p-4">
        <div className=" flex items-center space-x-5">
          <div>{icon}</div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {provider}
            </p>
            <p className="text-sm text-muted-foreground">
              Set model
            </p>
          </div>
          <div>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger >
                <Button asChild
                  variant="outline"
                  role="combobox"
                  className=" w-[170px] justify-between"
                >
                  <div className="overflow-hidden">
                    {getConfig(`models.${provider}.version`) != "" ? getConfig(`models.${provider}.version`) : "Select model"}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" className="min-w-[384px] p-0 mx-2">
                <Command>
                  <CommandInput icon={<Search size={20} />} placeholder="Select model..." className="" />
                  <CommandList>
                    {/* <CommandEmpty>
                      No model found.
                    </CommandEmpty> */}
                    <CommandGroup>
                      <LoadModelsComponent setOpen={setOpen}
                        key={provider}
                        provider={provider}
                      />
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="pl-0.5 text-sm text-muted-foreground">
            Api Key
          </p>
          <Input
            defaultValue={getConfig("models.claude.apikey")}
            type="password"
            placeholder="provide your API key"
            className="placeholder:text-xs placeholder:opacity-20" onChange={(e) => {
              setConfig('models.claude.apikey', e.target.value)
            }} />
        </div>
      </div>
    </>
  );
}

interface LoadModelsComponentProps {
  provider: Provider
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoadModelsComponent({ provider, setOpen }: LoadModelsComponentProps) {
  const [data, setData] = useState<Array<string>>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  // Cache object to store models data
  const [modelsCache] = usePersistedState(provider, () => new Map<string, Array<string>>());
  const { setConfig, dispatchSyncConfig } = useUserSettings()


  const fetchData = async () => {
    setHasError(false)
    // Return cached data if available
    if (modelsCache.has(provider)) {
      const cached = modelsCache.get(provider);
      if (Array.isArray(cached) && cached.length > 0) {
        setData(cached);
        return;
      }
    }

    try {
      let models: Array<string> = [];

      switch (provider) {
        case "gpt":
          models = await GPTService.getInstance().listModels();
          break;
        case "gemini":
          models = await GeminiService.getInstance().listModels();
          break;
        case "claude":
          models = await ClaudeService.getInstance().listModels();
          break;
        case "openrouter":
          models = await OpenRouterService.getInstance().listModels();
          break;
        default:
          models = [];
      }

      // Store in cache
      modelsCache.set(provider, models);
      setData(models);
    } catch (err) {
      console.error(err);
      setHasError(true)
      // setData(err as unknown as any);
      setData(typeof err === "string" ? [err] : Array.isArray(err) ? err : [String(err)]);

    }
  }

  useEffect(() => {
    fetchData()
  }, [provider]);

  return (
    <>
      {data.length > 0 ? <>
        {data.map((model) => {
          return <CommandItem
            disabled={hasError}
            key={model}
            value={model}
            onSelect={() => {
              setConfig(`models.${provider}.version`, model)
              dispatchSyncConfig(`models.${provider}.version`, model)
              setOpen(false)
            }}
          >{model}</CommandItem>
        })}
      </> : !hasError ? <div className="text-sm"><Loading /> </div> : <CommandEmpty> {data} </CommandEmpty>}
    </>
  );
}