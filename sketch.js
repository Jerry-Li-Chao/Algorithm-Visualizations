let numCourses = 5;
let prerequisites = [[1,0],[2,0],[3,1],[3,2], [1,4]];
let adj_list = {};
let indegree = {};
let zero_indegree_queue = [];
let topological_sorted_order = [];
let courses = [];
let currentCourse = null;

function setup() {
  createCanvas(800, 600);

  // button position should be relative to the top-left corner of the canvas
  let canvasDiv = document.getElementById('canvasContainer');
  let rect = canvasDiv.getBoundingClientRect();  // Get the position and size of the canvas container

  let restartButton = createButton('Restart');
  restartButton.position(rect.left + 10, rect.top + 40);
  restartButton.mousePressed(restart);

  let nextButton = createButton('Next Step');
  nextButton.position(rect.left + 10, rect.top + 70);
  nextButton.mousePressed(nextStep);

  let lastStepButton = createButton('Back 1 Step');
  lastStepButton.position(rect.left + 10, rect.top + 100);
  lastStepButton.mousePressed(lastStep);

  // create a randomize node posiiton button
    let randomizeButton = createButton('Randomize Node Position');
    randomizeButton.position(rect.left + 10, rect.top + 130);
    randomizeButton.mousePressed(randomizeNodePosition);


  setupGraph();
}

function randomizeNodePosition() {
    courses = [];
    for (let i = 0; i < numCourses; i++) {
        let close = true;
        let x, y;
    
        while (close) {
            x = random(width * 0.2, width * 0.8);
            y = random(height * 0.2, height * 0.8);
            close = false;
    
            // Check the distance with all existing nodes
            for (let j = 0; j < courses.length; j++) {
                let dx = courses[j].x - x;
                let dy = courses[j].y - y;
                let distance = sqrt(dx * dx + dy * dy);
    
                // Ensure each node is at least twice the diameter apart (to avoid overlapping)
                if (distance < 2 * 15 * 2) { // 15 is the radius, *2 for diameter, *2 for minimum non-overlapping distance
                    close = true;
                    break;
                }
            }
        }
    
        // Add the course with a valid position
        courses.push({ id: i, x: x, y: y });
    }
    redraw(); // Redraw the canvas with new node positions
}

function setupGraph() {
  console.log("Setting up graph");
  adj_list = {};
  indegree = {};
  zero_indegree_queue = [];
  topological_sorted_order = [];
  courses = [];

  // Initialize graph
for (let i = 0; i < numCourses; i++) {
  console.log(numCourses);
    adj_list[i] = [];
    let close = true;
    let x, y;

    while (close) {
        x = random(width * 0.2, width * 0.8);
        y = random(height * 0.2, height * 0.8);
        close = false;

        // Check the distance with all existing nodes
        for (let j = 0; j < courses.length; j++) {
            let dx = courses[j].x - x;
            let dy = courses[j].y - y;
            let distance = sqrt(dx * dx + dy * dy);

            // Ensure each node is at least twice the diameter apart (to avoid overlapping)
            if (distance < 2 * 15 * 2) { // 15 is the radius, *2 for diameter, *2 for minimum non-overlapping distance
                close = true;
                break;
            }
        }
    }

    // Add the course with a valid position
    courses.push({ id: i, x: x, y: y });
}


  prerequisites.forEach(pr => {
    console.log(pr);
    let dest = pr[0];
    let src = pr[1];
    adj_list[src].push(dest);
    // what does this line do?
    // It increments the indegree of the destination node by 1
    // what is || 0
    // It is a short-circuit operator that assigns 0 if indegree[dest] is undefined
    indegree[dest] = (indegree[dest] || 0) + 1;
  });

  // Find all courses with no incoming edge
  for (let k = 0; k < numCourses; k++) {
    if (!indegree[k]) {
      zero_indegree_queue.push(k);
    }
  }
  currentCourse = zero_indegree_queue[0];
  redraw();
}

