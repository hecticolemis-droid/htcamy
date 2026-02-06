// ========================================
// VARIABLES GLOBALES Y ESTADO
// ========================================

// Referencias a elementos del DOM
const binaryInput = document.getElementById('binaryInput');
const randomBtn = document.getElementById('randomBtn');
const amplitudeInput = document.getElementById('amplitudeInput');
const frequencyInput = document.getElementById('frequencyInput');
const bitRateInput = document.getElementById('bitRateInput');
const modulationBtns = document.querySelectorAll('.modulation-btn');

// Canvas
const timeDomainCanvas = document.getElementById('timeDomainCanvas');
const constellationCanvas = document.getElementById('constellationCanvas');
const timeCtx = timeDomainCanvas.getContext('2d');
const constellationCtx = constellationCanvas.getContext('2d');

// Displays de valores
const amplitudeValue = document.getElementById('amplitudeValue');
const frequencyValue = document.getElementById('frequencyValue');
const bitRateValue = document.getElementById('bitRateValue');

// Info panel
const infoNumBits = document.getElementById('infoNumBits');
const infoBitDuration = document.getElementById('infoBitDuration');
const infoSymbols = document.getElementById('infoSymbols');
const infoModulation = document.getElementById('infoModulation');

// Estado de la aplicación
let currentModulation = 'ask';
let amplitude = 5;
let frequency = 5;
let bitRate = 2;
let binarySequence = '10110010';

// ========================================
// INICIALIZACIÓN
// ========================================

function init() {
    setupEventListeners();
    setupCanvasResize();
    updateAllVisualizations();
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Botones de modulación
    modulationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modType = btn.getAttribute('data-modulation');
            setModulation(modType);
        });
        
        // Soporte para teclado
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    
    // Input binario
    binaryInput.addEventListener('input', (e) => {
        if (e.target.validity.valid) {
            binarySequence = e.target.value || '0';
            updateAllVisualizations();
        }
    });
    
    // Botón aleatorio
    randomBtn.addEventListener('click', generateRandomBinary);
    
    // Controles de parámetros
    amplitudeInput.addEventListener('input', (e) => {
        amplitude = parseFloat(e.target.value);
        amplitudeValue.textContent = amplitude;
        updateAllVisualizations();
    });
    
    frequencyInput.addEventListener('input', (e) => {
        frequency = parseInt(e.target.value);
        frequencyValue.textContent = frequency;
        updateAllVisualizations();
    });
    
    bitRateInput.addEventListener('input', (e) => {
        bitRate = parseInt(e.target.value);
        bitRateValue.textContent = bitRate;
        updateAllVisualizations();
    });
}

// ========================================
// FUNCIONES DE CONTROL
// ========================================

function setModulation(type) {
    currentModulation = type;
    
    // Actualizar UI de botones
    modulationBtns.forEach(btn => {
        const isActive = btn.getAttribute('data-modulation') === type;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });
    
    // Actualizar info
    infoModulation.textContent = type.toUpperCase();
    
    updateAllVisualizations();
}

function generateRandomBinary() {
    const length = Math.floor(Math.random() * 8) + 8; // 8-16 bits
    let binary = '';
    for (let i = 0; i < length; i++) {
        binary += Math.random() < 0.5 ? '0' : '1';
    }
    binaryInput.value = binary;
    binarySequence = binary;
    updateAllVisualizations();
}

function updateAllVisualizations() {
    updateInfoPanel();
    updateTimeDomainVisualization();
    updateConstellationVisualization();
}

function updateInfoPanel() {
    const numBits = binarySequence.length;
    const bitDuration = 1 / bitRate;
    const numSymbols = currentModulation === 'qam' ? Math.ceil(numBits / 2) : numBits;
    
    infoNumBits.textContent = numBits;
    infoBitDuration.textContent = bitDuration.toFixed(2) + ' s';
    infoSymbols.textContent = numSymbols;
}

// ========================================
// ALGORITMOS DE MODULACIÓN
// ========================================

