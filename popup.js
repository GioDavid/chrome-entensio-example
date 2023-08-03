document.addEventListener('DOMContentLoaded', function() {
  console.log("Popup loaded")
  var grabButton = document.getElementById('grabButton');
  var pasteButton = document.getElementById('pasteButton');
  var dropButton = document.getElementById('dropButton');
  var textDisplay = document.getElementById('textDisplay');

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
          alert("yeah!"); // success 
      })
    .catch(
       function() {
          alert("err"); // error
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
    const textarea = document.querySelector('textarea[id^=":"]');
    if (textarea) {
      var text = textarea.value;
      const textClass = [...textarea.classList]?.find(className => className?.startsWith('communications-input-'));
      const url = textClass.replace(/^communications-input-/, '');
      textarea.select();

      // Execute the copy command
      document.execCommand('copy');

      chrome.runtime.sendMessage({ action: 'saveText', text: `${text},${url}` });
    }
  }
  
  function pasteText() {
    chrome.storage.local.get(["savedTexts"], function (result) {
      const element = document.querySelector('textarea');
      if(element) {
        // const sendButton = document.querySelector('div[aria-label="Send"]');
        element.textContent= result.savedTexts[0];
        console.log('Element from short flow found:', element);
        // sendButton.click();
      } else {

      const modalButton = document.querySelector('div[aria-label="Message"]');
      if(modalButton) {
        console.log('searching modal');
        modalButton.click();

        setTimeout(() => {
          const textarea = document.querySelector('textarea[id^=":"]');
  
          if(textarea) {
            textarea.textContent = result.savedTexts[0];
  
            const sendButton = document.querySelector('div[aria-label="Send Message"]');
            sendButton.removeAttribute("disabled");
            //TODO enable button
  
            console.log('Element found:', sendButton);
            
  
          } else {
            console.log('Element not found');
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
      }
    });

    chrome.runtime.sendMessage({ action: 'pasteText' });

  }

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
});
