"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"
import { Download, CheckCircle, MapPin, User, CreditCard } from "lucide-react"
import { generateTicketPDF } from "@/utils/ticketGenerator"

interface TicketReceiptProps {
  bookingData: {
    provider: {
      name: string
      category: string
      routes: string
    } | null
    vehicle: {
      name: string
      type: string
      departureTime: string
      arrivalTime: string
      duration: string
    } | null
    selectedSeats: Array<{
      id: string
      number: string
      price: number
    }>
    customerDetails: {
      fullName: string
      idNumber: string
      mobilePhone: string
    }
    bookingReference: string | null
    totalAmount: number
    paymentDetails: {
      method: 'mpesa' | 'airtel' | 'cash'
      phoneNumber: string
      amount: number
    } | null
  }
  onDownloadPDF: () => void
  onNewBooking: () => void
}

export default function TicketReceipt({
  bookingData,
  onDownloadPDF,
  onNewBooking
}: TicketReceiptProps) {
  // Show loading state only if absolutely critical data is missing
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

  const handleDownloadPDF = () => {
    if (!bookingData.provider || !bookingData.vehicle) {
      alert('Cannot generate PDF: Missing booking information')
      return
    }

    const pdfData = {
      provider: bookingData.provider,
      vehicle: bookingData.vehicle,
      selectedSeats: bookingData.selectedSeats,
      customerDetails: bookingData.customerDetails,
      bookingReference: bookingData.bookingReference || 'N/A',
      totalAmount: bookingData.totalAmount,
      paymentMethod: bookingData.paymentDetails?.method === 'mpesa' ? 'M-Pesa' : 
                    bookingData.paymentDetails?.method === 'airtel' ? 'Airtel Money' : 'Cash'
    }
    
    generateTicketPDF(pdfData)
    onDownloadPDF()
  }

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'mpesa': return 'M-Pesa'
      case 'airtel': return 'Airtel Money'
      case 'cash': return 'Cash'
      default: return method
    }
  }

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

        {/* Receipt */}
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">tkt.ke</h2>
                <p className="text-primary-foreground/80">Your trusted travel partner</p>
              </div>
              <div className="text-right text-sm">
                <div>Booking #{bookingData.bookingReference || 'N/A'}</div>
                <div>{new Date().toLocaleDateString('en-KE')}</div>
                <div>{new Date().toLocaleTimeString('en-KE')}</div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Journey Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Journey Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{bookingData.provider?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{bookingData.provider?.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{bookingData.provider?.routes || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{bookingData.vehicle?.name || 'N/A'} ({bookingData.vehicle?.type || 'N/A'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-medium">{bookingData.vehicle?.departureTime || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrival:</span>
                  <span className="font-medium">{bookingData.vehicle?.arrivalTime || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{bookingData.vehicle?.duration || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Passenger Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{bookingData.customerDetails.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Number:</span>
                  <span className="font-medium">{bookingData.customerDetails.idNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{bookingData.customerDetails.mobilePhone}</span>
                </div>
              </div>
            </div>

            {/* Seat Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Seat Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {bookingData.selectedSeats.map((seat, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">Seat {seat.number}:</span>
                    <span className="font-medium">KSh {seat.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Summary
              </h3>
              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <Badge variant="outline" className="bg-white">
                    {getPaymentMethodDisplay(bookingData.paymentDetails?.method || 'cash')}
                  </Badge>
                </div>
                {bookingData.paymentDetails?.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone Number:</span>
                    <span className="font-medium">{bookingData.paymentDetails.phoneNumber}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary">KSh {bookingData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Information:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive 30 minutes before departure</li>
                <li>• Bring valid ID for verification</li>
                <li>• This ticket is non-transferable</li>
                <li>• Keep this ticket safe for your journey</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF Ticket
          </Button>
          
          <Button
            onClick={onNewBooking}
            className="flex-1"
            size="lg"
          >
            Book Another Trip
          </Button>
        </div>

        {/* QR Code Placeholder */}
        <div className="text-center">
          <div className="inline-block bg-gray-100 p-4 rounded-lg">
            <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">QR Code</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Scan for digital verification</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
