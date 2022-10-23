import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { UserAPIRes } from 'shared-api'

import logo from './logo.svg'
import './App.css'

export default function App() {
  const userQuery = useQuery(['/api/v1/user'], fetchUser)

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />

        {userQuery.isLoading && <div>Loading user...</div>}
        {userQuery.status === 'success' && <div>User: {userQuery.data.name}</div>}
      </header>
    </div>
  )
}

async function fetchUser(): Promise<UserAPIRes> {
  const res = await fetch('/api/v1/user')
  if (!res.ok) throw new Error('Res not ok')
  const user = await res.json()
  return user
}
