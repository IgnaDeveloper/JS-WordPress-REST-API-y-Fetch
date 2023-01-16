const d = document,
  $site = d.getElementById("site"),
  $posts = d.getElementById("posts"),
  $template = d.getElementById("post-template").content,
  $fragment = d.createDocumentFragment(),
  DOMAIN = "https://lucylara.com/",
  SITE = `${DOMAIN}wp-json/`,
  API_WP = `${SITE}wp/v2/`,
  POSTS = `${API_WP}posts?_embed`,
  PAGES = `${API_WP}pages`,
  CATEGORIES = `${API_WP}categories`,
  $loader = d.querySelector(".loader"),
  w = window;

let page = 1,
  perPage = 5;

function getSiteData() {
  fetch(SITE)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);
      $site.innerHTML = `
      <h3>Sitio Web</h3>
      <h2><a href="${json.url}" target="_blank">${json.name}</a></h2>
      <p>${json.description}</p>
      <p>${json.timezone_string}</p>`;
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
  $loader.style.display = "block";
  fetch(`${POSTS}&per_page=${perPage}&page=${page}`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);
      //
      json.forEach((post) => {
        let categories = "",
          tags = "";

        post._embedded["wp:term"][0].forEach((el) => {
          categories += `<li>${el.name}</li>`;
        });
        post._embedded["wp:term"][1].forEach((el) => {
          tags += `<li>${el.name}</li>`;
        });

        $template.querySelector("img").src = post._embedded["wp:featuredmedia"]
          ? post._embedded["wp:featuredmedia"][0].source_url
          : "";
        $template.querySelector("img").alt = post.title.rendered;
        $template.querySelector(".post-title").innerHTML = post.title.rendered;
        $template.querySelector(".post-author").innerHTML = `
        <img src = "${post._embedded.author[0].avatar_urls["24"]}" alt = "${post._embedded["author"][0].name}" >
        <figcaption>${post._embedded["author"][0].name}</figcaption>
            `;
        $template.querySelector(".post-data").innerHTML = new Date(
          post.date
        ).toLocaleDateString();
        $template.querySelector(".post-link").href = post.link;
        $template.querySelector(".post-excerpt").innerHTML =
          post.excerpt.rendered.replace("[&hellip;]", "...");
        $template.querySelector(".post-categories").innerHTML = `
        <p><b>CATEGORÍAS</b></p>
        <ul>${categories.toUpperCase()}</ul>
        `;
        $template.querySelector(".post-tags").innerHTML = `
        <p><b>TAGS</b></p>
        <ul>${tags.toUpperCase()}</ul>
        `;
        $template.querySelector(".post-content > article").innerHTML =
          post.content.rendered;

        $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });
      $posts.appendChild($fragment);
      $loader.style.display = "none";
    })
    .catch((err) => {
      console.log(err);
      let mensaje = err.statusText || "Ocurrió un error";
      $posts.innerHTML = `
        <p>
          Error: ${err.status}: ${mensaje}
        </p>`;
      $loader.style.display = "none";
    });
}

d.addEventListener("DOMContentLoaded", (e) => {
  getSiteData();
  getPosts();
});

w.addEventListener("scroll", (e) => {
  const { scrollTop, clientHeight, scrollHeight } = d.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    page += 1;
    perPage += 5;
    getPosts();
  }
});
