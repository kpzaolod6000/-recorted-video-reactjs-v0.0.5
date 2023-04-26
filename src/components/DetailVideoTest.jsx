import React, { MutableRefObject, useRef } from "react";
import { ImPlay3 } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";


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
  Icon
} from "@chakra-ui/react";

const DetailVideo = () => {
  const params = useParams();
  const navigate = useNavigate();
  // const videoGum = useRef();
  // const ButtonPlay = useRef();

  
  function getSupportedMimeTypes() {
    const possibleTypes = [
      'video/webm;codecs=av1,opus',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/mp4;codecs=h264,aac',
    ];
    return possibleTypes.filter(mimeType => {
      return MediaRecorder.isTypeSupported(mimeType);
    });
  }
  
  function handleSuccess(stream) {
    // recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;
  
    const gumVideo = document.querySelector('video#gum');
    gumVideo.srcObject = stream;
  
    getSupportedMimeTypes().forEach(mimeType => {
      const option = document.createElement('option');
      option.value = mimeType;
      option.innerText = option.value;
      codecPreferences.appendChild(option);
    });
    codecPreferences.disabled = false;
  }
  
  async function init(constraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      console.error('navigator.getUserMedia error:', e);
      // errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
  }
  
  const handleClick = async () => {
    document.querySelector('button#start').disabled = true;
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const constraints = {
      audio: {
        echoCancellation: {exact: hasEchoCancellation}
      },
      video: {
        width: 1280, height: 720
      }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
  }
  return (
    <div id="container">
      <video id="gum" playsInline autoPlay muted></video>
      <video id="recorded" playsinline loop></video>

      <div>
          <button id="start" onClick={handleClick}>Start camera</button>
          <button id="record" disabled>Start Recording</button>
          <button id="play" disabled>Play</button>
          <button id="download" disabled>Download</button>
      </div>

      <div>
          Recording format: <select id="codecPreferences" disabled></select>
      </div>
      <div>
          <p>Echo cancellation: <input type="checkbox" id="echoCancellation"></input></p>
      </div>

      <div>
          <span id="errorMsg"></span>
      </div>
  </div>

  );
};

export default DetailVideo;