function modulateASK(bit, t, bitDuration, fc) {
    const inBitPeriod = (t % bitDuration) / bitDuration < 1;
    if (!inBitPeriod) return 0;
    
    const A = bit === '1' ? amplitude : amplitude * 0.2;
    return A * Math.cos(2 * Math.PI * fc * t);
}

function modulateFSK(bit, t, bitDuration, fc) {
    const inBitPeriod = (t % bitDuration) / bitDuration < 1;
    if (!inBitPeriod) return 0;
    
    const f = bit === '1' ? fc * 2 : fc;
    return amplitude * Math.cos(2 * Math.PI * f * t);
}

function modulatePSK(bit, t, bitDuration, fc) {
    const inBitPeriod = (t % bitDuration) / bitDuration < 1;
    if (!inBitPeriod) return 0;
    
    const phase = bit === '1' ? Math.PI : 0;
    return amplitude * Math.cos(2 * Math.PI * fc * t + phase);
}

function modulateQAM(bits, t, bitDuration, fc) {
    // bits es un string de 2 bits: "00", "01", "10", "11"
    const inBitPeriod = (t % bitDuration) / bitDuration < 1;
    if (!inBitPeriod) return 0;
    
    // Mapeo Gray para 4-QAM
    let I, Q;
    switch(bits) {
        case '00': I = 1; Q = 1; break;
        case '01': I = -1; Q = 1; break;
        case '11': I = -1; Q = -1; break;
        case '10': I = 1; Q = -1; break;
        default: I = 0; Q = 0;
    }
    
    const normFactor = amplitude / Math.sqrt(2);
    return normFactor * I * Math.cos(2 * Math.PI * fc * t) - 
           normFactor * Q * Math.sin(2 * Math.PI * fc * t);
}

// ========================================
// VISUALIZACIÓN - DOMINIO TEMPORAL
// ========================================

