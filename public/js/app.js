(function() {
    var socket = io.connect('/');

    /**
     * [Namespacing]
     */
    var Insta = Insta || {};
    
    Insta.App = {

        /**
         * [Application initialization method / call for the methods being initializated in order]
         */
        init: function() {
            this.mostRecent();
            this.getData();
            this.aboutInfo();
            this.mobileNav();
        },

        /**
         * [Interaction to open mobile navigation]
         */
        mobileNav: function() {
            var btMobNav = $('#js-mobNav'),
                nav = $('.nav');

            btMobNav.on('click', function(e) {
                e.preventDefault();
                if( !nav.hasClass('active') ) {
                    nav.addClass('active');
                } else {
                    nav.removeClass('active');
                }
            });

        },

        /**
         * [get data ajax and send to render method]
         */
        getData: function() {
            var self = this;
            socket.on('show', function(data) {
                var url = data.show;
                $.ajax({
                    url: url,
                    type: 'POST',
                    crossDomain: true,
                    dataType: 'jsonp'
                }).done(function (data) {
                    self.renderTemplate(data);
                    console.log(data.data[0].likes.count);
                });
            });
        },

        /**
         * [Render the images on the page and check for layout resize]
         */
        renderTemplate: function(data) {
            var nooflikes, noofphoto, lastAnimate, lastSrc, nextSrc, last,
                current = data.data[0].images.standard_resolution.url,
                w = $(document).width();

                var
                    query = data,
                    source = $('#mostRecent-tpl').html(),
                    compiledTemplate = Handlebars.compile(source),
                    result = compiledTemplate(query),
                    imgWrap = $('#imgContent');

                imgWrap.prepend(result);

                //noofphoto = $('#imgContent .photoframe').size();
                //console.log(noofphoto);

                //nooflikes = data.data[2].likes.count;
                //console.log(nooflikes);

                last = $('#imgContent .photoframe:first-child');
                lastSrc = $('#imgContent .photoframe:first-child').find('.photoframe1 img').attr('src');
                nextSrc = $('#imgContent .photoframe:nth-child(2)').find('.photoframe1 img').attr('src'); //start at 1.

                if( lastSrc === nextSrc ) {
                    last.remove(); //remove the first one
                }

                last = $('#imgContent').find('.photoframe:first-child').removeClass('Hvh');

                if( w >= 900 ) {
                    lastAnimate = $('#imgContent').find('.photoframe:nth-child(2)').addClass('animated fadeInLeft');
                }

                if( w <= 900 ) {
                    lastAnimate = $('#imgContent').find('.photoframe:nth-child(1)').addClass('animated fadeInDown');
                }

                $(window).resize(function() {
                    var w = $(document).width();
                    if( w >= 900 ) {
                        lastAnimate = $('#imgContent').find('.photoframe:nth-child(2)').addClass('animated fadeInLeft');
                    }

                    if( w <= 900 ) {
                        lastAnimate = $('#imgContent').find('.photoframe:nth-child(1)').addClass('animated fadeInDown');
                    }
                });
        },

        /**
         * [ render most recent pics defined by subscribed hashtag ]
         */
        mostRecent: function() {
            socket.on('firstShow', function (data) {
                var clean = $('imgContent').find('.photoframe').remove();
                //var countoflikes = data.data[2].likes.count;
                //console.log(countoflikes);

                var
                    query = data,
                    /*compile handlebar template*/
                    source = $('#firstShow-tpl').html(),
                    compiledTemplate = Handlebars.compile(source),
                    result = compiledTemplate(query),
                    imgWrap = $('#imgContent');

                imgWrap.html(result);
            });
        },

        /**
         * [about view interaction show/hide]
         */
        aboutInfo: function() {
            var about = $('.aboutWrap'),
                btClose = $('#js-closeAbout').find('a'),
                bt = $('#js-btAbout'),
                user = localStorage.getItem('user');

            if( user ) {
                about.removeClass('active');
            } else {
                localStorage.setItem('user', 'visited');
            }

            btClose.on('click', function(e) {
                e.preventDefault();
                about.removeClass('active');
            });

            bt.on('click', function(e) {
                e.preventDefault();
                if( !about.hasClass('active') ) {
                    about.addClass('active');
                } else {
                    about.removeClass('active');
                }
            });

        }

    };

    Insta.App.init();

})(this);