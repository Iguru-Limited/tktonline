"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types based on the API response structure
export interface Trip {
  trip_id: number;
  company_id: number;
  company_name: string;
  route_id: number;
  route_name: string;
  plate_number: string;
  vehicle_type: string;
  trip_date: string | null;
  departure_time: string;
  available_seats: number;
  to_destination?: string;
  from_destination?: string;
  fare: number;
}

export interface SearchCriteria {
  from: string;
  to: string;
  date: string;
}

export interface TripsData {
  search_criteria: SearchCriteria;
  trips: Trip[];
}

export interface TripsResponse {
  success: boolean;
  data: TripsData;
}

interface TripsContextType {
  tripsData: TripsData | null;
  setTripsData: (data: TripsData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearTripsData: () => void;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [tripsData, setTripsData] = useState<TripsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearTripsData = () => {
    setTripsData(null);
    setIsLoading(false);
  };

  return (
    <TripsContext.Provider
      value={{
        tripsData,
        setTripsData,
        isLoading,
        setIsLoading,
        clearTripsData,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripsContext);
  if (context === undefined) {
    throw new Error("useTrips must be used within a TripsProvider");
  }
  return context;
}
