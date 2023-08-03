document.addEventListener('DOMContentLoaded', function() {
  console.log("Popup loaded")
  var grabButton = document.getElementById('grabButton');
  var dropButton = document.getElementById('dropButton');
  var textDisplay = document.getElementById('textDisplay');

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
    var textarea = document.querySelector('textarea[id^=":"]');
    if (textarea) {
      var text = textarea.value;
      const textClass = [...textarea.classList]?.find(className => className?.startsWith('communications-input-'));
      const url = textClass.replace(/^communications-input-/, '');

      chrome.runtime.sendMessage({ action: 'saveText', text: `${text},${url}` });
    }
  }

  grabButton.addEventListener('click', async function() {
    chrome.scripting.executeScript({
      target: {tabId: await getTabID()},
      function: grabberFunction
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
    // console.log("Drop Button Works")
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'dropText' });
    });
  });

  // chrome.storage.local.get(['savedTexts'], function(result) {
  //   var savedTexts = result.savedTexts || [];
  //   if (savedTexts.length > 0) {
  //     textDisplay.textContent = savedTexts[savedTexts.length - 1];
  //     console.log('Retrieved text:', savedTexts[savedTexts.length - 1]);
  //   }
  // });
});
