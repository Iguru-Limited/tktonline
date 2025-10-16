"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { MapPin, ArrowLeft, Loader2, Bus } from "lucide-react";
import DesktopHeader from "@/components/desktop-header";
import MobileHeader from "@/components/mobile-header";
import { useTrips } from "@/contexts/TripsContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TripsList from "@/components/trips-list";
import EmptyTripsState from "@/components/empty-trips-state";

export default function ProvidersPage() {
  const { tripsData, isLoading } = useTrips();
  const router = useRouter();

  // Redirect to home if no trips data
  useEffect(() => {
    if (!isLoading && !tripsData) {
      router.push("/");
    }
  }, [tripsData, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DesktopHeader />
        <MobileHeader />
        <div className="flex-1 flex items-center justify-center bg-muted">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Searching for available trips...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If no data, show loading or redirect
  if (!tripsData) {
    return null;
  }

  const { search_criteria, trips } = tripsData;
  const hasTrips = trips && trips.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <DesktopHeader />
      <MobileHeader />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-muted">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button and Search Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
            </div>

            {/* Search Criteria Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="font-bold text-lg">{search_criteria.from}</p>
                      </div>
                    </div>

                    <div className="text-muted-foreground text-2xl">→</div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="font-bold text-lg">{search_criteria.to}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      {search_criteria.date}
                    </Badge>
                    {hasTrips && (
                      <Badge className="text-sm px-4 py-2">
                        <Bus className="h-3 w-3 mr-1" />
                        {trips.length} {trips.length === 1 ? "Trip" : "Trips"} Found
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Page Title */}
          {hasTrips && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Available Trips
              </h1>
              <p className="text-muted-foreground">
                Select your preferred trip and proceed to book your seat
              </p>
            </motion.div>
          )}

          {/* Trips List or Empty State */}
          {hasTrips ? (
            <TripsList trips={trips} searchCriteria={search_criteria} />
          ) : (
            <EmptyTripsState searchCriteria={search_criteria} />
          )}
        </div>
      </div>
    </div>
  );
}
