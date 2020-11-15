using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Northwind.Models;

namespace Northwind.Controllers
{
    public class OrderController : Controller
    {
        private INorthwindRepository repository;
        public OrderController(INorthwindRepository repo) => repository = repo;

        [Authorize(Roles = "Employee")]
        public IActionResult Index()
        {
            return View(repository.Orders.OrderBy(o => o.RequiredDate));
        }
    }
}