using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services
{
    public class ImageService
    {
        private readonly Cloudinary _cloudinary;
        public ImageService(IConfiguration configuration)
        {
            var account = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
            
        }
        public async Task<ImageUploadResult> AddImage(IFormFile formFile)
        {
            var imageUploadResult = new ImageUploadResult();
            if (formFile.Length>0)
            {
                using var stream = formFile.OpenReadStream();
                var uploadParam = new ImageUploadParams
                {
                    File = new FileDescription(formFile.FileName,stream)
                };
                imageUploadResult = await _cloudinary.UploadAsync(uploadParam);
            }
            return imageUploadResult;

        }
        public async Task<DeletionResult> DeleteImage(string id)
        {
            var deletionParams = new DeletionParams(id);
            var imageDelResult = await _cloudinary.DestroyAsync(deletionParams);
            return imageDelResult;
        }
    }
}