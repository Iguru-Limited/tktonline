// Removed unused imports

interface CustomerDetails {
  fullName: string
  idNumber: string
  mobilePhone: string
}

interface Seat {
  number: string
  fare: number | null
}

interface BookingData {
  provider: {
    name: string
    category: string
    routes: string
  }
  vehicle: {
    name: string
    type: string
    departureTime: string
    arrivalTime: string
    duration: string
  }
  selectedSeats: Seat[]
  customerDetails: CustomerDetails
  bookingReference: string
  totalAmount: number
  paymentMethod: string
  // Add boarding point and terminal information
  boardingPoint?: {
    name: string
    terminal: string
    address?: string
    boardingTime?: string
  }
  // Add route details with full location names
  routeDetails?: {
    origin: {
      code: string
      name: string
      terminal?: string
    }
    destination: {
      code: string
      name: string
      terminal?: string
    }
  }
}

export const generateTicketPDF = async (bookingData: BookingData): Promise<void> => {
  try {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      throw new Error('PDF generation must be called on the client side')
    }
    
    // Validate booking data
    if (!bookingData) {
      throw new Error('Booking data is required')
    }
    
    if (!bookingData.provider || !bookingData.vehicle || !bookingData.customerDetails) {
      throw new Error('Incomplete booking data provided')
    }
    
    if (!bookingData.bookingReference) {
      throw new Error('Booking reference is required')
    }
    
    // Force reload of React PDF modules to avoid conflicts
    // Clear any cached modules to prevent conflicts
    if (typeof window !== 'undefined' && (window as unknown as { __react_pdf_cache?: unknown }).__react_pdf_cache) {
      delete (window as unknown as { __react_pdf_cache?: unknown }).__react_pdf_cache
    }
    
    let blob: Blob | undefined
    let retryCount = 0
    const maxRetries = 2
    
    while (retryCount <= maxRetries) {
      try {
        const { pdf } = await import('@react-pdf/renderer')
        const { createTicketDocument } = await import('./ticketGeneratorReactPDF')
        
        // Generate PDF using React PDF
        const ticketDocument = createTicketDocument(bookingData)
        blob = await pdf(ticketDocument as unknown as Parameters<typeof pdf>[0]).toBlob()
        break
      } catch (error) {
        retryCount++
        if (retryCount > maxRetries) {
          throw error
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    if (!blob) {
      throw new Error('Failed to generate PDF after multiple attempts')
    }
    
    // Create URL and open PDF
    const pdfUrl = URL.createObjectURL(blob)
    
    // Open in new tab
    const newWindow = window.open(pdfUrl, '_blank')
    if (!newWindow) {
      // Fallback if popup blocked
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `ticket-${bookingData.bookingReference}.pdf`
      link.click()
    }
    
    // Clean up the URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl)
    }, 1000)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
