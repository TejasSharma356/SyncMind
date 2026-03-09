class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const channelData = input[0];
            // Send the Float32Array to the main thread
            this.port.postMessage(channelData);
        }
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);
