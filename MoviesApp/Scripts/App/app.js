
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
            .when("/deleteMovie/:id", {
                templateUrl: "Pages/deleteMovie.html",
                controller: "MovieController"
            })
           .when("/updateMovie/:id", {
                templateUrl: "Pages/updateMovie.html",
                controller: "MovieController"
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

    }]);

    myMoviesApp.controller("MovieController", ["$scope", "MoviesFactory", function ($scope, MoviesFactory) {

        $scope.imageToUpload = {};

        $scope.setImageToUpload = function (files) {
            $scope.imageToUpload = files[0];
        }

        $scope.movieList = [];
        function udpateMovieList()
        {
            MoviesFactory.getAllMovies(function (data) {
                $scope.movieList = data;
            });
        };
        
        

        $scope.deleteMovie = function(id) {

            MoviesFactory.deleteMovie(id, function(response) {
                updateMovieList();
            });
            
        };

        $scope.addMovie = function (obj) {

            //var obj = { 
            //    id: 999,
            //    title: "SomeTitle",
            //    imageSrc: "someurl.jpg",
            //    seen: true
            //};

            MoviesFactory.addMovie(obj, function (response) {
                MoviesFactory.getAllMovies(function (data) {
                    $scope.movieList = data;
                });
            });

        };

        $scope.updateMovie = function (obj) {

            //var obj = { 
            //    id: objId,
            //    title: "SomeTitle",
            //    imageSrc: "someurl.jpg",
            //    seen: true
            //};

            MoviesFactory.updateMovie(obj, function (response) {
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

                addMovie: function (obj, callback) {

                    $http.post("api/Movie/AddMovie/", obj)
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

                updateMovie: function (obj, callback) {

                    $http.put("api/Movie/UpdateMovie/", obj)
                        .success(function (data) {
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