(function (window, document) {
    const active_canvas_signal = f_signal("active_canvas")
    const [getActiveCanvas, setActiveCanvas] = active_canvas_signal({ active: false, canvas_id: "", index: 1 })

    window.addEventListener("load", () => {
        const new_manager = canvas_manager()
        new_manager.init_canvas("canvas_bg")

        const bg_canvas = new_manager.get_canvas("canvas_bg", { divition: 10, z: 1 })

        bg_canvas.draw_bg_matrix()
        const right_tool_bar = document.getElementById("right_tool_bar");

        window.addEventListener('hashchange', () => {
            if (getActiveCanvas().active) {
                if (getActiveCanvas().index > 2) {
                    setActiveCanvas({ active: false, canvas_id: getActiveCanvas().canvas_id, index: getActiveCanvas().index - 1 });
                } else {
                    setActiveCanvas({ active: false, canvas_id: getActiveCanvas().canvas_id, index: getActiveCanvas().index });
                }
                new_manager.stop_canvas(getActiveCanvas().canvas_id, { z: getActiveCanvas().index })
            }
            if (window.location.hash === '#circle') {
                setActiveCanvas({ active: true, canvas_id: "canvas_c", index: getActiveCanvas().index + 1 });
                let c_canvas = new_manager.get_canvas("canvas_c", { divition: 10, z: getActiveCanvas().index });
                if (!c_canvas) {
                    new_manager.init_canvas("canvas_c");
                    c_canvas = new_manager.get_canvas("canvas_c", { divition: 10, z: getActiveCanvas().index });
                }
                c_canvas.canvas_event_start(right_tool_bar);
            }
            if (window.location.hash === "#coordinate") {
                setActiveCanvas({ active: true, canvas_id: "canvas_z", index: getActiveCanvas().index + 1 });
                let z_canvas = new_manager.get_canvas("canvas_z", { divition: 10, z: getActiveCanvas().index });
                if (!z_canvas) {
                    new_manager.init_canvas("canvas_z");
                    z_canvas = new_manager.get_canvas("canvas_z", { divition: 10, z: getActiveCanvas().index });
                }
                z_canvas.canvas_event_start(right_tool_bar);
            }
        });
        const leftToolbar = document.getElementById("left_tool_bar");
        const leftHandle = leftToolbar.querySelector(".handle");
        leftHandle.addEventListener("mouseenter", () => {
            leftToolbar.style.transform = "translateX(0)";
        });
        leftToolbar.addEventListener("mouseleave", () => {
            leftToolbar.style.transform = "translateX(-100%)";
        });

        const rightHandle = right_tool_bar.querySelector(".handle");
        rightHandle.addEventListener("mouseenter", () => {
            right_tool_bar.style.transform = "translateX(0)";
        });
        right_tool_bar.addEventListener("mouseleave", () => {
            right_tool_bar.style.transform = "translateX(100%)";
        });
    })

}(window, document))
