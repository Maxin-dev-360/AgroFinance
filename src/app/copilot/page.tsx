'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, TrendingDown, AlertTriangle,
  Leaf, Globe2, FileText, BarChart3, ArrowRight, Mic
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import CapybaraBot from '@/components/mascot/CapybaraBot'

type Message = {
  role: 'user' | 'ai'
  content: string
  time: string
  type?: 'text' | 'insight' | 'alert'
}

const initialMessages: Message[] = [
  {
    role: 'ai',
    content: '¡Hola! Soy **Kapi**, tu asistente de inteligencia climática 🌱\n\nEstoy conectado a tus datos ESG y puedo ayudarte a:\n- Analizar tus emisiones Scope 1, 2 y 3\n- Generar reportes HC Perú automáticamente\n- Identificar oportunidades de reducción de carbono\n- Responder preguntas sobre tu cumplimiento ESG\n\n¿Por dónde empezamos?',
    time: 'Ahora',
    type: 'text',
  },
]

const suggestedQuestions = [
  '¿Cuál es mi huella de carbono total este mes?',
  'Analiza mis emisiones Scope 3',
  '¿Cómo mejorar mi score ESG?',
  'Genera reporte HC Perú Q3',
  '¿Qué categoría Scope 3 debo reducir primero?',
  'Riesgo climático en mi cadena de suministro',
]

const aiResponses: Record<string, string> = {
  'huella de carbono total': '📊 **Tu huella de carbono este mes:**\n\n- **Scope 1:** 287 tCO₂e (↓12% vs. mes anterior)\n- **Scope 2:** 194 tCO₂e (↓5% vs. mes anterior)\n- **Scope 3:** 1,847 tCO₂e (↑14% vs. mes anterior)\n- **Total:** 2,328 tCO₂e\n\n⚠️ El incremento en Scope 3 está siendo impulsado principalmente por un aumento en volumen de transporte marítimo. Te recomiendo revisar las rutas de exportación hacia Europa.',
  'scope 3': '🔍 **Análisis detallado Scope 3:**\n\nTus emisiones Scope 3 suman **18,420 tCO₂e** anuales (86.6% de tu huella total).\n\nPrincipales drivers:\n1. 🚢 **Transporte marítimo:** 6,820 tCO₂e (37%)\n2. 📦 **Materiales comprados:** 4,210 tCO₂e (23%)\n3. 🏭 **Uso del producto:** 3,150 tCO₂e (17%)\n\n**Acción recomendada:** Negociar con navieras certificadas en el programa Clean Shipping podría reducir hasta 1,200 tCO₂e anuales.',
  'score esg': '⭐ **Tu Score ESG actual: 87/100 — Nivel A**\n\nDesglose por dimensión:\n- Ambiental: 87/100 ✅\n- Social: 72/100 ⚠️\n- Gobernanza: 91/100 ✅\n- Clima: 78/100 ⚠️\n\n**Para subir a Nivel A+** necesitas:\n1. Mejorar tu plan de transición climática (TCFD)\n2. Fortalecer métricas de equidad de género en tu cadena\n3. Publicar targets de reducción de emisiones al 2030\n\nEl benchmark en tu industria es 82/100. ¡Estás por encima! 🎉',
  'hc perú': '📋 **Reporte HC Perú Q3 2025**\n\nEstado: ✅ **Listo para certificación**\n\nResumen ejecutivo generado:\n- Período: Julio - Septiembre 2025\n- Huella reportada: 6,984 tCO₂e\n- Metodología: GHG Protocol Corporate Standard\n- Factor de emisión red eléctrica: 0.4847 tCO₂/MWh (COES 2025)\n- Verificación nivel: Seguridad razonable\n\n🔗 El reporte está disponible para descarga en tu dashboard. ¿Deseas que lo envíe directamente al correo del área de sostenibilidad?',
  'default': '🌱 Entendido. Estoy analizando tu consulta con acceso a tus datos ESG en tiempo real...\n\nBasándome en tu huella de carbono actual y tendencias del sector agroexportador, puedo ver patrones relevantes en tu cadena de valor. ¿Quieres que profundice en algún aspecto específico de tus emisiones o cumplimiento ESG?',
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('huella') || lower.includes('carbono') || lower.includes('total')) return aiResponses['huella de carbono total']
  if (lower.includes('scope 3') || lower.includes('cadena')) return aiResponses['scope 3']
  if (lower.includes('esg') || lower.includes('score')) return aiResponses['score esg']
  if (lower.includes('hc perú') || lower.includes('hc peru') || lower.includes('reporte')) return aiResponses['hc perú']
  return aiResponses['default']
}

