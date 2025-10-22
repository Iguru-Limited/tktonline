"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import Calendar22 from "@/components/departure_date_picker/departure"
import Image from "next/image"

interface SearchStepProps {
  from: string
  to: string
  departureDate: Date | undefined
  tripType: "one-way" | "round-trip"
  fromError: string
  toError: string
  dateError: string
  isPending: boolean
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onDateChange: (date: Date | undefined) => void
  onTripTypeChange: (type: "one-way" | "round-trip") => void
  onSearch: () => void
}

export default function SearchStep({
  from,
  to,
  departureDate,
  tripType,
  fromError,
  toError,
  dateError,
  isPending,
  onFromChange,
  onToChange,
  onDateChange,
  onTripTypeChange,
  onSearch
}: SearchStepProps) {
  return (
    <section className="relative w-full h-screen bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black">
        <Image
          src={"/images/bus_travel.jpg"}
          alt="a bus"
          fill
          className="object-cover opacity-50"
        />
      </div>
      <div className="relative z-10 flex flex-col max-w-4xl mx-auto container w-full pt-16 sm:pt-24 lg:pt-32 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Discover and book your travel <span className="">Ticket</span> Today.
          </h1>
          <p className="text-lg sm:text-xl text-white opacity-90">
            Get started by entering your destinations.
          </p>
        </div>
        
        <Card className="h-auto sm:h-56 p-4 sm:p-6">
          <CardContent>
            <div>
              <RadioGroup
                value={tripType === "one-way" ? "option-one" : "option-two"}
                onValueChange={(value) =>
                  onTripTypeChange(
                    value === "option-one" ? "one-way" : "round-trip"
                  )
                }
                className="flex flex-row">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">One Way</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">Round Trip</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4">
              <div className="grid w-full sm:max-w-sm items-center gap-3">
                <Label htmlFor="from_location" className="font-bold text-primary">
                  From
                </Label>
                <Input
                  id="from_location"
                  type="text"
                  value={from}
                  onChange={(e) => onFromChange(e.target.value)}
                  placeholder="e.g., Nairobi"
                  className={
                    fromError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {fromError && (
                  <p className="text-sm text-red-500 mt-1">{fromError}</p>
                )}
              </div>
              <div className="grid w-full sm:max-w-sm items-center gap-3">
                <Label htmlFor="to_location" className="font-bold text-primary">
                  To
                </Label>
                <Input
                  id="to_location"
                  type="text"
                  value={to}
                  onChange={(e) => onToChange(e.target.value)}
                  placeholder="e.g., Mombasa"
                  className={
                    toError ? "border-red-500 focus-visible:ring-red-500" : ""
                  }
                />
                {toError && (
                  <p className="text-sm text-red-500 mt-1">{toError}</p>
                )}
              </div>
              <div className="w-full sm:w-auto">
                <Calendar22
                  date={departureDate}
                  onDateChange={onDateChange}
                  error={dateError}
                  isPreDateDisabled={true}
                />
                {dateError && (
                  <p className="text-sm text-red-500 mt-1">{dateError}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col align-middle justify-center">
            <Button
              disabled={isPending}
              onClick={onSearch}
              className="flex h-12 w-full sm:w-32 rounded-2xl align-bottom hover:scale-105 transition-transform duration-200 ease-in-out bg-primary text-white font-bold">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
