let patterns = [];
let currentPlayer = 0;
let currentBeat = 0;
let playbackObj;
let isShowing = false;
let backgroundSound;

function Pattern(sound, perc) {
    this.pattern = [];
    this.sound = sound;
    this.isPercussive = perc;
    this.beat = 1;

    for (let i = 0; i < 17; i++) {
        this.pattern.push(0);
    }

    this.getPhrase = () => {
        return new p5.Phrase("phrase", this.playPhrase, this.pattern);
    };

    this.playPhrase = (timeout, data) => {
        if (!this.isPercussive) {
            this.sound.rate(data);
        }

        this.sound.play();
    };
}

function setup() {
    let owlHighSound = loadSound("../static/sound-effects/owl-high.mp3");
    let owlHigh = new Pattern(owlHighSound);
    patterns.push(owlHigh);

    let owlLowSound = loadSound("../static/sound-effects/owl-low.mp3");
    let owlLow = new Pattern(owlLowSound);
    patterns.push(owlLow);

    let birdSound = loadSound("../static/sound-effects/bird.mp3");
    let bird = new Pattern(birdSound);
    patterns.push(bird);

    let windSound = loadSound("../static/sound-effects/wind.mp3");
    let wind = new Pattern(windSound, true);
    patterns.push(wind);

    let footSound = loadSound("../static/sound-effects/footstep.mp3");
    let footstep = new Pattern(footSound, true);
    patterns.push(footstep);

    let waterSound = loadSound("../static/sound-effects/stream.mp3");
    let water = new Pattern(waterSound, true);
    patterns.push(water);

    if (isRaining) {
        backgroundSound = loadSound("../static/sound-effects/rain.mp3");
    } else if (isRaining) {
        backgroundSound = loadSound("../static/sound-effects/night.mp3");
    } else {
        backgroundSound = loadSound("../static/sound-effects/forest.mp3");
    }
}

function resetBeats() {
    for (let i = 1; i < 17; i++) {
        $(`#c${i}`).css("background-color", "transparent").text("");
    }
}

function resetNotes() {
    for (let obj of $(".note")) {
        $(obj).removeClass("selected");
    }
}

function getNote(val) {
    return Math.round((val - 1) / 0.06);
}

function playback(loop) {
    playbackObj = new p5.Part();

    for (let pattern of patterns) {
        playbackObj.addPhrase(pattern.getPhrase());
    }

    playbackObj.setBPM(50);

    setTimeout(() => {
        if (loop) {
            playbackObj.loop();
            backgroundSound.setLoop(true);
            backgroundSound.play();
        } else {
            playbackObj.start();
            currentBeat = 1;
            let interval = setInterval(() => {
                $(`#c${currentBeat++}`).css("border-color", "purple");
                if (currentBeat > 17) {
                    clearInterval(interval);
                }
            }, (60/70*1000)/4);

            setTimeout(() => {
                $(".square").css("border-color", "#666666");
            }, (60/70*1000)*4+1000);
        }
    }, 300);
}

$(".player").click(e => {
    let id = parseInt(e.currentTarget.id.replace("p", ""));

    $(`#p${currentPlayer}`).removeClass("active");
    $(e.currentTarget).addClass("active");

    currentPlayer = id;
    resetBeats();

    for (let i = 1; i < 17; i++) {
        if (patterns[currentPlayer].pattern[i] >= 1) {
            let note = getNote(patterns[currentPlayer].pattern[i]);
            let name = $(`#n${note}`).text();

            $(`#c${i}`).css("background-color", "#eeeeee").text(name);
        }
    }
});

$(".square").click(e => {
    let id = parseInt(e.currentTarget.id.replace("c", ""));
    currentBeat = id;

    if (patterns[currentPlayer].pattern[id] == 0) {
        patterns[currentPlayer].pattern[id] = 1;
        $(`#c${id}`).css("background-color", "#eeeeee").text("C");

        resetNotes();
        $("n0").addClass("selected");
    } else {
        patterns[currentPlayer].pattern[id] = 0;
        
        resetNotes();
        $(`#c${id}`).css("background-color", "transparent").text("");
    }
});

$(".note").click(e => {
    let id = parseInt(e.currentTarget.id.replace("n", ""));
    let name = $(e.currentTarget).text();
    let prevNote = getNote(patterns[currentPlayer].pattern[currentBeat]);

    if (currentBeat > 0 && patterns[currentPlayer].pattern[currentBeat] != 0) {
        $(`#n${prevNote}`).removeClass("selected");
        $(`#n${id}`).addClass("selected");
        $(`#c${currentBeat}`).text(name);
        patterns[currentPlayer].pattern[currentBeat] = 1 + (0.06 * id);
    }
});

$(window).keydown(e => {
    if (e.originalEvent.keyCode == 32) {
        playback();
    }
});

$("#play-button").click(() => {
    playback();
});

$("#watch-button").click(() => {
    $("body > *").hide();
    $("#theater").show();
    $("#theater").css("background-image", "url('../static/forest.jpeg')");
    document.documentElement.requestFullscreen();
    playback(true);
});

$("#theater").click(e => {
    document.exitFullscreen();
    playbackObj.noLoop();
    backgroundSound.setLoop(false);
    backgroundSound.stop();

    $("body > *").show();
    $("#theater").hide();
});