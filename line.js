function line_intersection(p1, p2, p3, p4) {
    let x_num = (p1.x*p2.y - p1.y*p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x*p4.y - p3.y*p4.x);
    let x_den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

    let y_num = (p1.x*p2.y - p1.y*p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x*p4.y - p3.y*p4.x);
    let y_den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    return createVector(x_num / x_den, y_num / y_den);
}

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    get vector() {
        let vect = createVector(this.p2.x - this.p1.x, this.p2.y - this.p1.y)
        if(vect.x < 0) {
            vect.mult(-1);
        }
        return vect;

    }
    intersect(line) {
        return line_intersection(this.p1, this.p2, line.p1, line.p2)
    }
    draw(image) {
        image.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}
