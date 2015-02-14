var utils = (function(){
    var settings = {
        debug: true,
        printContainerID: 'print-container',
        printContainerClass: 'print-container',
        printItemClass: 'print-item',
        successClass: 'success',
        failClass: 'fail'
    };

    var methods = {
        bindReady: function bindReady(handler){
            // http://javascript.ru/tutorial/events/ondomcontentloaded
            var called = false;

            function ready() {
                if (called) {
                    return;
                }
                called = true;
                handler()
            }
             /* DOM Ready
            if(document.addEventListener) {
                document.addEventListener( "DOMContentLoaded", function(){
                    ready()
                }, false )
            } else if (document.attachEvent ) {
                if ( document.documentElement.doScroll && window == window.top ) {
                    function tryScroll(){
                        if (called) {
                            return
                        }
                        if (!document.body) {
                            return;
                        }
                        try {
                            document.documentElement.doScroll("left");
                            ready()
                        } catch(e) {
                            setTimeout(tryScroll, 0)
                        }
                    }
                    tryScroll()
                }
                document.attachEvent("onreadystatechange", function(){
                    if (document.readyState === "complete" ) {
                        ready();
                    }
                })
            }*/

            if (window.addEventListener) {
                window.addEventListener('load', ready, false)
            } else if (window.attachEvent) {
                window.attachEvent('onload', ready)
            } else {
                window.onload=ready
            }
        },
        log: function(message) {
            if(settings.debug
                && typeof(console) !== 'undefined'
                && typeof(console.log) !== 'undefined') {
                console.log(message);
            }
        },
        print: function(htmlString, messageType) {
            if(typeof(messageType) === 'undefined') {
                // "default", "success", "fail"
                messageType = 'default';
            }

            var messageItem;
            var printContainer = document.getElementById(settings.printContainerID);
            if(!printContainer) {
                printContainer = document.createElement('ul');
                printContainer.id = settings.printContainerID; // for bindings
                printContainer.className = settings.printContainerClass; // for styling
                document.body.appendChild(printContainer);
            }

            if(htmlString.substring(0, 2) === 'b ') {
                htmlString = '<strong>' + htmlString.substring(2, htmlString.length) + '</strong>';
            }

            if(htmlString.substring(0, 3) === 'h2 ') {
                htmlString = '<h2>' + htmlString.substring(3, htmlString.length) + '</h2>';
            }

            if(htmlString.substring(0, 3) === 'h1 ') {
                htmlString = '<h1>' + htmlString.substring(3, htmlString.length) + '</h1>';
            }

            messageItem = document.createElement('li');
            messageItem.innerHTML = htmlString;

            if(messageType === 'success') {
                messageItem.className = settings.successClass + ' ';
            }
            if(messageType === 'fail') {
                messageItem.className = settings.failClass + ' ';
            }
            messageItem.className += settings.printItemClass;

            printContainer.appendChild(messageItem);
        },
        addEvent: function(element, evt, func){
            if(element.attachEvent) {
                return element.attachEvent('on'+evt, func);
            } else {
                return element.addEventListener(evt, func, false);
            }
        }
    };
    
    return {
        bindReady: function(handler) {
            return methods.bindReady(handler);
        },
        addEvent: function(element, evt, func) {
            return methods.addEvent(element, evt, func);
        },
        log: function(message) {
            return methods.log(message);
        },
        print: function(message, messageType) {
            return methods.print(message, messageType);
        }
    }
})();