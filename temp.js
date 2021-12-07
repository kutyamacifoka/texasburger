// get foods
if (id === "food") {
  let foods = bgImages.filter((item) => {
    let itemClass = item.itemClass[0];
    for (let i = 0; i < bgImages.length; i++) {
      if (itemClass[i] === "food") {
        return item;
      }
    }
  });
  foods = foods
    .map((item) => {
      return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
    })
    .join("");

  menuBtnContainer.innerHTML = foods;
}

// get drinks
if (id === "drink") {
  let drinks = bgImages.filter((item) => {
    let itemClass = item.itemClass[0];
    for (let i = 0; i < bgImages.length; i++) {
      if (itemClass[i] === "drink") {
        return item;
      }
    }
  });
  drinks = drinks
    .map((item) => {
      return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
    })
    .join("");

  menuBtnContainer.innerHTML = drinks;
}

// get other
if (id === "other") {
  let others = bgImages.filter((item) => {
    let itemClass = item.itemClass[0];
    for (let i = 0; i < bgImages.length; i++) {
      if (itemClass[i] === "other") {
        return item;
      }
    }
  });
  others = others
    .map((item) => {
      return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
    })
    .join("");

  menuBtnContainer.innerHTML = others;
}

// get all items
if (id === "összes" && !media.matches) {
  let menuBtns = [...new Set(bgImages.map((item) => item.title))];

  menuBtns = menuBtns
    .map((item) => {
      return `<button class="btn menu-btn" data-id="${item}">${item}`;
    })
    .join("");
  menuBtnContainer.innerHTML = menuBtns;
}
