"use client";

import React, { useState } from "react";
import DesktopHeader from "@/components/desktop-header";
import MobileHeader from "@/components/mobile-header";
import SearchStep from "@/components/booking-steps/SearchStep";
import ProvidersStep from "@/components/booking-steps/ProvidersStep";
import SeatsStep from "@/components/booking-steps/SeatsStep";
import PaymentStep from "@/components/booking-steps/PaymentStep";
import ReceiptStep from "@/components/booking-steps/ReceiptStep";
import { useSearch } from "@/contexts/SearchContext";
import { useTrips } from "@/contexts/TripsContext";
import { useBooking } from "@/contexts/BookingContext";
import { fetchDynamicReport, fetchTripDetails } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import type { TripsResponse } from "@/contexts/TripsContext";

type BookingStage = 'search' | 'providers' | 'seats' | 'payment' | 'receipt';

interface Trip {
  trip_id: number;
  company_id: number;
  company_name: string;
  route_name: string;
  vehicle_type: string;
  departure_time: string;
  fare: number;
  available_seats: number;
}

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

export default function Home() {
  const { setSearchData } = useSearch();
  const { setTripsData, setIsLoading } = useTrips();
  const { updateProvider, updateVehicle, completeBooking } = useBooking();
  
  // Main state
  const [currentStage, setCurrentStage] = useState<BookingStage>('search');
  
  // Search state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");
  const [dateError, setDateError] = useState("");
  
  // Trip data
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  // Search mutation
  const { isPending, mutate } = useMutation<TripsResponse, Error, { from: string; to: string; date: string }>({
    mutationKey: ["trips"],
    mutationFn: fetchDynamicReport,
    onMutate: () => {
      setIsLoading(true);
    },
    onError: (error) => {
      console.log("Error fetching trips:", error);
      setIsLoading(false);
    },
    onSuccess: (data) => {
      console.log("Trips fetched successfully:", data);
      setTrips(data.data?.trips || []);
      setTripsData(data.data);
      setIsLoading(false);
      setCurrentStage('providers');
    },
  });

  // Search handler
  const handleSearch = () => {
    // Clear previous errors
    setFromError("");
    setToError("");
    setDateError("");

    // Validate inputs
    if (!from.trim()) {
      setFromError("Please enter departure location");
      return;
    }
    if (!to.trim()) {
      setToError("Please enter destination");
      return;
    }
    if (!departureDate) {
      setDateError("Please select departure date");
      return;
    }

    // Update search context
    setSearchData({
      from: from.trim(),
      to: to.trim(),
      tripType,
      departureDate: departureDate?.toISOString(),
      returnDate: undefined
    });

    // Format date for API (use local timezone to avoid date shifting)
    const year = departureDate.getFullYear();
    const month = String(departureDate.getMonth() + 1).padStart(2, '0');
    const day = String(departureDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // Trigger search
    mutate({ from: from.trim(), to: to.trim(), date: formattedDate });
  };

  // Provider selection handler
  const handleProviderSelect = async (trip: Trip) => {
    updateProvider({
      id: trip.company_id,
      name: trip.company_name,
      category: trip.vehicle_type,
      routes: trip.route_name,
      price: trip.fare,
      rating: 4.5,
      trip_id: trip.trip_id,
      company_id: trip.company_id
    });

    setCurrentStage('seats');
    
    // Fetch trip details for seat selection
    try {
      const tripDetails = await fetchTripDetails(trip.company_id, trip.trip_id);
      const baseFare = trip.fare;
      const transformedVehicle = transformTripData(tripDetails as TripDetails, baseFare);
      setVehicle(transformedVehicle);
      updateVehicle(transformedVehicle as unknown as Parameters<typeof updateVehicle>[0]);
    } catch (err) {
      console.error('Error fetching trip details:', err);
    }
  };

  // Seat confirmation handler
  const handleSeatsConfirm = () => {
    setCurrentStage('payment');
  };

  // Payment completion handler
  const handlePaymentComplete = () => {
    completeBooking();
    setCurrentStage('receipt');
  };

  // Navigation handlers
  const handleBackToSearch = () => setCurrentStage('search');
  const handleBackToProviders = () => setCurrentStage('providers');
  const handleBackToSeats = () => setCurrentStage('seats');
  const handleBackToPayment = () => setCurrentStage('payment');

  // Helper function to transform trip data
  const transformTripData = (tripDetails: TripDetails, baseFare: number): Vehicle => {
    const { trip, seats, vehicle_configuration } = tripDetails;
    
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
      duration: 'TBD',
      seats: seats.map((seat) => ({
        number: seat.number,
        row: seat.row,
        col: seat.col,
        status: seat.status as "available" | "booked",
        fare: baseFare,
        destination: seat.destination
      })),
      vehicleConfiguration: {
        id: vehicle_configuration.id,
        layout: vehicle_configuration.layout
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Headers */}
      <DesktopHeader />
      <MobileHeader />
      
      {/* All steps mounted, visibility controlled by CSS */}
      <div style={{ display: currentStage === 'search' ? 'block' : 'none' }}>
        <SearchStep
          from={from}
          to={to}
          departureDate={departureDate}
          tripType={tripType}
          fromError={fromError}
          toError={toError}
          dateError={dateError}
          isPending={isPending}
          onFromChange={(value) => {
            setFrom(value);
            if (fromError) setFromError("");
          }}
          onToChange={(value) => {
            setTo(value);
            if (toError) setToError("");
          }}
          onDateChange={(date) => {
            setDepartureDate(date);
            if (dateError) setDateError("");
          }}
          onTripTypeChange={setTripType}
          onSearch={handleSearch}
        />
      </div>
      
      <div style={{ display: currentStage === 'providers' ? 'block' : 'none' }}>
        <ProvidersStep
          trips={trips}
          onSelectProvider={handleProviderSelect}
          onBack={handleBackToSearch}
        />
      </div>
      
            <div style={{ display: currentStage === 'seats' ? 'block' : 'none' }}>
              {vehicle ? (
                <SeatsStep
                  vehicle={vehicle}
                  onConfirm={handleSeatsConfirm}
                  onBack={handleBackToProviders}
                />
              ) : (
                <div className="container mx-auto p-6 max-w-2xl text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading vehicle details...</p>
                </div>
              )}
            </div>
      
      <div style={{ display: currentStage === 'payment' ? 'block' : 'none' }}>
        <PaymentStep
          onComplete={handlePaymentComplete}
          onBack={handleBackToSeats}
        />
      </div>
      
      <div style={{ display: currentStage === 'receipt' ? 'block' : 'none' }}>
        <ReceiptStep
          onNewBooking={handleBackToSearch}
          onBack={handleBackToPayment}
        />
      </div>
    </div>
  );
}