'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Leaf, BarChart3, Upload, Bot, Menu, X, Zap, ChevronRight } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/upload', label: 'Analizar Datos', icon: Upload },
  { href: '/copilot', label: 'AI Copilot', icon: Bot },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3'
            : 'py-5'
        }`}
      >
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-500 ${
          scrolled
            ? 'glass-dark rounded-2xl mx-4 sm:mx-6 border border-[rgba(52,211,153,0.12)]'
            : ''
        }`}>
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300">
                  <Leaf className="w-5 h-5 text-[#020D09]" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00FFB3] animate-pulse-slow" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-[#F0FDF4]">AgroFinance</span>
                <span className="font-bold text-base tracking-tight gradient-text ml-1">AI</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[rgba(167,243,208,0.7)] hover:text-[#34D399] hover:bg-[rgba(6,78,59,0.2)] transition-all duration-200"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(52,211,153,0.15)]">
                <Zap className="w-3 h-3 text-[#34D399]" />
                <span className="text-xs font-semibold text-[#34D399]">IA Activa</span>
              </div>
              <Link href="/dashboard" className="hidden md:block btn-primary text-xs py-2.5 px-5 rounded-xl">
                <span className="flex items-center gap-1.5">
                  Comenzar <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-[#A7F3D0]"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-20 z-40 mx-4 glass-dark rounded-2xl border border-[rgba(52,211,153,0.12)] p-4 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-[rgba(167,243,208,0.8)] hover:text-[#34D399] hover:bg-[rgba(6,78,59,0.2)] transition-all"
                >
                  <link.icon className="w-4 h-4 text-[#34D399]" />
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="mt-3 pt-3 border-t border-[rgba(52,211,153,0.1)]">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center block text-sm py-3">
                Comenzar Ahora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
