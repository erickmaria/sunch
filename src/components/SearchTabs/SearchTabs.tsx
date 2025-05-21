import { ReactNode, useState } from "react";
import { Plus, X } from "lucide-react";
import Search from "../Search/Search";
import { Settings02Icon, SolidLine01Icon } from "hugeicons-react";
import { SearchSettings } from "../SearchSettings";

interface Tab {
  id: string;
  title: string;
  children: ReactNode;
}

interface TabItemProps {
  tab: Tab;
  tabsLength: number
  active: boolean;
  onClick: () => void;
  onClose: () => void;
}

export function SearchTabs() {

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "New Tab",
      children: <Search key={"1"} id="1" />,
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>("1");
  const [settings, setSettings] = useState<boolean>(false)

  const handleTabClick = (id: string) => setActiveTab(id);
  const handleCloseTab = (id: string) => {
    if (tabs.length == 1) {
      return
    }

    setTabs((prev) => prev.filter((tab) => tab.id !== id));

    if (activeTab === id && tabs.length > 1) {
      const index = tabs.findIndex((t) => t.id === id);
      const newActiveTab = tabs[index === 0 ? 1 : index - 1].id;
      setActiveTab(newActiveTab);
    }
  };

  const handleAddTab = () => {
    const newId = Date.now().toString();
    const newTab = { id: newId, title: `New Tab`, children: <Search key={newId} id={newId} /> };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newId);
  };

  return (
    <>
      <div className="space-x-1">
        <div className="flex align-middle justify-between">
          <div className="flex space-x-1 items-center overflow-hidden">
            <div className="flex text-xs overflow-hidden">
              {tabs.map((tab) => (
                <SearchTabsItem
                  key={tab.id}
                  tab={tab}
                  tabsLength={tabs.length}
                  active={tab.id === activeTab}
                  onClick={() => handleTabClick(tab.id)}
                  onClose={() => handleCloseTab(tab.id)}
                />
              ))}
            </div>
            <span className="opacity-20">|</span>
            {tabs.length <= 4 &&
              <div
                className="hover:bg-secondary hover:rounded-full"
                onClick={handleAddTab} >
                <Plus size={12} />
              </div>
            }
          </div>
          {/* <div className="bg-secondary draggable w-fit h-[24px]"></div> */}
          <div className="flex">
            <Settings02Icon
              onClick={() => (settings ? setSettings(false) : setSettings(true))}
              className="hover:bg-secondary  p-1" />
            <SolidLine01Icon
              onClick={() => { window.system.minimizeWindow("home") }}
              className="hover:bg-secondary  p-1" />
            <X
              onClick={() => { window.system.closeWindow("home") }}
              className="hover:bg-red-500 hover:text-white p-0.5" />
          </div>
        </div>
        {settings && <SearchSettings setSettings={setSettings} />}
        <div className="">
          {/* {tabs
        .filter(tab => tab.id == activeTab)
        .map(tab => (
          tab.children
        ))} */}
          {tabs.find((t) => t.id === activeTab)?.children}
        </div>
      </div>
    </>
  );
}

function SearchTabsItem({ tab, tabsLength, active, onClick, onClose }: TabItemProps) {
  return (
    <>
      <div className={`flex items-center ${active ? "bg-background" : "bg-secondary"}`}>
        {!active ? <span className="opacity-15">|</span> : <span className="pr-1"></span>}
        <div
          className={`flex min-w-36 items-center justify-between p-0.5 cursor-pointer ${active ? "bg-background" : "bg-secondary"}`}
          onClick={onClick}
        >
          <span>{tab.title}</span>
          <div className={`p-0.5 hover:rounded-4xl space-x-1 ${active ? "hover:bg-background" : "hover:bg-secondary"}`}>
            { tabsLength > 1 &&
            <X
              className="w-4 h-4"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}
