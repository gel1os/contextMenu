(function () {
    // add event function
    var addEvent, removeEvent;
    if (document.addEventListener) {
        addEvent = function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        };
        removeEvent = function(elem, type, handler) {
            elem.removeEventListener(type, handler, false);
        };
    } else {
        addEvent = function(elem, type, handler) {
            elem.attachEvent("on" + type, handler);
        };
        removeEvent = function(elem, type, handler) {
            elem.detachEvent("on" + type, handler);
        };
    }

    // DOM ready function
    var onready = function(handler) {
        // window is loaded already - just run the handler
        if (document && document.readyState === "complete") return handler();

        // non-IE: DOMContentLoaded event
        if (window.addEventListener) window.addEventListener("DOMContentLoaded", handler, false);
    };

    // contextMenu constructor
    var ContextMenu = function(settings) {
        this.settings = settings;
    };

    // create Menu function
    ContextMenu.prototype.createMenu = function (e) {
        var mainItems = this.settings.menuItems,
            subMenuItems = this.settings.subMenus,
            itemsLength = mainItems.length,
            menuHeight = this.settings.heightOfMenu,
            menuWrapper = document.createElement('div'),
            item,
            subItem,
            subItemWrapper,
            matchedSubMenuArr = [],
            clickedField = e.target;

        // create wrapper for items
        menuWrapper.className = 'menuWrapper';
        menuWrapper.style.height = menuHeight + 'px';
        menuWrapper.style.top = e.offsetY + 'px';
        menuWrapper.style.left = e.offsetX + 'px';

        // generate items and subItems
        for (var i=0; i<mainItems.length; i++) {
            // create item
            item = document.createElement('div');
            item.className = 'item ' + mainItems[i].toLowerCase().replace(/\s/g, '');
            item.innerText = mainItems[i];
            item.style.height = Math.floor(100 / itemsLength) + "%";

            // check if item has subItems
            if (subMenuItems[mainItems[i]]) {
                // create wrapper for subItems
                    matchedSubMenuArr = subMenuItems[mainItems[i]];
                    subItemWrapper = document.createElement('div');
                    subItemWrapper.className = 'subItemWrapper';
                for (var j=0; j < matchedSubMenuArr.length; j++) {
                    // create subItem
                    subItem = document.createElement('div');
                    subItem.className = 'item subItem ' + matchedSubMenuArr[j].toLowerCase().replace(/\s/g, '');
                    subItem.innerText = matchedSubMenuArr[j];
                    subItem.style.height = Math.floor(100 / itemsLength) + "%";
                    subItemWrapper.appendChild(subItem);
                }
                item.appendChild(subItemWrapper);
                item.className += ' hasSubItem';
            }
            menuWrapper.appendChild(item);
            this.created = true;
        }

        clickedField.appendChild(menuWrapper);

        // set lineHeight for div.item
        var allItemsDivs = document.getElementsByClassName('item'),
            itemsHeight = getComputedStyle(allItemsDivs[0]).height;
        for (var j=0; j<allItemsDivs.length; j++) {
            allItemsDivs[j].style.lineHeight = itemsHeight;
        }
    };

    // showMenu function
    ContextMenu.prototype.showMenu = function (e) {
        var childrenOfTarget = e.target.children;
        for (var i=0; i<childrenOfTarget.length; i++) {
            if (childrenOfTarget[i].className === "menuWrapper hidden") {
                childrenOfTarget[i].style.top = e.offsetY + 'px';
                childrenOfTarget[i].style.left = e.offsetX + 'px';
                childrenOfTarget[i].className = childrenOfTarget[i].className.replace(' hidden', '');
                return false
            }
        }
    };

    // hideMenu function
    ContextMenu.prototype.hideMenu = function (e) {
        var childrenOfTarget = e.target.children;
        if (childrenOfTarget) {
            for (var i=0; i<childrenOfTarget.length; i++) {
                if (childrenOfTarget[i].className === "menuWrapper") {
                    childrenOfTarget[i].className = childrenOfTarget[i].className + ' hidden';
                }
            }
        }
    };

    // add handlers to menu items
    ContextMenu.prototype.addHandlers = function (e) {
        var childrenOfTarget = e.target.children,
            node = null;
        if (childrenOfTarget) {
            for (var i=0; i<childrenOfTarget.length; i++) {
                if (childrenOfTarget[i].className === "menuWrapper") {
                    node = childrenOfTarget[i];
                    break
                }
            }
        }

        addEvent(node.getElementsByClassName('reload')[0], 'click', function () {
            location.reload();
        });

        addEvent(node.getElementsByClassName('viewpagesource')[0], 'click', function () {
            window.open("view-source:" + window.location.href, '_blank');
            window.focus();
        });

    };

    onready(function () {

        var fields = document.getElementsByClassName('field');
        for (var i=0; i<fields.length; i++) {
            var menu;
            // add contextmenu event
            addEvent(fields[i], "contextmenu", function(e) {
                e.preventDefault();
                var childrenOfTarget = e.target.children;
                if (childrenOfTarget.length === 0) {
                    menu = new ContextMenu({
                        "menuItems": ['Reload', 'Save As', "Share", "View Page Source", 'Inspect Element'],
                        "subMenus": {
                            "Share": ["E-mail", "Facebook", 'Twitter', 'Whatsapp']
                        },
                        'subSubMenus': [
                            ['E-mail', ['Favourites', 'Contacts', "Mom"]]
                        ],
                        'heightOfMenu' : 150
                    });
                    menu.createMenu(e);
                    menu.addHandlers(e);
                } else {
                    menu.hideMenu(e);
                    menu.showMenu(e);
                }
            });

            // add click on field
            addEvent(fields[i], 'click', function (e) {
                if (menu) {
                    menu.hideMenu(e);
                }
            })
        }
    })
}());