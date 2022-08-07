package models

import (
	"database/sql"
	"time"
)

//Models is the wrapper for database
type Models struct {
	DB DBModel
}

//NewModels returns Modesl with db pool
func NewModels(db *sql.DB) Models {
	return Models{
		DB: DBModel{DB: db},
	}
}

//Recruiter is the type for recruiter
type Recruiter struct {
	ID             int            `json:"id"`
	Name           string         `json:"name"`
	Title          string         `json:"title"`
	LinkedIn       string         `json:"linkedin"`
	Email          string         `json:"email"`
	Company        string         `json:"company"`
	Stars          int            `json:"stars"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	RecruiterGenre map[int]string `json:"genres"`
}

//Genre is the type for genre
type Genre struct {
	ID        int       `json:"id"`
	GenreName string    `json:"genre_name"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

//RecruiterGenre is the type for recruiter genre
type RecruiterGenre struct {
	ID          int       `json:"-"`
	RecruiterID int       `json:"-"`
	GenreID     int       `json:"-"`
	Genre       Genre     `json:"genre"`
	CreatedAt   time.Time `json:"-"`
	UpdatedAt   time.Time `json:"-"`
}

// User is the type for users
type User struct {
	ID       int
	Email    string
	Password string
}
