"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export interface Seat {
  number: string
  row: number
  col: number
  status: "available" | "booked"
  fare: number | null
  destination: string | null
}

interface VehicleConfiguration {
  id: number
  layout: Array<Array<{label: string, type?: string} | null>>
}

interface Vehicle {
  id: string
  name: string
  type: string
  seats: Seat[]
  departureTime: string
  arrivalTime: string
  duration: string
  vehicleConfiguration: VehicleConfiguration
}

interface CustomerDetails {
  fullName: string
  idNumber: string
  mobilePhone: string
}

interface PaymentDetails {
  method: 'mpesa' | 'airtel' | 'cash'
  phoneNumber: string
  amount: number
}

interface BookingData {
  provider: {
    id: number
    name: string
    category: string
    routes: string
    price: number
    rating: number
    trip_id: number
    company_id: number
  } | null
  vehicle: Vehicle | null
  selectedSeats: Seat[]
  customerDetails: CustomerDetails
  paymentDetails: PaymentDetails | null
  bookingReference: string | null
  totalAmount: number
}

interface BookingContextType {
  bookingData: BookingData
  updateProvider: (provider: BookingData['provider']) => void
  updateVehicle: (vehicle: Vehicle) => void
  updateSelectedSeats: (seats: Seat[]) => void
  updateCustomerDetails: (details: CustomerDetails) => void
  updatePaymentDetails: (payment: PaymentDetails) => void
  completeBooking: () => void
  clearBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

interface BookingProviderProps {
  children: ReactNode
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    provider: null,
    vehicle: null,
    selectedSeats: [],
    customerDetails: {
      fullName: '',
      idNumber: '',
      mobilePhone: ''
    },
    paymentDetails: null,
    bookingReference: null,
    totalAmount: 0
  })

  const updateProvider = useCallback((provider: BookingData['provider']) => {
    setBookingData(prev => ({ ...prev, provider }))
  }, [])

  const updateVehicle = useCallback((vehicle: Vehicle) => {
    setBookingData(prev => ({ ...prev, vehicle }))
  }, [])

  const updateSelectedSeats = useCallback((seats: Seat[]) => {
    const totalAmount = seats.reduce((sum, seat) => sum + (seat.fare || 0), 0)
    setBookingData(prev => ({ ...prev, selectedSeats: seats, totalAmount }))
  }, [])

  const updateCustomerDetails = useCallback((details: CustomerDetails) => {
    setBookingData(prev => ({ ...prev, customerDetails: details }))
  }, [])

  const updatePaymentDetails = useCallback((payment: PaymentDetails) => {
    setBookingData(prev => ({ ...prev, paymentDetails: payment }))
  }, [])

  const completeBooking = useCallback(() => {
    const bookingReference = `TKT${Date.now().toString().slice(-8)}`
    setBookingData(prev => ({ ...prev, bookingReference }))
  }, [])

  const clearBooking = useCallback(() => {
    setBookingData({
      provider: null,
      vehicle: null,
      selectedSeats: [],
      customerDetails: {
        fullName: '',
        idNumber: '',
        mobilePhone: ''
      },
      paymentDetails: null,
      bookingReference: null,
      totalAmount: 0
    })
  }, [])

  return (
    <BookingContext.Provider value={{
      bookingData,
      updateProvider,
      updateVehicle,
      updateSelectedSeats,
      updateCustomerDetails,
      updatePaymentDetails,
      completeBooking,
      clearBooking
    }}>
      {children}
    </BookingContext.Provider>
  )
}