function formatMessage(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-bold text-[#F0FDF4]">{line.replace(/\*\*/g, '')}</p>
    }
    if (line.startsWith('- ') || line.match(/^\d+\./)) {
      const text = line.replace(/\*\*(.*?)\*\*/g, '$1')
      return <li key={i} className="ml-4">{line.replace(/^- /, '').replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
    }
    if (line === '') return <br key={i} />
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <p key={i} className="leading-relaxed">
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-[#34D399]">{part}</strong> : part)}
      </p>
    )
  })
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text?: string) => {
    const content = text || input.trim()
    if (!content) return

    const userMsg: Message = {
      role: 'user',
      content,
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const response = getAIResponse(content)
    const aiMsg: Message = {
      role: 'ai',
      content: response,
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
    }

    setIsTyping(false)
    setMessages(prev => [...prev, aiMsg])
  }

  return (
    <div className="min-h-screen bg-[#020D09] flex flex-col">
      <Navigation />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-radial from-[rgba(16,185,129,0.05)] to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-gradient-radial from-[rgba(14,165,233,0.04)] to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex w-full gap-6 py-6">

          {/* Left sidebar — Context */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0"
          >
            {/* Mascot card */}
            <div className="glass-card rounded-3xl p-6 text-center">
              <CapybaraBot size="md" mood="thinking" showGlow className="mx-auto mb-4" />
              <div className="text-sm font-bold text-[#F0FDF4] mb-1">Kapi</div>
              <div className="text-xs text-[rgba(167,243,208,0.5)] mb-3">AI de Climate Intelligence</div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                <span className="text-xs text-[#34D399] font-semibold">En línea · Listo</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="glass-card rounded-3xl p-5">
              <div className="text-xs font-semibold text-[rgba(167,243,208,0.5)] uppercase tracking-widest mb-4">Contexto Activo</div>
              <div className="space-y-3">
                {[
                  { icon: Leaf, label: 'Huella total', value: '21,267 tCO₂e' },
                  { icon: TrendingDown, label: 'Reducción YoY', value: '-8%' },
                  { icon: BarChart3, label: 'Score ESG', value: '87/100' },
                  { icon: FileText, label: 'Reportes', value: '3 activos' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[rgba(16,185,129,0.08)] flex items-center justify-center">
                      <item.icon className="w-3.5 h-3.5 text-[#34D399]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[rgba(167,243,208,0.5)]">{item.label}</div>
                      <div className="text-xs font-bold text-[#F0FDF4]">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick shortcuts */}
            <div className="glass-card rounded-3xl p-5">
              <div className="text-xs font-semibold text-[rgba(167,243,208,0.5)] uppercase tracking-widest mb-4">Acceso rápido</div>
              <div className="space-y-2">
                {[
                  { label: 'Ver Dashboard', href: '/dashboard', icon: BarChart3 },
                  { label: 'Subir datos', href: '/upload', icon: Globe2 },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[rgba(167,243,208,0.6)] hover:text-[#34D399] hover:bg-[rgba(16,185,129,0.06)] transition-all"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">

            {/* Chat header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl px-5 py-4 mb-4 flex items-center gap-3"
            >
              <CapybaraBot size="sm" mood="thinking" showGlow />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#F0FDF4]">Kapi · AI Copilot ESG</span>
                  <div className="badge badge-emerald text-[10px] py-0.5 px-2">
                    <Sparkles className="w-2.5 h-2.5" />
                    IA Activa
                  </div>
                </div>
                <p className="text-xs text-[rgba(167,243,208,0.5)]">Conectado a tus datos ESG · Responde en tiempo real</p>
              </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: 'calc(100vh - 340px)' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.role === 'ai' && (
                    <div className="flex-shrink-0 mt-1">
                      <CapybaraBot size="sm" mood="idle" showGlow={false} />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.role === 'ai' ? 'ai-bubble' : 'user-bubble'} px-4 py-3 text-xs leading-relaxed`}>
                    <ul className="space-y-1">
                      {formatMessage(msg.content)}
                    </ul>
                    <span className="text-[10px] text-[rgba(167,243,208,0.3)] mt-2 block">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex justify-start gap-3"
                  >
                    <CapybaraBot size="sm" mood="thinking" showGlow={false} />
                    <div className="ai-bubble px-4 py-3 flex items-center gap-1.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#34D399]"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                          transition={{ duration: 1, repeat: Infinity, delay }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2 mb-3"
              >
                {suggestedQuestions.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-2 rounded-xl glass border border-[rgba(52,211,153,0.15)] text-[rgba(167,243,208,0.7)] hover:text-[#34D399] hover:border-[rgba(52,211,153,0.3)] transition-all"
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-3 flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Pregunta sobre tus emisiones, reportes ESG, Scope 3..."
                className="flex-1 bg-transparent outline-none text-sm text-[#F0FDF4] placeholder:text-[rgba(167,243,208,0.3)]"
                disabled={isTyping}
              />
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[rgba(167,243,208,0.3)] hover:text-[rgba(167,243,208,0.6)] transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(52,211,153,0.1)',
                }}
              >
                <Send className="w-4 h-4 text-[#020D09]" />
              </button>
            </motion.div>

            <p className="text-center text-[10px] text-[rgba(167,243,208,0.25)] mt-2">
              Kapi puede cometer errores. Verifica información crítica en tu dashboard ESG.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
