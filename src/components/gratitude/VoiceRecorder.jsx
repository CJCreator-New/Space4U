import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Play, Pause, Trash2, Save } from 'lucide-react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Progress,
  useColorModeValue,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'

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

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const toast = useToast()

  // Cleanup media resources on unmount
  useEffect(() => {
    return () => {
      // Stop any ongoing recording
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }

      // Stop media stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      // Clear intervals
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current)
      }

      // Revoke object URLs to prevent memory leaks
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
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        status: "error",
        duration: 5000,
      })
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

      toast({
        title: "Voice recording saved!",
        description: "Your voice gratitude has been added to the entry.",
        status: "success",
        duration: 3000,
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
    <Card bg={bgColor} borderColor={borderColor} borderWidth={1} borderRadius="xl">
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <HStack spacing={2}>
              <Mic size={20} color={isRecording ? "red" : "gray"} />
              <Text fontWeight="semibold">Voice Gratitude</Text>
            </HStack>
            {isRecording && (
              <Text fontSize="sm" color="red.500" fontWeight="semibold">
                🔴 Recording...
              </Text>
            )}
          </HStack>

          {!audioBlob ? (
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Record a voice message expressing your gratitude
              </Text>

              <Button
                leftIcon={isRecording ? <MicOff /> : <Mic />}
                colorScheme={isRecording ? "red" : "blue"}
                onClick={isRecording ? stopRecording : startRecording}
                isDisabled={isDisabled}
                size="lg"
                width="full"
              >
                {isRecording ? `Stop Recording (${formatTime(recordingTime)})` : 'Start Recording'}
              </Button>

              {isRecording && (
                <Box width="full">
                  <Progress
                    value={(recordingTime % 10) * 10} // Visual indicator
                    colorScheme="red"
                    size="sm"
                    borderRadius="full"
                    isAnimated
                  />
                </Box>
              )}
            </VStack>
          ) : (
            <VStack spacing={3}>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Recording saved! ({formatTime(duration)})
              </Text>

              <HStack spacing={2} width="full">
                <Button
                  leftIcon={isPlaying ? <Pause /> : <Play />}
                  size="sm"
                  variant="outline"
                  onClick={isPlaying ? pausePlayback : playRecording}
                  flex={1}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>

                <Button
                  leftIcon={<Save />}
                  size="sm"
                  colorScheme="green"
                  onClick={saveRecording}
                  flex={1}
                >
                  Save
                </Button>

                <Button
                  leftIcon={<Trash2 />}
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={deleteRecording}
                >
                  Delete
                </Button>
              </HStack>

              {isPlaying && (
                <Box width="full">
                  <Progress
                    value={(playbackTime / duration) * 100}
                    colorScheme="blue"
                    size="sm"
                    borderRadius="full"
                  />
                  <HStack justify="space-between" mt={1}>
                    <Text fontSize="xs" color="gray.500">{formatTime(playbackTime)}</Text>
                    <Text fontSize="xs" color="gray.500">{formatTime(duration)}</Text>
                  </HStack>
                </Box>
              )}

              <audio ref={audioRef} src={audioUrl} preload="metadata" />
            </VStack>
          )}

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="xs">
              Voice recordings help capture the emotion and authenticity of your gratitude practice.
            </Text>
          </Alert>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default VoiceRecorder