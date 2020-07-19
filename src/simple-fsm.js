//@ts-check
const nr = require("node-red")
const FSMFactory = require("./FSMFactory")
/**
 * 
 * @param {nr.Red} RED 
 */
module.exports = function (RED) {
    /**
     * @this {nr.Node}
    * @param {nr.NodeProperties & {
        fsmDefinition: FSMFactory.FSMDefinition
        throwTransitionErrors: boolean
    }} config
     */
    function SimpleFSMNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        try {
            const fsm = FSMFactory(config.fsmDefinition)
            node.status({ fill: "green", shape: "ring", text: "state: " + config.fsmDefinition.initial_state })
            node.on('input', function (msg, send, done) {
                if (msg.payload && typeof msg.payload == "string") {
                    try {
                        const newstate = fsm(msg.payload)
                        const newmsg = {
                            ...msg,
                            topic: "state",
                            payload: newstate
                        }
                        node.status({ fill: "green", shape: "ring", text: "state: " + newstate })
                        send(newmsg)
                        done()
                    } catch (e) {
                        if (config.throwTransitionErrors) {
                            node.error(e)
                        } else {
                            done()
                        }
                    }
                } else {
                    node.error("payload was not a string")
                    node.status({ fill: "red", shape: "ring", text: "payload was not a string" })
                    done()
                }
            });
        } catch (error) {
            node.error(error)
        }
    }
    RED.nodes.registerType("simple-fsm", SimpleFSMNode);
}
