/* eslint-disable prettier/prettier */
import React from 'react'
import { AppContent, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <AppContent />
        
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
