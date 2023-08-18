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
            
                // Disparar evento 'input'
                const inputEvent = new Event('input', { bubbles: true });
                element.dispatchEvent(inputEvent);
            
                // Disparar evento 'change'
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
              console.log(`this is the current button ${myButton}`);
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
          if (focusedElement.isContentEditable || focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
              var inputEvent = new InputEvent('input', {
                  bubbles: true,
                  cancelable: true,
                  inputType: 'insertText',
                  data: 'I want more info'
              });
        
              focusedElement.dispatchEvent(inputEvent);
          }
    
          setTimeout(() => {
            var sendButton = document.querySelector('div[aria-label="Press Enter to send"]');
            // Simula un evento de clic en el elemento
            if (sendButton) {
                // sendButton.click();
            }
          }, 1000);
      }, 2000);
      }, 1000);
    }
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {

    if (details.url.startsWith('http://localhost:3003/')) {
      const data = decodeURIComponent(details.url.substring(details.url.indexOf('=') + 1));
      const dataArray = data.split('&');
      const message = dataArray[0];
      const url = dataArray[1]?.replace('url=', '');

      chrome.storage.local.set({ initialMessage: message }, function () {
        chrome.tabs.create({ url, active: false }, (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                function: performOperationsInTab,
              },
              () => {
                // setTimeout(() => {
                //   chrome.tabs.remove(tab.id);
                // }, 5000);
              }
            );
          });
        });
      });
    }
  },
  { urls: ['<all_urls>'] },
);


