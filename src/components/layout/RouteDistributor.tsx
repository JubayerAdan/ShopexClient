import useAuth from '@/app/hooks/useAuth'
import React from 'react'

function RouteDistributor() {
    const {loading, currentUserFromBackend} = useAuth();
    
  return (
    <div>
      
    </div>
  )
}

export default RouteDistributor
