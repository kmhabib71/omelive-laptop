import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
// import socket from "../../socket";
import io from "socket.io-client";
import { saveAs } from "file-saver";
import { AuthContext } from "../Auth/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import countries from "../../Data/countries.json";
import Modal from "../../components/Modal";
import ProfileSetup from "./ProfileSetup";
import FilterModal from "./FilterModal";
import GiftPanel from "./GiftPanel";
import ReceivedGift from "./ReceivedGift";
import ReportForm from "./Report";

const backendUrl = "http://localhost:5000";
const languageCodeMapping = {
  English: "en",
  Türkçe: "tr",
  Bangla: "bn",
  // Add other languages and their codes here
};

function Home() {
  const { callerSocketId } = useParams();
  const { isLoggedIn, authUser, loading } = useContext(AuthContext);
  const socketRef = useRef(null);
  const localStream = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnection = useRef(null);
  const messageEndRef = useRef(null);
  // const sendChannel = useRef(null);
  const [mySocketId, setMySocketId] = useState(null);
  const [sendChannel, setSendChannel] = useState(null);
  const [receiveChannel, setReceiveChannel] = useState(null);
  const [waitingMessage, setWaitingMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [nextChatEnabled, setNextChatEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [gender, setGender] = useState("male");
  const [genderOpen, setGenderOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isGiftPanelVisible, setIsGiftPanelVisible] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverUserId, setReceiverUserId] = useState(null); // State for receiver's MongoDB user ID
  const [receivedGift, setReceivedGift] = useState(null);
  const [showReceivedGift, setShowReceivedGift] = useState(false);
  // ........For transcript..........
  const [transcript, setTranscript] = useState("");
  const [translatedTranscript, setTranslatedTranscript] = useState("");
  const recognitionRef = useRef(null);
  const translationLang = "tr"; // Target translation language (Spanish as an example)
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);

  useEffect(() => {
    console.log(
      "Translation API Key:",
      process.env.REACT_APP_GOOGLE_TRANSLATION_API_KEY
    );
    console.log("Speech API Key:", process.env.REACT_APP_GOOGLE_SPEECH_API_KEY);

    const { webkitSpeechRecognition } = window;
    if (!webkitSpeechRecognition) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptPiece);
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      setTranscript(interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event);
      toast.error("Speech recognition error. Restarting...");
      recognitionRef.current.stop();
      recognitionRef.current.start();
    };

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended. Restarting...");
      recognitionRef.current.start();
    };

    recognitionRef.current.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const translateText = async (text) => {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2`,
        null, // Note: Pass `null` instead of `{}` for the data parameter
        {
          params: {
            q: text,
            target: languageCodeMapping[language],
            key: process.env.REACT_APP_GOOGLE_TRANSLATION_API_KEY,
          },
        }
      );
      setTranslatedTranscript(
        response.data.data.translations[0].translatedText
      );
    } catch (error) {
      console.error(
        "Translation error:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        `Failed to translate the text: ${
          error.response ? error.response.data.error.message : error.message
        }`
      );
    }
  };

  // Throttle translation requests to avoid hitting API rate limits
  const throttleTranslateText = useCallback(throttle(translateText, 2000), [
    translateText,
  ]);

  useEffect(() => {
    if (transcript) {
      throttleTranslateText(transcript);
    }
  }, [transcript]);

  // useEffect(() => {
  //   const { webkitSpeechRecognition } = window;
  //   if (!webkitSpeechRecognition) {
  //     toast.error("Speech recognition not supported in this browser.");
  //     return;
  //   }

  //   recognitionRef.current = new webkitSpeechRecognition();
  //   recognitionRef.current.continuous = true;
  //   recognitionRef.current.interimResults = true;
  //   recognitionRef.current.lang = "en-US";

  //   recognitionRef.current.onresult = (event) => {
  //     let interimTranscript = "";
  //     for (let i = event.resultIndex; i < event.results.length; i++) {
  //       const transcriptPiece = event.results[i][0].transcript;
  //       if (event.results[i].isFinal) {
  //         setTranscript((prev) => prev + transcriptPiece);
  //       } else {
  //         interimTranscript += transcriptPiece;
  //       }
  //     }
  //     setTranscript(interimTranscript);
  //   };

  //   recognitionRef.current.start();

  //   return () => {
  //     if (recognitionRef.current) {
  //       recognitionRef.current.stop();
  //     }
  //   };
  // }, []);
  // useEffect(() => {
  //   console.log(
  //     "Translation API Key:",
  //     process.env.REACT_APP_GOOGLE_TRANSLATION_API_KEY
  //   );
  //   console.log("Speech API Key:", process.env.REACT_APP_GOOGLE_SPEECH_API_KEY);
  // }, []);
  // const translateText = async (text) => {
  //   console.log(
  //     "API key is: ",
  //     process.env.REACT_APP_GOOGLE_TRANSLATION_API_KEY
  //   );
  //   try {
  //     const response = await axios.post(
  //       `https://translation.googleapis.com/language/translate/v2`,
  //       null,
  //       {
  //         params: {
  //           q: text,
  //           target: translationLang,
  //           key: process.env.REACT_APP_GOOGLE_TRANSLATION_API_KEY,
  //         },
  //       }
  //     );
  //     setTranslatedTranscript(
  //       response.data.data.translations[0].translatedText
  //     );
  //   } catch (error) {
  //     console.error(
  //       "Translation error:",
  //       error.response ? error.response.data : error.message
  //     );
  //     toast.error(
  //       `Failed to translate the text: ${
  //         error.response ? error.response.data.error.message : error.message
  //       }`
  //     );
  //   }
  // };
  // useEffect(() => {
  //   if (transcript) {
  //     translateText(transcript);
  //   }
  // }, [transcript]);

  // ........For transcript..........
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  const handleProfileUpdate = () => {
    setIsProfileIncomplete(false);
  };

  const getMediaStream = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing },
        audio: true,
      });

      if (localStream.current) {
        document.getElementById("localVideo").srcObject = localStream.current;
      }
    } catch (error) {
      console.error("Error getting media stream:", error);
    }
  };

  const switchCamera = async () => {
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"));

    // Stop the current video tracks
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => track.stop());
    }
    // ...demo add/
    // Get new video stream with the switched camera
    await getMediaStream();

    // Replace the video track in the peer connection
    if (peerConnection.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (socketRef.current && !socketRef.current.connected) {
        socketRef.current.connect();
      }
      toast.success("Internet connection restored.");
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error("Internet connection lost.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (loading || !isLoggedIn) return;
    if (
      !authUser?.userGender ||
      !authUser?.userLanguage ||
      !authUser?.userCountry
    ) {
      setIsProfileIncomplete(true);
      setModalOpen(true);
    }

    const socket = io(backendUrl, {
      reconnectionAttempts: 10, // Attempt to reconnect 10 times
      reconnectionDelay: 1000, // Start with a 1-second delay
      reconnectionDelayMax: 5000, // Max delay of 5 seconds
    });
    socketRef.current = socket; // Store socket instance in ref
    const init = async () => {
      await getMediaStream();
    };
    init();

    socket.on("connect", async () => {
      console.log("Connected to Socket.io server");

      setMySocketId(socket.id);
      console.log("My Socket ID is: ", socket.id);

      try {
        await axios.put(
          `${backendUrl}/api/items/User/${authUser._id}`,
          { socketID: socket.id },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.log("Error updating socket id :", error);
      }
      const userPayload = {
        id: socket.id,
        userid: authUser._id,
        email: authUser.email,
        name: authUser.name,
        userLanguage: authUser.userLanguage,
        userGender: authUser.userGender,
        userAge: authUser.userAge,
        userInterests: authUser.userInterests,
        userCountry: authUser.userCountry,
        isPremium: authUser.isPremium,
        filters: authUser.filters,
        isBlocked: authUser.isBlocked,
      };

      if (callerSocketId) {
        userPayload.callerSocketId = callerSocketId;
      }

      socket.emit("add-user", userPayload);

      socket.on("call-prompt", ({ callerSocketId, callerUserId }) => {
        if (
          window.confirm("You have an incoming call. Do you want to accept it?")
        ) {
          console.log("callerSocketId is: ", callerSocketId);
          if (peerConnection.current) {
            peerConnection.current.oniceconnectionstatechange = () => {
              console.log(
                "iceConnectionState: ",
                peerConnection.current
                  ? peerConnection.current.iceConnectionState
                  : "peerConnection is null"
              );
            };

            peerConnection.current.close();

            console.log(
              "iceConnectionState after close: ",
              peerConnection.current
                ? peerConnection.current.iceConnectionState
                : "peerConnection is null"
            );

            peerConnection.current = null;
          }

          if (remoteStreamRef.current) {
            remoteStreamRef.current.srcObject = null;
          }
          socket.emit("call-accepted", { callerSocketId, callerUserId });
        } else {
          socket.emit("call-rejected");
        }
      });

      socket.on("call-rejected", () => {
        toast.error("The call was rejected by the callee.");
      });
    });

    // socket.on("match-found", async (matchId) => {
    //   console.log(`Matched with: ${matchId}`);
    //   await setupWebRTC(false);
    // });

    // socket.on("match-found-for-remote", async (matchId) => {
    //   console.log(`Matched with as remote: ${matchId}`);
    //   await setupWebRTC(true);
    // });

    socket.on("match-found", ({ socketId, userId }) => {
      console.log(`Matched with: ${socketId}`);
      setReceiverId(socketId); // Set the receiver's socket ID
      console.log("user id is: ", userId);
      setReceiverUserId(userId); // Set the receiver's MongoDB user ID
      setupWebRTC(false);
    });

    socket.on("match-found-for-remote", ({ socketId, userId }) => {
      console.log(`Matched with as remote: ${socketId}`);
      setReceiverId(socketId); // Set the receiver's socket ID
      console.log("user id is: ", userId);
      setReceiverUserId(userId); // Set the receiver's MongoDB user ID
      setupWebRTC(true);
    });
    socket.on("call-user", ({ socketId, userId }) => {
      setReceiverId(socketId);
      setReceiverUserId(userId);
      setupWebRTC(true);
    });
    // useEffect(() => {
    //   axios.get(`http://localhost:5000/api/items/Task/${id}`).then((response) => {
    //     const task = response.data;
    //     console.log(response.data.deadline);
    //     setName(task.name);
    //     setDescription(task.description);
    //     setPriority(task.priority);
    //     setStatus(task.status);
    //     setDeadline(task.deadline);
    //     setUser(task.user);
    //   });
    // }, []);
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Connection error. Please check your internet connection.");
    });

    socket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
      toast.info("Attempting to reconnect...");
    });

    socket.on("reconnect_failed", () => {
      console.error("Reconnection failed.");
      toast.error(
        "Reconnection failed. Please check your internet connection."
      );
    });

    socket.on("reconnect", () => {
      console.log("Reconnected to the server.");
      toast.success("Reconnected to the server.");
      socket.emit("add-user", {
        id: socket.id,
        userid: authUser._id,
        email: authUser.email,
        name: authUser.name,
        userLanguage: authUser.userLanguage,
        userGender: authUser.userGender,
        userAge: authUser.userAge,
        userInterests: authUser.userInterests,
        userCountry: authUser.userCountry,
        isPremium: authUser.isPremium,
        filters: authUser.filters,
        isBlocked: authUser.isBlocked,
      });
    });
    socket.on("ice-candidate", async (candidate) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
          console.log("Received ICE candidate: ", candidate);
        }
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    });

    socket.on("offer", async (offer) => {
      console.log("Received offer: ", offer);
      await init();

      await setupWebRTC(false);

      try {
        console.log("set remotedescription");
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", answer);
        console.log("Sent answer: ", answer);
      } catch (e) {
        console.error("Error handling offer", e);
      }
    });

    socket.on("answer", async (answer) => {
      console.log("Received answer: ", answer);
      try {
        if (peerConnection.current.signalingState === "have-local-offer") {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log("answer set");
        } else {
          console.error(
            "Received answer in wrong state:",
            peerConnection.current.signalingState
          );
        }
      } catch (e) {
        console.error("Error handling answer", e);
      }
    });

    // const handleRemoteDisconnection = async () => {
    //   if (peerConnection.current) {
    //     peerConnection.current.oniceconnectionstatechange = () => {
    //       console.log(
    //         "iceConnectionState: ",
    //         peerConnection.current.iceConnectionState
    //       );
    //     };

    //     peerConnection.current.close();
    //     console.log(
    //       "iceConnectionState after close: ",
    //       peerConnection.current.iceConnectionState
    //     );

    //     peerConnection.current = null;
    //   }

    //   if (remoteStreamRef.current) {
    //     remoteStreamRef.current.srcObject = null;
    //   }
    //   // Clear the chat messages
    //   setChatMessages([]);

    //   console.log("Handled remote disconnection.");
    // };
    const handleRemoteDisconnection = async () => {
      if (peerConnection.current) {
        peerConnection.current.oniceconnectionstatechange = () => {
          console.log(
            "iceConnectionState: ",
            peerConnection.current
              ? peerConnection.current.iceConnectionState
              : "peerConnection is null"
          );
        };

        peerConnection.current.close();
        console.log(
          "iceConnectionState after close: ",
          peerConnection.current
            ? peerConnection.current.iceConnectionState
            : "peerConnection is null"
        );

        peerConnection.current = null;
      }

      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = null;
      }
      // Clear the chat messages
      setChatMessages([]);

      console.log("Handled remote disconnection.");
      socketRef.current.emit("next");
    };
    // const findNewMatch = () => {
    //   socket.emit("next");
    //   console.log("findNewMatch");
    // };

    socket.on("user-disconnected", async (userId) => {
      console.log("User disconnected:", userId);
      await handleRemoteDisconnection();
      // findNewMatch();
    });

    socket.on("user-disconnected-by-next", async (userId) => {
      console.log("User disconnected:", userId);
      await handleRemoteDisconnection();
    });
    socket.on("connection-limit-exceeded", () => {
      toast.warning(
        "You have reached your daily connection limit. Please try again tomorrow."
      );
    });
    socket.on("chat-time-ended", () => {
      toast.info("Your chat time has ended.");
      handleNext();
    });
    const setupWebRTC = async (createOffer) => {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "406fb0723be544ac736032ad",
            credential: "c1IC/Dmxk3dPOK0o",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "406fb0723be544ac736032ad",
            credential: "c1IC/Dmxk3dPOK0o",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "406fb0723be544ac736032ad",
            credential: "c1IC/Dmxk3dPOK0o",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "406fb0723be544ac736032ad",
            credential: "c1IC/Dmxk3dPOK0o",
          },
        ],
      });

      const newSendChannel =
        peerConnection.current.createDataChannel("sendDataChannel");
      setSendChannel(newSendChannel);

      newSendChannel.onopen = () => {
        console.log("Send data channel is now open and ready to use");
      };
      newSendChannel.onstatechange = onSendChannelStateChange;

      peerConnection.current.ondatachannel = (event) => {
        const receiveChannel = event.channel;
        setReceiveChannel(receiveChannel);
        receiveChannel.onmessage = onReceiveChannelMessageCallback;
        receiveChannel.onstatechange = onReceiveChannelStateChange;
      };
      peerConnection.current.oniceconnectionstatechange = () => {
        const iceState = peerConnection.current.iceConnectionState;
        console.log("ICE connection state:", iceState);

        if (
          iceState === "disconnected" ||
          iceState === "failed" ||
          iceState === "closed"
        ) {
          console.log(
            "ICE connection state indicates remote peer has closed the connection."
          );
        } else if (iceState === "connected" || iceState === "completed") {
          console.log("ICE connection established successfully.");
          setNextChatEnabled(true);
          checkIceCandidateState(peerConnection.current);
        } else if (iceState === "new") {
          console.log("ICE connection state is new, gathering candidates.");
        } else if (iceState === "checking") {
          console.log(
            "ICE connection state is checking, waiting for connection."
          );
        } else {
          console.log("Unknown ICE connection state:", iceState);
        }
      };

      peerConnection.current.onsignalingstatechange = () => {
        console.log("Signaling state:", peerConnection.current.signalingState);
        if (peerConnection.current.signalingState === "closed") {
          console.log(
            "Signaling state indicates remote peer has closed the connection."
          );
        }
      };

      function checkIceCandidateState(pc) {
        pc.getStats(null)
          .then((stats) => {
            stats.forEach((report) => {
              if (
                report.type === "candidate-pair" &&
                report.state === "succeeded"
              ) {
                console.log("ICE candidate pair state: connected");
                console.log("Local candidate:", report.localCandidateId);
                console.log("Remote candidate:", report.remoteCandidateId);
              }
            });
          })
          .catch((error) => {
            console.error("Error getting stats:", error);
          });
      }

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
          console.log("Sent ICE candidate: ", event.candidate);
        }
      };

      peerConnection.current.ontrack = (event) => {
        if (remoteStreamRef.current) {
          remoteStreamRef.current.srcObject = event.streams[0];
          console.log("Received remote stream: ", event.streams[0]);
          setNextChatEnabled(true);
        }
      };

      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, localStream.current);
          const senders = peerConnection.current.getSenders();
          console.log(
            "PeerConnection senders after adding local tracks:",
            senders
          );
        });
      } else {
        console.error("Local stream is not initialized");
        return;
      }

      if (createOffer) {
        try {
          const offer = await peerConnection.current.createOffer();

          await peerConnection.current.setLocalDescription(offer);
          socket.emit("offer", offer);

          console.log("Sent offer: ", offer);
        } catch (e) {
          console.error("Error creating offer", e);
        }
      }
    };
    const onReceiveChannelStateChange = (event) => {
      console.log("Receive channel state is: " + event.target.readyState);
    };

    // Function to handle state changes of the send channel
    const onSendChannelStateChange = (event) => {
      console.log("Send channel state is: " + event.target.readyState);
    };
    const onReceiveChannelMessageCallback = (event) => {
      console.log("Received Message");
      // Update the chat messages state with the new message
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Stranger", message: event.data },
      ]);
    };
    socket.on("gift-received", (gift) => {
      // Logic to display received gift
      // toast.success(`You received a gift: ${gift.name}`);
      setReceivedGift(gift);
      setShowReceivedGift(true);
      setTimeout(() => setShowReceivedGift(false), 5000); // Hide after 5 seconds
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if (socket.connected) {
        console.log("Disconnecting from Socket.io server");
        socket.off("gift-received");
        socket.disconnect();
        socket.off("call-prompt");
        socket.off("call-rejected");
      }
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [loading, isLoggedIn]);

  // const handleNext = () => {
  //   if (peerConnection.current) {
  //     peerConnection.current.oniceconnectionstatechange = () => {
  //       console.log(
  //         "iceConnectionState: ",
  //         peerConnection.current
  //           ? peerConnection.current.iceConnectionState
  //           : "peerConnection is null"
  //       );
  //     };

  //     peerConnection.current.close();

  //     console.log(
  //       "iceConnectionState after close: ",
  //       peerConnection.current
  //         ? peerConnection.current.iceConnectionState
  //         : "peerConnection is null"
  //     );

  //     peerConnection.current = null;
  //   }

  //   if (remoteStreamRef.current) {
  //     remoteStreamRef.current.srcObject = null;
  //   }
  //   socketRef.current.emit("next");
  // };
  // Function to handle ending a one-on-one call and transitioning back to random matching
  // const handleCallEnd = () => {
  //   socket.emit("call-ended");
  //   findNewMatch();
  // };

  // Function to handle the "Next" button click
  const handleNext = () => {
    if (peerConnection.current) {
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log(
          "iceConnectionState: ",
          peerConnection.current
            ? peerConnection.current.iceConnectionState
            : "peerConnection is null"
        );
      };

      peerConnection.current.close();

      console.log(
        "iceConnectionState after close: ",
        peerConnection.current
          ? peerConnection.current.iceConnectionState
          : "peerConnection is null"
      );

      peerConnection.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.srcObject = null;
    }
    socketRef.current.emit("next");
  };
  // Add socket event listener for handling disconnection
  // socket.on("user-disconnected-by-next", async (userId) => {
  //   console.log("User disconnected:", userId);
  //   await handleRemoteDisconnection();
  //   findNewMatch();
  // });

  // Add event listener for call-end action
  // socket.on("call-ended", () => {
  //   handleCallEnd();
  // });
  const applyUserFilters = (filters) => {
    // Logic to filter users based on the applied filters
    console.log("Applying filters:", filters);
    const filterstosave = { filters: filters };
    socketRef.current.emit("update-filters", { userId: authUser._id, filters });
    axios
      .put(`${backendUrl}/api/items/User/${authUser._id}`, filterstosave)
      .then((response) => {
        // toast.success("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile", error);
      });
  };
  const handleFullScreenPage = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  useEffect(() => {
    if (authUser && authUser.userLanguage) {
      setLanguage(authUser.userLanguage);
    }
  }, [authUser]); // Adjust dependency array to include only authUser

  useEffect(() => {
    if (authUser && authUser.userGender) {
      setGender(authUser.userGender);
    }
  }, [authUser]); // Adjust dependency array to include only authUser

  useEffect(() => {
    if (authUser && authUser.userCountry) {
      setSelectedCountry(authUser.userCountry);
    }
  }, [authUser]); // Adjust dependency array to include only authUser

  const sendData = (message) => {
    if (sendChannel && sendChannel.readyState === "open") {
      sendChannel.send(message);
      console.log("from SendData: ", message);
      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        { sender: "You", message, sent: true },
      ]);
      setInputValue("");
    } else {
      console.error("Send channel is not open");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Call your sendData function here
      sendData(inputValue);
    }
  };

  // const genderSelect = (gender) => {
  //   setGender(gender);
  //   setGenderOpen(false);
  //   axios
  //     .put(`${backendUrl}/api/gender/${authUser._id}`, {
  //       userGender: gender,
  //     })
  //     .then((response) => {
  //       toast.success("Gender Change Successfully");
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else if (error.request) {
  //         console.log(error.request);
  //       } else {
  //         console.log("Error", error.message);
  //       }
  //     });
  // };

  // const languageSelect = (language) => {
  //   setLanguage(language);
  //   setLanguageOpen(false);
  //   axios
  //     .put(`${backendUrl}/api/language/${authUser._id}`, {
  //       userLanguage: language,
  //     })
  //     .then((response) => {
  //       toast.success("Language Change Successfully");
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else if (error.request) {
  //         console.log(error.request);
  //       } else {
  //         console.log("Error", error.message);
  //       }
  //     });
  // };

  // const countrySelect = (country) => {
  //   setSelectedCountry(country);
  //   setCountryOpen(false);

  //   axios
  //     .put(`${backendUrl}/api/country/${authUser._id}`, {
  //       userCountry: country,
  //     })
  //     .then((response) => {
  //       toast.success("Countries Change Successfully");
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log(error.response.data);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       } else if (error.request) {
  //         console.log(error.request);
  //       } else {
  //         console.log("Error", error.message);
  //       }
  //     });
  // };

  const openModal = () => {
    setModalOpen(true);
  };

  // const closeModal = () => {
  //   setModalOpen(false);
  //   setGenderOpen(false);
  //   setLanguageOpen(false);
  //   setCountryOpen(false);
  // };
  const languages = [
    // "Bahasa Melayu",
    // "Bosanski",
    // "Català",
    // "Čeština",
    // "Dansk",
    // "Deutsch",
    // "Eesti",
    "English",
    // "Español",
    // "Français",
    // "Hrvatski",
    // "Indonesia",
    // "Italiano",
    // "Latviešu",
    // "Lietuvių",
    // "Magyar",
    // "Malti",
    // "Nederlands",
    // "Norsk",
    // "Polski",
    // "Português",
    // "Română",
    // "Shqip",
    // "Slovenščina",
    // "Slovenský",
    // "Srpski",
    // "Suomi",
    // "Svenska",
    // "Tagalog",
    // "Tiếng Việt",
    "Türkçe",
    // "Ελληνικά",
    // "Български",
    // "Македонски",
    // "Русский",
    // "Українська",
    // "עברית",
    // "العربية",
    // "انگریزی",
    // "فارسی",
    // "हिन्दी",
    // "ไทย",
    // "한국어",
    // "中文",
    // "日本語",
    // "繁體中文",
  ];
  console.log("loading is: ", isLoggedIn);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }
  // ..........gift............
  const toggleGiftPanel = () => {
    setIsGiftPanelVisible(!isGiftPanelVisible);
  };
  // ..........gift............
  // ..........Recording............
  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const combinedStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      mediaRecorderRef.current = new MediaRecorder(combinedStream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onstop = saveRecording;
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  };

  const saveRecording = () => {
    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    saveAs(blob, "recording.webm");
    recordedChunksRef.current = [];
  };

  // ..........End Recording............

  return (
    <div>
      {isOffline && (
        <div className="offline-warning bg-red-500 text-black p-2 text-center">
          You are offline
        </div>
      )}
      <div className="flex flex-col md:flex-row h-screen">
        {/* Left part */}
        <div className="flex flex-col w-full md:w-1/2 h-1/2 md:h-full">
          <div className="relative h-[65%] md:h-[80%] bg-gray-800">
            <video
              ref={remoteStreamRef}
              id="remoteVideo"
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {peerConnection.current && (
              <div
                className="gift-image absolute right-2 bottom-2 cursor-pointer"
                onClick={toggleGiftPanel}>
                <img
                  src="/images/gift.png"
                  alt=""
                  className="h-7 w-7 cursor-pointer"
                />
              </div>
            )}
            {mySocketId && receiverUserId && (
              <ReportForm
                reporterId={authUser._id}
                reportedUserId={receiverUserId}
              />
            )}
            {receivedGift && (
              <ReceivedGift gift={receivedGift} show={showReceivedGift} />
            )}
            {mySocketId && receiverUserId && (
              <GiftPanel
                isGiftPanelVisible={isGiftPanelVisible}
                socket={socketRef.current}
                senderId={authUser._id}
                receiverSocket={receiverId}
                receiverId={receiverUserId}
              />
            )}

            {/* <div className="absolute inset-0 flex items-center justify-center">
              {waitingMessage && (
                <div className="waiting-message absolute md:top-[50%] md:left-[28%] left-[20%] text-white">
                  {waitingMessage}
                </div>
              )}
            </div> */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 flex items-end justify-center ">
                {/* <h3>Transcription:</h3>
                <p>{transcript}</p>
                <h3>Translation:</h3> */}
                <p className="p-1 text-xl">{translatedTranscript}</p>
              </div>
            </div>
          </div>
          <div className="h-[35%] md:h-[20%] flex items-center justify-center">
            <div className="buttons flex justify-between z-40 relative bottom-0 w-full h-full">
              <div
                onClick={handleNext}
                className="start bg-[#68bf9d] flex items-center justify-center w-1/4 rounded ml-2 mt-2 md:h-[90%] mb-2 text-white text-xl cursor-pointer">
                {nextChatEnabled
                  ? language === "Türkçe"
                    ? "Sonraki"
                    : "Next"
                  : language === "Türkçe"
                  ? "Başlangıç"
                  : "Start"}
              </div>
              <div className="start bg-[#f1b29f] flex items-center justify-center w-1/4 rounded ml-2 mt-2 md:h-[90%] mb-2 text-white text-xl cursor-pointer">
                {language === "Türkçe" ? "Durmak" : "Stop"}
              </div>
              <div
                onClick={() => {
                  openModal();
                  setCountryOpen(true);
                }}
                className="start bg-white w-1/4 rounded ml-2 mt-2 md:h-[90%] mb-2 text-xl text-gray-700 shadow-md flex items-center justify-center cursor-pointer hover:bg-emerald-300">
                <div className="md:block hidden">
                  {language === "Türkçe" ? "Ülke" : "Country"}{" "}
                </div>
                <div className="flex items-center justify-center md:mt-2 text-base md:ml-2">
                  <br />
                  {selectedCountry !== "" ? (
                    <span className="font-bold md:mb-1">{selectedCountry}</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-6 ml-2 text-center text-gray-700">
                      <path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                    </svg>
                  )}
                </div>
              </div>
              <div
                onClick={() => {
                  openModal();
                  setGenderOpen(true);
                }}
                className="start bg-white flex items-center justify-center w-1/4 rounded m-2 text-xl shadow-md text-gray-700 cursor-pointer hover:bg-emerald-300">
                <div className="md:block hidden">
                  {language === "Türkçe" ? "ben" : "I'm"}{" "}
                  {language === "Türkçe"
                    ? gender === "male"
                      ? "erkek"
                      : gender === "female"
                      ? "kadın"
                      : "çift"
                    : gender}
                </div>
                <div>
                  {gender === "male" ? (
                    <img
                      src="/svg/male.svg"
                      alt="Your SVG"
                      className="h-7 ml-3 mt-1"
                    />
                  ) : gender === "female" ? (
                    <img
                      src="/svg/female.svg"
                      alt="Your SVG"
                      className="h-7 ml-3 mt-1"
                    />
                  ) : (
                    <img
                      src="/svg/couple.svg"
                      alt="Your SVG"
                      className="h-7 ml-3 mt-1"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right part */}
        <div className={`flex flex-col w-full md:w-1/2 h-1/2 md:h-full`}>
          <div
            className="relative h-[80%] bg-gray-400"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <button
              onClick={switchCamera}
              className="absolute text-white right-8 top-7 z-20">
              <img src="/svg/switch-camera.svg" alt="" className="h-7 w-7 " />
            </button>
            <button
              onClick={handleFilterClick}
              className="absolute text-white right-8 top-[4rem] z-20">
              <img src="/svg/filter.svg" alt="" className="h-7 w-7" />
            </button>
            <div className=" absolute right-8 top-[5rem] z-20 mt-2">
              {/* {isRecording && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded">
                  Recording...
                </div>
              )} */}
              <div className="absolute top-4 right-[-0rem] flex gap-2">
                {!isRecording && (
                  <div
                    className="w-6 h-6 bg-red-600 rounded-full cursor-pointer"
                    onClick={startRecording}
                    title="Start Recording"
                  />
                )}
                {isRecording && (
                  <div
                    className="w-6 h-6 bg-red-600 rounded-full cursor-pointer pulse animate-pulse"
                    onClick={stopRecording}
                    title="Stop Recording"
                  />
                )}
              </div>
            </div>
            <video
              id="localVideo"
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute text-white top-[35%] left-[40%] transition-opacity duration-300 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}>
              <div
                className="py-4 px-7 bg-gray-300 text-xl text-black rounded-md text-center mb-3 cursor-pointer"
                onClick={handleFullScreenPage}>
                {language === "Türkçe" ? "Tam ekran" : "FullScreen"}
              </div>
              <div
                className="py-4 px-7 bg-gray-300 text-xl text-black rounded-md text-center cursor-pointer"
                onClick={() => openModal()}>
                {language === "Türkçe" ? "Ayarlar" : "Settings"}
              </div>
            </div>
          </div>
          <div className="h-[20%] flex items-end justify-center overflow-y-scroll">
            <div className="relative chat bg-white w-full rounded-b-lg ">
              <div className="chatbox w-full pl-2 pt-1 overflow-y-scroll mb-[2.6rem]">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="py-1">
                    <b>
                      {msg.sent
                        ? language === "Türkçe"
                          ? "Sen"
                          : "You"
                        : language === "Türkçe"
                        ? "Yabancı"
                        : "Stranger"}
                      :
                    </b>{" "}
                    {msg.message}
                  </div>
                ))}
                <div ref={messageEndRef}></div>
              </div>
              <div className="text-input absolute bottom-0 w-full ">
                <input
                  type="text"
                  name="textinput"
                  id="textinput"
                  value={inputValue}
                  className="absolute bottom-0 w-full border-t focus:outline-none p-2"
                  placeholder={
                    language === "Türkçe"
                      ? "Mesajınızı buraya yazın ve enter tuşuna basın"
                      : "Type your message here and press enter"
                  }
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className={`fixed inset-0 top-[-60%] z-50 overflow-auto ${
          modalOpen ? "flex" : "hidden"
        } `}>
        <div
          className="fixed inset-0 bg-gray-900 opacity-80"
          onClick={closeModal}></div>{" "}
        <div
          className="relative p-4 bg-white w-full max-w-md m-auto flex-col flex rounded-lg z-10"
          onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <div
              className="absolute right-0 top-0 cursor-pointer"
              onClick={closeModal}>
              X
            </div>
            <div>
              <div className="gender flex justify-center items-center">
                <div className=" py-2 text-xl border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md  relative ">
                  <div className=" w-full flex flex-col justify-start items-center">
                    <div
                      onClick={() => {
                        setGenderOpen(!genderOpen);
                        setLanguageOpen(false);
                        setCountryOpen(false);
                      }}
                      className="flex items-center bg-gray-300 py-1 rounded-md px-16 cursor-pointer hover:bg-[#68bf9d] p-2 ">
                      <div className="text-xl">
                        {language === "Türkçe" ? "ben" : "I am"}:{" "}
                      </div>
                      {gender === "male" ? (
                        <img
                          src="/svg/male.svg"
                          alt="Your SVG"
                          className="h-7 ml-3 mt-1"
                        />
                      ) : gender === "female" ? (
                        <img
                          src="/svg/female.svg"
                          alt="Your SVG"
                          className="h-7 ml-3 mt-1"
                        />
                      ) : (
                        <img
                          src="/svg/couple.svg"
                          alt="Your SVG"
                          className="h-7 ml-3 mt-1"
                        />
                      )}
                    </div>
                    <div
                      className={`${
                        genderOpen ? "opacity-100" : "opacity-0 hidden"
                      } transition-opacity duration-300 ease-in-out border border-gray-400 rounded-md m-1 p-2 drop-shadow-sm shadow-md absolute top-12 bg-white z-40`}>
                      <div
                        onClick={() => genderSelect("male")}
                        className="flex items-center  py-1 rounded-md px-12 cursor-pointer hover:bg-[#68bf9d] ">
                        <div className="text-xl">
                          {language === "Türkçe" ? "Erkek" : "Male"}{" "}
                        </div>
                        <img
                          src="/svg/male.svg"
                          alt="Your SVG"
                          className="h-7 ml-3 mt-1"
                        />
                      </div>
                      <div
                        onClick={() => genderSelect("female")}
                        className="flex items-center  py-1 rounded-md px-12 cursor-pointer hover:bg-[#68bf9d]">
                        <div className="text-xl">
                          {language === "Türkçe" ? "Dişi" : "Female"}{" "}
                        </div>
                        <img
                          src="/svg/female.svg"
                          alt="Your SVG"
                          className="h-7 ml-3 mt-1"
                        />
                      </div>
                      <div
                        onClick={() => genderSelect("couple")}
                        className="flex items-center  py-1 rounded-md px-12 cursor-pointer hover:bg-[#68bf9d] ">
                        <div className="text-xl">
                          {language === "Türkçe" ? "çift" : "Couple"}{" "}
                        </div>
                        <img
                          src="/svg/couple.svg"
                          alt="Your SVG"
                          className="h-7 ml-3 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gender flex justify-center items-center">
                <div className=" py-2 text-xl border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md   ">
                  <div className=" w-full flex flex-col justify-start items-center relative">
                    <div
                      onClick={() => {
                        setLanguageOpen(!languageOpen);
                        setGenderOpen(false);
                        setCountryOpen(false);
                      }}
                      className="flex items-center bg-gray-300 py-1 rounded-md px-16 cursor-pointer hover:bg-[#68bf9d] p-2 ">
                      <div className="text-xl">
                        {language === "Türkçe" ? "Dil" : "Language"}: {language}
                      </div>
                    </div>
                    <div
                      className={`${
                        languageOpen ? "opacity-100" : "opacity-0 hidden"
                      } transition-opacity duration-300 ease-in-out border border-gray-400 rounded-md m-1 p-2 drop-shadow-sm shadow-md  absolute top-8 bg-gray-50 w-[100%] z-30`}>
                      <div className="grid grid-cols-2 gap-1  w-full ">
                        {languages.map((language, index) => (
                          <div
                            key={index}
                            onClick={() => languageSelect(language)}
                            className=" hover:bg-[#68bf9d] cursor-pointer text-center p-2 rounded-md">
                            {language}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="py-2 text-xl border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md mt-2">
                      <div className="w-full flex flex-col justify-start items-center relative">
                        <div
                          onClick={() => {
                            setCountryOpen(!countryOpen);
                            setGenderOpen(false);
                            setLanguageOpen(false);
                          }}
                          className="flex items-center bg-gray-300 py-1 rounded-md px-16 cursor-pointer hover:bg-[#68bf9d] p-2">
                          <div className="text-xl ">
                            Country: {selectedCountry}
                          </div>
                        </div>
                        <div
                          className={`${
                            countryOpen ? "opacity-100" : "opacity-0 hidden"
                          } transition-opacity duration-300 ease-in-out border border-gray-400 rounded-md m-1 p-2 drop-shadow-sm shadow-md absolute top-8 bg-gray-50 w-full z-30`}>
                          <div className="grid grid-cols-2 gap-1 w-full">
                            {countries.map((country, index) => (
                              <div
                                key={index}
                                onClick={() => countrySelect(country)}
                                className="hover:bg-[#68bf9d] cursor-pointer text-center p-2 rounded-md">
                                {country}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/logout"
                      className="py-2 text-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-400 rounded-md m-1 p-2 drop-shadow-sm shadow-md   bg-white z-10 mt-4 text-[#be5055] hover:bg-[#be5055] hover:text-white font-bold">
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <ProfileSetup
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        authUser={authUser}
      />
      {showFilterModal && (
        <FilterModal
          user={authUser}
          closeModal={() => setShowFilterModal(false)}
          countries={countries}
          applyUserFilters={applyUserFilters}
        />
      )}
    </div>
  );
}
// Throttle function to limit how often the translation function can be called
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
export default Home;
