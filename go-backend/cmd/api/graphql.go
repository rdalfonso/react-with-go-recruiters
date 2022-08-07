package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"go-backend/cmd/models"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/graphql-go/graphql"
)

var recruiters []*models.Recruiter

// graphql schema definition
var fields = graphql.Fields{
	"recruiter": &graphql.Field{
		Type:        recruiterType,
		Description: "Get recruiter by id",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			id, ok := p.Args["id"].(int)
			if ok {
				for _, recruiter := range recruiters {
					if recruiter.ID == id {
						return recruiter, nil
					}
				}
			}
			return nil, nil
		},
	},
	"list": &graphql.Field{
		Type:        graphql.NewList(recruiterType),
		Description: "Get all recruiters",
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			return recruiters, nil
		},
	},
	"search": &graphql.Field{
		Type:        graphql.NewList(recruiterType),
		Description: "Search recruiters by name",
		Args: graphql.FieldConfigArgument{
			"nameContains": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(params graphql.ResolveParams) (interface{}, error) {
			var theList []*models.Recruiter
			search, ok := params.Args["nameContains"].(string)
			if ok {
				for _, currentRecruiter := range recruiters {
					if strings.Contains(currentRecruiter.Name, search) {
						log.Println("Found one")
						theList = append(theList, currentRecruiter)
					}
				}
			}
			return theList, nil
		},
	},
}

var recruiterType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Recruiter",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.Int,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"title": &graphql.Field{
				Type: graphql.String,
			},
			"linkedin": &graphql.Field{
				Type: graphql.String,
			},
			"email": &graphql.Field{
				Type: graphql.String,
			},
			"company": &graphql.Field{
				Type: graphql.String,
			},
			"stars": &graphql.Field{
				Type: graphql.Int,
			},
			"created_at": &graphql.Field{
				Type: graphql.DateTime,
			},
			"updated_at": &graphql.Field{
				Type: graphql.DateTime,
			},
		},
	},
)

func (app *application) recruitersGraphQL(w http.ResponseWriter, r *http.Request) {
	recruiters, _ = app.models.DB.All()

	q, _ := io.ReadAll(r.Body)
	query := string(q)

	log.Println(query)

	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		app.errorJSON(w, errors.New("failed to create schema"))
		log.Println(err)
		return
	}

	params := graphql.Params{Schema: schema, RequestString: query}
	resp := graphql.Do(params)
	if len(resp.Errors) > 0 {
		app.errorJSON(w, errors.New(fmt.Sprintf("failed: %+v", resp.Errors)))
	}

	j, _ := json.MarshalIndent(resp, "", "  ")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
