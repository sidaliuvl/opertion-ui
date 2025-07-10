let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const ui = document.getElementById("operation-ui");
const header = document.getElementById("header");
const memberList = document.getElementById("member-list");
const leaveBtn = document.getElementById("leave-btn");
const opTitle = document.getElementById("op-title");

// Restore UI position if saved
window.addEventListener("load", () => {
    const savedLeft = localStorage.getItem("ui-left");
    const savedTop = localStorage.getItem("ui-top");
    if (savedLeft && savedTop) {
        ui.style.left = savedLeft;
        ui.style.top = savedTop;
        ui.style.transform = "none"; // Disable center transform when custom position is used
    }
});

window.addEventListener("message", function (event) {
    const data = event.data;

    if (data.action === "show") {
        ui.style.display = "block";
        updateTitle(data.operation);
        updateMembers(data.members, data.channel);
    }

    if (data.action === "hide") {
        ui.style.display = "none";
    }
});

// Title update
function updateTitle(operationTitle) {
    opTitle.textContent = ` ${operationTitle}`;
}

// Member list update
function updateMembers(members, channel) {
    memberList.innerHTML = "";

    let max = 99;
    const match = /\((\d+)\/(\d+)\)/.exec(opTitle.textContent);
    if (match) max = parseInt(match[2]);

    members.forEach((member, index) => {
        const div = document.createElement("div");
        div.classList.add("member");

        // If over limit, mark red
        if (index + 1 > max) {
            div.style.color = "red";
        } else {
            div.style.color = "white";
        }

        div.textContent = `${member.name}`;
        memberList.appendChild(div);
    });
}

// Leave Operation
leaveBtn.addEventListener("click", () => {
    fetch(`https://${GetParentResourceName()}/leaveop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    }).then(() => {
        ui.style.display = "none";
    });
});

// Drag logic
header.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragOffset.x = e.clientX - ui.offsetLeft;
    dragOffset.y = e.clientY - ui.offsetTop;
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        // Save position to localStorage
        localStorage.setItem("ui-left", ui.style.left);
        localStorage.setItem("ui-top", ui.style.top);
    }
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    ui.style.left = `${e.clientX - dragOffset.x}px`;
    ui.style.top = `${e.clientY - dragOffset.y}px`;
});
