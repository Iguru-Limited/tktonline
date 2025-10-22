"use client"

import React from 'react'
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Bus } from "lucide-react"

interface Trip {
  trip_id: number
  company_id: number
  company_name: string
  route_name: string
  vehicle_type: string
  departure_time: string
  fare: number
  available_seats: number
}

interface ProvidersStepProps {
  trips: Trip[]
  onSelectProvider: (trip: Trip) => void
  onBack: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
}

export default function ProvidersStep({ trips, onSelectProvider, onBack }: ProvidersStepProps) {
  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return date.toLocaleTimeString('en-KE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch {
      return dateTimeString
    }
  }

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Trips</h2>
            <p className="text-gray-600">Choose your preferred bus company</p>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← Back to Search
          </Button>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trips.map((trip) => (
            <motion.div key={trip.trip_id} variants={cardVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate">{trip.company_name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{trip.route_name}</span>
                      </div>
                      <Badge variant="secondary">{trip.vehicle_type}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatTime(trip.departure_time)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        KES {trip.fare.toLocaleString()}
                      </span>
                      <Button 
                        onClick={() => onSelectProvider(trip)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
