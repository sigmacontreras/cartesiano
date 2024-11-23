function f_option(input, transform) {

    const wrapper = Object.freeze({
        result: input
    })
    const newOptionValue = falsy(wrapper.result) ? transform(wrapper.result) : false
    function None() {
        return !newOptionValue ? true : false
    }
    function Some() {
        return newOptionValue
    }
    return {
        None,
        Some
    }
}

function falsy(value) {
    return (value != null || value != undefined)
}

const f_signals_manager = (function () {
    const signals = new Map();
    return Object.freeze({
        getSignal: (signal_id) => {
            return signals.get(signal_id)
        },
        setSignal: (signal_id, transform) => {
            signals.set(signal_id, transform())
        }
    })
}())


function f_signal(signal_id) {

    if (f_option(signal_id, f_signals_manager.getSignal).None()) {
        f_signals_manager.setSignal(signal_id, function () {
            let state;
            return function (init_state) {
                if (!state) {
                    state = init_state
                }
                return [function () {
                    return state
                },
                function (value) {
                    return state = value
                }
                ]
            }
        })
    }

    return f_signals_manager.getSignal(signal_id)
}

function normalize(value, min, max) {
    return (value - min) / (max - min)
}

function vector_quadrant(x, y) {
    if ((x > originX && y < originY)) {
        return 1
    }
    if (x < originX && y < originY) {
        return 2
    }
    if (x < originX && y > originY) {
        return 3
    }
    if (x > originX && y > originY) {
        return 4
    }
    return -1
}

function vector_to_complex(x, y) {
    const quadrant = vector_quadrant(x, y)
    if (quadrant === 1) {
        return [normalize(x, originX, width), normalize(y, originY, 0)]
    }
    if (quadrant === 2) {
        return [- normalize(x, originX, 0), normalize(y, originY, 0)]
    }
    if (quadrant === 3) {
        return [- normalize(x, originX, 0), - normalize(y, originY, height)]
    }
    if (quadrant === 4) {
        return [normalize(x, originX, width), - normalize(y, originY, height)]
    }
    return [0, 0]
}