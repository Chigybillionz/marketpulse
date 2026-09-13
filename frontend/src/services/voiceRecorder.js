export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    this.startTime = null;
    this.selectedMimeType = '';
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
      
      // Request microphone access with progressive fallback for mobile/Safari compatibility
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (constraintErr) {
        console.warn("High-fidelity audio constraints failed, falling back to basic audio: true", constraintErr);
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      // Verify the stream has active audio tracks
      const audioTracks = this.stream.getAudioTracks();
      if (!audioTracks || audioTracks.length === 0) {
        throw new Error("No audio tracks available from microphone");
      }

      // Detect best supported MIME type across Chrome, Firefox, Safari iOS/macOS
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/aac",
        "audio/ogg;codecs=opus",
        "audio/wav",
      ];
      
      let selectedMimeType = "";
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === "function") {
        selectedMimeType = mimeTypes.find(mimeType => MediaRecorder.isTypeSupported(mimeType)) || "";
      }
      this.selectedMimeType = selectedMimeType;

      const options = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
      this.mediaRecorder = options ? new MediaRecorder(this.stream, options) : new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        this.stopMediaStream();
      };

      // Start recording with a timeslice to get frequent data events
      this.mediaRecorder.start(250);
      console.log("Recording started at:", this.startTime.toISOString());
      console.log("Using mime type:", selectedMimeType || this.mediaRecorder.mimeType || "default");
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (this.stream) {
        this.stopMediaStream();
        this.stream = null;
      }
      throw new Error(`Microphone access failed: ${error.message || "Permission denied"}`, { cause: error });
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
          const effectiveMimeType = this.mediaRecorder?.mimeType || this.selectedMimeType || "audio/webm";

          if (this.audioChunks.length === 0) {
            this.stopMediaStream();
            this.stream = null;
            this.mediaRecorder = null;
            reject(new Error("No audio data recorded. Please ensure your microphone is working and speak clearly."));
            return;
          }
          
          const audioBlob = new Blob(this.audioChunks, { type: effectiveMimeType });
          const duration = Math.max(1, Math.round((new Date() - this.startTime) / 1000));
          
          if (audioBlob.size === 0) {
            this.stopMediaStream();
            this.stream = null;
            this.mediaRecorder = null;
            reject(new Error("Recording resulted in an empty audio file. Please try again."));
            return;
          }

          // Attach metadata directly onto the Blob instance for caller convenience
          audioBlob.actualMimeType = effectiveMimeType;
          audioBlob.duration = duration;
          audioBlob.recordedSize = audioBlob.size;

          console.log(`Recording stopped. Format: ${effectiveMimeType}, Size: ${audioBlob.size} bytes, Duration: ${duration}s`);
          
          this.stopMediaStream();
          this.stream = null;
          this.mediaRecorder = null;
          resolve(audioBlob);
        } catch (error) {
          this.stopMediaStream();
          this.stream = null;
          this.mediaRecorder = null;
          reject(error);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        this.stopMediaStream();
        this.stream = null;
        this.mediaRecorder = null;
        reject(new Error(`Recording error: ${event.error?.message || "Unknown error"}`));
      };

      // Request any buffered data before final stop
      if (typeof this.mediaRecorder.requestData === 'function' && this.mediaRecorder.state === 'recording') {
        try {
          this.mediaRecorder.requestData();
        } catch (e) {
          console.warn("requestData warning:", e);
        }
      }

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
      this.stream = null;
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
