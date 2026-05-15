'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingDown, Leaf, Globe2 } from 'lucide-react'
import CapybaraBot from '@/components/mascot/CapybaraBot'

const floatingMetrics = [
  { label: 'Scope 1', value: '2,847', unit: 'tCO₂e', icon: '🏭', trend: '-12%', color: 'emerald' },
  { label: 'Scope 3', value: '18,420', unit: 'tCO₂e', icon: '🚢', trend: '+14%', color: 'amber' },
  { label: 'Score ESG', value: '87', unit: '/100', icon: '⭐', trend: '+6pts', color: 'blue' },
  { label: 'HC Perú', value: 'Activo', unit: '', icon: '✅', trend: 'Cumple', color: 'green' },
]

const headlines = [
  'Automatiza tu huella de carbono con IA.',
  'Climate Intelligence para agroexportadoras.',
  'Cumplimiento ESG en minutos.',
]

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [headlineIndex, setHeadlineIndex] = useState(0)

  const springX = useSpring(mouseX, { stiffness: 80, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 30 })

  // Rotate headlines
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Mouse reactive glow
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mouseX, mouseY])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; hue: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2,
        opacity: Math.random() * 0.6 + 0.1,
        hue: Math.random() > 0.7 ? 200 : 160, // mix blue and green
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.hue === 200
          ? `rgba(14, 165, 233, ${p.opacity})`
          : `rgba(52, 211, 153, ${p.opacity})`
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        p.opacity += (Math.random() - 0.5) * 0.02
        p.opacity = Math.max(0.05, Math.min(0.8, p.opacity))
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020D09]">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Background Mesh */}
      <div className="absolute inset-0 bg-mesh-pattern z-0" />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-40 z-0" />

      {/* Mouse-reactive spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(16,185,129,0.07) 0%, transparent 60%)`,
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[rgba(16,185,129,0.12)] to-transparent blur-3xl z-0 animate-pulse-slow" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[rgba(14,165,233,0.08)] to-transparent blur-3xl z-0 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-[rgba(52,211,153,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="text-xs font-semibold text-[#34D399] tracking-wide">
                Climate Intelligence · Powered by AI
              </span>
            </div>
          </motion.div>

          {/* Main Headline - Animated rotating */}
          <div className="relative w-full max-w-5xl mb-10" style={{ height: '200px' }}>
            <AnimatePresence mode="wait">
              <motion.h1
                key={headlineIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem] font-black tracking-tight leading-[1.15] px-4"
              >
                {headlineIndex === 0 && (
                  <>
                    <span className="text-[#F0FDF4]">Automatiza tu huella de carbono</span>
                    <span className="gradient-text glow-text">con Inteligencia Artificial.</span>
                  </>
                )}
                {headlineIndex === 1 && (
                  <>
                    <span className="text-[#F0FDF4]">Climate <span className="gradient-text glow-text">Intelligence</span></span>
                    <span className="text-[#F0FDF4]">para agroexportadoras.</span>
                  </>
                )}
                {headlineIndex === 2 && (
                  <>
                    <span className="text-[#F0FDF4]">Cumplimiento <span className="gradient-text glow-text">ESG</span></span>
                    <span className="text-[#F0FDF4]">en minutos, no en meses.</span>
                  </>
                )}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-[rgba(167,243,208,0.7)] max-w-2xl mb-10 leading-relaxed font-light"
          >
            Automatiza Scope 1, 2 y 3 · Genera reportes HC Perú · Cumple con ESG
            en minutos, no en meses.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <Link href="/dashboard" className="btn-primary text-sm px-8 py-4 rounded-2xl flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Comenzar análisis gratuito
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/copilot" className="btn-secondary text-sm px-8 py-4 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ver AI Copilot en vivo
            </Link>
          </motion.div>

          {/* Floating Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="relative w-full max-w-5xl"
          >
            {/* Center Capybara */}
            <div className="flex flex-col items-center mb-8">
              <CapybaraBot size="xl" mood="idle" showGlow />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 px-4 py-2 glass rounded-2xl border border-[rgba(52,211,153,0.15)] max-w-xs"
              >
                <p className="text-xs text-[rgba(167,243,208,0.7)] text-center">
                  <span className="text-[#34D399] font-semibold">Kapi</span> · Tu asistente de clima IA está listo
                </p>
              </motion.div>
            </div>

            {/* Floating Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {floatingMetrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                  className="metric-card text-left"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  <div className="text-2xl mb-2">{metric.icon}</div>
                  <div className="text-xs text-[rgba(167,243,208,0.5)] font-medium mb-1">{metric.label}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-xl font-bold text-[#F0FDF4]">{metric.value}</span>
                    <span className="text-xs text-[rgba(167,243,208,0.5)] mb-0.5">{metric.unit}</span>
                  </div>
                  <div className={`mt-2 text-xs font-semibold ${
                    metric.trend.startsWith('-') ? 'text-[#34D399]' :
                    metric.trend.startsWith('+') && metric.label !== 'Score ESG' ? 'text-amber-400' :
                    'text-[#34D399]'
                  }`}>
                    {metric.trend}
                  </div>
                  {/* Mini glow line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(52,211,153,0.3)] to-transparent" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col sm:flex-row items-center gap-8 text-center"
          >
            {[
              { icon: Globe2, value: '180+', label: 'Agroexportadoras' },
              { icon: TrendingDown, value: '2.4M', label: 'tCO₂e analizadas' },
              { icon: Leaf, value: '99.9%', label: 'Precisión ESG' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(52,211,153,0.15)] flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-[#34D399]" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-[#F0FDF4]">{stat.value}</div>
                  <div className="text-xs text-[rgba(167,243,208,0.5)]">{stat.label}</div>
                </div>
                {i < 2 && <div className="hidden sm:block w-px h-8 bg-[rgba(52,211,153,0.1)]" />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020D09] to-transparent z-10 pointer-events-none" />
    </section>
  )
}
