import React, { ReactElement, ReactNode, useState } from "react"


interface SettingsSwitcherProps {
    name: string
    defaultValue: string
    children: ReactNode
}


export function SettingsSwitcher({ name, defaultValue, children }: SettingsSwitcherProps) {
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement<any>, {
                name,
                selectedValue,
                onSelect: setSelectedValue
            });
        }
        return child;
    });

    return (
        <>
            <div className="flex bg-secondary border-2 border-secondary rounded-md relative">
                {enhancedChildren}
            </div>
        </>
    )
}

interface SettingsItemSwitcherItem {
    name?: string
    selectedValue?: string
    onSelect?: (value: string) => void
    onClick: () => void
    icon: ReactNode
    value: string
}


export function SettingsSwitcherItem({ selectedValue, onSelect, icon, value, onClick }: SettingsItemSwitcherItem) {

    const handleClick = () => {
        if (onSelect) {
            onSelect(value);
        }
        onClick();
    };

    const isSelected = selectedValue === value;

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                className={`inline-flex justify-center items-center cursor-pointer font-medium leading-4 px-2 py-1 text-center capitalize transition-all duration-150 ease-in-out rounded-md ${
                    isSelected
                        ? 'bg-background shadow-md text-foreground'
                        : 'bg-transparent text-gray-400 hover:text-gray-300'
                }`}
                aria-label={value}
            >
                {icon}
            </button>
        </>
    )
}