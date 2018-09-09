function getEnvironment(processArgs = process.argv) {
    const envFlags = ['-e', '--env'];
    const envIndex = processArgs.findIndex(arg => envFlags.includes(arg)) + 1;

    return (envIndex > 0 && envIndex < processArgs.length) ? processArgs[envIndex] : 'default';
}

function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

function hasValidThreshold(threshold) {
    return !(typeof threshold !== 'number' || threshold < 0 || threshold > 1);
}

function buildCaptureAreas(element, viewport) {
    const numXRequired = Math.ceil(element.width / viewport.width);
    const numYRequired = Math.ceil(element.height / viewport.height);
    const xCapture = viewport.left;
    const yCapture = viewport.top;
    const captureAreas = [];
    for (let x = 0; x < numXRequired; x += 1) {
        for (let y = 0; y < numYRequired; y += 1) {
            captureAreas.push({
                left: xCapture + (viewport.width * x),
                top: yCapture + (viewport.height * y),
                behavior: 'instant',
            });
        }
    }

    return captureAreas;
}

function scrollAndPosition(scrollToOptions) {
    window.scrollTo(JSON.parse(scrollToOptions));
    return {
        left: window.pageXOffset,
        top: window.pageYOffset,
    };
}

function elementAndViewportData(selector) {
    const htmlElement = document.querySelector(selector);
    let results = {};

    if (htmlElement) {
        const isBody = htmlElement === document.body;
        let bounding = { left: 0, top: 0 };

        if (!isBody) {
            bounding = htmlElement.getBoundingClientRect();
            bounding.left += window.pageXOffset;
            bounding.top += window.pageYOffset;
        }

        window.scrollTo({
            left: bounding.left,
            top: bounding.top,
            behavior: 'instant',
        });
        bounding = htmlElement.getBoundingClientRect();
        const viewport = {
            left: Math.round(window.pageXOffset),
            top: Math.round(window.pageYOffset),
            width: window.innerWidth,
            height: window.innerHeight,
        };
        const body = {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
        };
        const element = {
            top: isBody ? 0 : Math.round(bounding.top + window.pageYOffset),
            left: isBody ? 0 : Math.round(bounding.left + window.pageXOffset),
            width: isBody ? body.width : Math.round(bounding.width),
            height: isBody ? body.height : Math.round(bounding.height),
        };
        results = {
            devicePixelRatio: window.devicePixelRatio,
            element,
            viewport,
            body,
        };
    }

    return results;
}

function handleElement(element) {
    try {
        return typeof element === 'string' ? element : element.selector;
    } catch (e) {
        throw new Error('Invalid argument provided for either selector or filename');
    }
}

export {
    hasProperty, getEnvironment, hasValidThreshold, buildCaptureAreas,
    scrollAndPosition, elementAndViewportData, handleElement,
};
