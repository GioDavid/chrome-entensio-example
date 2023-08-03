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

      fetch('https://www.facebook.com/marketplace/item/1995611887469185/')
      .then((response) => response.text())
      .then((html) => {
        const doc = document.implementation.createHTMLDocument('virtual');
        doc.documentElement.innerHTML = html;
  
        const element = doc.querySelector(`[placeholder="${placeholder}"]`);
        if (element) {
          console.log('Element found:', element);
        } else {
          console.log('Element not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching the page:', error);
      });

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
