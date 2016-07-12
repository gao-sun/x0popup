'use strict';

var x0popup, x0p;
var x0pDefaultConfig = {
	title: 'Message',
	text: null,
	theme: 'default',
	overlay: true,
	width: '90%',
	height: '50%',
	maxWidth: '450px',
	maxHeight: '200px',
	type: 'text',
	icon: null,
	iconURL: null,
	inputType: null,
	inputValue: null,
	inputPlaceholder: null,
	inputColor: null,
	inputValidator: null,
	showCancelButton: null,
	buttons: null,
	autoClose: null,
	html: false,
	animation: true,
	animationType: 'pop',
	overlayAnimation: true
};

x0popup = x0p = function() {
	var personlization = arguments[0];
	var callback = null;
	var config = JSON.parse(JSON.stringify(x0pDefaultConfig));
	var buttons, timeoutFunc = null;

	// Overwrite default config
	if(typeof(personlization) == 'string') { // easy calling
		config.title = arguments[0];
		(arguments[1] != undefined) && (config.text = arguments[1]);
		(arguments[2] != undefined) && (config.type = arguments[2]);
		if(arguments[3] != undefined) { 
			(typeof(arguments[3]) == 'boolean') ? (config.overlayAnimation = arguments[3]) : (callback = arguments[3]);
		}
	} else { // specific
		for(var key in personlization) {
			config[key] = personlization[key];
		}
		(arguments[1] != undefined) && (callback = arguments[1]);
	}

	// Start construction
	/**
	*	Configuration Logic
	*	Icon Priority: icon > type
	*	Input Type Priority: inputType > type
	*	Buttons: buttons > showCancelButton > type
	**/	
	var str = '';
	var textOnly = (config.icon == null && (config.type == 'text' || config.type == 'input'));
	var inputType = (config.inputType != null ? config.inputType : (config.type == 'input' ? 'text' : null));
	var inputValue = (config.inputValue == null ? '' : config.inputValue);
	var inputPlaceholder = (config.inputPlaceholder == null ? '' : config.inputPlaceholder);
	var buttonStr = generateButtons();

	(config.overlay) && (str += '<div id="x0p-overlay" class="x0p-overlay' + ((!config.animation || !config.overlayAnimation) ? ' no-animation' : '') + '"></div>');
	str += '<div id="x0popup" class="x0p ' + config.theme + (config.animation == false ? ' no-animation' : '') + (buttons.length == 0 ? ' no-button' : '') + '" style="' + generateStyle() + '">';
		str += '<div class="content">';
			str += textOnly ? '<div class="text-pure-wrapper">' : generateIcon() + '<div class="text-wrapper">';
				str += '<div id="x0p-text-anchor" class="text-anchor">';
					str += '<div class="title">' + config.title + '</div>';
					(config.text != null) && (str += '<div class="text">' + (config.html ? config.text : htmlEncode(config.text)) + '</div>');
					(inputType != null) && (str += '<div class="input">' + generateInputColor() + '<input id="x0p-input" type="' + inputType + '" placeholder="' + inputPlaceholder + '" value="' + inputValue + '"></div>');
				str += '</div>';
			str += '</div>';
		str += '</div>';
		str += buttonStr;
	str += '</div>';

	// Close Previous Popup
	close();
	// Append to Body
	var body = document.getElementsByTagName('body');
	body[0].insertAdjacentHTML('beforeend', str);

	// Auto Focus Input DOM
	var inputDOM = document.getElementById('x0p-input');
	(inputType != null) && (inputDOM.focus());

	addButtonHandlers();

	(config.autoClose != null) && (timeoutFunc = setTimeout(function() {
		closeAndTriggerCallback('timeout');
	}, config.autoClose));

	// Construction Helpers
	function generateStyle() {
		var str = '';
		str += 'width: ' + config.width + ';';
		str += 'height: ' + config.height + ';';
		(config.maxWidth != null) && (str += 'max-width: ' + config.maxWidth + ';');
		(config.maxHeight != null) && (str += 'max-height: ' + config.maxHeight + ';');
		(config.animation) && (str += '-webkit-animation-name: x0p' + config.animationType + '; animation-name: x0p' + config.animationType + ';');
		(!config.overlay) && (str += 'outline: 1px solid #ddd');
		return str;
	}
	function generateIcon() {
		var str = '';
		var iconType = (config.icon == null ? config.type : config.icon);
		str += '<div class="icon-wrapper">';
		switch(iconType) {
			case 'ok':
				str += '<i class="xi xi-ok"><span class="xi-ok-left"></span><span class="xi-ok-right"></span></i>';
				break;
			case 'error':
				str += '<i class="xi xi-error"><span class="xi-error-left"></span><span class="xi-error-right"></span></i>';
				break;
			case 'info':
				str += '<i class="xi xi-info"><span class="xi-info-circle"></span><span class="xi-info-line"></span></i>';
				break;
			case 'warning':
				str += '<i class="xi xi-warning"><span class="xi-warning-circle"></span><span class="xi-warning-line"></span></i>';
				break;
			case 'custom':
				str += '<i class="xi" style="background: url(\'' + config.iconURL + '\') no-repeat center center; background-size: 100% 100%;"></i>';
				break;
		}
		str += '</div>';
		return str;
	}

	function generateButtons() {
		var str = '';
		buttons = config.buttons;
		if(buttons == null) {
			buttons = [];
			if(
				config.showCancelButton == true ||
				(config.showCancelButton != false && (config.type == 'warning' || config.type == 'input'))
			) {
				buttons.push({
					type: 'cancel'
				});
			}
			if(config.type == 'text' || config.type == 'input') {
				buttons.push({
					type: 'info'
				});
			} else {
				buttons.push({
					type: config.type
				});
			}
		}

		if(buttons.length == 0)
			return '';

		var buttonCount = buttons.length;
		var buttonWidth = 'width: ' + (100.0 / buttonCount).toFixed(2) + '%; width: calc(100% / ' + buttonCount + ');';

		str += '<div id="x0p-buttons" class="buttons">';
		for(var i = 0; i < buttons.length; ++ i) {
			var button = buttons[i];
			str += '<div id="x0p-button-' + i + '" class="button button-' + button.type + '" style="' + buttonWidth + '">' + generateButtonText(button) + '</div>';
		}
		str += '</div>';
		return str;
	}

	function removeElementById(id) {
		var el = document.getElementById(id);
		(el != null) && (el.parentNode.removeChild(el));
	}

	function close() {
		removeElementById('x0popup');
		removeElementById('x0p-overlay');
	}

	function showX0l() {
		var buttons = document.getElementById('x0p-buttons');
		buttons.innerHTML = '<div class="x0l"><div class="ball ball-4"></div><div class="ball ball-3"></div><div class="ball ball-2"></div><div class="ball ball-1"></div></div>';
	}

	function addButtonHandlers() {
		for(var i = 0; i < buttons.length; ++ i) {
			var buttonEl = document.getElementById('x0p-button-' + i);
			(function(buttonType, showLoading) {
				buttonEl.addEventListener('click', function() {
					closeAndTriggerCallback(buttonType, showLoading);
				});
			}) (buttons[i].type, buttons[i].showLoading);
		}
	}

	function closeAndTriggerCallback(buttonType, showLoading) {
		var popup = document.getElementById('x0popup');
		if(popup == null) {
			return;
		}

		var inputDOM = document.getElementById('x0p-input');
		if(buttonType != 'cancel' && inputType != null && inputDOM != null && config.inputValidator != null) {
			var msg = config.inputValidator(buttonType, inputDOM.value);
			if(msg != null) {
				removeElementById('x0p-input-error');
				var anchor = document.getElementById('x0p-text-anchor');
				anchor.insertAdjacentHTML('beforeend', '<div id="x0p-input-error" class="error">' + msg + '</div>');
				return;
			}
		}

		clearTimeout(timeoutFunc);
		if(showLoading == true) {
			showX0l();
		} else {
			close();
		}
		(callback != null) && (callback(buttonType, inputDOM == null ? null : inputDOM.value));
	}

	function generateButtonText(button) {
		if(button.hasOwnProperty('text'))
			return button.text;
		switch(button.type) {
			case 'ok':
			case 'error':
			case 'info':
				return 'OK';
			case 'warning':
				return 'Confirm';
			case 'cancel':
				return 'Cancel';
		}
		return 'Button';
	}

	function generateInputColor() {
		var inputColor = config.inputColor;
		return inputColor == null ? '' : '<style>#x0p-input:focus { border-color:' + inputColor + '; color:' + inputColor + '; }</style>';
	}

	/**
	*	HtmlEncode() from http://stackoverflow.com/questions/784586/convert-special-characters-to-html-in-javascript
	**/
	function htmlEncode(s) {
		var el = document.createElement("div");
		el.innerText = el.textContent = s;
		s = el.innerHTML;
		return s;
	}
};

// User Functions
x0popup.setDefault = x0p.setDefault = function() {
	var config = arguments[0];
	for(var key in config) {
		x0pDefaultConfig[key] = config[key];
	}
};