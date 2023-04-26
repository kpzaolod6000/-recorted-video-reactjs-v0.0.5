import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
} from "@chakra-ui/react";
import Video from "./Video";
import DataVideos from "../assets/constant/DataVideos";

const MainCard = () => {
  
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
        {/* <CardFooter>
          <Button colorScheme="blue">Button</Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default MainCard;
