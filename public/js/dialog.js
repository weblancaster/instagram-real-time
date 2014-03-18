Dialog = function(context, socket){
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
}

Dialog.prototype.attachEvent = function(){
	var self = this;
	$(".yes-btn").click(function(){
		self.nextStep();
	});
	this._modal.on('hidden.bs.modal', function (e) {
		$('#myModal').remove();
	});
//	this._modal.on('hide.bs.modal', function (e) {
//	    return self.removePhoto();
//	});
};
/*Dialog.prototype.removePhoto = function(){
	
	if(!this.filename && this._step > 0)
		return false;
	
	if(this.filename){
		$.ajax({
			url: 'remove/'+this.filename,
			type: 'GET'
		});
	}
	
	return true;
}*/

Dialog.prototype.nextStep = function(){
	this._step++;
	var self = this;
	// print photo;
	if(this._step == 1){
		$('.yes-btn').prop('disabled', true).text("Loading...");
		//this._printPhoto();
		 $.ajax({
             url: '/upload',
             type: 'POST',
             data:{
             	img: self._context.url
             }
         }).done(function (data) {
             self.filename = data.filename;
             $('.yes-btn').prop('disabled', false).text("Yes");;
         }).error(function(err){
         	//console.log(err);
         }); 
	}else 
	//validate email
	if(this._step == 4){
			if(!this._isValidEmail($("#email").val())){
				$("#email").focus().parent().addClass("has-error");
				this._step--;
				return;
			}else{
				 $.ajax({
	                    url: '/sendmail',
	                    type: 'POST',
	                    data:{
	                    	mail: $("#email").val(),
	                    	filename: self.filename
	                    }
	                }).done(function (data) {
	                }).error(function(err){
	                }); 
			}
	}else 
	// finish
	if(this._step == 5){
		this._modal.modal('hide');
		return;
	}
	this._carousel.carousel('next');
}
Dialog.prototype._isValidEmail = function(email){
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return filter.test(email);
}
Dialog.prototype._printPhoto = function(){
	popup = window.open();
	popup.document.write('<img src="'+this._context.url+'" />');
	popup.print();
}
