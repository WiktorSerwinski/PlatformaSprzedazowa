using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelp
{
    public class MetaData
    {
        public int currentPage { get; set; }

        public int totalPages { get; set; }

        public int pageSize { get; set; }

        public int totalCount { get; set; }

    }
}