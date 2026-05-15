'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface CapybaraBotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  mood?: 'idle' | 'thinking' | 'happy' | 'scanning'
  showGlow?: boolean
  className?: string
}

const sizes = {
  sm: 60,
  md: 100,
  lg: 160,
  xl: 240,
}

export default function CapybaraBot({
  size = 'md',
  mood = 'idle',
  showGlow = true,
  className = '',
}: CapybaraBotProps) {
  const px = sizes[size]

  const glowColor = mood === 'thinking'
    ? 'rgba(14, 165, 233, 0.5)'
    : mood === 'happy'
    ? 'rgba(52, 211, 153, 0.6)'
    : mood === 'scanning'
    ? 'rgba(0, 255, 179, 0.5)'
    : 'rgba(16, 185, 129, 0.4)'

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: px, height: px }}
      animate={
        mood === 'scanning'
          ? { scale: [1, 1.03, 1], rotate: [0, 1, -1, 0] }
          : { y: [0, -6, 0] }
      }
      transition={
        mood === 'scanning'
          ? { duration: 0.5, repeat: Infinity }
          : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Outer glow ring */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* SVG Capybara */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body glow bg */}
        <ellipse cx="100" cy="125" rx="70" ry="50" fill="url(#bodyGlow)" opacity="0.3" />

        {/* Body */}
        <ellipse cx="100" cy="128" rx="64" ry="46" fill="url(#bodyGrad)" />

        {/* Circuit lines on body */}
        <path d="M60 120 L75 120 L80 110 L90 110" stroke="rgba(52,211,153,0.25)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M140 120 L125 120 L120 110 L110 110" stroke="rgba(52,211,153,0.25)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M85 140 L100 140 L115 140" stroke="rgba(52,211,153,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="80" cy="120" r="2" fill="rgba(52,211,153,0.6)" />
        <circle cx="120" cy="120" r="2" fill="rgba(52,211,153,0.6)" />
        <circle cx="100" cy="140" r="2" fill="rgba(52,211,153,0.6)" />

        {/* Head */}
        <ellipse cx="100" cy="90" rx="46" ry="42" fill="url(#headGrad)" />

        {/* Snout / nose area */}
        <ellipse cx="100" cy="106" rx="22" ry="14" fill="url(#snoutGrad)" />

        {/* Nostrils */}
        <ellipse cx="94" cy="108" rx="4" ry="3" fill="rgba(2,13,9,0.5)" />
        <ellipse cx="106" cy="108" rx="4" ry="3" fill="rgba(2,13,9,0.5)" />

        {/* Eyes - Left */}
        <motion.g
          animate={
            mood === 'thinking'
              ? { scaleY: [1, 0.5, 1] }
              : { scaleY: [1, 1, 0.05, 1, 1] }
          }
          transition={
            mood === 'thinking'
              ? { duration: 1, repeat: Infinity }
              : { duration: 5, repeat: Infinity, times: [0, 0.4, 0.42, 0.44, 1] }
          }
          style={{ transformOrigin: '78px 84px' }}
        >
          <ellipse cx="78" cy="84" rx="10" ry="12" fill="#020D09" />
          <ellipse cx="78" cy="84" rx="7" ry="9" fill="#0EA5E9" opacity="0.9" />
          <ellipse cx="78" cy="84" rx="4" ry="5" fill="#020D09" />
          <ellipse cx="75" cy="81" rx="2" ry="2.5" fill="white" opacity="0.9" />
          {/* Eye glow */}
          <ellipse cx="78" cy="84" rx="11" ry="13" fill="none" stroke={mood === 'thinking' ? 'rgba(14,165,233,0.6)' : 'rgba(52,211,153,0.4)'} strokeWidth="1" />
        </motion.g>

        {/* Eyes - Right */}
        <motion.g
          animate={
            mood === 'thinking'
              ? { scaleY: [1, 0.5, 1] }
              : { scaleY: [1, 1, 0.05, 1, 1] }
          }
          transition={
            mood === 'thinking'
              ? { duration: 1, repeat: Infinity, delay: 0.1 }
              : { duration: 5, repeat: Infinity, times: [0, 0.4, 0.42, 0.44, 1], delay: 0.05 }
          }
          style={{ transformOrigin: '122px 84px' }}
        >
          <ellipse cx="122" cy="84" rx="10" ry="12" fill="#020D09" />
          <ellipse cx="122" cy="84" rx="7" ry="9" fill="#0EA5E9" opacity="0.9" />
          <ellipse cx="122" cy="84" rx="4" ry="5" fill="#020D09" />
          <ellipse cx="119" cy="81" rx="2" ry="2.5" fill="white" opacity="0.9" />
          <ellipse cx="122" cy="84" rx="11" ry="13" fill="none" stroke={mood === 'thinking' ? 'rgba(14,165,233,0.6)' : 'rgba(52,211,153,0.4)'} strokeWidth="1" />
        </motion.g>

        {/* Ears */}
        <ellipse cx="62" cy="58" rx="12" ry="16" fill="url(#headGrad)" />
        <ellipse cx="62" cy="58" rx="7" ry="10" fill="url(#earInner)" />
        <ellipse cx="138" cy="58" rx="12" ry="16" fill="url(#headGrad)" />
        <ellipse cx="138" cy="58" rx="7" ry="10" fill="url(#earInner)" />

        {/* Tech headset / antenna */}
        <line x1="100" y1="50" x2="100" y2="36" stroke="rgba(52,211,153,0.5)" strokeWidth="2" />
        <motion.circle
          cx="100"
          cy="32"
          r="5"
          fill="#020D09"
          stroke="#34D399"
          strokeWidth="1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="100"
          cy="32"
          r="3"
          fill={mood === 'scanning' ? '#00FFB3' : '#34D399'}
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Legs */}
        <ellipse cx="72" cy="165" rx="16" ry="10" fill="url(#headGrad)" />
        <ellipse cx="128" cy="165" rx="16" ry="10" fill="url(#headGrad)" />
        <ellipse cx="72" cy="165" rx="16" ry="10" fill="none" stroke="rgba(52,211,153,0.1)" strokeWidth="1" />
        <ellipse cx="128" cy="165" rx="16" ry="10" fill="none" stroke="rgba(52,211,153,0.1)" strokeWidth="1" />

        {/* Smile */}
        {mood === 'happy' && (
          <path d="M90 115 Q100 122 110 115" stroke="rgba(52,211,153,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Thinking dots */}
        {mood === 'thinking' && (
          <motion.g
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <circle cx="86" cy="65" r="3" fill="#0EA5E9" opacity="0.8" />
            <circle cx="100" cy="60" r="3" fill="#0EA5E9" opacity="0.8" />
            <circle cx="114" cy="65" r="3" fill="#0EA5E9" opacity="0.8" />
          </motion.g>
        )}

        {/* Scanning ring */}
        {mood === 'scanning' && (
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(0,255,179,0.3)"
            strokeWidth="2"
            strokeDasharray="20 10"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '100px 100px' }}
          />
        )}

        {/* Gradients */}
        <defs>
          <radialGradient id="bodyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#0D5A3B" />
            <stop offset="60%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#032B20" />
          </radialGradient>
          <radialGradient id="headGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#0F6B47" />
            <stop offset="60%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#03311D" />
          </radialGradient>
          <radialGradient id="snoutGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0D5A3B" />
            <stop offset="100%" stopColor="#053B26" />
          </radialGradient>
          <radialGradient id="earInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1A6B47" />
            <stop offset="100%" stopColor="#085C3A" />
          </radialGradient>
          <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Status indicator */}
      {mood === 'scanning' && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider"
          style={{
            background: 'rgba(0,255,179,0.15)',
            border: '1px solid rgba(0,255,179,0.4)',
            color: '#00FFB3',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ANALIZANDO
        </motion.div>
      )}
    </motion.div>
  )
}
