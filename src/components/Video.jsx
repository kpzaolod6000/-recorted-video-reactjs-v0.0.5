import React from "react";
import { ImPlay3 } from "react-icons/im";
import { Card, CardBody, Box, IconButton, Icon } from "@chakra-ui/react";
import {useNavigate} from 'react-router-dom'
import {result} from '../assets/constant/ResultRecord'


const Video = ({ video: { id, ask} }) => {

  const navigate = useNavigate();

  const handleClickPlayVideo = (event) => {
    event.stopPropagation();
    console.log(result);

    const recordedVideo = document.querySelector('video#recorded'+id);
    
    const mimeType = result.codecPreferences.options[
      result.codecPreferences.selectedIndex
    ].value.split(";", 1)[0];

    const BlobId = result.recordedBlobsState.find((res) => res.id == id);

    console.log("mimeType", mimeType);
    console.log("recordedBlobs", BlobId.response);

    const superBuffer = new Blob(BlobId.response, { type: mimeType });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
  }

  return (
    <Card align="center" w="280px" h="450px" bg="#6c75b2" mx="2px" cursor="pointer" _hover={{ bg: "#434b7f", color: "#fff" }} onClick={() => {
        
        const BlobId = result?.recordedBlobsState?.find((res) => res.id == id)?.response;
        if (BlobId == null) {
          return navigate(`/detail-video/${id}`)    
        }else
          null
      }}>
      <CardBody>
        <Box display="flex" flexDirection="column">
          
          <Box
            position="relative"
            bg="black"
            height="300px"
            width="100%"
            borderRadius="md"
            mb={4}
          >
            <video id={"recorded"+id} playsInline loop></video>
            <Box position="absolute" bottom={0} left={0} p={4}>
              <IconButton
                size="xl"
                variant="link"
                colorScheme="telegram"
                aria-label="Play icon"
                onClick={handleClickPlayVideo}
                icon={<Icon as={ImPlay3} />}
              />
            </Box>
          </Box>
          <Box p={4}>
            <Box as="h2" fontSize="xl" fontWeight="bold" mb={2}>
              {ask}
            </Box>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default Video;
