debugger;
function Bricks(config) {
  let _this = this;
  window.Bricks = this;

  this.init(config);
}

Bricks.prototype.init = function (config) {
  this.config = {
    rootSelector: "#bricks",
    settings: {
      columnsCount: 1,
      prettyEntry: {
        // TODO: added transition to item
        delay: 50,
        speed: 250,
        moveDistance: 100,
      },
    },
    onScreenWidth: {},
  };

  // TODO: rewrite appending options
  Object.assign(this.config, config);
  console.log(this.config);

  this.rootElement = document.querySelector(this.config.rootSelector);
  if (!this.rootElement) {
    throw new Error("Wrong selector. Element not found.");
  }

  // fetching items and adding class to each item
  this.itemsArr = document.querySelectorAll(`${this.config.rootSelector} > *`);
  if (this.prettyEntryIsEnable()) {
    Array.from(this.itemsArr).forEach((item) => {
      item.classList.add("bricks_wrapper__itemsIsHidden");

      let moveDistance = this.config.settings.prettyEntry?.moveDistance || 0;
      item.style.top = moveDistance + "px";
    });
  }

  this.deleteChildrenFromParent(this.rootElement);
  this.pasteColumnsAndImages();
  this.showItemsByCondition();

  this.addHandlers();
};

Bricks.prototype.getAppropriateWidth = function () {
  let windowWidth = window.innerWidth;
  let widthArr = Object.keys(this.config.onScreenWidth)
    .map((width) => Number(width))
    .sort((a, b) => {
      if (a < b) {
        return 1;
      } else {
        return -1;
      }
    });

  let appropriateWidth;
  for (let i = 0; i < widthArr.length; i++) {
    if (windowWidth > widthArr[0]) {
      appropriateWidth = "default";
    } else if (windowWidth <= widthArr[i]) {
      appropriateWidth = widthArr[i];
    }
  }

  return appropriateWidth;
};

Bricks.prototype.deleteChildrenFromParent = function (parentElement) {
  parentElement.innerHTML = "";
};

Bricks.prototype.pasteColumnsAndImages = function () {
  let columnsCount;
  let ap = this.getAppropriateWidth();

  // counting containers
  if (ap === "default") {
    columnsCount = this.config.settings.columnsCount;
  } else {
    columnsCount = this.config.onScreenWidth[ap]?.columnsCount || this.config.settings.columnsCount;
  }

  // creating containers
  for (let i = 0; i < columnsCount; i++) {
    let wrapper = document.createElement("div");
    wrapper.classList.add("bricks_wrapper__itemsContainer");
    let space = `- ${(columnsCount - 1) * 10}px)`;
    wrapper.style.width = `calc((100% ${columnsCount > 1 ? space : ""} / ${columnsCount})`;
    this.rootElement.appendChild(wrapper);
  }

  // pasting images into containers
  Array.from(this.itemsArr).forEach((image, index) => {
    let containerWithMinHeight = null;

    for (let container of this.rootElement.children) {
      if (container.children.length === 0) {
        containerWithMinHeight = container;
        break;
      } else {
        let minContainerHeight = Infinity;

        Array.from(this.rootElement.children).forEach((item) => {
          if (item.offsetHeight < minContainerHeight) {
            minContainerHeight = item.offsetHeight;
            containerWithMinHeight = item;
          }
        });
      }
    }

    containerWithMinHeight.appendChild(image);
  });
};

Bricks.prototype.addHandlers = function () {
  window.addEventListener("resize", onResizeWindowHandler.bind(this));
  if (this.prettyEntryIsEnable()) {
    window.addEventListener("load", this.showItemsByCondition.bind(this));
    window.addEventListener("scroll", this.showItemsByCondition.bind(this));
  }

  function onResizeWindowHandler() {
    this.deleteChildrenFromParent(this.rootElement);
    this.pasteColumnsAndImages();
  }
};

Bricks.prototype.prettyEntryIsEnable = function () {
  return !!Object.keys(this.config.settings.prettyEntry).length;
};

Bricks.prototype.showItemsByCondition = function () {
  Array.from(this.itemsArr).forEach((item) => {
    if (
      document.documentElement.scrollTop + document.documentElement.clientHeight >
      document.documentElement.scrollTop +
        item.getBoundingClientRect().top -
        this.config.settings.prettyEntry.moveDistance +
        item.getBoundingClientRect().height
    ) {
      item.classList.remove("bricks_wrapper__itemsIsHidden");
      item.style.top = 0 + "px";
    }
  });
};