// Function to update course data based on user input
function updateCourseData() {
  console.log("Updating course data");
    let newNumCourses = parseInt(document.getElementById('numCoursesInput').value);
    let newPrerequisitesInput = document.getElementById('prerequisitesInput').value;

  
    try {
      let newPrerequisites = JSON.parse(newPrerequisitesInput);
      if (!isNaN(newNumCourses) && newNumCourses > 0) {
        numCourses = newNumCourses;
        prerequisites = newPrerequisites;
        setupGraph(); // Re-setup the graph with new data
      } else {
        alert('Please enter a valid number of courses');
      }
    } catch (e) {
      // generate random data if input is invalid
        numCourses = newNumCourses;
        prerequisites = generateRandomDAG(numCourses);
        setupGraph(); // Re-setup the graph with new data
    }
  }
  

function draw() {
  background(240);

  // Draw edges
  for (let i = 0; i < numCourses; i++) {
    adj_list[i].forEach(j => {
        // if this node is in topological_sorted_order, draw a dashed line
        let dashed = topological_sorted_order.includes(i);
        drawArrow(courses[i], courses[j], 0, dashed);
    });
  }

courses.forEach(course => {
    fill(200);
    strokeWeight(1); // Adjust stroke weight for better visibility

    if (topological_sorted_order.includes(course.id)) {
        setDashedStroke(); // Set dashed stroke for courses in the sorted order
        stroke(0, 100, 255); // Optionally, change stroke color to highlight
        fill(240);
    } else {
        resetStroke(); // Reset to solid stroke
        stroke(0); // Default stroke color (black)
    }

    if (zero_indegree_queue.includes(course.id)) {
        fill(255, 0, 0); // Fill red if the course is in the zero indegree queue
    }
    if (currentCourse === course.id) {
        fill(0, 255, 0); // Fill green if it's the current course being processed
    }

    ellipse(course.x, course.y, 30); // Draw the node
    fill(0); // Set fill color for text
    noStroke(); // Disable stroke for text for clarity
    text(course.id, course.x - 5, course.y + 5); // Draw the course ID centered on the node
});


  // Display the zero_indegree_queue
  displayQueue();
  displayNextNodetoRemove();

  displayTopologicalOrder();

  // only draw once
    noLoop();
}

function setDashedStroke() {
    drawingContext.setLineDash([5, 10]);  // Set dash pattern - [dash length, space length]
}

function resetStroke() {
    drawingContext.setLineDash([]);  // Reset to solid line
}


function nextStep() {
  if (zero_indegree_queue.length > 0) {
    let vertex = zero_indegree_queue.shift();
    topological_sorted_order.push(vertex);
    if (adj_list[vertex]) {
      adj_list[vertex].forEach(neighbor => {
        indegree[neighbor]--;
        if (indegree[neighbor] === 0) {
          zero_indegree_queue.push(neighbor);
        }
      });
    }
    // currentCouse should be the first element in the zero_indegree_queue
    if (zero_indegree_queue.length > 0) {
      currentCourse = zero_indegree_queue[0];
    }
  } else {
    // console.log("Topological Order: " + topological_sorted_order.join(", "));
    alert("No more courses to process.");
  }
  redraw(); // Update the visualization for each step
}

// Define restart and lastStep functions
function restart() {
  console.log("Restarted")
    zero_indegree_queue = [];
    topological_sorted_order = [];
    currentCourse = null;
  
    // Reinitialize the indegree and zero_indegree_queue
    indegree = {};
    prerequisites.forEach(pr => {
      let dest = pr[0];
      let src = pr[1];
      indegree[dest] = (indegree[dest] || 0) + 1;
    });
  
    for (let k = 0; k < numCourses; k++) {
      if (!indegree[k]) {
        zero_indegree_queue.push(k);
      }
    }
    currentCourse = zero_indegree_queue[0];
    redraw();
  }
  
  function lastStep() {
    if (topological_sorted_order.length > 0) {
      let lastCourse = topological_sorted_order.pop();
      currentCourse = lastCourse;
      // Re-adjust the indegrees and zero_indegree_queue based on last step
      if (adj_list[lastCourse]) {
        adj_list[lastCourse].forEach(neighbor => {
          indegree[neighbor]++;
          if (indegree[neighbor] === 1) {
            zero_indegree_queue.splice(zero_indegree_queue.indexOf(neighbor), 1);
          }
        });
      }
      zero_indegree_queue.push(lastCourse);
    }
    redraw();
  }

