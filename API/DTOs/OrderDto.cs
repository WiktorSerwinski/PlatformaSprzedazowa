using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.Orders;

namespace API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        [Required]
        public OrderAddress Address { get; set; }

        public List<OrderedProductDto> OrderedProducts { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public long Subtotal { get; set; }

        public long DeliveryFee { get; set; }

        public string Status { get; set; }

        public long Total { get; set; }


    }
}