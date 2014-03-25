
var config = require("../model/config").config;
var mandrill = require('mandrill-api/mandrill');
var mcapi = require('mailchimp-api/mailchimp');
var fs = require('fs');
var mandrill_client = new mandrill.Mandrill(config.mandrill.api_key);
var emailModel = require("../model/email");

var path = require('path'),
appDir = path.dirname(require.main.filename),
imgFolder = appDir + config.imgfoldername;

exports.sendMail = function(email, filename){
	fs.readFile(imgFolder+filename, function(err, original_data){
		
	    var base64Image = original_data.toString('base64');
	    var template_name = "instagram-mail-template-1";
	    var template_content = [];
	    var message = {
			    "to": [{
			            "email": email,
			            "type": "to"
			        }],
			    "important": false,
			    "track_opens": null,
			    "track_clicks": null,
			    "auto_text": null,
			    "auto_html": null,
			    "inline_css": null,
			    "url_strip_qs": null,
			    "preserve_recipients": null,
			    "view_content_link": null,
			    "tracking_domain": null,
			    "signing_domain": null,
			    "return_path_domain": null,
			    "merge": true,
			    "attachments": [{
			            "type": "image/*",
			            "name": filename,
			            "content": base64Image
			        }]
			};
			var async = false;
			var ip_pool = "Main Pool";
			//var send_at = (new Date()).toString();
			mandrill_client.messages.sendTemplate({template_name: template_name, template_content: template_content,
				"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
			   console.log(result);
			    /*
			    [{
			            "email": "recipient.email@example.com",
			            "status": "sent",
			            "reject_reason": "hard-bounce",
			            "_id": "abc123abc123abc123abc123abc123"
			        }]
			    */
			}, function(e) {

			    // Mandrill returns the error as an object with name and message keys
			    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
			    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
			});
	});
};

exports.subscribe = function(email){
	
	mc = new mcapi.Mailchimp(config.mailchimp.api_key, { version : '2.0' });
	
	mc.lists.subscribe({id: config.mailchimp.list_id, email:{email:email}, double_optin : false}, function(data) {
	   // console.log(data);
	 },
	  function(error) {
		 // if(error.error)
			  //console.log(error.error);
	  });
};

exports.insert = function(email){
	emailModel.insert(email);
}