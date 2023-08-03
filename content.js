import browser from 'webextension-polyfill';

function scrapePage(url, selector) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const element = doc.querySelector('[placeholder="Send a private message…"]');
      if (element) {
        console.log('Element found:', element);
      } else {
        console.log('Element not found.');
      }
    })
    .catch((error) => {
      console.error('Error fetching the page:', error);
    });
}

// Example usage - replace 'https://example.com' and 'your_selector' with your desired URL and selector
scrapePage('https://www.facebook.com/marketplace/item/1995611887469185/', 'your_selector');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // if (request.action === "dropText") {
  //   function getTextareaByValue(value) {
  //     var textareas = document.getElementsByTagName("textarea");

  //     for (var i = 0; i < textareas.length; i++) {
  //       if (textareas[i].value === value) {
  //         // console.log("yep");
  //         return textareas[i];
  //       }
  //     }

  //     return null;
  //   }

  //   // console.log("Called");
  //   var myTextarea = getTextareaByValue("Hi, is this available?");
  //   if (myTextarea) {
  //     console.log("Textarea found:", myTextarea);

  //     chrome.storage.local.get(["savedTexts"], function (result) {
  //       var savedTexts = result.savedTexts || [];
  //       console.log(savedTexts);
  //       if (savedTexts.length > 0) {
  //         myTextarea.value = savedTexts[savedTexts.length - 1];
  //       }
  //     });
  //   } else {
  //     console.log("Textarea not found");
  //   }

  //   // ========================================================================
  //   // use below for an html page with a dummy text box, so this could be our base for
  //   // other websites such as cargurus or cars.com

  //   // var textInput = document.querySelector('input[type="text"]');
  //   // if (textInput) {
  //   //   chrome.storage.local.get(['savedTexts'], function(result) {
  //   //     var savedTexts = result.savedTexts || [];
  //   //     console.log(savedTexts)
  //   //     if (savedTexts.length > 0) {
  //   //       textInput.value = savedTexts[savedTexts.length - 1];
  //   //     }
  //   //   });
  //   // }
  // }

  function clickSendButton() {
    const button = document.querySelector(
      'div[aria-label="Send"][role="button"]'
    );
    button.click();
    // if(button){

    //   button.click();
    // }
    // else{
    //   console.log("NOPE")
    // }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "clickSendButton") {
      console.log("send button clicked");
      clickSendButton();
      sendResponse({ message: "Send buttons clicked!" });
    }
  });
});
