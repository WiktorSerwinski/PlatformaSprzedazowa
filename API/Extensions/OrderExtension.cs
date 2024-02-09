using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.Orders;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtension
    {
        public static IQueryable<OrderDto> MapToOrderDto(this IQueryable<Order> query)
        {
            return query
                .Select(order => new OrderDto
                {
                    Id = order.Id,
                    BuyerId = order.BuyerId,
                    OrderDate = order.OrderDate,
                    Address = order.Address,
                    DeliveryFee = order.DeliveryFee,
                    Status = order.Status.ToString(),
                    Subtotal = order.Subtotal,
                    Total = order.GetTotalFee(),
                    OrderedProducts = order.OrderedItems.Select(product => new OrderedProductDto
                    {
                        ProductId = product.OrderedProduct.ProductId,
                        Name = product.OrderedProduct.Name,
                        PictureUrl = product.OrderedProduct.PictureUrl,
                        Price = product.Price,
                        Quantity = product.Quantity
                    }).ToList()
                }).AsNoTracking();
        }

    }
}