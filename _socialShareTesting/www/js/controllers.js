angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $http, $cordovaOauth) {//$cordovaInAppBrowser
  // $scope.instalogin = Instagram.login();
  console.log("hit DashCtrl");
  
  var facebook_APP_ID = "385155071666492";
  var acc_token = "CAAFeSZBc66TwBAAe8lyfPyOrack8zCZCtZBGLZBHgtyczGIETNZAUh0a3LlddvhVLAvd0M8PDCkuHDrUgLjDGZADmvuZA3rGMKCpY0zIrVBUy7AAPH3kKZCGzhUBVcrr0hpbh13uPQO5XTDLeRheFqYh5ZBwL3hKYjvxuBVubPySCxxzYEvT9yMSUy7TNU0DFBweqZB6pyimVcwOhRY3Bmf3Yx";
  
      //facebook login
    $scope.facebookLogin = function(  ){
      console.log("facebookLogin clicked!  Sharing image:"+$rootScope.imgToShare);
      
      $cordovaOauth.facebook(facebook_APP_ID, ["email","publish_actions"]).then(function(result) {
        // results
          console.log("facebook login results: "+JSON.stringify(result));
          acc_token = result.access_token;
          
      }, function(error) {
          // error
          console.log("error: "+error);
      });
    }
    
    
    $scope.facebookPost = function( ){
      console.log("hit facebook POST");
      $http.get('https://graph.facebook.com/v2.2/me?access_token='+acc_token.toString()).
      
      success(function(data, status, headers, config){
        console.log("get headers: "+JSON.stringify(headers));
        console.log("get user data: "+JSON.stringify(data));
        
        var user_id = data.id;
        var msgToPost = "here's my message!!!";
        var photoToPost = "http://itchmo.com/wp-content/uploads/2007/06/p48118p.jpg";
        
        $scope.postImage(user_id, msgToPost, photoToPost);
        
      }).
      error(function(data, status, headers, config){
        console.log("error data: "+JSON.stringify(data));
        console.log("error status: "+status);
      });
    }


    $scope.postImage = function(uid, photoMessage, photoUrl){
      console.log("hit post, photoUrl: "+photoUrl);
      
      $http({
        method: "POST",
        url: 'https://graph.facebook.com/v2.2/'
          +uid+'/photos?access_token='+acc_token
          +'&url='+photoUrl
          +'&message='+photoMessage
      }).
      success( function(data){
        // alert("POST SUCCESSFUL"); 
        console.log("success on POST: "+JSON.stringify(data));
      }).
      error( function(data){
        console.log("error on POST: "+JSON.stringify(data));
      });
    }
    
    //instagram login
  // CLIENT ID	e11252468f11420f964d048283198627
  // CLIENT SECRET	460d47a6ceed4e33bb73057808b761f0
  // WEBSITE URL	http://localhost:8100
  // REDIRECT URI	http://localhost:8100/callback
    // $scope.instagramLogin = function(  ){
    //   console.log("instagramLogin clicked!  Sharing image:"+$rootScope.imgToShare);
    //   
    //   $cordovaOauth.instagram("e11252468f11420f964d048283198627", ["email"]).then(function(result) {
    //       // results
    //       console.log("ig results: "+result);
    //   }, function(error) {
    //       // error
    //       console.log("error: "+error);
    //   });
    // }  
})


.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
