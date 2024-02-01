// defining a wave agent - referenced from basic bat sketch (see documentation)
class Wave {
  constructor(x, y) {
    this.x = x; // set origin point
    this.y = y; // set origin point
    this.radius = 0; // radius of wave starts at 0 and increases from there
    this.triggeredResponse = false;
  }

  // expand the wave uniformly over time
  expand() {
    this.radius += 1; 
  }

  // if the edge of the wave is intersecting the prey
  intersects(objPosition) {
    let d = dist(this.x, this.y, objPosition.x, objPosition.y); // distance between wave origin and prey position
    return d < this.radius + 5; // if distance < wave radius + prey radius, that means intersection
  }

  display(Colour) {
    noFill();
    stroke(Colour);
    strokeWeight(2);
    beginShape();
      // deforming the shape of the wave at the origin initially for a cooler visual 
      for (let angle = 0; angle < TWO_PI; angle += 0.01) {
        let deformation = sin(angle * 6) * 1; 
        let x = this.x + cos(angle) * (this.radius + deformation);
        let y = this.y + sin(angle) * (this.radius + deformation);
        vertex(x, y);
      }
    endShape(CLOSE);
  }
}
