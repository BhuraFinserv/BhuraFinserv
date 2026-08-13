document.addEventListener("DOMContentLoaded", function () {

    /*
     * Detect whether the current page is inside /blogs/
     *
     * Root page:
     * index.html
     *
     * Blog page:
     * blogs/market-update.html
     */

    const currentPath = window.location.pathname;

    const isBlogPage =
        currentPath.includes("/blogs/");


    /*
     * Path to the website root
     */

    const rootPath = isBlogPage ? "../" : "./";


    /*
     * Load Footer
     */

    const footerContainer =
        document.getElementById("footer-component");


    if (footerContainer) {

        fetch(
            rootPath + "components/footer.html"
        )

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Footer could not be loaded."
                    );

                }

                return response.text();

            })

            .then(function (html) {

                footerContainer.innerHTML = html;


                /*
                 * Fix links that point to
                 * pages in the website root.
                 */

                const rootLinks =
                    footerContainer.querySelectorAll(
                        "[data-root-link]"
                    );


                rootLinks.forEach(function (link) {

                    const originalHref =
                        link.getAttribute("href");


                    if (
                        originalHref &&
                        !originalHref.startsWith("http") &&
                        !originalHref.startsWith("#")
                    ) {

                        link.setAttribute(
                            "href",
                            rootPath + originalHref
                        );

                    }

                });

            })

            .catch(function (error) {

                console.error(
                    "Footer loading error:",
                    error
                );

            });

    }

});

document.addEventListener("DOMContentLoaded", function () {

    /*
    =====================================================
    DETECT CURRENT PAGE
    =====================================================
    */

    const currentPath = window.location.pathname;

    const isBlogPage = currentPath.includes("/blogs/");

    /*
    Root of website

    Root page:
    ./index.html

    Blog page:
    ../index.html
    */

    const rootPath = isBlogPage ? "../" : "./";


    /*
    =====================================================
    HEADER
    =====================================================
    */

    const headerContainer =
        document.getElementById("header-component");


    if (headerContainer) {

        fetch(rootPath + "components/header.html")

            .then(function (response) {

                if (!response.ok) {
                    throw new Error(
                        "Header could not be loaded."
                    );
                }

                return response.text();

            })

            .then(function (html) {

                headerContainer.innerHTML = html;


                /*
                -----------------------------------------
                Fix logo path
                -----------------------------------------
                */

                const rootAssets =
                    headerContainer.querySelectorAll(
                        "[data-root-asset]"
                    );


                rootAssets.forEach(function (element) {

                    const src =
                        element.getAttribute("src");

                    if (
                        src &&
                        !src.startsWith("http") &&
                        !src.startsWith("/")
                    ) {

                        element.setAttribute(
                            "src",
                            rootPath + src
                        );

                    }

                });


                /*
                -----------------------------------------
                Home section links
                -----------------------------------------
                */

                const homeSectionLinks =
                    headerContainer.querySelectorAll(
                        "[data-home-section]"
                    );


                homeSectionLinks.forEach(function (link) {

                    const section =
                        link.getAttribute(
                            "data-home-section"
                        );

                    link.setAttribute(
                        "href",
                        rootPath +
                        "index.html#" +
                        section
                    );

                });


                /*
                -----------------------------------------
                Home logo link
                -----------------------------------------
                */

                const homeLink =
                    headerContainer.querySelector(
                        "[data-home-link]"
                    );


                if (homeLink) {

                    homeLink.setAttribute(
                        "href",
                        rootPath + "index.html"
                    );

                }


                /*
                -----------------------------------------
                MOBILE MENU
                -----------------------------------------
                */

                setupMobileMenu(headerContainer);

            })

            .catch(function (error) {

                console.error(
                    "Header loading error:",
                    error
                );

            });

    }


    /*
    =====================================================
    FOOTER
    =====================================================
    */

    const footerContainer =
        document.getElementById("footer-component");


    if (footerContainer) {

        fetch(rootPath + "components/footer.html")

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Footer could not be loaded."
                    );

                }

                return response.text();

            })

            .then(function (html) {

                footerContainer.innerHTML = html;


                /*
                -----------------------------------------
                Fix footer root links
                -----------------------------------------
                */

                const rootLinks =
                    footerContainer.querySelectorAll(
                        "[data-root-link]"
                    );


                rootLinks.forEach(function (link) {

                    const originalHref =
                        link.getAttribute("href");


                    if (
                        originalHref &&
                        !originalHref.startsWith("http") &&
                        !originalHref.startsWith("#")
                    ) {

                        link.setAttribute(
                            "href",
                            rootPath + originalHref
                        );

                    }

                });

            })

            .catch(function (error) {

                console.error(
                    "Footer loading error:",
                    error
                );

            });

    }

});


/*
=========================================================
MOBILE MENU FUNCTION
=========================================================
*/

function setupMobileMenu(container) {

    const mobileMenuBtn =
        container.querySelector(
            "#mobile-menu-btn"
        );


    const mobileMenu =
        container.querySelector(
            "#mobile-menu"
        );


    const mobileMenuClose =
        container.querySelector(
            "#mobile-menu-close"
        );


    const mobileLinks =
        container.querySelectorAll(
            ".mobile-link"
        );


    if (
        !mobileMenuBtn ||
        !mobileMenu ||
        !mobileMenuClose
    ) {
        return;
    }


    /*
    -----------------------------------------
    Open menu
    -----------------------------------------
    */

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            mobileMenu.classList.remove(
                "translate-x-full"
            );

            document.body.style.overflow =
                "hidden";

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

        }
    );


    /*
    -----------------------------------------
    Close menu
    -----------------------------------------
    */

    function closeMobileMenu() {

        mobileMenu.classList.add(
            "translate-x-full"
        );

        document.body.style.overflow = "";

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    mobileMenuClose.addEventListener(
        "click",
        closeMobileMenu
    );


    /*
    -----------------------------------------
    Close when clicking a link
    -----------------------------------------
    */

    mobileLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


    /*
    -----------------------------------------
    ESC key
    -----------------------------------------
    */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                !mobileMenu.classList.contains(
                    "translate-x-full"
                )
            ) {

                closeMobileMenu();

            }

        }
    );

}