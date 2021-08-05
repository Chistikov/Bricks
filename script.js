function MSRY(config) {
  this.init = function () {
    this.rootElement = document.querySelector(config.rootSelector);
    this.images = document.querySelectorAll(`${config.rootSelector} > img`);
    this.deleteChildrenFromParent(this.rootElement);

    console.log(this.images)

    function onResizeWindowHandler() {
      console.log(getAppropriateWidth());
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
          appropriateWidth = widthArr[0];
        } else if (windowWidth <= widthArr[i]) {
          appropriateWidth = widthArr[i];
        }
      }

      return appropriateWidth;
    }

    window.addEventListener('resize', onResizeWindowHandler.bind(this))
  }

  this.deleteChildrenFromParent = function (parentElement) {
    parentElement.innerHTML = "";
  }

  this.init();
}

let msry = new MSRY({
  rootSelector: '#MSRY',
  defaultSettings: {
    'columnsCount': 3,

  },
  onScreenWidth: {'1000': {'columnsCount': 3}, 800: {}, 801: {}, 300: {}, 200: {}}
});