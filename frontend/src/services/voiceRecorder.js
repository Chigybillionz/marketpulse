export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isSupported = !!navigator.mediaDevices?.getUserMedia;
  }

  isRecorderSupported() {
    return this.isSupported;
  }

  async startRecording() {
    try {
      if (!this.isSupported) {
        throw new Error("Your browser does not support audio recording");
      }

      this.audioChunks = [];
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(this.stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      console.log("Recording started...");
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw new Error(`Microphone access denied: ${error.message}`);
    }
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No recording in progress"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
          this.stopMediaStream();
          resolve(audioBlob);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        this.stopMediaStream();
        reject(new Error(`Recording error: ${event.error}`));
      };

      this.mediaRecorder.stop();
    });
  }

  stopMediaStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  async audioToBase64(audioBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error("Failed to convert audio to base64"));
      };
      reader.readAsDataURL(audioBlob);
    });
  }

  getDuration() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      return Math.round(
        this.mediaRecorder.stream.getTracks()[0].readyState
          ? new Date() - this.startTime
          : 0,
      );
    }
    return 0;
  }
}
