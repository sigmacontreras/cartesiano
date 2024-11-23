const event_handlers_signal = f_signal("event_handlers")
const [getHandler, setHandler] = event_handlers_signal({})

function f_bg() {
    const _caller = this;
    const context = _caller.context
    const canvas = _caller.canvas
    return {
        draw_bg_matrix() {
            canvas.style["z-index"] = _caller.options.z
            context.fillStyle = "rgb(0, 0, 0)";
            context.lineWidth = 0.5;
            context.strokeStyle = "rgb(165, 199, 255)";
            context.fillRect(0, 0, canvas.width, canvas.height);

            const col_girt_x = _caller.height / _caller.options.divition;
            const col_girt_y = _caller.width / _caller.options.divition;

            for (let h = col_girt_x; h < _caller.height; h += col_girt_x) {
                context.beginPath();
                context.moveTo(0, h);
                context.lineTo(_caller.width, h);
                context.stroke();
            }
            for (let w = col_girt_y; w < _caller.width; w += col_girt_y) {
                col_girt_y
                context.beginPath();
                context.moveTo(w, 0);
                context.lineTo(w, _caller.height);
                context.stroke();
            }
        }
    }
}

function f_z() {
    const _caller = this;
    const context = _caller.context;
    const canvas = _caller.canvas;

    let color = "rgba(255, 255, 255)";
    if (!getHandler().z) {
        setHandler({
            ...getHandler(),
            z: { handlePrintOrigin: handlePrintOrigin },
        })
    }

    function handlePrintOrigin(e) {
        print_origin_x_y(e.clientX, e.clientY)
    }

    function print_origin_x_y(pointX, pointY) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const col_girt_x = _caller.width / _caller.options.divition;
        const col_girt_y = _caller.height / _caller.options.divition;


        mouseX = (pointX - _caller.canvasRectangle.left) * _caller.scaleIntoCanvasX;
        mouseY = (pointY - _caller.canvasRectangle.top) * _caller.scaleIntoCanvasY;

        const rangeX = mouseX / col_girt_x
        const rangeY = mouseY / col_girt_y



        context.font = "12px Verdana";
        context.fillStyle = color;
        context.fillText(`x:${rangeX.toFixed(2)} y:${rangeY.toFixed(2)}`, mouseX, mouseY);
    }

    let mouseX = 0;
    let mouseY = 0;
    return {
        canvas_event_start(element) {
            canvas.style["z-index"] = _caller.options.z;
            canvas.addEventListener("mousemove", getHandler().z.handlePrintOrigin, true);
            z_tools(element, this);
        },
        canvas_event_stop() {
            canvas.style["z-index"] = _caller.options.z
            canvas.removeEventListener("mousemove", getHandler().z.handlePrintOrigin, true)
        },
        change_color(toggle) {
            color = toggle ? "rgb(69, 69, 69)" : "rgba(255, 255, 255)";
        }
    }
}

