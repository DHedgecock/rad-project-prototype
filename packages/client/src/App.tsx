import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { UserAPIRes } from 'shared-api'

import logo from './logo.svg'
import './App.css'

export default function App() {
  const userQuery = useQuery(['/api/v1/user'], fetchUser)
  const projectsQuery = useQuery(['/api/v1/projects'], fetchProjects)

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />

        {userQuery.isLoading && <div>Loading user...</div>}
        {userQuery.status === 'success' && <div>User: {userQuery.data.name}</div>}
        {projectsQuery.status === 'success' && (
          <ul>
            {projectsQuery.data.projects.map((project) => (
              <li>{project}</li>
            ))}
          </ul>
        )}
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

async function fetchProjects(): Promise<{ projects: string[] }> {
  const res = await fetch('/api/v1/projects')
  if (!res.ok) throw new Error('Res not ok')
  const projects = await res.json()
  return projects
}
