"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "motion/react"
import { CreditCard, Smartphone, Wallet } from "lucide-react"
import { useBooking } from "@/contexts/BookingContext"

interface PaymentFormProps {
  onCustomerDetailsChange?: (details: {
    fullName: string
    idNumber: string
    mobilePhone: string
  }) => void
  onPaymentDetailsChange?: (details: {
    method: 'mpesa' | 'airtel' | 'cash'
    phoneNumber: string
    amount: number
  }) => void
  onComplete?: () => void
}

export default function PaymentForm({
  onCustomerDetailsChange,
  onPaymentDetailsChange,
  onComplete
}: PaymentFormProps) {
  const { bookingData } = useBooking()
  
  // Get data from booking context
  const selectedSeats = bookingData.selectedSeats || []
  const totalAmount = bookingData.totalAmount || 0
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    idNumber: '',
    mobilePhone: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | 'cash'>('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerDetails.fullName || !customerDetails.idNumber || !customerDetails.mobilePhone) {
      alert('Please fill in all customer details')
      return
    }

    if ((paymentMethod === 'mpesa' || paymentMethod === 'airtel') && !phoneNumber) {
      alert('Please enter your phone number for mobile payment')
      return
    }

    setIsProcessing(true)
    
    // Update booking context
    if (onCustomerDetailsChange) {
      onCustomerDetailsChange(customerDetails)
    }
    
    if (onPaymentDetailsChange) {
      onPaymentDetailsChange({
        method: paymentMethod,
        phoneNumber: paymentMethod === 'cash' ? '' : phoneNumber,
        amount: totalAmount
      })
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      if (onComplete) {
        onComplete()
      }
    }, 2000)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Enter your details and choose payment method</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="fullName" className="font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={customerDetails.fullName}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="idNumber" className="font-medium">ID Number</Label>
                  <Input
                    id="idNumber"
                    type="text"
                    placeholder="Enter ID number"
                    value={customerDetails.idNumber}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, idNumber: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="mobilePhone" className="font-medium">Mobile Phone</Label>
                  <Input
                    id="mobilePhone"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={customerDetails.mobilePhone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, mobilePhone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: 'mpesa' | 'airtel' | 'cash') => setPaymentMethod(value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  <Label htmlFor="mpesa" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <div>
                      <div className="font-medium">M-Pesa</div>
                      <div className="text-sm text-gray-500">Mobile money payment</div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="airtel" id="airtel" />
                  <Label htmlFor="airtel" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div>
                      <div className="font-medium">Airtel Money</div>
                      <div className="text-sm text-gray-500">Mobile money payment</div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Wallet className="h-8 w-8 text-gray-600" />
                    <div>
                      <div className="font-medium">Cash Payment</div>
                      <div className="text-sm text-gray-500">Pay at the bus station</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {(paymentMethod === 'mpesa' || paymentMethod === 'airtel') && (
                <div>
                  <Label htmlFor="phoneNumber" className="font-medium">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required={paymentMethod === 'mpesa' || paymentMethod === 'airtel'}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the phone number linked to your {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} account
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedSeats && selectedSeats.length > 0 ? (
                  selectedSeats.map((seat) => (
                    <div key={seat.number} className="flex justify-between items-center">
                      <span>Seat {seat.number}</span>
                      <span>KSh {(seat.fare || 0).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No seats selected
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary">KSh {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                `Pay KSh ${totalAmount.toLocaleString()}`
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
