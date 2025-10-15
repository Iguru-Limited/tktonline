"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { motion, AnimatePresence } from "motion/react"
import { Grid3X3, List, Bus, MapPin, Clock, Star, ArrowLeft } from "lucide-react"
import Image from "next/image"
import DesktopHeader from "@/components/desktop-header"
import MobileHeader from "@/components/mobile-header"
import { useSearch } from "@/contexts/SearchContext"
import { useBooking } from "@/contexts/BookingContext"
import Link from "next/link"
import { useRouter } from "next/navigation"

const transportProviders = [
	{
		id: 1,
		name: "Chania Sacco",
		category: "Bus Service",
		status: "Available",
		routes: "Nairobi - Kisumu",
		departureTime: "06:00 AM, 02:00 PM, 08:00 PM",
		price: 2500,
		rating: 4.5,
		image: "/images/bus.jpg",
		description: "Reliable daily bus service with comfortable seating",
		amenities: ["WiFi", "AC", "Toilet", "Refreshments"]
	},
	{
		id: 2,
		name: "Easy Coach",
		category: "Luxury Bus",
		status: "Available",
		routes: "Nairobi - Mombasa",
		departureTime: "08:00 AM, 10:00 AM, 02:00 PM",
		price: 3500,
		rating: 4.8,
		image: "/images/bus_travel.jpg",
		description: "Premium luxury coach with entertainment system",
		amenities: ["WiFi", "AC", "Entertainment", "Meals", "Toilet"]
	},
	{
		id: 3,
		name: "Modern Coast Express",
		category: "Bus Service",
		status: "Available",
		routes: "Nairobi - Nakuru",
		departureTime: "07:00 AM, 01:00 PM, 05:00 PM",
		price: 1800,
		rating: 4.2,
		image: "/images/bus.jpg",
		description: "Fast and efficient transport to the Rift Valley",
		amenities: ["AC", "Toilet", "Refreshments"]
	},
	{
		id: 4,
		name: "Tahmeed Bus",
		category: "Bus Service",
		status: "Available",
		routes: "Nairobi - Eldoret",
		departureTime: "06:30 AM, 12:00 PM, 06:00 PM",
		price: 2200,
		rating: 4.3,
		image: "/images/bus_travel.jpg",
		description: "Comfortable journey to the North Rift region",
		amenities: ["WiFi", "AC", "Toilet"]
	},
	{
		id: 5,
		name: "Dreamline Express",
		category: "Luxury Bus",
		status: "Available",
		routes: "Nairobi - Kisii",
		departureTime: "08:30 AM, 02:30 PM, 07:30 PM",
		price: 2800,
		rating: 4.6,
		image: "/images/bus.jpg",
		description: "Premium service to South Nyanza region",
		amenities: ["WiFi", "AC", "Entertainment", "Refreshments", "Toilet"]
	},
	{
		id: 6,
		name: "Guardian Bus",
		category: "Bus Service",
		status: "Available",
		routes: "Nairobi - Meru",
		departureTime: "07:30 AM, 01:30 PM, 05:30 PM",
		price: 2000,
		rating: 4.1,
		image: "/images/bus_travel.jpg",
		description: "Reliable transport to Eastern Kenya",
		amenities: ["AC", "Toilet", "Refreshments"]
	},
	{
		id: 7,
		name: "Jaguar Express",
		category: "Bus Service",
		status: "Available",
		routes: "Nairobi - Kakamega",
		departureTime: "09:00 AM, 03:00 PM, 08:00 PM",
		price: 2300,
		rating: 4.4,
		image: "/images/bus.jpg",
		description: "Fast service to Western Kenya",
		amenities: ["WiFi", "AC", "Toilet"]
	},
	{
		id: 8,
		name: "Nairobi Bus Services",
		category: "Bus Service",
		status: "Available",
		routes: "Nairobi - Thika",
		departureTime: "Every 30 minutes from 06:00 AM",
		price: 150,
		rating: 4.0,
		image: "/images/bus_travel.jpg",
		description: "Frequent commuter service to Thika",
		amenities: ["AC"]
	},
]

