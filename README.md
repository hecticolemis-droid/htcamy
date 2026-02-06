visualizador-modulacion/
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos CSS con diseño responsive
├── script.js           # Lógica JavaScript y algoritmos de modulación
├── README.md           
🎮 Cómo Usar
1. Ingresar Secuencia Binaria
Escribe una secuencia de bits (ej: 10110010)

O genera una secuencia aleatoria con el botón 🎲

Solo se permiten caracteres 0 y 1

2. Seleccionar Modulación
Haz clic en uno de los 4 tipos disponibles

Los botones cambiarán de color según la modulación seleccionada

3. Ajustar Parámetros
Amplitud: Controla el nivel de la señal

Frecuencia: Ajusta la frecuencia portadora

Tasa de bits: Define cuántos bits por segundo se transmiten

4. Interpretar Visualizaciones
Dominio del tiempo: Muestra la señal modulada como función del tiempo

Diagrama de constelación: Representa símbolos en el plano complejo (I-Q)

🔧 Tecnologías Utilizadas
Frontend
HTML5 Semántico: Uso de <header>, <main>, <section>, <article>

CSS3 Avanzado:

CSS Grid para layout principal

Flexbox para controles

Variables CSS para tema personalizable

Media queries para diseño responsive

JavaScript ES6+:

Canvas API para gráficos

Manipulación del DOM

Event listeners para interactividad

Características Técnicas
✅ Validación de formularios HTML5

✅ Canvas para renderizado de gráficos

✅ Diseño mobile-first

✅ Accesibilidad (ARIA, navegación por teclado)

✅ Sin dependencias de frameworks

📚 Conceptos Educativos
Esta aplicación ayuda a visualizar:

ASK: Modulación por desplazamiento de amplitud

Bit 1 = Amplitud alta

Bit 0 = Amplitud baja

FSK: Modulación por desplazamiento de frecuencia

Bit 1 = Frecuencia alta

Bit 0 = Frecuencia baja

PSK: Modulación por desplazamiento de fase

Bit 1 = Fase 180°

Bit 0 = Fase 0°

4-QAM: Modulación de amplitud en cuadratura

2 bits por símbolo

Símbolos en cuadrantes del plano complejo

🧪 Casos de Uso
Para Estudiantes
Comprender visualmente diferencias entre esquemas de modulación

Experimentar con parámetros y observar efectos en tiempo real

Preparación para laboratorios de comunicaciones

Para Educadores
Demostraciones en clase

Herramienta de enseñanza interactiva

Generación de ejemplos personalizados

Para Profesionales
Prototipado rápido de señales

Verificación de conceptos teóricos

Herramienta de referencia visual

🔍 Detalles Técnicos de Implementación
Algoritmos de Modulación
javascript
// Ejemplo: Modulación PSK
function modulatePSK(bit, t, bitDuration, fc) {
    const phase = bit === '1' ? Math.PI : 0;
    return amplitude * Math.cos(2 * Math.PI * fc * t + phase);
}
Responsive Design
Breakpoints: 480px (móvil), 768px (tablet), 1024px (escritorio)

CSS Grid se adapta de 2 columnas a 1 columna en móviles

Controles se reorganizan automáticamente

Accesibilidad
Etiquetas ARIA para elementos canvas

Navegación completa por teclado

Contraste de colores adecuado

Reducción de movimiento para usuarios sensibles

🤝 Contribuir
¡Las contribuciones son bienvenidas! Sigue estos pasos:

Haz un fork del proyecto

Crea una rama para tu funcionalidad (git checkout -b feature/nueva-funcionalidad)

Commit tus cambios (git commit -m 'Añadir nueva funcionalidad')

Push a la rama (git push origin feature/nueva-funcionalidad)

Abre un Pull Request

Mejoras Planeadas
Agregar más tipos de modulación (8-PSK, 16-QAM)

Exportar gráficos como imágenes

Añadir ruido a la señal para simular condiciones reales

Implementar demodulación visual

Soporte para importar secuencias desde archivo

📄 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

👏 Agradecimientos
Inspiración: Laboratorios de comunicaciones de universidades

Colores: Paleta inspirada en equipos de telecomunicaciones profesionales

Iconos: Emojis nativos para máxima compatibilidad

Testing: Comunidad de desarrolladores web
