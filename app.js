import * as firebase from "firebase/app";
import "firebase/functions";
import { load } from "cheerio";
firebase.initializeApp({
  apiKey: "AIzaSyCRuPHO0-S4Gc6pXeFF4VmCHbH6EtXwZyM",
  authDomain: "bookie-sorter.firebaseapp.com",
  projectId: "bookie-sorter",
});

const form = document.getElementById("bookmark-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookmarksFile = document.getElementById("bookmarks-file").files[0];
  const searchTerm = document.getElementById("search-term").value;

  // Read contents of bookmarks file
  const fileReader = new FileReader();
  fileReader.readAsText(bookmarksFile);
  const bookmarksHTML = await new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });

  // Parse bookmarks HTML
  const $ = load(bookmarksHTML);
  const bookmarks = [];
  $("a").each((i, element) => {
    const url = $(element).attr("href");
    const title = $(element).text();
    bookmarks.push({ url, title });
  });

  // Filter bookmarks by search term
  const filteredBookmarks = bookmarks.filter(({ title }) =>
    title.includes(searchTerm)
  );

  // Call createBookmarksFile function on the server
  const createBookmarksFile = firebase
    .functions()
    .httpsCallable("createBookmarksFile");
  const response = await createBookmarksFile({ bookmarks: filteredBookmarks });

  console.log(response);

  // Download new bookmarks file
  const file = await response.data.file;
  const url = window.URL.createObjectURL(file);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "filtered-bookmarks.html";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
});
