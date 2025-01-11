// Create a new file
const mongodb = require("mongodb");
const uuid = require("uuid");
const Blog = require("../model/Blog");
const client = new mongodb.MongoClient(
  "mongodb+srv://mohammedsaimuae:Flower71@cluster0.rbmepuu.mongodb.net/Mern-Engine?retryWrites=true&w=majority"
);
const storeFile = async function (req, res) {
  console.log("Image Data is :", req.file);
  const BlogIdToUpdate = req.body.id;
  try {
    if (req.file) {
      client.connect().then(() => {
        const db = client.db("Mern-Engine");
        const bucket = new mongodb.GridFSBucket(db);

        const file = req.file;
        console.log("File is :", file);
        const fileBuffer = file.buffer;
        const uniqueIdentifier = uuid.v4();

        const newFileName = `${uniqueIdentifier}_${file.originalname}`;

        bucket
          .openUploadStream(newFileName)
          .end(fileBuffer)
          .on("error", function (error) {
            console.log("Error uploading file", error);
            res.status(500).send({
              message: "Error uplading file",
              error: error.message,
            });
          })
          .on("finish", function (file) {
            Blog.findOneAndUpdate(
              { _id: BlogIdToUpdate },
              {
                $set: {
                  file: newFileName,
                },
              },
              { new: true } // Set to true if you want to return the modified document
            )
              .then((updatedBlog) => {
                if (!updatedBlog) {
                  return res.status(404).send({
                    message: `Blog article with id ${BlogIdToUpdate} not found.`,
                  });
                }
                res.status(200).json({ message: "Blog Updated Successfully." });
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while updating the Blog article.",
                });
              });
            console.log("File Stored in DB");
          });
      });
    }
  } catch (error) {
    console.log("Error storing file :", error);
  }
};

// Get a file by ID
const getFile = async function (req, res) {
  console.log("From filesForNewsByFilename");

  client.connect().then(() => {
    // Get the database and the GridFS bucket
    const db = client.db("Mern-Engine");
    const bucket = new mongodb.GridFSBucket(db);

    // Get the filename from the request params
    const filename = req.params.filename;
    console.log("filename is :", filename);
    // Find the file by filename
    async function handleFile() {
      const file = await bucket.find({ filename }).toArray();
      console.log("file is: ", file);

      if (file.length > 0) {
        const dataBuffer = [];
        const downloadStream = bucket.openDownloadStreamByName(filename);

        downloadStream.on("data", (chunk) => {
          dataBuffer.push(chunk);
        });

        downloadStream.on("end", () => {
          const data = Buffer.concat(dataBuffer);
          // Now 'data' contains the binary data of the file
          console.log("data is :", data);
          // Send the file data in the response
          res.status(200).send(data);
        });
      } else {
        console.log("File not found");
        // Handle accordingly, send an error response, etc.
      }
    }

    handleFile();
  });
};

module.exports = {
  storeFile,
  getFile,
};
