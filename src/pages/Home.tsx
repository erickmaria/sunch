import Search from '@/components/Search/Search';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useEffect, useState } from 'react';
import { SearchTabs } from '@/components/SearchTabs/SearchTabs';

export default function Home() {

  const { getConfig } = useUserSettings()
  const [layoutMode, setLayoutMode] = useState<string>(getConfig("general.layout.mode"));

  // sync configs
  useEffect(() => {
    const removeListener = window.system.syncConfig((data) => {
      if (data.key == `general.layout.mode`) setLayoutMode(data.value as unknown as string)
    });

    return () => {
      removeListener();
    };
  });

  return (
    <>
      {/* <div className="bg-background rounded-b-xl rounded-tr-xl" autoFocus> */}
      <div autoFocus>
        {layoutMode == "full" && <SearchTabs />}
        {layoutMode == "minimalist" && <Search id='1' key={1} />}
      </div>
    </>
  )
}



