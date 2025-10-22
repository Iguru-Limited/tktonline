import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import { getFullLocationName, getBoardingPoint } from '@/config/locations'

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
}

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#F3F4F6',
    width: '210mm',
    height: '297mm',
    padding: '20mm',
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12mm',
    padding: '8mm',
    width: '160mm',
    height: '200mm',
    position: 'relative',
  },
  // Header styles
  header: {
    backgroundColor: '#374151',
    padding: '6mm',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6mm',
    borderTopLeftRadius: '8mm',
    borderTopRightRadius: '8mm',
  },
  logo: {
    width: '12mm',
    height: '12mm',
    backgroundColor: '#F59E0B',
    borderRadius: '6mm',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  providerName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  // Content styles
  content: {
    padding: '0',
    flex: 1,
  },
  // Route section
  routeSection: {
    marginBottom: '6mm',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1mm',
  },
  routeColumn: {
    flex: 1,
  },
  routeLabel: {
    color: '#6B7280',
    fontSize: 8,
    marginBottom: '2mm',
  },
  routeCode: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '1mm',
  },
  routeName: {
    color: '#6B7280',
    fontSize: 7,
    marginBottom: '1mm',
  },
  routeTime: {
    color: '#6B7280',
    fontSize: 7,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '2mm',
  },
  arrow: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Boarding and seat section
  boardingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4mm',
  },
  boardingColumn: {
    flex: 1,
  },
  boardingLabel: {
    color: '#6B7280',
    fontSize: 6,
    marginBottom: '1mm',
  },
  boardingValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Name and vehicle section
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4mm',
  },
  nameColumn: {
    flex: 1,
  },
  nameLabel: {
    color: '#6B7280',
    fontSize: 6,
    marginBottom: '1mm',
  },
  nameValue: {
    color: '#1F2937',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Booking code section
  bookingSection: {
    marginBottom: '4mm',
  },
  bookingLabel: {
    color: '#1F2937',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: '1mm',
  },
  bookingCode: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // QR code section
  qrSection: {
    alignItems: 'center',
    marginTop: '4mm',
  },
  qrCode: {
    width: '30mm',
    height: '30mm',
    marginBottom: '2mm',
  },
  qrText: {
    color: '#6B7280',
    fontSize: 8,
    textAlign: 'center',
  },
  // Separator line
  separator: {
    borderBottom: '0.5pt solid #D1D5DB',
    marginVertical: '2mm',
  },
})

// Helper function to extract route information
const extractRouteInfo = (bookingData: BookingData) => {
  if (!bookingData?.provider?.routes) {
    return {
      origin: { code: 'NBO', name: 'Nairobi' },
      destination: { code: 'MSA', name: 'Mombasa' }
    }
  }
  
  const routeParts = bookingData.provider.routes.split('-')
  const originCode = routeParts[0]?.trim() || 'NBO'
  const destinationCode = routeParts[1]?.trim() || 'MSA'
  
  return {
    origin: {
      code: originCode,
      name: getFullLocationName(originCode)
    },
    destination: {
      code: destinationCode,
      name: getFullLocationName(destinationCode)
    }
  }
}

// Helper function to get boarding information
const getBoardingInfo = (bookingData: BookingData) => {
  const routeInfo = extractRouteInfo(bookingData)
  return {
    point: getBoardingPoint(routeInfo.origin.code),
    time: calculateBoardingTime(bookingData.vehicle?.departureTime || '08:00AM')
  }
}

// Helper function to calculate boarding time
const calculateBoardingTime = (departureTime: string): string => {
  try {
    const [time, modifier] = departureTime.split(/(AM|PM)/i)
    const [hours, minutes] = time.split(':').map(Number)
    
    let totalMinutes = hours * 60 + minutes
    if (modifier?.toUpperCase() === 'PM' && hours !== 12) totalMinutes += 12 * 60
    if (modifier?.toUpperCase() === 'AM' && hours === 12) totalMinutes -= 12 * 60
    
    // Subtract 15 minutes for boarding time
    totalMinutes -= 15
    
    const boardingHours = Math.floor(totalMinutes / 60) % 12 || 12
    const boardingMinutes = totalMinutes % 60
    const boardingModifier = totalMinutes >= 12 * 60 ? 'PM' : 'AM'
    
    return `${boardingHours}:${boardingMinutes.toString().padStart(2, '0')}${boardingModifier}`
  } catch {
    return '8:00AM'
  }
}


