using System;
using System.Linq;

namespace Northwind.Models
{
    public interface INorthwindRepository
    {
        IQueryable<Category> Categories { get; }
        IQueryable<Product> Products { get; }
        IQueryable<Discount> Discounts { get; }
        IQueryable<Customer> Customers { get; }
        IQueryable<Employee> Employees { get; }
        IQueryable<Order> Orders { get; }

        void AddCustomer(Customer customer);
        void EditCustomer(Customer customer);
        CartItem AddToCart(CartItemJSON cartItemJSON);
    }
}
