"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Bus, Clock, MapPin, Users, Banknote, Calendar, Star } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { Trip } from "@/contexts/TripsContext";
import CompanyLogo from "./company-logo";

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

  return (
    <AnimatePresence mode="wait">
      {viewMode === "card" ? (
        <motion.div
          key="card-view"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {trips.map((trip, index) => (
            <motion.div
              key={trip.trip_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
                {/* Company Header with Logo */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
                  <div className="flex items-center gap-3">
                    <CompanyLogo name={trip.company_name} size="sm" />
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
                  {/* Vehicle Type and Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {trip.vehicle_type}
                    </Badge>
                    {trip.available_seats <= 5 && trip.available_seats > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Only {trip.available_seats} left
                      </Badge>
                    )}
                    {trip.available_seats === 0 && (
                      <Badge variant="outline" className="text-xs border-red-500 text-red-500">
                        Sold Out
                      </Badge>
                    )}
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate text-muted-foreground">{trip.route_name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{formatTime(trip.departure_time)}</span>
                    </div>

                    {trip.trip_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{format(new Date(trip.trip_date), "MMM dd, yyyy")}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">
                        {trip.available_seats} {trip.available_seats === 1 ? "seat" : "seats"}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground pt-1">
                      Vehicle: {trip.plate_number}
                    </div>
                  </div>

                  {/* Price and Book Button */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        KSh {trip.fare.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">per seat</div>
                    </div>
                    <Button
                      onClick={() => handleBookNow(trip)}
                      disabled={trip.available_seats === 0}
                      size="sm"
                    >
                      <Bus className="h-4 w-4 mr-1" />
                      {trip.available_seats === 0 ? "Sold Out" : "Book"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="list-view"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {trips.map((trip, index) => (
            <motion.div
              key={trip.trip_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Company Logo and Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <CompanyLogo name={trip.company_name} size="md" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-lg truncate">{trip.company_name}</h3>
                        <Badge variant="secondary" className="shrink-0 text-xs">{trip.vehicle_type}</Badge>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs">4.5</span>
                        </div>
                        {trip.available_seats <= 5 && trip.available_seats > 0 && (
                          <Badge variant="destructive" className="text-xs shrink-0">
                            Only {trip.available_seats} seats left
                          </Badge>
                        )}
                        {trip.available_seats === 0 && (
                          <Badge variant="outline" className="text-xs border-red-500 text-red-500 shrink-0">
                            Sold Out
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{trip.route_name}</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="truncate">{formatTime(trip.departure_time)}</span>
                        </div>
                        {trip.trip_date && (
                          <div className="flex items-center gap-1 min-w-0">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span className="truncate">{format(new Date(trip.trip_date), "MMM dd")}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 min-w-0">
                          <Users className="h-3 w-3 shrink-0" />
                          <span>{trip.available_seats} seats</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Vehicle: {trip.plate_number}
                      </div>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                    <div className="text-left sm:text-right">
                      <div className="text-2xl font-bold text-primary whitespace-nowrap">
                        KSh {trip.fare.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">per seat</div>
                    </div>
                    <Button
                      onClick={() => handleBookNow(trip)}
                      disabled={trip.available_seats === 0}
                      className="shrink-0"
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      {trip.available_seats === 0 ? "Sold Out" : "Book Now"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
