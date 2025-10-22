"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "motion/react"
import { Download, CheckCircle } from "lucide-react"
import { TicketQRCode } from './ticket-qr-code'
import { getFullLocationName, getBoardingPoint } from '@/config/locations'
import { useBooking } from '@/contexts/BookingContext'

interface TicketReceiptProps {
  onDownloadPDF: () => void
  onNewBooking: () => void
}

export default function TicketReceipt({
  onDownloadPDF,
  onNewBooking
}: TicketReceiptProps) {
  const { bookingData } = useBooking()
  if (!bookingData.bookingReference) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your ticket...</p>
        </div>
      </div>
    )
  }

  const handleDownloadPDF = async () => {
    if (!bookingData.provider || !bookingData.vehicle) {
      alert('Cannot generate PDF: Missing booking information')
      return
    }

    // Check if we're on the client side
    if (typeof window === 'undefined') {
      alert('PDF generation is only available in the browser')
      return
    }

    const pdfData = {
      provider: bookingData.provider,
      vehicle: bookingData.vehicle,
      selectedSeats: bookingData.selectedSeats.map(seat => ({
        number: seat.number,
        fare: seat.fare || 0
      })),
      customerDetails: bookingData.customerDetails,
      bookingReference: bookingData.bookingReference || 'N/A',
      totalAmount: bookingData.totalAmount,
      paymentMethod: bookingData.paymentDetails?.method === 'mpesa' ? 'M-Pesa' : 
                    bookingData.paymentDetails?.method === 'airtel' ? 'Airtel Money' : 'Cash'
    }
    
    try {
      // Show loading state
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement
      if (button) {
        button.disabled = true
        button.textContent = 'Generating PDF...'
      }

      // Dynamic import to ensure it only runs on client side
      const { generateTicketPDF } = await import('@/utils/ticketGenerator')
      await generateTicketPDF(pdfData)
      onDownloadPDF()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      // Reset button state
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement
      if (button) {
        button.disabled = false
        button.textContent = 'Download PDF'
      }
    }
  }

  // Parse route information to match the image structure
  const getRouteInfo = () => {
    const routes = bookingData.provider?.routes || 'DHK-RAJ'
    const [origin, destination] = routes.split('-').map(route => route.trim())
    
    return {
      origin: origin || 'DHK',
      destination: destination || 'RAJ',
      originFull: getFullLocationName(origin),
      destinationFull: getFullLocationName(destination)
    }
  }

  // Get boarding point from origin terminal using dynamic configuration
  const getBoardingPointForRoute = () => {
    const originCode = routeInfo.origin
    return getBoardingPoint(originCode)
  }

  const routeInfo = getRouteInfo()

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Success Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your ticket has been successfully booked</p>
        </div>


        {/* Digital Ticket - United Airlines Style */}
        <div className="max-w-sm mx-auto bg-slate-500 p-4 rounded-3xl">
          <div className="relative">
            {/* Blue circular notches on sides */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-500 rounded-full z-10"></div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-500 rounded-full z-10"></div>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 relative">
              {/* Header with logo/provider name */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {'TKT'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {bookingData.provider?.name || 'Bus Transport'}
                  </h2>
                </div>
                
                {/* Route Information */}
                <div className="grid grid-cols-3 gap-4 items-center mb-8">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">From</div>
                    <div className="md:text-2xl font-bold text-gray-900">{routeInfo.origin}</div>
                    <div className="text-xs text-gray-500 mt-1">{routeInfo.originFull}</div>
                    <div className="text-xs text-gray-500">
                      {bookingData.vehicle?.departureTime}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">To</div>
                    <div className="md:text-2xl font-bold text-gray-900">{routeInfo.destination}</div>
                    <div className="text-xs text-gray-500 mt-1">{routeInfo.destinationFull}</div>
                    <div className="text-xs text-gray-500">
                      {bookingData.vehicle?.arrivalTime}
                    </div>
                  </div>
                </div>
                
                {/* Gate and Seat */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Boarding</div>
                    <div className="md:text-2xl font-bold text-gray-900">
                      {getBoardingPointForRoute().substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Seat</div>
                    <div className="md:text-2xl font-bold text-gray-900">
                      {bookingData.selectedSeats.map(seat => seat.number).join(', ')}
                    </div>
                  </div>
                </div>
                
                {/* Full Name and Class */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Full Name</div>
                    <div className="md:text-lg font-semibold text-gray-900">
                      {bookingData.customerDetails.fullName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Vehicle</div>
                    <div className="md:text-lg font-semibold text-gray-900">
                      {bookingData.vehicle?.name || 'Standard'}
                    </div>
                  </div>
                </div>
                
                {/* Booking Code */}
                <div className="mb-4">
                  <div className="text-sm text-gray-900 font-semibold mb-2">
                    Booking Code <span className="ml-4 font-bold">{bookingData.bookingReference}</span>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="bg-white pt-2 flex justify-center">
                  <TicketQRCode bookingData={bookingData} size={128} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleDownloadPDF}
            data-pdf-button
            variant="outline"
            className='md:flex-1'
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          
          <Button
            onClick={onNewBooking}
            className='md:flex-1'
            size="lg"
          >
            Book Another
          </Button>
        </div>

        {/* Additional Information Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold text-green-800 mb-2">Important Information</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Arrive at boarding point 15 minutes before departure</li>
                <li>• Bring valid ID matching passenger name</li>
                <li>• Ticket valid only for specified date and time</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
