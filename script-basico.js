const d = document,
  $site = d.getElementById("site"),
  $posts = d.getElementById("posts"),
  $template = d.getElementById("post-template").content,
  $fragment = d.createDocumentFragment(),
  DOMAIN = "https://lucylara.com/",
  SITE = `${DOMAIN}wp-json/`,
  API_WP = `${SITE}wp/v2/`,
  POSTS = `${API_WP}posts`,
  PAGES = `${API_WP}pages`,
  CATEGORIES = `${API_WP}categories`;

function getSiteData() {
  fetch(SITE)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);
    })
    .catch((err) => {
      console.log(err);
      let mensaje = err.statusText || "Ocurrió un error";
      $site.innerHTML = `
        <p>
          Error: ${err.status}: ${mensaje}
        </p>`;
    });
}
function getPosts() {
  fetch(POSTS)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);
    })
    .catch((err) => {
      console.log(err);
      let mensaje = err.statusText || "Ocurrió un error";
      $posts.innerHTML = `
        <p>
          Error: ${err.status}: ${mensaje}
        </p>`;
    });
}

d.addEventListener("DOMContentLoaded", (e) => {
  getSiteData();
  getPosts();
});
