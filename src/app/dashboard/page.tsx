'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import {
  TrendingDown, TrendingUp, Leaf, Zap, Globe2, AlertTriangle,
  FileText, Download, RefreshCw, Bell, ChevronRight, Sparkles,
  BarChart3, Activity
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import CapybaraBot from '@/components/mascot/CapybaraBot'

// Data
const emissionsData = [
  { month: 'Ene', scope1: 280, scope2: 190, scope3: 1820 },
  { month: 'Feb', scope1: 265, scope2: 180, scope3: 1750 },
  { month: 'Mar', scope1: 310, scope2: 200, scope3: 1940 },
  { month: 'Abr', scope1: 290, scope2: 185, scope3: 1880 },
  { month: 'May', scope1: 275, scope2: 175, scope3: 1790 },
  { month: 'Jun', scope1: 260, scope2: 170, scope3: 1710 },
  { month: 'Jul', scope1: 285, scope2: 195, scope3: 1850 },
  { month: 'Ago', scope1: 270, scope2: 182, scope3: 1780 },
  { month: 'Sep', scope1: 295, scope2: 198, scope3: 1920 },
  { month: 'Oct', scope1: 285, scope2: 188, scope3: 1860 },
  { month: 'Nov', scope1: 275, scope2: 180, scope3: 1800 },
  { month: 'Dic', scope1: 255, scope2: 165, scope3: 1680 },
]

const esgRadar = [
  { subject: 'Ambiental', A: 87, fullMark: 100 },
  { subject: 'Social', A: 72, fullMark: 100 },
  { subject: 'Gobernanza', A: 91, fullMark: 100 },
  { subject: 'Clima', A: 78, fullMark: 100 },
  { subject: 'Agua', A: 65, fullMark: 100 },
  { subject: 'Biodiversidad', A: 70, fullMark: 100 },
]

const scope3Categories = [
  { cat: 'Transporte Marítimo', value: 6820, pct: 37 },
  { cat: 'Materiales Comprados', value: 4210, pct: 23 },
  { cat: 'Uso del Producto', value: 3150, pct: 17 },
  { cat: 'Residuos', value: 2040, pct: 11 },
  { cat: 'Viajes Negocio', value: 1200, pct: 7 },
  { cat: 'Otros', value: 1000, pct: 5 },
]

const aiInsights = [
  {
    type: 'alert',
    color: 'amber',
    icon: AlertTriangle,
    title: 'Alerta Scope 3',
    message: 'Tus emisiones Scope 3 aumentaron 14% vs. el mes anterior. Transporte marítimo es el principal driver.',
    action: 'Ver análisis',
  },
  {
    type: 'opportunity',
    color: 'emerald',
    icon: TrendingDown,
    title: 'Oportunidad detectada',
    message: 'Optimizar la ruta Lima→Rotterdam podría reducir 840 tCO₂e anuales (-12% Scope 3).',
    action: 'Ver opciones',
  },
  {
    type: 'info',
    color: 'blue',
    icon: Sparkles,
    title: 'Reporte listo',
    message: 'Tu reporte HC Perú Q3 2025 está listo para descarga y certificación.',
    action: 'Descargar',
  },
]

