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

    // Set time button
    let setTimeButton = document.createElement("button");
    setTimeButton.className = "btn-info btn btn-sm float-right set-time ml-2";
    setTimeButton.textContent = "Set Time";

    // Alarm time span
    let alarmTime = document.createElement("span");
    alarmTime.className = "alarm-time ml-2";
    alarmTime.textContent = "";

    // Edit button
    let editButton = document.createElement("button");
    editButton.className = "btn-success btn btn-sm float-right edit ml-2";
    editButton.textContent = "Edit";

    // Delete button
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn-danger btn btn-sm float-right delete";
    deleteButton.textContent = "Delete";

    li.appendChild(taskText);
    li.appendChild(alarmTime);
    li.appendChild(setTimeButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    items.appendChild(li);
}

function handleListActions(e) {
    e.preventDefault();

    // Delete task
    if (e.target.classList.contains("delete")) {
        if (confirm("Are you Sure?")) {
            let li = e.target.parentNode;
            items.removeChild(li);

            document.getElementById("lblsuccess").innerHTML = "Text deleted successfully";
            document.getElementById("lblsuccess").style.display = "block";

            setTimeout(() => {
                document.getElementById("lblsuccess").style.display = "none";
            }, 3000);
        }
    }

    // Edit task
    if (e.target.classList.contains("edit")) {
        document.getElementById("item").value =
            e.target.parentNode.querySelector('.task-text').textContent;
        submit.value = "EDIT";
        editItem = e;
    }

    // Set time for the notification
    if (e.target.classList.contains("set-time")) {
        const alarmTime = prompt("Set task time in HH:MM AM/PM format:");

        const normalizedTime = alarmTime.trim().toUpperCase().replace(/\s+/g, " ");
        if (/^(0?[1-9]|1[0-2]):[0-5][0-9](\s?)(AM|PM)$/i.test(normalizedTime)) {
            e.target.parentNode.querySelector(".alarm-time").textContent = normalizedTime;
            alert(`Task time set for: ${normalizedTime}`);
        } else {
            alert("Invalid time format. Use HH:MM AM/PM (e.g., 7:50 pm).");
        }
    }
}

function toggleButton(ref, btnID) {
    document.getElementById(btnID).disabled = false;
}
