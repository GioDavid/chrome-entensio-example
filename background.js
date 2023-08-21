function performOperationsInTab() {
  chrome.storage.local.get(['initialMessage'], function (result) {
    const modalButton = document.querySelector('div[aria-label="Message"]');
    if(modalButton) {
      modalButton.click();

      setTimeout(() => {
        const textarea = document.querySelector('textarea[id^=":"]');
        const spans = document.getElementsByTagName('span');
        let firstSpan = null;

        Array.from(spans).forEach(function(span) {
            var spanText = span.textContent;
    
            if (spanText.includes("Is this still available")) {
               firstSpan = span;
            }
        });

        if(firstSpan) {
          firstSpan.parentElement.parentElement.click();  
          setTimeout(() => {
            const modalTextArea = document.querySelector('textarea[id^=":"]');

            function simulateTyping(element, textToType) {
              return new Promise((resolve) => {
                element.focus();
                element.value = textToType;
            
                const inputEvent = new Event('input', { bubbles: true });
                element.dispatchEvent(inputEvent);
            
                const changeEvent = new Event('change', { bubbles: true });
                element.dispatchEvent(changeEvent);
            
                resolve();
              });
            }

          if (modalTextArea) {
            const textToType = result.initialMessage || "Is this still available, I'm interested?";
            modalTextArea.value = textToType;

            simulateTyping(modalTextArea, textToType).then(() => {
              const ariaLabel = 'Send Message';
              const myButton = document.querySelector(`[aria-label="${ariaLabel}"]`);
              myButton.click(); 
            });
          }
          }, 1000);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        const sendAgain = document.querySelector('div[aria-label="Message Again"]');
        sendAgain.click();
        setTimeout(() => {
          const focusedElement = document.querySelector('div[aria-label="Message"]');
          focusedElement.focus();
          const textToType = result.initialMessage || "I'm following up this";
          if (focusedElement.isContentEditable || focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
              var inputEvent = new InputEvent('input', {
                  bubbles: true,
                  cancelable: true,
                  inputType: 'insertText',
                  data: textToType
              });
        
              focusedElement.dispatchEvent(inputEvent);
          }
    
          setTimeout(() => {
            // var sendButton = document.querySelector('div[aria-label="Press Enter to send"]');
            // if (sendButton) {
            //   sendButton.click();
            // }
            const elements = document.querySelectorAll('div[role="none"][dir="auto"]');
            const messages = [];

            elements.forEach(element => {
              const classList = element.classList;
              const messageText = element.innerText;
              let messageType = '';
            
              if (classList.contains('x14ctfv')) {
                messageType = 'sent';
              } else if (classList.contains('xzsf02u')) {
                messageType = 'received';
              }
            
              if (messageType) {
                messages.push({ type: messageType, text: messageText });
              }
            });

            chrome.storage.local.get(["senderTab"]).then((result) => {
              const tabId = result.senderTab;
              chrome.runtime.sendMessage({ type: 'activateAndExecuteScript', tabId, conversation: messages });
            });
          }, 1000);
      }, 3000);
      }, 2000);
    }
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (details.url.startsWith('http://localhost:3000/?message')) {
      const data = decodeURIComponent(details.url.substring(details.url.indexOf('=') + 1));
      const dataArray = data.split('&');
      const message = dataArray[0];
      const url = dataArray[1]?.replace('url=', '');
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTabId = tabs[0].id;
        chrome.storage.local.set({ senderTab: currentTabId });
  
    });

      chrome.storage.local.set({ initialMessage: message });
      chrome.tabs.create({ url, active: false }, (tab) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (changeInfo.status === 'complete' && tabId === tab.id) {
            chrome.storage.local.set({ receiverTab: tabId });
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                function: performOperationsInTab,
              }
          );

            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      });
    }
  },
  { urls: ['<all_urls>'] },
);

function sendResponseToOrigin (conversation) {
  const button = document.getElementsByClassName("facebook-message-loading-button")[0];
  button.setAttribute("data-conversation", JSON.stringify(conversation));
  button.click();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'activateAndExecuteScript') {
    const tabId = message.tabId;
    const conversation = message.conversation;

    chrome.tabs.update(tabId, { active: true }, () => {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          function: sendResponseToOrigin,
          args: [conversation]
        }
      );
    });
  }
});


