function canvas_manager() {
    const canvas_planes_map = new Map()
    const width = document.body.clientWidth - (document.body.clientWidth * 0.1);
    const height = document.body.clientHeight - (document.body.clientHeight * 0.1);

    const props = Object.freeze({
        canvas_planes_map,
        width,
        height
    })

    return {
        init_canvas: f_init_canvas.bind(props),
        get_canvas: f_get_canvas.bind(props),
        stop_canvas: f_stop_canvas.bind(props)
    }
}

function f_init_canvas(canvas_id) {
    let _caller = this
    const node = document.createElement("canvas");
    node.id = canvas_id;
    node.width = _caller.width;
    node.height = _caller.height;
    document.querySelector("#main").appendChild(node);
    if (canvas_id === "canvas_bg") {
        _caller.canvas_planes_map.set(canvas_id, { node, f_canvas: f_bg });
    }
    if (canvas_id === "canvas_z") {
        _caller.canvas_planes_map.set(canvas_id, { node, f_canvas: f_z });
    }
    if (canvas_id == "canvas_c") {
        _caller.canvas_planes_map.set(canvas_id, { node, f_canvas: f_circle });
    }
}


function f_get_canvas(canvas_id, options) {
    const _caller = this;
    let head;
    const plane = _caller.canvas_planes_map.get(canvas_id)

    if (f_option(plane, (p) => p).None()) {
        return plane
    }
    const ctx = plane.node.getContext("2d");

    const cr = plane.node.getBoundingClientRect();
    if (f_option(options, (p) => p).None()) {
        head = Object.freeze({
            canvas: plane.node,
            context: ctx,
            canvasRectangle: cr,
            width: _caller.width,
            height: _caller.height,
            scaleIntoCanvasX: _caller.width / cr.width,
            scaleIntoCanvasY: _caller.height / cr.height,
            options: {
                divition: 10,
                z: _caller.canvas_planes_map.size
            },
        })
    } else {
        head = Object.freeze({
            canvas: plane.node,
            context: ctx,
            canvasRectangle: cr,
            width: _caller.width,
            height: _caller.height,
            scaleIntoCanvasX: _caller.width / cr.width,
            scaleIntoCanvasY: _caller.height / cr.height,
            options
        })
    }

    const that = plane.f_canvas.call(head)
    return that
}

function f_stop_canvas(canvas_id, options) {
    const _caller = this;
    const plane = _caller.canvas_planes_map.get(canvas_id)

    if (f_option(plane, (p) => p).None()) {
        return plane
    }
    const ctx = plane.node.getContext("2d");
    plane.f_canvas.call({
        canvas: plane.node,
        context: ctx,
        options
    }).canvas_event_stop()
}
