let canvas = document.getElementById("wheelCanvas");
let ctx = canvas.getContext("2d");

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let radius = canvas.width / 2 - 20; // Wheel radius

// Wheel Sections (These can be your constitutional articles/topics)
let sections = [
    { label: "Article 1", color: "#f39c12" },
    { label: "Article 2", color: "#e74c3c" },
    { label: "Article 3", color: "#9b59b6" },
    { label: "Article 4", color: "#3498db" },
    { label: "Article 5", color: "#2ecc71" },
    { label: "Article 6", color: "#f1c40f" }
];

let totalSections = sections.length;
let startAngle = 0;
let arcSize = (2 * Math.PI) / totalSections; // Calculate size of each section
let spinAngle = 0;
let isSpinning = false;
let spinTimeTotal = 0;
let spinTime = 0;
let spinSpeed = 0;
let pointer = document.getElementById("pointer");

function drawWheel() {
    for (let i = 0; i < totalSections; i++) {
        let angle = startAngle + i * arcSize;

        // Draw wheel sections
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, angle + arcSize, false);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = sections[i].color;
        ctx.fill();
        ctx.closePath();

        // Add text labels
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "18px Arial";
        ctx.fillText(sections[i].label, radius - 20, 10);
        ctx.restore();
    }
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    spinTimeTotal = Math.random() * 3000 + 4000; // Randomize spin duration between 4-7 seconds
    spinSpeed = Math.random() * 10 + 5; // Randomize speed increment
    spinTime = 0;

    // Start wobbling the pointer
    pointer.classList.add("wobble");

    animateSpin();
}

// Animate the wheel spin
function animateSpin() {
    spinTime += 30;

    if (spinTime >= spinTimeTotal) {
        isSpinning = false;
        determineWinner();

        // Stop the pointer wobble when wheel stops
        pointer.classList.remove("wobble");
        return;
    }

    let angleIncrement = spinSpeed - (spinSpeed * spinTime / spinTimeTotal);
    spinAngle += angleIncrement;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(spinAngle * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
    drawWheel();
    ctx.restore();

    requestAnimationFrame(animateSpin);
}

// Determine which section the wheel stops at
function determineWinner() {
    // Normalize the spin angle to make sure it's within 360 degrees (2*PI radians)
    let normalizedAngle = (spinAngle % 360) * Math.PI / 180;

    // Adjust for the pointer position being at the top (0 degrees or 0 radians)
    let pointerAngle = 3 * Math.PI / 2 - normalizedAngle;  // Adjusting the angle for a top-centered pointer

    // Make sure pointerAngle is positive
    if (pointerAngle < 0) {
        pointerAngle += 2 * Math.PI;
    }

    // Calculate the index of the section the pointer points to
    let index = Math.floor(pointerAngle / arcSize) % totalSections;

    let result = sections[index].label;

    document.getElementById("result").textContent = `The wheel landed on: ${result}`;
}

document.getElementById("spinButton").addEventListener("click", spinWheel);

// Initial drawing of the wheel
drawWheel();
