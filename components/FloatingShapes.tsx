"use client"
import { motion } from "framer-motion"
import { Code, Database, Globe, Server, Cpu, Cloud, Monitor, ShieldCheck, Smartphone, Wifi } from "lucide-react"

export default function FloatingShapes() {
  const shapes = [
    {
      icon: Code,
      position: { top: "15%", left: "10%" },
      size: "w-12 h-12",
      color: "#0066FF",
      animation: {
        y: [0, 20, 0],
        rotate: [0, 10, 0],
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 1.1, 1],
      },
      duration: 5,
    },
    {
      icon: Database,
      position: { top: "25%", left: "70%" },
      size: "w-14 h-14",
      color: "#FF4B93",
      animation: {
        y: [0, -15, 0],
        rotate: [0, -5, 0],
        opacity: [0.5, 0.7, 0.5],
        scale: [1, 0.9, 1],
      },
      duration: 6,
    },
    {
      icon: Globe,
      position: { top: "65%", left: "15%" },
      size: "w-16 h-16",
      color: "#00D749",
      animation: {
        y: [0, 15, 0],
        rotate: [0, 8, 0],
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 1.05, 1],
      },
      duration: 7,
    },
    {
      icon: Server,
      position: { top: "70%", left: "65%" },
      size: "w-10 h-10",
      color: "#FFCC00",
      animation: {
        y: [0, -10, 0],
        rotate: [0, -10, 0],
        opacity: [0.5, 0.7, 0.5],
        scale: [1, 1.1, 1],
      },
      duration: 4,
    },
    {
      icon: Cpu,
      position: { top: "40%", left: "30%" },
      size: "w-12 h-12",
      color: "#9900FF",
      animation: {
        y: [0, 12, 0],
        rotate: [0, 5, 0],
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 0.95, 1],
      },
      duration: 5.5,
    },
    {
      icon: Cloud,
      position: { top: "20%", left: "40%" },
      size: "w-14 h-14",
      color: "#00CCFF",
      animation: {
        y: [0, -12, 0],
        rotate: [0, -8, 0],
        opacity: [0.5, 0.7, 0.5],
        scale: [1, 1.08, 1],
      },
      duration: 6.5,
    },
    {
      icon: Monitor,
      position: { top: "55%", left: "45%" },
      size: "w-10 h-10",
      color: "#FF6600",
      animation: {
        y: [0, 10, 0],
        rotate: [0, 12, 0],
        opacity: [0.5, 0.7, 0.5],
        scale: [1, 1.05, 1],
      },
      duration: 5,
    },
    {
      icon: ShieldCheck,
      position: { top: "35%", left: "80%" },
      size: "w-12 h-12",
      color: "#33CC99",
      animation: {
        y: [0, -8, 0],
        rotate: [0, -6, 0],
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 0.92, 1],
      },
      duration: 4.5,
    },
    {
      icon: Smartphone,
      position: { top: "80%", left: "35%" },
      size: "w-10 h-10",
      color: "#FF3366",
      animation: {
        y: [0, 15, 0],
        rotate: [0, 10, 0],
        opacity: [0.5, 0.7, 0.5],
        scale: [1, 1.1, 1],
      },
      duration: 6,
    },
    {
      icon: Wifi,
      position: { top: "10%", left: "85%" },
      size: "w-12 h-12",
      color: "#66CC33",
      animation: {
        y: [0, -10, 0],
        rotate: [0, -5, 0],
        opacity: [0.6, 0.8, 0.6],
        scale: [1, 0.95, 1],
      },
      duration: 5.5,
    },
  ]

  // Background gradient blobs
  const blobs = [
    {
      position: { top: "20%", left: "30%" },
      size: "w-64 h-64",
      color: "bg-blue-500",
      opacity: "opacity-5",
      blur: "blur-3xl",
    },
    {
      position: { top: "60%", left: "70%" },
      size: "w-80 h-80",
      color: "bg-purple-500",
      opacity: "opacity-5",
      blur: "blur-3xl",
    },
    {
      position: { top: "70%", left: "20%" },
      size: "w-72 h-72",
      color: "bg-pink-500",
      opacity: "opacity-5",
      blur: "blur-3xl",
    },
  ]

  return (
    <>
      {/* Background gradient blobs */}
      {blobs.map((blob, index) => (
        <div
          key={`blob-${index}`}
          className={`absolute rounded-full ${blob.size} ${blob.color} ${blob.opacity} ${blob.blur}`}
          style={blob.position}
        />
      ))}

      {/* Floating icons */}
      {shapes.map((shape, index) => {
        const Icon = shape.icon
        return (
          <motion.div
            key={index}
            className={`absolute ${shape.size}`}
            style={{
              ...shape.position,
              color: shape.color,
            }}
            animate={shape.animation}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              duration: shape.duration,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-full h-full" strokeWidth={1.5} />
          </motion.div>
        )
      })}
    </>
  )
}

