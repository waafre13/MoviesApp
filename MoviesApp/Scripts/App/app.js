
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
        $scope.movieList = [];
        MoviesFactory.getAllMovies(function (data) {
            $scope.movieList = data;
        });

        //API Urls

        //

    }]);

    myMoviesApp.controller("MovieController", ["$scope", "MoviesFactory", function ($scope, MoviesFactory) {

        $scope.movieList = [];
        MoviesFactory.getAllMovies(function(data) {
            $scope.movieList = data;
        });
        

        $scope.deleteMovie = function(id) {

            MoviesFactory.deleteMovie(id, function(response) {
                MoviesFactory.getAllMovies(function (data) {
                    $scope.movieList = data;
                });
            });
            
        };

        $scope.addMovie = function () {

            MoviesFactory.addMovie(function (response) {
                MoviesFactory.getAllMovies(function (data) {
                    $scope.movieList = data;
                });
            });

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

                deleteMovie: function (id, callback) {
                    $http.delete("api/Movie/DeleteMovie/"+id)
                        .success(function (data) {
                            callback(data);
                            return data;
                        })
                        .error(function (e) {
                            console.error(e);
                            $scope.error = e;
                            return null;
                        });
                },

                addMovie: function (callback) {
                    var obj = {
                        id: 999,
                        title: "SomeTitle",
                        imageSrc: "someurl.jpg",
                        seen: true
                    };

                    $http.post("api/Movie/AddMovie/", obj)
                        .success(function (data) {
                            console.log(data);
                            callback(data);
                            return data;
                        })
                        .error(function (e) {
                            console.error(e);
                            $scope.error = e;
                            return null;
                        });
                }

            };


        }
    ]);


}());