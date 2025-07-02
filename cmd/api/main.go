package main

import (
	"log"

	"github.com/danilobml/go-ecs-dynamodb/models"
	"github.com/danilobml/go-ecs-dynamodb/router"
)

func main() {
	models.InitDynamo()
	r := router.SetupRouter()

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}