function updateTimeDomainVisualization() {
    const width = timeDomainCanvas.width;
    const height = timeDomainCanvas.height;
    const padding = 60;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Limpiar canvas
    timeCtx.clearRect(0, 0, width, height);
    
    // Configuración de tiempo
    const bitDuration = 1 / bitRate;
    const totalDuration = binarySequence.length * bitDuration;
    const samplesPerBit = 100;
    const totalSamples = binarySequence.length * samplesPerBit;
    
    // Dibujar fondo de gráfica
    timeCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    timeCtx.fillRect(padding, padding, graphWidth, graphHeight);
    
    // Dibujar cuadrícula
    timeCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    timeCtx.lineWidth = 1;
    
    // Líneas verticales (tiempo)
    for (let i = 0; i <= binarySequence.length; i++) {
        const x = padding + (i / binarySequence.length) * graphWidth;
        timeCtx.beginPath();
        timeCtx.moveTo(x, padding);
        timeCtx.lineTo(x, height - padding);
        timeCtx.stroke();
    }
    
    // Líneas horizontales (amplitud)
    for (let i = 0; i <= 4; i++) {
        const y = padding + (i / 4) * graphHeight;
        timeCtx.beginPath();
        timeCtx.moveTo(padding, y);
        timeCtx.lineTo(width - padding, y);
        timeCtx.stroke();
    }
    
    // Eje central
    timeCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    timeCtx.lineWidth = 2;
    timeCtx.beginPath();
    timeCtx.moveTo(padding, height / 2);
    timeCtx.lineTo(width - padding, height / 2);
    timeCtx.stroke();
    
    // Dibujar señal digital original (cuadrada)
    timeCtx.strokeStyle = 'rgba(0, 255, 157, 0.5)';
    timeCtx.lineWidth = 2;
    timeCtx.beginPath();
    
    for (let i = 0; i < binarySequence.length; i++) {
        const bit = binarySequence[i];
        const x1 = padding + (i / binarySequence.length) * graphWidth;
        const x2 = padding + ((i + 1) / binarySequence.length) * graphWidth;
        const yHigh = padding + graphHeight * 0.25;
        const yLow = padding + graphHeight * 0.75;
        const y = bit === '1' ? yHigh : yLow;
        
        if (i === 0) {
            timeCtx.moveTo(x1, y);
        } else {
            const prevY = binarySequence[i-1] === '1' ? yHigh : yLow;
            timeCtx.lineTo(x1, prevY);
            timeCtx.lineTo(x1, y);
        }
        timeCtx.lineTo(x2, y);
    }
    timeCtx.stroke();
    
    // Dibujar señal modulada
    const signalColor = getModulationColor();
    timeCtx.strokeStyle = signalColor;
    timeCtx.lineWidth = 2.5;
    timeCtx.beginPath();
    
    let firstPoint = true;
    
    if (currentModulation === 'qam') {
        // Para QAM, procesar pares de bits
        for (let i = 0; i < binarySequence.length; i += 2) {
            const bits = binarySequence.substr(i, 2);
            const symbolDuration = bitDuration * 2;
            
            for (let s = 0; s < samplesPerBit * 2; s++) {
                const t = (i * bitDuration) + (s / (samplesPerBit * 2)) * symbolDuration;
                const signal = modulateQAM(bits, t, symbolDuration, frequency);
                
                const x = padding + (t / totalDuration) * graphWidth;
                const y = height / 2 - (signal / (amplitude * 1.5)) * (graphHeight / 2);
                
                if (firstPoint) {
                    timeCtx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    timeCtx.lineTo(x, y);
                }
            }
        }
    } else {
        // Para ASK, FSK, PSK
        for (let i = 0; i < totalSamples; i++) {
            const t = (i / totalSamples) * totalDuration;
            const bitIndex = Math.floor(t / bitDuration);
            const bit = binarySequence[bitIndex];
            
            let signal;
            switch(currentModulation) {
                case 'ask':
                    signal = modulateASK(bit, t - bitIndex * bitDuration, bitDuration, frequency);
                    break;
                case 'fsk':
                    signal = modulateFSK(bit, t - bitIndex * bitDuration, bitDuration, frequency);
                    break;
                case 'psk':
                    signal = modulatePSK(bit, t - bitIndex * bitDuration, bitDuration, frequency);
                    break;
            }
            
            const x = padding + (t / totalDuration) * graphWidth;
            const y = height / 2 - (signal / (amplitude * 1.2)) * (graphHeight / 2);
            
            if (firstPoint) {
                timeCtx.moveTo(x, y);
                firstPoint = false;
            } else {
                timeCtx.lineTo(x, y);
            }
        }
    }
    
    timeCtx.stroke();
    
    // Etiquetas y títulos
    timeCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    timeCtx.font = '14px sans-serif';
    timeCtx.textAlign = 'center';
    
    // Eje X
    timeCtx.fillText('Tiempo (s)', width / 2, height - 20);
    
    // Valores en eje X
    for (let i = 0; i <= binarySequence.length; i++) {
        const x = padding + (i / binarySequence.length) * graphWidth;
        const time = (i * bitDuration).toFixed(2);
        timeCtx.fillText(time, x, height - padding + 20);
    }
    
    // Eje Y
    timeCtx.save();
    timeCtx.translate(20, height / 2);
    timeCtx.rotate(-Math.PI / 2);
    timeCtx.fillText('Amplitud', 0, 0);
    timeCtx.restore();
    
    // Título de la modulación actual
    timeCtx.fillStyle = signalColor;
    timeCtx.font = 'bold 16px sans-serif';
    timeCtx.textAlign = 'left';
    timeCtx.fillText(`Modulación ${currentModulation.toUpperCase()}`, padding, padding - 10);
    
    // Leyenda
    timeCtx.font = '12px sans-serif';
    timeCtx.fillStyle = 'rgba(0, 255, 157, 0.7)';
    timeCtx.fillText('━ Señal Digital', width - padding - 120, padding + 20);
    timeCtx.fillStyle = signalColor;
    timeCtx.fillText('━ Señal Modulada', width - padding - 120, padding + 40);
}

// ========================================
// VISUALIZACIÓN - DIAGRAMA DE CONSTELACIÓN
// ========================================