function f_circle() {
    const _caller = this;
    const canvas = _caller.canvas;
    const context = _caller.context;

    let mouseY = 0;
    let mouseX = 0;
    let originX = 0;
    let originY = 0;
    let radius = _caller.width / _caller.options.divition;
    let radius_multiplyer = 0;
    let theta = 0
    let rotationDuration = 3000;
    let unity_circle_toggle = false;
    let rotation_toggle = false;

    if (!getHandler().circle) {
        setHandler({
            ...getHandler(),
            circle: {
                handleDrawTheta: handleDrawTheta,
                handleClick: handleClick,
                change_theta: change_theta,
                toggle_unity: toggle_unity,
                toggle_rotate: toggle_rotate
            }
        })
    }

    function handleDrawTheta(e) {
        mouseX = (e.clientX - _caller.canvasRectangle.left) * _caller.scaleIntoCanvasX;
        mouseY = (e.clientY - _caller.canvasRectangle.top) * _caller.scaleIntoCanvasY;
        draw_theta(1, mouseX, mouseY)
    }

    function handleClick(e) {
        originX = (e.clientX - _caller.canvasRectangle.left) * _caller.scaleIntoCanvasX;
        originY = (e.clientY - _caller.canvasRectangle.top) * _caller.scaleIntoCanvasY;
        draw_theta(radius_multiplyer, originX, originY);
        if (unity_circle_toggle) {
            draw_right_triangle(theta);
        }
        canvas.removeEventListener("mousemove", getHandler().circle.handleDrawTheta, true);
    }

    function change_theta(r) {
        draw_theta(r, originX, originY)
        if (unity_circle_toggle) {
            draw_right_triangle(theta);
        }
    }

    function toggle_unity(toggle) {
        if (toggle) {
            draw_theta(radius_multiplyer, originX, originY);
            theta = theta || 45 * (Math.PI / 180);
            draw_right_triangle(theta);
            if (rotation_toggle) {
                this.toggle_rotate(rotation_toggle);
            }
        } else {
            draw_theta(radius_multiplyer, originX, originY);
        }
        unity_circle_toggle = toggle;
    }

    function toggle_rotate(toggle) {
        rotation_toggle = toggle;
        // draw_theta(radius_multiplyer, originX, originY)

        let startTime = null;

        function rotate(currentTime) {
            if (!rotation_toggle || !unity_circle_toggle) {
                return;
            } else {

                if (startTime === null) {
                    startTime = currentTime;
                }

                const elapsed = currentTime - startTime;

                theta = (elapsed / rotationDuration) * (2 * Math.PI) % (2 * Math.PI);

                draw_theta(radius_multiplyer, originX, originY);
                draw_right_triangle(theta);
                requestAnimationFrame(rotate);
            }

        }
        requestAnimationFrame(rotate);
    }

    function draw_theta(r, x, y) {
        radius_multiplyer = r
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 1;
        context.strokeStyle = "rgb(255, 255, 255)";
        context.beginPath();
        context.arc(x, y, radius * r, 2 * Math.PI, 0, false)
        context.stroke();
    }

    function drawTrigLine(startX, startY, endX, endY, color, lineWidth) {
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    function draw_right_triangle(angle) {
        // SOHCAHTOA
        const x = originX + (radius * radius_multiplyer) * Math.cos(angle);
        const y = originY - (radius * radius_multiplyer) * Math.sin(angle);

        const sine = Math.sin(angle);
        const cosine = Math.cos(angle);
        const tangent = Math.tan(angle);
        const cosecant = 1 / sine;
        const secant = 1 / cosine;
        const cotangent = 1 / tangent;

        // SIN
        drawTrigLine(x, originY, x, y, "rgb(207, 10, 17)", 1);
        // COS
        drawTrigLine(originX, originY, x, originY, "rgb(0, 219, 40)", 1);
        // HYPOTENUSE
        drawTrigLine(originX, originY, x, y, "rgb(153, 140, 75)", 0.5);
        // TAN
        drawTrigLine(originX + (radius * radius_multiplyer), originY, originX + (radius * radius_multiplyer), originY - (radius * radius_multiplyer) * tangent, "rgb(246, 253, 98)", 1);
        // SEC
        drawTrigLine(originX, originY, originX + (radius * radius_multiplyer), originY - (radius * radius_multiplyer) * tangent, "rgb(168, 15, 160)", 1);
        // CSC
        drawTrigLine(originX, originY, originX, originY - (radius * radius_multiplyer) * cosecant, "rgb(49, 229, 224)", 1);
        // COT
        drawTrigLine(x, y, originX, originY - (radius * radius_multiplyer) * cosecant, "rgb(255, 102, 120)", 1);
    }

    return {
        canvas_event_start(element) {
            canvas.style["z-index"] = _caller.options.z
            canvas.addEventListener("mousemove", getHandler().circle.handleDrawTheta, true)
            canvas.addEventListener("click", getHandler().circle.handleClick)
            circle_tools(element, this);
        },
        canvas_event_stop() {
            canvas.style["z-index"] = _caller.options.z
            canvas.removeEventListener("mousemove", getHandler().circle.handleDrawTheta, true)
            canvas.removeEventListener("click", getHandler().circle.handleClick)
        },
        change_theta: getHandler().circle.change_theta,
        toggle_unity: getHandler().circle.toggle_unity,
        toggle_rotate: getHandler().circle.toggle_rotate,
        change_w(w) {
            rotationDuration = w * 1000;
        }
    }
}