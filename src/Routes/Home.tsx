import React, { useState } from "react";
import { IGetPopular, getPopular,IGetUpCoimg,IGetMovie,getUpCoimg,getMovies } from "./../api";
import styled from "styled-components";
import { makeImage } from "./../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMatch } from "react-router-dom";
import Slider from "../Components/Slider";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bg: string }>`
  //전체화면
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bg});
  background-size: cover;
`;
const Title = styled.h2`
  font-family: "GmarketSansBold";
  font-size: 58px;
  margin-bottom: 20px;
  margin-top: 30px;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 40%;
  font-family: "GmarketSansLight";
  line-height: 1.5;
`;

const PlayBtn = styled.button`
  width: 150px;
  height: 50px;
  border-radius: 5px;
  border: none;
  margin: 25px 0;
  font-size: 22px;
  cursor: pointer;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 30vw;
  height: 70vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  background-color: ${(props) => props.theme.black.lighter};
`;
const CloseBtn = styled.button`
  position: absolute;
  border: none;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 25px;
  right: 15px;
  top: 15px;
  padding: 10px;
  cursor: pointer;
  transition: color 0.5s;
  :hover {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  position: relative;
  top: -90px;
  font-size: 18px;
  font-family: "GmarketSansLight";
  p {
    font-size: 32px;
    margin-bottom: 12px;
    font-family: "GmarketSansMedium";
  }
`;

const BigOverview = styled.p`
  top: -90px;
  position: relative;
  font-family: "GmarketSansLight";
  line-height: 1.5;
  padding: 20px;
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;


function Home() {
  const { data:get , isLoading:isLoading1  } = useQuery<IGetMovie>( "now",getMovies);
  const { data:pop , isLoading:isLoading2  } = useQuery<IGetPopular>( "popular",getPopular);
  const { data:up , isLoading:isLoading3  } = useQuery<IGetUpCoimg>( "upcoimg",getUpCoimg);
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const [btnClick, setBtnClick] = useState(false);
  const onBtnClick = () => {
    setBtnClick(true);
    navigate(`/thecontents`); //home으로 돌아가기
  };
  return (
    <Wrapper>
      <Helmet>
        <title>The Contents</title>
      </Helmet>
      {isLoading1 ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bg={makeImage(get?.results[0].backdrop_path || "")}>
          <Title>{get?.results[0].title}</Title>
            <Overview>{get?.results[0].overview}</Overview>
            <PlayBtn>&#x25B6; Play</PlayBtn>
          </Banner>
          <Slider results={get?.results}></Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  <CloseBtn onClick={onBtnClick}>X</CloseBtn>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          borderRadius: "10px 10px 0 0",
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImage(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        <p>{clickedMovie.title}</p>
                        <span>Vote  : {clickedMovie.vote_average} </span>
                        <span>Release date : {clickedMovie.release_date}</span>
                        <span>{clickedMovie.adult ? " All" : " Adult"}</span>
                      </BigTitle>

                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
