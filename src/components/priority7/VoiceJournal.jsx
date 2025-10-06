import { useState, useEffect } from 'react'
import { Mic, Square, Play, Trash2 } from 'lucide-react'

function VoiceJournal() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [mediaRecorder, setMediaRecorder] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('safespace_voice_journals')
    if (saved) setRecordings(JSON.parse(saved))
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const newRecording = {
          id: Date.now(),
          url,
          duration: Math.floor((Date.now() - recorder.startTime) / 1000),
          transcription: 'Transcription not available (requires API)',
          createdAt: new Date().toISOString()
        }
        const updated = [newRecording, ...recordings]
        setRecordings(updated)
        localStorage.setItem('safespace_voice_journals', JSON.stringify(updated))
      }

      recorder.startTime = Date.now()
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (err) {
      alert('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const deleteRecording = (id) => {
    const updated = recordings.filter(r => r.id !== id)
    setRecordings(updated)
    localStorage.setItem('safespace_voice_journals', JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-2xl p-6 text-center">
        <Mic size={48} className="mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Voice Journaling</h3>
        <p className="text-text-secondary mb-6">Record your thoughts and feelings</p>
        
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 mx-auto"
          >
            <Mic size={20} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 mx-auto animate-pulse"
          >
            <Square size={20} />
            Stop Recording
          </button>
        )}
      </div>

      {recordings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-text-primary">Your Recordings</h3>
          {recordings.map(rec => (
            <div key={rec.id} className="bg-surface rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-text-primary">
                    {new Date(rec.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-text-secondary">{rec.duration}s</p>
                </div>
                <button
                  onClick={() => deleteRecording(rec.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <audio controls src={rec.url} className="w-full mb-2" />
              <p className="text-sm text-text-secondary italic">{rec.transcription}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VoiceJournal
