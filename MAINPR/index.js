
const URL = "https://teachablemachine.withgoogle.com/models/PE0zLX4iP/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    // $('canvas').hide()
    document.getElementById("startBtn").style.cursor = 'progress';
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    classLabels = model.getClassLabels();

    var progressContainerElement = document.getElementById('progressContainer');
    var labelDivs = "";
    for(var i=0;i<maxPredictions;i++){
        labelDivs +="<div class='childContainer' id='"+classLabels[i]+"'><h3>"+classLabels[i]+"</h3><div class='progressMain'><div class='progress'></div></div></div>";
    }
    progressContainerElement.innerHTML = labelDivs;

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    // labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    //     labelContainer.appendChild(document.createElement("div"));
    // }
    // $('#stopBtn').show();
    // document.getElementById("startBtn").style.cursor = 'pointer';
    $('#startBtn').hide();
    // $('#startBtn').hide();
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    var winner_probability = 0;
    var winner_index;
    for (let i = 0; i < maxPredictions; i++) {
        var incoming_probability = prediction[i].probability.toFixed(2);
        var incomming_percentage = incoming_probability*100;
        // if(winner_probability<incoming_probability){
        //     winner_probability = incoming_probability;
        //     winner_index = i;
        // }
        if(incomming_percentage<=20){
            $('#'+prediction[i].className).find('.progress').css('background-color','rgb(241, 52, 42)');
        }else if(incomming_percentage>20 && incomming_percentage<=70){
            $('#'+prediction[i].className).find('.progress').css('background-color','rgb(241, 161, 42)');
        }else{
            $('#'+prediction[i].className).find('.progress').css('background-color','rgb(72, 194, 94)');
        }
        $('#'+prediction[i].className).find('.progress').css('width',(incomming_percentage)+'%');
    }
    // var inner_html = 'This is <span id="winner"> '+prediction[winner_index].className+'</span> and accuracy is <span id="score">'+winner_probability+'</span>'
    // labelContainer.innerHTML =  inner_html;
}

// function stopVideo() {
//     webcam.stop();
//     // $('canvas').hide();
//     $('#stopBtn').hide();
//     $('#startBtn').show();
// }