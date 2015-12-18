
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


    myMoviesApp.controller("MainController", ["$scope", "MoviesFactory", function ($scope, MoviesFactory) {
        $scope.movieList = [];
        MoviesFactory.getAllMovies(function (data) {
            $scope.movieList = data;
        });

    }]);

    myMoviesApp.controller("MovieController", ["$scope", "MoviesFactory", "$routeParams", function ($scope, MoviesFactory, $routeParams) {

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


        $scope.deleteMovie = function(id) {

            MoviesFactory.deleteMovie(id, function(response) {
                updateList();
            });
            
        };

        $scope.addMovie = function (obj) {

            console.log($scope.imageToUpload);

            obj.imageSrc = $scope.imageToUpload.name;
            //var obj = { 
            //    id: 999,
            //    title: "SomeTitle",
            //    imageSrc: "someurl.jpg",
            //    seen: true
            //};

            MoviesFactory.addMovie(obj, function (response) {
                if (response) {
                    MoviesFactory.uploadImage($scope.imageToUpload, function(response) {
                        console.log(response)
                    });
                }
                

                MoviesFactory.getAllMovies(function (data) {
                    $scope.movieList = data;
                });
            });

        };

        $scope.updateMovie = function (obj) {
            
            if ($scope.imageToUpload.name) {
                obj.imageSrc = $scope.imageToUpload.name;
            };
            console.log(obj);
            //var obj = { 
            //    id: objId,
            //    title: "SomeTitle",
            //    imageSrc: "someurl.jpg",
            //    seen: true
            //};

            MoviesFactory.updateMovie(obj, function (response) {
                if ($scope.imageToUpload.name) {
                    MoviesFactory.uploadImage($scope.imageToUpload, function(response) {
                        console.log(response);
                    });
                }

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