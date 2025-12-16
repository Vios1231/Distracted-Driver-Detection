import React, { useState, useRef } from 'react'
import {
  Upload,
  Image,
  Video,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface DetectionResult {
  behaviors: Array<{
    type: string
    confidence: number
    icon: string
  }>
  status: 'safe' | 'warning' | 'distracted'
  overallConfidence: number
}

const Detection: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ======================
  // FILE HANDLING
  // ======================
  const processFile = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) processFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) processFile(droppedFile)
  }

  // ======================
  // BACKEND CALL
  // ======================
  const analyzeFile = async () => {
    if (!file) return

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      /**
       * Backend response sekarang:
       * {
       *   filename: "...",
       *   prediction: 3,
       *   note: "dummy feature used"
       * }
       */

      // TEMPORARY MAPPING (dummy → UI)
      const mappedResult: DetectionResult = {
        behaviors: [
          {
            type: `Class ${data.prediction}`,
            confidence: 90,
            icon: '🤖'
          }
        ],
        status: data.prediction === 0 ? 'safe' : 'distracted',
        overallConfidence: 90
      }

      setResult(mappedResult)
    } catch (err) {
      console.error(err)
      alert('Failed to connect to backend')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setIsAnalyzing(false)
  }

  // ======================
  // UI HELPERS
  // ======================
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'safe':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          label: 'Safe'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          label: 'Warning'
        }
      case 'distracted':
        return {
          icon: AlertCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          label: 'Distracted'
        }
      default:
        return {
          icon: AlertCircle,
          color: 'text-slate-400',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          label: 'Unknown'
        }
    }
  }

  // ======================
  // RENDER
  // ======================
  return (
    <section className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Upload & Analyze</h2>
          <p className="text-slate-400">
            Upload an image or video to detect distracted driving behavior
          </p>
        </div>

        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            <div className={`p-16 border-2 border-dashed rounded-3xl ${
              isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'
            }`}>
              <div className="text-center space-y-4">
                <Upload className="w-16 h-16 mx-auto text-slate-400" />
                <p className="text-xl">Drag & drop file or click</p>
                <p className="text-slate-500">JPG, PNG, MP4</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* PREVIEW */}
            <div className="rounded-xl overflow-hidden border border-slate-800">
              {file?.type.startsWith('image/') ? (
                <img src={preview} className="w-full max-h-[500px] object-contain" />
              ) : (
                <video src={preview} controls className="w-full max-h-[500px]" />
              )}
            </div>

            {/* ANALYZE BUTTON */}
            {!result && !isAnalyzing && (
              <button
                onClick={analyzeFile}
                className="w-full py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700"
              >
                Analyze
              </button>
            )}

            {/* LOADING */}
            {isAnalyzing && (
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-400" />
                <p className="mt-2 text-slate-400">Analyzing...</p>
              </div>
            )}

            {/* RESULT */}
            {result && (
              <div className={`p-6 rounded-xl border ${getStatusConfig(result.status).border}`}>
                <h3 className="text-xl font-bold mb-4">
                  Status: {getStatusConfig(result.status).label}
                </h3>
                {result.behaviors.map((b, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{b.icon} {b.type}</span>
                    <span>{b.confidence}%</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={resetUpload}
              className="w-full py-3 border border-slate-700 rounded-xl"
            >
              Upload New File
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Detection
