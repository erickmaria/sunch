
// type Callback = () => void
// interface Commands {
//     key: string,
//     callback: Callback
// }

const SlashCommands = (() => {

    // const  commands: Array<Commands> = []

    // function validate(input: string): Callback | undefined {
    //     for (let i = 0; i < commands.length; i++) {
    //         if (input.startsWith(commands[i].key)) {
    //             return commands[i].callback
    //         }
    //     }
    // }

    // return {
    //     register: (key: string, callback: Callback): void => {
    //         commands.push({
    //             key,
    //             callback
    //         })
    //     },

    //     execute: (input: string): boolean => {
    //         const callback = validate(input)

    //         if (callback == undefined){
    //             return false
    //         }

    //         callback()

    //         return true
    //     }
    // }

    return {
        validate: (key: string, input: string): boolean => {
            if (input.startsWith(key)) {
                return true
            }
            return false
        }
    }
})();


export {
    SlashCommands
}