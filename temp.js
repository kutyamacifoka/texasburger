test(bgImages) {
    const testBtn = document.querySelector(".test-btn");

    let drinks = bgImages.filter((item) => {
      let valami = item.itemClass[0];
      for (let i = 0; i < bgImages.length; i++) {
        if (valami[i] === "drink") {
          return item;
        }
      }
    });
    const testContainer = document.querySelector(".test-container");
    testBtn.addEventListener("click", () => {
      drinks = drinks
        .map((item) => {
          return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
        })
        .join("");

      testContainer.innerHTML = drinks;
    });
  }