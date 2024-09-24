# Handling Multipart/form-data and JSON Body Simultaneously in Swagger

## Define the Problem
I’m trying to upload a file using the `multipart/form-data` content type and also include a request body in the same request. 
Since `application/json` cannot coexist with `multipart/form-data`, I considered receiving the body as a string and then converting it to JSON. However, this changes the DTO in Swagger to a string, which is not ideal for me.

## Server Specification
- **Kotlin**: 1.9xx
- **Spring Boot**: 3.2xx

## Examination
There is no problem when used in the following way:

```kotlin
import com.test.dto.BodyDto

@Operation(summary = "upload file", description = "")
@PostMapping("", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
fun uploadFile(
    @RequestPart("file") file: MultipartFile,
    @PathVariable pathValue: String,
    @RequestPart(value = "body") requestJson: String,
): ResponseEntity<Nothing> {
    // Implementation
}
