jQuery(document).ready(function ($) {
	//		яндекс карты
	$.ajaxSetup({
		cache: true
	});

	var options = [
				{
					selector: '#maps',
					offset: 50,
					callback: function () {
			ymaps.ready().done(function (ym) {
				var myMap = new ym.Map('map', {
						center: [37.620393, 55.75396],
						zoom: 10,
						controls: []
					}),
					// Создадим собственный макет выпадающего списка.
					ListBoxLayout = ym.templateLayoutFactory.createClass(
						"<a id='cityDropdown' class='waves-effect waves-blue blue darken-2 btn clearReg dropdown-button' data-activates='dropdown_city'>" +
						"{{data.title}}" + "</a>" + "<ul id='dropdown_city' class='dropdown-menu white' " + "style='display: {% if state.expanded %}block{% else %}none{% endif %};'>" + "</ul>", {
							build: function () {
								// Вызываем метод build родительского класса перед выполнением
								// дополнительных действий.
								ListBoxLayout.superclass.build.call(this);

								this.childContainerElement = $('#dropdown_city').get(0);
								// Генерируем специальное событие, оповещающее элемент управления
								// о смене контейнера дочерних элементов.
								this.events.fire('childcontainerchange', {
									newChildContainerElement: this.childContainerElement,
									oldChildContainerElement: null
								});
							},
							// Переопределяем интерфейсный метод, возвращающий ссылку на
							// контейнер дочерних элементов.
							getChildContainerElement: function () {
								return this.childContainerElement;
							},
							clear: function () {
								// Заставим элемент управления перед очисткой макета
								// откреплять дочерние элементы от родительского.
								// Это защитит нас от неожиданных ошибок,
								// связанных с уничтожением dom-элементов в ранних версиях ie.
								this.events.fire('childcontainerchange', {
									newChildContainerElement: null,
									oldChildContainerElement: this.childContainerElement
								});
								this.childContainerElement = null;
								// Вызываем метод clear родительского класса после выполнения
								// дополнительных действий.
								ListBoxLayout.superclass.clear.call(this);
							}
						}),
					// Также создадим макет для отдельного элемента списка.
					ListBoxItemLayout = ym.templateLayoutFactory.createClass(
						"<li><a class='clearReg blue-text'>{{data.content}}</a></li>"
					),
					// Создадим 2 пункта выпадающего списка
					listBoxItems = [],
					// Теперь создадим список, содержащий 2 пунтка.
					listBox = new ym.control.ListBox({
						items: listBoxItems,
						data: {
							title: 'Выберите город'
						},
						options: {
							// С помощью опций можно задать как макет непосредственно для списка,
							layout: ListBoxLayout,
							// так и макет для дочерних элементов списка. Для задания опций дочерних
							// элементов через родительский элемент необходимо добавлять префикс
							// 'item' к названиям опций.
							itemLayout: ListBoxItemLayout
						}
					}),
					//				потрошим жсон
					a = $.getJSON('./wp-content/themes/clean-pool/assets/ymaps/geojson.json', {
						//			при обновлении списка карт перезагружать с раскомментированной строкой ниже
						//											_: new Date().getTime()
					})
					.done(function (json) {
						//				парсим файл с точками на содержимое для выпадающего списка
						for (var y = 0; y < json.features.length; y++) {
							var b = json.features[y]["properties"].address,
								c = json.features[y]["geometry"].coordinates;
							var listBoxItem = new ymaps.control.ListBoxItem({
									data: {
										content: b,
										center: c,
										zoom: 13
									}
								})
								//					добавляем пункты в список
							listBox.add(listBoxItem);
						}
						//				объявляем переменную и расставляем точки по карте
						var geoObjects = ym.geoQuery(json)
							.addToMap(myMap);
					});
				listBox.events.add('click', function (e) {
					// Получаем ссылку на объект, по которому кликнули.
					// События элементов списка пропагируются
					// и их можно слушать на родительском элементе.
					var item = e.get('target');
					// Клик на заголовке выпадающего списка обрабатывать не надо.
					if (item != listBox) {
						myMap.setCenter(
							item.data.get('center'),
							item.data.get('zoom')
						), {
							duration: 5000
						};
						$('#extendedContactForm #city').val(item.data.get('content'));
						Materialize.updateTextFields('#extendedContactForm #city');
					}

				});
				myMap.controls.add(listBox, {
					float: 'right'
				});
				myMap.setType('yandex#hybrid');
			});
					},
				}
		];
		Materialize.scrollFire(options);
	//		стандартные материалайз функции
	$('.dropdown-button').dropdown({
		inDuration: 300,
		outDuration: 225,
		constrain_width: true, // Does not change width of dropdown to that of the activator
		hover: false, // Activate on hover
		gutter: 50, // Spacing from edge
		belowOrigin: true, // Displays dropdown below the button
		alignment: 'left'
	});
});
