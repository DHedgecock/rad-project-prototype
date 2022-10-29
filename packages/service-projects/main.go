package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	tracerProvider := initTracerProvider()
	defer func() {
		log.Println("shutting down trace provider")
		// Shutdown will flush any remaining spans and shut down the exporter.
		if err := tracerProvider.Shutdown(context.Background()); err != nil {
			log.Fatal(err)
		}
		log.Println("Tracer Provider shut down")
	}()

	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(otelgin.Middleware("service-projects"))

	router.GET("/api/v1/projects", getProjects)

	err = router.Run(":9001")

	if errors.Is(err, http.ErrServerClosed) {
		log.Println("server closed")
	} else if err != nil {
		log.Fatal(err)
	}

}

type Projects struct {
	Projects []string `json:"projects"`
}

func getProjects(c *gin.Context) {
	projects := Projects{
		Projects: []string{"learn go", "write rad code"},
	}

	c.JSON(200, projects)
}
