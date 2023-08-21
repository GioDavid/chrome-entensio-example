chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ["http", "https"] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message) {
    const modalButton = document.querySelector('div[aria-label="Message"]');
    console.log('modal: ', modalButton);

    sendResponse({ status: 'DOM interaction successful' });
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'send-first-message') {
    console.log('here is the way', message);
  }
  if (message.action === 'sendMessage') {
    pasteText();
  }
  if (message.action === 'send-first-facebook-message') {
    console.log('here is the way', message);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  console.log("Popup loaded");
  var grabButton = document.getElementById('grabButton');
  var pasteButton = document.getElementById('pasteButton');
  var dropButton = document.getElementById('dropButton');
  var getResponseButton = document.getElementById('getResponseButton');
  var newResponseButton = document.getElementById('newResponseButton');

  function coypinClipboard (value) {
if (!navigator.clipboard){
   const dummy = document.createElement("input");

   document.body.appendChild(dummy);
 
   dummy.setAttribute("id", "dummy_id");
 
   document.getElementById("dummy_id").value=value;
 
   dummy.select();
 
   document.execCommand("copy");
    document.body.removeChild(dummy);
} else{
  navigator.clipboard.writeText(value).then(
      function(){
          alert("yeah!");
      })
    .catch(
       function() {
          alert("err");
    });
} 
  }

  function getTabID() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({
                active: true,
            }, function (tabs) {
                resolve(tabs[0].id);
            })
        } catch (e) {
            reject(e);
        }
    })
}

  function grabberFunction(){
    const textarea = document.querySelector('.communications-input');
    if (textarea) {
      var text = textarea.value;
      const textClass = [...textarea.classList]?.find(className => className?.startsWith('communications-input-'));
      const url = textClass.replace(/^communications-input-/, '');
      textarea.select();

      document.execCommand('copy');

        
  function pasteText() {
    chrome.storage.local.get(["savedTexts"], function (result) {
      const element = document.querySelector('textarea');
      // if(element) {
      //   const sendButton = document.querySelector('div[aria-label="Send"]');
      //   element.textContent= result.savedTexts[0];
      //   console.log('Element from short flow found:', element);
      //   sendButton.click();
      // } else {

      const modalButton = document.querySelector('div[aria-label="Message"]');
      if(modalButton) {
        modalButton.click();

        setTimeout(() => {
          const textarea = document.querySelector('textarea[id^=":"]');

          function simulateTyping(element, textToType) {
            return new Promise((resolve) => {
              const delay = 100;
          
              function typeCharacter(index) {
                if (index < textToType.length) {
                  const char = textToType[index];
                  const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    data: char,
                    inputType: 'insertText',
                  });
          
                  element.value += char;
                  element.dispatchEvent(inputEvent);
          
                  setTimeout(() => {
                    typeCharacter(index + 1);
                  }, delay);
                } else {
                  resolve();
                }
              }
          
              typeCharacter(0);
            });
          }

          const spans = document.getElementsByTagName('span');
          let firstSpan = null;

          Array.from(spans).forEach(function(span) {
              var spanText = span.textContent;
      
              if (spanText.includes("Is this still available?")) {
                 firstSpan = span;
              }
          });

          if(firstSpan) {
            firstSpan.parentElement.parentElement.click();  
            const modalTextArea = document.querySelector('textarea[id^=":"]');
  
            if (modalTextArea) {
              
              const textToType = result.savedTexts[0] || "Hola me interesa el carro";
            
              simulateTyping(modalTextArea, textToType).then(() => {
                const ariaLabel = 'Send Message';
                const myButton = document.querySelector(`[aria-label="${ariaLabel}"]`);
                // myButton.click(); 
              
              }).catch(error => {
                console.error(error);
              });
            }
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
  
          for (const child of children) {
            const newSpan = document.createElement("span");
            newSpan.textContent = result.savedTexts[0];
            newSpan.setAttribute("data-lexical-text", "true");
            child.appendChild(newSpan);
            const event = new Event("spanAdded", { bubbles: true });
            child.dispatchEvent(event);
            console.log(child.innerHTML);
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
      // }
    });
  }


      chrome.runtime.sendMessage({ action: 'saveText', text: `${text},${url}` });
      setTimeout(pasteText, 2000);
    }
  }

          
  function pasteText() {
    chrome.storage.local.get(["savedTexts"], function (result) {
      const element = document.querySelector('textarea');
      // if(element) {
      //   const sendButton = document.querySelector('div[aria-label="Send"]');
      //   element.textContent= result.savedTexts[0];
      //   console.log('Element from short flow found:', element);
      //   sendButton.click();
      // } else {

      const modalButton = document.querySelector('div[aria-label="Message"]');
      if(modalButton) {
        modalButton.click();

        setTimeout(() => {
          const textarea = document.querySelector('textarea[id^=":"]');

          function simulateTyping(element, textToType) {
            return new Promise((resolve) => {
              const delay = 100;
          
              function typeCharacter(index) {
                if (index < textToType.length) {
                  const char = textToType[index];
                  const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    data: char,
                    inputType: 'insertText',
                  });
          
                  element.value += char;
                  element.dispatchEvent(inputEvent);
          
                  setTimeout(() => {
                    typeCharacter(index + 1);
                  }, delay);
                } else {
                  resolve();
                }
              }
          
              typeCharacter(0);
            });
          }

          const spans = document.getElementsByTagName('span');
          let firstSpan = null;

          Array.from(spans).forEach(function(span) {
              var spanText = span.textContent;
      
              if (spanText.includes("Is this still available?")) {
                 firstSpan = span;
              }
          });

          console.log(firstSpan);

          if(firstSpan) {
            firstSpan.parentElement.parentElement.click();  
            const modalTextArea = document.querySelector('textarea[id^=":"]');
  
            if (modalTextArea) {
              
              const textToType = result.savedTexts[0] || "Hola me interesa el carro";

              console.log(textToType);
            
              simulateTyping(modalTextArea, textToType).then(() => {
                const ariaLabel = 'Send Message';
                const myButton = document.querySelector(`[aria-label="${ariaLabel}"]`);
                // myButton.click(); 
              
              }).catch(error => {
                console.error(error);
              });
            }
          }
        }, 2000);
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
  
          for (const child of children) {
            const newSpan = document.createElement("span");
            newSpan.textContent = result.savedTexts[0];
            newSpan.setAttribute("data-lexical-text", "true");
            child.appendChild(newSpan);
            const event = new Event("spanAdded", { bubbles: true });
            child.dispatchEvent(event);
            console.log(child.innerHTML);
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
      // }
    });
  }
  
  function getConversation () {
    const elements = document.querySelectorAll('div[role="none"][dir="auto"]');
    elements.forEach(element => {
    console.log(element);
  });
  }

  window.addEventListener(
    "send-first-facebook-message",
    (event) => {
      console.log(event);
    },
    false,
  );

  grabButton.addEventListener('click', async function() {
    chrome.scripting.executeScript({
      target: {tabId: await getTabID()},
      function: grabberFunction
    });
  });


  pasteButton.addEventListener('click', async function() {
    chrome.scripting.executeScript({
      target: {tabId: await getTabID()},
      function: pasteText
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const clickButton = document.getElementById("clickButton");
  
    clickButton.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'clickSendButton' }, function (response) {
          console.log(response.message);
        });
      });
    });
  });
  

  dropButton.addEventListener('click', function() {
    chrome.storage.local.clear();
  });

  getResponseButton.addEventListener('click', async function() {
    chrome.scripting.executeScript({
      target: {tabId: await getTabID()},
      function: getConversation
    });
  });

  newResponseButton.addEventListener('click', async function() {    
    function writeResponse () {
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
        if (sendButton) {
            // sendButton.click();
        }
      }, 1000);
    }

    chrome.scripting.executeScript({
      target: {tabId: await getTabID()},
      function: writeResponse
    });
  });

});
