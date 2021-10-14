const BASE64_MARKER = ';base64,';
let arrayBytes = [];

function copiarAlPortapapeles() {
  const loading = document.getElementById('loading-copy');
  loading.hidden = false;

  // Crea un campo de texto "oculto"
  const aux = document.createElement("input");

  // Asigna el contenido del elemento especificado al valor del campo
  aux.setAttribute("value", arrayBytes);

  // Añade el campo a la página
  document.body.appendChild(aux);

  // Selecciona el contenido del campo
  aux.select();

  // Copia el texto seleccionado
  document.execCommand("copy");

  // Elimina el campo de la página
  document.body.removeChild(aux);
  alert('Array bytes copiados');
  loading.hidden = true;
}

function convertDataURIToBinary(dataURI) {
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

async function Main() {
  const converterButton = document.getElementById('converter-button');
  const loadingButton = document.getElementById('loading-button');

  const file = document.querySelector('#formFile')?.files[0];
  if (file) {
    converterButton.hidden = true;
    loadingButton.hidden = false;
    const result = await toBase64(file).catch(e => Error(e));
    if (result instanceof Error) {
      console.log('Error: ', result.message);
      return;
    }
    arrayBytes = convertDataURIToBinary(result);
    document.getElementById('binary-bytes').innerText = arrayBytes;
    converterButton.hidden = false;
    loadingButton.hidden = true;
  } else {
    alert('Seleccione un pdf a procesar.')
  }
}