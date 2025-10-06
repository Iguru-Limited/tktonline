"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "motion/react"
import { Seat } from "@/contexts/BookingContext"

interface SeatSelectionProps {
  seats: Seat[]
  selectedSeats: Seat[]
  onSeatSelect: (seat: Seat) => void
  onContinue: () => void
  providerName: string
  vehicleType: string
  route: string
}

export default function SeatSelection({
  seats,
  selectedSeats,
  onSeatSelect,
  onContinue,
  providerName,
  vehicleType,
  route
}: SeatSelectionProps) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  
  const getSeatForPosition = (row: string, position: number): Seat | null => {
    const seatNumber = `${row}${position}`
    return seats.find(seat => seat.number === seatNumber) || null
  }

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Seat</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{providerName}</span>
          <span>•</span>
          <span>{vehicleType}</span>
          <span>•</span>
          <span>{route}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bus Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="relative">
                  {/* Aisle Label */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 text-gray-400 text-xs font-medium">
                    @{providerName} {vehicleType}
                  </div>

                  {/* Seat Layout */}
                  <div className="grid grid-cols-5 gap-2 p-8">
                    {rows.map((row) => (
                      <React.Fragment key={row}>
                        {/* Left side seats */}
                        <div className="flex gap-2">
                          {[1, 2].map((position) => {
                            const seat = getSeatForPosition(row, position)
                            if (!seat) return <div key={position} className="w-8"></div>
                            
                            const isSelected = selectedSeats.some(s => s.id === seat.id)
                            const isAvailable = seat.isAvailable
                            
                            return (
                              <motion.button
                                key={seat.id}
                                onClick={() => isAvailable && onSeatSelect(seat)}
                                disabled={!isAvailable}
                                className={`
                                  w-8 h-8 rounded text-xs font-medium transition-all duration-200
                                  ${!isAvailable 
                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                    : isSelected
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:shadow-md'
                                  }
                                `}
                                whileHover={isAvailable && !isSelected ? { scale: 1.1 } : {}}
                                whileTap={isAvailable && !isSelected ? { scale: 0.95 } : {}}
                              >
                                {seat.number}
                              </motion.button>
                            )
                          })}
                        </div>

                        {/* Aisle */}
                        <div className="flex items-center justify-center">
                          <div className="text-xs text-gray-400 font-medium">{row}</div>
                        </div>

                        {/* Right side seats */}
                        <div className="flex gap-2">
                          {[3, 4].map((position) => {
                            const seat = getSeatForPosition(row, position)
                            if (!seat) return <div key={position} className="w-8"></div>
                            
                            const isSelected = selectedSeats.some(s => s.id === seat.id)
                            const isAvailable = seat.isAvailable
                            
                            return (
                              <motion.button
                                key={seat.id}
                                onClick={() => isAvailable && onSeatSelect(seat)}
                                disabled={!isAvailable}
                                className={`
                                  w-8 h-8 rounded text-xs font-medium transition-all duration-200
                                  ${!isAvailable 
                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                    : isSelected
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:shadow-md'
                                  }
                                `}
                                whileHover={isAvailable && !isSelected ? { scale: 1.1 } : {}}
                                whileTap={isAvailable && !isSelected ? { scale: 0.95 } : {}}
                              >
                                {seat.number}
                              </motion.button>
                            )
                          })}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selection Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Your Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSeats.length > 0 ? (
                <>
                  <div>
                    <h4 className="font-medium mb-2">Selected Seats:</h4>
                    <div className="space-y-1">
                      {selectedSeats.map((seat) => (
                        <div key={seat.id} className="flex justify-between items-center">
                          <span>Seat {seat.number}</span>
                          <span className="font-medium">KSh {seat.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">KSh {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={onContinue}
                    className="w-full mt-4"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select your preferred seats to continue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
