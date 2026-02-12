
import { LLMProvider, LLMResponses } from '@/services/LLMService'
import React from 'react'
import { Message, MessageContent, MessageResponse } from '../ai-elements/message'

interface ResultProps {
  contents: LLMResponses | undefined
}

function Result({ contents }: ResultProps) {

  if (contents != undefined && contents.size > 0) {
    const providers = Array.from(contents.keys())
    return (

      <div className="bg-background/15 p-6  max-h-[400px] overflow-auto rounded-b-md mt-0.5 select-text">
        <div className="flex flex-coloverflow-auto">
          {providers.map((provider: LLMProvider) => (
            <Message from='assistant'>
              <MessageContent>
                <MessageResponse
                linkSafety={{
                  enabled: false,
                }}
                >{contents.get(provider)!}</MessageResponse>
              </MessageContent>
            </Message>
         ))}
      </div>
    </div >
    )
  }

  return (
    <></>
  )
}

export default React.memo(Result)
