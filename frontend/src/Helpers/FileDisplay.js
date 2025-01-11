import React, { useState, useEffect } from "react";
import axios from "axios";
// A custom component that takes the file name as a prop
const FileDisplay = ({ fileName }) => {
  //   console.log("filename from Displayfile is: ", fileName);
  // Use state variables to store the file data and the file type
  const [file, setFile] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const IMAGE_TYPES = ["jpeg", "jpg", "gif", "png", "webp"];
  const VIDEO_TYPES = ["mp4", "webm", "ogg"];

  // Use a useEffect hook to fetch the file data only when the file name changes
  function getFileType(fileString) {
    // Extract the file name from the URL
    // console.log("filestring : ", fileString);
    const fileName = fileString.split("/").pop();

    // Extract the file extension
    const fileExtension = fileName.split(".").pop();

    return fileExtension.toLowerCase();
  }

  useEffect(() => {
    // Check if the file name is undefined or not
    if (typeof fileName !== "undefined") {
      // The rest of the code remains the same as before
      const fileType = getFileType(fileName);

      // Determine file type and use the corresponding constant

      setIsImage(IMAGE_TYPES.includes(fileType));
      setIsVideo(VIDEO_TYPES.includes(fileType));

      console.log("File type:", fileType);
      axios
        .get(`http://localhost:8080/filesForNewsByFilename/${fileName}`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          console.log("Resdata :", response.data);

          // Check the Content-Type header to determine file type
          const contentType = response.headers["content-type"];

          // Set the file data
          const blob = new Blob([response.data], { type: contentType });
          const dataURL = URL.createObjectURL(blob);
          console.log("dataURL is: ", dataURL);

          setFile({
            dataURL,
            contentType,
          });
        });
    }
  }, [fileName]); // Pass the file name as a dependency

  // Return the image or video element based on the file type
  return file ? (
    isImage ? (
      <img src={file.dataURL} />
    ) : isVideo ? (
      <video
        src={file.dataURL}
        className="w-full h-full rounded-sm"
        autoPlay={true}
        muted
        playsinline
        loop
        controls
      />
    ) : (
      // Handle unsupported file types or other cases
      <p>Unsupported file type</p>
    )
  ) : (
    // Render something when there is no file
    // <p>No file selected</p>
    console.log("No file for the post")
  );
};
export default FileDisplay;
