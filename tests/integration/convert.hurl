POST http://localhost:8080/v1/fragments
Content-Type: image/gif
[BasicAuth]
user1@email.com:password1
file,trav.gif;

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "image/gif"
jsonpath "$.fragment.size" isInteger

[Captures]
url: header "Location"
size:jsonpath "$.fragment.size"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/gif
Content-Length : {{size}}
[Asserts]
file,trav.gif;

GET {{url}}.png
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/png
[Asserts]
file,trav.png;

POST http://localhost:8080/v1/fragments
Content-Type: image/jpeg
[BasicAuth]
user1@email.com:password1
file,spiderverse.jpg;

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "image/jpeg"
jsonpath "$.fragment.size" isInteger

[Captures]
url: header "Location"
size:jsonpath "$.fragment.size"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/jpeg
Content-Length : {{size}}
[Asserts]
file,spiderverse.jpg;

GET {{url}}.png
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/png
[Asserts]
file,spiderverse.png;

GET {{url}}.webp
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/webp
[Asserts]
file,spiderverse.webp;



