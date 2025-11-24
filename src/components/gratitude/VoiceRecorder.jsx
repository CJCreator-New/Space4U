import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Play, Pause, Trash2, Save, Info } from 'lucide-react'

function VoiceRecorder({ onSaveRecording, isDisabled }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const streamRef = useRef(null)
  const recordingIntervalRef = useRef(null)
  const playbackIntervalRef = useRef(null)

  // Cleanup media resources on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [isRecording, audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        setDuration(recordingTime)
        setRecordingTime(0)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      // Toast would be handled by parent or a global toast context
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      setPlaybackTime(0)

      playbackIntervalRef.current = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            clearInterval(playbackIntervalRef.current)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current)
      }
    }
  }

  const saveRecording = () => {
    if (audioBlob && onSaveRecording) {
      onSaveRecording({
        blob: audioBlob,
        url: audioUrl,
        duration: duration
      })

      // Reset state
      setAudioBlob(null)
      setAudioUrl(null)
      setDuration(0)
      setPlaybackTime(0)
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setPlaybackTime(0)
    setIsPlaying(false)

    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mic size={20} className={isRecording ? "text-red-500" : "text-gray-500"} />
            <span className="font-semibold">Voice Gratitude</span>
          </div>
          {isRecording && (
            <span className="text-sm text-red-500 font-semibold animate-pulse">
              🔴 Recording...
            </span>
          )}
        </div>

        {!audioBlob ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Record a voice message expressing your gratitude
            </p>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isDisabled}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              {isRecording ? `Stop Recording (${formatTime(recordingTime)})` : 'Start Recording'}
            </button>

            {isRecording && (
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${(recordingTime % 10) * 10}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Recording saved! ({formatTime(duration)})
            </p>

            <div className="flex gap-2 w-full">
              <button
                onClick={isPlaying ? pausePlayback : playRecording}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={saveRecording}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Save size={16} />
                Save
              </button>

              <button
                onClick={deleteRecording}
                className="flex items-center justify-center gap-2 py-2 px-3 border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>

            {isPlaying && (
              <div className="w-full">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${(playbackTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatTime(playbackTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />
          </div>
        )}

        <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
          <Info size={20} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Voice recordings help capture the emotion and authenticity of your gratitude practice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VoiceRecorder