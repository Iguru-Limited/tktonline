"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar22 from "@/components/departure_date_picker/departure";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DesktopHeader from "@/components/desktop-header";
import MobileHeader from "@/components/mobile-header";
import Image from "next/image";
import { useSearch } from "@/contexts/SearchContext";

export default function Home() {
  const router = useRouter();
  const { setSearchData } = useSearch();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) {
      alert('Please enter both departure and destination locations');
      return;
    }

    // Set search data in context
    setSearchData({
      from: from.trim(),
      to: to.trim(),
      tripType,
      departureDate: new Date().toISOString().split('T')[0], // Default to today
      returnDate: tripType === 'round-trip' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
    });

    // Navigate to providers page
    router.push('/providers');
  };

  return (
    // home page 
    <div className="flex flex-col justify-center">
      {/* header-home-section */}
      <DesktopHeader />
      <MobileHeader />
      {/* trip and bus search card */}
      <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black">
          <Image
            src={"/images/bus_travel.jpg"}
            alt="a bus"
            fill
            className="object-cover opacity-50"
          />

        </div>
        <div className="relative z-10 flex flex-col max-w-4xl mx-auto container w-full pt-16 sm:pt-24 lg:pt-32 px-4">
          {/* Main Title and Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Discover and book your travel <span className="">Ticket</span> Today.
            </h1>
            <p className="text-lg sm:text-xl text-white opacity-90">
              Get started by entering your destinations.
            </p>
          </div>
          {/* booking section */}
          <Card className="h-auto sm:h-56 p-4 sm:p-6">
            <CardContent>
              <div>
                <RadioGroup 
                  value={tripType === 'one-way' ? 'option-one' : 'option-two'} 
                  onValueChange={(value) => setTripType(value === 'option-one' ? 'one-way' : 'round-trip')}
                  className="flex felx-row"
                >
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
              <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4 ">
                <div className="grid w-full sm:max-w-sm items-center gap-3">
                  <Label htmlFor="from_location" className="font-bold text-primary">From</Label>
                  <Input 
                    id="from_location" 
                    type="text" 
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="e.g., Nairobi"
                  />
                </div>
                <div className="grid w-full sm:max-w-sm items-center gap-3">
                  <Label htmlFor="to_location" className="font-bold text-primary">To</Label>
                  <Input 
                    id="to_location" 
                    type="text" 
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g., Mombasa"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Calendar22 />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col align-middle justify-center">
              <Button 
                onClick={handleSearch}
                className="flex h-12 w-full sm:w-32 rounded-2xl align-bottom"
              >
                Search
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
