window.onload = () => {
    const form1 = document.querySelector("#addForm");

    let items = document.getElementById("items");
    let submit = document.getElementById("submit");

    let editItem = null;

    form1.addEventListener("submit", addItem);
    items.addEventListener("click", handleListActions);

    // Update the date and time display to IST
    function showTimeIST() {
        const now = new Date();
        const utcOffset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
        const istTime = new Date(now.getTime() + utcOffset + istOffset);

        const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

        const currentDate = istTime.toLocaleDateString("en-IN", dateOptions); // 23 Nov 2024
        const currentTime = istTime.toLocaleTimeString("en-IN", timeOptions); // 07:45 PM

        document.getElementById('currentTime').innerHTML = `${currentDate} | ${currentTime}`;
    }

    showTimeIST();
    setInterval(showTimeIST, 1000);

    // Check tasks for notification
    function checkTasks() {
        const now = new Date();
        const utcOffset = now.getTimezoneOffset() * 60000;
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + utcOffset + istOffset).toLocaleTimeString("en-IN", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Check all tasks in the list
        document.querySelectorAll(".alarm-time").forEach(alarmSpan => {
            const taskTime = alarmSpan.textContent.trim();
            if (taskTime && taskTime === istTime) {
                const taskName = alarmSpan.closest('li').querySelector('.task-text').textContent;

                // Show simple pop-up notification (alert) when task time is reached
                alert(`Task Reminder: It's time for the task: ${taskName}`);
            }
        });
    }

    // Call checkTasks every second
    setInterval(checkTasks, 1000);
};

function addItem(e) {
    e.preventDefault();

    if (submit.value !== "Submit") {
        editItem.target.parentNode.querySelector('.task-text').textContent =
            document.getElementById("item").value;

        submit.value = "Submit";
        document.getElementById("item").value = "";

        document.getElementById("lblsuccess").innerHTML = "Text edited successfully";
        document.getElementById("lblsuccess").style.display = "block";

        setTimeout(() => {
            document.getElementById("lblsuccess").style.display = "none";
        }, 3000);

        return false;
    }

    let newItem = document.getElementById("item").value.trim();
    if (!newItem) return false;

    document.getElementById("item").value = "";

    let li = document.createElement("li");
    li.className = "list-group-item";

    // Task text
    let taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = newItem;

// Create Set Time button
let setTimeButton = document.createElement("button");
setTimeButton.className = "btn btn-info btn-sm float-right set-time ml-2";
setTimeButton.innerHTML = '<i class="bi bi-clock-fill"></i>'; // Bootstrap clock icon
setTimeButton.title = "Set Task Time";  // Tooltip for accessibility

    // Alarm time span
    let alarmTime = document.createElement("span");
    alarmTime.className = "alarm-time ml-2";
    alarmTime.textContent = "";

// Create the alarm button
let alarmButton = document.createElement("button");
alarmButton.className = "btn btn-warning btn-sm float-right alarm ml-2";
alarmButton.innerHTML = '<i class="bi bi-bell-fill"></i>'; // Bootstrap bell icon
alarmButton.title = "Set Alarm";

// Create Edit button
let editButton = document.createElement("button");
editButton.className = "btn-success btn btn-sm float-right edit ml-2";
editButton.innerHTML = '<i class="bi bi-pencil"></i>'; // Bootstrap Pencil Icon
editButton.title = "Edit Task";  // Add a tooltip for accessibility

// Delete Button
let deleteButton = document.createElement("button");
deleteButton.className = "btn btn-danger btn-sm float-right delete";
deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>'; // Bootstrap trash icon
deleteButton.title = "Delete Task";

// Create Share button
let shareButton = document.createElement("button");
shareButton.className = "btn btn-secondary btn-sm float-right share ml-2";
shareButton.innerHTML = '<i class="bi bi-share-fill"></i>'; // Bootstrap share icon
shareButton.title = "Share Task"; // Tooltip text

// Attach email body and subject for sharing
const emailBody = encodeURIComponent(`Task: ${newItem}`);
const emailSubject = encodeURIComponent("Task Sharing");

// Attach click event handler
shareButton.addEventListener("click", () => {
    const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.open(mailtoLink, '_blank'); // Open the mailto link in a new tab
});



    li.appendChild(taskText);
    li.appendChild(alarmTime);
    li.appendChild(alarmButton); 
    li.appendChild(setTimeButton);
    li.appendChild(shareButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    items.appendChild(li);
}

function handleListActions(e) {
    e.preventDefault();

    // Event handler for delete
if (e.target.closest(".delete")) {
    if (confirm("Are you Sure?")) {
        let li = e.target.closest("li");
        items.removeChild(li);

        document.getElementById("lblsuccess").innerHTML = "Text deleted successfully";
        document.getElementById("lblsuccess").style.display = "block";

        setTimeout(() => {
            document.getElementById("lblsuccess").style.display = "none";
        }, 3000);
    }
}

// Handle Edit button click
if (e.target.closest(".edit")) {
    const taskTextElement = e.target.closest('li').querySelector('.task-text');
    const itemInput = document.getElementById("item");

    // Set the value of the input to the task text
    if (taskTextElement) {
        itemInput.value = taskTextElement.textContent;
    } else {
        console.error("Task text not found for editing.");
    }

    // Change the button value to 'EDIT' to indicate editing mode
    const submitButton = document.getElementById("submit");
    if (submitButton) {
        submitButton.value = "EDIT";
    }

    // Store the edit item for later use
    editItem = e;
}

// Handle Set Time button click
if (e.target.closest(".set-time")) {
    const taskItem = e.target.closest('li');
    const alarmTimeElement = taskItem.querySelector(".alarm-time");

    // Prompt for task time input
    const alarmTime = prompt("Set task time in HH:MM AM/PM format:");

    // Normalize and validate time format
    const normalizedTime = alarmTime.trim().toUpperCase().replace(/\s+/g, " ");
    const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9](\s?)(AM|PM)$/i;

    if (timePattern.test(normalizedTime) && alarmTimeElement) {
        alarmTimeElement.textContent = normalizedTime;
        alert(`Task time set for: ${normalizedTime}`);
    } else {
        alert("Invalid time format. Use HH:MM AM/PM (e.g., 7:50 PM).");
    }
}

// Handle alarm button click
if (e.target.closest(".alarm")) {
    const userAgent = navigator.userAgent.toLowerCase();
    let alarmLink = "";

    if (userAgent.includes("android")) {
        alarmLink = "https://play.google.com/store/apps/details?id=com.google.android.deskclock";
    } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
        alarmLink = "https://apps.apple.com/in/app/clock/id1584215688";
    } else if (userAgent.includes("windows")) {
        alarmLink = "https://www.microsoft.com/store/productId/9WZDNCRFJ3PR?ocid=pdpshare";
    }

    if (alarmLink) {
        window.open(alarmLink, "_blank");
    } else {
        alert("Clock app feature is not available for this device.");
    }
}    
    
}

function toggleButton(ref, btnID) {
    document.getElementById(btnID).disabled = false;
}