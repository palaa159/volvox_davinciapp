/*
 * Davinci App
 * Cordova plugins used:
 * – Device
 * – Splashscreen
 * – Statusbar
 * – Inappbrowser
 
 */
var APP_NAME = 'DAVINCIAPP';
var APP_PASSWD = '@volvox@';
var DROPBOX_FOLDER = 'Davinci_app';
var DROPBOX_TOKEN = localStorage['dropbox_token'] || 'kbIy1EpakoMAAAAAAADJ5r4h5VhfFIUhFQkfn3NfCm_66gDrKr3AhCCLlwADalJH';
// Correct vvv
var MANDRILL_EMAIL = localStorage['mandrill_email'] || 'davinci@volvoxlabs.com';
var MANDRILL_TOKEN = localStorage['mandrill_token'] || 'gRxJVxhYFO9JyWmDsvq9ow';
// Facebook APP ID
var FACEBOOK_APP_ID = '385155071666492';

var EVENT_NAME;
var EVENT_FOLDER = localStorage['event_folder'] || 'test_event';

var EVENT_BG;
var EVENT_DISCLAIMER;

var PREV_NOW = new Date().getTime();

angular.module(APP_NAME, [
    'ionic',
    'ngCordova',
    'ngRetina',
    'app.controllers',
    'app.services'
])

.run(function(
    $ionicPlatform,
    $rootScope,
    $state,
    $ionicViewSwitcher,
    $timeout,
    $ionicLoading,
    $cordovaOauth,
    Dialogs,
    Dropbox,
    $cordovaDevice,
    $cordovaSplashscreen,
    $cordovaPrinter,
    $cordovaStatusbar) {

    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        localStorage['uuid'] = '123456';
        if (window.cordova) {
            $cordovaStatusbar.hide();
            localStorage['uuid'] = $cordovaDevice.getUUID();
        }
        console.log('```` App Ready');
        // SET GLOBAL
        $rootScope.settings = {};
        $rootScope.settings.event_folder = EVENT_FOLDER;
        $rootScope.settings.dropbox_token = DROPBOX_TOKEN;
        $rootScope.settings.mandrill_email = MANDRILL_EMAIL;
        $rootScope.settings.mandrill_token = MANDRILL_TOKEN;
        $rootScope.startOver = function() {
            // Clear cookies
            if (window.cordova) {
                window.cookies.clear(function() {
                    console.log('Cookies cleared!');
                });
            }

            // Restart
            $state.go('/01-welcome');
        };
        // GET ACCOUNT INFO
        Dropbox.getAccountInfo(function(result) {
            console.log(result);
        });
        Dropbox.getSettings(function(res) {
            console.log(res);

            EVENT_NAME = res.event_name;
            EVENT_BG = '/' + DROPBOX_FOLDER + '/' + getEventFolder() + '/src_img/welcome_bg.jpg';

            $rootScope.msgToShare = res.share_comment;

            Dropbox.returnDirectLink(EVENT_BG, function(d) {
                $rootScope.backgroundBg = d;
                console.log($rootScope.backgroundBg); // √
                $state.go('/01-welcome');
                if (window.cordova) {
                    $timeout(function() {
                        $cordovaSplashscreen.hide();
                    }, 1000);

                }

            });
        }, function(err) {
            console.log(err);
            if (err == null) {
                err = {};
                err.error = 'No internet connection.';
            }
            /*
			    Cannot get settings file
			    – EVENT_FOLDER does not exist
			    – or, Internet connection lost
			*/
            Dialogs.alert('settings.json | ' + err.error, 'OK', function() {
                $state.go('/00-settings');
            });
        });

    });

    $rootScope.$on('$ionicView.afterEnter', function() {
        // Remove Spinner
        $ionicLoading.hide();
        // Any thing you can think of
        $('.image-lightbox').flipLightBox({
            type: 'image',
            when: {
                opened: function(flb) {
                    $rootScope.imgToShare = $($($(flb.cb).html()).children('.flb-front')).children('img').attr('src');
                    $('#shareFacebook').on('flbClick', function() {
                        $rootScope.socialToShare = 'Facebook';
                        console.log('Share Facebook');
                        $cordovaOauth.facebook(FACEBOOK_APP_ID, ["email", "publish_actions"]).then(function(result) {
                            // results
                            console.log("facebook login results: " + JSON.stringify(result));
                            $rootScope.fb_token = result.access_token;

                        }, function(error) {
                            // error
                            console.log("error: " + error);
                        });

                    });

                    $('#shareMail').on('flbClick', function() {
                        $rootScope.socialToShare = 'Email';
                        console.log('Share Mail');
                    });

                    $('#sharePrint').on('flbClick', function() {
                        $rootScope.socialToShare = 'Print';
                        console.log('Share Print');

                    });

                    $('.share-icon', flb.backEl).on('flbClick', {
                        flb: flb
                    }, close);

                    function close(e) {
                        e.data.flb.close();
                        $timeout(function() {
                            $rootScope.goToPage('/04-share');
                        }, 1000);
                    }
                }
            }
        });
        console.log('```` View Updated.');

    });
    // Go to page x
    $rootScope.goToPage = function(page) {
        //
        var now = new Date().getTime();
        if (now - PREV_NOW > 180 * 1000) {
            // reset
            $rootScope.startOver();
        } else {
            console.log((now - PREV_NOW)/1000);
            PREV_NOW = now;
            // Fade out
            $ionicViewSwitcher.nextDirection('forward');
            $state.go(page);
        }

    };
    // Go to settings
    $rootScope.goToSettings = function() {
        console.log('```` Auth for settings');
        // Prompt password
        Dialogs.prompt('You shall not pass...',
            function(result) {
                if (result === APP_PASSWD) {
                    // GO
                    $state.go('/00-settings');
                } else {
                    // NOT GO
                }
            });
    };
})

.config(function(
    $ionicConfigProvider,
    $httpProvider,
    $cordovaInAppBrowserProvider,
    $stateProvider,
    $urlRouterProvider,
    $sceDelegateProvider) {

    /*
	  Configurations
	*/
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
    $ionicConfigProvider.views.maxCache(0);
    $httpProvider.defaults.cache = false;
    var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
    };
    $cordovaInAppBrowserProvider.setDefaultOptions(options);

    /*
	  Routing
	*/

    $stateProvider
        .state('/00-settings', {
            url: "/00-settings",
            templateUrl: "views/00-settings.html",
            controller: 'SettingsCtrl'
        })
        .state('/01-welcome', {
            url: "/01-welcome",
            templateUrl: "views/01-welcome.html",
            controller: 'WelcomeCtrl'
        })
        .state('/02-register', {
            url: "/02-register",
            templateUrl: "views/02-register.html",
            controller: 'RegisterCtrl'
        })
        .state('/03-gallery', {
            url: "/03-gallery",
            templateUrl: "views/03-gallery.html",
            controller: 'GalleryCtrl'
        })
        .state('/04-share', {
            url: "/04-share",
            templateUrl: "views/04-share.html",
            controller: 'ShareCtrl'
        })
        .state('/05-thankyou', {
            url: "/05-thankyou",
            templateUrl: "views/05-thankyou.html",
            controller: 'ThankYouCtrl'
        });
})

// Filters

.filter('trusted', ['$sce',
    function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }
]);

Array.prototype.chunk = function(chunkSize) {
    var array = this;
    return [].concat.apply([],
        array.map(function(elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
    );
};

function getEventName() {
    return EVENT_NAME;
}

function getEventFolder() {
    return EVENT_FOLDER;
}

function getEventDisclaimer() {
    return EVENT_DISCLAIMER;
}