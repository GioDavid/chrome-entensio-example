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

const modalTextArea = document.querySelector('textarea[id^=":"]');
const textToType = "Texto que quiero simular";

if (modalTextArea) {
  simulateTyping(modalTextArea, textToType).then(() => {
    console.log('done');
  });
}




