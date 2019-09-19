jQuery(document).ready(function($){
		//		колдунство с шапкой при скролле
		if ($(window).width() < 601) {
			var didScroll;
			var lastScrollTop = 0;
			var delta = 5;
			var navbarHeight = $('header').outerHeight();
			var banHeight = $("#first-screen").outerHeight();
			$(window).scroll(function (event) {
				didScroll = true;
			});

			function hasScrolled() {
				var st = $(this).scrollTop();
				if (Math.abs(lastScrollTop - st) <= delta)
					return;
				if (st > lastScrollTop && st > navbarHeight) {
					// Scroll Down
					$('header').velocity({
						duration: '500',
						height: '60',
						lineHeight: '60'
					}).clearQueue();
					$('nav .nav-wrapper').velocity({
						duration: '500',
						height: '60',
						lineHeight: '60'
					}).clearQueue();
					$('nav').velocity({
						duration: '500',
						height: '60',
						lineHeight: '60'
					}).clearQueue();
					$('.navbar-fixed').velocity({
						duration: '500',
						height: '60',
						lineHeight: '60'
					}).clearQueue();
					$('.head_info').velocity({
						duration: '250',
						opacity: '0'
					}).clearQueue();
					$('nav .brand-logo').velocity({
						duration: '250',
						height: '50',
						margin: '5px 0'
					}).clearQueue();
					$('header .brand-logo img').velocity({
						duration: '250',
						height: '50',
						margin: '5px 0'
					}).clearQueue();
				} else {
					// Scroll Up
					if (st + $(window).height() < $(document).height()) {
						$('header').velocity({
							duration: '500',
							height: '125',
							lineHeight: '125'
						}).clearQueue();
						$('nav .nav-wrapper').velocity({
							duration: '500',
							height: '125',
							lineHeight: '125'
						}).clearQueue();
						$('nav').velocity({
							duration: '500',
							height: '125',
							lineHeight: '125'
						}).clearQueue();
						$('.navbar-fixed').velocity({
							duration: '500',
							height: '125',
							lineHeight: '125'
						}).clearQueue();
						$('.head_info').velocity({
							duration: '250',
							opacity: '1'
						}).clearQueue();
						$('nav .brand-logo').velocity({
							duration: '250',
							height: '75',
							margin: '0'
						}).clearQueue();
						$('header .brand-logo img').velocity({
							duration: '250',
							height: '75',
							margin: '0'
						}).clearQueue();
					}
				}
				lastScrollTop = st;
			}
			setInterval(function () {
				if (didScroll) {
					hasScrolled();
					didScroll = false;
				}
			}, 250);
		}
		//		инициализация функций
		$('.parallax').parallax();
		//		скроллы по якорям
		$('a').on('click', function () {
			var targetSection = $(this).attr("href");
			$(targetSection).velocity('scroll', {
				queue: false,
				duration: '1500',
				offset: -125
			});
		});
		//		манипцляции с нижней формой
		$('.switch label .lever').on('click', function () {
			$('.cityBlock').removeClass('hide');
			$('.address').addClass('hide');
			setTimeout(function () {
				$('#switchbox').attr("disabled", true);
			}, 250);
			$('.switch').velocity({
				duration: '1000',
				opacity: '0',
				height: '0'
			});
		});
		//		заполнение выпадающего меню в нижней форме на основе данных из блоков с ценами
		$('.prices .header').each(function () {
			$this = $(this);
			var extFormText = $.trim($(this).text());
			$('#capacity').append('<option class="clearReg center-align white-text" value="' + extFormText + '">' + extFormText + '</option>');
		});
		$('#capacity').material_select();

		//		всплывающие подсказки
		$('#maps h1').tooltip({
			tooltip: "<p class='clearBold blue-grey-text text-lighten-5'>Выберите название вашего города нажав кнопку</p>",
			delay: 150,
			html: true,
			position: 'bottom'
		});
		$('#city').tooltip({
			tooltip: "<p class='clearBold blue-grey-text text-lighten-5'>Введите название вашего города, или выберите его из выпадающего <span class='blue-grey-text text-lighten-3'>меню на карте</span></p>",
			delay: 150,
			html: true,
			position: 'bottom'
		});
		$('#comments').tooltip({
			tooltip: "<p class='clearBold blue-grey-text text-lighten-5'>Заказ в другой город? Щёлкните переключатель междугороднего заказа</p>",
			delay: 150,
			html: true,
			position: 'top'
		});

		//		отправка сообщений
		//		мелкая форма
		var form = $('#contactForm');
		// Get the messages div.
		var formMessages = $('#formMessages');
		$(form).submit(function (e) {
			// Stop the browser from submitting the form.
			e.preventDefault();
			// Serialize the form data.
			var formData = $(form).serialize(),
				result = $.ajax({
					type: 'POST',
					url: form.attr('action'),
					data: $(form).serialize(),
					beforeSend: function () {
						$('#sended').text('Отправляется');
					},
					success: function (response, textStatus, jqXHR) {
						if (response === "success") {
							formMessages.html('');
							form.velocity({
								duration: '2750',
								height: '0',
								opacity: '0'
							});
							$('#small-contact-form').addClass('flipped');
							setTimeout(function () {
								$('#small-contact-form').addClass('hide');
								$('#small-contact').removeClass('flipped').addClass('unflipped');
							}, 750);
						} else {
							result = response;
							setTimeout(function () {
								$('#sended').text('Еще раз?');
								formMessages.html('<p class="Arvo red-text text-darken-2 center">' + result + '</p>');
							}, 1000);
						}
					}
				});
		});

		//		расширенная форма
		var extForm = $('#extendedContactForm');
		// Get the messages div.
		var extFormMessages = $('#extended-contact-form #extFormMessages');
		$(extForm).submit(function (e) {
			// Stop the browser from submitting the form.
			e.preventDefault();
			// Serialize the form data.
			var extFormData = $(extForm).serialize(),
				extFormResult = $.ajax({
					type: 'POST',
					url: extForm.attr('action'),
					data: extFormData,
					beforeSend: function () {
						$('#extendedContactForm #extSended').text('Отправляется');
					},
					success: function (response, textStatus, jqXHR) {
						if (response === "success") {
							extFormMessages.html('');
							extForm.velocity({
								duration: '2750',
								height: '0',
								opacity: '0'
							});
							$('#extendedContactForm').addClass('hide');
							$('#extFormSuccess').removeClass('hide');
						} else {
							extFormResult = response;
							setTimeout(function () {
								$('#extendedContactForm #extSended').text('Еще раз?');
								extFormMessages.html('<p class="clearBold red-text text-darken-2 center">' + extFormResult + '</p>');
							}, 1000);
						}
					}
				});
		});
		var priceSwiper = new Swiper('.priceSwiper', {
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
					slidesPerView: 4,
					spaceBetween: 5,
			breakpoints: {
				// when window width is <= 320px
				479: {
					slidesPerView: 1,
			centeredSlides: true,
					spaceBetween: 0
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 5
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 5
				}
			}
		});
	});