// Ticket PDF Component
const TicketPDF: React.FC<{ bookingData: BookingData }> = ({ bookingData }) => {
  const routeInfo = extractRouteInfo(bookingData)
  const boardingInfo = getBoardingInfo(bookingData)
  const seatNumbers = bookingData.selectedSeats.map(seat => seat.number).join(', ')

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>TKT</Text>
            </View>
            <Text style={styles.providerName}>{bookingData.provider?.name || 'Bus Company'}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Route Information */}
            <View style={styles.routeSection}>
              <View style={styles.routeRow}>
                <View style={styles.routeColumn}>
                  <Text style={styles.routeLabel}>From</Text>
                  <Text style={styles.routeCode}>{routeInfo.origin.code}</Text>
                  <Text style={styles.routeName}>{routeInfo.origin.name}</Text>
                  <Text style={styles.routeTime}>{bookingData.vehicle?.departureTime || '08:00AM'}</Text>
                </View>
                
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
                
                <View style={styles.routeColumn}>
                  <Text style={[styles.routeLabel, { textAlign: 'right' }]}>To</Text>
                  <Text style={[styles.routeCode, { textAlign: 'right' }]}>{routeInfo.destination.code}</Text>
                  <Text style={[styles.routeName, { textAlign: 'right' }]}>{routeInfo.destination.name}</Text>
                  <Text style={[styles.routeTime, { textAlign: 'right' }]}>{bookingData.vehicle?.arrivalTime || 'TBD'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Boarding and Seat Information */}
            <View style={styles.boardingSection}>
              <View style={styles.boardingColumn}>
                <Text style={styles.boardingLabel}>Boarding</Text>
                <Text style={styles.boardingValue}>{boardingInfo.point.substring(0, 3).toUpperCase()}</Text>
              </View>
              <View style={styles.boardingColumn}>
                <Text style={[styles.boardingLabel, { textAlign: 'right' }]}>Seat</Text>
                <Text style={[styles.boardingValue, { textAlign: 'right' }]}>{seatNumbers}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Full Name and Vehicle */}
            <View style={styles.nameSection}>
              <View style={styles.nameColumn}>
                <Text style={styles.nameLabel}>Full Name</Text>
                <Text style={styles.nameValue}>{bookingData.customerDetails?.fullName || 'Passenger'}</Text>
              </View>
              <View style={styles.nameColumn}>
                <Text style={[styles.nameLabel, { textAlign: 'right' }]}>Vehicle</Text>
                <Text style={[styles.nameValue, { textAlign: 'right' }]}>
                  {bookingData.vehicle?.name || 'Bus'.split(' - ').pop() || 'Standard'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Booking Code */}
            <View style={styles.bookingSection}>
              <Text style={styles.bookingLabel}>Booking Code</Text>
              <Text style={styles.bookingCode}>{bookingData.bookingReference || 'N/A'}</Text>
            </View>

            <View style={styles.separator} />

            {/* QR Code */}
            <View style={styles.qrSection}>
              <QRCodeImage bookingData={bookingData} />
              <Text style={styles.qrText}>{bookingData.bookingReference || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Export a function that creates the Document
export const createTicketDocument = (bookingData: BookingData) => {
  // Add null checks for safety
  if (!bookingData) {
    throw new Error('Booking data is required')
  }
  
  const routeInfo = extractRouteInfo(bookingData)
  const boardingInfo = getBoardingInfo(bookingData)
  const seatNumbers = bookingData.selectedSeats?.map(seat => seat.number).join(', ') || 'N/A'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>TKT</Text>
            </View>
            <Text style={styles.providerName}>{bookingData.provider?.name || 'Bus Company'}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Route Information */}
            <View style={styles.routeSection}>
              <View style={styles.routeRow}>
                <View style={styles.routeColumn}>
                  <Text style={styles.routeLabel}>From</Text>
                  <Text style={styles.routeCode}>{routeInfo.origin.code}</Text>
                  <Text style={styles.routeName}>{routeInfo.origin.name}</Text>
                  <Text style={styles.routeTime}>{bookingData.vehicle?.departureTime || '08:00AM'}</Text>
                </View>
                
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
                
                <View style={styles.routeColumn}>
                  <Text style={[styles.routeLabel, { textAlign: 'right' }]}>To</Text>
                  <Text style={[styles.routeCode, { textAlign: 'right' }]}>{routeInfo.destination.code}</Text>
                  <Text style={[styles.routeName, { textAlign: 'right' }]}>{routeInfo.destination.name}</Text>
                  <Text style={[styles.routeTime, { textAlign: 'right' }]}>{bookingData.vehicle?.arrivalTime || 'TBD'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Boarding and Seat Information */}
            <View style={styles.boardingSection}>
              <View style={styles.boardingColumn}>
                <Text style={styles.boardingLabel}>Boarding</Text>
                <Text style={styles.boardingValue}>{boardingInfo.point.substring(0, 3).toUpperCase()}</Text>
              </View>
              <View style={styles.boardingColumn}>
                <Text style={[styles.boardingLabel, { textAlign: 'right' }]}>Seat</Text>
                <Text style={[styles.boardingValue, { textAlign: 'right' }]}>{seatNumbers}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Full Name and Vehicle */}
            <View style={styles.nameSection}>
              <View style={styles.nameColumn}>
                <Text style={styles.nameLabel}>Full Name</Text>
                <Text style={styles.nameValue}>{bookingData.customerDetails?.fullName || 'Passenger'}</Text>
              </View>
              <View style={styles.nameColumn}>
                <Text style={[styles.nameLabel, { textAlign: 'right' }]}>Vehicle</Text>
                <Text style={[styles.nameValue, { textAlign: 'right' }]}>
                  {bookingData.vehicle?.name || 'Bus'.split(' - ').pop() || 'Standard'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Booking Code */}
            <View style={styles.bookingSection}>
              <Text style={styles.bookingLabel}>Booking Code</Text>
              <Text style={styles.bookingCode}>{bookingData.bookingReference || 'N/A'}</Text>
            </View>

            <View style={styles.separator} />

            {/* QR Code */}
            <View style={styles.qrSection}>
              <QRCodeImage bookingData={bookingData} />
              <Text style={styles.qrText}>{bookingData.bookingReference || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TicketPDF

// QR Code Image Component
const QRCodeImage: React.FC<{ bookingData: BookingData }> = ({ bookingData }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = React.useState<string>('')

  React.useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeData = {
          bookingId: bookingData.bookingReference || 'N/A',
          passenger: {
            name: bookingData.customerDetails?.fullName || 'Passenger',
            id: bookingData.customerDetails.idNumber,
            phone: bookingData.customerDetails.mobilePhone
          },
          trip: {
            provider: bookingData.provider?.name || 'Bus Company',
            route: bookingData.provider.routes,
            vehicle: bookingData.vehicle?.name || 'Bus',
            departure: bookingData.vehicle?.departureTime || '08:00AM'
          },
          seats: bookingData.selectedSeats.map(seat => ({
            number: seat.number,
            fare: seat.fare || 0
          })),
          total: bookingData.totalAmount,
          payment: bookingData.paymentMethod,
          issued: new Date().toISOString(),
          valid: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
        
        const dataURL = await QRCode.toDataURL(JSON.stringify(qrCodeData), {
          width: 120,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        setQrCodeDataURL(dataURL)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQRCode()
  }, [bookingData])

  if (!qrCodeDataURL) {
    return <View style={[styles.qrCode, { backgroundColor: '#E5E7EB' }]} />
  }

  return <Image style={styles.qrCode} src={qrCodeDataURL} />
}