function updateConstellationVisualization() {
    const width = constellationCanvas.width;
    const height = constellationCanvas.height;
    const padding = 40;
    const graphSize = Math.min(width, height) - 2 * padding;
    
    // Limpiar canvas
    constellationCtx.clearRect(0, 0, width, height);
    
    // Dibujar fondo de la gráfica
    constellationCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    constellationCtx.fillRect(
        (width - graphSize) / 2, 
        (height - graphSize) / 2, 
        graphSize, 
        graphSize
    );
    
    // Dibujar ejes
    constellationCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    constellationCtx.lineWidth = 1;
    
    // Eje X (Real / In-phase)
    constellationCtx.beginPath();
    constellationCtx.moveTo((width - graphSize) / 2, height / 2);
    constellationCtx.lineTo((width + graphSize) / 2, height / 2);
    constellationCtx.stroke();
    
    // Eje Y (Imaginario / Quadrature)
    constellationCtx.beginPath();
    constellationCtx.moveTo(width / 2, (height - graphSize) / 2);
    constellationCtx.lineTo(width / 2, (height + graphSize) / 2);
    constellationCtx.stroke();
    
    // Dibujar cuadrícula
    const gridLines = 4;
    for (let i = -gridLines; i <= gridLines; i++) {
        if (i === 0) continue;
        
        const offset = (i / gridLines) * (graphSize / 2);
        
        // Líneas verticales
        constellationCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        constellationCtx.beginPath();
        constellationCtx.moveTo(width / 2 + offset, (height - graphSize) / 2);
        constellationCtx.lineTo(width / 2 + offset, (height + graphSize) / 2);
        constellationCtx.stroke();
        
        // Líneas horizontales
        constellationCtx.beginPath();
        constellationCtx.moveTo((width - graphSize) / 2, height / 2 + offset);
        constellationCtx.lineTo((width + graphSize) / 2, height / 2 + offset);
        constellationCtx.stroke();
    }
    
    // Dibujar círculo de referencia para PSK
    if (currentModulation === 'psk' || currentModulation === 'qam') {
        constellationCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        constellationCtx.setLineDash([5, 5]);
        constellationCtx.beginPath();
        constellationCtx.arc(width / 2, height / 2, amplitude * 10, 0, 2 * Math.PI);
        constellationCtx.stroke();
        constellationCtx.setLineDash([]);
    }
    
    // Dibujar símbolos según el tipo de modulación
    switch(currentModulation) {
        case 'ask':
            drawASKConstellation();
            break;
        case 'fsk':
            drawFSKConstellation();
            break;
        case 'psk':
            drawPSKConstellation();
            break;
        case 'qam':
            drawQAMConstellation();
            break;
    }
    
    // Etiquetas de ejes
    constellationCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    constellationCtx.font = '14px sans-serif';
    constellationCtx.textAlign = 'center';
    constellationCtx.fillText('Componente Real (I)', width / 2, height - 10);
    
    constellationCtx.save();
    constellationCtx.translate(20, height / 2);
    constellationCtx.rotate(-Math.PI / 2);
    constellationCtx.fillText('Componente Imaginaria (Q)', 0, 0);
    constellationCtx.restore();
    
    // Título de la modulación actual
    const titleColor = getModulationColor();
    constellationCtx.fillStyle = titleColor;
    constellationCtx.font = 'bold 16px sans-serif';
    constellationCtx.textAlign = 'left';
    constellationCtx.fillText(
        `Diagrama de Constelación - ${currentModulation.toUpperCase()}`, 
        (width - graphSize) / 2, 
        (height - graphSize) / 2 - 10
    );
}

// ========================================
// DIBUJO DE CONSTELACIONES POR TIPO
// ========================================

