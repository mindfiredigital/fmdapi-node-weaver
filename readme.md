# Node-DATA-API Bundler

### Base URL - https://dataapi-o2iw.onrender.com/api/dataApi

### Header

- content-type: application/json
- Authorization: Bearer Base64Encoded(<UserName:Password>)

**NOTE:** : Session Token in body is optional, if session token is provided and flag is empty/false, it will try to call API with the provided session, if provided session is not valid, it will create a new session and return it.

### body format:

```
{
    "fmServer":"<IpAddress>",
    "method":"<methodName>",
    "methodBody":{<method specific body>},
    "session":{
        "token":"<sessionToken>",
        "required":"<true/false>"
    }
}

```

## Body Examples

- ## Signin

```
{
    "fmServer":"<IpAddress>",
    "method":"signin",
    "methodBody":{
        "username":"<Username>",
        "password":"<Password>",
        "database":"KIB__Web"
    },
    "session":{
        "token":"",
        "required":""
    }

}
```

- ## Signout

```
{
    "fmServer":"<IpAddress>",
    "method":"signout",
    "methodBody":{
        "database":"DataApiTest",

    },
    "session":{
        "token":"6bbc7533af96e7c362e49c9bb54762ef8697a9994734b4487c",
        "required":"true"
    }
}
```

- ## CreateRecord

```
{
    "fmServer":"<IpAddress>",
    "method":"createRecord",
    "methodBody":{
        "database":"KIB__Web",
        "layout":"API_USER",
        "record":{
            "Name": "Varun Sharma",
            "Phone": "7873333071",
            "Address":"Newyork"
        }

    },
    "session":{
        "token":"6bbc7533af96e7c362e49c9bb54762ef8697a9994734b4487c",
        "required":""
    }
}


```

- ## GetAllRecords

```
{
    "fmServer": "<IpAddress>",
    "method": "getAllRecords",
    "methodBody": {
        "database": "KIB__Web",
        "layout": "API_USER",
        "offset":"1"

    },
    "session": {
        "token": "6bbc7533af96e7c362e49c9bb54762ef8697a9994734b4487c",
        "required": ""
    }
}
```

- ## FindRecord

```
{
    "fmServer":"<IpAddress>",
    "method":"findRecord",
    "methodBody":{
        "database":"KIB__Web",
        "layout":"API_USER",
         "offset": 0,
         "limit": 0,
         "layout.response": "string",
        "dataformats":0,
        "query":[
            {"Name": "=Basudev"},
             {"Phone" : "8658474424", "omit" : "false"}
         ],
        "sort":[
             {"fieldName": "CreationTimestamp","sortOrder": "ascend"}
         ],
        "scripts":{
            "script": "TestScript",
            "script.param": "Yashraj"
             "script.prerequest": "string",
             "script.prerequest.param": "string",
             "script.presort": "string",
             "script.presort.param": "string"
        },
         "portal": [
             "string"
         ]
    },
    "session":{
        "token":"9c786011470abf28896b5cad374989d4a0b378a0e1e381b9d4",
        "required":false
    }
}
```

---

- ## ExecuteScript

```
{
    "fmServer":"<IpAddress>",
    "method":"executeScript",
    "methodBody":{
        "database":"KIB__Web",
        "layout":"API_USER",
        "script": "TestScript",
        "param":"scriptParameter"
    },
    "session":{
        "token":"b69c863be60d6b026af17a3122956d958613039a1a885ccbd17",
        "required":""
    }
}
```

---
