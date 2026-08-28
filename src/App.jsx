// import { useMemo, useRef, useState } from 'react'

// const languages = ['Arabic', 'Urdu', 'Spanish', 'French']
// const startingSegments = [
//   { id: 1, start: 0, end: 1, time: '00:00:00.000 – 00:00:01.000', speaker: 'Aisha Rahman', source: 'Welcome to ClearVoice Studio.', protected: 'ClearVoice Studio', status: 'approved', confidence: 98, translations: { Arabic: 'مرحبًا بكم في استوديو ClearVoice.', Urdu: 'ClearVoice اسٹوڈیو میں خوش آمدید۔', Spanish: 'Bienvenidos a ClearVoice Studio.', French: 'Bienvenue chez ClearVoice Studio.' } },
//   { id: 2, start: 1, end: 2, time: '00:00:01.000 – 00:00:02.000', speaker: 'Aisha Rahman', source: 'Today, we are introducing the NexusCore platform.', protected: 'NexusCore', status: 'review', confidence: 84, translations: { Arabic: 'اليوم، نقدم منصة NexusCore.', Urdu: 'آج، ہم NexusCore پلیٹ فارم متعارف کروا رہے ہیں۔', Spanish: 'Hoy presentamos la plataforma NexusCore.', French: 'Aujourd’hui, nous présentons la plateforme NexusCore.' } },
//   { id: 3, start: 2, end: 3, time: '00:00:02.000 – 00:00:03.000', speaker: 'Aisha Rahman', source: 'As our founder says, “Trust is built in every detail.”', protected: 'Exact quote', status: 'review', confidence: 81, translations: { Arabic: 'وكما يقول مؤسسنا: «تُبنى الثقة في كل تفصيل».', Urdu: 'جیسا کہ ہمارے بانی کہتے ہیں: ”اعتماد ہر تفصیل میں بنتا ہے۔“', Spanish: 'Como dice nuestro fundador: «La confianza se construye en cada detalle».', French: 'Comme le dit notre fondateur : « La confiance se construit dans chaque détail. »' } },
//   { id: 4, start: 3, end: 4, time: '00:00:03.000 – 00:00:04.000', speaker: 'Aisha Rahman', source: 'The platform supports teams in more than 30 countries.', protected: '', status: 'approved', confidence: 95, translations: { Arabic: 'تدعم المنصة الفرق في أكثر من 30 دولة.', Urdu: 'یہ پلیٹ فارم 30 سے زائد ممالک میں ٹیموں کی مدد کرتا ہے۔', Spanish: 'La plataforma ayuda a equipos de más de 30 países.', French: 'La plateforme accompagne des équipes dans plus de 30 pays.' } },
//   { id: 5, start: 4, end: 6, time: '00:00:04.000 – 00:00:06.000', speaker: 'Aisha Rahman', source: 'Thank you for joining us today.', protected: '', status: 'draft', confidence: 92, translations: { Arabic: 'شكرًا لانضمامكم إلينا اليوم.', Urdu: 'آج ہمارے ساتھ شامل ہونے کا شکریہ۔', Spanish: 'Gracias por acompañarnos hoy.', French: 'Merci de vous joindre à nous aujourd’hui.' } }
// ]
// const styles = { approved: 'bg-emerald-50 text-emerald-700', review: 'bg-amber-50 text-amber-700', draft: 'bg-violet-50 text-violet-700' }
// const label = status => status === 'review' ? 'Needs review' : status[0].toUpperCase() + status.slice(1)

