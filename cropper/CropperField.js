(function($) {

	var CropperField = function(field) {
		var _inst = this;
		var target = field.find('.js-cropperfield__target');
		var dataField = field.find('.js-cropperfield__data');
		var cropperHeight;
		var construct = function() {
			var options = JSON.parse(field.attr('data-config'));
			var fieldID = field.attr('data-field-id');
			var preview = field.find('.cropperfield__preview');
			target.cropper({
				multiple: true,
				aspectRatio: options.aspect_ratio,
				autoCropArea: .8,
				minWidth: options['crop_min_width'],
				minHeight: options['crop_min_height'],
				maxWidth: options['crop_max_width'],
				maxHeight: options['crop_max_height'],
				preview: preview,
				done: function(data) {
					dataField.val(JSON.stringify(data));
				},
				built: function() {
					_inst.setCropperHeight(
						field.find('.cropper-container')[0].clientHeight
					);
				}
			});
			target.cropper('disable');
			setupCheckbox();
			CropperField.instances.push(_inst);
			return this;
		};
		var setupCheckbox = function() {
			var toggleField = field.find('.js-cropperfield__toggle');
			toggleField.on('change click', onCheckboxToggle);
			onCheckboxToggle.call(toggleField);
		};
		var onCheckboxToggle = function() {
			var method = $(this).is(':checked') ? 'enable' : 'disable';
			target.cropper(method);
			_inst[method]();
		};
		this.id = function() {
			return field.attr('data-field-id');
		};
		this.setCropperHeight = function(height) {
			cropperHeight = height;
			return this;
		}
		this.getCropperHeight = function() {
			return cropperHeight || 600;
		};
		this.enable = function() {
			var inClass = 'cropperfield--cropping';
			var outClass = 'cropperfield--inactive';
			field.removeClass(outClass).addClass(inClass);
			field.find('.cropperfield__cropper-container').attr(
				'style',
				'height: ' + _inst.getCropperHeight() + 'px'
			);
			return this;
		};
		this.disable = function() {
			var inClass = 'cropperfield--inactive';
			var outClass = 'cropperfield--cropping';
			field.removeClass(outClass).addClass(inClass);
			field.find('.cropperfield__cropper-container').removeAttr('style');
			return this;
		};
		this.destroy = function() {
			_inst.disable();
			target.cropper('destroy');
			return this;
		};
		construct();
		return this;
	};

	CropperField.instances = [];

	CropperField.destroy = function() {
		CropperField.instances.forEach(function(instance, key, collection) {
			instance.destroy();
			delete collection[key];
		});
	}

	$(function() {

		$('.js-cropperfield').each(function() {
			new CropperField($(this));
		});

		// Set the init method to re-run if the page is saved or pjaxed
		if($.entwine) {
			$.entwine('ss', function($) {
				$('.js-cropperfield').entwine({
					onmatch: function() {
						CropperField.destroy();
						$('.js-cropperfield').each(function() {
							new CropperField($(this));
						});
					}
				});
			});
		}

	});

}(jQuery));
