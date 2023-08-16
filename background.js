// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "saveText") {
//     var text = request.text;

//     chrome.storage.local.get(["savedTexts"], function (result) {
//       var savedTexts = [];
//       const values = text.split(',');

//       const textValue = values[0];
//       const url = values[1];

//       savedTexts = [textValue];

//       console.log("Stored", textValue);
//       console.log("Stored url", url);

//       chrome.tabs.create({ url }, (tab) => {
//         // After the new tab is created, execute the content script in the tab
//         console.log('tab created!', tab);
//         chrome.scripting.executeScript({
//           target: { tabId: tab.id },
//           function: () => {
//             // Aquí puedes ejecutar la función que necesitas en el script de contenido
//             // por ejemplo, enviar un mensaje al script de contenido
//             chrome.runtime.sendMessage({ action: 'sendMessage' });
//           },
//         });
//       });

//       chrome.storage.local.set({ savedTexts: savedTexts, url }, function () {
//         sendResponse();
//       });
//     });

//     return true;
//   }

//   if (request.action === "pasteText") {
//     var text = request.text;

//     console.log("pasted text bg");

//     return true;
//   }

//   if (request.action === "facebook-opened") {
//     var text = request.text;

//     console.log("pasted text bg");

//     return true;
//   }


//   if (request.action === "dropText") {
//     var text = request.text;

//     console.log("drop text bg");
//     console.log(text);
//   }
// });

function performOperationsInTab() {
  // Obtener el mensaje inicial desde el almacenamiento local
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
              // console.log(`Modal Textarea found`);
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
      const sendAgain = document.querySelector('div[aria-label="Message Again"]');
      sendAgain.click();

      setTimeout(() => {
        const messageArea = document.querySelector('div[aria-describedby^=":"]');

        if(messageArea) {

          function handleSpanAdded(event) {
            console.log("New span element added:", event.target);
          }

          const children = messageArea.children;

// Loop through the children and do something with each one
        for (const child of children) {
          const newSpan = document.createElement("span");
          newSpan.textContent = result.savedTexts[0];
          newSpan.setAttribute("data-lexical-text", "true");
          child.appendChild(newSpan);
          const event = new Event("spanAdded", { bubbles: true });
          child.dispatchEvent(event);
          console.log(child.innerHTML); // This should now include the new <span> element
        }

        window.requestAnimationFrame(() => {
          // The page should now show the added <span> elements visually
        });
        
        for (const child of children) {
          child.addEventListener("spanAdded", handleSpanAdded);
        }
          

        } else {
          console.log('Element not found');
        }
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
                // Cierra la pestaña después de completar las operaciones
                // chrome.tabs.remove(tab.id);
              }
            );
          });
        });
      });
    }
  },
  { urls: ['<all_urls>'] },
);


