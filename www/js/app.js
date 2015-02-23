/* 
 * Davinci App
 * Cordova plugins used:
 * – Device
 * – Splashscreen
 * – Statusbar
 * – Inappbrowser
 
 */
var APP_NAME = 'DAVINCIAPP';
var APP_PASSWD = 'd@v1nc1!';
var DROPBOX_FOLDER = 'Davinci_app';
var DROPBOX_TOKEN = 'kbIy1EpakoMAAAAAAADFXTEV3VQ-b_Ud-W465zpB9uUDxDH0dLBODh-xqZh9lHqC';
var EVENT_FOLDER;

angular.module(APP_NAME, [
    'ionic',
    'ngCordova',
    'slick',
    'app.controllers',
    'app.services'
])

.run(function(
    $ionicPlatform,
    $rootScope,
    $state,
    Dialogs,
    Dropbox,
    $cordovaDevice,
    $cordovaSplashscreen,
    $cordovaStatusbar) {

    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        if (window.cordova) {
            $cordovaSplashscreen.show();
            $cordovaStatusbar.show();
            localStorage['uuid'] = $cordovaDevice.getUUID();
        }
        console.log('```` App Ready');
        Dropbox.getSettings(function(result) {
            EVENT_FOLDER = result.event_folder;
            $state.go('/01-welcome');
        });
        
    });
    $rootScope.$on('$ionicView.afterEnter', function() {
        // Any thing you can think of
        if (window.cordova) {
            $cordovaSplashscreen.hide();
        }
        console.log('```` View Updated.');
    });
    // Go to page x
    $rootScope.goToPage = function(page) {
      $state.go(page);
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
    $urlRouterProvider) {

    /*
      Configurations
    */

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
});