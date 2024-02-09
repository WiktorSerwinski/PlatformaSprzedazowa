using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.Orders;

namespace API.DTOs
{
    public class OrderCreateDto
    {
        public bool SaveAddres { get; set; }

        public OrderAddress OrderAddress { get; set; }
    }
}