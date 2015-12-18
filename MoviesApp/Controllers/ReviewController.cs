using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml.Linq;
using MoviesApp.Models;

namespace MoviesApp.Controllers
{
    public class ReviewController : ApiController
    {
        // Upload image
        // Get all movies
        [HttpGet]
        public IEnumerable<XElement> GetAllReviews()
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                var reviewList = from review in xmlFile.Descendants("review")
                                select review;

                return reviewList;
            }
            catch (Exception)
            {
                return null;
            }

        }

        // Get movie
        [HttpGet]
        public IEnumerable<XElement> GetReviews(int movieId)
        {

            try
            {
                XElement xmlFile = GetXmlFile();


                var reviewList = from review in xmlFile.Descendants("review")
                                where (int)review.Element("movieId") == movieId
                                select review;

                return reviewList;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Update movie
        [HttpPut]
        public bool UpdateReview(Review reviewObj)
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                var oldReview = (from review in xmlFile.Descendants("review")
                                where (int)review.Element("id") == reviewObj.Id
                                select review).SingleOrDefault();

                XElement newMovie = new XElement("movie",
                    new XElement("id", reviewObj.Id),
                    new XElement("¨movieId", reviewObj.MovieId),
                    new XElement("text", reviewObj.Text),
                    new XElement("rating", reviewObj.Rating)
                    );

                oldReview.ReplaceWith(newMovie);

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewDB.xml");
                xmlFile.Save(filepath);
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        // Add New Movie
        [HttpPost]
        public bool AddMovie(Movie movieObj)
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                int newId;
                try
                {
                    newId = (int)xmlFile.Descendants("movie").Max(movie => (int)movie.Element("id"));
                    newId++;
                }
                catch (Exception)
                {
                    newId = 1000;
                }


                XElement newMovie = new XElement("movie",
                    new XElement("id", newId),
                    new XElement("title", movieObj.Title),
                    new XElement("imageSrc", movieObj.ImageSrc),
                    new XElement("seen", movieObj.Seen)
                    );

                xmlFile.Add(newMovie);

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewDB.xml");
                xmlFile.Save(filepath);
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

                //String imgpath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/Images/"+selMovie);
                //xmlFile.Save(imgpath);

                //if (System.IO.File.Exists(imgpath))
                //{
                //    System.IO.File.Delete(imgpath);
                //}

                selMovie.Remove();

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewDB.xml");
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
                return "Yes, good stuff just happend!";
            }

            return null;
        }

        public XElement GetXmlFile()
        {
            String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewDB.xml");

            return XElement.Load(filepath);
        }
    }
}
