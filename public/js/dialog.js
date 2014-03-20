Dialog = function (context, socket) {
	
	this._context = context;
	this._socket = socket;
	this._step = 0;
	var
		source = $('#dialog-tpl').html(),
		compiledTemplate = Handlebars.compile(source),
		result = compiledTemplate(context);
	
	$(document.body).append(result);
	
	this._modal = $("#myModal").modal();
	this._carousel = $("#carousel-example-generic").carousel({interval:false});
	
	this.attachEvent();
};

Dialog.prototype.attachEvent = function () {
	var self = this;
	$(".yes-btn").click(function (){
		self.nextStep();
	});
	
	this._modal.on('hidden.bs.modal', function (e) {
		$('#myModal').remove();
	});
};

Dialog.prototype.nextStep = function () {
	this._step++;
	var self = this;
	switch(this._step) {
	
		case 1:
			$('.yes-btn').prop('disabled', true).text('Loading...');
			this.uploadFile();
			break;
			
		case 4:
			var mail = $("#email").val();
			if(!this._isValidEmail(mail)) {
				$("#email").focus().parent().addClass("has-error");
				this._step--;
				return;
			
			}else {
				this.sendMail(mail);
			}
			break;
			
		case 5:
			this._modal.modal('hide');
			return;
	};
	
	this._carousel.carousel('next');
};

Dialog.prototype.uploadFile = function () {
	var self = this;
	$.ajax({
		url: '/upload',
		type: 'POST',
		data: {
			img: self._context.url
		}
	
	}).done(function (data) {
	     self.filename = data.filename;
	     $('.yes-btn').prop('disabled', false).text("Yes");
	});
};

Dialog.prototype.sendMail = function (mail) {
	var self = this;
	$.ajax({
		url: '/sendmail',
        type: 'POST',
        data: {
        	mail: mail,
        	filename: self.filename
        }
	});
};

Dialog.prototype._isValidEmail = function (mail) {
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return filter.test(mail);
};

Dialog.prototype._printPhoto = function(){
	popup = window.open();
	popup.document.write('<img src="'+this._context.url+'" />');
	popup.print();
};
 