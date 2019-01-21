import React, { Component } from 'react';
import ListGroup from './Common/ListGroup';
import Pagination from './Common/Pagination';
import MoviesTable from './MoviesTable';
// import SearchBox from './SearchBox';
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import { paginate } from '../utils/paginate';


class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null
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
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  }

  // handleSearch = (query) => {
  //   // create a filtered const
  //   this.setState({ searchQuery: query, searchQuery: "", selectedGenre: null, currentPage: 1 })
  // }


  render() {

    const { length: count } = this.state.movies;
    const { pageSize , currentPage, selectedGenre, searchQuery, movies: allMovies } = this.state;

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
              onItemSelect={this.handleGenreSelect} />
        </div>
        <div className="col">
            <p>Showing {filtered.length} movies in the database</p>  
            <MoviesTable
              movies={movies}
              onDelete={this.handleDelete}
            />
            <Pagination
              itemsCount={filtered.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
    )
  }
}

export default Movies
