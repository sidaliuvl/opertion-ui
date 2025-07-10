let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const ui = document.getElementById("operation-ui");
const header = document.getElementById("header");
const memberList = document.getElementById("member-list");
const leaveBtn = document.getElementById("leave-btn");
const opTitle = document.getElementById("op-title");
const overlay = document.getElementById("overlay");

// Restore UI position if saved
window.addEventListener("load", () => {
    const savedLeft = localStorage.getItem("ui-left");
    const savedTop = localStorage.getItem("ui-top");
    if (savedLeft && savedTop) {
        ui.style.left = savedLeft;
        ui.style.top = savedTop;
        ui.style.transform = "none";
    }
});

window.addEventListener("message", function (event) {
    const data = event.data;

    if (data.action === "show") {
        showUI();
        updateTitle(data.operation);
        updateMembers(data.members, data.channel);
        addOperationStats(data.members);
    }

    if (data.action === "hide") {
        hideUI();
    }

    if (data.action === "update") {
        updateMembers(data.members, data.channel);
        addOperationStats(data.members);
    }
});

function showUI() {
    overlay.style.display = "block";
    ui.style.display = "block";
    ui.classList.add("show");
    ui.classList.remove("hide");
}

function hideUI() {
    ui.classList.add("hide");
    ui.classList.remove("show");
    
    setTimeout(() => {
        ui.style.display = "none";
        overlay.style.display = "none";
    }, 300);
}

// Enhanced title update with status indicator
function updateTitle(operationTitle) {
    opTitle.innerHTML = `${operationTitle} <div class="status-indicator"></div>`;
}

// Enhanced member list update with better styling
function updateMembers(members, channel) {
    memberList.innerHTML = "";

    if (members.length === 0) {
        memberList.innerHTML = `
            <div class="empty-state">
                <div>No officers assigned</div>
            </div>
        `;
        return;
    }

    let max = 99;
    const match = /\((\d+)\/(\d+)\)/.exec(opTitle.textContent);
    if (match) max = parseInt(match[2]);

    members.forEach((member, index) => {
        const div = document.createElement("div");
        div.classList.add("member");

        // If over limit, mark as over-limit
        if (index + 1 > max) {
            div.classList.add("over-limit");
        }

        div.innerHTML = `
            <div class="member-name">${member.name}</div>
            <div class="member-status">${member.rank || 'Officer'}</div>
        `;
        
        memberList.appendChild(div);
    });
}

// Add operation statistics
function addOperationStats(members) {
    // Remove existing stats if any
    const existingStats = document.querySelector('.operation-stats');
    if (existingStats) {
        existingStats.remove();
    }

    const statsDiv = document.createElement('div');
    statsDiv.classList.add('operation-stats');
    
    let max = 99;
    const match = /\((\d+)\/(\d+)\)/.exec(opTitle.textContent);
    if (match) max = parseInt(match[2]);

    const activeCount = members.length;
    const maxCount = max;
    
    statsDiv.innerHTML = `
        <div class="stat-item">
            <span>👮</span>
            <span>${activeCount}/${maxCount}</span>
        </div>
        <div class="stat-item">
            <span>🕐</span>
            <span>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    `;
    
    // Insert before leave button
    ui.insertBefore(statsDiv, leaveBtn);
}

// Enhanced leave operation with confirmation
leaveBtn.addEventListener("click", () => {
    // Add loading state
    leaveBtn.innerHTML = "🔄 Leaving...";
    leaveBtn.disabled = true;
    
    fetch(`https://${GetParentResourceName()}/leaveop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    }).then(() => {
        hideUI();
    }).catch(() => {
        // Reset button on error
        leaveBtn.innerHTML = "🚪 Leave Operation";
        leaveBtn.disabled = false;
    });
});

// Enhanced drag logic with smooth movement
header.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragOffset.x = e.clientX - ui.offsetLeft;
    dragOffset.y = e.clientY - ui.offsetTop;
    
    // Add dragging class for visual feedback
    ui.style.cursor = "grabbing";
    header.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        // Save position to localStorage
        localStorage.setItem("ui-left", ui.style.left);
        localStorage.setItem("ui-top", ui.style.top);
        
        // Remove dragging visual feedback
        ui.style.cursor = "";
        header.style.cursor = "move";
    }
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;
    
    // Constrain to viewport
    const maxLeft = window.innerWidth - ui.offsetWidth;
    const maxTop = window.innerHeight - ui.offsetHeight;
    
    ui.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
    ui.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
    ui.style.transform = "none";
});

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (ui.style.display === "block") {
        if (e.key === "Escape") {
            hideUI();
        }
    }
});

// Add resize handler to maintain position
window.addEventListener("resize", () => {
    if (ui.style.left && ui.style.top) {
        const maxLeft = window.innerWidth - ui.offsetWidth;
        const maxTop = window.innerHeight - ui.offsetHeight;
        
        const currentLeft = parseInt(ui.style.left);
        const currentTop = parseInt(ui.style.top);
        
        if (currentLeft > maxLeft) {
            ui.style.left = `${maxLeft}px`;
        }
        if (currentTop > maxTop) {
            ui.style.top = `${maxTop}px`;
        }
    }
});