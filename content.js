chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendMessage') {
    // Realizar acciones en el content script (por ejemplo, interactuar con el DOM)
    const pageTitle = document.title;
    console.log('Título de la página:', pageTitle);
    console.log(document);

    // Enviar una respuesta a la extensión si es necesario
    sendResponse({ status: 'Información obtenida del DOM 1' });
    pasteText();
  }
});

function pasteText() {
  chrome.storage.local.get(["initialMessage"], function (result) {
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
            
            const textToType = result.initialMessage || "Hola me interesa el carro";
          
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
            // Do something with the newly added <span> element
            // For example, you can access event.target to get the newly added <span> element
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
    // }
  });
}


