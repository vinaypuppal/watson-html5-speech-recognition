export class WebKitSpeechToTextAdaptor {
  get isSupported() {
    return window.webkitSpeechRecognition;
  }
  adapt({
    onStart,
    onResult,
    onError,
    onEnd
    }) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = event => {
      onStart(event);
    };
    recognition.onresult = event => {
      // TODO should we end close the recogizer if isFinal is true?
      let text = '';
      let isFinal = false;
      let score = 0;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
        score = event.results[i][0].confidence;
        isFinal = event.results[i].isFinal;
      }
      onResult({
        text,
        isFinal,
        score
      });
    };
    recognition.onerror = error => {
      onError({error});
    };
    recognition.onend = event => {
      onEnd(event);
    };

    return {
      start() {
        recognition.start();
        return {
          stop() {
            recognition.stop();
          }
        };
      }
    };
  }
}
