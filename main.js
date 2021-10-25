status = "";
objects = [];

function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(380, 380);
    video.hide();
}

function modelLoaded() {
    console.log('Model loaded!');
    status = true;
}

function start() {
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Object";
    objectGotten = document.getElementById("object").value;
}

function gotResult(error, results) {
    if (error) {
        console.log(error);
    }
    console.log(results);
    objects = results;
}

function draw() {
    image(video, 0, 0, 380, 380);

    if (status != "") {
        r = random(255);
        g = random(255);
        b = random(255);
        objectDetector.detect(video, gotResult);
        for (var i = 0; i < objects.length; i++) {
            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r, g, b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (objects[i].label == objectGotten) {
                video.stop();
                objectDetector.detect(gotResult);
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(objectGotten + "Is Detected");
                synth.speak(utterThis);
                document.getElementById("object_detected").innerHTML = objectGotten + "Is Detected";
            } else {
                document.getElementById("object_detected").innerHTML = objectGotten + " is not Detected";
            }
        }
    }
}