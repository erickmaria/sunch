#!/bin/bash

DEFAULT_DIR=$HOME/.sunch/scripts
SCRIPT_CUSTOM_KEYBINDINGS_ADD=$DEFAULT_DIR/custom-keybindings-add.sh
SCRIPT_CUSTOM_KEYBINDINGS_REMOVE=$DEFAULT_DIR/custom-keybindings-remove.sh

source ./scripts/cleanup.sh
mkdir -p $DEFAULT_DIR

curl -s https://raw.githubusercontent.com/erickmaria/sunch/main/scripts/electron/shortcuts/custom-keybindings-add.sh -o $SCRIPT_CUSTOM_KEYBINDINGS_ADD
curl -s https://raw.githubusercontent.com/erickmaria/sunch/main/scripts/electron/shortcuts/custom-keybindings-remove.sh -o $SCRIPT_CUSTOM_KEYBINDINGS_REMOVE

chmod +x $SCRIPT_CUSTOM_KEYBINDINGS_ADD $SCRIPT_CUSTOM_KEYBINDINGS_REMOVE
