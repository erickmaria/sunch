import { Search } from '@/components/Search/Search';
import { Commands } from '@/components/Commands/Commands';
import {useState } from 'react';
import { useGlobalKeyListener } from '@/hooks/useGlobalKeyListener';

export default function Home() {

  const [quickAi, setQuickAI] = useState<boolean>(true);

   // Register the listeners
  useGlobalKeyListener('Tab', () => {
    setQuickAI(prevState => !prevState)
  });

  return (
    <>  
      <div className='border rounded-md' >
          <Search hidden={quickAi} />
          <Commands hidden={!quickAi} />
      </div>
    </>
  )
}