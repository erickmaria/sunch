import { Search } from '@/components/Search/Search';
import { Commands } from '@/components/Commands/Commands';
import { useState } from 'react';
import Result from '@/components/Result/Result';
import { LLMResponses } from '@/services/LLMService';

export default function Home() {

  const [input, setInput] = useState<string>("");
  const [awaiting, setAwaiting] = useState<boolean>(false);
  const [LLMResponses, setLLMResponses] = useState<LLMResponses | undefined>(undefined);

  return (
    <>
      <div autoFocus>
        {input.startsWith("/") ?
          <Commands id='1' key={1} input={input} setInput={setInput} />
          :
          <Search id='1' key={1} input={input} setInput={setInput} setAwaiting={setAwaiting} setLLMResponses={setLLMResponses} />
        }
        {(!awaiting && !input.startsWith("/")) && <Result contents={LLMResponses} />}
      </div>
    </>
  )
}
