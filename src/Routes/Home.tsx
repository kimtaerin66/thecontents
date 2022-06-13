import React, { useState } from "react";
import { useQuery } from "react-query";
import { IGetMovie, getMovies,IGetTv,getAirTv } from "./../api";
import styled from "styled-components";
import { makeImage } from "./../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useMatch ,PathMatch } from "react-router-dom";


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

const Sliders = styled.div`
  position: relative;
  margin-bottom:70px ;
  top: -200px;
`;

const Sliders2 = styled.div`
  position: relative;
  top: 0px;
  margin-bottom:70px ;
`;

//slider안에서 애니메이션작동하기위해 motion
const Row = styled(motion.div)`
  display: grid;
  //6개를 1:1:1...비율로
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;
const LeftArrow = styled.svg`
position: absolute;
top: 40%;
left: 10px;
width: 45px;
height: 45px;
fill: rgba(255,255,255,0.5);
cursor: pointer;
`;
const RightArrow = styled.svg`
position: absolute;
top: 40%;
right: 10px;
width: 45px;
height: 45px;
fill: rgba(255,255,255,0.5);
cursor: pointer;
filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5));
`;

const RightArrow2 = styled(RightArrow)`
top: 130px;
`;

const Box = styled(motion.div)<{ bg: string }>`
  background-color: white;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center; //상하 좌우
  height: 200px;
  font-size: 50px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 15px;
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
const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  position: relative;
  top: -90px;
  font-size: 18px;
  font-family: 'GmarketSansLight';
  p {
    font-size: 32px;
    margin-bottom: 12px;
    font-family: 'GmarketSansMedium';
  }
`;
const CloseBtn = styled.button`
position: absolute;
border: none;
background-color: transparent;
color: rgba(255,255,255,0.5);
font-size: 25px;
right: 15px;
top: 15px;
padding: 10px;
cursor: pointer;
transition: color 0.5s;
:hover{
  color: rgba(0,0,0,0.5);
}
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

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const STitle = styled.p`
font-size: 22px;
margin-bottom: 20px;
padding-left: 20px;
`;


//사용자의 화면크기를 알아서 보여줄부분, 숨길부분 판단
// +5, -5은 6개씩 한줄이라 Box에 준 gap값.
const rowVariants = {
    hidden: {
      x: window.innerWidth + 5,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -window.innerWidth - 5,
    },
  };
  
  const BoxVariants = {
    normal: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      y: -50, //위로올라가기
      transition: {
        delay: 0.5,
        duration: 0.3,
        type: "tween", //통통튀는거 잡기
      },
    },
  };
  
  const infoVariants = {
    hover: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.3,
        type: "tween", //통통튀는거 잡기
      },
    },
  }; 
  //leaving을 체크해서, 슬라이더 에러잡기

export const offset = 6; //6개씩 보일것이니


function Home() {
  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [ btnClick, setBtnClick ] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/thecontents/movies/${movieId}`);
  };
  const { data:data1, isLoading:isLoading1 } = useQuery<IGetMovie>(
    ["movies", "now_playing"],()=> getMovies()
  );
  const { data:data2, isLoading:isLoading2} = useQuery<IGetTv>(
    ["tv","airing"],()=> getAirTv()
  )
  const onBtnClick = () => {
    setBtnClick(true);
    navigate(`/thecontents`); //home으로 돌아가기
  }
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch(
   `/thecontents/movies/:movieId`
  );
    //클릭한 영화찾기
    const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data1?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
    const { scrollY } = useViewportScroll();
    const increaseIndex = () => {
      if (data1) {
        if (leaving) return;
        toggleLeaving(); //true가 됨
        const totalMovie = data1.results.length - 1;
        const maxPage = Math.floor(totalMovie / offset) - 1;
        //페이지수 증가시키기전에 확인하기
        setIndex((prev) => (prev === maxPage ? 0 : prev + 1));
      }
    };
    const increaseIndex2 = () => {
      if (data2) {
        if (leaving) return;
        toggleLeaving(); //true가 됨
        const totalMovie = data2.results.length - 1;
        const maxPage = Math.floor(totalMovie / offset) - 1;
        //페이지수 증가시키기전에 확인하기
        setIndex2((prev) => (prev === maxPage ? 0 : prev + 1));
      }
    };
 
  return (
    <Wrapper>
      <HelmetProvider>
      <Helmet>
        <title>The Contents</title>
      </Helmet>
      </HelmetProvider>
      {isLoading1 ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bg={makeImage(data1?.results[0].backdrop_path || "")}
          >
            <Title>{data1?.results[0].title}</Title>
            <Overview>{data1?.results[0].overview}</Overview>
            <PlayBtn>&#x25B6; Play</PlayBtn>
          </Banner>
          <>
        <Sliders>
          <STitle>현재 상영중인 영화</STitle>
        <AnimatePresence initial={false}
         onExitComplete={toggleLeaving}>
         <Row
            key={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
          >
            {data1?.results
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  key={movie.id}
                  variants={BoxVariants}
                  onClick={() =>
                    onBoxClicked(movie.id)
                  }
                  initial="normal"
                  whileHover="hover"
                  transition={{
                    type: "tween",
                  }}
                  bg={
                    movie.backdrop_path || movie.poster_path !== null
                      ? makeImage(
                          movie.backdrop_path || movie.poster_path,
                          "w500"
                        )
                      : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"
                  }
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
             <RightArrow
                onClick={increaseIndex}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 512"
              >
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </RightArrow>
          </Row>
        </AnimatePresence>
      </Sliders>
      <Sliders2
      >
  <STitle>현재 방영중인 프로그램</STitle>
        <AnimatePresence initial={false}
         onExitComplete={toggleLeaving}>
         <Row
            key={index2}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
          >
            {data2?.results
              .slice(offset * index2, offset * index2 + offset)
              .map((tv) => (
                <Box
                  layoutId={tv.id + ""}
                  key={tv.id}
                  variants={BoxVariants}
                  onClick={() =>
                    onBoxClicked(tv.id)
                  }
                  initial="normal"
                  whileHover="hover"
                  transition={{
                    type: "tween",
                  }}
                  bg={
                    tv.backdrop_path || tv.poster_path !== null
                      ? makeImage(
                        tv.backdrop_path || tv.poster_path,
                          "w500"
                        )
                      : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"
                  }
                >
                  <Info variants={infoVariants}>
                    <h4>{tv.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
          <RightArrow2
                onClick={increaseIndex2}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 512"
              >
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </RightArrow2>
        </AnimatePresence>
      </Sliders2>
       <AnimatePresence>
       {bigMovieMatch ? (
         <>
           <Overlay 
           exit={{opacity : 0}}
           animate={{opacity : 1}}
           />
           <BigMovie
             layoutId={bigMovieMatch.params.movieId}
             style={{ top: scrollY.get() + 100 }}
           > <CloseBtn onClick={onBtnClick} >X</CloseBtn>
             {clickedMovie && (
               <>
                 <BigCover
                   style={{
                     borderRadius: "10px 10px 0 0" ,
                     backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImage(
                       clickedMovie.backdrop_path,
                       "w500"
                     )})`,
                   }}
                 />
                 <BigTitle>
                   <p>{clickedMovie.title}</p>
                  <span>Vote : {clickedMovie.vote_average} </span>
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
        </>
      )}
    </Wrapper>
  );
}

export default Home;
