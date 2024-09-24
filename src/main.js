var medium = require('medium-sdk')


const mediumToken = "asdfasdfsadfsadf"

var client = new medium.MediumClient({
  clientId: 'clientId',
  clientSecret: 'YOUR_CLIENT_SECRET'
})

YOUR_AUTHORIZATION_CODE
clientId
clientSecret
var redirectURL = 'https://yoursite.com/callback/medium'; 

const mode = "secretState"

var url = client.getAuthorizationUrl(mode, redirectURL, [
  medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST
])

// (Send the user to the authorization URL to obtain an authorization code.)

const htmlContent = "markdownToHtml"

client.exchangeAuthorizationCode('YOUR_AUTHORIZATION_CODE', redirectURL, function (err, token) {
  client.getUser(function (err, user) {
    client.createPost({
      userId: user.id,
      title: 'A new post',
      contentFormat: medium.PostContentFormat.HTML,
      content: htmlContent,
      publishStatus: medium.PostPublishStatus.DRAFT
    }, function (err, post) {
      console.log(token, user, post)
    })
  })
})