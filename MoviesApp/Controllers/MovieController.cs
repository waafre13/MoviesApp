using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Instrumentation;
using System.Web.Http;
using System.Xml.Linq;
using System.Xml;
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
        public XElement GetMovie(int id)
        {

            try
            {
                XElement xmlFile = GetXmlFile();

                
                var movieObj = (from movie in xmlFile.Descendants("movie")
                                where (int)movie.Element("id") == id
                                select movie).SingleOrDefault();

                return movieObj;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Update movie
        // Add New Movie
        [HttpPost]
        public bool AddMovie(Movie movieObj)
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                var root = xmlFile.Element("movies");

                XElement newMovie = new XElement("movie");

                root.Add(newMovie);

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/moviesDB.xml");
                root.Save(filepath);
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        // Delete Movie
        [HttpDelete]
        public bool DeleteMovie(int id)
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                var selMovie = (from movie in xmlFile.Descendants("movie")
                                where (int)movie.Element("id") == id
                                select movie).SingleOrDefault();

                selMovie.Remove();

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/moviesDB.xml");
                xmlFile.Save(filepath);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

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
