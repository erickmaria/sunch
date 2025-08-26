import { useState, ReactNode } from "react";
import './Tabs.css'

interface TabProps {
  label: string;
  children: ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  initialTabIndex?: number;
}

const Tabs: React.FC<TabsProps> = ({ children, initialTabIndex = 0 }) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(initialTabIndex);

  return (
    <div>
      <ul className="tabs">
        {children.map((child, index) => (
          <li
          key={index}
          className={index === activeTabIndex ? "active" : ""}
          onClick={() => setActiveTabIndex(index)}
          >
            {child.props.label}
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {children[activeTabIndex] && children[activeTabIndex].props.children}
      </div>
    </div>
  );
};

const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export { Tabs, Tab };
