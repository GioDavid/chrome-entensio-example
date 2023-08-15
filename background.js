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

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {

    if (details.url.startsWith('http://localhost:3003/')) {
      const data = decodeURIComponent(details.url.substring(details.url.indexOf('=') + 1));
      const dataArray = data.split('&');
      const message = dataArray[0];
      const url = dataArray[1]?.replace('url=', '');

      chrome.storage.local.set({ initialMessage: message }, function () {
        chrome.tabs.create({ url }, (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === 'complete') {
              // El tab ha cargado completamente, enviar el mensaje al content script
              chrome.tabs.sendMessage(tabId, { action: 'sendMessage' }, function (response) {
                // Manejar la respuesta del content script si es necesario
                console.log('Respuesta del content script:', response);
              });

              // Desvincular el evento para evitar duplicados
              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        });
      });
    }
  },
  { urls: ['<all_urls>'] },
);

