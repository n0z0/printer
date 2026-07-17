const morseDictionary = {
    'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
    'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
    'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
    'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
    'Z': '--..',  ' ': '/'
};

let audioCtx = null;
let masterGain = null;

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
}

function playTone(duration, startTime) {
    if (!audioCtx) return;
    
    let osc = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    
    osc.type = 'square'; 
    osc.frequency.setValueAtTime(140, startTime); 
    
    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.setValueAtTime(0, startTime + duration - 0.02); 
    
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    masterGain.gain.setValueAtTime(1, audioCtx.currentTime);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
}

function generateVisualBlocks() {
    const input = document.getElementById('text-input').value.toUpperCase();
    const previewArea = document.getElementById('preview-area');
    previewArea.innerHTML = ''; 

    if(!input) return;

    for (let char of input) {
        if (morseDictionary[char]) {
            const code = morseDictionary[char];
            if (code === '/') {
                let space = document.createElement('div');
                space.className = 'morse-block block-space';
                previewArea.appendChild(space);
            } else {
                for (let symbol of code) {
                    let block = document.createElement('div');
                    block.className = `morse-block ${symbol === '.' ? 'block-dit' : 'block-dah'}`;
                    previewArea.appendChild(block);
                }
                let charGap = document.createElement('div');
                charGap.style.width = '6px';
                previewArea.appendChild(charGap);
            }
        }
    }
}

function startTransmission() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const input = document.getElementById('text-input').value.toUpperCase();
    const waveNode = document.getElementById('wave-node');
    const transmitBtn = document.getElementById('transmit-btn');
    
    transmitBtn.disabled = true;
    transmitBtn.innerText = "...";

    let timeOffset = audioCtx.currentTime + 0.1;
    const unitTime = 0.15; 

    for (let char of input) {
        if (morseDictionary[char]) {
            const code = morseDictionary[char];
            
            if (code === '/') {
                timeOffset += unitTime * 4; 
            } else {
                for (let symbol of code) {
                    let duration = symbol === '.' ? unitTime : unitTime * 3;
                    
                    playTone(duration, timeOffset);

                    setTimeout(() => {
                        waveNode.classList.add('active-wave');
                    }, (timeOffset - audioCtx.currentTime) * 1000);

                    setTimeout(() => {
                        waveNode.classList.remove('active-wave');
                    }, (timeOffset + duration - audioCtx.currentTime) * 1000);

                    timeOffset += duration + unitTime; 
                }
                timeOffset += unitTime * 2; 
            }
        }
    }

    setTimeout(() => {
        transmitBtn.disabled = false;
        transmitBtn.innerText = "Kirim";
    }, (timeOffset - audioCtx.currentTime) * 1000);
}

document.getElementById('text-input').addEventListener('input', generateVisualBlocks);
generateVisualBlocks();
            
