"use client"

import React from 'react'
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import PaymentForm from "@/components/payment-form"

interface PaymentStepProps {
  onComplete: () => void
  onBack: () => void
}

export default function PaymentStep({ onComplete, onBack }: PaymentStepProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-12 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
            <p className="text-gray-600">Complete your booking</p>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← Back to Seats
          </Button>
        </div>
        
        <PaymentForm 
          onCustomerDetailsChange={() => {}} // Handled by context
          onPaymentDetailsChange={() => {}} // Handled by context
          onComplete={onComplete}
        />
      </div>
    </motion.section>
  )
}
