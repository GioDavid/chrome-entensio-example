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

// Obtener el textarea y simular la escritura
const modalTextArea = document.querySelector('textarea[id^=":"]');
const textToType = "Texto que quiero simular";

if (modalTextArea) {
  simulateTyping(modalTextArea, textToType).then(() => {
    // Lógica adicional después de simular la escritura
  });
}




