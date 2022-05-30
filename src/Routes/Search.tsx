import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { IGetSearch, getSearch } from "../api";
import styled from "styled-components";
import { makeImage } from "./../utils";

const Wrapper = styled.div`
  background-color: black;
  margin: 100px 0 0 60px;
`;
const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Summury = styled.p`
  font-size: 20px;
  font-family: "GmarketSansLight";
  margin-bottom: 35px;
`;

const Container = styled.div``;
const ShowBox = styled.div`
  float: left;
  margin-right: 15px;
  ::after {
    overflow: hidden;
    content: "";
  }
`;
const Title = styled.div`
  margin: 10px 0;
`;

const Img = styled.img`
  width: 200px;
  height: 250px;
  border-radius: 10px;
`;

const ImgLI = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 250px;
  border-radius: 10px;
  background-color: gray;
  font-size: 18px;

`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetSearch>(["search", keyword], () =>
    getSearch("keyword")
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {data === null ? (
            <p>"We can't not find anything"</p>
          ) : (
            <>
              <Summury>
                I found {data?.total_results} search results about {keyword}.{" "}
              </Summury>
              <>
                {data?.results.map((datas) => (
                  <Container key={datas.id}>
                    {datas?.backdrop_path === null ? (
                      <ShowBox>
                        <ImgLI>No Image</ImgLI>
                        <Title>
                          {datas.name} {datas.overview.slice(0, 10)}
                        </Title>
                      </ShowBox>
                    ) : (
                      <ShowBox>
                        <Img src={makeImage(datas?.backdrop_path)} />
                        <Title>
                          {datas.name}
                          <div> {datas.overview.slice(0, 10)}</div>
                        </Title>
                      </ShowBox>
                    )}
                  </Container>
                ))}
              </>
            </>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Search;
