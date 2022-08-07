package main

import (
	"encoding/json"
	"errors"
	"go-backend/cmd/models"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/julienschmidt/httprouter"
)

type jsonResp struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

func (app *application) getOneRecruiter(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Print(errors.New("invalid id parameter"))
		app.errorJSON(w, err)
		return
	}

	recruiter, err := app.models.DB.Get(id)

	err = app.writeJSON(w, http.StatusOK, recruiter, "recruiter")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllRecruiters(w http.ResponseWriter, r *http.Request) {
	recruiters, err := app.models.DB.All()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, recruiters, "recruiters")
	if err != nil {
		app.errorJSON(w, err)
		return
	}

}

func (app *application) getAllRecruitersByGenre(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	genreID, err := strconv.Atoi(params.ByName("genre_id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	recruiters, err := app.models.DB.All(genreID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, recruiters, "recruiters")
	if err != nil {
		app.errorJSON(w, err)
		return
	}

}

func (app *application) getAllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.models.DB.GenresAll()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, genres, "genres")
	if err != nil {
		app.errorJSON(w, err)
		return
	}

}

type RecruiterPayload struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Company  string `json:"company"`
	Title    string `json:"title"`
	LinkedIn string `json:"linkedin"`
	Email    string `json:"email"`
	Stars    string `json:"stars"`
}

func (app *application) editRecruiter(w http.ResponseWriter, r *http.Request) {
	var payload RecruiterPayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	var recruiter models.Recruiter

	if payload.ID != "0" {
		id, _ := strconv.Atoi(payload.ID)
		m, _ := app.models.DB.Get(id)
		recruiter = *m
		recruiter.UpdatedAt = time.Now()
	}

	recruiter.ID, _ = strconv.Atoi(payload.ID)
	recruiter.Name = payload.Name
	recruiter.Title = payload.Title
	recruiter.LinkedIn = payload.LinkedIn
	recruiter.Email = payload.Email
	recruiter.Company = payload.Company
	recruiter.Stars, _ = strconv.Atoi(payload.Stars)
	recruiter.CreatedAt = time.Now()
	recruiter.UpdatedAt = time.Now()

	if recruiter.ID == 0 {
		err = app.models.DB.InsertRecruiter(recruiter)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	} else {
		err = app.models.DB.UpdateRecruiter(recruiter)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	ok := jsonResp{
		OK: true,
	}

	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) deleteRecruiter(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.models.DB.DeleteRecruiter(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	ok := jsonResp{
		OK: true,
	}

	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

func getPoster(recruiter models.Recruiter) models.Recruiter {
	type TheRecruiterDB struct {
		Page    int `json:"page"`
		Results []struct {
			Adult            bool    `json:"adult"`
			BackdropPath     string  `json:"backdrop_path"`
			GenreIds         []int   `json:"genre_ids"`
			ID               int     `json:"id"`
			OriginalLanguage string  `json:"original_language"`
			OriginalTitle    string  `json:"original_title"`
			Overview         string  `json:"overview"`
			Popularity       float64 `json:"popularity"`
			PosterPath       string  `json:"poster_path"`
			ReleaseDate      string  `json:"release_date"`
			Title            string  `json:"title"`
			Video            bool    `json:"video"`
			VoteAverage      float64 `json:"vote_average"`
			VoteCount        int     `json:"vote_count"`
		} `json:"results"`
		TotalPages   int `json:"total_pages"`
		TotalResults int `json:"total_results"`
	}

	client := &http.Client{}
	key := "d195c6f1092d56cd775aa04cc0900d89"
	theUrl := "https://api.themoviedb.org/3/search/movie?api_key="
	log.Println(theUrl + key + "&query=" + url.QueryEscape(recruiter.Name))

	req, err := http.NewRequest("GET", theUrl+key+"&query="+url.QueryEscape(recruiter.Name), nil)
	if err != nil {
		log.Println(err)
		return recruiter
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return recruiter
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return recruiter
	}

	var responseObject TheRecruiterDB

	json.Unmarshal(bodyBytes, &responseObject)

	if len(responseObject.Results) > 0 {
		recruiter.LinkedIn = responseObject.Results[0].PosterPath
	}

	return recruiter
}
