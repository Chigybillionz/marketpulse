export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isSupported = !!navigator.mediaDevices?.getUserMedia;
    this.startTime = null;
  }

  isRecorderSupported() {
    return this.isSupported;
  }

  async startRecording() {
    try {
      if (!this.isSupported) {
        throw new Error("Your browser does not support audio recording");
      }

      // Check if there's an existing stream and stop it first
      if (this.stream) {
        this.stopMediaStream();
      }
      
      this.audioChunks = [];
      this.startTime = new Date();
      
      // Request microphone access with audio constraints
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      // Verify the stream has audio tracks
      if (this.stream.getAudioTracks().length === 0) {
        throw new Error("No audio tracks available from microphone");
      }

      // Set up MediaRecorder with best available mime type
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];
      
      let selectedMimeType = mimeTypes.find(mimeType => MediaRecorder.isTypeSupported(mimeType)) || undefined;

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: selectedMimeType,
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        // Clean up chunks after stop to free memory
        setTimeout(() => {
          this.audioChunks = [];
        }, 100);
      };

      this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        this.stopMediaStream();
      };

      // Start recording with a timeslice to get frequent data events
      this.mediaRecorder.start(100);
      console.log("Recording started at:", this.startTime.toISOString());
      console.log("Using mime type:", selectedMimeType || "default");
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      // Clean up on error
      if (this.stream) {
        this.stopMediaStream();
        this.stream = null;
      }
      throw new Error(`Microphone access denied: ${error.message}`, { cause: error });
    }
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No recording in progress"));
        return;
      }

      if (this.mediaRecorder.state === "inactive") {
        reject(new Error("Recording already stopped"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          if (this.audioChunks.length === 0) {
            reject(new Error("No audio data recorded"));
            return;
          }
          
          const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || "audio/webm" });
          console.log("Recording stopped. Blob size:", audioBlob.size, "bytes");
          console.log("Recording duration:", Math.round((new Date() - this.startTime) / 1000), "seconds");
          
          this.stopMediaStream();
          this.stream = null;
          this.mediaRecorder = null;
          resolve(audioBlob);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        this.stopMediaStream();
        reject(new Error(`Recording error: ${event.error?.message || "Unknown error"}`));
      };

      this.mediaRecorder.stop();
    });
  }

  stopMediaStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        if (track.readyState !== "ended") {
          track.stop();
        }
      });
    }
  }

  async audioToBase64(audioBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert audio to base64: invalid result"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to convert audio to base64"));
      };
      reader.readAsDataURL(audioBlob);
    });
  }

  getDuration() {
    if (this.startTime && this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      return Math.round((new Date() - this.startTime) / 1000);
    }
    return 0;
  }
}
