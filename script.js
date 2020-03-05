const video = document.querySelector("#video");

const startVideo = () => {
    navigator.getUserMedia(
    { video: { } },
    stream => video.srcObject = stream,
    error => console.error(error)
    );
};

//Bring in all the Face-Api.js models asyncroniuosly
const begin = async () => {
   await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
   await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
   await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
   await faceapi.nets.faceExpressionNet.loadFromUri("/models");

   startVideo();
}

begin();

video.addEventListener("play", () => {
    //create the canvas element
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };

    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        
        console.log(detections);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        //clear the canvas
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        //draw unto the video element
        faceapi.draw.drawDetections(canvas, resizedDetections);//draw a square to highlight the locationmof our face

        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);//get a landmark represetation of our face and ears

        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);//get the text telling us the emotins under the highlight
    }, 1000);
});