// export default function App() {
//   const [segments, setSegments] = useState(startingSegments), [language, setLanguage] = useState('Arabic'), [selectedId, setSelectedId] = useState(1), [query, setQuery] = useState(''), [playing, setPlaying] = useState(false), [notice, setNotice] = useState(''), [currentTime, setCurrentTime] = useState(0)
//   const videoRef = useRef(null)
//   const selected = segments.find(item => item.id === selectedId) || segments[0]
//   const approved = useMemo(() => segments.filter(item => item.status === 'approved').length, [segments])
//   const shown = segments.filter(item => `${item.source} ${item.translations[language]}`.toLowerCase().includes(query.toLowerCase()))
//   const canPublish = approved === segments.length
//   const toggleVideo = () => { const video = videoRef.current; if (!video) return; playing ? video.pause() : video.play() }
//   const syncSubtitle = event => { const seconds = event.currentTarget.currentTime; setCurrentTime(seconds); const active = segments.find(item => seconds >= item.start && seconds < item.end); if (active) setSelectedId(active.id) }
//   const approve = id => setSegments(items => items.map(item => item.id === id ? { ...item, status: 'approved' } : item))
//   const updateTranslation = (id, text) => setSegments(items => items.map(item => item.id === id ? { ...item, translations: { ...item.translations, [language]: text } } : item))
//   const exportSrt = () => { if (!canPublish) return; const srt = segments.map((item, i) => `${i + 1}\n${item.time.replaceAll('.', ',').replace(' – ', ' --> ')}\n${item.translations[language]}\n`).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([srt], { type: 'text/plain' })); link.download = `clearvoice-${language.toLowerCase()}.srt`; link.click(); setNotice('Approved SRT file downloaded.') }
//   return <div className="min-h-screen"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8"><div><p className="text-xs font-bold tracking-[.16em] text-violet-600">CLEARVOICE · RECORDED TALK</p><h1 className="mt-1 text-xl font-bold">Building trust across borders <span className="ml-2 rounded-full bg-violet-100 px-2 py-1 text-xs text-violet-700">{canPublish ? 'Ready to publish' : 'In human review'}</span></h1></div><button disabled={!canPublish} onClick={exportSrt} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{canPublish ? 'Publish subtitles' : `Publish blocked · ${segments.length - approved} reviews left`}</button></div></header>
//     <main className="mx-auto grid max-w-7xl gap-6 p-5 lg:grid-cols-[1fr_300px] lg:p-8"><section><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{languages.map(item => <button key={item} onClick={() => setLanguage(item)} className={`rounded-lg px-3 py-2 text-sm font-bold ${language === item ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50'}`}>{item}</button>)}</div><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search subtitles" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500" /></div>
//       <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><b>Human approval required.</b> Nothing is published until every AI translation is checked by a ClearVoice reviewer.</div>
//       <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="relative h-60 overflow-hidden bg-slate-900"><video ref={videoRef} loop playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={syncSubtitle} className="h-full w-full object-cover" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" /><p className="absolute left-5 top-5 font-semibold text-white drop-shadow">ClearVoice Talks · looping demo</p><button onClick={toggleVideo} className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-lg text-violet-700 shadow">{playing ? 'Ⅱ' : '▶'}</button><p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded bg-slate-950/80 px-3 py-2 text-center text-sm font-medium text-white">{selected.translations[language]}</p></div><div className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-500"><span>{currentTime.toFixed(1)}s</span><input type="range" min="0" max="6" step="0.1" value={Math.min(currentTime, 6)} onChange={event => { videoRef.current.currentTime = Number(event.target.value); setCurrentTime(Number(event.target.value)) }} className="w-full accent-violet-600" /><span>loops</span></div></section>
//       <div className="mt-6 flex justify-between"><p className="text-sm text-slate-500">{segments.length} subtitle segments</p><button onClick={() => setSegments(items => items.map(item => ({ ...item, status: 'approved' })))} className="text-sm font-bold text-emerald-700">✓ Mark all human-reviewed</button></div><div className="mt-3 space-y-2">{shown.map(item => <article key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm ${item.id === selectedId ? 'border-violet-400 ring-2 ring-violet-100' : 'border-slate-200'}`}><div className="grid gap-4 md:grid-cols-[125px_1fr_1fr_105px]"><div className="text-xs text-slate-500"><b className="mb-1 block text-slate-700">{item.speaker}</b>{item.time}</div><div><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Original {item.protected && '· protected'}</p><p className="text-sm leading-6">{item.source}</p></div><div><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{language} · AI first pass</p><textarea value={item.translations[language]} onClick={e => e.stopPropagation()} onChange={e => updateTranslation(item.id, e.target.value)} className="h-14 w-full resize-none rounded border border-slate-200 p-2 text-sm outline-none focus:border-violet-500" /></div><div className="flex items-center justify-end"><button onClick={e => { e.stopPropagation(); approve(item.id) }} className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[item.status]}`}>{label(item.status)}</button></div></div></article>)}</div></section>
//       <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-base font-bold">Review details</h2><div className="mt-5 rounded-lg bg-violet-50 p-4"><div className="flex justify-between text-sm"><span>Human review progress</span><b className="text-violet-700">{Math.round(approved / segments.length * 100)}%</b></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100"><div className="h-full bg-violet-600" style={{ width: `${approved / segments.length * 100}%` }} /></div><p className="mt-3 text-xs text-slate-600"><b>{approved}</b> approved · <b>{segments.filter(item => item.status === 'review').length}</b> need review</p></div><Info title="Speaker" value={selected.speaker} /><Info title="Timing" value={selected.time} /><Info title="AI confidence" value={`${selected.confidence}%`} /><div className="mt-5 border-t pt-5"><div className="flex justify-between"><h3 className="text-sm font-bold">Protected content</h3><span className={`rounded-full px-2 py-1 text-xs font-bold ${selected.protected ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{selected.protected ? 'Check required' : 'Clear'}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{selected.protected ? `Confirm this is preserved accurately: ${selected.protected}` : 'No product name or direct quote was detected.'}</p></div>{notice && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}</aside></main></div>
// }
// function Info({ title, value }) { return <div className="mt-5 border-t pt-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p><p className="mt-1 text-sm font-medium text-slate-700">{value}</p></div> }
import { useMemo, useRef, useState } from "react";

