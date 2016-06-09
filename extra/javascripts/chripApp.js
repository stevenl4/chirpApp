var app = angular.module('chirpApp', []);

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
app.controller('mainController', function($scope){
    $scope.posts = [];
    $scope.newPost = {created_by: '', text: '', created_at: ''};

    $scope.post = function(){
        $scope.newPost.created_at = Date.now();
        $scope.posts.push($scope.newPost);
        $scope.newPost = {created_by: '', text: '', created_at: ''};
    };
});

app.controller('authController', function($scope){
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';

    $scope.login = function(){
        // placeholder until authentication is complete
        $scope.error_message = 'login request for ' + $scope.user.username;
    };

    $scope.register = function(){
        // placeholder until authentication is complete
        $scope.error_message = 'registration request for ' + $scope.user.username;
    };
});