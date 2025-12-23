import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import OpenRouter from "../icons/OpenRouter/OpenRouter";
import { RiClaudeFill } from "react-icons/ri";
import { SettingsOptions } from "../SearchSettings/SettingsOptions";
import { SettingsTittle } from "../SearchSettings/SettingsTittle";
import { SettingsSwitcher, SettingsSwitcherItem } from "../SearchSettings/SettingsSwitcher";
import { Microphone } from "../Microphone/Microphone";
import { ChatGptIcon, GoogleGeminiIcon } from "hugeicons-react";
import { ILLMCapabilities, LLMProvider, LLMResponses } from "@/services/LLMService";
import { Switch } from "../ui/switch";

interface SeachOptionProps {
  audio: string
  chatMode: boolean
  capabilities: Map<LLMProvider, ILLMCapabilities>
  providers: Array<LLMProvider>
  setChatMode: React.Dispatch<React.SetStateAction<boolean>>
  setProviders: React.Dispatch<React.SetStateAction<Array<LLMProvider>>>
  setLLMResponses: React.Dispatch<React.SetStateAction<LLMResponses | undefined>>
  setAudio: React.Dispatch<React.SetStateAction<string>>
}

export function SeachOptionProps({ setProviders, setLLMResponses, setAudio, chatMode, setChatMode, capabilities, providers }: SeachOptionProps) {

  return (
    <div className='bg-background rounded-md border-2 border-transparent w-full px-1 my-0.5'>
      <div className='flex justify-between items-center'>
        <div className='flex'>
          <div >
            <SettingsOptions >
              <SettingsTittle name='AI' />
              <SettingsSwitcher name="AI" defaultValue={providers[0]}>
                <SettingsSwitcherItem onClick={() => setProviders(['gemini'])} value='gemini' icon={<GoogleGeminiIcon size={15} />} />
                <SettingsSwitcherItem onClick={() => setProviders(['gpt'])} value='gpt' icon={<ChatGptIcon size={15} />} />
                <SettingsSwitcherItem onClick={() => setProviders(['claude'])} value='claude' icon={<RiClaudeFill size={15} />} />
                <SettingsSwitcherItem onClick={() => setProviders(['openrouter'])} value='openrouter' icon={<OpenRouter size={15} />} />
              </SettingsSwitcher>
            </SettingsOptions>
          </div>
          <span className='pl-2 p-0.5 opacity-40'>|</span>

          <div className={`flex items-center ${!(capabilities.get(providers[0])?.context) && 'pointer-events-none opacity-10'}`}>
            <div className='flex items-center space-x-1 rounded-md'>
              <div className='pl-2 p-1'>
                <SettingsTittle name='chat' />
              </div>
                <Switch className='' checked={chatMode} onCheckedChange={(checked) => { setChatMode(checked) }} />
              <div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex'>
          <div className={`${!(capabilities.get(providers[0])?.audio) && 'pointer-events-none opacity-10'} p-1`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Microphone
                    onError={setLLMResponses}
                    audioData={setAudio}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use Voice</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}