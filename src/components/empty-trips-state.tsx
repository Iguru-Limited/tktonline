"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { SearchX, ArrowLeft, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface EmptyTripsStateProps {
  searchCriteria: {
    from: string;
    to: string;
    date: string;
  };
}

export default function EmptyTripsState({ searchCriteria }: EmptyTripsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <Card className="max-w-2xl w-full border-dashed border-2">
        <CardContent className="pt-12 pb-12 px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="rounded-full bg-muted p-6">
              <SearchX className="h-16 w-16 text-muted-foreground" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-3">
              No Trips Available
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any trips matching your search criteria. This could be because:
            </p>

            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Route: {searchCriteria.from} → {searchCriteria.to}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No operators currently serve this route
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Date: {searchCriteria.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All trips may be fully booked for this date
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground mb-4">Try one of these options:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="default" size="lg" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Try Different Search
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  Select Another Date
                </Button>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