function drawArrow(base, end, color, dashed = false) {
    push();
    stroke(color);
    fill(color);
    let angle = atan2(end.y - base.y, end.x - base.x);
    let d = dist(base.x, base.y, end.x, end.y);
    let radius = 15;  // Node radius
    let offset = radius + 2; // Distance to stop arrow before it hits the node
    let sx = base.x + (d - offset) * cos(angle);
    let sy = base.y + (d - offset) * sin(angle);
  
    if (dashed) {
      drawingContext.setLineDash([5, 5]);  // Sets the line style to dashed
  } else {
      drawingContext.setLineDash([]);  // Reset to solid line if not dashed
  }
    
    line(base.x, base.y, sx, sy);
    translate(sx, sy);
    rotate(angle);
    triangle(0, 0, -7, -3, -7, 3);
    pop();
  }
  
  
  function displayQueue() {
    fill(0);
    textSize(16);
    text('zero_indegree_queue:', 220, 30);
    let x = 250;  // Starting x position
    zero_indegree_queue.forEach(course => {
      if(course === currentCourse) fill(0, 255, 0);
      else fill(255, 0, 0);
      ellipse(x, 50, 30); // Draw circle for each node in the queue
      fill(0);
      text(course, x - 5, 55);
      x += 40;  // Increment x to space nodes horizontally
    });
  }

  function displayNextNodetoRemove() {
    fill(0);
    textSize(16);
    text('About to remove and add to final order:', 420, 30);
    let x = 450;  // Starting x position
    zero_indegree_queue.forEach(course => {
      if(course === currentCourse) {
        fill(0, 255, 0);
        ellipse(x, 50, 30); // Draw circle for each node in the queue
        fill(0);
        text(course, x - 5, 55);
        x += 40;  // Increment x to space nodes horizontally
      }
    });
  }
  

  function displayTopologicalOrder() {
    fill(0);
    textSize(16);
    text('Topological Order:', 20, height - 40);
    textSize(14);
    let orderText = topological_sorted_order.join(", ");
    text(orderText, 20, height - 20);
  }
  

  function generateRandomDAG(numCourses) {
    let edges = new Set();
    // Create a simple chain to ensure no orphans
    for (let i = 1; i < numCourses; i++) {
        edges.add(i + "," + (i - 1));
    }

    // Function to check if adding an edge creates a cycle
    function createsCycle(edges, start, end, numCourses) {
        let graph = Array.from({length: numCourses}, () => []);
        edges.forEach(edge => {
            let [a, b] = edge.split(",").map(Number);
            graph[a].push(b);
        });
        // Add the new edge to check for cycle
        graph[start].push(end);

        let visited = Array(numCourses).fill(false);
        let recStack = Array(numCourses).fill(false);

        function dfs(v) {
            if (!visited[v]) {
                visited[v] = true;
                recStack[v] = true;
                for (let neighbor of graph[v]) {
                    if (!visited[neighbor] && dfs(neighbor)) {
                        return true;
                    } else if (recStack[neighbor]) {
                        return true;
                    }
                }
            }
            recStack[v] = false;
            return false;
        }

        for (let node = 0; node < numCourses; node++) {
            if (!visited[node] && dfs(node)) {
                return true;
            }
        }
        return false;
    }

    // Add more edges randomly
    while (edges.size < numCourses * 1.5) {  // Adjust the multiplier for more or fewer edges
        let a = Math.floor(Math.random() * numCourses);
        let b = Math.floor(Math.random() * numCourses);
        if (a !== b && !edges.has(a + "," + b) && !createsCycle(edges, a, b, numCourses)) {
            edges.add(a + "," + b);
        }
    }

    return Array.from(edges).map(edge => edge.split(",").map(Number));
}