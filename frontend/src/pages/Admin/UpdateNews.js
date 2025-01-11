import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import axios, { isCancel, AxiosError } from "axios";
// import Editor from "./Components/TextEditor/EditorWithUseQuill";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
function UpdateNews() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [updatedSelectedFile, setUpdatedSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64File, setBase64File] = useState("");
  const [editorText, setEditorText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedNewsCategory, setSelectedNewsCategory] = useState("");
  const [selectedNewsSubCategory, setSelectedNewsSubCategory] = useState("");
  const [NewsCategorys, setNewsCategorys] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];

  const maxFileSizeInBytes = 50 * 1024 * 1024;

  const handleEditorChange = (content) => {
    setEditorText(content);
    console.log("Editor Content:", content);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > maxFileSizeInBytes) {
        setError("File size exceeds the maximum allowed size.");
        return;
      }

      const fileType = file.type.split("/")[0];

      setSelectedFile(file);
      setFileType(fileType);
      setError(null);

      const reader = new FileReader();

      reader.onloadend = () => {
        const fileDataUrl = reader.result;
        setPreviewUrl(fileDataUrl);

        if (fileType === "image") {
          setBase64File(fileDataUrl.split(",")[1]);
        }
      };

      if (allowedFileTypes.includes(file.type)) {
        if (fileType === "image") {
          reader.readAsDataURL(file);
        } else if (fileType === "video") {
          // For video, set the preview URL as a Blob URL
          setPreviewUrl(URL.createObjectURL(file));
        }
      } else {
        setError(
          "Invalid file type. Please select a valid image or video file."
        );
      }
    }
  };

  // You can add additional validation or processing based on the file type

  //.............File uplode End
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // const NewsCategorys = [
  //   "Politics",
  //   "Entertainment",
  //   "Sports",
  //   "Technology",
  //   "Health",
  // ];

  const handleNewsCategoryChange = (e) => {
    setSelectedNewsCategory(e.target.value);
  };
  const handleNewsSubCategoryChange = (e) => {
    setSelectedNewsSubCategory(e.target.value);
  };
  // ...........updated code for update from createNews...........

  const [isImage, setIsImage] = useState(null);
  const [isVideo, setIsVideo] = useState(null);
  const [filename, setfilename] = useState(null);

  // Create a state for the file data
  const [file, setFile] = useState(null);
  const IMAGE_TYPES = ["jpeg", "jpg", "gif", "png", "webp"];
  const VIDEO_TYPES = ["mp4", "webm", "ogg"];
  function getFileType(fileString) {
    // Extract the file name from the URL
    const fileName = fileString.split("/").pop();

    // Extract the file extension
    const fileExtension = fileName.split(".").pop();

    return fileExtension.toLowerCase();
  }
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typeResponse = await axios.get("http://localhost:8080/api/types"); // Replace with your API endpoint
        setTypes(typeResponse.data);
        console.log("types is :", typeResponse.data);
      } catch (error) {
        console.error("Error fetching types:", error.message);
      }
    };

    fetchTypes();
  }, []);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagResponse = await axios.get("http://localhost:8080/api/tags"); // Replace with your API endpoint
        setTags(tagResponse.data);
        console.log("tags is :", tagResponse.data);
      } catch (error) {
        console.error("Error fetching tags:", error.message);
      }
    };

    fetchTags();
  }, []);
  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:8080/api/getAllNewsCategories")
      .then((response) => {
        // Assuming the API response data is an array of categories
        const getAllcategories = response.data;

        // Update the state with the fetched categories
        setNewsCategorys(getAllcategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch subcategories based on the selected category
    if (selectedNewsCategory) {
      axios
        .get(
          `http://localhost:8080/api/getSubcategories/${selectedNewsCategory}`
        )
        .then((response) => {
          setSubcategories(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
        });
    }
  }, [selectedNewsCategory]);

  useEffect(() => {
    // Fetch existing news data if updating
    const fetchNewsData = async () => {
      if (id) {
        axios
          .get(`http://localhost:8080/getNewsByID/${id}`)
          .then((res) => {
            // Set the news data
            // setNews(res.data);
            // Fetch the file data from GridFS
            // console.log(res.data);
            const fileTypes = getFileType(res.data.file);
            setTitle(res.data.title);
            setAuthorName(res.data.authorName);
            setSelectedNewsCategory(res.data.newsCategory);
            setSelectedNewsSubCategory(res.data.subCategory);
            setEditorText(res.data.editorText);
            setfilename(res.data.file);
            setSelectedType(res.data.type);
            setSelectedTag(res.data.tag);
            console.log("Fetch data is", res.data);
            // Determine file type and use the corresponding constant

            setIsImage(IMAGE_TYPES.includes(fileTypes));
            setIsVideo(VIDEO_TYPES.includes(fileTypes));

            console.log("File type:", fileType);
            axios
              .get(
                `http://localhost:8080/filesForNewsByFilename/${res.data.file}`,
                { responseType: "arraybuffer" }
              )
              .then((res) => {
                console.log("Resdata :", res.data);

                // Set the file data
                // Check the Content-Type header to determine file type
                const contentType = res.headers["content-type"];

                // Set the file data
                const blob = new Blob([res.data], { type: contentType });
                const dataURL = URL.createObjectURL(blob);
                console.log("dataURL is: ", dataURL);

                // setFile({
                //   dataURL,
                //   contentType,
                // });
                setUpdatedSelectedFile(dataURL);
                // setFile(res.data);
                // console.log("files is: ", file.dataURL);
                console.log("File type is :", fileType);
              })
              .catch((err) => {
                // Handle error
                console.error(err);
              });
          })
          .catch((err) => {
            // Handle error
            console.error(err);
          });
      }
    };

    fetchNewsData();
  }, [id]);

  const handleNewstypeChange = (e) => {
    setSelectedType(e.target.value);
  };
  const handleNewstagChange = (e) => {
    setSelectedTag(e.target.value);
  };
  // ...........end updated code for update from createNews...........
  const handleDataSubmit = async (e) => {
    e.preventDefault();

    // Your form submission logic...
    let newsData = new FormData();
    newsData.append("id", id);
    newsData.append("title", title);

    if (selectedFile) {
      newsData.append("file", selectedFile);
    }
    newsData.append("newsCategory", selectedNewsCategory);
    newsData.append("subCategory", selectedNewsSubCategory);
    newsData.append("type", selectedType);
    newsData.append("editorText", editorText);
    newsData.append("tag", selectedTag);
    newsData.append("authorName", authorName);
    newsData.append("filename", filename);

    console.log("title ", title);
    console.log("file ", selectedFile);
    console.log("newsCategory ", selectedNewsCategory);
    console.log("editorText ", editorText);
    console.log("authorName ", authorName);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/updatenews",
        newsData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Data sent successfully", response.data);
      alert("Article Succesfully updated.");
      // Perform actions on successful response
    } catch (error) {
      console.error("Error sending data", error);
      // Handle the error
    }
  };
  return (
    <>
      <div className="mt-28">
        <div className="mx-auto bg-white drop-shadow-md w-10/12 rounded">
          <h3 className="p-6 font-bold mb-8 text-black border-b">
            {" "}
            Write News Article
          </h3>
          <div className="container p-5">
            <form onSubmit={handleDataSubmit}>
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
                <label
                  htmlFor="newsType"
                  className="block text-sm text-gray-600">
                  News Type
                </label>
                <select
                  id="NewsType"
                  name="NewsType"
                  value={selectedType}
                  onChange={handleNewstypeChange}
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

              {/* {selectedType === "LiveUpdate" && (
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
            )} */}

              <div className="mb-10">
                <label className="block text-sm text-gray-600">
                  Upload File
                </label>
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
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-gray-700 mb-1">
                  News Editor
                </label>
                <ReactQuill
                  theme="snow"
                  value={editorText}
                  onChange={handleEditorChange}
                />

                {/* <Editor
              placeholder={"Write something..."}
              onChange={handleEditorChange}
              initialText={editorText}
            /> */}
              </div>
              <div className="mb-10"></div>
              <div className="mb-10">
                <label
                  htmlFor="newsType"
                  className="block text-sm text-gray-600">
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
                  {NewsCategorys.map((category) => (
                    <option value={category.title} key={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-10">
                <label
                  htmlFor="newsType"
                  className="block text-sm text-gray-600">
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
                  {subcategories.map((subcategory) => (
                    <option value={subcategory.name} key={subcategory._id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-10">
                <label
                  htmlFor="newsType"
                  className="block text-sm text-gray-600">
                  News Tag
                </label>
                <select
                  id="NewsTag"
                  name="NewsTag"
                  value={selectedTag}
                  onChange={handleNewstagChange}
                  className="mt-2 p-3 bg-gray-200 focus:outline-none w-full border rounded-md">
                  <option value="" disabled>
                    Select News Tag
                  </option>
                  {tags.map((NewsTag) => (
                    <option value={NewsTag.name} key={NewsTag._id}>
                      {NewsTag.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-10">
                <label
                  htmlFor="author"
                  className="block text-sm  text-gray-600">
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
                  onClick={handleDataSubmit}
                  className="bg-gray-900 w-full text-white p-2  rounded-md hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateNews;
