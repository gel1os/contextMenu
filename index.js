(function() {
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

    ContextMenu.prototype.createMenu = function(e, structure) {
        var itemHeight = this.settings.heightOfItem,
            wrapper = document.createElement('div'),
            menuItemNode;
        wrapper.className = 'menuWrapper';
        wrapper.style.top = e.offsetY + 'px';
        wrapper.style.left = e.offsetX + 'px';

        for (var i = 0; i < structure.length; i += 1) {
            menuItemNode = document.createElement('div');
            menuItemNode.innerText = structure[i].title;
            menuItemNode.className = 'item';
            menuItemNode.style.height = itemHeight + "px";
            menuItemNode.style.lineHeight = itemHeight + "px";

            if (structure[i].submenu) {
                menuItemNode.className += ' hasSubmenu';
                menuItemNode.appendChild(this.createMenu(e, structure[i].submenu));
            } else {
                menuItemNode.addEventListener('click', structure[i].handler, false);
            }
            wrapper.appendChild(menuItemNode);
        }
        return wrapper;
    };

    // showMenu function
    ContextMenu.prototype.showMenu = function(e) {
        var childrenOfTarget = e.target.children;
        for (var i = 0; i < childrenOfTarget.length; i++) {
            if (childrenOfTarget[i].className === "menuWrapper") {
                childrenOfTarget[i].style.top = e.offsetY + 'px';
                childrenOfTarget[i].style.left = e.offsetX + 'px';
                childrenOfTarget[i].style.opacity = 1;
                childrenOfTarget[i].style.visibility = 'visible';
                return false
            }
        }
    };

    // hideMenu function
    ContextMenu.prototype.hideMenu = function(e) {
        var childrenOfTarget = e.target.children;
        if (childrenOfTarget) {
            for (var i = 0; i < childrenOfTarget.length; i++) {
                if (childrenOfTarget[i].className === "menuWrapper") {
                    childrenOfTarget[i].style.opacity = 0;
                    childrenOfTarget[i].style.visibility = 'hidden';
                }
            }
        }
    };

    onready(function() {
        var fields = document.getElementsByClassName('field');
        for (var i = 0; i < fields.length; i++) {
            var menu;
            // add contextmenu event
            addEvent(fields[i], "contextmenu", function(e) {
                e.preventDefault();
                var childrenOfTarget = e.target.children;
                if (childrenOfTarget.length === 0) {
                    menu = new ContextMenu({
                        "menuItems": [{
                            title: 'Reload',
                            handler: function() {
                                location.reload();
                            }
                        }, {
                            title: 'Save As',
                            handler: function() {
                                console.log('edit content')
                            }
                        }, {
                            title: 'Share',
                            submenu: [{
                                title: 'Facebook',
                                handler: function() {
                                    console.log('skyped')
                                }
                            }, {
                                title: 'Twitter',
                                handler: function() {}
                            },

                                {
                                    title: 'E-mail',
                                    submenu: [{
                                        title: "Favourites"
                                    }, {
                                        title: "Contacts"
                                    }, {
                                        title: "Mom"
                                    }]
                                }
                            ]
                        }, {
                            title: 'View Page Source',
                            handler: function() {
                                window.open("view-source:" + window.location.href, '_blank');
                                window.focus();
                            }
                        }],
                        'heightOfMenu': 150,
                        'heightOfItem': 35
                    });
                    // append menu to target
                    e.target.appendChild(menu.createMenu(e, menu.settings.menuItems));

                } else {
                    menu.hideMenu(e);
                    menu.showMenu(e);
                }
            });

            // add click on field
            addEvent(fields[i], 'click', function(e) {
                if (menu) {
                    menu.hideMenu(e);
                }
            })
        }
    })
}());