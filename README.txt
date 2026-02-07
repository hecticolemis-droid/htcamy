================================================================================
VISUALIZADOR DE MODULACIÓN DIGITAL - NUEVA VERSIÓN
================================================================================
Versión: 2.0
Fecha: 6 de Febrero, 2026
Desarrolladores: Héctor Lemis Pérez Matos & Amanda Vanessa Mengana López
================================================================================

DESCRIPCIÓN
================================================================================
Aplicación web completamente rediseñada desde cero para visualizar esquemas
de modulación digital (ASK, FSK, PSK, QAM) con:

✅ Interfaz simplificada e intuitiva
✅ Tooltips explicativos en cada elemento
✅ 100% responsive (funciona en CUALQUIER dispositivo)
✅ Sin problemas de CSS
✅ Optimizada para móviles y tablets

ARCHIVOS INCLUIDOS
================================================================================
📄 index.html - Estructura HTML simplificada con tooltips
📄 styles.css - CSS completamente nuevo y responsive
📄 script.js - JavaScript optimizado con sistema de tooltips

CARACTERÍSTICAS PRINCIPALES
================================================================================

1. INTERFAZ SIMPLIFICADA
   - Diseño por pasos numerados (1, 2, 3, 4, 5)
   - Botones grandes con iconos descriptivos
   - Colores distintivos para cada modulación

2. TOOLTIPS EXPLICATIVOS
   - Pasa el mouse (desktop) o toca (móvil) el icono ℹ️
   - Explicaciones sencillas de cada control
   - Información contextual sobre cada modulación

3. RESPONSIVE 100%
   - Desktop: Layout de 2 columnas optimizado
   - Tablet: Diseño adaptado a pantalla mediana
   - Móvil: Layout vertical optimizado
   - Móvil pequeño: Ajustes para pantallas <375px

4. OPTIMIZACIONES MÓVILES
   - Botones grandes (mínimo 48px de altura)
   - Fuente mínima 16px (evita zoom en iOS)
   - Sliders fáciles de manipular
   - Sin scroll horizontal
   - Touch feedback optimizado

CÓMO USAR
================================================================================

INSTALACIÓN:
1. Descarga los 3 archivos (index.html, styles.css, script.js)
2. Colócalos en la misma carpeta
3. Abre index.html en tu navegador

USO:
1. Ingresa una secuencia binaria (0s y 1s) o genera una aleatoria
2. Selecciona el tipo de modulación (ASK, FSK, PSK, QAM)
3. Ajusta los parámetros con los sliders
4. Observa las visualizaciones en tiempo real

TOOLTIPS:
- Desktop: Pasa el mouse sobre los iconos ℹ️
- Móvil: Toca los iconos ℹ️ para ver la explicación

TIPOS DE MODULACIÓN
================================================================================

ASK (Amplitude Shift Keying) - 📊
   • Modula la AMPLITUD
   • Bit 1 = alta amplitud
   • Bit 0 = baja amplitud
   • Fácil de implementar pero susceptible a ruido

FSK (Frequency Shift Keying) - 🌊
   • Modula la FRECUENCIA
   • Bit 1 = alta frecuencia
   • Bit 0 = baja frecuencia
   • Resistente a variaciones de amplitud

PSK (Phase Shift Keying) - 🔄
   • Modula la FASE
   • Bit 1 = 180°
   • Bit 0 = 0°
   • Mejor eficiencia de potencia

QAM (Quadrature Amplitude Modulation) - ⚡
   • Combina AMPLITUD y FASE
   • Transmite 2 bits por símbolo
   • Mayor eficiencia espectral

CONTROLES
================================================================================

SECUENCIA BINARIA:
   - Ingresa solo 0s y 1s
   - Máximo recomendado: 16 bits
   - Botón "Aleatorio" genera secuencia automática

AMPLITUD (1-10 V):
   - Altura de la onda
   - Mayor amplitud = señal más fuerte
   - Afecta la potencia de transmisión

FRECUENCIA (1-10 Hz):
   - Velocidad de oscilación de la onda
   - Mayor frecuencia = más ciclos por segundo
   - Importante en FSK

VELOCIDAD (1-5 bits/s):
   - Qué tan rápido se envían los bits
   - Mayor velocidad = transmisión más rápida
   - Afecta el ancho de banda

VISUALIZACIONES
================================================================================

SEÑAL EN EL TIEMPO:
   • Verde punteado = Señal digital original (rectangular)
   • Color sólido = Señal modulada (sinusoidal)
   • Muestra cómo varía la señal a lo largo del tiempo

DIAGRAMA DE CONSTELACIÓN:
   • Solo aplica para PSK y QAM
   • Muestra los símbolos posibles
   • Eje I = Componente en fase
   • Eje Q = Componente en cuadratura
   • FSK no tiene diagrama I-Q

