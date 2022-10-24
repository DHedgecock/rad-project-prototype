import * as dotenv from 'dotenv'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { Resource } from '@opentelemetry/resources'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

dotenv.config()

const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'service-user',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
})

const exporter = new OTLPTraceExporter({
  url: 'https://ingest.lightstep.com:443/traces/otlp/v0.9',
  headers: {
    'Lightstep-Access-Token': process.env.LIGHTSTEP_ACCESS_TOKEN,
  },
})
const processor = new BatchSpanProcessor(exporter)

tracerProvider.addSpanProcessor(processor)
tracerProvider.register()

registerInstrumentations({
  instrumentations: [
    // Fastify instrumentation expects HTTP layer to be instrumented
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
  ],
})
