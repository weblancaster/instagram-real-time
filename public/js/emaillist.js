EmailList = {
	key: "emails",
	getList : function(){
		return JSON.parse(localStorage[EmailList.key] || []);
	},
	saveList : function(list){
		localStorage[EmailList.key] = JSON.stringify(list);
	},
	insert : function(email){
		var list = EmailList.getList();
		EmailList.saveList(list);
	}
}