import React, { useEffect, useState } from 'react';

function App() {
  const [location, setLocation] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');

  const icons = ['🦴', '🪨', '🔥', '🐾', '🪓'];

  const speakLaws = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const voices = synth.getVoices();
    const cavemanVoice =
      voices.find(v => /male|english/i.test(v.name) && v.lang.startsWith('en')) || voices[0];

    const lines = text.split('\n').filter(line => line.trim() !== '');

    lines.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = line;
      utterance.voice = cavemanVoice;
      utterance.rate = 1.25;
      utterance.pitch = 0.7;
      utterance.volume = 1;

      setTimeout(() => {
        synth.speak(utterance);
      }, index * 1800);
    });
  };

  const getLaws = async () => {
    if (!location) {
      alert("Please enter a location!");
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://3.149.228.61:8000/get-laws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location }),
      });

      const data = await res.json();
      const explanation = data.explanation || 'No laws found for that location.';
      setResponse(explanation);
      setLastSpoken(explanation);
      speakLaws(explanation);
    } catch (error) {
      setResponse('Error fetching laws. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      {/* 🔊 Background fire crackling audio */}
      <audio src="/assets/fire-crackle.mp3" autoPlay loop hidden />

      <div className="flex flex-col items-center justify-center pt-32 px-6">
        {/* 🦖 DinoLaw Title */}
        <h1 className="text-4xl font-bold mb-4 flicker text-yellow-400 drop-shadow">
        🦖 DinoLaws - must-know that even a Caveman can understand!
        </h1>

        <input
          type="text"
          className="p-3 rounded text-black max-w-md w-full mb-4"
          placeholder="(e.g. UMD, Hogwarts, wherever...)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={getLaws}
          className="bg-red-700 hover:bg-red-800 px-6 py-3 text-lg rounded font-bold mb-2"
          disabled={loading}
        >
          {loading ? 'Hunting for laws and Gathering jokes...' : 'Tell where u at, UGH!'}
        </button>

        {/* 🔁 Read Again Button */}
        {lastSpoken && (
          <button
            onClick={() => speakLaws(lastSpoken)}
            className="bg-yellow-700 hover:bg-yellow-800 px-4 py-2 text-sm rounded font-bold mb-6"
          >
            🔊 Read Again!
          </button>
        )}

        {/* 📜 Scroll Output */}
        <div id="law-scroll" className={`flicker ${response ? 'visible' : ''}`}>
          {response &&
            response
              .split('\n')
              .filter(line => line.trim() !== '')
              .map((line, index) => (
                <div key={index} className="mb-2">
                  {icons[index % icons.length]} {line}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default App;
