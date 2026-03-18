/* global React, ReactDOM */

const e = React.createElement;
const { useEffect, useState } = React;

const GITHUB_PROFILE = "https://github.com/VWilk";
const GITHUB_API = "https://api.github.com/users/VWilk/repos?per_page=100&sort=updated";

const NAV_LINKS = [
    { href: "#story", label: "Story" },
    { href: "#ctf", label: "CTF Wins" },
    { href: "#github", label: "GitHub" },
    { href: "#contact", label: "Contact" },
];

const SUBSITE_LINKS = [
    { href: "html/subsites/pgpWebsite/pgpWebsite.html", label: "PGP Key", external: true },
];

const STORY_SCENES = [
    {
        step: "01",
        title: "First CTF win",
        body: "Started on reversing challenges, wrote my first debugger scripts, and took first place on the reverse track.",
        tags: ["Reverse", "Pwn"],
    },
    {
        step: "02",
        title: "Reverse engineering obsession",
        body: "Became focused on Windows internals and binary workflows. Built repeatable notes and tooling for faster triage.",
        tags: ["WinAPI", "IDA", "x64dbg"],
    },
    {
        step: "03",
        title: "Trainer tooling",
        body: "Built a modular trainer framework with versioned offsets, hotkeys, and safety guards for controlled testing.",
        tags: ["C++", "Cheat Engine", "Tooling"],
    },
];

const CTF_WINS = [
    { value: "1st", label: "ZeroDays CTF" },
    { value: "4th", label: "ZeroDays CTF" },
];

function Navbar({ links, subsites }) {
    return e(
        "nav",
        { className: "nav" },
        e("div", { className: "nav__brand" }, "VWilk"),
        e(
            "div",
            { className: "nav__actions" },
            e(
                "div",
                { className: "nav__links" },
                links.map((link) =>
                    e(
                        "a",
                        {
                            key: link.href,
                            href: link.href,
                            className: "nav__link",
                            target: link.external ? "_blank" : undefined,
                            rel: link.external ? "noreferrer" : undefined,
                        },
                        link.label
                    )
                )
            ),
            e(SubsiteBar, { links: subsites })
        )
    );
}

function Section({ id, eyebrow, title, children, className }) {
    const classes = ["section", "reveal", className].filter(Boolean).join(" ");
    return e(
        "section",
        { id, className: classes },
        e("div", { className: "section__eyebrow" }, eyebrow),
        e("h2", { className: "section__title" }, title),
        e("div", { className: "section__body" }, children)
    );
}

function Hero() {
    return e(
        "header",
        { className: "hero reveal" },
        e("div", { className: "hero__glow" }),
        e(
            "div",
            { className: "hero__grid" },
            e(
                "div",
                { className: "hero__content" },
                e("p", { className: "hero__tag" }, "Software Engineer • CTF Competitor"),
                e(
                    "h1",
                    { className: "hero__title" },
                    "Reverse engineer. Break things. Build clean wins."
                ),
                e(
                    "p",
                    { className: "hero__subtitle" },
                    "University student focused on reversing, exploit dev, and trainer tooling. Multiple first-place CTF finishes across university and regional events."
                ),
                e(
                    "div",
                    { className: "hero__cta" },
                    e("a", { href: "#contact", className: "btn btn--primary" }, "Contact"),
                    e(
                        "a",
                        { href: GITHUB_PROFILE, className: "btn btn--ghost", target: "_blank", rel: "noreferrer" },
                        "GitHub"
                    ),
                    e(
                        "a",
                        {
                            href: "html/subsites/pgpWebsite/pgpWebsite.html",
                            className: "btn btn--ghost",
                            target: "_blank",
                            rel: "noreferrer",
                        },
                        "PGP"
                    )
                )
            ),
            e(
                "div",
                { className: "hero__panel" },
                e("div", { className: "hero__panel-title" }, "Now"),
                e("div", { className: "hero__panel-item" }, "Reverse engineering + trainer tooling"),
                e("div", { className: "hero__panel-title" }, "Focus"),
                e("div", { className: "hero__panel-item" }, "Windows internals, exploit dev"),
                e("div", { className: "hero__panel-title" }, "Outcome"),
                e("div", { className: "hero__panel-item" }, "CTF wins + clean tooling"),
                e("div", { className: "hero__panel-title" }, "Tools"),
                e("div", { className: "hero__panel-item" }, "C++ · Cheat Engine · x64dbg · IDA")
            )
        )
    );
}

function Story() {
    return e(
        Section,
        { id: "story", eyebrow: "Story", title: "Chapters that shaped my work", className: "section--story" },
        e(
            "div",
            { className: "story-grid" },
            e("div", { className: "story-rail" }),
            e(
                "div",
                { className: "story-cards" },
                STORY_SCENES.map((scene, index) =>
                    e(
                        "article",
                        {
                            key: scene.step,
                            className: [
                                "story-card",
                                "reveal",
                                index % 2 === 0 ? "reveal--left" : "reveal--right",
                            ].join(" "),
                        },
                        e("div", { className: "story-step" }, scene.step),
                        e("h3", null, scene.title),
                        e("p", null, scene.body),
                        e(
                            "div",
                            { className: "story-tags" },
                            scene.tags.map((tag) => e("span", { key: tag, className: "tag" }, tag))
                        )
                    )
                )
            )
        )
    );
}

function CTFHighlights() {
    return e(
        Section,
        { id: "ctf", eyebrow: "CTF Highlights", title: "Wins that hit hard", className: "section--ctf" },
        e(
            "div",
            { className: "stats-grid" },
            CTF_WINS.map((win) =>
                e(
                    "div",
                    { key: win.label, className: "stat-card reveal" },
                    e("div", { className: "stat-value" }, win.value),
                    e("div", { className: "stat-label" }, win.label)
                )
            )
        ),
        e(
            "p",
            { className: "muted" },
            "I document exploits, build PoCs, and prefer tool-assisted workflows over ad-hoc scripts."
        )
    );
}

