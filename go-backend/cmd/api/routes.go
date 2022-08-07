package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", ps)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (app *application) routes() http.Handler {
	router := httprouter.New()
	secure := alice.New(app.checkToken)

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)

	router.HandlerFunc(http.MethodPost, "/v1/graphql", app.recruitersGraphQL)

	router.HandlerFunc(http.MethodPost, "/v1/signin", app.Signin)
	router.HandlerFunc(http.MethodGet, "/v1/recruiter/:id", app.getOneRecruiter)
	router.HandlerFunc(http.MethodGet, "/v1/recruiters", app.getAllRecruiters)
	router.HandlerFunc(http.MethodGet, "/v1/genres", app.getAllGenres)

	router.POST("/v1/admin/editrecruiter", app.wrap(secure.ThenFunc(app.editRecruiter)))

	router.HandlerFunc(http.MethodGet, "/v1/recruiters/:genre_id", app.getAllRecruitersByGenre)
	router.GET("/v1/admin/deleterecruiter/:id", app.wrap(secure.ThenFunc(app.deleteRecruiter)))

	return app.enableCORS(router)
}
