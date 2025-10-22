"use client"

import React from 'react'
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import TicketReceipt from "@/components/ticket-receipt"

interface ReceiptStepProps {
  onNewBooking: () => void
  onBack: () => void
}

export default function ReceiptStep({ onNewBooking, onBack }: ReceiptStepProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-12 bg-gray-50 min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your ticket is ready</p>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← Back to Payment
          </Button>
        </div>
        
        <TicketReceipt 
          onNewBooking={onNewBooking}
          onDownloadPDF={() => {}}
        />
      </div>
    </motion.section>
  )
}
