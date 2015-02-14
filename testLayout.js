var testLayout = (function(){

    var settings = {
        'containerClass': 'js-test-container',
        'itemClass': 'js-test-item',
        'distanceDifferenceLimit': 2
    };
    var methods = {
        init: function() {
            if(!methods.testRequirements()) {
                return;
            }

            utils.bindReady(function(){
                utils.addEvent(
                    document.getElementById('run-test-btn'),
                    'click',
                    function() {
                        methods.run();
                    }
                );
            });
        },
        run: function() {
            utils.print('h1 Тесты запущены...');

            var container = document.getElementsByClassName(settings.containerClass);
            if(!methods._testContainerExist(container)){
                return;
            }
            container = container[0];

            var items = container.getElementsByClassName(settings.itemClass);
            if(methods._testItemsExist(items)) {
                for(var i=0, len=items.length; i < len; i++) {
                    utils.print('h2 Количество элементов в контейнере: ' + items.length);
                    methods._cloneTestInstanse(container);
                    methods._testContainerWidth(container);
                    methods._testItemsCount(items);
                    methods._testItemsSize(items);
                    methods._testItemsDistance(items, container);
                }
            }
        },
        _cloneTestInstanse: function(container) {
            var clone1 = container.parentNode.cloneNode(true);
            var clone2 = container.parentNode.cloneNode(true);

            // Add to end of body
            document.body.appendChild(clone1);


            // Add to print list
            var tmp = document.createElement('div');
            tmp.appendChild(clone2);
            utils.print(tmp.innerHTML);
        },
        testRequirements: function(){
            if(typeof(utils) === 'undefined') {
                console.log('Error: Модуль Utils не найден');
                return false;
            }
            return true;
        },
        _testItemsExist: function(items) {
            var message = 'Элементы в контейнере имеются';
            if(items.length !== 0) {
                utils.print(message, 'success');
                return true;
            }
            utils.print(message, 'fail');
            return false;
        },
        _testContainerExist: function(container) {
            var message = 'Контейнер существует';
            if(container.length !== 0) {
                utils.print(message, 'success');
                return true;
            }
            utils.print(message, 'fail');
            return false;
        },
        _testContainerWidth: function(container) {
            var parent = container.parentNode;
            var result = 'fail';

            var containerWidth = container.offsetWidth;

            var parentWidth = parent.offsetWidth;
            if(containerWidth === parentWidth) {
                result = 'success';
            }
            utils.print('Ширина контейнера равна ширине родителя', result);
        },
        _testItemsCount: function(items) {
            var result = 'fail';
            if(items.length <= 4) {
                result = 'success';
            }
            utils.print('Количество элементов внутри контейнера не более четырёх', result);
        },
        _testItemsSize: function(items) {
            var message = 'Элементы имеют одинаковые размеры';
            var width = items[0].offsetWidth;
            var height = items[0].offsetHeight;
            for(var i = 1, len = items.length; i < len; i++) {
                if(items[i].offsetWidth !== width || items[i].offsetHeight !== height) {
                    utils.print(message, 'fail');
                    return;
                }
            }
            utils.print(message, 'success');
        },
        _testItemsDistance: function(items, container) {
            var test = function(items, distance, maxDifference) {
                if(typeof(distance) === 'undefined') {
                    distance = null;
                }

                if(typeof(maxDifference) === 'undefined') {
                    maxDifference = 0;
                }

                var curDistance;
                var firstElOffsetLeft = items[0].offsetLeft;
                var prevElOffsetLeft = firstElOffsetLeft;
                var curDifference;

                for(var i = 1, len = items.length; i < len; i++) {
                    if(i === 1 && !distance) {
                        distance = items[1].offsetLeft - firstElOffsetLeft;
                    }

                    curDistance = items[i].offsetLeft - prevElOffsetLeft;
                    if(i > 1 && curDistance !== distance) {
                        curDifference = Math.abs(distance - curDistance);
                        if(curDifference > maxDifference) {
                            maxDifference = curDifference;
                        }
                    }

                    prevElOffsetLeft = items[i].offsetLeft;
                }

                //utils.print('Максимальная погрешность: ' + maxDifference + 'px');
                //utils.print('Допустимая погрешность: ' + settings.distanceDifferenceLimit + 'px');

                return {
                    result: testDifference(maxDifference),
                    distance: distance,
                    maxDifference: maxDifference
                }
            };

            var testDifference = function(maxDifference) {
                return maxDifference < settings.distanceDifferenceLimit;
            };

            var errorItemsCountMessage = 'Тест на расстояние между элементами не может быть выполнен. Для выполнения теста необходимо наличие хотя бы двух элементов';

            if(items.length < 2) {
                utils.print(errorItemsCountMessage, 'fail');
                return;
            }

            // Test before remove
            var resultBeforeRemove = test(items);
            var message = 'Расстояние одинаково до удаления последнего элемента. Погрешность: '
                + resultBeforeRemove.maxDifference + ' (лимит ' + settings.distanceDifferenceLimit + ')';

            if(resultBeforeRemove.result && testDifference(resultBeforeRemove.maxDifference)) {
                utils.print(message, 'success');
            } else {
                utils.print(message, 'fail');
            }
            var lastItem = items[items.length-1];
            lastItem.parentNode.removeChild(lastItem);


            // Test after remove
            items = container.getElementsByClassName(settings.itemClass);
            var resultAfterRemove;
            if(items.length > 1) {
                resultAfterRemove = test(items, resultBeforeRemove.distance, resultBeforeRemove.maxDifference);

                message = 'Расстояние одинаково после удаления последнего элемента. Погрешность: '
                + resultAfterRemove.maxDifference + ' (лимит ' + settings.distanceDifferenceLimit + ')';

                if(resultAfterRemove.result && testDifference(resultAfterRemove.maxDifference)) {
                    utils.print(message, 'success');
                } else {
                    utils.print(message, 'fail');
                }

                if(resultBeforeRemove.result && resultAfterRemove) {
                    utils.print('Расстояние между элементами одинаковое, даже при изменении количества элементов', 'success');
                }
            } else {
                utils.print(errorItemsCountMessage, 'fail');
            }

        }
    };

    methods.init();

    return {
        /*init: function() {
         return methods.init();
         }*/
    }
})();


