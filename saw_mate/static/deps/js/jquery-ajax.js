// Функция для инициализации слайдера
// function initSwiper() {
//     // Находим все блоки .tranding-slider на странице
//     var allSliders = document.querySelectorAll('.tranding-slider');
//     // Проходимся по каждому блоку .tranding-slider
//     allSliders.forEach(function (sliderElement) {
//         // Проверяем, есть ли слайды в текущем блоке
//         var sliderItemsExist = sliderElement.querySelectorAll('.swiper-slide').length > 0;
//         // Если есть слайды, инициализируем слайдер
//         if (sliderItemsExist) {
//             var TrandingSlider = new Swiper(sliderElement, {
//                 effect: 'coverflow',
//                 grabCursor: true,
//                 centeredSlides: true,
//                 loop: true,
//                 slidesPerView: 'auto',
//                 coverflowEffect: {
//                     rotate: 0,
//                     stretch: 0,
//                     depth: 100,
//                     modifier: 2.5,
//                 },
//                 pagination: {
//                     el: '.swiper-pagination',
//                     clickable: true,
//                 },
//                 navigation: {
//                     nextEl: '.swiper-button-next',
//                     prevEl: '.swiper-button-prev',
//                 }
//             });
//         }
//     });
// }

// Обработчик события при раскрытии аккордеона
// $(document).on('show.bs.collapse', '.accordion-collapse', function () {
//     //аккордеон наборов карт
//     var setId = $(this).data('set-id');
//     if (setId !== undefined) {
//         console.log("Значение data-set-id:", setId);
//         globalSetId = setId;
//         localStorage.setItem('activeAccordion', setId);
//     }
//     //аккордеон категорий колоды карт пользователя
//     var catId = $(this).data('category-id');
//     if (catId !== undefined) {
//         console.log("Значение data-cat-id:", catId);
//         globalCatId = catId; // Присваиваем значение setId глобальной переменной globalSetId
//         localStorage.setItem('activeCatIdAccordion', catId); // Сохраняем в локальное хранилище id категории колоды
//     }
// });
// // Проверяем, есть ли сохраненный активный аккордеон в Local Storage при загрузке страницы
// $(document).ready(function() {
//     //проверяем сохраненный аккордеон наборов карт
//     var activeAccordion = localStorage.getItem('activeAccordion');
//     if (activeAccordion !== null) {
//         // Раскрываем аккордеон с сохраненным ID
//         $('#collapse' + activeAccordion).collapse('show');
//     }
//     //проверяем сохраненный аккордеон категории колоды карт
//     var activeCatIdAccordion = localStorage.getItem('activeCatIdAccordion');
//     if (activeCatIdAccordion !== null) {
//         // Раскрываем аккордеон с сохраненным ID
//         $('#collapse' + activeCatIdAccordion).collapse('show');
//     }
// });
// Проверяем количество элементов в списке и меняем его стиль
$(document).ready(function(){
    //специальный стиль когда мало элементов в наборе карт
    var itemCount = $(".action_card_list").children().length;
    if (itemCount < 3) {
        $(".action_card_list").addClass("simple_card_list");
    }
    //специальный стиль когда мало элементов в колоде карт
    // $(".carddeck_card_list").each(function() {
    //     var itemCarddeckCount = $(this).data("item-count");
    //     console.log("Количество элементов в списке:", itemCount);
    //     if (itemCarddeckCount < 2) {
    //         $(this).addClass("simple_carddeck_list");
    //     } else {
    //         $(this).removeClass("simple_carddeck_list");
    //     }
    // });
});

