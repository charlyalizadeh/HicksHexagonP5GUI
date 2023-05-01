class Hexagon {
    constructor(origin, width, height, triangle_height) {
        this.origin = origin;
        this.width = width;
        this.height = height;
        this.triangle_height = triangle_height;

        this.update_value();
    }
    update_value() {
        this.down_right = p5.Vector.add(this.origin, createVector(this.width, this.height));
        this.down_left = p5.Vector.add(this.origin, createVector(0, this.height));
        this.up_right = p5.Vector.add(this.origin, createVector(this.width, 0));
        this.up = p5.Vector.add(this.origin, createVector(this.width / 2, -this.triangle_height));
        this.down = p5.Vector.add(this.origin, createVector(this.width / 2, this.height + this.triangle_height));
        this.v1 = createVector(
            abs(this.down_right.x - this.origin.x),
            abs(this.down_right.y - this.origin.y)
        );
        this.v2 = createVector(
            abs(this.up_right.x - this.down_left.x),
            -abs(this.up_right.y - this.down_left.y)
        );
    }
    norm_vector_up_left() {
        let norm_vector = p5.Vector.sub(this.up, this.origin);
        norm_vector.x += norm_vector.y;
        norm_vector.y = norm_vector.x - norm_vector.y;
        norm_vector.x -= norm_vector.y;
        norm_vector.y = -norm_vector.y;
        norm_vector.normalize();
        return norm_vector;
    }
    norm_vector_up_right() {
        let norm_vector = this.norm_vector_up_left();
        norm_vector.x = -norm_vector.x;
        return norm_vector;
    }
    norm_vector_down_right() {
        return this.norm_vector_up_left().mult(-1);
    }
    norm_vector_down_left() {
        let norm_vector = this.norm_vector_up_left();
        norm_vector.y = -norm_vector.y;
        return norm_vector;
    }
    outline_line_up_left(outline_size) {
        let offset_vector = this.norm_vector_up_left().mult(outline_size);
        let p1 = p5.Vector.add(this.up, offset_vector);
        let p2 = p5.Vector.add(this.origin, offset_vector);
        return new Line(p1, p2);
    }
    outline_line_up_right(outline_size) {
        let offset_vector = this.norm_vector_up_right().mult(outline_size);
        let p1 = p5.Vector.add(this.up, offset_vector);
        let p2 = p5.Vector.add(this.up_right, offset_vector);
        return new Line(p1, p2);
    }
    outline_line_left(outline_size) {
        let p1 = this.origin.copy();
        p1.x -= outline_size;
        let p2 = this.down_left.copy();
        p2.x -= outline_size;
        return new Line(p1, p2)
    }
    outline_line_right(outline_size) {
        let p1 = this.up_right.copy();
        p1.x += outline_size;
        let p2 = this.down_right.copy();
        p2.x += outline_size;
        return new Line(p1, p2)
    }
    outline_line_down_left(outline_size) {
        let offset_vector = this.norm_vector_down_left().mult(outline_size);
        let p1 = p5.Vector.add(this.down_left, offset_vector);
        let p2 = p5.Vector.add(this.down, offset_vector);
        return new Line(p1, p2);
    }
    outline_line_down_right(outline_size) {
        let offset_vector = this.norm_vector_down_right().mult(outline_size);
        let p1 = p5.Vector.add(this.down_right, offset_vector);
        let p2 = p5.Vector.add(this.down, offset_vector);
        return new Line(p1, p2);
    }
    outline_edge(outline_size) {
        let line_up_left = this.outline_line_up_left(outline_size);
        let line_up_right = this.outline_line_up_right(outline_size);
        let line_left = this.outline_line_left(outline_size);
        let line_right = this.outline_line_right(outline_size);
        let line_down_left = this.outline_line_down_left(outline_size);
        let line_down_right = this.outline_line_down_right(outline_size);
        let new_origin = line_intersection(
            line_up_left.p1, line_up_left.p2,
            line_left.p1, line_left.p2
        );
        let new_up_right = line_intersection(
            line_up_right.p1, line_up_right.p2,
            line_right.p1, line_right.p2
        )
        let new_width = new_up_right.x - new_origin.x;
        let new_down_left = line_intersection(
            line_down_left.p1, line_down_left.p2,
            line_left.p1, line_left.p2
        )
        let new_height = new_down_left.y - new_origin.y;
        let new_up = line_intersection(
            line_up_right.p1, line_up_right.p2,
            line_up_left.p1, line_up_left.p2
        )
        let new_triangle_height = new_origin.y - new_up.y;
        return new Hexagon(new_origin, new_width, new_height, new_triangle_height);
    }
    outline_vertex(outline_size) {
        let new_origin = p5.Vector.add(
            this.origin,
            p5.Vector.mult(p5.Vector.limit(this.v1, outline_size), -1)
        );
        let new_up_right = p5.Vector.add(
            this.up_right,
            p5.Vector.limit(this.v2, outline_size)
        );
        let new_width = new_up_right.x - new_origin.x;
        let new_down_left = p5.Vector.add(
            this.down_left,
            p5.Vector.mult(p5.Vector.limit(this.v2, outline_size), -1)
        );
        let new_height = new_down_left.y - new_origin.y;
        let new_up = p5.Vector.add(this.up, createVector(0, -outline_size));
        let new_triangle_height = new_origin.y - new_up.y;
        return new Hexagon(new_origin, new_width, new_height, new_triangle_height);
    }
    draw_vertices(image) {
        image.point(this.up);
        image.point(this.down);
        image.point(this.origin);
        image.point(this.up_right);
        image.point(this.down_left);
        image.point(this.down_right);
    }
    fill_correct_offset_up(color, image) {
        image.stroke(color)
        image.strokeWeight(1)
        image.strokeCap(SQUARE)
        image.line(this.down_left.x + 0.6, this.down_left.y, this.down_right.x - 0.6, this.down_right.y)
    }
    fill_correct_offset_down(color, image) {
        image.stroke(color)
        image.strokeWeight(1)
        image.strokeCap(SQUARE)
        image.line(this.origin.x + 0.6, this.origin.y, this.up_right.x - 0.6, this.up_right.y)
    }
    fill_correct_offset(color, image) {
        this.fill_correct_offset_up(color, image)
        this.fill_correct_offset_down(color, image)
    }
    fill(color, image) {
        this.fill_correct_offset(color, image)
        image.noStroke()
        image.fill(color);
        image.rect(this.origin.x, this.origin.y, this.width, this.height);
        image.triangle(
            this.origin.x,
            this.origin.y,

            this.up_right.x,
            this.up_right.y,

            this.up.x,
            this.up.y
        );
        image.triangle(
            this.down_left.x,
            this.down_left.y,

            this.down_right.x,
            this.down_right.y,

            this.down.x,
            this.down.y
        );
    }
}
