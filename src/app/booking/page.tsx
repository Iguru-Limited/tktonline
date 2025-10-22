"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, Bus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DesktopHeader from "@/components/desktop-header"
import MobileHeader from "@/components/mobile-header"
import SeatSelection from "@/components/seat-selection"
import PaymentForm from "@/components/payment-form"
import TicketReceipt from "@/components/ticket-receipt"
import { useBooking } from "@/contexts/BookingContext"
import { fetchTripDetails } from "@/utils/api"
import Link from "next/link"

interface TripDetails {
  trip: {
    id: number;
    route_name: string;
    vehicle_plate: string;
    vehicle_type: string;
    departure_time: string;
    arrival_time?: string;
  };
  seats: Array<{
    number: string;
    row: number;
    col: number;
    status: string;
    destination: string;
  }>;
  vehicle_configuration: {
    id: number;
    layout: Array<Array<{label: string, type?: string} | null>>;
  };
}

// Helper function to transform API response to our Vehicle format
const transformTripData = (tripDetails: TripDetails, baseFare: number) => {
  const { trip, seats, vehicle_configuration } = tripDetails
  
  return {
    id: trip.id.toString(),
    name: `${trip.route_name} - ${trip.vehicle_plate}`,
    type: trip.vehicle_type,
    departureTime: new Date(trip.departure_time).toLocaleTimeString('en-KE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    arrivalTime: trip.arrival_time ? new Date(trip.arrival_time).toLocaleTimeString('en-KE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : 'TBD',
    duration: 'TBD', // Calculate if needed
    seats: seats.map((seat) => ({
      number: seat.number,
      row: seat.row,
      col: seat.col,
      status: seat.status as "available" | "booked",
      fare: baseFare, // Use the trip's base fare for all seats
      destination: seat.destination
    })),
    vehicleConfiguration: {
      id: vehicle_configuration.id,
      layout: vehicle_configuration.layout
    }
  }
}

type BookingStep = 'provider' | 'seats' | 'payment' | 'receipt'

export default function BookingPage() {
  const router = useRouter()
  const { bookingData, updateVehicle, updateSelectedSeats, updateCustomerDetails, updatePaymentDetails, clearBooking } = useBooking()
  const [currentStep, setCurrentStep] = useState<BookingStep>('provider')
  const [vehicle, setVehicle] = useState<{
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
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastProviderIdRef = useRef<number | null>(null)

  const fetchTripData = useCallback(async () => {
    if (!bookingData.provider?.trip_id || !bookingData.provider?.company_id) {
      setError('Missing trip or company information')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const tripDetails = await fetchTripDetails(
        bookingData.provider.company_id, 
        bookingData.provider.trip_id
      )
      
      // Use the base fare from the provider selection
      const baseFare = bookingData.provider.price
      const transformedVehicle = transformTripData(tripDetails as TripDetails, baseFare)
      setVehicle(transformedVehicle)
      updateVehicle(transformedVehicle)
    } catch (err) {
      console.error('Error fetching trip details:', err)
      setError('Failed to load trip details. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [bookingData.provider?.trip_id, bookingData.provider?.company_id, bookingData.provider?.price, updateVehicle])

  useEffect(() => {
    if (!bookingData.provider) {
      router.push('/providers')
      return
    }
    
    // Only fetch trip data if provider actually changed
    if (lastProviderIdRef.current !== bookingData.provider.id) {
      lastProviderIdRef.current = bookingData.provider.id
      fetchTripData()
    }
  }, [bookingData.provider, router, fetchTripData])



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

            {loading && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading trip details...</p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchTripData} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && !error && bookingData.provider && (
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
                    disabled={!vehicle}
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
        return vehicle ? (
          <SeatSelection
            vehicle={vehicle}
            onSeatsChange={updateSelectedSeats}
            onConfirm={() => setCurrentStep('payment')}
          />
        ) : (
          <div className="container mx-auto p-6 max-w-2xl text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading seat layout...</p>
          </div>
        )

      case 'payment':
        return (
          <PaymentForm
            onCustomerDetailsChange={updateCustomerDetails}
            onPaymentDetailsChange={updatePaymentDetails}
            onComplete={() => setCurrentStep('receipt')}
          />
        )

      case 'receipt':
        return (
          <TicketReceipt
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
