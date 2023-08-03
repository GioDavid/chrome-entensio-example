chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  function clickSendButton() {
    const button = document.querySelector(
      'div[aria-label="Send"][role="button"]'
    );
    button.click();
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "clickSendButton") {
      console.log("send button clicked");
      clickSendButton();
      sendResponse({ message: "Send buttons clicked!" });
    }
  });
});
