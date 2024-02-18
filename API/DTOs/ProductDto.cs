using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [Range(1000,1000000)]
        public long Price { get; set; }

        [Required]
        public IFormFile Picture { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        [Range(0,1000)]
        public int QuantityInStock { get; set; }
      
    }
}