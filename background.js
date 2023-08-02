chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "saveText") {
    var text = request.text;

    chrome.storage.local.get(["savedTexts"], function (result) {
      var savedTexts = result.savedTexts || [];
      savedTexts.push(text);

      console.log("Stored", text);
      chrome.storage.local.set({ savedTexts: savedTexts }, function () {
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