const languages = ["Arabic", "Urdu", "Spanish", "French"];
const voiceLanguages = [
  { label: "Auto detect", value: "" },
  { label: "English", value: "en" },
  { label: "Urdu", value: "ur" },
  { label: "Arabic", value: "ar" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
];

const startingSegments = [
  {
    id: 1,
    start: 0,
    end: 1,
    time: "00:00:00.000 – 00:00:01.000",
    speaker: "Aisha Rahman",
    source: "Welcome to ClearVoice Studio.",
    protected: "ClearVoice Studio",
    status: "approved",
    confidence: 98,
    translations: {
      Arabic: "مرحبًا بكم في استوديو ClearVoice.",
      Urdu: "ClearVoice اسٹوڈیو میں خوش آمدید۔",
      Spanish: "Bienvenidos a ClearVoice Studio.",
      French: "Bienvenue chez ClearVoice Studio.",
    },
  },
  {
    id: 2,
    start: 1,
    end: 2,
    time: "00:00:01.000 – 00:00:02.000",
    speaker: "Aisha Rahman",
    source: "Today, we are introducing the NexusCore platform.",
    protected: "NexusCore",
    status: "review",
    confidence: 84,
    translations: {
      Arabic: "اليوم، نقدم منصة NexusCore.",
      Urdu: "آج، ہم NexusCore پلیٹ فارم متعارف کروا رہے ہیں۔",
      Spanish: "Hoy presentamos la plataforma NexusCore.",
      French: "Aujourd’hui, nous présentons la plateforme NexusCore.",
    },
  },
  {
    id: 3,
    start: 2,
    end: 3,
    time: "00:00:02.000 – 00:00:03.000",
    speaker: "Aisha Rahman",
    source: "As our founder says, “Trust is built in every detail.”",
    protected: "Exact quote",
    status: "review",
    confidence: 81,
    translations: {
      Arabic: "وكما يقول مؤسسنا: «تُبنى الثقة في كل تفصيل».",
      Urdu: "جیسا کہ ہمارے بانی کہتے ہیں: ”اعتماد ہر تفصیل میں بنتا ہے۔“",
      Spanish:
        "Como dice nuestro fundador: «La confianza se construye en cada detalle».",
      French:
        "Comme le dit notre fondateur : « La confiance se construit dans chaque détail. »",
    },
  },
  {
    id: 4,
    start: 3,
    end: 4,
    time: "00:00:03.000 – 00:00:04.000",
    speaker: "Aisha Rahman",
    source: "The platform supports teams in more than 30 countries.",
    protected: "",
    status: "approved",
    confidence: 95,
    translations: {
      Arabic: "تدعم المنصة الفرق في أكثر من 30 دولة.",
      Urdu: "یہ پلیٹ فارم 30 سے زائد ممالک میں ٹیموں کی مدد کرتا ہے۔",
      Spanish: "La plataforma ayuda a equipos de más de 30 países.",
      French: "La plateforme accompagne des équipes dans plus de 30 pays.",
    },
  },
  {
    id: 5,
    start: 4,
    end: 6,
    time: "00:00:04.000 – 00:00:06.000",
    speaker: "Aisha Rahman",
    source: "Thank you for joining us today.",
    protected: "",
    status: "draft",
    confidence: 92,
    translations: {
      Arabic: "شكرًا لانضمامكم إلينا اليوم.",
      Urdu: "آج ہمارے ساتھ شامل ہونے کا شکریہ۔",
      Spanish: "Gracias por acompañarnos hoy.",
      French: "Merci de vous joindre à nous aujourd’hui.",
    },
  },
];

const styles = {
  approved: "bg-emerald-50 text-emerald-700",
  review: "bg-amber-50 text-amber-700",
  draft: "bg-violet-50 text-violet-700",
};
const label = (status) =>
  status === "review"
    ? "Needs review"
    : status[0].toUpperCase() + status.slice(1);

const languageToCode = {
  Arabic: "ar",
  Urdu: "ur",
  Spanish: "es",
  French: "fr",
};

function formatSrtTime(seconds) {
  const milliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const secs = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function formatDisplayTime(seconds) {
  return `${formatSrtTime(seconds).replace(",", ".")}`;
}

export default function App() {
  const [segments, setSegments] = useState(startingSegments);
  const [language, setLanguage] = useState("Arabic");
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  const [voiceFile, setVoiceFile] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceDetectedLanguage, setVoiceDetectedLanguage] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);

  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const fileInputRef = useRef(null);

  const selected =
    segments.find((item) => item.id === selectedId) || segments[0];
  const approved = useMemo(
    () => segments.filter((item) => item.status === "approved").length,
    [segments],
  );
  const shown = segments.filter((item) =>
    `${item.source} ${item.translations[language]}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const canPublish = segments.length > 0 && approved === segments.length;

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    playing ? video.pause() : video.play();
  };

  const syncSubtitle = (event) => {
    const seconds = event.currentTarget.currentTime;
    setCurrentTime(seconds);
    const active = segments.find(
      (item) => seconds >= item.start && seconds < item.end,
    );
    if (active) setSelectedId(active.id);
  };

  const syncVoiceSubtitle = (event) => {
    const seconds = event.currentTarget.currentTime;
    setCurrentTime(seconds);
    const active = segments.find(
      (item) => seconds >= item.start && seconds < item.end,
    );
    if (active) setSelectedId(active.id);
  };

  const approve = (id) =>
    setSegments((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item,
      ),
    );

  const updateTranslation = (id, text) => {
    setSegments((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              translations: { ...item.translations, [language]: text },
              status: item.status === "approved" ? "review" : item.status,
            }
          : item,
      ),
    );
  };

  const exportSrt = () => {
    if (!canPublish) return;
    const srt = segments
      .map(
        (item, i) =>
          `${i + 1}\n${formatSrtTime(item.start)} --> ${formatSrtTime(item.end)}\n${item.translations[language]}\n`,
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([srt], { type: "text/plain;charset=utf-8" }),
    );
    link.download = `clearvoice-${language.toLowerCase()}.srt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setNotice("Approved SRT file downloaded.");
  };

  const clearVoiceUpload = () => {
    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    setVoiceFile(null);
    setVoiceUrl("");
    setVoiceError("");
    setVoiceDetectedLanguage("");
    setVoiceMode(false);
    setCurrentTime(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const chooseVoice = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setVoiceError(
        "Please choose an audio file such as MP3, WAV, M4A, OGG, FLAC or WebM.",
      );
      return;
    }

    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    setVoiceFile(file);
    setVoiceUrl(URL.createObjectURL(file));
    setVoiceError("");
    setNotice("Audio selected. Click Generate subtitles to transcribe it.");
    setVoiceMode(true);
    setSegments([]);
    setSelectedId(null);
    setCurrentTime(0);
  };

  const generateVoiceSubtitles = async () => {
    if (!voiceFile) {
      setVoiceError("Please upload an audio file first.");
      return;
    }

    setVoiceLoading(true);
    setVoiceError("");
    setNotice(
      "Transcribing your voice locally. The first run may take longer while the Whisper model downloads.",
    );

    try {
      const formData = new FormData();
      formData.append("file", voiceFile);
      if (voiceLanguage) formData.append("language", voiceLanguage);

      const response = await fetch("http://127.0.0.1:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Transcription failed.");
      }

      const newSegments = data.segments.map((item, index) => ({
        id: index + 1,
        start: item.start,
        end: item.end,
        time: `${formatDisplayTime(item.start)} – ${formatDisplayTime(item.end)}`,
        speaker: "Uploaded voice",
        source: item.text,
        protected: "",
        status: "review",
        confidence: Math.round(
          (item.avg_logprob
            ? Math.max(0, Math.min(1, (item.avg_logprob + 1) / 1))
            : 0.9) * 100,
        ),
        translations: {
          Arabic: language === "Arabic" ? item.text : "",
          Urdu: language === "Urdu" ? item.text : "",
          Spanish: language === "Spanish" ? item.text : "",
          French: language === "French" ? item.text : "",
        },
      }));

      setSegments(newSegments);
      setSelectedId(newSegments[0]?.id ?? null);
      setVoiceDetectedLanguage(data.detected_language || "");
      setCurrentTime(0);
      setNotice(
        `Transcription complete. ${newSegments.length} subtitle segments were created. Human review is still required.`,
      );
    } catch (error) {
      console.error(error);
      setVoiceError(
        error.message ||
          "Could not connect to the ClearVoice transcription server.",
      );
    } finally {
      setVoiceLoading(false);
    }
  };

  const switchBackToDemo = () => {
    clearVoiceUpload();
    setSegments(startingSegments);
    setSelectedId(1);
    setLanguage("Arabic");
    setQuery("");
    setNotice("Returned to the original ClearVoice demo.");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[.16em] text-violet-600">
              CLEARVOICE · RECORDED TALK
            </p>
            <h1 className="mt-1 text-xl font-bold">
              Building trust across borders{" "}
              <span className="ml-2 rounded-full bg-violet-100 px-2 py-1 text-xs text-violet-700">
                {canPublish ? "Ready to publish" : "In human review"}
              </span>
            </h1>
          </div>
          <button
            disabled={!canPublish}
            onClick={exportSrt}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canPublish
              ? "Publish subtitles"
              : `Publish blocked · ${Math.max(segments.length - approved, 0)} reviews left`}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-5 lg:p-8">
        <div className="mb-6 rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                New feature
              </p>
              <h2 className="mt-1 text-lg font-bold">
                Upload a new voice recording
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload an audio file and ClearVoice will create timestamped
                subtitles using a local Whisper model.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700"
            >
              Choose voice
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={chooseVoice}
            className="hidden"
          />

          {voiceFile && (
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">
                    {voiceFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(voiceFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={clearVoiceUpload}
                  className="text-sm font-bold text-red-600"
                >
                  Remove
                </button>
              </div>

              <audio
                ref={voiceRef}
                src={voiceUrl}
                controls
                onTimeUpdate={syncVoiceSubtitle}
                className="mt-4 w-full"
              />

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <label className="text-sm font-semibold text-slate-700">
                  Voice language
                  <select
                    value={voiceLanguage}
                    onChange={(e) => setVoiceLanguage(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-normal outline-none focus:border-violet-500"
                  >
                    {voiceLanguages.map((item) => (
                      <option key={item.label} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  onClick={generateVoiceSubtitles}
                  disabled={voiceLoading}
                  className="self-end rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {voiceLoading
                    ? "Generating subtitles…"
                    : "Generate subtitles"}
                </button>
              </div>

              {voiceDetectedLanguage && (
                <p className="mt-3 text-xs text-slate-500">
                  Detected language: <b>{voiceDetectedLanguage}</b>
                </p>
              )}
              {voiceError && (
                <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {voiceError}
                </p>
              )}
            </div>
          )}
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {languages.map((item) => (
                  <button
                    key={item}
                    onClick={() => setLanguage(item)}
                    className={`rounded-lg px-3 py-2 text-sm font-bold ${language === item ? "bg-violet-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subtitles"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
              />
            </div>

            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <b>Human approval required.</b> Nothing is published until every
              AI translation/transcript is checked by a ClearVoice reviewer.
            </div>

            {voiceMode && voiceUrl ? (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-900 p-5">
                  <p className="font-semibold text-white">
                    Uploaded voice · live subtitle preview
                  </p>
                  <div className="mt-4 rounded-lg bg-slate-950 p-5 text-center text-lg font-medium text-white min-h-20 grid place-items-center">
                    {selected?.translations[language] ||
                      selected?.source ||
                      "Play the audio to see subtitles."}
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-500">
                  <span>{currentTime.toFixed(1)}s</span>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(selected?.end || 1, 1)}
                    step="0.1"
                    value={Math.min(
                      currentTime,
                      Math.max(selected?.end || 1, 1),
                    )}
                    onChange={(event) => {
                      if (voiceRef.current)
                        voiceRef.current.currentTime = Number(
                          event.target.value,
                        );
                      setCurrentTime(Number(event.target.value));
                    }}
                    className="w-full accent-violet-600"
                  />
                  <span>audio</span>
                </div>
              </section>
            ) : (
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-60 overflow-hidden bg-slate-900">
                  <video
                    ref={videoRef}
                    loop
                    playsInline
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onTimeUpdate={syncSubtitle}
                    className="h-full w-full object-cover"
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                  />
                  <p className="absolute left-5 top-5 font-semibold text-white drop-shadow">
                    ClearVoice Talks · looping demo
                  </p>
                  <button
                    onClick={toggleVideo}
                    className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-lg text-violet-700 shadow"
                  >
                    {playing ? "Ⅱ" : "▶"}
                  </button>
                  <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded bg-slate-950/80 px-3 py-2 text-center text-sm font-medium text-white">
                    {selected?.translations[language]}
                  </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-500">
                  <span>{currentTime.toFixed(1)}s</span>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.1"
                    value={Math.min(currentTime, 6)}
                    onChange={(event) => {
                      if (videoRef.current)
                        videoRef.current.currentTime = Number(
                          event.target.value,
                        );
                      setCurrentTime(Number(event.target.value));
                    }}
                    className="w-full accent-violet-600"
                  />
                  <span>loops</span>
                </div>
              </section>
            )}

            {voiceMode && (
              <button
                onClick={switchBackToDemo}
                className="mt-3 text-sm font-bold text-violet-700"
              >
                ← Return to demo video
              </button>
            )}

            <div className="mt-6 flex justify-between">
              <p className="text-sm text-slate-500">
                {segments.length} subtitle segments
              </p>
              <button
                onClick={() =>
                  setSegments((items) =>
                    items.map((item) => ({ ...item, status: "approved" })),
                  )
                }
                className="text-sm font-bold text-emerald-700"
              >
                ✓ Mark all human-reviewed
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {shown.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm ${item.id === selectedId ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"}`}
                >
                  <div className="grid gap-4 md:grid-cols-[125px_1fr_1fr_105px]">
                    <div className="text-xs text-slate-500">
                      <b className="mb-1 block text-slate-700">
                        {item.speaker}
                      </b>
                      {item.time}
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Original {item.protected && "· protected"}
                      </p>
                      <p className="text-sm leading-6">{item.source}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {language} · AI first pass
                      </p>
                      <textarea
                        value={item.translations[language] || ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateTranslation(item.id, e.target.value)
                        }
                        className="h-14 w-full resize-none rounded border border-slate-200 p-2 text-sm outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          approve(item.id);
                        }}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[item.status]}`}
                      >
                        {label(item.status)}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold">Review details</h2>
            <div className="mt-5 rounded-lg bg-violet-50 p-4">
              <div className="flex justify-between text-sm">
                <span>Human review progress</span>
                <b className="text-violet-700">
                  {segments.length
                    ? Math.round((approved / segments.length) * 100)
                    : 0}
                  %
                </b>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full bg-violet-600"
                  style={{
                    width: `${segments.length ? (approved / segments.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-600">
                <b>{approved}</b> approved ·{" "}
                <b>
                  {segments.filter((item) => item.status === "review").length}
                </b>{" "}
                need review
              </p>
            </div>
            <Info title="Speaker" value={selected?.speaker || "—"} />
            <Info title="Timing" value={selected?.time || "—"} />
            <Info
              title="AI confidence"
              value={selected ? `${selected.confidence}%` : "—"}
            />
            <div className="mt-5 border-t pt-5">
              <div className="flex justify-between">
                <h3 className="text-sm font-bold">Protected content</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-bold ${selected?.protected ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                >
                  {selected?.protected ? "Check required" : "Clear"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {selected?.protected
                  ? `Confirm this is preserved accurately: ${selected.protected}`
                  : "No product name or direct quote was detected."}
              </p>
            </div>
            {notice && (
              <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                {notice}
              </p>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="mt-5 border-t pt-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