function checkCarddeckCount() {
    $(".carddeck_card_list").each(function() {
        var itemCarddeckCount = $(this).find(".carddeck_list_item").length;
        if (itemCarddeckCount < 2) {
            $(this).addClass("simple_carddeck_list");
        } else {
            $(this).removeClass("simple_carddeck_list");
        }
    });
}
// Когда html документ готов (прорисован)
$(document).ready(function () {
    // берем в переменную элемент разметки с id jq-notification для оповещений от ajax
    var successMessage = $("#jq-notification");
    // Инициализация слайдера после загрузки DOM
    //initSwiper();
    //переменная для хранения раскрытой категории колоды карт - скорее всего не нужен, убрать в будущем
    //var globalCatId;
    // Переменная для передачи id набора карт для обработки переноса карточек
    var globalSetId; // Объявляем глобальную переменную globalSetId
    // Получаем все раскрытые элементы с классом .accordion-collapse набора карт
    // $('.accordion-collapse.show').each(function() {
    //     var setId = $(this).data('set-id'); // Получаем значение data-set-id текущего раскрытого набора карт
    //     if (setId !== undefined) {
    //         console.log("Значение data-set-id:", setId);
    //         globalSetId = setId; // Присваиваем значение setId глобальной переменной globalSetId
    //     }
    //     var catId = $(this).data('category-id');
    //     if (catId !== undefined) {
    //         console.log("Значение data-cat-id:", catId);
    //         globalCatId = catId; // Присваиваем значение setId глобальной переменной globalSetId
    //     }
    // });

    // Ловим собыитие клика по кнопке добавить в корзину
    $(document).on("click", ".add-to-cart", function (e) {
        // Блокируем его базовое действие, ловим событие и все что находится внутри тега
        e.preventDefault();
        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var cardsInCartCount = $("#cards-in-cart-count");
        var cartCount = parseInt(cardsInCartCount.text() || 0);
        // Получаем id товара из атрибута data-product-id
        var product_id = $(this).data("product-id");
        // Из атрибута href берем ссылку на контроллер django
        var add_to_cart_url = $(this).attr("href");
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({
            type: "POST",
            url: add_to_cart_url,
            data: {
                product_id: product_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);
                // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                cartCount++;
                cardsInCartCount.text(cartCount);
                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);
            },
            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });

    // Ловим событие клика по кнопке для редактирования набора карт для игры
    $(document).on("click", ".cardset_change", function (e) {
        // Блокируем его базовое действие, ловим событие и все что находится внутри тега
        e.preventDefault();
        // Из атрибута href берем ссылку на контроллер django
        var change_cardset_url = $(this).data("url");
        var cardset_id = $(this).data("cardset-id");
        $.ajax({
            type: "POST",
            url: change_cardset_url,
            data: {
                cardset_id: cardset_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                var successMessage = $("<div>").html(data.message).fadeIn(400);
                $("body").append(successMessage);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400, function() {
                        successMessage.remove();
                    });
                }, 7000);
                // Меняем содержимое профиля пользователя на ответ от django (новый отрисованный фрагмент разметки)
                // var cardsetItemsContainer = $("#cardset-items-container");
                // cardsetItemsContainer.html(data.cardset_items_html);
                $("#cardset-items-container").html(data.cardset_items_html);
            },
            error: function (data) {
                console.log("Ошибка при изменении набора карт");
            },
        });
    });

    // Ловим событие клика по кнопке для создания набора карт для игры
    $(document).on("click", ".cardset_create", function (e) {
        // Блокируем его базовое действие, ловим событие и все что находится внутри тега
        e.preventDefault();
        // Из атрибута href берем ссылку на контроллер django
        var create_cardset_url = $(this).data("url");
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({
            type: "POST",
            url: create_cardset_url,
            data: {
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                var successMessage = $("<div>").html(data.message).fadeIn(400);
                $("body").append(successMessage);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400, function() {
                        successMessage.remove();
                    });
                }, 7000);
                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cardsetItemsContainer = $("#cardset-items-container");
                cardsetItemsContainer.html(data.cardset_items_html);
            },
            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });
    // Ловим собыитие клика по кнопке добавить карту в колоду
    $(document).on("click", ".add-to-carddeck", function (e) {
        // Блокируем его базовое действие, ловим событие и все что находится внутри тега
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var cardsInCarddeckCount = $("#cards-in-carddeck-count");
        var carddeckCount = parseInt(cardsInCarddeckCount.text() || 0);

        // Получаем id товара из атрибута data-product-id
        var product_id = $(this).data("product-id");

        // Из атрибута href берем ссылку на контроллер django
        var add_to_carddeck_url = $(this).attr("href");

        // делаем post запрос через ajax не перезагружая страницу которую обработает представление
        $.ajax({
            type: "POST",
            url: add_to_carddeck_url,
            data: {
                product_id: product_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                carddeckCount++;
                cardsInCarddeckCount.text(carddeckCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var carddeckItemsContainer = $("#carddeck-items-container");
                carddeckItemsContainer.html(data.carddeck_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в колоду");
            },
        });
    });

    // Ловим собыитие клика по кнопке удалить товар из корзины
    $(document).on("click", ".remove-from-cart", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var cardsInCartCount = $("#cards-in-cart-count");
        var cartCount = parseInt(cardsInCartCount.text() || 0);

        // Получаем id корзины из атрибута data-cart-id
        var cart_id = $(this).data("cart-id");
        // Из атрибута href берем ссылку на контроллер django
        var remove_from_cart = $(this).attr("href");
    
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_from_cart,
            data: {
                cart_id: cart_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество товаров в корзине (отрисовка)
                cartCount -= data.quantity_deleted;
                cardsInCartCount.text(cartCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });

    // Ловим собыитие клика по кнопке удалить карту из колоды
    $(document).on("click", ".remove-from-carddeck", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение cardsInCarddeckCount
        var cardsInCarddeckCount = $("#cards-in-carddeck-count");
        var carddeckCount = parseInt(cardsInCarddeckCount.text() || 0);

        // Получаем id корзины из атрибута data-cart-id
        var carddeck_id = $(this).data("carddeck-id");
        // Из атрибута href берем ссылку на контроллер django
        var remove_from_carddeck = $(this).attr("href");
    
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_from_carddeck,
            data: {
                carddeck_id: carddeck_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество товаров в корзине (отрисовка)
                carddeckCount -= data.quantity_deleted;
                cardsInCarddeckCount.text(carddeckCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var carddeckItemsContainer = $("#carddeck-items-container");
                carddeckItemsContainer.html(data.carddeck_items_html);
                initSwiper();

            },

            error: function (data) {
                console.log("Ошибка при добавлении карты в колоду");
            },
        });
    });

    // Ловим собыитие клика по кнопке перенести карту из колоды в набор
    $(document).on("click", ".add-to-cardset", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();
        // Получаем id набора карт и id карты из атрибута data-cart-id
        // Используем значение globalSetId
        var cardset_id = globalSetId;
        // Если cardset_id равно None, обновляем globalSetId
        if (cardset_id === null || cardset_id === undefined) {
            var activeAccordion = localStorage.getItem('activeAccordion');
            if (activeAccordion !== null) {
                globalSetId = activeAccordion;
            } else {
                // Если аккордеон не сохранен в Local Storage, можно взять ID первого аккордеона
                globalSetId = $('#accordionCardSets .accordion-collapse').first().data('set-id');
            }
        }


        var carddeck_id = $(this).data("carddeck-id");
        // Из атрибута href берем ссылку на контроллер django
        var carddeck_change = $(this).attr("href");
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({
            type: "POST",
            url: carddeck_change,
            data: {
                cardset_id: cardset_id,
                carddeck_id: carddeck_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);
                
                // Уменьшаем количество товаров в корзине (отрисовка)
                //carddeckCount -= data.quantity_deleted;
                //cardsInCarddeckCount.text(carddeckCount);
                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cardsetItemsContainer = $("#cardset-items-container");
                cardsetItemsContainer.html(data.cardset_items_html);
                var carddeckItemsContainer = $("#carddeck-items-container");
                carddeckItemsContainer.html(data.carddeck_items_html);
                initSwiper();
                
                var activeAccordion = localStorage.getItem('activeAccordion');
                if (activeAccordion !== null) {
                    // Раскрываем аккордеон с сохраненным ID
                    $('#collapse' + activeAccordion).collapse('show');
                }                
                
            },
            error: function (data) {
                console.log("Ошибка при добавлении карты в колоду");
            },
        });
    });

    // Ловим собыитие клика по кнопке перенести карту из набора в колоду
    $(document).on("click", ".add-to-carddeck", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();
        // Получаем id набора карт и id карты из атрибута data-cart-id
        //var cardset_id = $(this).data("cardset-id");
        var setitem_id = $(this).data("setitem-id");
        // Получаем id корзины из атрибута data-carddeck-id
        //var carddeck_id = $(this).data("carddeck-id");
        // Из атрибута href берем ссылку на контроллер django
        var cardset_change = $(this).attr("href");

        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({
            type: "POST",
            url: cardset_change,
            data: {
                setitem_id: setitem_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);
                
                // Уменьшаем количество товаров в корзине (отрисовка)
                //carddeckCount -= data.quantity_deleted;
                //cardsInCarddeckCount.text(carddeckCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cardsetItemsContainer = $("#cardset-items-container");
                cardsetItemsContainer.html(data.cardset_items_html);


                var carddeckItemsContainer = $("#carddeck-items-container");
                carddeckItemsContainer.html(data.carddeck_items_html);

                initSwiper();

                var activeAccordion = localStorage.getItem('activeAccordion');
                if (activeAccordion !== null) {
                    // Раскрываем аккордеон с сохраненным ID
                    $('#collapse' + activeAccordion).collapse('show');
                }


            },

            error: function (data) {
                console.log("Ошибка при добавлении карты в колоду");
            },
            });
        });

    // Ловим собыитие клика по кнопке удалить карту из набора карт для игры
    $(document).on("click", ".remove-from-cardset", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение cardsInCarddeckCount
        // var cardsInCarddeckCount = $("#cards-in-carddeck-count");
        // var carddeckCount = parseInt(cardsInCarddeckCount.text() || 0);

        // Получаем id набора карт и id карты из атрибута data-cart-id
        var cardset_id = $(this).data("cardset-id");
        var setitem_id = $(this).data("setitem-id");
        
        // Из атрибута href берем ссылку на контроллер django
        var remove_from_cardset = $(this).attr("href");
    
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_from_cardset,
            data: {
                cardset_id: cardset_id,
                setitem_id: setitem_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество товаров в корзине (отрисовка)
                //cardsetCount -= data.quantity_deleted;
                //cardsInCardsetCount.text(cardsetCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cardsetItemsContainer = $("#cardset-items-container");
                cardsetItemsContainer.html(data.cardset_items_html);
                updateCart(cartID, currentValue + 1, 1, url);
            },

            error: function (data) {
                console.log("Ошибка при добавлении карты в набор карт");
            },
        });
    });

    // Ловим событие клика по кнопке удалить набор карт
    $(document).on("click", ".remove-cardset", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение cardsInCarddeckCount
        // var cardsInCarddeckCount = $("#cards-in-carddeck-count");
        // var carddeckCount = parseInt(cardsInCarddeckCount.text() || 0);

        // Получаем id набора карт и id карты из атрибута data-cart-id
        var cardset_id = $(this).data("cardset-id");
        
        // Из атрибута href берем ссылку на контроллер django
        var remove_cardset = $(this).attr("href");
    
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_cardset,
            data: {
                cardset_id: cardset_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество наборов карт в профиле (отрисовка)
                //setCount -= data.quantity_deleted;
                //CardsetCount.text(setCount);

                // Меняем содержимое профиля на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cardsetItemsContainer = $("#cardset-items-container");
                cardsetItemsContainer.html(data.cardset_items_html);
                // updateCart(cartID, currentValue - 1, -1, url);

            },

            error: function (data) {
                console.log("Ошибка при добавлении карты в набор карт");
            },
        });
    });

    // Теперь + - количества карточек 
    // Обработчик события для уменьшения значения
    $(document).on("click", ".decrement", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("cart-change-url");
        // Берем id корзины из атрибута data-cart-id
        var cartID = $(this).data("cart-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());
        // Если количества больше одного, то только тогда делаем -1
        if (currentValue > 1) {
            $input.val(currentValue - 1);
            // Запускаем функцию определенную ниже
            // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
            updateCart(cartID, currentValue - 1, -1, url);
        }
    });

    // Обработчик события для увеличения значения
    $(document).on("click", ".increment", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("cart-change-url");
        // Берем id корзины из атрибута data-cart-id
        var cartID = $(this).data("cart-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());

        $input.val(currentValue + 1);

        // Запускаем функцию определенную ниже
        // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
        updateCart(cartID, currentValue + 1, 1, url);
    });

    // Теперь + - количества карточек в колоде 
    // Обработчик события для уменьшения значения карточек в колоде
    $(document).on("click", ".decrement-carddeck", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("carddeck-change-url");
        // Берем id корзины из атрибута data-cart-id
        var carddeckID = $(this).data("carddeck-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());
        // Если количества больше одного, то только тогда делаем -1
        if (currentValue > 1) {
            $input.val(currentValue - 1);
            // Запускаем функцию определенную ниже
            // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
            updateCarddeck(carddeckID, currentValue - 1, -1, url);
        }
    });

    // Обработчик события для увеличения значения карточек в колоде
    $(document).on("click", ".increment-carddeck", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("carddeck-change-url");
        // Берем id корзины из атрибута data-cart-id
        var carddeckID = $(this).data("carddeck-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());

        $input.val(currentValue + 1);

        // Запускаем функцию определенную ниже
        // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
        updateCarddeck(carddeckID, currentValue + 1, 1, url);
    });



    // Обновление корзины
    function updateCart(cartID, quantity, change, url) {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                cart_id: cartID,
                quantity: quantity,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },

            success: function (data) {
                 // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                 // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Изменяем количество товаров в корзине
                var cardsInCartCount = $("#cardss-in-cart-count");
                var cartCount = parseInt(cardsInCartCount.text() || 0);
                cartCount += change;
                cardsInCartCount.text(cartCount);

                // Меняем содержимое корзины
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },
            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    }


    // Берем из разметки элемент по id - оповещения от django
    var notification = $('#notification');
    // И через 7 сек. убираем
    if (notification.length > 0) {
        setTimeout(function () {
            notification.alert('close');
        }, 7000);
    }

    // При клике по значку корзины открываем всплывающее(модальное) окно
    $('#modalButton').click(function () {
        $('#exampleModal').appendTo('body');

        $('#exampleModal').modal('show');
    });

    // Собыите клик по кнопке закрыть окна корзины
    $('#exampleModal .btn-close').click(function () {
        $('#exampleModal').modal('hide');
    });

    // Обработчик события радиокнопки выбора способа доставки
    $("input[name='requires_delivery']").change(function() {
        var selectedValue = $(this).val();
        // Скрываем или отображаем input ввода адреса доставки
        if (selectedValue === "1") {
            $("#deliveryAddressField").show();
        } else {
            $("#deliveryAddressField").hide();
        }
    });
});