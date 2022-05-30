import React from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { IGetMovie, getMovies } from "../api";
import { makeImage } from "./../utils";

const Wrapper = styled.div``;
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
  font-size: 55px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 25px;
  width: 50%;
  font-family: "GmarketSansLight";
`;

function Movie(){
    const { data, isLoading }= useQuery<IGetMovie>("Movie", getMovies);
    return (
    <Wrapper>
     {isLoading ? (
          <Loader>Loading...</Loader>
     ) : ( <>
        <Banner
         bg={makeImage(data?.results[0].backdrop_path || "")}
        > 
        <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[1].overview}</Overview>
          </Banner>
         </>
     ) }

    </Wrapper>
    );
}

export default Movie;
