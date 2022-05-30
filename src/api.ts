const API_KEY = "29d327c32dc3a1c939eb4afde17beeee";
const BASE_PATH = "https://api.themoviedb.org/3";

//영화 poulular / nowPlaying=get기본 / upComing

//poulular의 result배열
interface IPop {
  id: number;
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average :number;
  release_date:string;
}
export interface IGetPopular {
  results :IPop[],
}

//upComing
interface IUpComing {
  id: number
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetUpCoimg {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IUpComing[];
  total_pages: number;
  total_results: number;
}
//기본 get-now
interface IMovie {
  id: number;
  adult: boolean;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average :number;
  release_date:string;
}
export interface IGetMovie {
  results :IMovie[],
}


//-----------------------tv----------
//IGetTv의 result배열
interface ITV {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  overview: string;
  poster_path: string;
}

export interface IGetTv {
      results :ITV[];
}
//-----------------------search----------
//getSearch interface
interface ISearch {
  backdrop_path: string;
  media_type:string;
  gender : number;
  id : number;
  name: string;
  overview: string;
}
export interface IGetSearch {
  results: ISearch[];
  total_results: number;
}




//fetcher 함수

//Home >moviePopular
export function getPopular() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (res)=>res.json()
  );
}
//곧 개봉할
export function getUpCoimg() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}
//////
//tv top rated
export function getTopTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (res)=>res.json()
  );
}


export function getTv(){
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`)
  .then((res)=>res.json()
  );
}

//MultiSearch를 사용하면, tv, movie는 물론 사람까지 검색가능
export function getSearch(keyword : string){
  return fetch(`
  ${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&page=1`)
  .then((res)=>res.json()
  );
}


//movie detail
export function getMoviesDetail(movieId: number){
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`)
  .then((res)=>res.json()
  );
}
