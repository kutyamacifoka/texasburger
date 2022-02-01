bgImages.forEach((item) => {
  const title = item.dataset;
  menuBtns.forEach((btn) => {
    btn.addEventListener("mouseover", (e) => {
      // get ID
      const id = e.target.dataset.id;

      if (title === id) {
        banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
        bannerTitle.innerHTML = `${item.title}`;
        bannerSpan.style.opacity = 0;
      }

      if (id === "osszes") {
        document.querySelector(
          ".banner"
        ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero.jpg) center/cover no-repeat`;
        bannerTitle.innerHTML = `Texas <span>Burger</span>`;
        bannerSpan.style.opacity = 1;
      }
    });

    categoryBtnContainer.addEventListener("mouseleave", (e) => {
      // get ID
      const id = btn.dataset.id;

      if (btn.classList.contains("active-btn") && title === id) {
        banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
        bannerTitle.innerHTML = `${item.title}`;
        bannerSpan.style.opacity = 0;
      }

      if (btn.classList.contains("active-btn") && id === "osszes") {
        document.querySelector(
          ".banner"
        ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero.jpg) center/cover no-repeat`;
        bannerTitle.innerHTML = `Texas <span>Burger</span>`;
        bannerSpan.style.opacity = 1;
      }
    });
  });
});
