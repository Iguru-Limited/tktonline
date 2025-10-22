"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "motion/react"
import { Seat } from "@/contexts/BookingContext"
import { useBooking } from "@/contexts/BookingContext"

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

interface SeatSelectionProps {
  vehicle?: Vehicle
  onSeatsChange?: (seats: Seat[]) => void
  onConfirm?: () => void
}

export default function SeatSelection({
  vehicle,
  onSeatsChange,
  onConfirm
}: SeatSelectionProps) {
  const { bookingData, updateSelectedSeats } = useBooking()
  
  // Get data from booking context or props
  const seats = vehicle?.seats || []
  const selectedSeats = bookingData.selectedSeats || []
  const providerName = bookingData.provider?.name || vehicle?.name || 'Bus Company'
  const vehicleType = bookingData.provider?.category || vehicle?.type || 'Bus'
  const route = bookingData.provider?.routes || vehicle?.name || 'Route'
  const vehicleConfiguration = vehicle?.vehicleConfiguration || { id: 1, layout: [] }
  const getSeatByNumber = (seatNumber: string): Seat | null => {
    const seat = seats.find(seat => seat.number === seatNumber)
    if (!seat) return null
    return {
      ...seat,
      status: seat.status as "available" | "booked"
    }
  }

  const totalAmount = selectedSeats && selectedSeats.length > 0 
    ? selectedSeats.reduce((sum, seat) => sum + (seat.fare || 0), 0) 
    : 0

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

                  {/* Dynamic Seat Layout */}
                  <div className="grid grid-cols-5 gap-2 p-8">
                    {vehicleConfiguration.layout.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        {row.map((cell, colIndex) => {
                          if (cell === null) {
                            return <div key={colIndex} className="w-8"></div>
                          }
                          
                          const seat = getSeatByNumber(cell.label)
                          if (!seat) return <div key={colIndex} className="w-8"></div>
                          
                          const isSelected = selectedSeats.some(s => s.number === seat.number)
                          const isAvailable = seat.status === "available"
                          
                          return (
                            <motion.button
                              key={seat.number}
                              onClick={() => {
                                if (isAvailable) {
                                  const newSeat: Seat = { 
                                    number: seat.number, 
                                    fare: seat.fare,
                                    row: seat.row,
                                    col: seat.col,
                                    status: seat.status as "available" | "booked",
                                    destination: seat.destination
                                  }
                                  const updatedSeats = isSelected 
                                    ? selectedSeats.filter(s => s.number !== seat.number)
                                    : [...selectedSeats, newSeat]
                                  
                                  updateSelectedSeats(updatedSeats)
                                  
                                  if (onSeatsChange) {
                                    onSeatsChange(updatedSeats)
                                  }
                                }
                              }}
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
              {selectedSeats && selectedSeats.length > 0 ? (
                <>
                  <div>
                    <h4 className="font-medium mb-2">Selected Seats:</h4>
                    <div className="space-y-1">
                      {selectedSeats.map((seat) => (
                        <div key={seat.number} className="flex justify-between items-center">
                          <span>Seat {seat.number}</span>
                          <span className="font-medium">KSh {(seat.fare || 0).toLocaleString()}</span>
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
                    onClick={() => {
                      if (onConfirm) {
                        onConfirm()
                      }
                    }}
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
