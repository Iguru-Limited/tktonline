"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SearchData {
  from: string
  to: string
  tripType: 'one-way' | 'round-trip'
  departureDate?: string
  returnDate?: string
}

interface SearchContextType {
  searchData: SearchData
  setSearchData: (data: SearchData) => void
  clearSearchData: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: ReactNode
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchData, setSearchDataState] = useState<SearchData>({
    from: '',
    to: '',
    tripType: 'one-way',
    departureDate: undefined,
    returnDate: undefined
  })

  const setSearchData = (data: SearchData) => {
    setSearchDataState(data)
  }

  const clearSearchData = () => {
    setSearchDataState({
      from: '',
      to: '',
      tripType: 'one-way',
      departureDate: undefined,
      returnDate: undefined
    })
  }

  return (
    <SearchContext.Provider value={{ searchData, setSearchData, clearSearchData }}>
      {children}
    </SearchContext.Provider>
  )
}
