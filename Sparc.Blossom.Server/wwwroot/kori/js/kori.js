var koriAuthorized = false;
var initialPosition = { left: 25 };

// mouse click handler for kori widget and elements
function mouseClickHandler(e) {
    var t = e.target;

    // click login menu
    if (t.closest(".kori-login__btn")) {
        koriAuthorized = true;
        if (koriAuthorized) {
            document.getElementById("kori-login").classList.remove("show");
            document.body.classList.add("kori-loggedin"); // add the class to <body>
        }
    }

    if (koriAuthorized) {
        // click kori widget
        if (t.closest(".kori-widget")) {
            if (t.closest('.options__edit')) {
                toggleEdit(true);
                return;
            } else if (t.closest('.kori-edit__back') || t.closest('.kori-edit__cancel')) {
                toggleEdit(false);
            } else {
                return;
            }
        }

        // click kori enabled elements
        toggleSelected(t);
    } else {
        console.log("please login to use kori services");
        return;
    }
}

// mouse click event listener
window.addEventListener("click", e => {
    e.stopImmediatePropagation();
    mouseClickHandler(e);
});

// selecting and unselecting kori-enabled elements
function toggleSelected(t) {
    var widget = document.getElementById("kori-widget");
    document.getElementsByClassName("selected")[0]?.classList.remove("selected");
    document.getElementsByClassName("show")[0]?.classList.remove("show");

    var koriElem = t.closest('.kori-enabled');
    if (!koriElem) {
        // clicked outside of all kori elements
        document.getElementsByClassName("show")[0]?.classList.remove("show");
        // reset right margin if widget is docked
        if (widget.classList.contains("docked")) {
            document.body.style.marginRight = '0';
        }
        return;
    }

    if (!koriElem.classList.contains("selected")) {
        koriElem.classList.add("selected");
        document.getElementsByClassName("show")[0]?.classList.remove("show");
        toggleWidget(koriElem);
    }
}

// showing and hiding kori widget
function toggleWidget(t) {
    var widget = document.getElementById("kori-widget");
    var widgetActions = document.getElementById("kori-widget__actions");

    resetWidgetPosition();    

    t.appendChild(widget);     

    widget.classList.add("show");
    widgetActions.classList.add("show");    

    // add data attribute to widget with related element ID
    var relatedElementId = t.id || 'element-' + new Date().getTime();
    t.id = relatedElementId;
    widget.setAttribute('data-related-element', relatedElementId);

    // after the widget is shown, make it draggable
    makeWidgetDraggable();
}

// showing and hiding kori edit content menu
function toggleEdit(isOpen) {
    var edit = document.getElementById("kori-edit");
    var widgetActions = document.getElementById("kori-widget__actions");

    if (!edit.classList.contains("show") && isOpen == true) {
        widgetActions.classList.remove("show");
        edit.classList.add("show");
        widgetActions.classList.remove("show");
    }

    if (edit.classList.contains("show") && isOpen == false) {
        edit.classList.remove("show");
        widgetActions.classList.add("show");
    }
}

// login to use kori services
function login() {
    console.log("logging in...");
}

// function to make the widget draggable
function makeWidgetDraggable() {
    var widget = document.getElementById("kori-widget");
    var widgetActions = document.getElementById("kori-widget__actions");
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // add mouse event to start dragging
    widgetActions.onmousedown = function (e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        // add 'no-transition' class when starting drag
        widget.classList.add("no-transition");
    };

    // function to drag the element
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // get parent element bounds
        var parentElem = widgetActions.parentElement;
        var parentRect = parentElem.getBoundingClientRect();        

        // calculate new positions
        var newLeft = widgetActions.offsetLeft - pos1;
        var newTop = widgetActions.offsetTop - pos2;        

        // get viewport dimensions
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;       

        // get widget dimensions
        var widgetWidth = widgetActions.offsetWidth;
        var widgetHeight = widgetActions.offsetHeight;                       

        // calculate max and min positions
        var maxLeft = viewportWidth - (parentRect.left + widgetWidth);        
        var maxTop = viewportHeight - (parentRect.top + (widgetHeight/2));
        var minLeft = -parentRect.left;
        var minTop = -parentRect.top;          

        // constrain the widget within the viewport, considering parent element bounds
        newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
        newTop = Math.max(minTop, Math.min(maxTop, newTop));        

        // set the new widget position
        widgetActions.style.left = newLeft + "px";
        widgetActions.style.top = newTop + "px";        
    }

    // function to stop dragging
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;

        // remove 'no-transition' class when stopping dragging
        widget.classList.remove("no-transition");
    }
}

// reset widget position to initial position
function resetWidgetPosition() {
    var widget = document.getElementById("kori-widget");
    var widgetActions = document.getElementById("kori-widget__actions");
    // do not reset position if widget is docked
    if (widget.classList.contains("docked")) {
        return;
    }

    widgetActions.style.left = initialPosition.left + 'px';
    widgetActions.style.top = '';    
}

// dock and undock the widget
//function toggleDock() {
//    var dockButton = document.getElementById("dockButton");
//    var widget = document.getElementById("kori-widget");
//    var widgetActions = document.getElementById("kori-widget__actions");

//    if (!widget.classList.contains("docked")) {
//        widget.classList.add("docked");
//        widgetActions.style.left = '';
//        widgetActions.style.right = '';
//        widgetActions.style.top = '';
//        dockButton.title = 'Undock';

//        // remove the ability to drag
//        widgetActions.onmousedown = null;

//        // adjusts the right margin to match the sidebar width
//        document.body.style.marginRight = '298px';
//    } else {
//        widget.classList.remove("docked");
//        dockButton.title = 'Dock';
//        resetWidgetPosition();

//        widget.classList.add("animate-right-to-left");

//        // add the ability to drag
//        makeWidgetDraggable();

//        // remove dynamic page size adjustment
//        document.body.style.marginRight = '0';
//    }
//}

//// dock/undock button click event
//document.getElementById("dockButton").addEventListener("click", toggleDock);

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded and parsed");

    var dockButton = document.getElementById("dockButton");
    console.log("Dock button:", dockButton);

    if (dockButton) {
        dockButton.addEventListener("click", toggleDock);
        console.log("Dock button event listener added");
    } else {
        console.error("Dock button not found");
    }
});

function toggleDock() {
    var widget = document.getElementById("kori-widget");
    var widgetActions = document.getElementById("kori-widget__actions");
    var dockButton = document.getElementById("dockButton");

    // Verifique se os elementos estão presentes
    console.log("toggleDock called");
    console.log(widget, widgetActions, dockButton);

    if (!widget || !widgetActions || !dockButton) {
        console.error("Element(s) not found in toggleDock");
        return;
    }

    if (!widget.classList.contains("docked")) {
        widget.classList.add("docked");
        widgetActions.style.left = '';
        widgetActions.style.right = '';
        widgetActions.style.top = '';
        dockButton.title = 'Undock';

        // remove the ability to drag
        widgetActions.onmousedown = null;

        // adjusts the right margin to match the sidebar width
        document.body.style.marginRight = '298px';
        console.log("Widget docked");
    } else {
        widget.classList.remove("docked");
        dockButton.title = 'Dock';
        resetWidgetPosition();

        widget.classList.add("animate-right-to-left");

        // add the ability to drag
        makeWidgetDraggable();

        // remove dynamic page size adjustment
        document.body.style.marginRight = '0';
        console.log("Widget undocked");
    }
}





