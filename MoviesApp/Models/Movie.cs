using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesApp.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public String Title { get; set; }
        public String ImageSrc { get; set; }
        public bool Seen { get; set; }

        // Empty constructor
        public Movie()
        {
            
        }

        // Constructor with parameters
        public Movie(int id, String title, string imageSrc, bool seen)
        {
            this.Id = id;
            this.Title = title;
            this.ImageSrc = imageSrc;
            this.Seen = seen;
        }
    }
}