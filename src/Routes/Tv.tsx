import React from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { IGetTv, getTv  } from "../api";
import { makeImage } from "./../utils";
import Slider from "../Components/Slider";

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

function Tv(){
    const { data:tvnow, isLoading:nowLoading }= useQuery<IGetTv>("tv", getTv);
    return (
    <Wrapper>
     {nowLoading ? (
          <Loader>Loading...</Loader>
     ) : ( <>
        <Banner
         bg={makeImage(tvnow?.results[0].backdrop_path || "")}
        > 
         <Title>{tvnow?.results[0].name}</Title>
            <Overview>{tvnow?.results[0].overview}</Overview>
          </Banner>
          <Slider></Slider> 
         </>
     ) }

    </Wrapper>
    );
}

export default Tv;
