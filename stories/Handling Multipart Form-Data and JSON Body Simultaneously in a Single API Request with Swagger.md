Handling Multipart Form-Data and JSON Body Simultaneously in a Single API Request with Swagger


To handle multipart/form-data and a JSON body simultaneously in a single API request using Swagger, follow these steps

# Multipart/form-data와 JSON 바디를 동시에 처리하기

## Define the problem
I’m trying to upload a file using the multipart/form-data content type and also include a request body in the same request.

However, since application/json cannot coexist with multipart/form-data,
I considered receiving the body as a string and then converting it to JSON. But this approach changes the DTO in Swagger to a string, which is not good for me.

So, I’m trying to solve this problem.

## Server Spec

- **Kotlin**: 1.9.x
- **Spring Boot**: 3.2.x

## Examine

There is no problem when used in the following way.


```kotlin
import com.test.dto.BodyDto

@Operation(summary = "Upload File", description = "")
@PostMapping("", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
fun uploadFile(
    @RequestPart("file") file: MultipartFile,
    @PathVariable pathValue: String,
    @RequestPart(value = "body") requestJson: String,
): ResponseEntity<Nothing> {
    // 파일 업로드 및 JSON 처리
}
```


I wanted to implement it as shown in the code below, but it results in an error.


```kotlin
import com.test.dto.BodyDto

@Operation(summary = "upload file", description = "")
@PostMapping("", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
fun uploadFile(
    @RequestPart("file") file: MultipartFile,
    @PathVariable pathValue: String,
    @RequestBody(value = "body") requestBody:BodyDto
): ResponseEntity<Nothing> {

}
```



This error occurs Content type ‘application/octet-stream’ not supported

I examined two methods to resolve the above error

1. extend AbstractJackson2HttpMessageConverter
2. swagger add schema


## Diagnose


In my case, the first method didn’t work the problem.

The second method was effective and simple, so I chose this method


```kotlin
import com.test.dto.BodyDto
@Operation(summary = "upload file", description = "")
@PostMapping("", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
fun uploadFile(
    @RequestPart("file") file: MultipartFile,
    @PathVariable pathValue: String,
    @Parameter(
        required = true,
        schema = Schema(implementation = BodyDto::class)
    )
    @RequestPart(value = "body") requestBodyAsJson: String,
): ResponseEntity<Nothing> {
val requestBody = Gson().fromJson(requestBodyAsJson, 
                              BodyDto::class.java)
}
```
 

In the swagger, set the type separately and enter it as string.
It is a method of converting to JSON format through DTO.
I can see the swagger in the object format I want as shown below.


![Description](https://img.notionusercontent.com/s3/prod-files-secure%2F6ab3efe6-44b5-4e5c-9d86-56543fb7f59d%2Fc3b86c80-eaba-4a31-971d-868a2b179849%2Ftest2.jpg/size/w=1420?exp=1727749267&sig=VX63E66yaxZvLTyfE2Db1fyK5g_lgajo6O10Oikoyq0)



## Cure

I solved the problem because the swagger’s document comes out as DTO while requesting file and body at the same time.

Your comments are always welcome. Thank you for reading

ref

https://stackoverflow.com/questions/16230291/requestpart-with-mixed-multipart-request-spring-mvc-3-2
https://github.com/swagger-api/swagger-ui/issues/6462


 