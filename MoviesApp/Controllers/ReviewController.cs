using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Xml.Linq;
using MoviesApp.Models;

namespace MoviesApp.Controllers
{
    public class ReviewController : ApiController
    {
        
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

        // Get reviews with movieId
        [HttpGet]
        public IEnumerable<XElement> GetReviews(int id)
        {

            try
            {
                XElement xmlFile = GetXmlFile();


                var reviewList = from review in xmlFile.Descendants("review")
                                where (int)review.Element("movieId") == id
                                select review;

                return reviewList;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Update Review
        [HttpPut]
        public bool UpdateReview(Review reviewObj)
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                var oldReview = (from review in xmlFile.Descendants("review")
                                where (int)review.Element("id") == reviewObj.Id
                                select review).SingleOrDefault();

                XElement newReview = new XElement("review",
                    new XElement("id", reviewObj.Id),
                    new XElement("¨movieId", reviewObj.MovieId),
                    new XElement("text", reviewObj.Text),
                    new XElement("rating", reviewObj.Rating)
                    );

                oldReview.ReplaceWith(newReview);

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewsDB.xml");
                xmlFile.Save(filepath);
                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        // Add New Review
        [HttpPost]
        public bool AddReview(Review reviewObj)
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                int newId;
                try
                {
                    newId = (int)xmlFile.Descendants("review").Max(movie => (int)movie.Element("id"));
                    newId++;
                }
                catch (Exception)
                {
                    newId = 9000;
                }


                XElement newReview = new XElement("review",
                    new XElement("id", newId),
                    new XElement("movieId", reviewObj.MovieId),
                    new XElement("text", reviewObj.Text),
                    new XElement("rating", reviewObj.Rating)
                    );

                xmlFile.Add(newReview);

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewsDB.xml");
                xmlFile.Save(filepath);

                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        // Delete Review
        [HttpDelete]
        public bool DeleteReview(int id)
        {
            try
            {
                XElement xmlFile = GetXmlFile();

                var selectedReview = (from review in xmlFile.Descendants("review")
                                where (int)review.Element("id") == id
                                select review).SingleOrDefault();

                selectedReview.Remove();

                String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewsDB.xml");
                xmlFile.Save(filepath);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        public XElement GetXmlFile()
        {
            String filepath = System.Web.Hosting.HostingEnvironment.MapPath(@"~/App_Data/reviewsDB.xml");

            return XElement.Load(filepath);
        }
    }
}
