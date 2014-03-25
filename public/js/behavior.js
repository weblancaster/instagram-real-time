Behavior = function (dialog) {
	this._dialog = dialog;
}

Behavior.prototype.attachEvent = function () {}

Behavior.prototype.detachEvent = function () {}


NullBehavior = function (dialog){
	Behavior.call(this, dialog);
}

NullBehavior.contructor = NullBehavior;
NullBehavior.prototype = new Behavior;

FirstBehavior = function (dialog){
	Behavior.call(this, dialog);
}
FirstBehavior.contructor = FirstBehavior;
FirstBehavior.prototype = new Behavior();



FirstBehavior.prototype.attachEvent = function () {
	var self = this;
	$(document).on( 'click', '.first-yes-btn', function () {
		self.detachEvent();
		self._dialog.next (new ChoosePhotoStyle(self._dialog));
	});
}

FirstBehavior.prototype.detachEvent = function (){
	$(document).off( 'click', '.first-yes-btn');
}

ChoosePhotoStyle = function (dialog){
	Behavior.call(this, dialog);
}

ChoosePhotoStyle.contructor = ChoosePhotoStyle;
ChoosePhotoStyle.prototype = new Behavior();


ChoosePhotoStyle.prototype.attachEvent = function () {
	var self = this;
	$('.img-type').click(function () {

		self.detachEvent();

		if ($(this).hasClass("4r")) {

			self._dialog.setImgType("_4r");

		} else if ($(this).hasClass("half-4r")) {

			self._dialog.setImgType("half4r");

		} else if ($(this).hasClass("wallet")) {

			self._dialog.setImgType("wallet");
		}

		self._dialog.uploadFile();
		self._dialog.next (new Printout(self._dialog));
		
	});
}
ChoosePhotoStyle.prototype.detachEvent = function (){
	$('.img-type').off('click');
}
/**
* print out action
*/
Printout = function (dialog){
	Behavior.call(this, dialog);
}

Printout.contructor = Printout;
Printout.prototype = new Behavior();

Printout.prototype.attachEvent = function () {
	var self = this;
	$(".submit-email").click (function (e) {
		e.preventDefault();
		
		var email = $("#emailInput").val();
		if (!self._isValidEmail(email)) {
			$("#emailInput").focus().parent().addClass("has-error");
			$(".err-msg").removeClass("hide");
		} else {
			self.detachEvent();
			self._dialog.sendMail(email);
			self._dialog.next (new NullBehavior(self._dialog));
		}
		return false;
	});

	this._t = setInterval(function(){
		var email = $("#emailInput").val();
		if (email.length) {
			$(".modal-btn-grp-3 button").addClass("disabled");
		}else {
			$(".modal-btn-grp-3 button").removeClass("disabled");
		}
		//console.log('timer is running');
	}, 500);
}

Printout.prototype.detachEvent = function () {
	$(".submit-email").off('click');
	clearInterval(this._t);
}

Printout.prototype._isValidEmail = function (mail) {
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return filter.test(mail);
};









