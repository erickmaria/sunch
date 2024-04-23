
# EXECUTED BY ELECTRON

port="$1"
shortcut="<Primary><Alt>p"  # Shortcut example: Ctrl+Alt+P
command="curl localhost:$port"
name="Sunch Window Toogle"
command_id=$(echo "${name// /}" | tr '[:upper:]' '[:lower:]')
finishMesage=""$2