content=""
first=0
while IFS= read -r line; do
    if [[ "$line" == "## v"* ]]; then
        ((first++))
    fi
    if [[ $first > 1 ]]; then
        break
    fi
    content+="$line\n"
    echo $line
done < CHANGELOG.md