function drawASKConstellation() {
    const width = constellationCanvas.width;
    const height = constellationCanvas.height;
    
    // Para ASK, los símbolos están sobre el eje real
    // Bit 0: amplitud baja
    // Bit 1: amplitud alta
    
    const amp0 = amplitude * 0.2 * 10; // Amplitud para bit 0
    const amp1 = amplitude * 10;        // Amplitud para bit 1
    
    // Símbolo para bit 0
    drawConstellationSymbol(width / 2 - amp0, height / 2, '0', '#ff6b6b');
    
    // Símbolo para bit 1
    drawConstellationSymbol(width / 2 + amp1, height / 2, '1', '#4ecdc4');
    
    // Dibujar vector desde el origen
    constellationCtx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
    constellationCtx.lineWidth = 2;
    constellationCtx.setLineDash([5, 5]);
    constellationCtx.beginPath();
    constellationCtx.moveTo(width / 2, height / 2);
    constellationCtx.lineTo(width / 2 - amp0, height / 2);
    constellationCtx.stroke();
    
    constellationCtx.strokeStyle = 'rgba(78, 205, 196, 0.5)';
    constellationCtx.beginPath();
    constellationCtx.moveTo(width / 2, height / 2);
    constellationCtx.lineTo(width / 2 + amp1, height / 2);
    constellationCtx.stroke();
    constellationCtx.setLineDash([]);
}

function drawFSKConstellation() {
    const width = constellationCanvas.width;
    const height = constellationCanvas.height;
    
    // FSK no tiene un diagrama de constelación estándar en I-Q
    // porque usa frecuencias diferentes, no fases/amplitudes
    constellationCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    constellationCtx.font = '16px sans-serif';
    constellationCtx.textAlign = 'center';
    constellationCtx.fillText(
        'FSK no tiene diagrama de constelación estándar', 
        width / 2, 
        height / 2 - 20
    );
    constellationCtx.fillText(
        'Se representa mejor en el dominio de la frecuencia', 
        width / 2, 
        height / 2 + 10
    );
    
    // Dibujar representación alternativa: dos puntos en diferentes "planos"
    constellationCtx.font = '14px sans-serif';
    constellationCtx.fillStyle = 'rgba(78, 205, 196, 0.7)';
    constellationCtx.fillText('f₀ (bit 0)', width / 2 - 100, height / 2 + 60);
    constellationCtx.fillRect(width / 2 - 110, height / 2 + 70, 30, 30);
    
    constellationCtx.fillStyle = 'rgba(255, 107, 107, 0.7)';
    constellationCtx.fillText('f₁ (bit 1)', width / 2 + 70, height / 2 + 60);
    constellationCtx.fillRect(width / 2 + 80, height / 2 + 70, 30, 30);
}

function drawPSKConstellation() {
    const width = constellationCanvas.width;
    const height = constellationCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = amplitude * 10;
    
    // BPSK: dos símbolos a 180° de diferencia
    // Bit 0: fase 0° (derecha)
    const angle0 = 0;
    const x0 = centerX + radius * Math.cos(angle0);
    const y0 = centerY - radius * Math.sin(angle0); // Y invertido en canvas
    drawConstellationSymbol(x0, y0, '0', '#ffd166');
    
    // Bit 1: fase 180° (izquierda)
    const angle1 = Math.PI;
    const x1 = centerX + radius * Math.cos(angle1);
    const y1 = centerY - radius * Math.sin(angle1);
    drawConstellationSymbol(x1, y1, '1', '#9d4edd');
    
    // Dibujar vectores
    constellationCtx.strokeStyle = 'rgba(255, 209, 102, 0.5)';
    constellationCtx.lineWidth = 2;
    constellationCtx.setLineDash([5, 5]);
    constellationCtx.beginPath();
    constellationCtx.moveTo(centerX, centerY);
    constellationCtx.lineTo(x0, y0);
    constellationCtx.stroke();
    
    constellationCtx.strokeStyle = 'rgba(157, 78, 237, 0.5)';
    constellationCtx.beginPath();
    constellationCtx.moveTo(centerX, centerY);
    constellationCtx.lineTo(x1, y1);
    constellationCtx.stroke();
    constellationCtx.setLineDash([]);
}

