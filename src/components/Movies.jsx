import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import ListGroup from './Common/ListGroup';
import Pagination from './Common/Pagination';
import { paginate } from '../utils/paginate';
import { getGenres } from '../services/fakeGenreService';

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4
  };

  componentDidMount() {
    const genres = [{name: 'All Genre'}, ...getGenres()]
    this.setState({ movies: getMovies(), genres: genres })
  }

  handleDelete = (movie) => {
    const movies = this.state.movies.filter(movies => movie._id !== movies._id);
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  }

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  }

  render() {

    const { length: count } = this.state.movies;
    const { pageSize , currentPage, selectedGenre, movies: allMovies } = this.state;

    if(count === 0)
      return <p>There are no movies in the database</p>

    const filtered = selectedGenre && selectedGenre._id
    ? allMovies.filter(m => m.genre._id === selectedGenre._id)
    : allMovies;

    const movies = paginate(filtered, currentPage, pageSize)

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
           selectedItem={this.state.selectedGenre}
           items={this.state.genres}
           onItemSelect={this.handleGenreSelect}/>

        </div>
        <div className="col">
            <p>Showing {filtered.length} movies in the database</p>

            <table className = "table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Stock</th>
                  <th>Rate</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {movies.map(movie => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre.name}</td>
                  <td>{movie.numberInStock}</td>
                  <td>{movie.dailyRentalRate}</td>
                  <td>
                  <button
                    onClick={() => this.handleDelete(movie)}
                    className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                    </td>
                </tr>
            ))}
              </tbody>
            </table>
            <Pagination
              itemsCount={filtered.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange} />
          </div>
        </div>
    )
  }
}

export default Movies
