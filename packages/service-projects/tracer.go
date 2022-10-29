package main

import (
	"context"
	"log"
	"os"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.10.0"
)

func initTracerProvider() *sdktrace.TracerProvider {
	ctx := context.Background()

	var headers = map[string]string{
		"lightstep-access-token": os.Getenv("LIGHTSTEP_ACCESS_TOKEN"),
	}

	client := otlptracegrpc.NewClient(
		otlptracegrpc.WithHeaders(headers),
		otlptracegrpc.WithEndpoint("ingest.lightstep.com:443"),
	)
	traceExporter, err := otlptrace.New(ctx, client)
	if err != nil {
		log.Fatalf("failed to create exporter: %s", err.Error())
	}

	processor := sdktrace.NewBatchSpanProcessor(traceExporter)

	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.TelemetrySDKLanguageGo,
			semconv.ServiceNameKey.String("service-projects"),
			semconv.ServiceVersionKey.String("1.0.0"),
		)),
		sdktrace.WithSpanProcessor(processor),
	)

	otel.SetTracerProvider(tracerProvider)

	return tracerProvider
}
