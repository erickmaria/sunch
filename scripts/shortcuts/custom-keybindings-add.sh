#!/bin/bash

# EXECUTED BY ELECTRON

# Define the keyboard shortcut and the command to execute

source $2/scripts/shortcuts/common/validate.sh $1

source $2/scripts/shortcuts/common/vars.sh $1 "keyboard shortcuts added!"

# Function to add shortcut for GNOME
add_gnome_shortcut() {
    gsettings set org.gnome.settings-daemon.plugins.media-keys custom-keybindings "['/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/']"
    gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/ name "$name"
    gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/ command "$command"
    gsettings set org.gnome.settings-daemon.plugins.media-keys.custom-keybinding:/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/ binding "$shortcut"
    
    echo $finishMesage
}

# Function to add shortcut for Plasma (KDE)
add_plasma_shortcut() {
    # Plasma uses kwriteconfig5
    kwriteconfig5 --file ~/.config/kglobalshortcutsrc --group "khotkeys" --key "Action_$command_id" "$command"
    kwriteconfig5 --file ~/.config/kglobalshortcutsrc --group "khotkeys" --key "Shortcut_$command_id" "$shortcut"
    
    echo $finishMesage
}

# Function to add shortcut for Xfce
add_xfce_shortcut() {
    # Xfce uses xfconf-query
    xfconf-query -c xfce4-keyboard-shortcuts -p "/commands/custom/<Primary><Alt>p" -n -t string -s "$command"
    
    echo $finishMesage
}

# Function to add shortcut for MATE
add_mate_shortcut() {
    # MATE uses gsettings
    gsettings set org.mate.Marco.keybinding-commands command-$command_id "$command"
    gsettings set org.mate.Marco.keybinding-commands binding-$command_id "$shortcut"

    echo $finishMesage
}

# Function to add shortcut for Unity
add_unity_shortcut() {
    dconf write /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/command "'$command'"
    dconf write /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/name "'$name'"
    dconf write /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/binding "'$shortcut'"
    dconf write /org/gnome/settings-daemon/plugins/media-keys/custom-keybindings "['/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom$command_id/']"

    echo $finishMesage
}

# Check which desktop environment is currently running and add shortcut accordingly
DESKTOP_ENV=$(echo "$XDG_CURRENT_DESKTOP" | tr '[:upper:]' '[:lower:]')
case "$DESKTOP_ENV" in
    gnome)
        add_gnome_shortcut
        ;;
    plasma)
        add_plasma_shortcut
        ;;
    xfce)
        add_xfce_shortcut
        ;;
    mate)
        add_mate_shortcut
        ;;
    unity)
        add_unity_shortcut
        ;;
    *)
        echo "Desktop environment not supported or detected."
        exit 1
        ;;
esac
