async function initSearch() {

    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const palette = document.getElementById("commandPalette");

    if (!input || !results || !palette) return;

    const posts = await fetchPostList();

    const enriched = await Promise.all(
        posts.map(async p => {

            const raw = await loadPost(p.file);

            const { meta } = parseFrontmatter(raw);

            return {
                file: p.file,
                title: meta.title || p.file
            };
        })
    );

    document.addEventListener("keydown", e => {

        const cmdk =
            (e.metaKey || e.ctrlKey) &&
            e.key.toLowerCase() === "k";

        if (cmdk || e.key === "/") {

            if (
                document.activeElement.tagName === "INPUT" ||
                document.activeElement.tagName === "TEXTAREA"
            ) return;

            e.preventDefault();

            palette.classList.toggle("open");

            if (palette.classList.contains("open")) {
                input.focus();
            }
        }

        if (e.key === "Escape") {
            palette.classList.remove("open");
        }
    });

    input.addEventListener("input", () => {

        const q = input.value.toLowerCase();

        const filtered = enriched.filter(post =>
            post.title.toLowerCase().includes(q)
        );

        results.innerHTML = filtered.map(post => `
            <a class="search-item"
               href="post.html?file=${post.file}">
                ${post.title}
            </a>
        `).join("");
    });
}

initSearch();