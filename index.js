document.addEventListener("DOMContentLoaded", function () {
  let mediaRecorder;
  let startTime;
  let timerInterval;

  const startButton = document.querySelector(".audio-button");
  const stopButton = document.querySelector(".stop-button");
  const timerDisplay = document.querySelector(".timer");

  let audioChunks = [];
  let audioBlob;

  startButton.addEventListener("click", function () {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (event) {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };
        mediaRecorder.onstop = function () {
          audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioDataURL = URL.createObjectURL(audioBlob);
          const downloadLink = document.createElement("a");
          downloadLink.href = audioDataURL;
          downloadLink.download = "recorded_audio.wav";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        mediaRecorder.start();
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        startButton.disabled = true;
        stopButton.disabled = false;
      })
      .catch(function (error) {
        console.error("Error accessing microphone:", error);
      });
  });

  stopButton.addEventListener("click", function () {
    mediaRecorder.stop();
    clearInterval(timerInterval);
    stopButton.disabled = true;
    startButton.disabled = false;
  });

  function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(currentTime / 3600);
    const minutes = Math.floor((currentTime % 3600) / 60);
    const seconds = currentTime % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timerDisplay.textContent = formattedTime;
  }
});
