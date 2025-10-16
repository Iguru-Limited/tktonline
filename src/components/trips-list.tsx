"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Bus, Clock, MapPin, Users, Banknote, Calendar } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { Trip } from "@/contexts/TripsContext";

interface TripsListProps {
  trips: Trip[];
  searchCriteria: {
    from: string;
    to: string;
    date: string;
  };
  viewMode?: "card" | "table";
}

export default function TripsList({ trips, viewMode = "card" }: TripsListProps) {
  const { updateProvider } = useBooking();
  const router = useRouter();

  const handleBookNow = (trip: Trip) => {
    updateProvider({
      id: trip.trip_id,
      name: trip.company_name,
      category: trip.vehicle_type,
      routes: trip.route_name,
      price: trip.fare,
      rating: 4.5, // Default rating as it's not in the API response
    });
    router.push("/booking");
  };

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return format(date, "hh:mm a");
    } catch {
      return dateTimeString;
    }
  };

  // Group trips by company
  const tripsByCompany = trips.reduce(
    (acc, trip) => {
      const companyName = trip.company_name;
      if (!acc[companyName]) {
        acc[companyName] = [];
      }
      acc[companyName].push(trip);
      return acc;
    },
    {} as Record<string, Trip[]>
  );

  // Table view component
  const TableView = () => (
    <div className="space-y-6">
      {Object.entries(tripsByCompany).map(([companyName, companyTrips], companyIndex) => (
        <motion.div
          key={companyName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: companyIndex * 0.1 }}
        >
          {/* Company Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              {companyName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {companyTrips.length} {companyTrips.length === 1 ? "trip" : "trips"} available
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Vehicle</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Departure</th>
                  <th className="text-left p-3 font-semibold">Route</th>
                  <th className="text-left p-3 font-semibold">Seats</th>
                  <th className="text-right p-3 font-semibold">Fare</th>
                  <th className="text-center p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {companyTrips.map((trip) => (
                  <motion.tr
                    key={trip.trip_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3 font-medium">{trip.plate_number}</td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-xs">
                        {trip.vehicle_type}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {formatTime(trip.departure_time)}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground truncate max-w-[200px]">
                      {trip.route_name}
                    </td>
                    <td className="p-3">
                      <span className="text-sm">
                        {trip.available_seats}
                        {trip.available_seats <= 5 && trip.available_seats > 0 && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Low
                          </Badge>
                        )}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-primary">
                      KSh {trip.fare.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        onClick={() => handleBookNow(trip)}
                        disabled={trip.available_seats === 0}
                        size="sm"
                      >
                        {trip.available_seats === 0 ? "Sold Out" : "Book"}
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Card view component
  const CardView = () => (
    <div className="space-y-6">
      {Object.entries(tripsByCompany).map(([companyName, companyTrips], companyIndex) => (
        <motion.div
          key={companyName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: companyIndex * 0.1 }}
        >
          {/* Company Header */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              {companyName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {companyTrips.length} {companyTrips.length === 1 ? "trip" : "trips"} available
            </p>
          </div>

          {/* Trips Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {companyTrips.map((trip, tripIndex) => (
              <motion.div
                key={trip.trip_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: tripIndex * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    {/* Trip Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {trip.vehicle_type}
                          </Badge>
                          {trip.available_seats <= 5 && trip.available_seats > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Only {trip.available_seats} seats left
                            </Badge>
                          )}
                          {trip.available_seats === 0 && (
                            <Badge variant="outline" className="text-xs border-red-500 text-red-500">
                              Sold Out
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-lg text-foreground truncate">
                          {trip.plate_number}
                        </h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          KSh {trip.fare.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">per seat</div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{trip.route_name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>Departure: {formatTime(trip.departure_time)}</span>
                        </div>
                      </div>

                      {trip.trip_date && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>{format(new Date(trip.trip_date), "MMM dd, yyyy")}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 shrink-0" />
                          <span>
                            {trip.available_seats} {trip.available_seats === 1 ? "seat" : "seats"} available
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleBookNow(trip)}
                      disabled={trip.available_seats === 0}
                      className="w-full"
                      size="lg"
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      {trip.available_seats === 0 ? "Sold Out" : "Book Now"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return viewMode === "table" ? <TableView /> : <CardView />;
}
