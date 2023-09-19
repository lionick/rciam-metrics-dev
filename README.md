<h1 id="rciam-metrics">RCIAM Metrics v0.1.0</h1>

## Install

### Build the Python/Nodejs image
docker-compose build

### Pull the database
docker-compose pull

### Install python dependencies
docker-compose run --rm --no-deps web pip install --upgrade pip
docker-compose run --rm --no-deps web pip3 install --no-cache-dir -r requirements.txt

### Install nodejs dependencies
docker-compose run --rm --no-deps api npm install --prefer-online

### Run Database deployment
[//]: # (docker-compose run --rm web alembic revision --autogenerate -m 'Initial Migration')
docker-compose run --rm web alembic upgrade head

### Seed with test data

[//]: # (docker-compose run --rm web python app/seed.py)

### Start the Service
docker-compose up api

## API Guide


<h1 id="fastapi-users">users</h1>

## read_users_country_registered_users_country_get

<a id="opIdread_users_country_registered_users_country_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /registered_users_country?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /registered_users_country?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/registered_users_country?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/registered_users_country',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/registered_users_country', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/registered_users_country', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/registered_users_country?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/registered_users_country", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /registered_users_country`

*Read Users Country*

<h3 id="read_users_country_registered_users_country_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|startDate|query|string|false|none|
|endDate|query|string|false|none|
|tenenv_id|query|integer|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_users_country_registered_users_country_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_users_country_registered_users_country_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_users_country_groupby_registered_users_country_group_by__group_by__get

<a id="opIdread_users_country_groupby_registered_users_country_group_by__group_by__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /registered_users_country_group_by/{group_by}?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /registered_users_country_group_by/{group_by}?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/registered_users_country_group_by/{group_by}?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/registered_users_country_group_by/{group_by}',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/registered_users_country_group_by/{group_by}', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/registered_users_country_group_by/{group_by}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/registered_users_country_group_by/{group_by}?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/registered_users_country_group_by/{group_by}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /registered_users_country_group_by/{group_by}`

*Read Users Country Groupby*

<h3 id="read_users_country_groupby_registered_users_country_group_by__group_by__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|group_by|path|string|true|none|
|offset|query|integer|false|none|
|startDate|query|string|false|none|
|endDate|query|string|false|none|
|tenenv_id|query|integer|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_users_country_groupby_registered_users_country_group_by__group_by__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_users_country_groupby_registered_users_country_group_by__group_by__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_users_groupby_registered_users_groupby__group_by__get

<a id="opIdread_users_groupby_registered_users_groupby__group_by__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /registered_users_groupby/{group_by}?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /registered_users_groupby/{group_by}?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/registered_users_groupby/{group_by}?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/registered_users_groupby/{group_by}',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/registered_users_groupby/{group_by}', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/registered_users_groupby/{group_by}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/registered_users_groupby/{group_by}?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/registered_users_groupby/{group_by}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /registered_users_groupby/{group_by}`

*Read Users Groupby*

<h3 id="read_users_groupby_registered_users_groupby__group_by__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|group_by|path|string|true|none|
|offset|query|integer|false|none|
|interval|query|string|false|none|
|count_interval|query|integer|false|none|
|startDate|query|string|false|none|
|endDate|query|string|false|none|
|tenenv_id|query|integer|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_users_groupby_registered_users_groupby__group_by__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_users_groupby_registered_users_groupby__group_by__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_users_countby_registered_users_countby_get

<a id="opIdread_users_countby_registered_users_countby_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /registered_users_countby?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /registered_users_countby?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/registered_users_countby?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/registered_users_countby',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/registered_users_countby', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/registered_users_countby', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/registered_users_countby?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/registered_users_countby", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /registered_users_countby`

*Read Users Countby*

<h3 id="read_users_countby_registered_users_countby_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|interval|query|string|false|none|
|count_interval|query|integer|false|none|
|tenenv_id|query|integer|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_users_countby_registered_users_countby_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_users_countby_registered_users_countby_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="fastapi-communities">communities</h1>

## read_members_members__get

<a id="opIdread_members_members__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /members/ \
  -H 'Accept: application/json'

```

```http
GET /members/ HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/members/',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/members/',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/members/', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/members/', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/members/");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/members/", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /members/`

*Read Members*

<h3 id="read_members_members__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|

> Example responses

> 200 Response

```json
[
  {
    "community_id": 0,
    "hasheduserid": "string",
    "status": "string",
    "community_info": {
      "name": "string",
      "description": "string",
      "source": "string",
      "id": 0
    }
  }
]
```

<h3 id="read_members_members__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_members_members__get-responseschema">Response Schema</h3>

Status Code **200**

*Response Read Members Members  Get*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|Response Read Members Members  Get|[[MembersReadWithCommunityInfo](#schemamembersreadwithcommunityinfo)]|false|none|none|
|» MembersReadWithCommunityInfo|[MembersReadWithCommunityInfo](#schemamembersreadwithcommunityinfo)|false|none|none|
|»» community_id|integer|true|none|none|
|»» hasheduserid|string|true|none|none|
|»» status|string|true|none|none|
|»» community_info|[Community_InfoRead](#schemacommunity_inforead)|true|none|none|
|»»» name|string|true|none|none|
|»»» description|string|true|none|none|
|»»» source|string|true|none|none|
|»»» id|integer|true|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## read_members_bystatus_members_bystatus__get

<a id="opIdread_members_bystatus_members_bystatus__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /members_bystatus/?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /members_bystatus/?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/members_bystatus/?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/members_bystatus/',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/members_bystatus/', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/members_bystatus/', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/members_bystatus/?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/members_bystatus/", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /members_bystatus/`

*Read Members Bystatus*

<h3 id="read_members_bystatus_members_bystatus__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|community_id|query|integer|false|none|
|tenenv_id|query|integer|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_members_bystatus_members_bystatus__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_members_bystatus_members_bystatus__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_communities_communities_groupby__group_by__get

<a id="opIdread_communities_communities_groupby__group_by__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /communities_groupby/{group_by}?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /communities_groupby/{group_by}?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/communities_groupby/{group_by}?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/communities_groupby/{group_by}',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/communities_groupby/{group_by}', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/communities_groupby/{group_by}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/communities_groupby/{group_by}?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/communities_groupby/{group_by}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /communities_groupby/{group_by}`

*Read Communities*

<h3 id="read_communities_communities_groupby__group_by__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|group_by|path|string|true|none|
|offset|query|integer|false|none|
|tenenv_id|query|integer|true|none|
|interval|query|string|false|none|
|count_interval|query|integer|false|none|
|startDate|query|string|false|none|
|endDate|query|string|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_communities_communities_groupby__group_by__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_communities_communities_groupby__group_by__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_community_communities__get

<a id="opIdread_community_communities__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /communities/?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /communities/?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/communities/?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/communities/',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/communities/', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/communities/', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/communities/?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/communities/", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /communities/`

*Read Community*

<h3 id="read_community_communities__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|community_id|query|integer|false|none|
|tenenv_id|query|integer|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_community_communities__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_community_communities__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_communities_info_communities_info__get

<a id="opIdread_communities_info_communities_info__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /communities_info/ \
  -H 'Accept: application/json'

```

```http
GET /communities_info/ HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/communities_info/',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/communities_info/',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/communities_info/', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/communities_info/', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/communities_info/");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/communities_info/", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /communities_info/`

*Read Communities Info*

<h3 id="read_communities_info_communities_info__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|

> Example responses

> 200 Response

```json
[
  {
    "name": "string",
    "description": "string",
    "source": "string",
    "id": 0
  }
]
```

<h3 id="read_communities_info_communities_info__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_communities_info_communities_info__get-responseschema">Response Schema</h3>

Status Code **200**

*Response Read Communities Info Communities Info  Get*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|Response Read Communities Info Communities Info  Get|[[Community_InfoRead](#schemacommunity_inforead)]|false|none|none|
|» Community_InfoRead|[Community_InfoRead](#schemacommunity_inforead)|false|none|none|
|»» name|string|true|none|none|
|»» description|string|true|none|none|
|»» source|string|true|none|none|
|»» id|integer|true|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="fastapi-countries">countries</h1>

## read_countries_countries__get

<a id="opIdread_countries_countries__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /countries/ \
  -H 'Accept: application/json'

```

```http
GET /countries/ HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/countries/',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/countries/',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/countries/', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/countries/', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/countries/");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/countries/", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /countries/`

*Read Countries*

<h3 id="read_countries_countries__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|tag|query|string|false|none|
|skip|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "countrycode": "string",
    "country": "string",
    "id": 0
  }
]
```

<h3 id="read_countries_countries__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_countries_countries__get-responseschema">Response Schema</h3>

Status Code **200**

*Response Read Countries Countries  Get*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|Response Read Countries Countries  Get|[[Country_CodesRead](#schemacountry_codesread)]|false|none|none|
|» Country_CodesRead|[Country_CodesRead](#schemacountry_codesread)|false|none|none|
|»» countrycode|string|true|none|none|
|»» country|string|true|none|none|
|»» id|integer|true|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## read_country_stats_country_stats__get

<a id="opIdread_country_stats_country_stats__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /country_stats/ \
  -H 'Accept: application/json'

```

```http
GET /country_stats/ HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/country_stats/',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/country_stats/',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/country_stats/', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/country_stats/', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/country_stats/");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/country_stats/", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /country_stats/`

*Read Country Stats*

<h3 id="read_country_stats_country_stats__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|tag|query|string|false|none|
|skip|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "date": "2019-08-24",
    "hasheduserid": "string",
    "sourceidpid": 0,
    "serviceid": 0,
    "countryid": 0,
    "count": 0,
    "identityprovider_info": {
      "entityid": "string",
      "name": "string",
      "id": 0
    },
    "serviceprovider_info": {
      "identifier": "string",
      "name": "string",
      "id": 0
    },
    "country_info": {
      "countrycode": "string",
      "country": "string",
      "id": 0
    }
  }
]
```

<h3 id="read_country_stats_country_stats__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_country_stats_country_stats__get-responseschema">Response Schema</h3>

Status Code **200**

*Response Read Country Stats Country Stats  Get*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|Response Read Country Stats Country Stats  Get|[[Statistics_Country_HashedwithInfo](#schemastatistics_country_hashedwithinfo)]|false|none|none|
|» Statistics_Country_HashedwithInfo|[Statistics_Country_HashedwithInfo](#schemastatistics_country_hashedwithinfo)|false|none|none|
|»» date|string(date)|true|none|none|
|»» hasheduserid|string|true|none|none|
|»» sourceidpid|integer|true|none|none|
|»» serviceid|integer|true|none|none|
|»» countryid|integer|true|none|none|
|»» count|integer|true|none|none|
|»» identityprovider_info|[IdentityprovidersmapRead](#schemaidentityprovidersmapread)|false|none|none|
|»»» entityid|string|true|none|none|
|»»» name|string|true|none|none|
|»»» id|integer|true|none|none|
|»» serviceprovider_info|[ServiceprovidersmapRead](#schemaserviceprovidersmapread)|false|none|none|
|»»» identifier|string|true|none|none|
|»»» name|string|true|none|none|
|»»» id|integer|true|none|none|
|»» country_info|[Country_CodesRead](#schemacountry_codesread)|false|none|none|
|»»» countrycode|string|true|none|none|
|»»» country|string|true|none|none|
|»»» id|integer|true|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## read_country_stats_by_vo_country_stats_by_vo__community_id__get

<a id="opIdread_country_stats_by_vo_country_stats_by_vo__community_id__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /country_stats_by_vo/{community_id} \
  -H 'Accept: application/json'

```

```http
GET /country_stats_by_vo/{community_id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/country_stats_by_vo/{community_id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/country_stats_by_vo/{community_id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/country_stats_by_vo/{community_id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/country_stats_by_vo/{community_id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/country_stats_by_vo/{community_id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/country_stats_by_vo/{community_id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /country_stats_by_vo/{community_id}`

*Read Country Stats By Vo*

<h3 id="read_country_stats_by_vo_country_stats_by_vo__community_id__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|community_id|path|integer|true|none|
|offset|query|integer|false|none|
|tag|query|string|false|none|
|skip|query|boolean|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_country_stats_by_vo_country_stats_by_vo__community_id__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_country_stats_by_vo_country_stats_by_vo__community_id__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="fastapi-logins">logins</h1>

## read_logins_per_idp_logins_per_idp_get

<a id="opIdread_logins_per_idp_logins_per_idp_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /logins_per_idp?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /logins_per_idp?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/logins_per_idp?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/logins_per_idp',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/logins_per_idp', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/logins_per_idp', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/logins_per_idp?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/logins_per_idp", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /logins_per_idp`

*Read Logins Per Idp*

<h3 id="read_logins_per_idp_logins_per_idp_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|sp|query|string|false|none|
|startDate|query|string|false|none|
|endDate|query|string|false|none|
|tenenv_id|query|integer|true|none|
|unique_logins|query|boolean|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_logins_per_idp_logins_per_idp_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_logins_per_idp_logins_per_idp_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_logins_per_sp_logins_per_sp_get

<a id="opIdread_logins_per_sp_logins_per_sp_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /logins_per_sp?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /logins_per_sp?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/logins_per_sp?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/logins_per_sp',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/logins_per_sp', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/logins_per_sp', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/logins_per_sp?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/logins_per_sp", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /logins_per_sp`

*Read Logins Per Sp*

<h3 id="read_logins_per_sp_logins_per_sp_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|idp|query|string|false|none|
|startDate|query|string|false|none|
|endDate|query|string|false|none|
|tenenv_id|query|integer|true|none|
|unique_logins|query|boolean|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_logins_per_sp_logins_per_sp_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_logins_per_sp_logins_per_sp_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_logins_per_country_logins_per_country_get

<a id="opIdread_logins_per_country_logins_per_country_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /logins_per_country?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /logins_per_country?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/logins_per_country?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/logins_per_country',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/logins_per_country', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/logins_per_country', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/logins_per_country?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/logins_per_country", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /logins_per_country`

*Read Logins Per Country*

<h3 id="read_logins_per_country_logins_per_country_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|group_by|query|string|false|none|
|startDate|query|string|false|none|
|endDate|query|string|false|none|
|tenenv_id|query|integer|true|none|
|unique_logins|query|boolean|false|none|
|idpId|query|integer|false|none|
|spId|query|integer|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_logins_per_country_logins_per_country_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_logins_per_country_logins_per_country_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_logins_countby_logins_countby_get

<a id="opIdread_logins_countby_logins_countby_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /logins_countby?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /logins_countby?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/logins_countby?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/logins_countby',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/logins_countby', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/logins_countby', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/logins_countby?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/logins_countby", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /logins_countby`

*Read Logins Countby*

<h3 id="read_logins_countby_logins_countby_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|offset|query|integer|false|none|
|interval|query|string|false|none|
|count_interval|query|integer|false|none|
|tenenv_id|query|integer|true|none|
|unique_logins|query|boolean|false|none|
|idpId|query|integer|false|none|
|spId|query|integer|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_logins_countby_logins_countby_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_logins_countby_logins_countby_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_logins_groupby_logins_groupby__group_by__get

<a id="opIdread_logins_groupby_logins_groupby__group_by__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /logins_groupby/{group_by}?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /logins_groupby/{group_by}?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/logins_groupby/{group_by}?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/logins_groupby/{group_by}',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/logins_groupby/{group_by}', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/logins_groupby/{group_by}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/logins_groupby/{group_by}?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/logins_groupby/{group_by}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /logins_groupby/{group_by}`

*Read Logins Groupby*

<h3 id="read_logins_groupby_logins_groupby__group_by__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|group_by|path|string|true|none|
|offset|query|integer|false|none|
|idp|query|string|false|none|
|sp|query|string|false|none|
|tenenv_id|query|integer|true|none|
|unique_logins|query|boolean|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_logins_groupby_logins_groupby__group_by__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_logins_groupby_logins_groupby__group_by__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="fastapi-dashboard">dashboard</h1>

## read_tenenv_byname_tenenv__tenant_name___environment_name__get

<a id="opIdread_tenenv_byname_tenenv__tenant_name___environment_name__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /tenenv/{tenant_name}/{environment_name} \
  -H 'Accept: application/json'

```

```http
GET /tenenv/{tenant_name}/{environment_name} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenenv/{tenant_name}/{environment_name}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/tenenv/{tenant_name}/{environment_name}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/tenenv/{tenant_name}/{environment_name}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/tenenv/{tenant_name}/{environment_name}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/tenenv/{tenant_name}/{environment_name}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/tenenv/{tenant_name}/{environment_name}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tenenv/{tenant_name}/{environment_name}`

*Read Tenenv Byname*

<h3 id="read_tenenv_byname_tenenv__tenant_name___environment_name__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenant_name|path|string|true|none|
|environment_name|path|string|true|none|
|offset|query|integer|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_tenenv_byname_tenenv__tenant_name___environment_name__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_tenenv_byname_tenenv__tenant_name___environment_name__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_environment_byname_environment_byname__environment_name__get

<a id="opIdread_environment_byname_environment_byname__environment_name__get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /environment_byname/{environment_name} \
  -H 'Accept: application/json'

```

```http
GET /environment_byname/{environment_name} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/environment_byname/{environment_name}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/environment_byname/{environment_name}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/environment_byname/{environment_name}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/environment_byname/{environment_name}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/environment_byname/{environment_name}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/environment_byname/{environment_name}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /environment_byname/{environment_name}`

*Read Environment Byname*

<h3 id="read_environment_byname_environment_byname__environment_name__get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|environment_name|path|string|true|none|
|offset|query|integer|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_environment_byname_environment_byname__environment_name__get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_environment_byname_environment_byname__environment_name__get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_idps_idps_get

<a id="opIdread_idps_idps_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /idps?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /idps?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/idps?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/idps',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/idps', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/idps', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/idps?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/idps", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /idps`

*Read Idps*

<h3 id="read_idps_idps_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenenv_id|query|integer|true|none|
|idpId|query|integer|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_idps_idps_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_idps_idps_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## read_sps_sps_get

<a id="opIdread_sps_sps_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /sps?tenenv_id=0 \
  -H 'Accept: application/json'

```

```http
GET /sps?tenenv_id=0 HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/sps?tenenv_id=0',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/sps',
  params: {
  'tenenv_id' => 'integer'
}, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/sps', params={
  'tenenv_id': '0'
}, headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/sps', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/sps?tenenv_id=0");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/sps", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /sps`

*Read Sps*

<h3 id="read_sps_sps_get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|tenenv_id|query|integer|true|none|
|spId|query|integer|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="read_sps_sps_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="read_sps_sps_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="fastapi-ams">ams</h1>

## get_verification_ams_stats_ams_verification_hash_get

<a id="opIdget_verification_ams_stats_ams_verification_hash_get"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /ams_stats/ams_verification_hash \
  -H 'Accept: application/json'

```

```http
GET /ams_stats/ams_verification_hash HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ams_stats/ams_verification_hash',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/ams_stats/ams_verification_hash',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/ams_stats/ams_verification_hash', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/ams_stats/ams_verification_hash', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/ams_stats/ams_verification_hash");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/ams_stats/ams_verification_hash", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /ams_stats/ams_verification_hash`

*Get Verification*

> Example responses

> 200 Response

```json
null
```

<h3 id="get_verification_ams_stats_ams_verification_hash_get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|

<h3 id="get_verification_ams_stats_ams_verification_hash_get-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## get_ams_stats_ams_stats_post

<a id="opIdget_ams_stats_ams_stats_post"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /ams_stats \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: string'

```

```http
POST /ams_stats HTTP/1.1

Content-Type: application/json
Accept: application/json
Authorization: string

```

```javascript
const inputBody = 'null';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string'
};

fetch('/ams_stats',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'string'
}

result = RestClient.post '/ams_stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'string'
}

r = requests.post('/ams_stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'string',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/ams_stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/ams_stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"string"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/ams_stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /ams_stats`

*Get Ams Stats*

> Body parameter

```json
null
```

<h3 id="get_ams_stats_ams_stats_post-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|false|none|
|body|body|any|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="get_ams_stats_ams_stats_post-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful Response|Inline|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|Validation Error|[HTTPValidationError](#schemahttpvalidationerror)|

<h3 id="get_ams_stats_ams_stats_post-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Community_InfoRead">Community_InfoRead</h2>
<!-- backwards compatibility -->
<a id="schemacommunity_inforead"></a>
<a id="schema_Community_InfoRead"></a>
<a id="tocScommunity_inforead"></a>
<a id="tocscommunity_inforead"></a>

```json
{
  "name": "string",
  "description": "string",
  "source": "string",
  "id": 0
}

```

Community_InfoRead

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|description|string|true|none|none|
|source|string|true|none|none|
|id|integer|true|none|none|

<h2 id="tocS_Country_CodesRead">Country_CodesRead</h2>
<!-- backwards compatibility -->
<a id="schemacountry_codesread"></a>
<a id="schema_Country_CodesRead"></a>
<a id="tocScountry_codesread"></a>
<a id="tocscountry_codesread"></a>

```json
{
  "countrycode": "string",
  "country": "string",
  "id": 0
}

```

Country_CodesRead

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|countrycode|string|true|none|none|
|country|string|true|none|none|
|id|integer|true|none|none|

<h2 id="tocS_HTTPValidationError">HTTPValidationError</h2>
<!-- backwards compatibility -->
<a id="schemahttpvalidationerror"></a>
<a id="schema_HTTPValidationError"></a>
<a id="tocShttpvalidationerror"></a>
<a id="tocshttpvalidationerror"></a>

```json
{
  "detail": [
    {
      "loc": [
        "string"
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}

```

HTTPValidationError

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|detail|[[ValidationError](#schemavalidationerror)]|false|none|none|

<h2 id="tocS_IdentityprovidersmapRead">IdentityprovidersmapRead</h2>
<!-- backwards compatibility -->
<a id="schemaidentityprovidersmapread"></a>
<a id="schema_IdentityprovidersmapRead"></a>
<a id="tocSidentityprovidersmapread"></a>
<a id="tocsidentityprovidersmapread"></a>

```json
{
  "entityid": "string",
  "name": "string",
  "id": 0
}

```

IdentityprovidersmapRead

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|entityid|string|true|none|none|
|name|string|true|none|none|
|id|integer|true|none|none|

<h2 id="tocS_MembersReadWithCommunityInfo">MembersReadWithCommunityInfo</h2>
<!-- backwards compatibility -->
<a id="schemamembersreadwithcommunityinfo"></a>
<a id="schema_MembersReadWithCommunityInfo"></a>
<a id="tocSmembersreadwithcommunityinfo"></a>
<a id="tocsmembersreadwithcommunityinfo"></a>

```json
{
  "community_id": 0,
  "hasheduserid": "string",
  "status": "string",
  "community_info": {
    "name": "string",
    "description": "string",
    "source": "string",
    "id": 0
  }
}

```

MembersReadWithCommunityInfo

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|community_id|integer|true|none|none|
|hasheduserid|string|true|none|none|
|status|string|true|none|none|
|community_info|[Community_InfoRead](#schemacommunity_inforead)|true|none|none|

<h2 id="tocS_ServiceprovidersmapRead">ServiceprovidersmapRead</h2>
<!-- backwards compatibility -->
<a id="schemaserviceprovidersmapread"></a>
<a id="schema_ServiceprovidersmapRead"></a>
<a id="tocSserviceprovidersmapread"></a>
<a id="tocsserviceprovidersmapread"></a>

```json
{
  "identifier": "string",
  "name": "string",
  "id": 0
}

```

ServiceprovidersmapRead

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|identifier|string|true|none|none|
|name|string|true|none|none|
|id|integer|true|none|none|

<h2 id="tocS_Statistics_Country_HashedwithInfo">Statistics_Country_HashedwithInfo</h2>
<!-- backwards compatibility -->
<a id="schemastatistics_country_hashedwithinfo"></a>
<a id="schema_Statistics_Country_HashedwithInfo"></a>
<a id="tocSstatistics_country_hashedwithinfo"></a>
<a id="tocsstatistics_country_hashedwithinfo"></a>

```json
{
  "date": "2019-08-24",
  "hasheduserid": "string",
  "sourceidpid": 0,
  "serviceid": 0,
  "countryid": 0,
  "count": 0,
  "identityprovider_info": {
    "entityid": "string",
    "name": "string",
    "id": 0
  },
  "serviceprovider_info": {
    "identifier": "string",
    "name": "string",
    "id": 0
  },
  "country_info": {
    "countrycode": "string",
    "country": "string",
    "id": 0
  }
}

```

Statistics_Country_HashedwithInfo

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|date|string(date)|true|none|none|
|hasheduserid|string|true|none|none|
|sourceidpid|integer|true|none|none|
|serviceid|integer|true|none|none|
|countryid|integer|true|none|none|
|count|integer|true|none|none|
|identityprovider_info|[IdentityprovidersmapRead](#schemaidentityprovidersmapread)|false|none|none|
|serviceprovider_info|[ServiceprovidersmapRead](#schemaserviceprovidersmapread)|false|none|none|
|country_info|[Country_CodesRead](#schemacountry_codesread)|false|none|none|

<h2 id="tocS_ValidationError">ValidationError</h2>
<!-- backwards compatibility -->
<a id="schemavalidationerror"></a>
<a id="schema_ValidationError"></a>
<a id="tocSvalidationerror"></a>
<a id="tocsvalidationerror"></a>

```json
{
  "loc": [
    "string"
  ],
  "msg": "string",
  "type": "string"
}

```

ValidationError

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|loc|[anyOf]|true|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|integer|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|msg|string|true|none|none|
|type|string|true|none|none|

