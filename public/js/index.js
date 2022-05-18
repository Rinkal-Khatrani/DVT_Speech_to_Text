// status fields and start button in UI

var phraseDiv;
var startRecognizeOnceAsyncButton, file;
var filePicker, audioFile;

// subscription key and region for speech services.
var subscriptionKey,
  serviceRegion,
  languageTargetOptions,
  languageSourceOptions;
var SpeechSDK;
var recognizer;

document.addEventListener("DOMContentLoaded", () => {
  startRecognizeOnceAsyncButton = document.getElementById(
    "startRecognizeOnceAsyncButton"
  );

  //common configuration

  subscriptionKey = "d01aa9530c47449fa91e55a10230e575";
  serviceRegion = "centralIndia";
  languageTargetOptions = "en";
  languageSourceOptions = "en-US";

  var speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
  speechConfig.speechRecognitionLanguage = languageSourceOptions;
  let language = languageTargetOptions;

  speechConfig.addTargetLanguage(language);

  phraseDiv = document.getElementById("phraseDiv");

  var radioButtons = document.querySelectorAll('input[name="option"]');

  file = document.getElementById("fileBlock");
  radioButtons.forEach((radio) => {
    radio.addEventListener("click", () => {
      if (document.getElementById("file").checked) {
        file.style.display = "table-row";

        filePicker = document.getElementById("filePicker");
        filePicker.addEventListener("change", function () {
          audioFile = filePicker.files[0];
          startRecognizeOnceAsyncButton.disabled = false;
        });
      } else {
        file.style.display = "none";
      }
    });
  });

  //start recognize
  startRecognizeOnceAsyncButton.addEventListener("click", function () {
    if (
      document.getElementById("file").checked &&
      filePicker.value.length === 0
    ) {
      alert("please selcte a file");
      return;
    }
    startRecognizeOnceAsyncButton.disabled = true;
    document.getElementById("start").style.display = "none";
    document.getElementById("stop").style.display = "block";

    phraseDiv.innerHTML = "";

    if (subscriptionKey === "" || subscriptionKey === "subscription") {
      alert(
        "Please enter your Microsoft Cognitive Services Speech subscription key!"
      );
      startRecognizeOnceAsyncButton.disabled = false;
      return;
    }
    var audioConfig = document.getElementById("file").checked
      ? SpeechSDK.AudioConfig.fromWavFileInput(audioFile)
      : SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    if (document.getElementById("file").checked) {
      recognizer.recognizeOnceAsync(
        function (result) {
          startRecognizeOnceAsyncButton.disabled = false;
          document.getElementById("start").style.display = "block";
          document.getElementById("stop").style.display = "none";
          phraseDiv.innerHTML += result.text;

          recognizer.close();
          recognizer = undefined;
        },
        function (err) {
          startRecognizeOnceAsyncButton.disabled = false;
          document.getElementById("start").style.display = "block";
          document.getElementById("stop").style.display = "none";
          phraseDiv.innerHTML += err;

          recognizer.close();
          recognizer = undefined;
        }
      );
    } else {
      recognizer.startContinuousRecognitionAsync(
        () => {},
        (e) => {}
      );
      recognizer.recognized = function (s, e) {
        phraseDiv.innerHTML += e.result.text;
      };
    }
  });

  //stop recognize
  document
    .getElementById("stopRecognizeOnceAsyncButton")
    .addEventListener("click", function () {
      document.getElementById("start").style.display = "block";
      document.getElementById("stop").style.display = "none";

      var audioConfig = document.getElementById("file").checked
        ? SpeechSDK.AudioConfig.fromWavFileInput(audioFile)
        : SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      if (!document.getElementById("file").checked) {
        recognizer.stopContinuousRecognitionAsync(
          function () {
            startRecognizeOnceAsyncButton.disabled = false;
            document.getElementById("start").style.display = "block";
            document.getElementById("stop").style.display = "none";
            recognizer.close();
            recognizer = undefined;
          },
          function (err) {
            recognizer.close();
            recognizer = undefined;
          }
        );
      }
    });

  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    startRecognizeOnceAsyncButton.disabled = false;

    document.getElementById("login-page").style.display = "block";
    document.getElementById("warning").style.display = "none";
  }
});
