import React, { ReactElement, ReactNode } from "react"


interface SettingsSwitcherProps {
    name: string
    defaultValue: string
    children: ReactNode
}


export function SettingsSwitcher({ name, defaultValue, children }: SettingsSwitcherProps) {

    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as ReactElement<any>, {
                name,
                defaultValue
            });
        }
        return child;
    });

    return (
        <>
            <div className="setting-options-switch-field setting-options-switch-size">
                {enhancedChildren}
            </div>
        </>
    )
}

interface SettingsItemSwitcherItem {
    name?: string
    defaultValue?: string
    onClick: () => void
    icon: ReactNode
    value: string
}


export function SettingsSwitcherItem({ name, defaultValue, icon, value, onClick }: SettingsItemSwitcherItem) {

    return (
        <>
            <input type="radio" id={`theme-switcher-${value}`} name={name} value={value} checked={defaultValue === value} />
            <label onClick={onClick} htmlFor={`theme-switcher-${value}`} aria-label={value} >
                {icon}
            </label>
        </>
    )
}