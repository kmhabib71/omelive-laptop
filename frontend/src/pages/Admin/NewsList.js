import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsTable from "./Components/NewsListComponents/NewsTable";
import Pagination from "./Components/NewsListComponents/Pagination";

function NewsList() {
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchNewsData();
  }, [currentPage]);

  const fetchNewsData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/newsList", {
        params: { page: currentPage + 1, pageSize: itemsPerPage },
      });
      setNewsData(response.data.news);
      console.log(response.data.news);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="App mt-12 mx-4">
      <h1 className="text-3xl font-bold mb-4">CNN News</h1>
      <NewsTable
        data={newsData}
        onPageChange={handlePageChange}
        setData={setNewsData}
      />
      <Pagination pageCount={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}

export default NewsList;
