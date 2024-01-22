using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(StoreContext context, UserManager<User> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "Wik",
                    Email = "Wik@test.pl",
                    AccountStatus = 500000 

                };
                await userManager.CreateAsync(user,"Pa$$w0rd");

                await userManager.AddToRoleAsync(user,"Member");

                 var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@test.pl"
                };
                await userManager.CreateAsync(admin,"Pa$$w0rd");

                await userManager.AddToRolesAsync(admin,new []{"Member","Admin"});

            }
            
            

            if (context.Products.Any()) return;


            var products = new List<Product>
            {
                         new Product
                {
                    Name = "Buty do biegania",
                    Description =
                        "Nasze lekkie buty do biegania nie tylko dostarczą Ci prędkości, ale także zapewnią stabilność i ochronę przed urazami, sprawiając, że każdy trening stanie się przyjemnością.",
                    Price = 20000,
                    PictureUrl = "/images/products/running_shoes.png",
                    Category = "Moda",
                    Type = "Sport",
                    QuantityInStock = 100
                },
                        new Product
                {
                    Name = "Kurtka",
                    Description =
                        "Niezależnie od warunków atmosferycznych, nasza kurtka sportowa utrzyma Cię w cieple i suchym komforcie. Projektowana z myślą o najnowszych trendach mody sportowej, to niezbędny element Twojej garderoby podczas aktywnego trybu życia.",
                    Price = 60000,
                    PictureUrl = "/images/products/jacket.png",
                    Category = "Moda",
                    Type = "Sport",
                    QuantityInStock = 100
                },
                        new Product
                {
                    Name = "Buty na Obcasie",
                    Description =
                        "Nasze buty na obcasie to nie tylko wyraz klasy, ale także gwarancja niebywałego komfortu. Odkryj doskonałe połączenie elegancji i funkcjonalności, podkreślając swój unikalny styl na każdej imprezie czy spotkaniu.",
                    Price = 45000,
                    PictureUrl = "/images/products/heels.png",
                    Category = "Moda",
                    Type = "Oficialnie",
                    QuantityInStock = 100
                },
                        new Product
                {
                    Name = "Eleganckie Buty Męskie",
                    Description =
                        "Nasze eleganckie buty męskie to połączenie klasycznego designu z nowoczesną wygodą. Niech Twój każdy krok emanuje pewnością siebie i stylem dzięki naszym doskonale wykonanym butom.",
                    Price = 20000,
                    PictureUrl = "/images/products/elegant_shoes.png",
                    Category = "Moda",
                    Type = "Oficialnie",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Krawat",
                    Description = "Nasz krawat to nie tylko dodatek do ubrania, to wyraz indywidualności. Dostępny w różnorodnych wzorach i kolorach, pozwoli Ci wyróżnić się w tłumie, dodając szyku i klasy do Twojego looku.",
                    Price = 15000,
                    PictureUrl = "/images/products/tie.png",
                    Category = "Moda",
                    Type = "Oficialnie",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Rakieta Tenisowa",
                    Description =
                        "Nasza rakieta tenisowa to idealny sprzęt dla pasjonatów tenisa. Znajdź swój rytm na korcie, korzystając z technologii i designu, które sprawią, że każdy uderzenie stanie się czystą przyjemnością.",
                    Price = 18000,
                    PictureUrl = "/images/products/Rocket.png",
                    Category = "Sport",
                    Type = "Akcesoria",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Piłka Tenisowa",
                    Description =
                        "Nasza piłka tenisowa to doskonały wybór dla graczy, którzy dążą do doskonałego odbicia. Zapewniając trwałość i wysoką widoczność, ta piłka stanie się nieodłącznym elementem Twoich treningów i meczów.",
                    Price = 30000,
                    PictureUrl = "/images/products/tennisball.png",
                    Category = "Sport",
                    Type = "Akceoria",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Smartfon",
                    Description =
                        "Nasz smartfon to nie tylko urządzenie - to centrum Twojego świata. Z doskonałą jakością ekranu, długą żywotnością baterii i funkcjami inteligentnymi, zawsze będziesz krokiem do przodu w świecie technologii mobilnej.",
                    Price = 25000,
                    PictureUrl = "/images/products/mobile.png",
                    Category = "Technologia",
                    Type = "Telefon",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Telefon Stacjonarny",
                    Description =
                        "Nasz telefon stacjonarny to idealne połączenie tradycji z nowoczesnością. Zapewniając wygodę obsługi i doskonałą jakość dźwięku, stanie się niezastąpionym narzędziem w codziennej komunikacji.",
                    Price = 12000,
                    PictureUrl = "/images/products/landline_phone.png",
                    Category = "Technologia",
                    Type = "Telefon",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Słuchawki Bezprzewodowe",
                    Description =
                            "Nasze słuchawki nauszne to idealne połączenie stylu i wydajności. Bezprzewodowe, lekkie i z długim czasem pracy baterii, zapewnią Ci swobodę i komfort podczas słuchania ulubionej muzyki.",
                    Price = 1000,
                    PictureUrl = "/images/products/headphones.png",
                    Category = "Technologia",
                    Type = "Słuchawki",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Słuchawki Bezprzewodowe Premium",
                    Description =
                            "Nasze słuchawki nauszne premium to synonim doskonałości. Zawierają najnowsze technologie audio, ergonomiczny design i wyjątkowe detale, by dostarczyć niezapomniane wrażenia muzyczne na najwyższym poziomie.",
                    Price = 8000,
                    PictureUrl = "/images/products/headphones_premium.png",
                    Category = "Technologia",
                    Type = "Słuchawki",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Słuchawki Przewodowe",
                    Description =
                        "Nasze słuchawki przewodowe to klasyka wśród audio. Prosty design, solidne połączenie i klarowny dźwięk sprawiają, że są idealnym wyborem dla tych, którzy cenią niezawodność i prostotę obsługi.",
                    Price = 1500,
                    PictureUrl = "/images/products/headphones_cable.png",
                    Category = "Technologia",
                    Type = "Słuchawki",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Lodówka",
                    Description =
                        "Nasze lodówki to nie tylko przechowywanie żywności - to rozwiązania, które łączą elegancję z innowacyjnością. Z najnowszymi technologiami chłodzenia, nasze lodówki sprawią, że utrzymanie świeżości produktów stanie się przyjemnością.",
                    Price = 1800,
                    PictureUrl = "/images/products/fridge.png",
                    Category = "Technologia",
                    Type = "AGD",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Mikrofala",
                    Description =
                        "Nasza mikrofala to nie tylko szybkość, to gwarancja równomiernego podgrzewania i smaku w każdym kęsie. Z łatwą obsługą i nowoczesnym designem, to idealny dodatek do Twojej kuchni.",
                    Price = 1500,
                    PictureUrl = "/images/products/microwave.png",
                    Category = "Technologia",
                    Type = "AGD",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Piekarnik",
                    Description =
                        "Nasz piekarnik to klucz do kulinarnej doskonałości w Twojej kuchni. Z precyzyjną kontrolą temperatury, funkcją konwekcji i eleganckim designem, pozwala na przygotowanie smacznych potraw na każdą okazję.",
                    Price = 1600,
                    PictureUrl = "/images/products/oven.png",
                    Category = "Technologia",
                    Type = "AGD",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Kuchenka gazowa",
                    Description =
                        "Nasza kuchenka gazowa to doskonałe połączenie tradycji z nowoczesnością w kuchni. Z szybkim nagrzewaniem, precyzyjną kontrolą płomienia i solidną konstrukcją, zapewni wygodę gotowania na co dzień.",
                    Price = 18000,
                    PictureUrl = "/images/products/gas.png",
                    Category = "Technologia",
                    Type = "AGD",
                    QuantityInStock = 100
                },
            };

            foreach (var product in products)
            {
                context.Products.Add(product);

            }
            context.SaveChanges();
        }
    }
}