import { useUserSettings } from "@/hooks/useUserSettings";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import OpenRouter from "../icons/OpenRouter/OpenRouter";
import { RiClaudeFill, RiGeminiFill, RiOpenaiFill } from "react-icons/ri";
import { MdWarningAmber } from "react-icons/md";

interface SeachIconTooltipProps {
  provider: "gpt" | "gemini" | "claude" | "openrouter"
  alert?: string
}

export function SeachIconTooltip({ alert, provider }: SeachIconTooltipProps) {

  const { getConfig } = useUserSettings();
  const [model, setModel] = useState(getConfig(`models.${provider}.version`));

  useEffect(() => {
    setModel(getConfig(`models.${provider}.version`))
  }, [provider]);

  useEffect(() => {
    const removeListener = window.system.syncConfig((data) => {
      if (data.key == `models.${provider}.version`) setModel(data.value as unknown as string)
    });

    return () => {
      removeListener();
    };
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild className='cursor-pointer'>
        <div className='absolute'>
          {(alert == undefined) ? <div>
            {(provider === 'openrouter') && <OpenRouter size={16} />}
            {(provider === 'gemini') && <RiGeminiFill size={16} />}
            {(provider === 'gpt') && <RiOpenaiFill size={16} />}
            {(provider === 'claude') && <RiClaudeFill size={16} />}
          </div> : <MdWarningAmber className='text-red-600 animate-bounce' size={16} />}
        </div>
      </TooltipTrigger>
      <TooltipContent side={document.body.offsetHeight > 44 ? "bottom" : "left"}>
        {(alert == undefined) ? <p>{model}</p> : <p>{alert}</p>}
      </TooltipContent>
    </Tooltip>
  )
}