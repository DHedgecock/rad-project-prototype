import Fastify, { FastifyInstance } from 'fastify'
import invariant from 'tiny-invariant'

import { UserAPIRes } from 'shared-api'

const env = process.env.NODE_ENV ?? 'development'
invariant(
  env === 'development' || env === 'production' || env === 'test',
  `Unsupported NODE_ENV: ${env}`,
)

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

const server: FastifyInstance = Fastify({
  logger: envToLogger[env],
})

server.get('/api/v1/user', async (request, reply): Promise<UserAPIRes> => {
  return { id: '082de04905', name: 'Hedge', radness_level: 'pretty' }
})

// Run the server!
const start = async () => {
  try {
    await server.listen({ port: 9000 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