const ServiceProvidersPage = () => {
	const { searchData } = useSearch()
	const { updateProvider } = useBooking()
	const router = useRouter()
	const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [searchTerm, setSearchTerm] = useState('')

	const handleBookNow = (provider: typeof transportProviders[0]) => {
		updateProvider({
			id: provider.id,
			name: provider.name,
			category: provider.category,
			routes: provider.routes,
			price: provider.price,
			rating: provider.rating
		})
		router.push('/booking')
	}

	// Filter providers based on search data from home page and local filters
	const filteredProviders = transportProviders.filter(provider => {
		// Filter by search data from home page (from/to locations)
		const matchesSearchData = !searchData.from || !searchData.to ||
			provider.routes.toLowerCase().includes(searchData.from.toLowerCase()) ||
			provider.routes.toLowerCase().includes(searchData.to.toLowerCase())

		// Filter by local search term
		const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			provider.routes.toLowerCase().includes(searchTerm.toLowerCase())

		// Filter by category
		const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory

		return matchesSearchData && matchesSearch && matchesCategory
	})

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header Section - Same as home page */}
			<DesktopHeader />
			<MobileHeader />

			{/* Main Content */}
			<div className="flex-1 p-6 bg-muted">
				<div className="container mx-auto">
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
					{searchData.from && searchData.to && (
						<Card className="bg-primary/5 border-primary/20">
							<CardContent className="pt-4">
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4 text-primary shrink-0" />
										<span className="font-medium truncate">{searchData.from}</span>
									</div>
									<div className="text-muted-foreground hidden sm:block">→</div>
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4 text-primary shrink-0" />
										<span className="font-medium truncate">{searchData.to}</span>
									</div>
									<div className="sm:ml-auto">
										<Badge variant="outline">{searchData.tripType}</Badge>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</motion.div>

				{/* Page Title */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="mb-8"
				>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Transport Providers</h1>
					<p className="text-gray-600">
						{searchData.from && searchData.to
							? `Available providers from ${searchData.from} to ${searchData.to}`
							: "Book your journey with trusted Kenyan transport providers"
						}
					</p>
				</motion.div>

				{/* Filters and Search */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="flex flex-col gap-4 mb-6"
				>
					<Tabs defaultValue="available" className="w-full md:w-auto">
						<TabsList className="w-full md:w-auto grid grid-cols-3">
							<TabsTrigger value="available">Available <span className="ml-1 text-xs text-muted-foreground">({filteredProviders.length})</span></TabsTrigger>
							<TabsTrigger value="luxury">Luxury <span className="ml-1 text-xs text-muted-foreground">(3)</span></TabsTrigger>
							<TabsTrigger value="commuter">Commuter <span className="ml-1 text-xs text-muted-foreground">(5)</span></TabsTrigger>
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
									<SelectItem value="Bus Service">Bus Service</SelectItem>
									<SelectItem value="Luxury Bus">Luxury Bus</SelectItem>
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

				{/* Content based on view mode */}
				<AnimatePresence mode="wait">
					{viewMode === 'card' ? (
						<motion.div
							key="card-view"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.3 }}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
						>
							{filteredProviders.map((provider, index) => (
								<motion.div
									key={provider.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									whileHover={{ y: -5 }}
								>
									<Card className="relative overflow-hidden h-full">
										<div className="h-48 w-full bg-muted rounded-t-md overflow-hidden relative">
											<Image
												src={provider.image}
												alt={provider.name}
												fill
												className="object-cover"
											/>
											<Badge className="absolute top-3 left-3">{provider.category}</Badge>
											<Badge variant="secondary" className="absolute top-3 right-3">{provider.status}</Badge>
											<div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
												<Star className="h-3 w-3 text-yellow-400 fill-current" />
												<span className="text-white text-xs">{provider.rating}</span>
											</div>
										</div>
										<CardContent className="pt-4 pb-2">
											<CardTitle className="text-lg font-semibold mb-2">{provider.name}</CardTitle>
											<div className="space-y-2 text-sm text-muted-foreground">
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													<span>{provider.routes}</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4" />
													<span>{provider.departureTime}</span>
												</div>
												<p className="text-xs mt-2">{provider.description}</p>
											</div>
										</CardContent>
										<CardContent className="pt-0 pb-4">
											<div className="flex items-center justify-between">
												<div className="text-2xl font-bold text-primary">
													KSh {provider.price.toLocaleString()}
												</div>
												<Button onClick={() => handleBookNow(provider)}>
													<Bus className="h-4 w-4 mr-2" />
													Book Now
												</Button>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</motion.div>
					) : (
						<motion.div
							key="table-view"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
						>
							{filteredProviders.map((provider, index) => (
								<motion.div
									key={provider.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: index * 0.05 }}
									whileHover={{ x: 5 }}
								>
									<Card className="p-4">
										<div className="flex flex-col sm:flex-row sm:items-center gap-4">
											<div className="flex items-start gap-4 flex-1 min-w-0">
												<div className="h-16 w-16 rounded-lg overflow-hidden relative shrink-0">
													<Image
														src={provider.image}
														alt={provider.name}
														fill
														className="object-cover"
													/>
												</div>
												<div className="space-y-1 min-w-0 flex-1">
													<div className="flex flex-wrap items-center gap-2">
														<h3 className="font-semibold truncate">{provider.name}</h3>
														<Badge className="shrink-0">{provider.category}</Badge>
														<div className="flex items-center gap-1 shrink-0">
															<Star className="h-3 w-3 text-yellow-400 fill-current" />
															<span className="text-xs">{provider.rating}</span>
														</div>
													</div>
													<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
														<div className="flex items-center gap-1 min-w-0">
															<MapPin className="h-3 w-3 shrink-0" />
															<span className="truncate">{provider.routes}</span>
														</div>
														<div className="flex items-center gap-1 min-w-0">
															<Clock className="h-3 w-3 shrink-0" />
															<span className="truncate">{provider.departureTime}</span>
														</div>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
												<div className="text-left sm:text-right">
													<div className="text-xl font-bold text-primary whitespace-nowrap">
														KSh {provider.price.toLocaleString()}
													</div>
													<div className="text-xs text-muted-foreground">per person</div>
												</div>
												<Button onClick={() => handleBookNow(provider)} className="shrink-0">
													<Bus className="h-4 w-4 mr-2" />
													Book Now
												</Button>
											</div>
										</div>
									</Card>
								</motion.div>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Pagination */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4"
				>
					<div className="text-sm text-muted-foreground">
						Showing {filteredProviders.length} of {transportProviders.length} providers
					</div>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationLink isActive>1</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>2</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink>3</PaginationLink>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</motion.div>
				</div>
			</div>
		</div>
	)
}

export default ServiceProvidersPage