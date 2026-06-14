async function fetchPostList() {
    const res = await fetch("posts/posts.json");
    return await res.json();
}

async function loadPost(file) {
    const res = await fetch(`posts/${file}`);

    if (!res.ok) {
        throw new Error(`Failed to load ${file}`);
    }

    return await res.text();
}

function parseFrontmatter(md) {
    const meta = {};

    const match = md.match(/---([\s\S]*?)---/);

    if (match) {
        match[1]
            .trim()
            .split("\n")
            .forEach(line => {
                const [k, ...v] = line.split(":");
                meta[k.trim()] = v.join(":").trim();
            });

        md = md.replace(match[0], "");
    }

    return {
        meta,
        content: md.trim()
    };
}

function renderPostList(posts, container) {
    container.innerHTML = posts.map(post => `
        <div class="card">
            <a href="essay.html?file=${encodeURIComponent(post.file)}">

                <div class="meta">
                    ${post.category || "Uncategorised"} • ${post.date || ""}
                </div>

                <h3>${post.title}</h3>

            </a>
        </div>
    `).join("");
}

/* PAGE TRANSITIONS */

document.addEventListener("click", e => {

    const link = e.target.closest("a");

    if (!link || link.target === "_blank") return;

    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    e.preventDefault();

    document.body.classList.add("page-out");

    setTimeout(() => {
        window.location.href = href;
    }, 140);
});