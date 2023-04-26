import React, {
  MutableRefObject,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ImPlay2,
  ImArrowLeft2,
  ImArrowRight2,
  ImStop,
  ImCross,
  ImSpinner11
} from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import DataVideos from '../assets/constant/DataVideos'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
  Text,
  Box,
  IconButton,
  Icon,
} from "@chakra-ui/react";

const DetailVideo = () => {
  const [recordedBlobsState, setRecordedBlobsState] = useState(DataVideos);
  const [isPlay, setIsPlay] = useState(false);
  const [mediaRecorderState, setMediaRecorderState] = useState();
  const [newPage, setNewPage] = useState(false);

  const params = useParams();
  

  const navigate = useNavigate();

  const videoGum = useRef();
  const msmError = useRef();
  const codecPreferences = useRef();

  let recordedBlobs;
  let mediaRecorder;

  const handleClickHome = () => {
    if (window.stream) {
      console.log("apagar camara");
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    navigate("/");
  };

  const handleDataAvailable = (event) => {
    console.log("handleDataAvailable", event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };

  const handleClickStartRecording = () => {

    /*for new record*/
    setRecordedBlobsState((prev) => {
      const newPrev = prev.map((video) => {
        if (video.id == params.id) video.response = null;
        return video;
      });
      return newPrev;
    });

    recordedBlobs = [];
    const mimeType =
      codecPreferences.current.options[codecPreferences.current.selectedIndex]
        .value;
    const options = { mimeType };

    try {
      mediaRecorder = new MediaRecorder(window.stream, options);
      // setMediaRecorder(createMediaRecorder);
    } catch (e) {
      console.error("Exception while creating MediaRecorder:", e);
      errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
        e
      )}`;
      return;
    }
    console.log(
      "Created MediaRecorder",
      mediaRecorder,
      "with options",
      options
    );
    // recordButton.textContent = 'Stop Recording';
    // playButton.disabled = true;
    // downloadButton.disabled = true;
    // codecPreferences.disabled = true;
    mediaRecorder.onstop = (event) => {
      console.log("Recorder stopped: ", event);
      console.log("Recorded Blobs: ", recordedBlobs);

      setRecordedBlobsState((prev) => {
        const newPrev = prev.map((video) => {
          if (video.id == params.id) video.response = recordedBlobs;
          return video;
        });
        return newPrev;
      });
    };

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log("MediaRecorder started", mediaRecorder);
    setMediaRecorderState(mediaRecorder);
    setIsPlay(true);
  };

  const handleClickStopRecording = () => {
    setIsPlay(false);
    mediaRecorderState.stop();
  };

  const getSupportedMimeTypes = () => {
    const possibleTypes = [
      "video/webm;codecs=av1,opus",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=h264,opus",
      "video/mp4;codecs=h264,aac",
    ];
    return possibleTypes.filter((mimeType) => {
      return MediaRecorder.isTypeSupported(mimeType);
    });
  };

  const handleSuccess = (stream) => {
    // recordButton.disabled = false;
    console.log("getUserMedia() got stream:", stream);
    window.stream = stream;

    const gumVideo = videoGum.current;
    gumVideo.srcObject = stream;

    // const gumVideo = document.querySelector('video#gum');
    // gumVideo.srcObject = stream;

    getSupportedMimeTypes().forEach((mimeType) => {
      const option = document.createElement("option");
      option.value = mimeType;
      option.innerText = option.value;
      console.log(option);
      codecPreferences.current.appendChild(option);
    });
    codecPreferences.current.disabled = false;
  };

  const init = async (constraints) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      console.error("navigator.getUserMedia error:", e);
      // errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
  };

  const handleClickPlay = async () => {
    // document.querySelector('button#start').disabled = true;
    // const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    // var codecPreferences = document.querySelector("#codecPreferences");
    const constraints = {
      audio: {
        echoCancellation: { exact: true },
      },
      video: {
        width: 1280,
        height: 720,
        // width: 640, height: 480
      },
    };
    console.log("Using media constraints:", constraints);
    await init(constraints);
  };

  /*desaparecera*/
  const handleClickPlayRecorded = () => {
    
    const recordedVideo = document.querySelector('video#recorded');
    const mimeType = codecPreferences.current.options[
      codecPreferences.current.selectedIndex
    ].value.split(";", 1)[0];

    console.log("mimeType", mimeType);
    console.log("recordedBlobs", recordedBlobsState);

    const superBuffer = new Blob(recordedBlobsState, { type: mimeType });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
  };


  useEffect(() => {
    console.log("recordedBlobsin useEffect: ", recordedBlobsState);
    if (recordedBlobsState.find((video) => video.id == params.id).response !== null) {
      handleClickPlayRecorded();
    }else{
      handleClickPlay();
    }
  }, [recordedBlobsState,newPage]);
  
  const handleClickBack = () => {
    console.log("back");

    // DataVideos.forEach((video) => {
    //   if (video.id == params.id) video.response = recordedBlobs;
    // });

    setIsPlay(false);
    setMediaRecorderState(null);
    setNewPage((prev) => !prev);

    const pageIndex = parseInt(params.id) - 1;

    navigate("/detail-video/" + (pageIndex <= 0 ? 1 : pageIndex));
  };

  const handleClickNext = () => {
    console.log("next");

    console.log(recordedBlobsState);

    setIsPlay(false);
    setMediaRecorderState(null);
    setNewPage((prev) => !prev);

    const pageIndex = parseInt(params.id) + 1;

    navigate(
      "/detail-video/" + (pageIndex > DataVideos.length ? 1 : pageIndex)
    );
  };

  // console.log(recordedBlobsState);
  // console.log(params);
  // console.log(videoGum.current);
  return (
    <Card align="center" width={500} height={580} bg="#cddcf9">
      <CardHeader>
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          width="100%"
        >
          <IconButton
            size="lg"
            variant="link"
            colorScheme="telegram"
            aria-label="Play icon"
            onClick={handleClickHome}
            icon={<Icon as={ImArrowLeft2} />}
          />
          Volver
        </Box>
        <Heading
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          size="md"
        >
          Grabación de Video
        </Heading>
        <p>{recordedBlobsState.find((video) => video.id == params.id).ask}</p>
      </CardHeader>
      <CardBody>
        {
        recordedBlobsState.find((video) => video.id == params.id).response == null ? (
          <video id="gum" playsInline autoPlay muted ref={videoGum}></video>
        ) : (
          <video id="recorded" playsInline loop></video>
        )}

        <div>
          <span id="errorMsg" ref={msmError}></span>
        </div>
        <div style={{ display: "none" }}>
          Recording format:{" "}
          <select
            id="codecPreferences"
            ref={codecPreferences}
            disabled
          ></select>
        </div>


        {
          recordedBlobsState.find((video) => video.id == params.id).response == null ? (
            !isPlay ? (
              <Box
                position="relative"
                bottom={0}
                left={0}
                p={4}
                onClick={handleClickStartRecording}
              >
                <IconButton
                  size="lg"
                  variant="link"
                  colorScheme="telegram"
                  aria-label="Play icon"
                  icon={<Icon as={ImPlay2} />}
                />
              </Box>
            ) : (
              <Box
                position="relative"
                bottom={0}
                left={0}
                p={4}
                onClick={handleClickStopRecording}
              >
                <IconButton
                  size="lg"
                  variant="link"
                  colorScheme="telegram"
                  aria-label="Play icon"
                  icon={<Icon as={ImStop} />}
                />
              </Box>
            )
          ) : (!isPlay ? (
            <Box
              position="relative"
              bottom={0}
              left={0}
              p={4}
              onClick={handleClickStartRecording}
            >
              <IconButton
                size="lg"
                variant="link"
                colorScheme="telegram"
                aria-label="Play icon"
                icon={<Icon as={ImSpinner11} />}
              />
            </Box>
          ) : (
            <Box
              position="relative"
              bottom={0}
              left={0}
              p={4}
              onClick={handleClickStopRecording}
            >
              <IconButton
                size="lg"
                variant="link"
                colorScheme="telegram"
                aria-label="Play icon"
                icon={<Icon as={ImStop} />}
              />
            </Box>
          ))
        }
        
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <IconButton
            size="lg"
            variant="link"
            colorScheme="telegram"
            aria-label="Play icon"
            onClick={handleClickBack}
            icon={<Icon as={ImArrowLeft2} />}
          />
          {recordedBlobsState.every((video) => video.response) ? (
            <IconButton
              size="lg"
              variant="link"
              colorScheme="telegram"
              aria-label="Play icon"
              onClick={handleClickNext}
              icon={<Icon as={ImCross} />}
            />
          ) : (
            <IconButton
              size="lg"
              variant="link"
              colorScheme="telegram"
              aria-label="Play icon"
              onClick={handleClickNext}
              icon={<Icon as={ImArrowRight2} />}
            />
          )}
        </Box>
      </CardBody>
      {/* <CardFooter>
          <Button colorScheme="blue">Button</Button>
        </CardFooter> */}
    </Card>
  );
};

export default DetailVideo;