const kpis = [
  { label: 'Huella Total', value: '21,267', unit: 'tCO₂e', trend: -8, icon: Leaf, color: 'emerald' },
  { label: 'Scope 1 Directo', value: '2,847', unit: 'tCO₂e', trend: -12, icon: Activity, color: 'emerald' },
  { label: 'Scope 2 Energía', value: '2,000', unit: 'tCO₂e', trend: -5, icon: Zap, color: 'blue' },
  { label: 'Scope 3 Cadena', value: '18,420', unit: 'tCO₂e', trend: +14, icon: Globe2, color: 'amber' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark rounded-2xl p-4 border border-[rgba(52,211,153,0.15)] text-xs">
        <p className="text-[#34D399] font-semibold mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-[rgba(167,243,208,0.8)]" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} tCO₂e
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'scope3' | 'esg'>('overview')

  return (
    <div className="min-h-screen bg-[#020D09]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="badge badge-emerald mb-3 inline-flex">
              <BarChart3 className="w-3 h-3" />
              Dashboard ESG · 2025
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#F0FDF4] tracking-tight">
              Climate Intelligence
            </h1>
            <p className="text-[rgba(167,243,208,0.6)] mt-1 text-sm">
              Análisis en tiempo real · Actualizado hace 2 minutos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-xs font-semibold text-[#34D399] border border-[rgba(52,211,153,0.2)] hover:border-[rgba(52,211,153,0.4)] transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
              Actualizar
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 btn-primary text-xs rounded-xl">
              <Download className="w-3.5 h-3.5" />
              Exportar HC Perú
            </button>
          </div>
        </motion.div>

        {/* AI Insights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            {aiInsights.map((insight, i) => {
              const Icon = insight.icon
              const colors: Record<string, { bg: string, border: string, text: string }> = {
                amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#FCD34D' },
                emerald: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(52,211,153,0.2)', text: '#34D399' },
                blue: { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)', text: '#38BDF8' },
              }
              const c = colors[insight.color]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl min-w-[320px]"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <Icon className="w-4 h-4" style={{ color: c.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold mb-0.5" style={{ color: c.text }}>{insight.title}</div>
                    <div className="text-xs text-[rgba(167,243,208,0.7)] truncate">{insight.message}</div>
                  </div>
                  <button className="text-xs font-semibold flex items-center gap-1 flex-shrink-0" style={{ color: c.text }}>
                    {insight.action} <ChevronRight className="w-3 h-3" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon
            const colorMap: Record<string, { glow: string, text: string, bg: string }> = {
              emerald: { glow: 'rgba(16,185,129,0.1)', text: '#34D399', bg: 'rgba(6,78,59,0.15)' },
              blue: { glow: 'rgba(14,165,233,0.1)', text: '#38BDF8', bg: 'rgba(14,165,233,0.08)' },
              amber: { glow: 'rgba(245,158,11,0.1)', text: '#FCD34D', bg: 'rgba(245,158,11,0.08)' },
            }
            const c = colorMap[kpi.color]

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="metric-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                    <Icon className="w-5 h-5" style={{ color: c.text }} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${kpi.trend < 0 ? 'text-[#34D399]' : 'text-amber-400'}`}>
                    {kpi.trend < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {Math.abs(kpi.trend)}%
                  </div>
                </div>
                <div className="text-2xl font-black text-[#F0FDF4] mb-1">{kpi.value}</div>
                <div className="text-xs text-[rgba(167,243,208,0.5)]">{kpi.unit}</div>
                <div className="text-xs font-medium text-[rgba(167,243,208,0.6)] mt-1">{kpi.label}</div>

                {/* Mini sparkline */}
                <div className="mt-3 h-8 opacity-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emissionsData.slice(-6).map(d => ({ v: d.scope1 * (i + 1) * 0.3 }))}>
                      <Line type="monotone" dataKey="v" stroke={c.text} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 glass rounded-2xl border border-[rgba(52,211,153,0.1)] w-fit mb-8">
          {[
            { id: 'overview', label: 'Resumen' },
            { id: 'scope3', label: 'Scope 3' },
            { id: 'esg', label: 'Score ESG' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[rgba(16,185,129,0.15)] text-[#34D399] border border-[rgba(52,211,153,0.25)]'
                  : 'text-[rgba(167,243,208,0.5)] hover:text-[rgba(167,243,208,0.8)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chart Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              {/* Main Emissions Chart */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-[#F0FDF4] text-base">Emisiones por Scope · 2025</h3>
                    <p className="text-xs text-[rgba(167,243,208,0.5)] mt-0.5">tCO₂e mensual acumulado</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    {[
                      { label: 'Scope 1', color: '#34D399' },
                      { label: 'Scope 2', color: '#38BDF8' },
                      { label: 'Scope 3', color: '#FCD34D' },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                        <span className="text-[rgba(167,243,208,0.6)]">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={emissionsData}>
                    <defs>
                      <linearGradient id="scope1Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="scope2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="scope3Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#FCD34D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(52,211,153,0.06)" />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(167,243,208,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(167,243,208,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="scope3" name="Scope 3" stroke="#FCD34D" strokeWidth={2} fill="url(#scope3Grad)" />
                    <Area type="monotone" dataKey="scope2" name="Scope 2" stroke="#38BDF8" strokeWidth={2} fill="url(#scope2Grad)" />
                    <Area type="monotone" dataKey="scope1" name="Scope 1" stroke="#34D399" strokeWidth={2} fill="url(#scope1Grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* AI Copilot Panel */}
              <div className="glass-card rounded-3xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <CapybaraBot size="sm" mood="thinking" showGlow />
                  <div>
                    <div className="text-sm font-bold text-[#F0FDF4]">Kapi · AI Insights</div>
                    <div className="text-xs text-[rgba(167,243,208,0.5)]">Análisis en tiempo real</div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {[
                    { msg: 'Tu huella total redujo 8% vs. el año anterior. ¡Excelente progreso! 🎉', time: 'Ahora' },
                    { msg: 'Scope 3 representa el 86.6% de tus emisiones totales. Foco en cadena de suministro.', time: '2 min' },
                    { msg: 'Tu Score ESG mejoró de 81 a 87 en Q3. Listo para reporte GRI.', time: '5 min' },
                  ].map((item, i) => (
                    <div key={i} className="ai-bubble p-3">
                      <p className="text-xs text-[rgba(167,243,208,0.85)] leading-relaxed">{item.msg}</p>
                      <span className="text-[10px] text-[rgba(167,243,208,0.35)] mt-1 block">{item.time}</span>
                    </div>
                  ))}
                </div>

                <a href="/copilot/" className="mt-4 btn-secondary text-xs py-2.5 text-center rounded-xl flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Abrir AI Copilot completo
                </a>
              </div>
            </motion.div>
          )}

          {activeTab === 'scope3' && (
            <motion.div
              key="scope3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-6 mb-8"
            >
              <div className="mb-6">
                <h3 className="font-bold text-[#F0FDF4] text-base mb-1">Desglose Scope 3 por Categoría</h3>
                <p className="text-xs text-[rgba(167,243,208,0.5)]">18,420 tCO₂e · Cadena de valor completa</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scope3Categories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(52,211,153,0.06)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'rgba(167,243,208,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="cat" type="category" tick={{ fill: 'rgba(167,243,208,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                    <Tooltip formatter={(value: any) => [`${value.toLocaleString()} tCO₂e`, 'Emisiones']} contentStyle={{ background: 'rgba(6,26,18,0.95)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12 }} labelStyle={{ color: '#34D399' }} itemStyle={{ color: 'rgba(167,243,208,0.8)' }} />
                    <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 6, 6, 0]}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#064E3B" />
                          <stop offset="100%" stopColor="#34D399" />
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {scope3Categories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-xs text-[rgba(167,243,208,0.6)] w-36 truncate">{cat.cat}</div>
                      <div className="flex-1 h-2 bg-[rgba(52,211,153,0.08)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.pct}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, #064E3B, #34D399)` }}
                        />
                      </div>
                      <div className="text-xs font-bold text-[#34D399] w-8 text-right">{cat.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'esg' && (
            <motion.div
              key="esg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              <div className="glass-card rounded-3xl p-6">
                <h3 className="font-bold text-[#F0FDF4] text-base mb-1">Radar ESG</h3>
                <p className="text-xs text-[rgba(167,243,208,0.5)] mb-6">Score total: 87/100 · Ranking: Nivel A</p>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={esgRadar}>
                    <PolarGrid stroke="rgba(52,211,153,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(167,243,208,0.6)', fontSize: 11 }} />
                    <Radar name="ESG Score" dataKey="A" stroke="#34D399" fill="#34D399" fillOpacity={0.1} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="glass-card rounded-3xl p-6">
                <h3 className="font-bold text-[#F0FDF4] text-base mb-6">Cumplimiento por Framework</h3>
                <div className="space-y-4">
                  {[
                    { label: 'GRI Standards', score: 92, color: '#34D399' },
                    { label: 'TCFD', score: 85, color: '#38BDF8' },
                    { label: 'CDP', score: 78, color: '#FCD34D' },
                    { label: 'ISO 14064', score: 95, color: '#34D399' },
                    { label: 'HC Perú', score: 100, color: '#00FFB3' },
                    { label: 'GHG Protocol', score: 89, color: '#38BDF8' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="text-xs font-medium text-[rgba(167,243,208,0.7)] w-28">{item.label}</div>
                      <div className="flex-1 h-2.5 bg-[rgba(52,211,153,0.06)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${item.color}50, ${item.color})` }}
                        />
                      </div>
                      <div className="text-xs font-bold w-10 text-right" style={{ color: item.color }}>{item.score}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reports section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#F0FDF4] text-base">Reportes Recientes</h3>
            <a href="/upload/" className="text-xs text-[#34D399] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'HC Perú Q3 2025', date: 'Sep 30, 2025', status: 'Certificado', color: 'emerald' },
              { name: 'Reporte GRI Q2 2025', date: 'Jun 30, 2025', status: 'Aprobado', color: 'blue' },
              { name: 'TCFD Anual 2024', date: 'Dic 31, 2024', status: 'Archivado', color: 'muted' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-[rgba(6,26,18,0.5)] border border-[rgba(52,211,153,0.08)] hover:border-[rgba(52,211,153,0.2)] transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.08)] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#34D399]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#F0FDF4] truncate">{r.name}</div>
                  <div className="text-xs text-[rgba(167,243,208,0.5)]">{r.date}</div>
                </div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.color === 'emerald' ? 'badge-emerald' : r.color === 'blue' ? 'badge-blue' : 'bg-[rgba(52,211,153,0.05)] text-[rgba(167,243,208,0.4)]'}`}>
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
