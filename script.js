function MSRY(config) {
  let _this = this;

  this.init = function () {
    this.config = {
      rootSelector: '#MSRY',
      settings: {
        columnsCount: 1,
      },
      onScreenWidth: {}
    };

    // todo: rewrite appending options
    Object.assign(this.config, config);
    console.log(this.config);

    this.rootElement = document.querySelector(this.config.rootSelector);
    if (!this.rootElement) {
      throw new Error('Wrong selector. Element not found.')
    }

    this.imagesArr = document.querySelectorAll(`${this.config.rootSelector} > img`);
    this.deleteChildrenFromParent(this.rootElement);

    window.addEventListener('resize', onResizeWindowHandler.bind(this));
    pasteColumnsAndImages.call(this);

    console.log(this.imagesArr)

    function onResizeWindowHandler() {
      this.deleteChildrenFromParent(this.rootElement);
      pasteColumnsAndImages.call(this);
    }

    function pasteColumnsAndImages() {
      let columnsCount;
      let ap = getAppropriateWidth();

      // counting containers
      if (ap === 'default') {
        columnsCount = this.config.settings.columnsCount;
      } else {
        columnsCount = this.config.onScreenWidth[ap]?.columnsCount || this.config.settings.columnsCount;
      }

      console.log(ap, columnsCount)

      // creating containers
      for (let i = 0; i < columnsCount; i++) {
        let wrapper = document.createElement('div');
        wrapper.classList.add('msry_wrapper__imgContainer');
        let space = `- ${(columnsCount - 1) * 10}px)`;
        wrapper.style.width = `calc((100% ${columnsCount > 1 ? space : ""} / ${columnsCount})`
        this.rootElement.appendChild(wrapper);
      }

      // pasting images into containers
      // let containerWithMinHeight = null;
      let pos = 0;
      Array.from(this.imagesArr).forEach((image, index) => {

        // this.rootElement.children[index % this.imagesArr.length].appendChild(image)
        this.rootElement.children[pos].appendChild(image);

        pos++;
        if (pos === this.rootElement.children.length) {
          pos = 0;
        }
      });
    }

    function getAppropriateWidth() {
      let windowWidth = window.innerWidth;
      let widthArr = Object.keys(config.onScreenWidth).map(width => Number(width)).sort((a, b) => {
        if (a < b) {
          return 1;
        } else {
          return -1;
        }
      });

      let appropriateWidth;
      for (let i = 0; i < widthArr.length; i++) {
        if (windowWidth > widthArr[0]) {
          appropriateWidth = 'default';
        } else if (windowWidth <= widthArr[i]) {
          appropriateWidth = widthArr[i];
        }
      }

      return appropriateWidth;
    }
  };

  this.deleteChildrenFromParent = function (parentElement) {
    parentElement.innerHTML = "";
  }

  this.init();
}