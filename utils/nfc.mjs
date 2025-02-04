import tags from "../tags.json" assert { type: "json" };
import EventEmitter from "events";
import easymidi from "easymidi";

class NFC extends EventEmitter {
  constructor() {
    super();
    this.tags = tags || {};
  }

  handleInputs() {
    // Create inputs for all available MIDI devices, and listen for messages
    easymidi.getInputs().forEach((inputName) => {
      const input = new easymidi.Input(inputName);
      input.on("message", (msg) => this.processMessage(msg));
    });
  }

  processMessage(msg) {
    if (msg._type === "sysex") {
      const tagFound = this.detectTag(msg);
      // Send the detected tag to the main process
      this.emit("tagDetected", tagFound);
    }
  }

  detectTag(msg) {
    // Extract the tag ID from the message
    const bytes = msg.bytes.slice(6, msg.bytes.length - 1);
    const iddec = bytes.map((byte) => parseInt(byte, 16));
    // Find the tag in the tags.json file
    for (const product in this.tags) {
      for (const tagArray of this.tags[product].TagsID) {
        if (this.isTagMatch(tagArray, iddec)) {
          return { product, tagArray };
        }
      }
    }
    return { product: null, tagArray: iddec };
  }

  isTagMatch(tagArray, iddec) {
    // Compare the tag ID with the ID in the tags.json file
    return tagArray.every((value, index) => value === iddec[index]);
  }
}

export default new NFC();
