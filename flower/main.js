onload = async () => {
    document.body.classList.remove("container");

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }

    try {
        const response = await fetch("sound.mp3");
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = audioCtx.createGain();
        
        // 🌀 Mulai benar-benar dari volume 0
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        
        // 🎚️ Fade in sangat halus (0 → 1 selama 10 detik)
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 10);

        source.connect(gainNode).connect(audioCtx.destination);
        source.start(audioCtx.currentTime + 0.05); // tambahkan delay kecil biar fade mulai duluan

        // 🔁 Efek tempo makin cepat (opsional)
        let speed = 1.0;
        const interval = setInterval(() => {
            speed += 0.03;
            source.playbackRate.value = speed;
            if (speed >= 1.8) clearInterval(interval);
        }, 1000);

    } catch (error) {
        console.error("Gagal memutar suara:", error);
    }
};
