document.addEventListener('DOMContentLoaded', function () {
            const container = document.querySelector('.turncount-container');
            const canvas = document.getElementById('turncountCanvas');
            const ctx = canvas.getContext('2d');

            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            function drawAxes() {
                ctx.beginPath();
                ctx.moveTo(container.offsetWidth / 2, 0);
                ctx.lineTo(container.offsetWidth / 2, container.offsetHeight);
                ctx.moveTo(0, container.offsetHeight / 2);
                ctx.lineTo(container.offsetWidth, container.offsetHeight / 2);
                ctx.stroke();

                ctx.font = '12px Arial';
                ctx.fillStyle = '#000';

                // Labels for degrees
                ctx.fillText('0°/360°', container.offsetWidth / 2, container.offsetHeight / 20);
                ctx.fillText('90°', container.offsetWidth - 20, container.offsetHeight / 2.05);
                ctx.fillText('180°', container.offsetWidth / 2, container.offsetHeight - 10);
                ctx.fillText('270°', 0, container.offsetHeight / 2.05);
            }

            function drawArrow(x, y, length, angle) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                const arrowX = x + length * Math.cos(angle);
                const arrowY = y + length * Math.sin(angle);
                ctx.lineTo(arrowX, arrowY);
                ctx.stroke();

                const arrowHeadSize = 15;
                ctx.beginPath();
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX - arrowHeadSize * Math.cos(angle - Math.PI / 6), arrowY - arrowHeadSize * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(arrowX - arrowHeadSize * Math.cos(angle + Math.PI / 6), arrowY - arrowHeadSize * Math.sin(angle + Math.PI / 6));
                ctx.closePath();
                ctx.fill();
            }
              
          function calculateTurncount() {
                const startAngle = parseFloat(document.getElementById("startAngle").value);
                const endAngle = parseFloat(document.getElementById("endAngle").value);
                const startQuadrant = parseInt(document.getElementById("startQuadrant").value);
                const endQuadrant = parseInt(document.getElementById("endQuadrant").value);
                
                if (isNaN(startAngle) || startAngle < 0 || startAngle > 90) {
        alert("Error: Start angle should be within the range of 0 to 90 degrees.");
        return;
    }

    if (isNaN(endAngle) || endAngle < 0 || endAngle > 90) {
        alert("Error: End angle should be within the range of 0 to 90 degrees.");
        return;
    }

    if (isNaN(startQuadrant) || startQuadrant < 1 || startQuadrant > 4) {
        alert("Error: Start quadrant should be within the range of 1 to 4.");
        return;
    }

    if (isNaN(endQuadrant) || endQuadrant < 1 || endQuadrant > 4) {
        alert("Error: End quadrant should be within the range of 1 to 4.");
        return;
    }
                               // Check if start quadrant is the same as end quadrant
  if (
  ((startQuadrant === 1 || startQuadrant === 3) && endQuadrant === startQuadrant && endAngle > startAngle) ||
  ((startQuadrant === 2 || startQuadrant === 4) && endQuadrant === startQuadrant && startAngle > endAngle)
) {
  if (endAngle > startAngle) {
    alert("Error: End angle should not be greater than start angle for the same quadrant.");
  } else {
    alert("Error: Start angle should not be greater than end angle for the same quadrant.");
  }
  return; // Exit the function to prevent further calculations
}

                const x = startAngle;
                const y = endAngle;

                let xPrime, yPrime;

                switch (startQuadrant) {
                    case 1: xPrime = x; break;
                    case 2: xPrime = 180 - x; break;
                    case 3: xPrime = 180 + x; break;
                    case 4: xPrime = 360 - x; break;
                }

                switch (endQuadrant) {
                    case 1: yPrime = y; break;
                    case 2: yPrime = 180 - y; break;
                    case 3: yPrime = 180 + y; break;
                    case 4: yPrime = 360 - y; break;
                }

                const startAngleIndicator = document.getElementById("startAngleIndicator");
                const endAngleIndicator = document.getElementById("endAngleIndicator");

                startAngleIndicator.style.transform = `translate(-50%, 0%) rotate(${xPrime}deg)`;
                endAngleIndicator.style.transform = `translate(-50%, 0%) rotate(${yPrime}deg)`;

                let totalAngleDisplaced;

                switch (`${startQuadrant}-${endQuadrant}`) {
                    case '1-1': totalAngleDisplaced = -x + y + 360; break;
                    case '1-2': totalAngleDisplaced = -x - y + 180; break;
                    case '1-3': totalAngleDisplaced = -x + y + 180; break;
                    case '1-4': totalAngleDisplaced = -x - y + 360; break;

                    case '2-1': totalAngleDisplaced = x + y + 180; break;
                    case '2-2': totalAngleDisplaced = x - y + 360; break;
                    case '2-3': totalAngleDisplaced = x + y; break;
                    case '2-4': totalAngleDisplaced = x - y + 180; break;

                    case '3-1': totalAngleDisplaced = -x + y + 180; break;
                    case '3-2': totalAngleDisplaced = -x - y + 360; break;
                    case '3-3': totalAngleDisplaced = -x + y + 360; break;
                    case '3-4': totalAngleDisplaced = -x - y + 180; break;

                    case '4-1': totalAngleDisplaced = x + y; break;
                    case '4-2': totalAngleDisplaced = x - y + 90; break;
                    case '4-3': totalAngleDisplaced = x + y + 180; break;
                    case '4-4': totalAngleDisplaced = x - y + 360; break;

                    // Add a default case to handle unexpected quadrant combinations
                    default:
                        console.error("Unexpected quadrant combination. Please check your input.");
                        totalAngleDisplaced = 0;
                        break;
                }
            
              // Calculate Partial Turn
    const partialTurn = totalAngleDisplaced / 360;

    // Calculate Total Turn Count
    const fullTurn = parseInt(document.getElementById("fullTurn").value) || 0;
    const totalTurnCount = fullTurn + partialTurn;

    // Display calculated results
    document.getElementById("totalAngleDisplaced").innerText = totalAngleDisplaced;
    document.getElementById("partialTurn").innerText = partialTurn.toFixed(2);
    document.getElementById("totalTurnCount").innerText = totalTurnCount.toFixed(2);

                // Draw arc with arrow
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = Math.min(canvas.width, canvas.height) / 3;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawAxes();

                // Save the current state of the canvas
                ctx.save();

                // Rotate the canvas to align with the start angle
                ctx.translate(centerX, centerY);
                ctx.rotate((xPrime - 90) * (Math.PI / 180));

                // Draw the arc in the rotated context
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, (yPrime - xPrime) * (Math.PI / 180), false);
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Calculate the position of the arrow at the end tip of the arc
                const arrowX = radius * Math.cos((yPrime - xPrime) * (Math.PI / 180));
                const arrowY = radius * Math.sin((yPrime - xPrime) * (Math.PI / 180));

                // Rotate the arrow to the right by 90 degrees
                const rotatedArrowAngle = Math.atan2(arrowY, arrowX) + Math.PI / 2;

                // Draw arrow indicating total displaced angle
                const arrowLength = 5;
                drawArrow(arrowX, arrowY, arrowLength, rotatedArrowAngle);

                // Restore the canvas to its original state
                ctx.restore();

                // Ensure that totalAngleDisplaced does not exceed 360 degrees
                totalAngleDisplaced = Math.min(totalAngleDisplaced, 360);
              
                document.getElementById("totalAngleDisplaced").innerText = totalAngleDisplaced;
            }
            
            document.getElementById('calculateButton').addEventListener('click', calculateTurncount);
        
            drawAxes();
        });
