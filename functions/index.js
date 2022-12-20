const functions = require("firebase-functions");

exports.createBookmarksFile = functions.https.onCall(async (data, context) => {
  const bookmarks = data.bookmarks;
  let bookmarksHTML = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`;

  bookmarks.forEach(({ url, title }) => {
    bookmarksHTML += `<DT><A HREF="${url}" ADD_DATE="">${title}</A>\n`;
  });

  bookmarksHTML += "</DL><p>";
  const file = new Blob([bookmarksHTML], { type: "text/html" });
  const text = await file.text();
  return { file: text };
});
