#!/bin/bash

# EXECUTED BY ELECTRON

# Delete the keyboard shortcut and the command to execute

source ./scripts/shortcuts/common/validate.sh $1

source ./scripts/shortcuts/common/vars.sh $1 "keyboard shortcuts removed!"

# Function to remove shortcut for GNOME
remove_gnome_shortcut() {
    gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings "[]"

    echo $finishMesage
}

# Function to remove shortcut for Plasma (KDE)
remove_plasma_shortcut() {
    # Remove the custom shortcut from kglobalshortcutsrc file
    kwriteconfig5 --file ~/.config/kglobalshortcutsrc --group "khotkeys" --key "Action_$command_id" ""
    kwriteconfig5 --file ~/.config/kglobalshortcutsrc --group "khotkeys" --key "Shortcut_$command_id" ""

    echo $finishMesage
}

# Function to remove shortcut for Xfce
remove_xfce_shortcut() {
    # Remove the custom shortcut from xfce4-keyboard-shortcuts
    xfconf-query -c xfce4-keyboard-shortcuts -p "/commands/custom/<Primary><Alt>p" -r -t string

    echo $finishMesage
}

# Function to remove shortcut for MATE
remove_mate_shortcut() {
    # Remove the custom shortcut from MATE
    gsettings reset org.mate.Marco.keybinding-commands command-$command_id
    gsettings reset org.mate.Marco.keybinding-commands binding-$command_id

    echo $finishMesage
}

# Function to remove shortcut for Unity
remove_unity_shortcut() {
    dconf reset /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/command
    dconf reset /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/name
    dconf reset /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/binding
    dconf reset /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings

    echo $finishMesage
}

# Check which desktop environment is currently running and remove shortcut accordingly
DESKTOP_ENV=$(echo "$XDG_CURRENT_DESKTOP" | tr '[:upper:]' '[:lower:]')
case "$DESKTOP_ENV" in
    gnome)
        remove_gnome_shortcut
        ;;
    plasma)
        remove_plasma_shortcut
        ;;
    xfce)
        remove_xfce_shortcut
        ;;
    mate)
        remove_mate_shortcut
        ;;
    unity)
        remove_unity_shortcut
        ;;
    *)
        echo "Desktop environment not supported or detected."
        exit 1
        ;;
esac
