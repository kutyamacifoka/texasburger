displaySideMenu() {
    // display side menu on scroll & no button press
    window.addEventListener("scroll", () => {
      const bannerContainerHeight =
        bannerContainer.getBoundingClientRect().height;
      const scrollHeight = scrollY > bannerContainerHeight;

      // if scrollHeight true && and side menu NOT locked with button
      if (scrollHeight && !sideMenu.classList.contains("locked")) {
        // set container's display
        sideMenu.style.display = "grid";
        sideMenuArrowContainer.style.display = "grid";

        // remove hide animation from containers
        sideMenu.classList.remove("animation-hide");
        sideMenuArrowContainer.classList.remove("animation-hide");

        // add show animation to containers
        sideMenu.classList.add("animation-show");
        sideMenuArrowContainer.classList.add("animation-show");

        // on animation end display remains
        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "grid";
          sideMenuArrowContainer.style.display = "grid";
        });
      }

      // if scrollHeight true && and side menu LOCKED with button
      if (scrollHeight && sideMenu.classList.contains("locked")) {
        // set container's display
        sideMenuArrowContainer.style.display = "grid";

        // remove animation
        sideMenuArrowContainer.classList.remove("animation-hide");

        // add animation
        sideMenuArrowContainer.classList.add("animation-show");

        // on animation end display remains
        sideMenu.addEventListener("animationend", () => {
          sideMenuArrowContainer.style.display = "grid";
        });
      }

      // if scrollHeight false (less than 850)
      if (!scrollHeight) {
        // remove animation
        sideMenu.classList.remove("animation-show");
        sideMenuArrowContainer.classList.remove("animation-show");

        // add animation
        sideMenu.classList.add("animation-hide");
        sideMenuArrowContainer.classList.add("animation-hide");

        // on animation end display remains
        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "none";
          sideMenuArrowContainer.style.display = "none";
        });
      }
    });

    // change how many products are displayed
    sideMenuIcon.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const slider = [...document.querySelectorAll(".slider")];

        if (e.target.classList.contains("fa-th")) {
          this.changeProductLayout(
            sliderContainer,
            slider,
            250,
            350,
            "grid",
            "column",
            "385px"
          );
        }

        if (e.target.classList.contains("fa-th-large")) {
          this.changeProductLayout(
            sliderContainer,
            slider,
            250,
            550,
            "grid",
            "column",
            "385px"
          );
        }

        if (e.target.classList.contains("fa-th-list")) {
          this.changeProductLayout(
            sliderContainer,
            slider,
            250,
            725,
            "flex",
            "row",
            "100%"
          );
        }
      });
    });

    // display or hide side menu on click
    sideMenuArrowContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("side-arrow")) {
        // toggle locked class
        sideMenu.classList.toggle("locked");
        e.currentTarget.classList.toggle("show-arrow");

        // if side menu is locked, change button HTML
        sideMenu.classList.contains("locked")
          ? (sideMenuArrowContainer.innerHTML = `<i class="fas fa-angle-double-right side-arrow"></i>`)
          : (sideMenuArrowContainer.innerHTML = `<i class="fas fa-angle-double-left side-arrow"></i>`);
      }

      if (sideMenu.classList.contains("locked")) {
        // remove animation
        sideMenu.classList.remove("animation-show");

        // add animation
        sideMenu.classList.add("animation-hide");

        // on animation end change display
        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "none";
        });
      }

      if (!sideMenu.classList.contains("locked")) {
        // set container's display
        sideMenu.style.display = "grid";

        // remove animation
        sideMenu.classList.remove("animation-hide");

        // add animation
        sideMenu.classList.add("animation-show");

        // on animation end change display
        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "grid";
        });
      }
    });
  }