import React, { useEffect, useState } from "react";
import Editor from "./Components/TextEditor/TextEditorWithQuill";
import axios from "axios";
import socket from "../Helpers/Socket";
function CreateNews() {
  const [title, setTitle] = useState("");
  const [types, setTypes] = useState([]);
  const [NewsCategory, setNewsCategory] = useState([]);
  const [NewsSubCategory, setNewsSubCategory] = useState([]);
  const [NewsTag, setNewsTag] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedNewsCategory, setSelectedNewsCategory] = useState("");
  const [selectedNewsSubCategory, setSelectedNewsSubCategory] = useState("");
  const [selectedNewsTag, setSelectedNewsTag] = useState("");
  const [editorText, setEditorText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [liveUpdateTypes, setLiveUpdateTypes] = useState([]);
  const [selectedLiveUpdateType, setSelectedLiveUpdateType] = useState("");
  const [liveUpdateHeadline, setLiveUpdatetHeadline] = useState([]);
  const [isLiveUpdateType, setIsLiveUpdateType] = useState(false);
  const [showHeadLine, setShowHeadLine] = useState("");

  const handleNewsTypeChange = (e) => {
    setSelectedType(e.target.value);
    console.log(e.target.value);
  };
  const handleNewsCategoryChange = (e) => {
    setSelectedNewsCategory(e.target.value);
    console.log(e.target.value);
  };
  const handleNewsSubCategoryChange = (e) => {
    setSelectedNewsSubCategory(e.target.value);
    console.log(e.target.value);
  };
  const handleNewsTagChange = (e) => {
    setSelectedNewsTag(e.target.value);
    console.log(e.target.value);
  };
  const maxFileSizeinBytes = 50 * 1024 * 1024;
  const allowedFileTypes = [
    "image/jpeg",
    "image/JPG",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxFileSizeinBytes) {
        setError("File Size in exceeds the maximum allowed size.");
        return;
      }
    }
    const fileType = file.type.split("/")[0];
    setSelectedFile(file);
    setFileType(fileType);
    setError(null);

    if (allowedFileTypes.includes(file.type)) {
      if (fileType === "image") {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileDataUrl = reader.result;
          setPreviewUrl(fileDataUrl);
        };

        reader.readAsDataURL(file);
      } else if (fileType === "video") {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
    console.log(file);
  };
  const handleEditorChange = (content) => {
    setEditorText(content);
    console.log("Editor Content: ", content);
  };

  const backEndBaseUrl = "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typeResponse = await axios.get(`${backEndBaseUrl}/api/types`);
        setTypes(typeResponse.data);

        const tagResponse = await axios.get(`${backEndBaseUrl}/api/tags`);
        setNewsTag(tagResponse.data);

        const categoryResponse = await axios.get(
          `${backEndBaseUrl}/api/getAllNewsCategories`
        );
        setNewsCategory(categoryResponse.data);

        if (selectedType === "LiveUpdate") {
          setIsLiveUpdateType(true);
          const liveUpdateResponse = await axios.get(
            `${backEndBaseUrl}/api/getLastFiveLiveUpdateNewsType`
          );
          setLiveUpdateTypes(
            liveUpdateResponse.data.map((item) => item.liveUpdateType)
          );
          if (showHeadLine) {
            const liveUpdateHeadlineResponse = await axios.get(
              `${backEndBaseUrl}/api/getHeadline/${showHeadLine}`
            );
            console.log(
              "liveUpdateHeadlineResponse is:",
              liveUpdateHeadlineResponse
            );
            setLiveUpdatetHeadline(liveUpdateHeadlineResponse.data);
          }
          console.log("liveUpdateResponse is: ", liveUpdateResponse);
        } else {
          setIsLiveUpdateType(false);
        }
        if (selectedLiveUpdateType) {
          const selectedLiveUpdateTypeResponse = await axios.get(
            `${backEndBaseUrl}/api/getLastFiveLiveUpdateNewsType/${selectedLiveUpdateType}`
          );
          setLiveUpdatetHeadline(selectedLiveUpdateTypeResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [selectedType, selectedLiveUpdateType]);
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        if (selectedNewsCategory) {
          const subcategoryResponse = await axios.get(
            `${backEndBaseUrl}/api/getsubcategories/${selectedNewsCategory}`
          );
          setNewsSubCategory(subcategoryResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubcategories();
  }, [selectedNewsCategory]);
  const handleLiveUpdateTypeChange = async (e) => {
    setSelectedLiveUpdateType(e.target.value);
    setShowHeadLine(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newsData = new FormData();

    newsData.append("title", title);
    newsData.append("type", selectedType);
    newsData.append("isLiveUpdate", isLiveUpdateType);
    newsData.append("liveUpdateType", selectedLiveUpdateType);
    newsData.append("liveUpdateHeadlinie", liveUpdateHeadline);
    newsData.append("file", selectedFile);
    newsData.append("newsCategory", selectedNewsCategory);
    newsData.append("subCategory", selectedNewsSubCategory);
    newsData.append("tag", selectedNewsTag);
    newsData.append("editorText", editorText);
    newsData.append("authorName", authorName);
    console.log("title", title);
    console.log("type", selectedType);
    console.log("liveUpdateType", selectedLiveUpdateType);
    console.log("liveUpdateHeadlinie", liveUpdateHeadline);
    console.log("file", selectedFile);
    console.log("newsCategory", selectedNewsCategory);
    console.log("subCategory", selectedNewsSubCategory);
    console.log("tag", selectedNewsTag);
    console.log("editorText", editorText);
    console.log("authorName", authorName);

    try {
      const response = await axios.post(
        `${backEndBaseUrl}/api/createnews`,
        newsData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      socket.emit("liveUpdate", true);
      alert(response.data);

      window.location.reload();
    } catch (error) {
      console.error("Error sending data", error);
    }
  };
  return (
    <div className="mt-28">
      <div className="mx-auto bg-white drop-shadow-md w-10/12 rounded">
        <h3 className="p-6 font-bold mb-8 text-black border-b">
          {" "}
          Write News Article
        </h3>
        <div className="container p-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-10">
              <label htmlFor="title" className="block text-sm  text-gray-600">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
              />
            </div>
            <div className="mb-10">
              <label htmlFor="newsType" className="block text-sm text-gray-600">
                News Type
              </label>
              <select
                id="NewsType"
                name="NewsType"
                value={selectedType}
                onChange={handleNewsTypeChange}
                className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md">
                <option value="" disabled>
                  Select News Type
                </option>
                {types.map((types) => (
                  <option value={types.name} key={types._id}>
                    {types.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedType === "LiveUpdate" && (
              <>
                {liveUpdateTypes.length !== 0 ? (
                  <div className=" bg-yellow-100 px-4 mb-10 rounded">
                    <div className="flex justify-between py-5">
                      <div className=" w-full">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-600">
                          Live Update News Type
                        </label>
                        <input
                          type="text"
                          id="LiveUpdateType"
                          name="LiveUpdateType"
                          placeholder="eg: ukraine-russia-war"
                          onChange={handleLiveUpdateTypeChange}
                          className="mt-2 p-3 mr-2 bg-gray-200 focus:outline-none w-full border rounded-md"
                          required
                        />
                      </div>
                      <p className=" font-medium text-xs flex items-center mb-2 ml-2 text-gray-600">
                        OR
                      </p>
                      <div className=" w-full">
                        <label
                          htmlFor="LiveUpdateType"
                          className="block text-sm font-medium  ml-2.5 text-gray-600">
                          Live Update News Type
                        </label>
                        <select
                          id="LiveUpdateType"
                          name="LiveUpdateType"
                          value={selectedLiveUpdateType}
                          onChange={handleLiveUpdateTypeChange}
                          className="mt-2 p-[0.95rem] ml-2 bg-gray-200 focus:outline-none w-full border rounded-md">
                          <option value="" disabled>
                            Select Live News Type
                          </option>
                          {liveUpdateTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="pb-5">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-600">
                        Live Update Main Headline
                      </label>
                      <input
                        type="text"
                        id="LiveUpdateType"
                        name="LiveUpdateType"
                        value={liveUpdateHeadline}
                        onChange={(e) => {
                          setLiveUpdatetHeadline(e.target.value);
                        }}
                        placeholder="Live Update Main Headline"
                        className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className=" bg-yellow-200 px-4 mb-10 rounded">
                    <div className="py-5">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-600">
                        Live Update News Type
                      </label>
                      <input
                        type="text"
                        id="LiveUpdateType"
                        name="LiveUpdateType"
                        placeholder="eg: ukraine-russia-war"
                        onChange={handleLiveUpdateTypeChange}
                        className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                        required
                      />
                    </div>
                    <div className="pb-5">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-600">
                        Live Update Main Headline
                      </label>
                      <input
                        type="text"
                        id="LiveUpdateType"
                        name="LiveUpdateType"
                        value={liveUpdateHeadline}
                        onChange={(e) => {
                          setLiveUpdatetHeadline(e.target.value);
                        }}
                        placeholder="Live Update Main Headline"
                        className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mb-10">
              <label className="block text-sm text-gray-600">Upload File</label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                className="sr-only"
                accept="image/*,video/*"
              />
              <label
                htmlFor="file"
                className="mt-1 p-2 w-full cursor-pointer border border-gray-300 rounded-md flex items-center  justify-center bg-blue-600 text-white hover:bg-gray-900">
                Select Image or Video
              </label>
              {error && <p className="text-red-500">{error}</p>}
              {previewUrl && (
                <div className="mt-2">
                  {fileType === "image" && (
                    <img
                      src={previewUrl}
                      alt="Preview image"
                      className="max-w-full h-96"
                    />
                  )}
                  {fileType === "video" && (
                    <video
                      controls
                      src={previewUrl}
                      alt="Preview image"
                      className="w-100  object-cover">
                      <source src={previewUrl} type={selectedFile.type} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
            <Editor
              placeholder="Write Something..."
              onChange={handleEditorChange}
              initialText={""}
            />
            <div className="mb-10"></div>
            <div className="mb-10">
              <label htmlFor="newsType" className="block text-sm text-gray-600">
                News Category
              </label>
              <select
                id="NewsCategory"
                name="NewsCategory"
                value={selectedNewsCategory}
                onChange={handleNewsCategoryChange}
                className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md">
                <option value="" disabled>
                  Select News Category
                </option>
                {NewsCategory.map((category) => (
                  <option value={category.title} key={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-10">
              <label htmlFor="newsType" className="block text-sm text-gray-600">
                News Sub Category
              </label>
              <select
                id="NewsSubCategory"
                name="NewsSubCategory"
                value={selectedNewsSubCategory}
                onChange={handleNewsSubCategoryChange}
                className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md">
                <option value="" disabled>
                  Select News Sub Category
                </option>
                {NewsSubCategory.map((subcategory) => (
                  <option value={subcategory.name} key={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-10">
              <label htmlFor="newsType" className="block text-sm text-gray-600">
                News Tag
              </label>
              <select
                id="NewsTag"
                name="NewsTag"
                value={selectedNewsTag}
                onChange={handleNewsTagChange}
                className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md">
                <option value="" disabled>
                  Select News Tag
                </option>
                {NewsTag.map((NewsTag) => (
                  <option value={NewsTag.name} key={NewsTag._id}>
                    {NewsTag.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-10">
              <label htmlFor="author" className="block text-sm  text-gray-600">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md"
              />
            </div>
            <div className="mb-10 mt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-gray-900 w-full text-white p-2  rounded-md hover:bg-blue-600">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateNews;
