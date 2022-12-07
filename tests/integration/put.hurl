POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
```This is a fragment!```

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 19

[Captures]
url: header "Location"
fragment_id: jsonpath "$.fragment.id"
fragment_updated: jsonpath "$.fragment.updated"
fragment_created: jsonpath "$.fragment.created"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 19
[Asserts]
body == "This is a fragment!"

PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
```This is a change!```

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment_id}}
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" == {{fragment_created}}
jsonpath "$.fragment.updated" != {{fragment_updated}}
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 17

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 17
[Asserts]
body == "This is a change!"