function GitHubRepos() {
    const [repos, setRepos] = useState([]);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        let active = true;
        fetch(GITHUB_API)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("GitHub fetch failed");
                }
                return res.json();
            })
            .then((data) => {
                if (!active) {
                    return;
                }
                const filtered = data.filter((repo) => {
                    if (repo.fork) {
                        return false;
                    }
                    const name = repo.name.toLowerCase();
                    if (name === "vwilk.github.io" || name === ".well-known" || name === "well-known") {
                        return false;
                    }
                    return true;
                });
                filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                setRepos(filtered.slice(0, 6));
                setStatus("ready");
                requestAnimationFrame(setupReveal);
            })
            .catch(() => {
                if (!active) {
                    return;
                }
                setStatus("error");
            });

        return () => {
            active = false;
        };
    }, []);

    let body = null;
    const featured = e(
        "article",
        { className: "repo-feature reveal" },
        e("h3", null, "vwilk.github.io"),
        e(
            "p",
            null,
            "A living launchpad for the subsites and experiments I am currently building and iterating on."
        ),
        e("span", { className: "chip" }, "Subsites")
    );

    if (status === "loading") {
        body = e(
            "div",
            { className: "repo-state", role: "status", "aria-live": "polite" },
            "Loading latest repositories..."
        );
    } else if (status === "error") {
        body = e(
            "div",
            { className: "repo-state", role: "status", "aria-live": "polite" },
            "Unable to load repos right now.",
            e(
                "a",
                { href: GITHUB_PROFILE, className: "repo-link", target: "_blank", rel: "noreferrer" },
                "Open GitHub profile"
            )
        );
    } else {
        body = e(
            "div",
            { className: "repo-grid" },
            repos.map((repo) =>
                e(
                    "article",
                    { key: repo.id, className: "repo-card reveal" },
                    e("div", { className: "repo-head" }, e("h3", null, repo.name)),
                    e("p", { className: "repo-desc" }, repo.description || "No description yet."),
                    e(
                        "div",
                        { className: "repo-meta" },
                        repo.language ? e("span", { className: "repo-meta-item" }, repo.language) : null,
                        e("span", { className: "repo-meta-item" }, `Stars ${repo.stargazers_count}`),
                        e("span", { className: "repo-meta-item" }, `Updated ${repo.updated_at.split("T")[0]}`)
                    ),
                    e(
                        "a",
                        { href: repo.html_url, className: "repo-link", target: "_blank", rel: "noreferrer" },
                        "View repo"
                    )
                )
            )
        );
    }

    return e(
        Section,
        { id: "github", eyebrow: "GitHub", title: "Live repos", className: "section--github" },
        e("div", { className: "repo-stack" }, featured, body)
    );
}

function Contact() {
    return e(
        Section,
        { id: "contact", eyebrow: "Contact", title: "Let’s build and break responsibly", className: "section--contact" },
            e(
                "div",
                { className: "contact" },
                e("span", { className: "contact__label" }, "Email"),
            e("span", { className: "contact__value" }, "vwilkdc@gmail.com"),
            e("span", { className: "contact__label" }, "GitHub"),
            e(
                "a",
                { href: GITHUB_PROFILE, target: "_blank", rel: "noreferrer", className: "contact__value" },
                "github.com/VWilk"
            ),
            e("span", { className: "contact__label" }, "PGP"),
            e(
                "a",
                {
                    href: "html/subsites/pgpWebsite/pgpWebsite.html",
                    target: "_blank",
                    rel: "noreferrer",
                    className: "contact__value",
                },
                "PGP Subsite"
            )
        )
    );
}

function SubsiteBar({ links }) {
    return e(
        "aside",
        { className: "subsite-bar" },
        e(
            "input",
            {
                id: "subsite-toggle",
                className: "subsite-bar__toggle",
                type: "checkbox",
                "aria-label": "Toggle subsites",
            }
        ),
        e(
            "label",
            { className: "subsite-bar__handle", htmlFor: "subsite-toggle", title: "Subsites" },
            e("span", { className: "subsite-bar__icon" }),
            e("span", { className: "subsite-bar__icon" }),
            e("span", { className: "subsite-bar__icon" })
        ),
        e(
            "div",
            { className: "subsite-bar__panel" },
            e("div", { className: "subsite-bar__title" }, "Subsites"),
            e(
                "div",
                { className: "subsite-bar__links" },
                links.map((link) =>
                    e(
                        "a",
                        {
                            key: link.href,
                            href: link.href,
                            target: link.external ? "_blank" : undefined,
                            rel: link.external ? "noreferrer" : undefined,
                            className: "subsite-bar__link",
                        },
                        link.label
                    )
                )
            )
        )
    );
}

function App() {
    return e(
        "div",
        { className: "app" },
        e(Navbar, { links: NAV_LINKS, subsites: SUBSITE_LINKS }),
        e("main", { className: "main" }, e(Hero), e(Story), e(CTFHighlights), e(GitHubRepos), e(Contact))
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(e(App));

let revealObserver;

function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    if (!revealObserver) {
        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("is-visible", entry.isIntersecting);
                });
            },
            { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
        );
    }

    items.forEach((el) => {
        if (el.dataset.revealBound) {
            return;
        }
        el.dataset.revealBound = "true";
        revealObserver.observe(el);
    });
}

requestAnimationFrame(setupReveal);
