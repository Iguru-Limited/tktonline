"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Bus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DesktopHeader from "@/components/desktop-header"
import MobileHeader from "@/components/mobile-header"
import SeatSelection from "@/components/seat-selection"
import PaymentForm from "@/components/payment-form"
import TicketReceipt from "@/components/ticket-receipt"
import { useBooking } from "@/contexts/BookingContext"
import Link from "next/link"

// Mock vehicle data with seats
const generateVehicleData = (providerName: string) => ({
  id: '1',
  name: `${providerName} Express`,
  type: 'Standard AC Seater',
  departureTime: '08:00 AM',
  arrivalTime: '02:00 PM',
  duration: '6 hours',
  seats: Array.from({ length: 40 }, (_, index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 4)) // A, B, C, etc.
    const position = (index % 4) + 1
    const seatNumber = `${row}${position}`
    
    return {
      id: `seat-${seatNumber}`,
      number: seatNumber,
      isAvailable: Math.random() > 0.3, // 70% availability
      isSelected: false,
      price: 2500 + Math.floor(Math.random() * 1000) // Random price between 2500-3500
    }
  })
})

type BookingStep = 'provider' | 'seats' | 'payment' | 'receipt'

export default function BookingPage() {
  const router = useRouter()
  const { bookingData, updateVehicle, updateSelectedSeats, updateCustomerDetails, updatePaymentDetails, completeBooking, clearBooking } = useBooking()
  const [currentStep, setCurrentStep] = useState<BookingStep>('provider')
  const [vehicle, setVehicle] = useState(generateVehicleData(bookingData.provider?.name || 'Chania'))
  const lastProviderIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!bookingData.provider) {
      router.push('/providers')
      return
    }
    
    // Only generate vehicle data if provider actually changed
    if (lastProviderIdRef.current !== bookingData.provider.id) {
      lastProviderIdRef.current = bookingData.provider.id
      const newVehicle = generateVehicleData(bookingData.provider.name)
      setVehicle(newVehicle)
      updateVehicle(newVehicle)
    }
  }, [bookingData.provider?.id, bookingData.provider?.name, router, updateVehicle, vehicle])

  const handleSeatSelect = (seat: { id: string; number: string; price: number }) => {
    const updatedSeats = [...bookingData.selectedSeats]
    const existingIndex = updatedSeats.findIndex(s => s.id === seat.id)
    
    if (existingIndex >= 0) {
      // Remove seat if already selected
      updatedSeats.splice(existingIndex, 1)
    } else {
      // Add seat if not selected
      updatedSeats.push({
        ...seat,
        isAvailable: true,
        isSelected: true
      })
    }
    
    updateSelectedSeats(updatedSeats)
  }

  const handlePaymentComplete = (
    customerDetails: { fullName: string; idNumber: string; mobilePhone: string }, 
    paymentDetails: { method: 'mpesa' | 'airtel' | 'cash'; phoneNumber: string; amount: number }
  ) => {
    updateCustomerDetails(customerDetails)
    updatePaymentDetails(paymentDetails)
    completeBooking()
    setCurrentStep('receipt')
  }

  const handleNewBooking = () => {
    clearBooking()
    router.push('/')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'provider':
        return (
          <motion.div
            key="provider"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto p-6 max-w-2xl"
          >
            <div className="mb-6">
              <Link href="/providers">
                <Button variant="outline" size="sm" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Providers
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Booking</h1>
              <p className="text-gray-600">Review your selected provider and proceed to seat selection</p>
            </div>

            {bookingData.provider && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{bookingData.provider.name}</h2>
                      <p className="text-gray-600">{bookingData.provider.category}</p>
                    </div>
                    <Badge variant="outline">{bookingData.provider.category}</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{bookingData.provider.routes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-medium">KSh {bookingData.provider.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium">⭐ {bookingData.provider.rating}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setCurrentStep('seats')}
                    className="w-full"
                    size="lg"
                  >
                    <Bus className="h-4 w-4 mr-2" />
                    Proceed to Seat Selection
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )

      case 'seats':
        return (
          <SeatSelection
            seats={vehicle.seats}
            selectedSeats={bookingData.selectedSeats}
            onSeatSelect={handleSeatSelect}
            onContinue={() => setCurrentStep('payment')}
            providerName={bookingData.provider?.name || ''}
            vehicleType={vehicle.type}
            route={bookingData.provider?.routes || ''}
          />
        )

      case 'payment':
        return (
          <PaymentForm
            selectedSeats={bookingData.selectedSeats}
            totalAmount={bookingData.totalAmount}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setCurrentStep('seats')}
          />
        )

      case 'receipt':
        return (
          <TicketReceipt
            bookingData={bookingData}
            onDownloadPDF={() => console.log('PDF downloaded')}
            onNewBooking={handleNewBooking}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DesktopHeader />
      <MobileHeader />
      
      <div className="flex-1 bg-muted">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  )
}
