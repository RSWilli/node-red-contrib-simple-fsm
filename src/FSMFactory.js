/**
 * @typedef {
    {
        initial_state: string
        states: {
            [state: string]: {
                [transition: string]: string
            }
        }
    } FSMDefinition

    @typedef {Map<string,string>} State
 */

/**
 * 
 * @param {FSMDefinition} definition 
 * @returns {(transition: string) => string} 
 */
module.exports = (definition) => {
    let state = definition.initial_state

    const statemachine = new Map(Object.entries(definition.states)
        .map(([state, transitions]) => [state, new Map(Object.entries(transitions))])
    )

    /**
     * check the integrity of the FSM
     */
    const transitionsValid = Object.values(definition.states).every((transitions) =>
        Object.values(transitions).every(transition => statemachine.has(transition)))

    if (!transitionsValid) {
        throw new Error("not all transition targets are defined as a state")
    }

    if (!statemachine.has(state)) throw new Error("initial state not defined")

    /**
     * generate a set of valid transitions, that way no transition name will be reserved
     */
    const validTransitions = new Set(Object.values(definition.states).map(v => Object.keys(v)).reduce((flat, arr) => [...flat, ...arr], []))

    /**
     * return the statemachine
     */
    return (transition) => {
        if (validTransitions.has(transition)) {
            // take the value as a serious input and try to change state

            /**
             * @type { State }
             */
            const currentState = statemachine.get(state)

            const nextState = currentState.get(transition)

            if (nextState) {
                state = nextState
                return state
            }

            throw new Error("not a valid transition: " + transition)
        } else {
            // output the current state

            return state
        }
    }
}
