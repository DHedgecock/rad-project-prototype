import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'
import { Resource } from '@opentelemetry/resources'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

// Create a provider for activating and tracking spans
const tracerProvider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
})
const exporter = new OTLPTraceExporter({
  url: 'https://ingest.lightstep.com:443/traces/otlp/v0.9',
  headers: {
    'Lightstep-Access-Token': process.env.NEXT_PUBLIC_LIGHTSTEP_ACCESS_TOKEN,
  },
})
const processor = new BatchSpanProcessor(exporter)

tracerProvider.addSpanProcessor(processor)
tracerProvider.register()

// Registering instrumentations
registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
})
