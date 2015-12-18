
(function () {
    var myMoviesApp = angular.module("MyMoviesApp", ["ngRoute"]);

    myMoviesApp.config(function ($routeProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "Pages/mainPage.html",
                controller: "MainController"
            })
            .when("/viewAllMovies", {
                templateUrl: "Pages/viewAllMovies.html",
                controller: "MainController"
            })
            .when("/manageMovies", {
                templateUrl: "Pages/manageMovies.html",
                controller: "MovieController"
            })
            .when("/createNewMovie", {
                templateUrl: "Pages/createNewMovie.html",
                controller: "MainController"
            })
            .when("/reviewMovie/:id", {
                templateUrl: "Pages/reviewMovie.html",
                controller: "ReviewController"
            })
        ;

    });


    myMoviesApp.controller("MainController", ["$scope", "MoviesFactory", function ($scope, MoviesFactory) {
        $scope.test = [{ id: 1111, title: "Not yet set." }];
        MoviesFactory.getAllMovies(function (data) {
            $scope.test = data;
        });

        //API Urls

        //

    }]);

    myMoviesApp.controller("MovieController", ["$scope", "MoviesFactory", function ($scope, MoviesFactory) {

        $scope.movieList = [{ id: 408, title: "Not yet set." }];
        MoviesFactory.getAllMovies(function (data) {
            $scope.movieList = data;
        });

        function deleteMovie(id) {
            alert(id);
        };

    }]);

    myMoviesApp.controller("ReviewController", ["$scope", "$routeParams","MoviesFactory", function ($scope, $routeParams, MoviesFactory) {
        movieId = $routeParams.id; 

        $scope.movie = {};
        MoviesFactory.getMovie(movieId, function(data) {
            $scope.movie = data.movie;
        });


    }]);

    myMoviesApp.factory("MoviesFactory", ["$http",
        function ($http) {

            return {

                getAllMovies: function (callback) {
                    $http.get("api/Movie/GetAllMovies")
                        .success(function (data) {
                            callback (data);
                        })
                        .error(function (e) {
                            console.error(e);
                            $scope.error = e;
                            return false;
                        });
                },

                getMovie: function(id, callback) {
                    $http.get("api/Movie/GetMovie/"+id)
                        .success(function (data) {
                            callback(data);
                        })
                        .error(function (e) {
                            console.error(e);
                            $scope.error = e;
                            return false;
                        });
                },

                deleteMovie: function(id) {
                    $http.delete("api/Movie/DeleteMovie/"+id)
                        .success(function (data) {
                            console.debug(data);
                            return data;
                        })
                        .error(function (e) {
                            console.error(e);
                            $scope.error = e;
                            return false;
                        });
                }

            };


        }
    ]);


}());