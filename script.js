// ===================================
// VARIABLES GLOBALES
// ===================================
let state = {
    modulation: 'ask',
    binary: '10110010',
    amplitude: 5,
    frequency: 5,
    bitrate: 2
};

// Referencias DOM
const elements = {
    binaryInput: document.getElementById('binaryInput'),
    randomBtn: document.getElementById('randomBtn'),
    amplitude: document.getElementById('amplitude'),
    frequency: document.getElementById('frequency'),
    bitrate: document.getElementById('bitrate'),
    ampValue: document.getElementById('ampValue'),
    freqValue: document.getElementById('freqValue'),
    speedValue: document.getElementById('speedValue'),
    timeCanvas: document.getElementById('timeCanvas'),
    constellationCanvas: document.getElementById('constellationCanvas'),
    infoBits: document.getElementById('infoBits'),
    infoDuration: document.getElementById('infoDuration'),
    infoType: document.getElementById('infoType'),
    modButtons: document.querySelectorAll('.mod-btn'),
    floatingTooltip: document.getElementById('floatingTooltip')
};

// Contextos de canvas
let timeCtx, consCtx;

// ===================================
// INICIALIZACIÓN
// ===================================
function init() {
    // Configurar canvas
    setupCanvas();
    
    // Event listeners
    setupEventListeners();
    
    // Tooltips
    setupTooltips();
    
    // Dibujar inicial
    updateAll();
}

function setupCanvas() {
    // Canvas de tiempo
    const timeCanvas = elements.timeCanvas;
    timeCanvas.width = timeCanvas.offsetWidth * 2;
    timeCanvas.height = 400;
    timeCtx = timeCanvas.getContext('2d');
    
    // Canvas de constelación
    const consCanvas = elements.constellationCanvas;
    consCanvas.width = consCanvas.offsetWidth * 2;
    consCanvas.height = 400;
    consCtx = consCanvas.getContext('2d');
    
    // Redimensionar en resize
    window.addEventListener('resize', () => {
        const timeWidth = timeCanvas.offsetWidth * 2;
        const consWidth = consCanvas.offsetWidth * 2;
        
        timeCanvas.width = timeWidth;
        consCanvas.width = consWidth;
        
        updateAll();
    });
}

function setupEventListeners() {
    // Entrada binaria
    elements.binaryInput.addEventListener('input', (e) => {
        const value = e.target.value.replace(/[^01]/g, '');
        e.target.value = value;
        if (value.length > 0) {
            state.binary = value;
            updateAll();
        }
    });
    
    // Botón aleatorio
    elements.randomBtn.addEventListener('click', () => {
        const length = Math.floor(Math.random() * 8) + 8;
        let binary = '';
        for (let i = 0; i < length; i++) {
            binary += Math.random() < 0.5 ? '0' : '1';
        }
        elements.binaryInput.value = binary;
        state.binary = binary;
        updateAll();
    });
    
    // Botones de modulación
    elements.modButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mod = btn.dataset.mod;
            state.modulation = mod;
            
            // Actualizar UI
            elements.modButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            updateAll();
        });
    });
    
    // Sliders
    elements.amplitude.addEventListener('input', (e) => {
        state.amplitude = parseFloat(e.target.value);
        elements.ampValue.textContent = state.amplitude;
        updateAll();
    });
    
    elements.frequency.addEventListener('input', (e) => {
        state.frequency = parseInt(e.target.value);
        elements.freqValue.textContent = state.frequency;
        updateAll();
    });
    
    elements.bitrate.addEventListener('input', (e) => {
        state.bitrate = parseInt(e.target.value);
        elements.speedValue.textContent = state.bitrate;
        updateAll();
    });
}

