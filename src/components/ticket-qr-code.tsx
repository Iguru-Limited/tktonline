'use client'

import React from 'react'
import QRCode from 'react-qr-code'

interface TicketQRCodeProps {
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
      number: string
      fare: number | null
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
  size?: number
}

interface ParsedQRCodeData {
  bookingId: string;
  passenger: {
    name: string;
    id: string;
    phone: string;
  };
  trip: {
    provider: string;
    route: string;
    vehicle: string;
    departure: string;
  };
  seats: Array<{
    number: string;
    fare: number;
  }>;
  total: number;
  issued: string;
  valid: string;
  isValid: boolean;
}

export const TicketQRCode: React.FC<TicketQRCodeProps> = ({ 
  bookingData, 
  size = 128 
}) => {
  // Create a structured QR code data string with all booking information
  const generateQRCodeData = () => {
    const qrCodeData = {
      // Booking identification
      bookingId: bookingData.bookingReference || 'N/A',
      
      // Traveler information
      passenger: {
        name: bookingData.customerDetails.fullName,
        id: bookingData.customerDetails.idNumber,
        phone: bookingData.customerDetails.mobilePhone
      },
      
      // Trip details
      trip: {
        provider: bookingData.provider?.name || 'N/A',
        route: bookingData.provider?.routes || 'N/A',
        vehicle: bookingData.vehicle?.name || 'N/A',
        departure: bookingData.vehicle?.departureTime || 'N/A'
      },
      
      // Seat information
      seats: bookingData.selectedSeats.map(seat => ({
        number: seat.number,
        fare: seat.fare || 0
      })),
      
      // Financial information
      total: bookingData.totalAmount,
      
      // Payment information
      payment: bookingData.paymentDetails ? {
        method: bookingData.paymentDetails.method,
        phone: bookingData.paymentDetails.phoneNumber,
        amount: bookingData.paymentDetails.amount
      } : null,
      
      // Timestamps
      issued: new Date().toISOString(),
      valid: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Valid for 24 hours
    }
    
    // Convert to JSON string for QR code
    return JSON.stringify(qrCodeData)
  }

  const qrCodeValue = generateQRCodeData()

  return (
    <div className="flex flex-col items-center">
      <QRCode
        value={qrCodeValue}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="L"
      />
      <div className="mt-2 text-xs text-gray-500 text-center max-w-xs">
        Scan to verify booking details
      </div>
    </div>
  )
}

// Helper function to parse QR code data (for verification purposes)
export const parseQRCodeData = (qrCodeString: string): ParsedQRCodeData | null => {
  try {
    const data = JSON.parse(qrCodeString)
    return {
      bookingId: data.bookingId,
      passenger: data.passenger,
      trip: data.trip,
      seats: data.seats,
      total: data.total,
      issued: data.issued,
      valid: data.valid,
      isValid: new Date() < new Date(data.valid)
    }
  } catch (error) {
    console.error('Error parsing QR code data:', error)
    return null
  }
}

// Component for displaying parsed QR code information (for verification)
export const QRCodeInfo: React.FC<{ qrCodeData: ParsedQRCodeData | null }> = ({ qrCodeData }) => {
  if (!qrCodeData) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Invalid QR Code</h3>
        <p className="text-red-600 text-sm">Unable to read booking information</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-semibold mb-3">Booking Verification</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Booking ID:</span>
          <span className="font-medium">{qrCodeData.bookingId}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Passenger:</span>
          <span className="font-medium">{qrCodeData.passenger.name}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Route:</span>
          <span className="font-medium">{qrCodeData.trip.route}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Seats:</span>
          <span className="font-medium">
            {qrCodeData.seats.map((seat) => seat.number).join(', ')}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-medium">KSh {qrCodeData.total.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${qrCodeData.isValid ? 'text-green-600' : 'text-red-600'}`}>
            {qrCodeData.isValid ? 'Valid' : 'Expired'}
          </span>
        </div>
      </div>
    </div>
  )
}