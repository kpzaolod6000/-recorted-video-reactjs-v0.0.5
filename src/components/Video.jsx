import React from "react";
import { ImPlay3 } from "react-icons/im";
import { Card, CardBody, Box, IconButton, Icon } from "@chakra-ui/react";
import {useNavigate} from 'react-router-dom'
// import { color } from "../../node_modules/framer-motion/dist/index";


const Video = ({ video: { id, ask, record } }) => {
  
  const navigate = useNavigate();

  const handleClickPlayVideo = (event) => {
    event.stopPropagation();
    console.log("PLayVIdeo");
  }

  return (
    <Card align="center" w="280px" h="450px" bg="#6c75b2" mx="2px" cursor="pointer" _hover={{ bg: "#434b7f", color: "#fff" }} onClick={() => navigate(`/detail-video/${id}`)}>
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
