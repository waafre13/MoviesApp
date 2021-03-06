﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoviesApp.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public String Text { get; set; }
        public int Rating { get; set; }

        public Review(int id, int movieId, string text, int rating)
        {
            this.Id = id;
            this.MovieId = movieId;
            this.Text = text;
            this.Rating = rating;
        }
    }
}