function drawQAMConstellation() {
    const width = constellationCanvas.width;
    const height = constellationCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = amplitude * 8;
    
    // 4-QAM: 4 símbolos en los cuadrantes
    // Usando mapeo Gray para minimizar errores
    // 00 -> (+1,+1), 01 -> (-1,+1), 11 -> (-1,-1), 10 -> (+1,-1)
    
    const symbols = [
        { bits: '00', x: centerX + distance, y: centerY - distance, color: '#ffd166' },
        { bits: '01', x: centerX - distance, y: centerY - distance, color: '#9d4edd' },
        { bits: '11', x: centerX - distance, y: centerY + distance, color: '#ff9e00' },
        { bits: '10', x: centerX + distance, y: centerY + distance, color: '#00ff9d' }
    ];
    
    symbols.forEach(sym => {
        drawConstellationSymbol(sym.x, sym.y, sym.bits, sym.color);
        
        // Dibujar vector desde el origen
        constellationCtx.strokeStyle = sym.color + '80'; // 50% opacity
        constellationCtx.lineWidth = 2;
        constellationCtx.setLineDash([5, 5]);
        constellationCtx.beginPath();
        constellationCtx.moveTo(centerX, centerY);
        constellationCtx.lineTo(sym.x, sym.y);
        constellationCtx.stroke();
    });
    
    constellationCtx.setLineDash([]);
    
    // Dibujar cuadrícula de decisión
    constellationCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    constellationCtx.lineWidth = 1;
    constellationCtx.setLineDash([3, 3]);
    
    // Línea vertical de decisión
    constellationCtx.beginPath();
    constellationCtx.moveTo(centerX, centerY - distance * 1.5);
    constellationCtx.lineTo(centerX, centerY + distance * 1.5);
    constellationCtx.stroke();
    
    // Línea horizontal de decisión
    constellationCtx.beginPath();
    constellationCtx.moveTo(centerX - distance * 1.5, centerY);
    constellationCtx.lineTo(centerX + distance * 1.5, centerY);
    constellationCtx.stroke();
    
    constellationCtx.setLineDash([]);
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function drawConstellationSymbol(x, y, label, color) {
    // Dibujar círculo del símbolo
    constellationCtx.beginPath();
    constellationCtx.arc(x, y, 8, 0, 2 * Math.PI);
    constellationCtx.fillStyle = color;
    constellationCtx.fill();
    constellationCtx.strokeStyle = 'white';
    constellationCtx.lineWidth = 2;
    constellationCtx.stroke();
    
    // Etiqueta del símbolo
    constellationCtx.fillStyle = 'white';
    constellationCtx.font = 'bold 12px sans-serif';
    constellationCtx.textAlign = 'center';
    constellationCtx.textBaseline = 'middle';
    constellationCtx.fillText(label, x, y);
    
    // Etiqueta adicional fuera del símbolo
    constellationCtx.font = '11px sans-serif';
    constellationCtx.fillStyle = color;
    constellationCtx.fillText(label, x, y - 20);
}

function getModulationColor() {
    const colors = {
        'ask': getComputedStyle(document.documentElement).getPropertyValue('--color-ask').trim(),
        'fsk': getComputedStyle(document.documentElement).getPropertyValue('--color-fsk').trim(),
        'psk': getComputedStyle(document.documentElement).getPropertyValue('--color-psk').trim(),
        'qam': getComputedStyle(document.documentElement).getPropertyValue('--color-qam').trim()
    };
    return colors[currentModulation] || '#0066ff';
}

// ========================================
// CONFIGURACIÓN DE CANVAS RESPONSIVO
// ========================================

function setupCanvasResize() {
    function resizeCanvas() {
        const containerWidth = timeDomainCanvas.parentElement.clientWidth;
        const containerHeight = timeDomainCanvas.parentElement.clientHeight;
        
        // Ajustar tamaño de canvas manteniendo relación de aspecto
        timeDomainCanvas.width = containerWidth;
        timeDomainCanvas.height = Math.max(400, containerHeight);
        
        constellationCanvas.width = containerWidth;
        constellationCanvas.height = Math.max(400, containerHeight);
        
        // Volver a dibujar
        updateAllVisualizations();
    }
    
    // Redimensionar inicialmente y al cambiar el tamaño de la ventana
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// ========================================
// INICIAR APLICACIÓN
// ========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);