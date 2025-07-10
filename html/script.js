let isDragging = false;
let dragOffset = { x: 0, y: 0 };

const ui = document.getElementById("operation-ui");
const header = document.getElementById("header");
const memberList = document.getElementById("member-list");
const leaveBtn = document.getElementById("leave-btn");
const opTitle = document.getElementById("op-title");
const overlay = document.getElementById("overlay");
const memberCountEl = document.getElementById("member-count");
const currentTimeEl = document.getElementById("current-time");

// Update time every second
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    });
    if (currentTimeEl) {
        currentTimeEl.textContent = timeString;
    }
}

// Start time updates
setInterval(updateTime, 1000);
updateTime();

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
        updateStats(data.members);
    }

    if (data.action === "hide") {
        hideUI();
    }

    if (data.action === "update") {
        updateMembers(data.members, data.channel);
        updateStats(data.members);
    }
});

function showUI() {
    overlay.style.display = "block";
    ui.style.display = "block";
    ui.classList.add("show");
    ui.classList.remove("hide");
    
    // Add entrance animation delay for better UX
    setTimeout(() => {
        ui.style.pointerEvents = "auto";
    }, 100);
}

function hideUI() {
    ui.classList.add("hide");
    ui.classList.remove("show");
    ui.style.pointerEvents = "none";
    
    setTimeout(() => {
        ui.style.display = "none";
        overlay.style.display = "none";
    }, 300);
}

function updateTitle(operationTitle) {
    opTitle.textContent = operationTitle;
}

function updateMembers(members, channel) {
    memberList.innerHTML = "";

    if (members.length === 0) {
        memberList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users empty-state-icon"></i>
                <div class="empty-state-text">No Officers</div>
                <div class="empty-state-subtext">Waiting for team</div>
            </div>
        `;
        return;
    }

    // Extract max from operation title
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

        // Determine rank icon
        const rankIcons = {
            'Chief': 'fas fa-star',
            'Captain': 'fas fa-shield-alt',
            'Lieutenant': 'fas fa-medal',
            'Sergeant': 'fas fa-chevron-up',
            'Officer': 'fas fa-user-shield',
            'Detective': 'fas fa-search',
            'default': 'fas fa-user-shield'
        };

        const rank = member.rank || 'Officer';
        const iconClass = rankIcons[rank] || rankIcons['default'];
        const isOverLimit = index + 1 > max;

        div.innerHTML = `
            <div class="member-icon">
                <i class="${isOverLimit ? 'fas fa-exclamation-triangle' : iconClass}"></i>
            </div>
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-rank">${rank}</div>
                <div class="member-status">
                    <i class="fas fa-circle"></i>
                    <span>Online</span>
                </div>
            </div>
        `;
        
        memberList.appendChild(div);
    });
}

function updateStats(members) {
    // Extract max from operation title
    let max = 99;
    const match = /\((\d+)\/(\d+)\)/.exec(opTitle.textContent);
    if (match) max = parseInt(match[2]);

    const activeCount = members.length;
    
    if (memberCountEl) {
        memberCountEl.textContent = `${activeCount}/${max}`;
        
        // Update color based on capacity
        if (activeCount > max) {
            memberCountEl.style.color = '#ef4444';
        } else if (activeCount > max * 0.8) {
            memberCountEl.style.color = '#f59e0b';
        } else {
            memberCountEl.style.color = '#10b981';
        }
    }
}

// Enhanced leave operation with better UX
leaveBtn.addEventListener("click", () => {
    const icon = leaveBtn.querySelector('i');
    const text = leaveBtn.querySelector('span');
    
    // Add loading state
    icon.className = "fas fa-spinner loading";
    text.textContent = "Leaving...";
    leaveBtn.disabled = true;
    
    fetch(`https://${GetParentResourceName()}/leaveop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    }).then(() => {
        hideUI();
    }).catch(() => {
        // Reset button on error
        icon.className = "fas fa-sign-out-alt";
        text.textContent = "Leave Operation";
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
    ui.style.transition = "none";
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
        // Save position to localStorage
        localStorage.setItem("ui-left", ui.style.left);
        localStorage.setItem("ui-top", ui.style.top);
        
        // Remove dragging visual feedback
        ui.style.cursor = "";
        header.style.cursor = "move";
        ui.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    }
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;
    
    // Constrain to viewport with padding
    const padding = 20;
    const maxLeft = window.innerWidth - ui.offsetWidth - padding;
    const maxTop = window.innerHeight - ui.offsetHeight - padding;
    
    ui.style.left = `${Math.max(padding, Math.min(newLeft, maxLeft))}px`;
    ui.style.top = `${Math.max(padding, Math.min(newTop, maxTop))}px`;
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
        const padding = 20;
        const maxLeft = window.innerWidth - ui.offsetWidth - padding;
        const maxTop = window.innerHeight - ui.offsetHeight - padding;
        
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

// Add smooth scroll behavior for member list
if (memberList) {
    memberList.addEventListener('wheel', (e) => {
        e.preventDefault();
        memberList.scrollTop += e.deltaY * 0.5;
    });
}