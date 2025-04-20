let boids = [];
let selectedBoid = null;
let showVision = true;
let boidCount = 150;

// Sliders
let separationSlider, alignmentSlider, cohesionSlider;
let visionRadiusSlider, visionAngleSlider;

function setup() {
  createCanvas(windowWidth * 0.98, windowHeight * 0.98);

  // Create sliders
  separationSlider = createSlider(0, 5, 1.7, 0.1);
  alignmentSlider = createSlider(0, 5, 1.3, 0.1);
  cohesionSlider = createSlider(0, 5, 1.3, 0.1);
  visionRadiusSlider = createSlider(10, 200, 80, 1);
  visionAngleSlider = createSlider(10, 360, 240, 1);

  // Position sliders
  separationSlider.position(10, 10);
  alignmentSlider.position(10, 40);
  cohesionSlider.position(10, 70);
  visionRadiusSlider.position(300, 10);
  visionAngleSlider.position(300, 40);

  // Create boids
  for (let i = 0; i < boidCount; i++) {
    boids.push(new Boid(random(width), random(height)));
  }
}

function draw() {
  background(30);

  // Labels for sliders
  fill(255);
  textSize(12);
  text(`Separation: ${separationSlider.value()}`, 160, 25);
  text(`Alignment: ${alignmentSlider.value()}`, 160, 55);
  text(`Cohesion: ${cohesionSlider.value()}`, 160, 85);
  text(`Vision Radius: ${visionRadiusSlider.value()}`, 460, 25);
  text(`Vision Angle: ${visionAngleSlider.value()}`, 460, 55);

  for (let boid of boids) {
    boid.edges();
    boid.flock(boids);
    boid.update();
    boid.show();
  }
}

function mousePressed() {
  let found = false;
  for (let boid of boids) {
    if (dist(mouseX, mouseY, boid.position.x, boid.position.y) < 10) {
      selectedBoid = boid;
      found = true;
      break;
    }
  }

  // If clicked not on boid, apply attraction
  if (!found) {
    for (let boid of boids) {
      let d = dist(mouseX, mouseY, boid.position.x, boid.position.y);
      if (d < 100) {
        let force = p5.Vector.sub(createVector(mouseX, mouseY), boid.position);
        force.setMag(map(d, 0, 100, 0.5, 0.1));
        boid.applyForce(force);
      }
    }
  }
}

function keyPressed() {
  if (key === "v" || key === "V") {
    showVision = !showVision;
  }
}

// ------------------------ Boid Class ------------------------

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.3;
    this.maxSpeed = 4;
    this.color = color(random(100, 200), random(100, 200), 255);
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  align(boids) {
    let perceptionRadius = visionRadiusSlider.value();
    let perceptionAngle = radians(visionAngleSlider.value());
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      let angle = p5.Vector.angleBetween(
        this.velocity,
        p5.Vector.sub(other.position, this.position)
      );
      if (
        other !== this &&
        d < perceptionRadius &&
        angle < perceptionAngle / 2
      ) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = visionRadiusSlider.value();
    let perceptionAngle = radians(visionAngleSlider.value());
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      let angle = p5.Vector.angleBetween(
        this.velocity,
        p5.Vector.sub(other.position, this.position)
      );
      if (
        other !== this &&
        d < perceptionRadius &&
        angle < perceptionAngle / 2
      ) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = visionRadiusSlider.value();
    let perceptionAngle = radians(visionAngleSlider.value());
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      let angle = p5.Vector.angleBetween(
        this.velocity,
        p5.Vector.sub(other.position, this.position)
      );
      if (
        other !== this &&
        d < perceptionRadius &&
        angle < perceptionAngle / 2
      ) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d); // stronger when closer
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  flock(boids) {
    let sep = this.separation(boids);
    let ali = this.align(boids);
    let coh = this.cohesion(boids);

    sep.mult(separationSlider.value());
    ali.mult(alignmentSlider.value());
    coh.mult(cohesionSlider.value());

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + HALF_PI);
    noStroke();
    fill(this.color);
    beginShape();
    vertex(0, -10);
    vertex(-5, 10);
    vertex(5, 10);
    endShape(CLOSE);
    pop();

    if (this === selectedBoid) {
      stroke(255, 255, 0);
      strokeWeight(1);
      noFill();
      ellipse(this.position.x, this.position.y, 20, 20);

      if (showVision) {
        noFill();
        stroke(100, 150);
        arc(
          this.position.x,
          this.position.y,
          visionRadiusSlider.value() * 2,
          visionRadiusSlider.value() * 2,
          this.velocity.heading() - radians(visionAngleSlider.value()) / 2,
          this.velocity.heading() + radians(visionAngleSlider.value()) / 2
        );
      }
    }
  }
}
