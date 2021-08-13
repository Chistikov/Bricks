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

  this.itemsArr = document.querySelectorAll(`${this.config.rootSelector} > *`);
  this.deleteChildrenFromParent(this.rootElement);
  this.pasteColumnsAndImages.call(this);

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
  let ap = this.getAppropriateWidth.call(this);

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

  function onResizeWindowHandler() {
    this.deleteChildrenFromParent(this.rootElement);
    this.pasteColumnsAndImages.call(this);
  }
};
