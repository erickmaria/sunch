type Callback = () => void
type Commands = {
    key: string,
    callback: (...props: any) => unknown
}

const SlashCommands = (() => {

    const commands: Array<Commands> = []

    function validate(input: string): ((...props: any) => unknown) | undefined {
        for (const cmd of commands) {
            if (input.startsWith(cmd.key)) {
                return cmd.callback
            }
        }

        return undefined;
    }

    return {

        add: (key: string, callback: (...props: any) => unknown): void => {
            commands.push({
                key, callback
            })
        },
        list: (): Array<Commands> => {
            return commands
        },



        execute: (input: string):( (...props: any) => unknown) | undefined => {
            return validate(input)
        }


    }
})();


export {
    SlashCommands
}