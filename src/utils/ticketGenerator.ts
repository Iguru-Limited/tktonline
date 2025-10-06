import jsPDF from 'jspdf'

interface CustomerDetails {
  fullName: string
  idNumber: string
  mobilePhone: string
}

interface Seat {
  id: string
  number: string
  price: number
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
}

export const generateTicketPDF = (bookingData: BookingData): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  // Colors
  const primaryColor = '#F59E0B' // amber-500
  const darkGray = '#374151'
  const lightGray = '#9CA3AF'
  const backgroundColor = '#F9FAFB'
  
  // Set background
  doc.setFillColor(backgroundColor)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')
  
  // Header Section
  doc.setFillColor(primaryColor)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  // Logo/Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('tkt.ke', 20, 25)
  
  // Receipt number and date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Booking #${bookingData.bookingReference}`, pageWidth - 20, 15, { align: 'right' })
  doc.text(new Date().toLocaleDateString('en-KE'), pageWidth - 20, 25, { align: 'right' })
  
  // Thank you message
  doc.setTextColor(darkGray)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Thank you for your booking!', 20, 60)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Your ticket has been confirmed and is ready for travel.', 20, 70)
  
  // Separator line
  doc.setDrawColor(lightGray)
  doc.setLineWidth(0.5)
  doc.line(20, 80, pageWidth - 20, 80)
  
  // Journey Details Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Journey Details', 20, 95)
  
  // Provider info
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Provider: ${bookingData.provider.name}`, 20, 105)
  doc.text(`Service: ${bookingData.provider.category}`, 20, 115)
  doc.text(`Route: ${bookingData.provider.routes}`, 20, 125)
  
  // Vehicle details
  doc.text(`Vehicle: ${bookingData.vehicle.name} (${bookingData.vehicle.type})`, 20, 135)
  doc.text(`Departure: ${bookingData.vehicle.departureTime}`, 20, 145)
  doc.text(`Arrival: ${bookingData.vehicle.arrivalTime}`, 20, 155)
  doc.text(`Duration: ${bookingData.vehicle.duration}`, 20, 165)
  
  // Customer Details Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Passenger Details', 20, 185)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Name: ${bookingData.customerDetails.fullName}`, 20, 195)
  doc.text(`ID Number: ${bookingData.customerDetails.idNumber}`, 20, 205)
  doc.text(`Phone: ${bookingData.customerDetails.mobilePhone}`, 20, 215)
  
  // Seat Details Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Seat Details', 20, 235)
  
  bookingData.selectedSeats.forEach((seat, index) => {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Seat ${seat.number}: KSh ${seat.price.toLocaleString()}`, 20, 245 + (index * 10))
  })
  
  // Payment Summary Section (with background)
  const summaryY = 255 + (bookingData.selectedSeats.length * 10)
  doc.setFillColor(backgroundColor)
  doc.rect(20, summaryY, pageWidth - 40, 40, 'F')
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Summary', 20, summaryY + 15)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Payment Method: ${bookingData.paymentMethod}`, 20, summaryY + 25)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total: KSh ${bookingData.totalAmount.toLocaleString()}`, pageWidth - 20, summaryY + 25, { align: 'right' })
  
  // QR Code placeholder
  doc.setFillColor(lightGray)
  doc.rect(pageWidth - 60, summaryY + 30, 40, 40, 'F')
  doc.setTextColor(darkGray)
  doc.setFontSize(8)
  doc.text('QR Code', pageWidth - 40, summaryY + 50, { align: 'center' })
  
  // Footer
  const footerY = summaryY + 60
  doc.setDrawColor(lightGray)
  doc.line(20, footerY, pageWidth - 20, footerY)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('tkt.ke - Your trusted travel partner', 20, footerY + 10)
  doc.text('Terms and conditions apply', pageWidth - 20, footerY + 10, { align: 'right' })
  
  // Important notes
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Important:', 20, footerY + 25)
  doc.setFont('helvetica', 'normal')
  doc.text('• Please arrive 30 minutes before departure', 20, footerY + 35)
  doc.text('• Bring valid ID for verification', 20, footerY + 45)
  doc.text('• This ticket is non-transferable', 20, footerY + 55)
  
  // Save the PDF
  const fileName = `ticket-${bookingData.bookingReference}.pdf`
  doc.save(fileName)
}

export const generateReceiptHTML = (bookingData: BookingData): string => {
  const currentDate = new Date().toLocaleDateString('en-KE')
  const currentTime = new Date().toLocaleTimeString('en-KE')
  
  return `
    <div style="max-width: 400px; margin: 0 auto; background: white; padding: 20px; font-family: Arial, sans-serif;">
      <!-- Header -->
      <div style="background: #F59E0B; color: white; padding: 20px; margin: -20px -20px 20px -20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1 style="margin: 0; font-size: 24px;">tkt.ke</h1>
          <div style="text-align: right; font-size: 10px;">
            <div>Booking #${bookingData.bookingReference}</div>
            <div>${currentDate} ${currentTime}</div>
          </div>
        </div>
      </div>
      
      <!-- Thank you message -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #374151; margin: 0 0 10px 0;">Thank you for your booking!</h2>
        <p style="color: #6B7280; margin: 0;">Your ticket has been confirmed and is ready for travel.</p>
      </div>
      
      <!-- Journey Details -->
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin: 0 0 10px 0;">Journey Details</h3>
        <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
          <p style="margin: 5px 0;"><strong>Provider:</strong> ${bookingData.provider.name}</p>
          <p style="margin: 5px 0;"><strong>Service:</strong> ${bookingData.provider.category}</p>
          <p style="margin: 5px 0;"><strong>Route:</strong> ${bookingData.provider.routes}</p>
          <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${bookingData.vehicle.name} (${bookingData.vehicle.type})</p>
          <p style="margin: 5px 0;"><strong>Departure:</strong> ${bookingData.vehicle.departureTime}</p>
          <p style="margin: 5px 0;"><strong>Arrival:</strong> ${bookingData.vehicle.arrivalTime}</p>
          <p style="margin: 5px 0;"><strong>Duration:</strong> ${bookingData.vehicle.duration}</p>
        </div>
      </div>
      
      <!-- Passenger Details -->
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin: 0 0 10px 0;">Passenger Details</h3>
        <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${bookingData.customerDetails.fullName}</p>
          <p style="margin: 5px 0;"><strong>ID Number:</strong> ${bookingData.customerDetails.idNumber}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${bookingData.customerDetails.mobilePhone}</p>
        </div>
      </div>
      
      <!-- Seat Details -->
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin: 0 0 10px 0;">Seat Details</h3>
        <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
          ${bookingData.selectedSeats.map(seat => 
            `<p style="margin: 5px 0;"><strong>Seat ${seat.number}:</strong> KSh ${seat.price.toLocaleString()}</p>`
          ).join('')}
        </div>
      </div>
      
      <!-- Payment Summary -->
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin: 0 0 10px 0;">Payment Summary</h3>
        <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Payment Method:</strong> ${bookingData.paymentMethod}</span>
            <span style="font-size: 18px; font-weight: bold; color: #F59E0B;">KSh ${bookingData.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="border-top: 1px solid #E5E7EB; padding-top: 15px; font-size: 10px; color: #6B7280;">
        <p style="margin: 5px 0;"><strong>tkt.ke</strong> - Your trusted travel partner</p>
        <p style="margin: 5px 0;"><strong>Important:</strong> Please arrive 30 minutes before departure. Bring valid ID for verification.</p>
      </div>
    </div>
  `
}
