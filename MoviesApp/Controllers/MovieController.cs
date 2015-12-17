using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml.Linq;
using MoviesApp.Models;

namespace MyMoviesApp.Controllers
{
    public class MovieController : ApiController
    {
        // Upload image
        // Get all movies
        [HttpGet]
        public IEnumerable<XElement> GetAllMovies()
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                var movieList = from movies in xmlFile.Descendants("movie")
                                select movies;

                return movieList;
            }
            catch (Exception)
            {
                throw;
            }

        }

        // Get movie
        [HttpGet]
        public Movie GetMovie(int id)
        {

            try
            {
                XElement xmlFile = GetXmlFile();

                
                var movieObj = (from movie in xmlFile.Descendants("movie")
                                where (int)movie.Element("id") == id
                                select movie).SingleOrDefault();

                Movie selMovie = new Movie();
                selMovie.Id = (int)movieObj.Element("Id");
                selMovie.Title = (String)movieObj.Element("title");
                selMovie.ImageSrc = (String)movieObj.Element("imageSrc");
                selMovie.Seen = (bool) movieObj.Element("seen");


                return selMovie;
            }
            catch (Exception)
            {

                throw;
            }
        }

        // Update movie
        // Add New Movie
        // Delete Movie

        [HttpPost]
        public String UploadImage()
        {
            if (System.Web.HttpContext.Current.Request.Files != null)
            {
                var file = System.Web.HttpContext.Current.Request.Files[0];
                String fileName = file.FileName;

                file.SaveAs(System.Web.Hosting.HostingEnvironment.MapPath(@"~/Images/" + fileName));
            }

            return "Yes, good stuff just happend!";
        }

        public XElement GetXmlFile()
        {
            String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/moviesDB.xml");

            return XElement.Load(filepath);
        }
    }
}
