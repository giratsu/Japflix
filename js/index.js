let moviesContainer = null;
let searchInput = null;
let searchButton = null;
let menuSuperior = null;
let bs_menuSuperior = null;
let menuSuperiorTitulo = null;
let menuSuperiorBody = null;

document.addEventListener("DOMContentLoaded", async ev=>{
    // Initialize variables
    moviesContainer = document.getElementById("lista");
    searchInput = document.getElementById("inputBuscar");
    searchButton = document.getElementById("btnBuscar");
    menuSuperior = document.getElementById("offcanvasTop");
    bs_menuSuperior = new bootstrap.Offcanvas(menuSuperior);
    menuSuperiorTitulo = document.getElementById("offcanvasTopLabel");
    //menuSuperiorBody = document.querySelector("offcanvas-body"); No funciona
    menuSuperiorBody = document.getElementById("canvas-body");
    
    // Get movies
    let moviesData = null;
    moviesData = await GetMoviesData();
    
    // Add button event
    searchButton.addEventListener("click", ev=>{
        ev.preventDefault();
        const searchValue = searchInput.value;
        let searchResults = Array.from(GetMoviesBySearch(moviesData, searchValue));
        if(searchResults)
        {
            ShowMovies(searchResults);
        }else{
            alert("No se encontraron resultados");
        }
    })
})


async function GetMoviesData()
{
    let response = await fetch("https://japceibal.github.io/japflix_api/movies-data.json");
    let data = await response.json();
    return data;
}

function GetMoviesBySearch(movies, search)
{
    const lowercase_search = search.toLowerCase();
    let result = [];
    movies.forEach(movie => {
        if(movie.title.toLowerCase().includes(lowercase_search) || movie.genres.find(genre => genre.name.toLowerCase().includes(search)) ||
        movie.tagline.toLowerCase().includes(lowercase_search) || movie.overview.toLowerCase().includes(lowercase_search))
        {
            result.push(movie);
        }
    });
    
    return result;
}

function ShowMovies(movies)
{
    moviesContainer.innerHTML = "";
    
    for(let movie of movies)
    {
        let movieElement = document.createElement("div");
        let content = MovieElementHTML(movie.title, movie.tagline, movie.vote_average);
        movieElement.innerHTML = content;
        movieElement.addEventListener("click", ev=>{
            ev.preventDefault();
            bs_menuSuperior.show();
            UpdateTopCanvas(movie.title, movie.overview, movie.genres, movie.release_date, movie.runtime, movie.budget, movie.revenue);
        })
        moviesContainer.append(movieElement);
    }
}

function MovieElementHTML(title, tagline, stars)
{
    return `
    <div class="list-group-item list-group-item-action bg-dark text-light">
    <div class="row">
    <h2>${title} <span class="movie-stars">${StarsHTML(stars)}</span></h2>
    </div>
    <div class="row">
    <p>${tagline}</p>
    </div>
    </div>
    `
}

function StarsHTML(stars)
{
    return `
    * * * *
    `
}

function UpdateTopCanvas(title, overview, genres, year, runtime, budget, revenue)
{
    let _genres = "";
    for(let i=0; i<genres.length; i++)
    {
        _genres += genres[i].name;
        if(i<genres.length-1)
        {
            _genres += " - ";
        }
    }
    menuSuperiorTitulo.innerHTML = title;
    let bodyHTML = `
    <p>${overview}</p>
    <hr>
    <div class="mt-auto d-flex flex-row justify-content-between">
        <p>${_genres}</p>
        
      <div class="dropdown">
	  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
		More info
	  </button>
	  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li">Year: ${year}</li>
        <br>
        <li">Runtime: ${runtime}</li>
        <br>
        <li">Budget: $${budget}</li>
        <br>
        <li">Revenue: $${revenue}</li>
	  </ul>
	</div>


    </div>
    `
    menuSuperiorBody.innerHTML = bodyHTML;
    
}