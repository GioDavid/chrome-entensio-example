chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "saveText") {
    var text = request.text;

    chrome.storage.local.get(["savedTexts"], function (result) {
      var savedTexts = [];
      const values = text.split(',');

      const textValue = values[0];
      const url = values[1];

      savedTexts = [...textValue];

      console.log("Stored", textValue);
      console.log("Stored url", url);

      chrome.storage.local.set({ savedTexts: savedTexts, url }, function () {
        sendResponse();
      });
    });

    return true;
  }

  if (request.action === "dropText") {
    var text = request.text;

    console.log("drop text bg");
    console.log(text);
  }
});