COMPATIBILIDAD
================================================================================

NAVEGADORES SOPORTADOS:
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Opera 76+

DISPOSITIVOS PROBADOS:
✅ iPhone (todos los modelos desde SE)
✅ iPad (todos los modelos)
✅ Android (todos los tamaños)
✅ Desktop (Windows, Mac, Linux)

RESOLUCIONES SOPORTADAS:
✅ Móvil pequeño: 320px - 375px
✅ Móvil estándar: 375px - 480px
✅ Tablet: 480px - 768px
✅ Desktop: 768px+

PROBLEMAS CORREGIDOS DE LA VERSIÓN ANTERIOR
================================================================================

❌ ANTES: Overflow horizontal en móviles
✅ AHORA: Sin scroll horizontal en ningún dispositivo

❌ ANTES: Botones pequeños difíciles de presionar
✅ AHORA: Botones grandes (48px mínimo) fáciles de tocar

❌ ANTES: Canvas que se salía de sus contenedores
✅ AHORA: Canvas perfectamente ajustado

❌ ANTES: Texto difícil de leer en móviles
✅ AHORA: Fuentes optimizadas para cada tamaño

❌ ANTES: Controles confusos sin explicación
✅ AHORA: Tooltips explicativos en todo

❌ ANTES: Zoom automático en iOS
✅ AHORA: Fuente 16px previene zoom

❌ ANTES: Sliders difíciles de manipular
✅ AHORA: Área táctil grande y cómoda

TECNOLOGÍAS UTILIZADAS
================================================================================

HTML5:
   • Estructura semántica
   • Canvas para gráficos
   • Validación nativa de formularios

CSS3:
   • Variables CSS (custom properties)
   • Flexbox y Grid
   • Media queries responsive
   • Gradientes y transiciones

JavaScript ES6+:
   • Eventos modernos
   • Arrow functions
   • Template literals
   • Sistema de tooltips personalizado

ESTRUCTURA DEL CÓDIGO
================================================================================

HTML:
   - Header simple con título y descripción
   - 5 secciones numeradas (pasos del proceso)
   - Canvas para visualizaciones
   - Footer con créditos

CSS:
   - Variables para colores y espaciado
   - Mobile-first approach
   - 4 breakpoints responsive
   - Optimizaciones táctiles

JavaScript:
   - Estado global con object literal
   - Algoritmos de modulación precisos
   - Sistema de tooltips (mouse + touch)
   - Renderizado optimizado en canvas

TIPS DE USO
================================================================================

PARA MEJORES RESULTADOS:
1. Usa secuencias de 8-12 bits para mejor visualización
2. Frecuencia 5 Hz es óptima para ver las ondas
3. Velocidad 2 bits/s muestra bien las transiciones
4. Explora todos los tipos de modulación

PARA APRENDER:
1. Empieza con ASK (la más simple)
2. Compara con FSK para ver diferencia de frecuencia
3. Prueba PSK para ver cambios de fase
4. Termina con QAM (la más compleja)

PARA PRESENTAR:
1. Usa pantalla completa
2. Genera secuencia aleatoria para variedad
3. Muestra los tooltips para explicar conceptos
4. Compara las 4 modulaciones con la misma secuencia

SOPORTE TÉCNICO
================================================================================

Si encuentras algún problema:
1. Verifica que los 3 archivos estén en la misma carpeta
2. Asegúrate de usar un navegador moderno actualizado
3. Limpia la caché del navegador (Ctrl+F5)
4. Prueba en modo incógnito

Problemas comunes:
- "No se ve nada": Revisa la consola (F12)
- "Los tooltips no funcionan": Actualiza el navegador
- "Se ve mal en móvil": Limpia caché y recarga

CRÉDITOS
================================================================================

Desarrolladores:
   • Héctor Lemis Pérez Matos
   • Amanda Vanessa Mengana López

Institución:
   • Instituto Superior Julio Antonio Mella

Tecnologías:
   • HTML5, CSS3, JavaScript
   • Canvas API 2D
   • Responsive Web Design

Asistencia de Desarrollo:
   • Claude (Anthropic AI)

LICENCIA
================================================================================

Este proyecto es de código abierto para fines educativos.
Libre uso para aprendizaje y enseñanza.

VERSIÓN
================================================================================

v2.0 - Febrero 2026
   • Rediseño completo desde cero
   • Interfaz simplificada
   • Sistema de tooltips
   • 100% responsive
   • Optimizado para móviles

v1.0 - Original
   • Versión inicial con problemas en móviles

================================================================================
FIN DEL DOCUMENTO
================================================================================
