import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Movie from './Routes/Movie';


function App() {  
  return (<>
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/thecontents" element={<Home />} />
        <Route path="/thecontents/movies/:movieid" element={<Home />} />
        <Route path="/thecontents/movie" element={<Movie />} />
        <Route path="/thecontents/tv" element={<Tv />} />
        <Route path="/thecontents/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
