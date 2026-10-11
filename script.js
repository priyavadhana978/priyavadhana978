// ========================================
// 🌙 MIDNIGHT JOURNAL
// NO DATABASE VERSION
// ========================================

// Get saved entries from localStorage
function getEntries() {
    try {
        return JSON.parse(
            localStorage.getItem("journalEntries") || "[]"
        );
    } catch (error) {
        console.error("Error reading entries:", error);
        return [];
    }
}


// ========================================
// 1. SAVE JOURNAL ENTRY
// ========================================

function saveEntry() {

    const title = document.getElementById("title").value.trim();
    const mood = document.getElementById("mood").value;
    const content = document.getElementById("content").value.trim();

    if (!title || !mood || !content) {
        alert("Please fill in all fields!");
        return;
    }

    // Create a new journal entry
    const newEntry = {
        id: crypto.randomUUID(),
        title: title,
        mood: mood,
        content: content,
        date: new Date().toISOString()
    };

    // Get existing entries
    const entries = getEntries();

    // Add new entry
    entries.unshift(newEntry);

    // Save entries in browser
    localStorage.setItem(
        "journalEntries",
        JSON.stringify(entries)
    );

    alert("Journal saved successfully! 🌙💜");

    // Clear input fields
    document.getElementById("title").value = "";
    document.getElementById("mood").selectedIndex = 0;
    document.getElementById("content").value = "";

    // Refresh displayed entries
    displayEntries();
}


// ========================================
// 2. DISPLAY JOURNAL ENTRIES
// ========================================

function displayEntries(searchText = "") {

    const container = document.getElementById("entriesContainer");

    if (!container) {
        return;
    }

    const entries = getEntries();

    // Search by title, mood or content
    const filteredEntries = entries.filter((entry) => {

        const text = (
            entry.title + " " +
            entry.mood + " " +
            entry.content
        ).toLowerCase();

        return text.includes(searchText.toLowerCase());
    });

    container.innerHTML = "";

    if (filteredEntries.length === 0) {
        container.textContent = "No journal entries found. 🌙";
        return;
    }

    filteredEntries.forEach((entry) => {

        const card = document.createElement("div");
        card.className = "entry-card";

        const title = document.createElement("h3");
        title.textContent = entry.title;

        const mood = document.createElement("p");
        mood.textContent = "Mood: " + entry.mood;

        const content = document.createElement("p");
        content.textContent = entry.content;

        const date = document.createElement("small");
        date.textContent = new Date(entry.date).toLocaleDateString();

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete 🗑️";

        deleteButton.addEventListener("click", () => {
            deleteEntry(entry.id);
        });

        card.appendChild(title);
        card.appendChild(mood);
        card.appendChild(content);
        card.appendChild(date);
        card.appendChild(document.createElement("br"));
        card.appendChild(deleteButton);

        container.appendChild(card);
    });
}


// ========================================
// 3. DELETE JOURNAL ENTRY
// ========================================

function deleteEntry(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this journal entry?"
    );

    if (!confirmDelete) {
        return;
    }

    const entries = getEntries();

    const updatedEntries = entries.filter(
        (entry) => entry.id !== id
    );

    localStorage.setItem(
        "journalEntries",
        JSON.stringify(updatedEntries)
    );

    displayEntries(
        document.getElementById("searchEntries")?.value || ""
    );
}


// ========================================
// 4. SEARCH JOURNAL ENTRIES
// ========================================

function searchEntries() {

    const searchInput = document.getElementById("searchEntries");

    if (!searchInput) {
        return;
    }

    displayEntries(searchInput.value);
}


// ========================================
// 5. LOAD JOURNAL ENTRIES
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    displayEntries();

    const searchInput = document.getElementById("searchEntries");

    if (searchInput) {
        searchInput.addEventListener("input", searchEntries);
    }

});