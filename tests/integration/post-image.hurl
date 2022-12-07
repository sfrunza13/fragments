POST http://localhost:8080/v1/fragments
Content-Type: image/png
[BasicAuth]
user1@email.com:password1
file,dog.png;

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "image/png"
jsonpath "$.fragment.size" isInteger

[Captures]
url: header "Location"
size:jsonpath "$.fragment.size"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/png
Content-Length : {{size}}
[Asserts]
file,dog.png;

GET {{url}}.jpeg
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/jpeg
[Captures]
my_data: bytes


GET {{url}}.jpeg
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
file,dog.jpeg;

POST http://localhost:8080/v1/fragments
Content-Type: image/webp
[BasicAuth]
user1@email.com:password1
file,spiderverse.webp;

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "image/webp"
jsonpath "$.fragment.size" isInteger

[Captures]
url: header "Location"
size:jsonpath "$.fragment.size"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/webp
Content-Length : {{size}}
[Asserts]
file,spiderverse.webp;

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
