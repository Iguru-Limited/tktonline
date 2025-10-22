"use client"

import React from 'react'
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import SeatSelection from "@/components/seat-selection"

interface Vehicle {
  id: string;
  name: string;
  type: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  seats: Array<{
    number: string;
    row: number;
    col: number;
    status: string;
    fare: number;
    destination: string;
  }>;
  vehicleConfiguration: {
    id: number;
    layout: Array<Array<{label: string, type?: string} | null>>;
  };
}

interface SeatsStepProps {
  vehicle: Vehicle
  onConfirm: () => void
  onBack: () => void
}

export default function SeatsStep({ vehicle, onConfirm, onBack }: SeatsStepProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-12 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Seats</h2>
            <p className="text-gray-600">Choose your preferred seats</p>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← Back to Providers
          </Button>
        </div>
        
        <SeatSelection 
          vehicle={vehicle}
          onSeatsChange={() => {}} // Handled by context
          onConfirm={onConfirm}
        />
      </div>
    </motion.section>
  )
}