// ===================================
// SISTEMA DE TOOLTIPS
// ===================================
function setupTooltips() {
    const tooltip = elements.floatingTooltip;
    let currentTarget = null;
    
    // Para elementos con atributo data-tip
    document.querySelectorAll('[data-tip]').forEach(element => {
        // Hover en desktop
        element.addEventListener('mouseenter', (e) => {
            showTooltip(e.target, e.target.dataset.tip);
        });
        
        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        element.addEventListener('mousemove', (e) => {
            positionTooltip(e);
        });
        
        // Touch en móvil
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (currentTarget === element) {
                hideTooltip();
                currentTarget = null;
            } else {
                showTooltip(element, element.dataset.tip);
                positionTooltip(e.touches[0]);
                currentTarget = element;
            }
        });
    });
    
    // Cerrar tooltip al tocar fuera
    document.addEventListener('touchstart', (e) => {
        if (!e.target.hasAttribute('data-tip')) {
            hideTooltip();
            currentTarget = null;
        }
    });
    
    function showTooltip(target, text) {
        tooltip.textContent = text;
        tooltip.classList.add('show');
    }
    
    function hideTooltip() {
        tooltip.classList.remove('show');
    }
    
    function positionTooltip(e) {
        const x = e.clientX || e.pageX;
        const y = e.clientY || e.pageY;
        
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let left = x + 15;
        let top = y + 15;
        
        // Ajustar si se sale por la derecha
        if (left + tooltipWidth > windowWidth - 20) {
            left = x - tooltipWidth - 15;
        }
        
        // Ajustar si se sale por abajo
        if (top + tooltipHeight > windowHeight - 20) {
            top = y - tooltipHeight - 15;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
}

// ===================================
// ACTUALIZACIÓN GENERAL
// ===================================
function updateAll() {
    updateInfo();
    drawTimeSignal();
    drawConstellation();
}

function updateInfo() {
    elements.infoBits.textContent = state.binary.length;
    const duration = state.binary.length / state.bitrate;
    elements.infoDuration.textContent = duration.toFixed(1) + ' s';
    elements.infoType.textContent = state.modulation.toUpperCase();
}

// ===================================
// ALGORITMOS DE MODULACIÓN
// ===================================
function modulateSignal(bit, t, bitDuration) {
    const fc = state.frequency;
    const A = state.amplitude;
    
    switch(state.modulation) {
        case 'ask':
            const ampASK = bit === '1' ? A : A * 0.2;
            return ampASK * Math.cos(2 * Math.PI * fc * t);
            
        case 'fsk':
            const freq = bit === '1' ? fc * 2 : fc;
            return A * Math.cos(2 * Math.PI * freq * t);
            
        case 'psk':
            const phase = bit === '1' ? Math.PI : 0;
            return A * Math.cos(2 * Math.PI * fc * t + phase);
            
        case 'qam':
            // Para QAM, necesitamos 2 bits
            return 0; // Se maneja especialmente en drawTimeSignal
    }
}

function modulateQAM(bits, t) {
    const fc = state.frequency;
    const A = state.amplitude / Math.sqrt(2);
    
    let I, Q;
    switch(bits) {
        case '00': I = 1; Q = 1; break;
        case '01': I = -1; Q = 1; break;
        case '11': I = -1; Q = -1; break;
        case '10': I = 1; Q = -1; break;
        default: I = 0; Q = 0;
    }
    
    return A * I * Math.cos(2 * Math.PI * fc * t) - A * Q * Math.sin(2 * Math.PI * fc * t);
}

// ===================================
// DIBUJO - SEÑAL EN TIEMPO
// ===================================
function drawTimeSignal() {
    const canvas = elements.timeCanvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    
    // Limpiar
    timeCtx.clearRect(0, 0, width, height);
    
    // Configuración
    const bitDuration = 1 / state.bitrate;
    const totalDuration = state.binary.length * bitDuration;
    const samplesPerBit = 100;
    
    // Fondo
    timeCtx.fillStyle = '#0a0e1a';
    timeCtx.fillRect(0, 0, width, height);
    
    // Cuadrícula
    drawGrid(timeCtx, width, height, padding);
    
    // Eje central
    timeCtx.strokeStyle = '#475569';
    timeCtx.lineWidth = 2;
    timeCtx.beginPath();
    timeCtx.moveTo(padding, height / 2);
    timeCtx.lineTo(width - padding, height / 2);
    timeCtx.stroke();
    
    // Señal digital (rectangular)
    drawDigitalSignal(timeCtx, width, height, padding, bitDuration);
    
    // Señal modulada
    drawModulatedSignal(timeCtx, width, height, padding, bitDuration, totalDuration, samplesPerBit);
    
    // Etiquetas
    drawLabels(timeCtx, width, height, padding, totalDuration, bitDuration);
}

function drawGrid(ctx, width, height, padding) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    // Líneas verticales
    for (let i = 0; i <= state.binary.length; i++) {
        const x = padding + (i / state.binary.length) * (width - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    // Líneas horizontales
    for (let i = 0; i <= 4; i++) {
        const y = padding + (i / 4) * (height - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
}

function drawDigitalSignal(ctx, width, height, padding, bitDuration) {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    const graphHeight = height - 2 * padding;
    const graphWidth = width - 2 * padding;
    
    for (let i = 0; i < state.binary.length; i++) {
        const bit = state.binary[i];
        const x1 = padding + (i / state.binary.length) * graphWidth;
        const x2 = padding + ((i + 1) / state.binary.length) * graphWidth;
        const y = bit === '1' ? padding + graphHeight * 0.2 : padding + graphHeight * 0.8;
        
        if (i === 0) {
            ctx.moveTo(x1, y);
        } else {
            const prevBit = state.binary[i - 1];
            const prevY = prevBit === '1' ? padding + graphHeight * 0.2 : padding + graphHeight * 0.8;
            ctx.lineTo(x1, prevY);
            ctx.lineTo(x1, y);
        }
        ctx.lineTo(x2, y);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawModulatedSignal(ctx, width, height, padding, bitDuration, totalDuration, samplesPerBit) {
    // Color según modulación
    const colors = {
        'ask': '#ec4899',
        'fsk': '#06b6d4',
        'psk': '#f59e0b',
        'qam': '#8b5cf6'
    };
    
    ctx.strokeStyle = colors[state.modulation];
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    
    const graphHeight = height - 2 * padding;
    const graphWidth = width - 2 * padding;
    let firstPoint = true;
    
    if (state.modulation === 'qam') {
        // QAM procesa pares de bits
        for (let i = 0; i < state.binary.length; i += 2) {
            const bits = state.binary.substr(i, 2).padEnd(2, '0');
            const symbolDuration = bitDuration * 2;
            
            for (let s = 0; s < samplesPerBit * 2; s++) {
                const localT = (s / (samplesPerBit * 2)) * symbolDuration;
                const signal = modulateQAM(bits, localT);
                const t = (i * bitDuration) + localT;
                
                const x = padding + (t / totalDuration) * graphWidth;
                const y = height / 2 - (signal / (state.amplitude * 1.5)) * (graphHeight / 2);
                
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
    } else {
        // ASK, FSK, PSK
        const totalSamples = state.binary.length * samplesPerBit;
        
        for (let i = 0; i < totalSamples; i++) {
            const t = (i / totalSamples) * totalDuration;
            const bitIndex = Math.floor(t / bitDuration);
            const bit = state.binary[bitIndex];
            const localT = t - bitIndex * bitDuration;
            
            const signal = modulateSignal(bit, localT, bitDuration);
            
            const x = padding + (t / totalDuration) * graphWidth;
            const y = height / 2 - (signal / (state.amplitude * 1.2)) * (graphHeight / 2);
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
    }
    
    ctx.stroke();
}

function drawLabels(ctx, width, height, padding, totalDuration, bitDuration) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    
    // Eje X
    ctx.fillText('Tiempo (segundos)', width / 2, height - 20);
    
    // Valores del eje X
    for (let i = 0; i <= state.binary.length; i++) {
        const x = padding + (i / state.binary.length) * (width - 2 * padding);
        const time = (i * bitDuration).toFixed(1);
        ctx.fillText(time, x, height - padding + 25);
    }
    
    // Eje Y
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Amplitud (V)', 0, 0);
    ctx.restore();
}

// ===================================
// DIBUJO - CONSTELACIÓN
// ===================================
function drawConstellation() {
    const canvas = elements.constellationCanvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    
    // Limpiar
    consCtx.clearRect(0, 0, width, height);
    
    // Fondo
    consCtx.fillStyle = '#0a0e1a';
    consCtx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const graphSize = Math.min(width, height) - 2 * padding;
    
    // Cuadrícula
    drawConstellationGrid(consCtx, centerX, centerY, graphSize);
    
    // Ejes
    consCtx.strokeStyle = '#475569';
    consCtx.lineWidth = 2;
    
    // Eje I (horizontal)
    consCtx.beginPath();
    consCtx.moveTo(centerX - graphSize / 2, centerY);
    consCtx.lineTo(centerX + graphSize / 2, centerY);
    consCtx.stroke();
    
    // Eje Q (vertical)
    consCtx.beginPath();
    consCtx.moveTo(centerX, centerY - graphSize / 2);
    consCtx.lineTo(centerX, centerY + graphSize / 2);
    consCtx.stroke();
    
    // Dibujar símbolos según tipo
    switch(state.modulation) {
        case 'ask':
            drawASKSymbols(consCtx, centerX, centerY);
            break;
        case 'fsk':
            drawFSKMessage(consCtx, centerX, centerY);
            break;
        case 'psk':
            drawPSKSymbols(consCtx, centerX, centerY);
            break;
        case 'qam':
            drawQAMSymbols(consCtx, centerX, centerY);
            break;
    }
    
    // Etiquetas
    drawConstellationLabels(consCtx, width, height);
}

function drawConstellationGrid(ctx, centerX, centerY, size) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        
        const offset = (i / 4) * size;
        
        // Verticales
        ctx.beginPath();
        ctx.moveTo(centerX + offset, centerY - size / 2);
        ctx.lineTo(centerX + offset, centerY + size / 2);
        ctx.stroke();
        
        // Horizontales
        ctx.beginPath();
        ctx.moveTo(centerX - size / 2, centerY + offset);
        ctx.lineTo(centerX + size / 2, centerY + offset);
        ctx.stroke();
    }
}

function drawASKSymbols(ctx, cx, cy) {
    const scale = state.amplitude * 10;
    
    drawSymbol(ctx, cx - scale, cy, '0', '#ec4899');
    drawSymbol(ctx, cx + scale, cy, '1', '#06b6d4');
    
    // Vectores
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - scale, cy);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + scale, cy);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawFSKMessage(ctx, cx, cy) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FSK no usa diagrama I-Q', cx, cy - 20);
    ctx.fillText('Se representa en dominio de frecuencia', cx, cy + 10);
}

function drawPSKSymbols(ctx, cx, cy) {
    const radius = state.amplitude * 10;
    
    // Círculo de referencia
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Símbolos
    drawSymbol(ctx, cx + radius, cy, '0', '#f59e0b');
    drawSymbol(ctx, cx - radius, cy, '1', '#8b5cf6');
    
    // Vectores
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - radius, cy);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawQAMSymbols(ctx, cx, cy) {
    const dist = state.amplitude * 8;
    
    // Círculo de referencia
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, dist * Math.sqrt(2), 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Líneas de decisión
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - dist * 1.5);
    ctx.lineTo(cx, cy + dist * 1.5);
    ctx.moveTo(cx - dist * 1.5, cy);
    ctx.lineTo(cx + dist * 1.5, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Símbolos
    const symbols = [
        { bits: '00', x: cx + dist, y: cy - dist, color: '#f59e0b' },
        { bits: '01', x: cx - dist, y: cy - dist, color: '#8b5cf6' },
        { bits: '11', x: cx - dist, y: cy + dist, color: '#ec4899' },
        { bits: '10', x: cx + dist, y: cy + dist, color: '#10b981' }
    ];
    
    symbols.forEach(sym => {
        drawSymbol(ctx, sym.x, sym.y, sym.bits, sym.color);
        
        // Vector
        ctx.strokeStyle = sym.color + '80';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sym.x, sym.y);
        ctx.stroke();
    });
    
    ctx.setLineDash([]);
}

function drawSymbol(ctx, x, y, label, color) {
    // Círculo
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
}

function drawConstellationLabels(ctx, width, height) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    
    ctx.fillText('I (En Fase)', width / 2, height - 20);
    
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Q (Cuadratura)', 0, 0);
    ctx.restore();
}

// ===================================
// INICIAR
// ===================================
document.addEventListener('DOMContentLoaded', init);
