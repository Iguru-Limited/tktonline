// Location configuration - can be updated without code changes
// This should ideally be fetched from an API or database

export interface Location {
  code: string
  name: string
  terminal?: string
  country?: string
}

export const LOCATIONS: Location[] = [
  // Kenya
  { code: 'NBO', name: 'Nairobi', terminal: 'Nairobi Terminal', country: 'Kenya' },
  { code: 'MSA', name: 'Mombasa', terminal: 'Mombasa Terminal', country: 'Kenya' },
  { code: 'NAIROBI', name: 'Nairobi', terminal: 'Nairobi Terminal', country: 'Kenya' },
  { code: 'MALINDI', name: 'Malindi', terminal: 'Malindi Terminal', country: 'Kenya' },
  { code: 'KISUMU', name: 'Kisumu', terminal: 'Kisumu Terminal', country: 'Kenya' },
  { code: 'NAKURU', name: 'Nakuru', terminal: 'Nakuru Terminal', country: 'Kenya' },
  
  // Bangladesh (example)
  { code: 'DHK', name: 'Dhaka', terminal: 'Dhaka Terminal', country: 'Bangladesh' },
  { code: 'RAJ', name: 'Rajshahi', terminal: 'Rajshahi Terminal', country: 'Bangladesh' },
  { code: 'Kallyanpur', name: 'Kallyanpur', terminal: 'Kallyanpur Counter', country: 'Bangladesh' },
  { code: 'Kajla', name: 'Kajla', terminal: 'Kajla Terminal', country: 'Bangladesh' },
  
  // International examples
  { code: 'NYC', name: 'New York', terminal: 'JFK Terminal', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles', terminal: 'LAX Terminal', country: 'USA' },
  { code: 'LON', name: 'London', terminal: 'Heathrow Terminal', country: 'UK' },
  { code: 'PAR', name: 'Paris', terminal: 'Charles de Gaulle Terminal', country: 'France' },
]

// Helper function to get location by code
export const getLocationByCode = (code: string): Location | null => {
  return LOCATIONS.find(location => 
    location.code.toLowerCase() === code.toLowerCase()
  ) || null
}

// Helper function to get full location name
export const getFullLocationName = (code: string): string => {
  const location = getLocationByCode(code)
  return location ? location.name : code
}

// Helper function to get terminal name
export const getTerminalName = (code: string): string => {
  const location = getLocationByCode(code)
  return location ? location.terminal || `${location.name} Terminal` : `${code} Terminal`
}

// Helper function to get boarding point
export const getBoardingPoint = (code: string): string => {
  const location = getLocationByCode(code)
  return location ? location.terminal || `${location.name} Terminal` : `${code} Terminal`
}
