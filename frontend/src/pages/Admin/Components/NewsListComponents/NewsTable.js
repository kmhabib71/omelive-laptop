import axios from "axios";
import React, { useState } from "react";
// import Pagination from "./Pagination";
import { Link } from "react-router-dom";
const NewsTable = ({ data, setData, onPageChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [newsData, setNewsData] = useState(data);
  const filteredData = data.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //   const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    onPageChange({ selected }); // Pass the page change event to the parent
  };

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  //   const filteredData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  //   const currentPage = 1; // Assuming the current page is 1 (0-indexed)
  //   const itemsPerPage = 10;

  // const paginatedData = filteredData.slice(
  //     currentPage * itemsPerPage, // currentPage * itemsPerPage = 1 * 10 = 10
  //     (currentPage + 1) * itemsPerPage // (currentPage + 1) * itemsPerPage = (1 + 1) * 10 = 20
  // );

  // [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  const handleDelete = (id) => {
    setDeletedItemId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/news/${deletedItemId}`);

      console.log("Before deletion:", newsData);
      // Update the state to remove the deleted item
      setData((prevData) =>
        prevData.filter((item) => item._id !== deletedItemId)
      );
      // Log data after updating the state
      console.log("After deletion:", newsData);

      console.log(`News with ID ${deletedItemId} deleted successfully`);
      // Reset the deletedItemId and close the modal
      setDeletedItemId(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };
  // };
  const handleCreateNews = () => {
    // Implement the logic for creating a new news item
    console.log("Create new news");
  };
  function formatDate(dateTimeString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = new Date(dateTimeString).toLocaleDateString(
      undefined,
      options
    );

    return formattedDate;
  }
  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline">
                      Delete News
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this news article?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmDelete}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search news..."
            className="border p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Link to={`/admin/news-management/create`}>
            <button
              onClick={handleCreateNews}
              className="bg-blue-500 text-white mb-4 py-2 px-4 rounded hover:bg-blue-600">
              Create News
            </button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-start">Title</th>
              <th className="py-2 px-4 border-b text-start">Category</th>
              <th className="py-2 px-4 border-b text-start">Author</th>
              <th className="py-2 px-4 border-b text-start">Published Date</th>
              <th className="py-2 px-4 border-b text-center pl-12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item._id}>
                <td className="py-2 px-4 border-b">
                  <Link to={`/${item._id}`}>{item.title}</Link>
                </td>
                <td className="py-2 px-4 border-b">{item.newsCategory}</td>
                <td className="py-2 px-4 border-b">{item.authorName}</td>
                <td className="py-2 px-4 border-b">
                  {formatDate(item.createdAt)}
                </td>

                <td className="py-2 px-4 border-b flex self-end justify-end">
                  <button>
                    <Link
                      to={`/admin/news-management/update/${item._id}`}
                      className="text-blue-500 hover:underline mr-2 flex ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      <div>Edit</div>
                    </Link>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:underline flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    <div>Trash</div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <Pagination pageCount={pageCount} onPageChange={handlePageChange} /> */}
    </div>
  );
};

export default NewsTable;
