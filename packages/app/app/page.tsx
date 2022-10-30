'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'

import { UserAPIRes } from 'shared-api'
import '@/lib/tracer'
import styles from './page.module.css'

export default function HomeProviders() {
  const [queryClient] = useState(() => new QueryClient())

  // weird workaround setting up react-query since you should probably use the
  // server hooks instead of it or SWR or whatevs
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

function Home() {
  const userQuery = useQuery(['/api/v1/user'], fetchUser)
  const projectsQuery = useQuery(['/api/v1/projects'], fetchProjects)

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Rad Project Prototype</h1>

        <p className={styles.description}>
          An exploration in bridging the client/server divide.
        </p>

        <div>
          {userQuery.isLoading && <div>Loading user...</div>}
          {userQuery.status === 'success' && <div>User: {userQuery.data.name}</div>}
          {projectsQuery.status === 'success' && (
            <ul>
              {projectsQuery.data.projects.map((project) => (
                <li key={project}>{project}</li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

async function fetchUser(): Promise<UserAPIRes> {
  const res = await fetch('/api/v1/user')
  if (!res.ok) throw new Error('Res not ok')
  const user = await res.json()
  return user
}

const Projects = z.object({
  projects: z.array(z.string()),
})

type ProjectsAPIRes = z.infer<typeof Projects>

async function fetchProjects(): Promise<ProjectsAPIRes> {
  const res = await fetch('/api/v1/projects')
  if (!res.ok) throw new Error('Res not ok')
  const projects = await res.json()
  return Projects.parse(projects)
}
