package models

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"
)

type DBModel struct {
	DB *sql.DB
}

// Get returns one recruiter and error, if any
func (m *DBModel) Get(id int) (*Recruiter, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, name, company, title, email, linkedin, stars, created_at, updated_at from recruiters where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var recruiter Recruiter

	err := row.Scan(
		&recruiter.ID,
		&recruiter.Name,
		&recruiter.Company,
		&recruiter.Title,
		&recruiter.Email,
		&recruiter.LinkedIn,
		&recruiter.Stars,
		&recruiter.CreatedAt,
		&recruiter.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// get genres, if any
	query = `select
				rg.id, rg.recruiter_id, rg.genre_id, g.genre_name
			from
				recruiter_genres rg
				left join genres g on (g.id = rg.genre_id)
			where
			rg.recruiter_id = $1
	`

	rows, _ := m.DB.QueryContext(ctx, query, id)
	defer rows.Close()

	genres := make(map[int]string)
	for rows.Next() {
		var rg RecruiterGenre
		err := rows.Scan(
			&rg.ID,
			&rg.RecruiterID,
			&rg.GenreID,
			&rg.Genre.GenreName,
		)
		if err != nil {
			return nil, err
		}
		genres[rg.ID] = rg.Genre.GenreName
	}

	recruiter.RecruiterGenre = genres

	return &recruiter, nil
}

// All returns all recruiters and error, if any
func (m *DBModel) All(genre ...int) ([]*Recruiter, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	where := ""
	if len(genre) > 0 {
		where = fmt.Sprintf("where id in (select recruiter_id from recruiter_genres where genre_id = %d)", genre[0])
	}

	query := fmt.Sprintf(`select id, name, title, linkedin, email, company, stars, created_at, updated_at
		from recruiters %s order by title`, where)

	rows, err := m.DB.QueryContext(ctx, query)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recruiters []*Recruiter

	for rows.Next() {
		var recruiter Recruiter
		err := rows.Scan(
			&recruiter.ID,
			&recruiter.Name,
			&recruiter.Title,
			&recruiter.LinkedIn,
			&recruiter.Email,
			&recruiter.Company,
			&recruiter.Stars,
			&recruiter.CreatedAt,
			&recruiter.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		// get genres, if any
		genreQuery := `select
					rg.id, rg.recruiter_id, rg.genre_id, g.genre_name
					from
						recruiter_genres rg
						left join genres g on (g.id = rg.genre_id)
					where
					rg.recruiter_id = $1
			`

		genreRows, _ := m.DB.QueryContext(ctx, genreQuery, recruiter.ID)

		genres := make(map[int]string)

		for genreRows.Next() {
			var rg RecruiterGenre
			err := genreRows.Scan(
				&rg.ID,
				&rg.RecruiterID,
				&rg.GenreID,
				&rg.Genre.GenreName,
			)
			if err != nil {
				return nil, err
			}
			genres[rg.ID] = rg.Genre.GenreName
		}
		genreRows.Close()

		recruiter.RecruiterGenre = genres
		recruiters = append(recruiters, &recruiter)

	}

	return recruiters, nil
}

func (m *DBModel) GenresAll() ([]*Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `select g.id, g.genre_name from genres g`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*Genre

	for rows.Next() {
		var genre Genre
		err := rows.Scan(
			&genre.ID,
			&genre.GenreName,
		)

		if err != nil {
			return nil, err
		}
		genres = append(genres, &genre)
	}

	return genres, nil

}

func (m *DBModel) InsertRecruiter(recruiter Recruiter) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `insert into recruiters (name, title, linkedin, email, company, stars, created_at, updated_at) values ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := m.DB.ExecContext(ctx, stmt,
		recruiter.Name,
		recruiter.Title,
		recruiter.LinkedIn,
		recruiter.Email,
		recruiter.Company,
		recruiter.Stars,
		recruiter.CreatedAt,
		recruiter.UpdatedAt,
	)

	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func (m *DBModel) UpdateRecruiter(recruiter Recruiter) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `update recruiters set name = $1, title = $2, linkedin = $3, email = $4, company = $5, stars = $6, updated_at = $7 where id = $8`

	_, err := m.DB.ExecContext(ctx, stmt,
		recruiter.Name,
		recruiter.Title,
		recruiter.LinkedIn,
		recruiter.Email,
		recruiter.Company,
		recruiter.Stars,
		recruiter.UpdatedAt,
		recruiter.ID,
	)

	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func (m *DBModel) DeleteRecruiter(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := "delete from recruiters where id = $1"

	_, err := m.DB.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}

	return nil
}
