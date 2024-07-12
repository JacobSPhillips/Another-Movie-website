// img source: https://image.tmdb.org/t/p/original[poster_path]
const form = document.querySelector('#movieSearch')

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = form.elements.query.value
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODFhNmY1MzJmOTM0Y2Q3YWQ3MTk5ZDNkNjgyM2FmZSIsIm5iZiI6MTcyMDY1MzU4OC41MDkyMjMsInN1YiI6IjY2MDIzZGQxNjJmMzM1MDE2NDUyNTc3OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hA5DOo0alnbJnE2L-qZ4syjlzrxl5gZrAiTS0WWwJQM'
        }
    };

    const movieRes = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, options)
    try {
        if (movieRes.data.results) { clearSearch() }
        generateMovie(movieRes.data.results, options)
    } catch {
        console.log('something went wrong')
    }
    form.elements.query.value = "";
})

const generateMovie = async (movies, options) => {
    for (let movie of movies) {
        if (movie.poster_path) {
            // requesting the data that holds the director of the movie and saving it to a const
            const directors = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, options)
            if (directors.data.crew.filter((director) => director.known_for_department === "Directing")[0]) {
                const movieDir = directors.data.crew.filter((director) => director.known_for_department === "Directing")[0].name

                //requesting the data that holds the runtime of the movie and saving it to a const
                const runTime = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, options)
                const movieRunTime = runTime.data.runtime

                //saving the movie section to a const
                const movieList = document.querySelector('#movieList')
                movieList.classList.add('movieList')


                // creating the movie window
                const movieWindow = document.createElement('div');
                movieWindow.classList.add('movieWindow');

                // everything that goes in the window
                // creating the movie poster
                const moviePoster = document.createElement('img');
                moviePoster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
                moviePoster.classList.add('moviePoster');

                //creating the title and description div
                const titleDesc = document.createElement('div');
                const movieTitle = document.createElement('h2');
                const description = document.createElement('p');
                movieTitle.append(movie.original_title);
                description.append(movie.overview);
                titleDesc.append(movieTitle);
                titleDesc.append(description);
                titleDesc.classList.add('titleDesc')

                //creating the div that holds the director and length of movie
                const dirLen = document.createElement('div');
                const movieDirector = document.createElement('span');
                movieDirector.append(movieDir);
                movieDirector.classList.add('director')
                const movieLen = document.createElement('span');
                movieLen.append(movieRunTime)
                dirLen.append("Directed by ", movieDirector, " ", movieLen, " min")
                dirLen.classList.add('dirLen')

                //appending the window to the movie list
                movieList.append(movieWindow);

                //appending all the items to the movie window
                movieWindow.append(moviePoster);
                movieWindow.append(titleDesc);
                movieWindow.append(dirLen)
            }

        }
    }
}

const clearSearch = () => {
    const element = document.getElementById("movieList");
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
