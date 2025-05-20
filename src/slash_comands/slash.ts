
// // type Callback = () => void
// // interface Commands {
// //     key: string,
// //     callback: Callback
// // }

// const SlashCommands = (() => {

//     // const  commands: Array<Commands> = []

//     // function validate(input: string): Callback | undefined {
//     //     for (let i = 0; i < commands.length; i++) {
//     //         if (input.startsWith(commands[i].key)) {
//     //             return commands[i].callback
//     //         }
//     //     }
//     // }

//     // return {
//     //     register: (key: string, callback: Callback): void => {
//     //         commands.push({
//     //             key,
//     //             callback
//     //         })
//     //     },

//     //     execute: (input: string): boolean => {
//     //         const callback = validate(input)

//     //         if (callback == undefined){
//     //             return false
//     //         }

//     //         callback()

//     //         return true
//     //     }
//     // }

//     return {
//         validate: (key: string, input: string): boolean => {
//             if (input.startsWith(key)) {
//                 return true
//             }
//             return false
//         }
//     }
// })();


// export {
//     SlashCommands
// }




type Callback = () => void
type Commands = {
    key: string,
    callback: (...props: any) => unknown
}

const SlashCommands = (() => {

    // const commands: Array<string> = [];
    const commands: Array<Commands> = []

    function validate(input: string): ((...props: any) => unknown) | undefined {
        for (const cmd of commands) {
            if (input.startsWith(cmd.key)) {
                return cmd.callback
            }
        }

        return undefined;
    }


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