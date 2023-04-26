import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  CardFooter,
  Button
} from "@chakra-ui/react";
import Video from "./Video";
import DataVideos from "../assets/constant/DataVideos";
import {result} from '../assets/constant/ResultRecord'

const MainCard = () => {
  const [data, setData] = useState();
  
  const handleClick = () => {
    console.log(result.recordedBlobsState);
    setData(result.recordedBlobsState);
  }

  return (
    <div>
      <Card align="center">
        <CardHeader>
          <Heading size="md"> Video Cuestionario</Heading>
        </CardHeader>
        <CardBody>
          <Box
            bg="gray.50"
            p={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {DataVideos.map((video) => {
              return <Video key={video.id} video={video}/>;
            })}
          </Box>
        </CardBody>
        {
          result.recordedBlobsState?.every(res => res.response) ? 
          <CardFooter>
            <Button colorScheme="blue" onClick={handleClick}>Enviar</Button>
          </CardFooter> : null
        }
        {JSON.stringify(data,null,2)}
      </Card>
    </div>
  );
};

export default MainCard;
