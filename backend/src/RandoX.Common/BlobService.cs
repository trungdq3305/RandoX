using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RandoX.Common
{
    public class BlobService
    {
        private readonly BlobContainerClient _containerClient;

        public BlobService(IConfiguration configuration)
        {
            var connectionString = configuration["AzureBlobStorage:ConnectionString"];
            var containerName = configuration["AzureBlobStorage:ContainerName"];
            _containerClient = new BlobContainerClient(connectionString, containerName);
            _containerClient.CreateIfNotExists();
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var blobClient = _containerClient.GetBlobClient(fileName);

            var headers = new BlobHttpHeaders
            {
                ContentType = file.ContentType 
            };

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new BlobUploadOptions
                {
                    HttpHeaders = headers
                });
            }

            return blobClient.Uri.ToString();
        }

    }
}
