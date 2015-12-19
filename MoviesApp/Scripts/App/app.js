
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
                controller: "MovieController"
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



    // ------ Directives ------

    myMoviesApp.directive("headerView", function() {
        return {
            templateUrl: "Pages/Partials/header.html"
        }
    });

    myMoviesApp.directive("newMovieResponse", function () {
        return {
            templateUrl: "Pages/Partials/newMovieResponse.html"
        }
    });

    myMoviesApp.directive("deleteMovieResponse", function () {
        return {
            templateUrl: "Pages/Partials/deleteMovieResponse.html"
        }
    });



    // ------ Controllers ------

    myMoviesApp.controller("MainController", ["$scope", "MoviesFactory", function ($scope, MoviesFactory) {
        $scope.movieList = [];
        MoviesFactory.getAllMovies(function (data) {
            $scope.movieList = data;
        });

    }]);

    myMoviesApp.controller("MovieController", ["$scope", "MoviesFactory", "$routeParams","$timeout","$window", function ($scope, MoviesFactory, $routeParams, $timeout, $window) {

        if ($routeParams.id) {
            $scope.movie = {};

            MoviesFactory.getMovie($routeParams.id, function(data) {
                $scope.movie = data.movie;
            });
        } else {
            $scope.movieList = [];
            $scope.updateList = function () {
                MoviesFactory.getAllMovies(function (data) {
                    $scope.movieList = data;
                });
            }();    
        }


        $scope.imageToUpload = {};

        $scope.setImageToUpload = function (files) {
            $scope.imageToUpload = files[0];
        }

        $scope.movieIsDeleted = false;

        $scope.deleteMovie = function(id) {

            MoviesFactory.deleteMovie(id, function(response) {
                $scope.movieIsDeleted = true;
                $timeout(function () {
                    $window.location.href = '/#/manageMovies';
                }, 2000);
            });            
        };

        $scope.addMovie = function (obj) {

            obj.imageSrc = $scope.imageToUpload.name;

            MoviesFactory.addMovie(obj, function (response) {

                if (response) {

                    $scope.movie = response;
                    MoviesFactory.uploadImage($scope.imageToUpload, function(response) {
                        console.log(response);
                        $timeout(function() {
                            $window.location.href = '/#/manageMovies';
                        }, 2000);
                    });
                }
            });

        };

        $scope.updateMovie = function (obj) {
            
            if ($scope.imageToUpload.name) {
                obj.imageSrc = $scope.imageToUpload.name;
            };

            MoviesFactory.updateMovie(obj, function (response) {

                if ($scope.imageToUpload.name) {
                    MoviesFactory.uploadImage($scope.imageToUpload, function(response) {
                        console.log(response);
                    });
                }
                $timeout(function () {
                    $window.location.href = '/#/manageMovies';
                }, 2000);
            });

        };

    }]);

    myMoviesApp.controller("ReviewController", ["$scope", "$routeParams","MoviesFactory", function ($scope, $routeParams, MoviesFactory) {
        movieId = $routeParams.id; 

        $scope.movie = {};
        $scope.reviewList = [];

        MoviesFactory.getMovie(movieId, function (data) {

            $scope.movie = data.movie;
            MoviesFactory.getReviews($scope.movie.id, function (response) {

                console.log(response);
                $scope.reviewList = response;
            });
        });

        $scope.addReview = function (obj) {

            obj.movieId = $scope.movie.id;
            MoviesFactory.addReview(obj, function (response) {

                console.log(response);
                $scope.movie.seen = true;
                MoviesFactory.updateMovie($scope.movie, function (response) {

                    console.log(response);
                });
            });
        };

    }]);



    // ------ Factory ------

    myMoviesApp.factory("MoviesFactory", ["$http",
        function ($http) {

            // Basic Angular AJAX methods
            var _get = function (url, callback, id) {
                if (id) {
                    url = url + id;
                }

                console.log(url);
                $http.get(url)
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (e) {
                        console.error(e);
                        $scope.error = e;
                        return null;
                    });
            };

            var _post = function(url, callback, obj) {
                $http.post(url, obj)
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function(e) {
                        console.error(e);
                        $scope.error = e;
                        return null;
                    });
            };

            var _put = function(url, callback, obj) {
                $http.put(url, obj)
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function(e) {
                        console.error(e);
                        $scope.error = e;
                        return null;
                    });
            };

            var _delete = function(url, callback, id) {
                $http.delete(url + id)
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function(e) {
                        console.error(e);
                        $scope.error = e;
                        return null;
                    });
            };

            return {

                // 

                // ---- Movies ----

                getAllMovies: function (callback) {
                    _get("api/Movie/GetAllMovies", callback);
                },

                getMovie: function(id, callback) {
                    _get("api/Movie/GetMovie/", callback, id);
                },

                deleteMovie: function (id, callback) {
                    _delete("api/Movie/DeleteMovie/", callback, id);
                },

                addMovie: function (obj, callback) {
                    _post("api/Movie/AddMovie/", callback, obj);
                },

                updateMovie: function (obj, callback) {
                    _put("api/Movie/UpdateMovie/", callback, obj);
                },

                // ---- Reviews ----

                getAllReviews: function(callback) {
                    _get("api/Review/GetAllReviews", callback);
                },

                getReviews: function(id, callback) {
                    _get("api/Review/GetReviews/", callback, id);
                },

                addReview: function (obj, callback) {
                    _post("api/Review/AddReview", callback, obj);
                },

                uploadImage: function (image, callback) {
                    
                    var formData = new FormData();
                    formData.append("file", image);
                    $http
                        .post(
                            "api/Movie/UploadImage/",
                            formData,
                            {
                                withCredentials: true,
                                headers: { "Content-Type": undefined },
                                transformRequest: angular.identity
                            }
                        )
                        .success(function (response) {
                            callback(response);
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