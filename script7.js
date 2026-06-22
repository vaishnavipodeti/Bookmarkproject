const DEFAULT_SETTINGS = Object.freeze({
  storageKey: "bookmarksData",
  categories: ["Work", "Study", "Entertainment"],
  defaultCategory: "Work"
});

let bookmarks = [];
let currentFilter = "All";

const form = document.getElementById("bookmarkForm");
const bookmarksList = document.getElementById("bookmarksList");
const filterButtons = document.querySelectorAll(".filter-btn");

function saveBookmarks() {
  localStorage.setItem(
    DEFAULT_SETTINGS.storageKey,
    JSON.stringify(bookmarks)
  );
}

function loadBookmarks() {
  const storedData = localStorage.getItem(
    DEFAULT_SETTINGS.storageKey
  );

  if (storedData) {
    bookmarks = JSON.parse(storedData);
  }
}

function addBookMark(e) {
  e.preventDefault();

  const title =
    document.getElementById("websiteTitle").value;

  const url =
    document.getElementById("websiteUrl").value;

  const category =
    document.getElementById("category").value;

  const newBookmark = {
    id: Date.now(),
    title: title,
    url: url,
    category: category
  };

  bookmarks.push(newBookmark);

  saveBookmarks();
  renderBookmarks();

  form.reset();
}

function filterBookmarks(categoryFilter) {
  if (categoryFilter === "All") {
    return bookmarks;
  }

  return bookmarks.filter(function(bookmark) {
    return bookmark.category === categoryFilter;
  });
}

function deleteBookmark(id) {
  bookmarks = bookmarks.filter(function(bookmark) {
    return bookmark.id !== id;
  });

  saveBookmarks();
  renderBookmarks();
}

function renderBookmarks() {

  bookmarksList.innerHTML = "";

  const filteredBookmarks =
    filterBookmarks(currentFilter);

  if (filteredBookmarks.length === 0) {
    bookmarksList.innerHTML =
      "<div>No bookmarks found.</div>";
    return;
  }

  filteredBookmarks.forEach(function(bookmark) {

    const bookmarkItem =
      document.createElement("div");

    bookmarkItem.classList.add("bookmark-item");

    bookmarkItem.innerHTML = `
      <div>
        <h3>${bookmark.title}</h3>

        <a href="${bookmark.url}"
           target="_blank"
           class="bookmark-link">
           Visit Website
        </a>

        <div class="bookmark-category">
          ${bookmark.category}
        </div>
      </div>

      <button class="delete-btn">
        Delete
      </button>
    `;

    const deleteBtn =
      bookmarkItem.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function() {
      deleteBookmark(bookmark.id);
    });

    bookmarksList.appendChild(bookmarkItem);

  });
}

function init() {

  form.addEventListener(
    "submit",
    addBookMark
  );

  filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

      filterButtons.forEach(function(btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      currentFilter =
        button.dataset.category;

      renderBookmarks();

    });

  });

  loadBookmarks();
  renderBookmarks();
}

document.addEventListener(
  "DOMContentLoaded",
  init
);