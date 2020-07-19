const fac = require("./FSMFactory")

/**
 * @type {fac.FSMDefinition}
 */
const def = {
    initial_state: "1",
    states: {
        "1": {
            next: "2",
            test: "3"
        },
        "2": {
            next: "3"
        },
        "3": {
            next: "4"
        },
        "4": {
            next: "1"
        },
    }
}

const FSM = fac.FSMFactory(def)

console.log(FSM("test"))
console.log(FSM("next"))
console.log(FSM("next"))
console.log(FSM("next"))
console.log(FSM("getstate"))
console.log(FSM("test"))
