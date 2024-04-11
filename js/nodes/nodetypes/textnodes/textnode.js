
function createTextNode(name = '', text = '', sx = undefined, sy = undefined, x = undefined, y = undefined, addCodeButton = false) {
    let n = document.createElement("textarea");
    n.classList.add('custom-scrollbar', 'node-textarea');
    n.onmousedown = cancel;
    n.setAttribute("type", "text");
    n.setAttribute("size", "11");
    //n.setAttribute("style", "background-color: #222226; color: #bbb; overflow-y: scroll; resize: both; width: 259px; line-height: 1.4; display: none;");
    n.style.position = "absolute";

    let elements = [n];

    let buttonCallback = null;

    let button = document.createElement("button");
    button.innerHTML = "Run Code";
    button.classList.add("code-button");

    // Initially hide the button
    button.style.display = "none";

    if (addCodeButton) {
        button.style.display = "block";
    }

    let node = addNodeAtNaturalScale(name, [n]); // Just add the textarea for now

    let windowDiv = node.windowDiv;  // Find the .content div
    let editableDiv = createContentEditableDiv(n);  // Define editableDiv here

    let htmlView = document.createElement("iframe");
    htmlView.id = 'html-iframe';
    htmlView.classList.add('html-iframe', 'hidden'); // Add hidden class

    let pythonView = document.createElement("div");
    pythonView.id = 'python-frame';
    pythonView.classList.add('python-frame', 'hidden'); // Add hidden class

    windowDiv.appendChild(htmlView);
    windowDiv.appendChild(pythonView);
    windowDiv.appendChild(editableDiv);  // Append the contentEditable div to .content div
    windowDiv.appendChild(button);

    node.addCodeButton = addCodeButton;

    if (sx !== undefined) {
        x = (new vec2(sx, sy)).cmult(zoom).plus(pan);
        y = x.y;
        x = x.x;
    }

    if (x !== undefined) {
        node.pos.x = x;
    }

    if (y !== undefined) {
        node.pos.y = y;
    }

    node.push_extra_cb((node) => {
        return {
            f: "textarea",
            a: {
                p: [0, 0, 1],
                v: node.titleInput.value
            }
        };
    })

    node.push_extra_cb((node) => {
        return {
            f: "textarea",
            a: {
                p: [0, 1, 0],
                v: n.value
            }
        };
    })

    node.isTextNode = true;

    initTextNode(node)

    return node;
}

function initTextNode(node) {
    let contentEditableDiv = node.content.querySelector('.editable-div');
    node.contentEditableDiv = contentEditableDiv;

    let button = node.content.querySelector('.code-button');
    node.codeButton = button;

    let textarea = node.content.querySelector('textarea');
    node.textarea = textarea;

    let htmlView = node.content.querySelector('#html-iframe');
    node.htmlView = htmlView;

    let pythonView = node.content.querySelector('#python-frame');
    node.pythonView = pythonView

    addEventListenersToTextNode(node)
}

function addEventListenersToTextNode(node) {
    let button = node.codeButton;
    let textarea = node.textarea;
    let contentEditableDiv = node.contentEditableDiv
    let htmlView = node.htmlView
    let pythonView = node.pythonView;

    // Setup for the code checkbox listener
    //setupCodeCheckboxListener(button, node.addCodeButton);

    // Attach events for contentEditable and textarea
    addEventsToContentEditable(contentEditableDiv, textarea, node);
    watchTextareaAndSyncWithContentEditable(textarea, contentEditableDiv);

    // Reattach the handleCodeButton callback
    if (button && textarea) {
        // Assuming handleCodeButton sets up the button event listener
        handleCodeButton(button, textarea, htmlView, pythonView, node);
    }
}

function setupCodeCheckboxListener(button, addCodeButton) {
    if (document.getElementById('code-checkbox')) {
        document.getElementById('code-checkbox').addEventListener('change', (event) => {
            if (addCodeButton) {
                button.style.display = "block";
                return;
            }
            //console.log(button, `button`);
            button.style.display = event.target.checked ? "block" : "none";
        });

        if (document.getElementById('code-checkbox').checked) {
            button.style.display = "block";
        }
    }
}