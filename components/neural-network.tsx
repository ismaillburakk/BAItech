"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  pulse: number
}

interface Connection {
  from: number
  to: number
  distance: number
  maxDistance: number
  pulse: number
}

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createNodes = () => {
      const nodeCount = Math.floor((canvas.width * canvas.height) / 20000)
      nodesRef.current = []

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    const createConnections = () => {
      connectionsRef.current = []
      const maxDistance = 140
      const maxConnections = 4

      nodesRef.current.forEach((node, i) => {
        let connectionCount = 0

        nodesRef.current.forEach((otherNode, j) => {
          if (i !== j && connectionCount < maxConnections) {
            const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))

            if (distance < maxDistance) {
              connectionsRef.current.push({
                from: i,
                to: j,
                distance: distance,
                maxDistance: maxDistance,
                pulse: Math.random() * Math.PI * 2,
              })
              connectionCount++
            }
          }
        })
      })
    }

    const updateNodes = () => {
      nodesRef.current.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1

        // Keep nodes in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))
      })
    }

    const drawConnections = () => {
      connectionsRef.current.forEach((connection) => {
        const fromNode = nodesRef.current[connection.from]
        const toNode = nodesRef.current[connection.to]

        if (!fromNode || !toNode) return

        const currentDistance = Math.sqrt(Math.pow(fromNode.x - toNode.x, 2) + Math.pow(fromNode.y - toNode.y, 2))

        if (currentDistance < connection.maxDistance) {
          const opacity =
            (1 - currentDistance / connection.maxDistance) *
            (0.6 + 0.4 * Math.sin(timeRef.current * 2 + connection.pulse))

          // Main connection line
          const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y)
          gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity * 0.8})`)
          gradient.addColorStop(0.5, `rgba(0, 212, 255, ${opacity})`)
          gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * 0.8})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5 + Math.sin(timeRef.current * 3 + connection.pulse) * 0.5
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.stroke()

          // Glow effect
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`
          ctx.lineWidth = 3 + Math.sin(timeRef.current * 3 + connection.pulse) * 1
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.stroke()

          // Pulse effect
          const pulsePosition = (Math.sin(timeRef.current * 2 + connection.pulse) + 1) / 2
          const pulseX = fromNode.x + (toNode.x - fromNode.x) * pulsePosition
          const pulseY = fromNode.y + (toNode.y - fromNode.y) * pulsePosition

          const pulseGradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 8)
          pulseGradient.addColorStop(0, `rgba(0, 212, 255, ${opacity * 1.2})`)
          pulseGradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * 0.6})`)
          pulseGradient.addColorStop(1, "rgba(0, 212, 255, 0)")

          ctx.fillStyle = pulseGradient
          ctx.beginPath()
          ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    const drawNodes = () => {
      nodesRef.current.forEach((node) => {
        const nodeSize = node.size + Math.sin(timeRef.current * 2 + node.pulse) * 0.5

        // Node glow
        const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize * 4)
        glowGradient.addColorStop(0, "rgba(59, 130, 246, 0.8)")
        glowGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.3)")
        glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)")

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize * 4, 0, Math.PI * 2)
        ctx.fill()

        // Main node
        ctx.fillStyle = "#3b82f6"
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Node core
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize * 0.3, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = () => {
      // Clear canvas with slight trail effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      timeRef.current += 0.01

      updateNodes()
      drawConnections()
      drawNodes()

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      resizeCanvas()
      createNodes()
      createConnections()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      } else {
        animate()
      }
    }

    // Initialize
    resizeCanvas()
    createNodes()
    createConnections()
    animate()

    // Event listeners
    window.addEventListener("resize", handleResize)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="neural-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] mix-blend-screen"
    />
  )
}
