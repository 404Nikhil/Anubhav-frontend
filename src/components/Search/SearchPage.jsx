import React, { useState, useEffect } from "react";
import NavbarMini from "../Navbar/NavbarMini";
import BlogCard from "../BlogSection/BlogCard";
import "./SearchPage.css";
import FilterPopUp from "../Filter/FilterPopUp";
import Filter from "../Filter/Filter";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useSearchParams } from "react-router-dom";
import company from "../../assets/images/company.png";
import { ReadTime } from "../../services/date";
import SearchCardLoading from "./SearchCardLoading"; 

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchValue = async () => {
      const query = searchParams.get('query');
      if (query) {
        fetchArticles(query);
      }
    };

    fetchSearchValue();
  }, [searchParams]);

  const [placement, setPlacement] = useState(true);
  const [intern, setIntern] = useState(false);
  const [videos, setVideos] = useState(false);
  const [filterPopUp, setFilterPopUp] = useState(false);

  const openFilterPopup = () => {
    setFilterPopUp(true);
  };

  const closeFilterPopUp = () => {
    setFilterPopUp(false);
  };

  const fetchArticles = async (query) => {
    setLoading(true);
    const params = { q: query };
    try {
      const response = await axios.get(BACKEND_URL + "/search", { params });
      if (response.data && Array.isArray(response.data.articles)) {
        setArticles(response.data.articles);
      } else {
        console.error("API response does not contain articles array:", response.data);
        setArticles([]);
      }
    } catch (error) {
      console.error("Failed to fetch articles", error);
      setArticles([]);
    } finally {
      setLoading(false); 
    }
  };

  const handlePlacement = () => {
    setPlacement(!placement);
    setIntern(false);
    setVideos(false);
  };

  const handleIntern = () => {
    setIntern(!intern);
    setPlacement(false);
    setVideos(false);
  };

  const handleVideos = () => {
    setVideos(!videos);
    setPlacement(false);
    setIntern(false);
  };

  return (
    <>
      {filterPopUp && <FilterPopUp closeFilterPopUp={closeFilterPopUp} />}
      <NavbarMini />
      <div className="pt-24 px-8 md:px-4 lg:px-14 2xl:px-28 h-full">
        <div className="w-full flex gap-8 h-full">
          <div className="section-left w-full flex flex-col gap-2 h-full">
            <div className="flex w-full justify-between items-center">
              <h3 className="font-[400] text-2xl">{articles.length} Articles found</h3>
              <svg
                onClick={() => openFilterPopup()}
                className="md:block hidden cursor-pointer border border-[#c1c1c1] hover:border-[#919191] transition-all rounded-lg p-[2px] w-7 h-7"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.3999 2.1001H18.5999C19.6999 2.1001 20.5999 3.0001 20.5999 4.1001V6.3001C20.5999 7.1001 20.0999 8.1001 19.5999 8.6001L15.2999 12.4001C14.6999 12.9001 14.2999 13.9001 14.2999 14.7001V19.0001C14.2999 19.6001 13.8999 20.4001 13.3999 20.7001L11.9999 21.6001C10.6999 22.4001 8.8999 21.5001 8.8999 19.9001V14.6001C8.8999 13.9001 8.4999 13.0001 8.0999 12.5001L4.2999 8.5001C3.7999 8.0001 3.3999 7.1001 3.3999 6.5001V4.2001C3.3999 3.0001 4.2999 2.1001 5.3999 2.1001Z"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.93 2.1001L6 10.0001"
                  stroke="#616161"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {loading ? (
              <>
                <SearchCardLoading />
                <SearchCardLoading />
                <SearchCardLoading />
                <SearchCardLoading />
                <SearchCardLoading />
              </>
            ) : (
              articles.map((item) => (
                <BlogCard
                  key={item._id}
                  link={`/blog/${item._id}`}
                  Title={item.title}
                  imagesrc={item.imageUrl === "your_image_url_here" ? company : item.imageUrl}
                  author={item.author?.name}
                  company={item.companyName}
                  data={item.description}
                  readingTime={ReadTime(item.description)}
                  date={item.createdAt}
                />
              ))
            )}
          </div>
          <div className="section-right md:hidden w-1/5 flex flex-col gap-2">
            <Filter />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
