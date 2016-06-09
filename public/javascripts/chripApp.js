var app = angular.module('chirpApp', ['ngRoute', 'ngResource']);

app.run(function($rootScope, $http, $location){

    $rootScope.loggedIn = function(){
        $http.post('/auth/isloggedin').success(function(data){
            if (data.state == 'success'){
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            }
            else {
                $rootScope.authenticated = false;
                $rootScope.current_user = '';
                $location.path('/');
            }
        });
    };

    $rootScope.loggedIn();

    $rootScope.signout = function(){
        $http.get('/auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };

});

app.factory('postFactory', function($resource){
    // var factory = {};
    // factory.getAll() = function(){
    //     return $http.get('/api/posts');
    // }

    return $resource('/api/posts/:id');
});

app.config(function($routeProvider){
    $routeProvider
        //index display
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        //login display
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        //register display
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authController'
        });
});

app.controller('mainController', function($rootScope, $scope, postFactory){
    $scope.postLimit = 30;
    $scope.posts = postFactory.query();
    $scope.newPost = {created_by: '', text: '', created_at: ''};


    $scope.post = function(){
        $scope.newPost.created_by = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postFactory.save($scope.newPost, function(){
            $scope.posts = postFactory.query();
            $scope.newPost = {created_by: '', text: '', created_at: ''};
        });
    };
});

app.controller('authController', function($scope, $rootScope, $location, $http){
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';

    $scope.login = function(){
        $http.post('/auth/login', $scope.user).success(function(data){
            if (data.state == 'success'){
                // set $rootScope paramters
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;

                // redirect user
                $location.path('/');
            } else {
                $scope.error_message = data.message
            }

        });
    };

    $scope.register = function(){
        $http.post('/auth/signup', $scope.user).success(function(data){
            if (data.state == 'success'){
                // set $rootScope paramters
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;

                // redirect user
                $location.path('/');
            } else {
                $scope.error_message = data.message;
            }
        });
    };
});