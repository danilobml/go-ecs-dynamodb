package router

import (
	"github.com/danilobml/go-ecs-dynamodb/handlers"
	"github.com/danilobml/go-ecs-dynamodb/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	router.Use(middleware.CorsMiddleware())

	router.GET("/test", handlers.TestHandler)
	router.GET("/people", handlers.GetAllPeopleHandler)
	router.GET("/people/:id", handlers.GetOnePersonByIDHandler)
	router.POST("/people", handlers.CreatePersonHandler)
	router.PUT("/people/:id", handlers.UpdatePersonHandler)
	router.DELETE("/people/:id", handlers.DeletePersonHandler)

	return router
}
