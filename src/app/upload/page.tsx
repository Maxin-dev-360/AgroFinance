'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileSpreadsheet, FileText, CheckCircle2,
  Zap, AlertCircle, X, Sparkles
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import CapybaraBot from '@/components/mascot/CapybaraBot'

type Stage = 'idle' | 'uploading' | 'scanning' | 'analyzing' | 'complete' | 'error'

const scanMessages = [
  'Leyendo estructura de datos...',
  'Detectando emisiones Scope 1...',
  'Calculando Scope 2 por factor de red...',
  'Mapeando categorías Scope 3...',
  'Validando factores de emisión GHG Protocol...',
  'Aplicando metodología HC Perú...',
  'Generando análisis ESG automático...',
  'Calculando huella de carbono total...',
  'Preparando reporte preliminar...',
]

const acceptedTypes = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'text/csv': ['.csv'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
}

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>('idle')
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [scanIndex, setScanIndex] = useState(0)

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return
    setFiles(accepted)
    startUpload(accepted)
  }, [])

  const startUpload = (accepted: File[]) => {
    setStage('uploading')
    setProgress(0)

    // Simulate upload progress
    let p = 0
    const uploadInterval = setInterval(() => {
      p += Math.random() * 15 + 5
      if (p >= 100) {
        clearInterval(uploadInterval)
        setProgress(100)
        setTimeout(() => startScanning(), 300)
      } else {
        setProgress(Math.min(p, 99))
      }
    }, 150)
  }

  const startScanning = () => {
    setStage('scanning')
    setProgress(0)
    let idx = 0

    const scanInterval = setInterval(() => {
      idx++
      setScanIndex(idx % scanMessages.length)
      setProgress(Math.min((idx / scanMessages.length) * 100, 95))

      if (idx >= scanMessages.length) {
        clearInterval(scanInterval)
        setProgress(100)
        setTimeout(() => setStage('complete'), 600)
      }
    }, 700)
  }

  const reset = () => {
    setStage('idle')
    setFiles([])
    setProgress(0)
    setScanIndex(0)
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 5,
    maxSize: 50 * 1024 * 1024,
  })

  return (
    <div className="min-h-screen bg-[#020D09]">
      <Navigation />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-radial from-[rgba(16,185,129,0.06)] to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-radial from-[rgba(14,165,233,0.05)] to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="badge badge-emerald mb-5 inline-flex">
            <Zap className="w-3 h-3" />
            Análisis con IA · Procesamiento instantáneo
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F0FDF4] tracking-tight mb-3">
            Analiza tus datos de{' '}
            <span className="gradient-text">emisiones.</span>
          </h1>
          <p className="text-[rgba(167,243,208,0.6)] text-base max-w-lg mx-auto">
            Sube tus archivos operativos y nuestra IA calculará automáticamente tu huella de carbono Scope 1, 2 y 3.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* IDLE — Drop Zone */}
          {stage === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <div
                {...getRootProps()}
                className={`relative rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
                  isDragActive && !isDragReject
                    ? 'border-[#34D399] bg-[rgba(16,185,129,0.06)] scale-[1.01]'
                    : isDragReject
                    ? 'border-red-500 bg-[rgba(239,68,68,0.05)]'
                    : 'border-[rgba(52,211,153,0.2)] bg-[rgba(6,26,18,0.5)] hover:border-[rgba(52,211,153,0.4)] hover:bg-[rgba(6,26,18,0.7)]'
                }`}
              >
                <input {...getInputProps()} />

                {/* Animated background grid when dragging */}
                <AnimatePresence>
                  {isDragActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-grid opacity-30"
                    />
                  )}
                </AnimatePresence>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-[#34D399]"
                      style={{
                        left: `${10 + i * 11}%`,
                        top: `${20 + (i % 3) * 25}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.2, 0.7, 0.2],
                      }}
                      transition={{
                        duration: 3 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    />
                  ))}
                </div>

                <div className="relative">
                  <motion.div
                    animate={isDragActive ? { scale: 1.15, y: -5 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mx-auto mb-5"
                  >
                    <CapybaraBot size="lg" mood="idle" showGlow />
                  </motion.div>

                  <div className="mb-5">
                    <motion.div
                      animate={isDragActive ? { y: -3 } : { y: 0 }}
                      className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(16,185,129,0.1)] border border-[rgba(52,211,153,0.2)] flex items-center justify-center mb-4"
                    >
                      <Upload className={`w-7 h-7 transition-colors ${isDragActive ? 'text-[#34D399]' : 'text-[rgba(167,243,208,0.5)]'}`} />
                    </motion.div>
                  </div>

                  {isDragActive && !isDragReject ? (
                    <p className="text-[#34D399] text-lg font-bold">¡Suelta para analizar con IA!</p>
                  ) : isDragReject ? (
                    <p className="text-red-400 text-lg font-bold">Formato no soportado</p>
                  ) : (
                    <>
                      <p className="text-[#F0FDF4] text-lg font-bold mb-2">
                        Arrastra tus archivos aquí
                      </p>
                      <p className="text-[rgba(167,243,208,0.5)] text-sm mb-6">
                        o haz clic para seleccionar
                      </p>
                    </>
                  )}

                  <div className="flex flex-wrap justify-center gap-2">
                    {['.xlsx', '.xls', '.csv', '.pdf', '.txt'].map(ext => (
                      <span key={ext} className="badge badge-emerald">{ext}</span>
                    ))}
                  </div>
                  <p className="text-xs text-[rgba(167,243,208,0.3)] mt-4">Máx. 5 archivos · 50MB por archivo</p>
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: '🔒', title: 'Datos seguros', desc: 'Cifrado end-to-end. Tus datos nunca se comparten.' },
                  { icon: '⚡', title: 'Análisis en 2 min', desc: 'IA optimizada para datos agroexportadores.' },
                  { icon: '📋', title: 'Reporte automático', desc: 'HC Perú, GRI y Scope 1/2/3 generados al instante.' },
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-sm font-semibold text-[#F0FDF4] mb-1">{item.title}</div>
                    <div className="text-xs text-[rgba(167,243,208,0.5)]">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* UPLOADING */}
          {stage === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-12 text-center"
            >
              <CapybaraBot size="lg" mood="thinking" showGlow className="mx-auto mb-6" />
              <h3 className="text-xl font-bold text-[#F0FDF4] mb-2">Subiendo archivos...</h3>
              <p className="text-[rgba(167,243,208,0.5)] text-sm mb-8">
                {files.map(f => f.name).join(', ')}
              </p>
              <div className="w-full bg-[rgba(52,211,153,0.08)] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #064E3B, #34D399)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <p className="text-sm text-[#34D399] font-bold mt-3">{Math.round(progress)}%</p>
            </motion.div>
          )}

          {/* SCANNING */}
          {stage === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-12 text-center overflow-hidden relative"
            >
              {/* Scan line effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(52,211,153,0.5)] to-transparent"
                  animate={{ y: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <CapybaraBot size="lg" mood="scanning" showGlow className="mx-auto mb-6" />

              <div className="badge badge-emerald mb-4 inline-flex">
                <Sparkles className="w-3 h-3" />
                IA Analizando
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={scanIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-[#F0FDF4] text-lg font-bold mb-2"
                >
                  {scanMessages[scanIndex]}
                </motion.p>
              </AnimatePresence>

              <p className="text-[rgba(167,243,208,0.5)] text-sm mb-8">
                Aplicando metodología GHG Protocol + HC Perú
              </p>

              {/* Progress */}
              <div className="w-full bg-[rgba(52,211,153,0.08)] rounded-full h-3 overflow-hidden mb-3">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ background: 'linear-gradient(90deg, #064E3B, #34D399)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 shimmer" />
                </motion.div>
              </div>
              <p className="text-xs text-[rgba(167,243,208,0.5)]">
                Paso {Math.min(scanIndex + 1, scanMessages.length)} de {scanMessages.length}
              </p>

              {/* Processing dots */}
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#34D399]"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* COMPLETE */}
          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="glass-card rounded-3xl p-10 text-center mb-6 relative overflow-hidden">
                {/* Celebration particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: i % 3 === 0 ? '#34D399' : i % 3 === 1 ? '#38BDF8' : '#FCD34D',
                      left: `${10 + i * 7}%`,
                      top: `${20 + (i % 4) * 15}%`,
                    }}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -40, x: (i % 2 === 0 ? 10 : -10) }}
                    transition={{ duration: 1.5, delay: i * 0.1 }}
                  />
                ))}

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] border-2 border-[#34D399] flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 className="w-8 h-8 text-[#34D399]" />
                </motion.div>

                <CapybaraBot size="md" mood="happy" showGlow className="mx-auto mb-4" />

                <h3 className="text-2xl font-black text-[#F0FDF4] mb-2">¡Análisis completado!</h3>
                <p className="text-[rgba(167,243,208,0.6)] text-sm mb-8">
                  Tu huella de carbono ha sido calculada con éxito.
                </p>

                {/* Results preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left mb-8">
                  {[
                    { label: 'Scope 1', value: '287', unit: 'tCO₂e', color: '#34D399' },
                    { label: 'Scope 2', value: '194', unit: 'tCO₂e', color: '#38BDF8' },
                    { label: 'Scope 3', value: '1,847', unit: 'tCO₂e', color: '#FCD34D' },
                    { label: 'Total', value: '2,328', unit: 'tCO₂e', color: '#00FFB3' },
                  ].map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-4 rounded-2xl bg-[rgba(6,26,18,0.7)] border border-[rgba(52,211,153,0.1)]"
                    >
                      <div className="text-xs text-[rgba(167,243,208,0.5)] mb-1">{r.label}</div>
                      <div className="text-xl font-black" style={{ color: r.color }}>{r.value}</div>
                      <div className="text-xs text-[rgba(167,243,208,0.4)]">{r.unit}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/dashboard" className="btn-primary text-sm flex items-center justify-center gap-2 py-3">
                    <FileSpreadsheet className="w-4 h-4" />
                    Ver Dashboard completo
                  </a>
                  <button onClick={reset} className="btn-secondary text-sm flex items-center justify-center gap-2 py-3">
                    <Upload className="w-4 h-4" />
                    Analizar otro archivo
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
