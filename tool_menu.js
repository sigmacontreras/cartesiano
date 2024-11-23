function circle_tools(element, c_canvas) {
    const ul = element.querySelector("ul");
    if (ul) {
        element.removeChild(ul);
    }
    const tools = `<ul class="right-toolbar">
            <li>
                <label for="diameter">Diameter</label>
                <input type="number" id="diameter" name="diameter" min="1" max="4" value="1">
            </li>
            <li>
                <label for="unity">Unity Cirlce</label>
                <input type="checkbox" name="unity" id="unity">
            </li>
            <li>
                <label for="rotate">Rotate</label>
                <input type="checkbox" name="rotate" id="rotate">
            </li>
            <li>
                <label for="angular-velocity">Angular Velocity</label>
                <input type="number" id="angular-velocity" name="angular-velocity" min="1" max="40" value="3">
            </li>
        </ul>`
    element.insertAdjacentHTML("afterbegin", tools);

    const cirle_radius = element.querySelector("#diameter");
    cirle_radius.addEventListener("change", function (e) {
        c_canvas.change_theta(Number(e.target.value))
    });
    const unity = element.querySelector("#unity");
    const rotate = element.querySelector("#rotate");
    const angular_velocity = element.querySelector("#angular-velocity");
    unity.addEventListener("change", function (e) {
        c_canvas.toggle_unity(e.target.checked)
    });
    rotate.addEventListener("change", function (e) {
        c_canvas.toggle_rotate(e.target.checked)
    });
    angular_velocity.addEventListener("change", function (e) {
        c_canvas.change_w(e.target.value);
    });
}

function z_tools(element, z_canvas) {
    const ul = element.querySelector("ul");
    if (ul) {
        element.removeChild(ul);
    }
    const tools = `<ul class="right-toolbar">
            <li>
                <label for="color">Color</label>
                <input type="checkbox" name="color" id="color">
            </li>
        </ul>`
    element.insertAdjacentHTML("afterbegin", tools);

    const color = element.querySelector("#color");
    color.addEventListener("change", function (e) {
        z_canvas.change_color(e.target.checked)
    });
}