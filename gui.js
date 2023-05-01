function get_pattern(canvas, name) {
    let hexagon_props, outline_props;
    switch(name) {
        case 'shining':
            hexagon_props = {
                'dim': [26, 14, 8],
                'color': '#981F24'
            }
            outline_props = {
                'size': [14, 7],
                'color': ['black', '#DF5F18']
            }
    }
    return new HicksHexagonDrawer(canvas, hexagon_props, outline_props);
}

class LayerGui {
    constructor(id, color, size) {
        this.id = id;
        this.color_picker = createColorPicker(color)
        this.size_slider = createSlider(1, 100, size);
        this.text = createP(`Layer ${this.id}:`);
        this.text.style('font-size', '32px');
    }
    draw(x, y) {
        this.text.position(x, y - 64);
        this.color_picker.position(x + 110, y - 25);
        this.size_slider.position(x + 180, y - 25);
    }
    remove() {
        this.text.remove();
        this.color_picker.remove();
        this.size_slider.remove();
    }
}
class MainHexagonGui {
    constructor(width, height, triangle_height, color) {
        this.text = createP('Main hexagon');
        this.text.style('font-size', '64px');

        this.color_picker = createColorPicker(color);
        this.label_color_picker = createP('Color: ');
        this.label_color_picker.style('font-size', '32px');

        this.width_slider = createSlider(1, 100, width);
        this.label_width_slider = createP('Width: ');
        this.label_width_slider.style('font-size', '32px');

        this.height_slider = createSlider(1, 100, height);
        this.label_height_slider = createP('Height: ');
        this.label_height_slider.style('font-size', '32px');

        this.triangle_height_slider = createSlider(1, 100, triangle_height);
        this.label_triangle_height_slider = createP('Triangle height: ');
        this.label_triangle_height_slider.style('font-size', '32px');

    }
    draw(x, y) {
        this.text.position(x, y - 128);

        this.color_picker.position(x + 100, y + 20);
        this.label_color_picker.position(x, y - 20);

        this.width_slider.position(x + 100, y + 80);
        this.label_width_slider.position(x, y + 40);

        this.height_slider.position(x + 100, y + 130);
        this.label_height_slider.position(x, y + 90);

        this.triangle_height_slider.position(x + 210, y + 180);
        this.label_triangle_height_slider.position(x, y + 140);

    }

}

class HicksHexagonGui {
    constructor() {
        this.canvas_pattern = createGraphics(1000, 1000);
        this.drawer = get_pattern(this.canvas_pattern, 'shining');
        this.main_hexagon = new MainHexagonGui(
            this.drawer.hexagon_props['dim'][0],
            this.drawer.hexagon_props['dim'][1],
            this.drawer.hexagon_props['dim'][2],
            this.drawer.hexagon_props['color']
        );
        this.outlines = [];
        this.btn_add_outline = createButton('Add outline')
        this.btn_rem_outline = createButton('Remove outline')
        this.btn_add_outline.style('font-size', '32px');
        this.btn_rem_outline.style('font-size', '32px');
        this.btn_add_outline.mousePressed(() => {
            this.drawer.add_outline(5, 'black');
            this.update_outlines();
        })
        this.btn_rem_outline.mousePressed(() => {
            this.drawer.rem_outline();
            this.update_outlines();
        })

        this.input_width = createInput('');
        this.input_height = createInput('');
        this.time_text = createP('X');
        this.btn_save = createButton('Save');
        this.btn_save.mousePressed(() => {
            let width = parseInt(this.input_width.value());
            let height = parseInt(this.input_height.value());
            if(!isNaN(width) && !isNaN(height)) {
                this.drawer.save(width, height, "hickshexagon.png");
            }
        })



        this.update_outlines();
        this.prev_hexagon_props = JSON.parse(JSON.stringify(this.drawer.hexagon_props));
        this.prev_outline_props = JSON.parse(JSON.stringify(this.drawer.outline_props));
    }
    update_outlines() {
        if(this.outlines.length > this.drawer.outline_props['color'].length / 2) {
            this.outlines[this.outlines.length - 1].remove();
            this.outlines = this.outlines.slice(0, this.outlines.length - 1);
        }
        for(let i = 0; i < this.drawer.outline_props['color'].length / 2; i++) {
            if(i > this.outlines.length - 1) {
                this.outlines.push(new LayerGui(
                    i,
                    this.drawer.outline_props['color'][i],
                    this.drawer.outline_props['size'][i]
                ));
            }
        }
    }
    has_update() {
        let test1 = JSON.stringify(this.prev_hexagon_props['dim']) !== JSON.stringify(this.drawer.hexagon_props['dim']);
        let test2 = JSON.stringify(this.prev_hexagon_props['color']) !== JSON.stringify(this.drawer.hexagon_props['color']);
        let test3 = JSON.stringify(this.prev_outline_props['size']) !== JSON.stringify(this.drawer.outline_props['size']);
        let test4 = JSON.stringify(this.prev_outline_props['color']) !== JSON.stringify(this.drawer.outline_props['color']);
        return test1 || test2 || test3 || test4;
    }

    draw() {
        if(this.has_update()) {
            this.drawer.update_props();
            this.drawer.draw()
            this.prev_hexagon_props = JSON.parse(JSON.stringify(this.drawer.hexagon_props));
            this.prev_outline_props = JSON.parse(JSON.stringify(this.drawer.outline_props));
        }
        image(this.canvas_pattern, 0, 0, 1000, 1000);
        this.main_hexagon.draw(1000, 64);
        this.drawer.hexagon_props['color'] = this.main_hexagon.color_picker.color();
        this.drawer.hexagon_props['dim'][0] = this.main_hexagon.width_slider.value();
        this.drawer.hexagon_props['dim'][1] = this.main_hexagon.height_slider.value();
        this.drawer.hexagon_props['dim'][2] = this.main_hexagon.triangle_height_slider.value();


        for(let i = 0; i < this.outlines.length; i++) {
            this.outlines[i].draw(1000, 364 + (i + 1) * 32);
            this.drawer.outline_props['color'][i] = this.outlines[i].color_picker.color();
            this.drawer.outline_props['size'][i] = this.outlines[i].size_slider.value();
        }
        this.btn_add_outline.position(1000, 364 + (this.outlines.length + 1) * 32)
        this.btn_rem_outline.position(1200, 364 + (this.outlines.length + 1) * 32)
        this.input_width.position(1000, 464 + (this.outlines.length + 1) * 32)
        this.time_text.position(1190, 450 + (this.outlines.length + 1) * 32)
        this.input_height.position(1210, 464 + (this.outlines.length + 1) * 32)
        this.btn_save.position(1400, 464 + (this.outlines.length + 1) * 32)
    }
}
