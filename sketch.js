// Variables para el canvas y MQTT
let bgColor = '#FFFFFF';  // Color de fondo inicial (blanco)
const mqttTopic = 'esp32/buttonColor';

// Conexión MQTT
let client;

function setup() {
  createCanvas(400, 400);
  
  // Configurar la conexión MQTT usando mqtt.js (necesita ser incluido en el HTML)
  // Usamos un broker público para este ejemplo
  client = mqtt.connect('wss://broker.mqtt-dashboard.com:8884/mqtt');
  
  client.on('connect', function() {
    console.log('Conectado al broker MQTT');
    client.subscribe(mqttTopic);
  });
  
  client.on('message', function(topic, message) {
    if (topic === mqttTopic) {
      // Actualizar el color de fondo cuando se reciba un mensaje
      bgColor = message.toString();
      console.log('Nuevo color recibido:', bgColor);
    }
  });
}

function draw() {
  // Aplicar el color de fondo actual
  background(bgColor);
  
  // Dibujar un texto para mostrar el color actual
  fill(invertColor(bgColor));
  textSize(20);
  textAlign(CENTER, CENTER);
  text('Color actual: ' + bgColor, width/2, height/2);
}

// Función para invertir un color (para asegurar que el texto sea visible)
function invertColor(hex) {
  // Quitar el signo # si está presente
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  
  // Convertir a RGB
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);
  
  // Invertir los colores
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;
  
  // Convertir de nuevo a formato hexadecimal
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
