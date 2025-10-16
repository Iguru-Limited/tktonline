"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "motion/react";
import { MapPin, ArrowLeft, Loader2, Bus, Grid3X3, List } from "lucide-react";
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

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [activeTab, setActiveTab] = useState("available");

  // Get trips data
  const trips = tripsData?.trips || [];
  const search_criteria = tripsData?.search_criteria;

  // Filtering logic
  const filteredTrips = useMemo(() => {
    if (!trips || trips.length === 0) return [];

    return trips.filter((trip) => {
      // Search by company name
      const matchesSearch = trip.company_name.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by category (vehicle_type)
      const matchesCategory = selectedCategory === "all" || trip.vehicle_type === selectedCategory;

      // Filter by tab (available/luxury/commuter)
      let matchesTab = true;
      if (activeTab === "luxury") {
        matchesTab = trip.vehicle_type.toLowerCase().includes("luxury");
      } else if (activeTab === "commuter") {
        matchesTab = trip.vehicle_type.toLowerCase().includes("commuter") ||
                     trip.vehicle_type.toLowerCase().includes("bus");
      }

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [trips, searchTerm, selectedCategory, activeTab]);

  // Get unique vehicle types for the category filter
  const vehicleTypes = useMemo(() => {
    if (!trips || trips.length === 0) return [];
    const types = new Set(trips.map(trip => trip.vehicle_type));
    return Array.from(types);
  }, [trips]);

  // Count trips by category for tabs
  const tripCounts = useMemo(() => {
    if (!trips || trips.length === 0) return { available: 0, luxury: 0, commuter: 0 };

    return {
      available: trips.length,
      luxury: trips.filter(t => t.vehicle_type.toLowerCase().includes("luxury")).length,
      commuter: trips.filter(t =>
        t.vehicle_type.toLowerCase().includes("commuter") ||
        t.vehicle_type.toLowerCase().includes("bus")
      ).length,
    };
  }, [trips]);

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
                        <p className="font-bold text-lg">{search_criteria?.from ?? ""}</p>
                      </div>
                    </div>

                    <div className="text-muted-foreground text-2xl">→</div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="font-bold text-lg">{search_criteria?.to ?? ""}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      {search_criteria?.date ?? ""}
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

          {/* Filters and Search */}
          {hasTrips && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-4 mb-6"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="w-full md:w-auto grid grid-cols-3">
                  <TabsTrigger value="available">
                    Available <span className="ml-1 text-xs text-muted-foreground">({tripCounts.available})</span>
                  </TabsTrigger>
                  <TabsTrigger value="luxury">
                    Luxury <span className="ml-1 text-xs text-muted-foreground">({tripCounts.luxury})</span>
                  </TabsTrigger>
                  <TabsTrigger value="commuter">
                    Commuter <span className="ml-1 text-xs text-muted-foreground">({tripCounts.commuter})</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Search provider, route, etc"
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="flex-1 sm:w-[150px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant={viewMode === 'card' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('card')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('table')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trips List or Empty State */}
          {hasTrips && search_criteria ? (
            <TripsList trips={filteredTrips} searchCriteria={search_criteria} viewMode={viewMode} />
          ) : (
            search_criteria && <EmptyTripsState searchCriteria={search_criteria} />
          )}
        </div>
      </div>
    </div>
  );
}
