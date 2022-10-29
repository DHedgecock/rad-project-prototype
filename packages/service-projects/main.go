package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
)

func main() {
	mux := routes()

	log.Println("service-projects startin on :9001")
	err := http.ListenAndServe(":9001", mux)
	if errors.Is(err, http.ErrServerClosed) {
		log.Println("server closed")
	} else if err != nil {
		log.Fatal(err)
	}

}

func routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/projects", getProjects)
	return mux
}

type Projects struct {
	Projects []string `json:"projects"`
}

func getProjects(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	projects := Projects{
		Projects: []string{"learn go", "write rad code"},
	}

	err := json.NewEncoder(w).Encode(projects)
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}
}
