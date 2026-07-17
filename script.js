let audioCtx = null;
let mainNoiseNode = null;
let motorToneNode = null;
let masterGainNode = null;

function initAudio() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGainNode.connect(audioCtx.destination);

    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    mainNoiseNode = audioCtx.createBufferSource();
    mainNoiseNode.buffer = noiseBuffer;
    mainNoiseNode.loop = true;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    mainNoiseNode.connect(noiseGain);
    noiseGain.connect(masterGainNode);
    mainNoiseNode.start();

    motorToneNode = audioCtx.createOscillator();
    motorToneNode.type = 'square'; 
    motorToneNode.frequency.setValueAtTime(120, audioCtx.currentTime);

    const toneGain = audioCtx.createGain();
    toneGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    motorToneNode.connect(toneGain);
    toneGain.connect(masterGainNode);
    motorToneNode.start();
}

function setAudioVolume(volume) {
    if (!masterGainNode) return;
    masterGainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.1);
}

const steps = [
    {
        badge: "Langkah 1: Konfigurasi",
        title: "Siapkan Pola Cetak & Cari Frekuensi AM",
        desc: "Buat sebuah dokumen baru di komputer yang berisi pola garis-garis vertikal hitam-putih pekat yang sangat padat. Selanjutnya, ambil unit Radio AM Anda, nyalakan dayanya, lalu geser jarum gelombang ke titik frekuensi kosong yang hanya berbunyi kresek-kresek, misalnya pada area 530 kHz.",
        action: () => {
            document.getElementById('radio-element').style.transform = 'translateX(0)';
            document.getElementById('wave-effect').classList.remove('animate-wave');
            setAudioVolume(0);
        }
    },
    {
        badge: "Langkah 2: Kalibrasi Posisi",
        title: "Rapatkan Jarak Perangkat ke Titik Radiasi",
        desc: "Letakkan radio AM fisik Anda sedekat mungkin hingga menempel dengan bodi penutup casing printer. Tempatkan secara presisi di dekat area letak papan sirkuit utama atau bagian dekat motor servo penarik kertas, karena dari situlah titik kebocoran fluks magnetik terbesar akan bersumber.",
        action: () => {
            document.getElementById('radio-element').style.transform = 'translateX(-70px)';
            document.getElementById('wave-effect').classList.remove('animate-wave');
            setAudioVolume(0.05);
        }
    },
    {
        badge: "Langkah 3: Eksekusi",
        title: "Mulai Cetak Dokumen & Deteksi Hasilnya",
        desc: "Tekan perintah Cetak pada komputer. Saat cartridge printer mulai bergerak menyentak bolak-balik dengan kecepatan tinggi, komponen internalnya memancarkan lonjakan tegangan liar. Gelombang interferensi elektromagnetik ini akan merambat bebas dan diubah oleh sirkuit radio AM menjadi suara dengungan mekanis yang seirama dengan ketukan cetak!",
        action: () => {
            document.getElementById('radio-element').style.transform = 'translateX(-70px)';
            document.getElementById('wave-effect').classList.add('animate-wave');
            setAudioVolume(0.4);
        }
    }
];

let activeIndex = 0;

function renderStep() {
    const data = steps[activeIndex];
    
    document.getElementById('step-badge').innerText = data.badge;
    document.getElementById('step-title').innerText = data.title;
    document.getElementById('step-desc').innerText = data.desc;
    document.getElementById('step-indicator').innerText = `${activeIndex + 1} / ${steps.length}`;

    document.getElementById('btn-prev').disabled = activeIndex === 0;
    document.getElementById('btn-next').disabled = activeIndex === steps.length - 1;

    data.action();
}

function changeStep(offset) {
    if (!audioCtx) {
        initAudio();
    } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    activeIndex += offset;
    if (activeIndex < 0) activeIndex = 0;
    if (activeIndex >= steps.length) activeIndex = steps.length - 1;
    
    renderStep();
}

window.addEventListener('DOMContentLoaded', () => {
    renderStep();
});

