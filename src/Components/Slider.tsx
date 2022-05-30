import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useMatch,PathMatch } from "react-router-dom";
import { makeImage } from "../utils";
import { useQuery } from "react-query";

const SliderDiv = styled.div`
  position: relative;
  top: -250px;
  p {
    font-size: 22px;
    margin: 20px;
  }
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
  fill: rgba(255, 255, 255, 0.5);
  cursor: pointer;
`;
const RightArrow = styled.svg`
  position: absolute;
  top: 40%;
  right: 10px;
  width: 45px;
  height: 45px;
  fill: rgba(255, 255, 255, 0.5);
  cursor: pointer;
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

const offset = 6; //6개씩 보일것이니

const Slider = () => {
  let data1,data2,data3;
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  //leaving을 체크해서, 슬라이더 에러잡기
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving(); //true가 됨
      const totalMovie = data.results.length - 1;
      const maxPage = Math.floor(totalMovie / offset) - 1;
      //페이지수 증가시키기전에 확인하기
      setIndex((prev) => (prev === maxPage ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/thecontents/movies/${movieId}`);
  };
  const bigMovieMatch: PathMatch<string> | null = useMatch(
    "/thecontents/movies/:movieId"
  );
   //클릭한 영화찾기
   const clickedMovie =
   bigMovieMatch?.params.movieId &&
   data?.results.find(
     (movie) => movie.id + "" === bigMovieMatch.params.movieId
   ) 
  return (
    <>
     {[data1,data2,data3].map((data)=> 
      <SliderDiv>
          <p> 요즘 인기있는 영화</p>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie: any) => (
                  <Box
                    layoutId={movie.id + ""}
                    onClick={() => onBoxClicked(movie.id)}
                    key={movie.id}
                    variants={BoxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bg={makeImage(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>
                        {movie.title.length > 25
                          ? `${movie.title.slice(0, 26)}...`
                          : movie.title}
                      </h4>
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
    </SliderDiv> )}
    </>
  );
};

export default Slider;
